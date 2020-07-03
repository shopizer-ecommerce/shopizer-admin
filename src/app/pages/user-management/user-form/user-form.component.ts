import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, UrlTree, UrlSegment, UrlSegmentGroup, PRIMARY_OUTLET} from '@angular/router';

import { ConfigService } from '../../shared/services/config.service';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { StoreService } from '../../store-management/services/store.service';
import { SecurityService } from '../../shared/services/security.service';
import { StorageService } from '../../shared/services/storage.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'ngx-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  form: FormGroup;
  
  private _user: User;

  @Input()
  set user(user: User) {
    this._user = user;
  }

  get user(): User { return this._user; }

  languages = [];
  groups = [];
  canRemove = true;
  canEdit = true;
  selfEdit = false;
  pwdPattern = '^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{6,12}$';
  emailPattern = '^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$';
  stores = [];
  tree: UrlTree;
  store = null;
  isEmailUnique = true;

  // user's roles
  roles;
  // rules for user's group
  rules = {
    'ADMIN_RETAIL': {
      rules: [
        { key: 'ADMIN_STORE', checked: false, disabled: true },
        { key: 'ADMIN_RETAIL', checked: false, disabled: false }
      ]
    },
    'ADMIN_STORE': {
      rules: [
        { key: 'ADMIN_STORE', checked: false, disabled: false },
        { key: 'ADMIN_RETAIL', checked: false, disabled: true }
      ]
    }
  };
  isEmaillUnique = true;
  loader = false;

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private userService: UserService,
    private storeService: StoreService,
    private storageService: StorageService,
    private securityService: SecurityService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.roles = JSON.parse(localStorage.getItem('roles'));
  }

  ngOnInit() {

    //remove user
    this._user && this._user.id === +this.userService.getUserId() ? this.canRemove=false:this.canRemove=true
    this.selfEdit = this._user && this._user.id === +this.userService.getUserId();

    //don't show remove when creating a new user
    if(!this._user ) {
      this.canRemove = false;
    }

    if(this._user) {
      this._user.groups.forEach((uGroup) => {
        if (uGroup['name'] === 'SUPERADMIN') {
          this.canRemove = false;
          this.canEdit = true;
        }
      });
    }

    
    this.loader = true;
    this.createForm();

    this.store = this.storageService.getMerchant();
    const languages = this.configService.getMerchantListOfSupportedLanguages();
    const groups$ = this.configService.getListOfGroups();
    const stores$ = this.storeService.getListOfMerchantStoreNames({'store':this.store});
    forkJoin(groups$, stores$).subscribe(([groups, stores]) => {
      // fill languages
      this.languages = [...languages];

      //current store
      //console.log('Current store -> ' + this.store);
      //*br1* only superadmin and retailer admin can see all stores
      //*br2* if store has child, can view childs also when not superadmin

      // fill stores
      this.stores = [...stores];

      //console.log('List stores -> ' + JSON.stringify(this.stores));

      //from the list select current store
      let uStore = this.stores.find(s => s.code === this.store);
      //console.log('Selected store -> ' + uStore.code);

      //const uStore = this.stores.find((this.store) => store.code === this.form.value.store);
      this.chooseMerchant(this.store);
      //*br2* not activated

      //console.log(this.roles);
      
      (this.roles.isSuperadmin || this.roles.isAdminRetail) ?
      this.form.controls['store'].enable() : this.form.controls['store'].disable();

      console.log('User is admin retail ' + this.securityService.isRetailAdmin());
      
      
      // fill groups
      groups.forEach((el) => {
        el.checked = false;
        el.disabled = false;
        if(el.name === 'SUPERADMIN') {
          el.disabled = true;
        }
        if(el.name === 'ADMIN_RETAIL') {
          if(this.securityService.hasRetailAdminRole()) {
            el.disabled = true;
          }
        }
        if(el.name === 'ADMIN') {
          if(this.securityService.hasAdminRole()) {
            el.disabled = true;
          }
        }

      });
      this.groups = [...groups];
      if (this._user) {
        const roleRetail = this._user.groups.find((el: any) => el.name === 'ADMIN_RETAIL');
        const roleStore = this._user.groups.find((el: any) => el.name === 'ADMIN_STORE');
        if (roleRetail) {
          this.checkRules(roleRetail['name']);
        } else if (roleStore) {
          this.checkRules(roleStore['name']);
        }
        this._user.groups.forEach((uGroup) => {
          this.groups.forEach((group) => {
            //console.log('Looking at group ' + group.name);
            if(group.name === 'SUPERADMIN') {
              group.disabled = true;
            }
            //check this group if usr has it
            if (uGroup['name'] === group.name) {
              group.checked = true;
              group.disabled = false;
            }
            //self can't edit its groups
            if(this.selfEdit) {//self cannot edit its own group
              group.disabled = true;
            }
          });
        });
        this.fillForm();
      }
      this.loader = false;
    });
  }

  private createForm() {
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      store: [''],
      userName: [''],
      emailAddress: ['', [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required, Validators.pattern(this.pwdPattern)]],
      active: [false],
      defaultLanguage: ['', [Validators.required]],
      groups: [[]],
    });
  }

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get emailAddress() {
    return this.form.get('emailAddress');
  }

  get password() {
    return this.form.get('password');
  }

  get defaultLanguage() {
    return this.form.get('defaultLanguage');
  }

  get userGroups() {
    return this.form.get('groups');
  }

  fillForm() {
    this.form.get('password').clearValidators();
    this.form.patchValue({
      firstName: this._user.firstName,
      lastName: this._user.lastName,
      store: this._user.merchant,
      userName: '',
      password: '',
      emailAddress: this._user.emailAddress,
      active: this._user.active,
      defaultLanguage: this._user.defaultLanguage,
      groups: [...this._user.groups],
    });
    (this.roles.isSuperadmin || this.roles.isRetailerAdmin) ?
      this.form.controls['store'].enable() : this.form.controls['store'].disable();
    this.cdr.detectChanges();
    this.findInvalidControls();
  }

  save() {
    var store = this.form.value.store;
    if(!store) {
      store = this.store;
    }
    if (this.form.value.store === '' && (this.roles.isSuperadmin || this.roles.isRetailerAdmin)) {
      this.toastr.error(this.translate.instant('USER_FORM.STORE_REQUIRED'));
      return;
    }

    if(!this.form.value.store && this.user) {
      store = this.user.merchant;
    }

    if (!this.isEmaillUnique) {
      this.toastr.error(this.translate.instant('USER_FORM.EMAIL_EXISTS'));
      return;
    }
    const newGroups = [];
    this.groups.forEach((el) => {
      if (el.checked) {
        newGroups.push({ id: el.id, name: el.name });
      }
    });
    this.form.patchValue({ groups: newGroups });
    this.form.patchValue({ userName: this.form.value.emailAddress });
    if (this.form.value.groups.length === 0) {
      this.toastr.warning(this.translate.instant('COMMON.ADDING_USER_GROUPS_ERROR'));
      return;
    }
    if (this._user && this._user.id) {
      this.userService.updateUser(+this._user.id, this.form.value, store)
        .subscribe(res => {
          this.toastr.success(this.translate.instant('USER_FORM.USER_UPDATED'));
        });
    } else {
      console.log(this.form.value);
      this.userService.createUser(this.form.value, store)
        .subscribe(res => {
          this.toastr.success(this.translate.instant('USER_FORM.USER_CREATED'));
          this.router.navigate(['pages/user-management/users']);
        });
    }
  }

  remove() {

    var store = this.user.merchant;

    this.userService.deleteUser(this._user.id, store)
      .subscribe(res => {
        this.toastr.success(this.translate.instant('USER_FORM.USER_REMOVED'));
        this.router.navigate(['pages/user-management/users']);
      });
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    //console.log('Invalid fields ' + invalid);
    //console.log('Form valid ' + this.form.invalid);
  }

  chooseMerchant(merchant) {
    this.store = merchant;
    //this.checkRules(role);
  }

  checkEmail(event) {
    const email = event.target.value;
    const store = (this.form.value && this.form.value.store) || (this._user && this._user.merchant);
    if (email !== '') {
      this.userService.checkIfUserExist({ unique: email, merchant: store })
        .subscribe(res => {
          if (this._user && this._user.emailAddress === email) {
            this.isEmaillUnique = true;
          } else {
            this.isEmaillUnique = !res.exists;
          }
        });
    } else {
      this.isEmaillUnique = true;
    }
  }

  checkRules(role) {
    console.log('Role name ' + role);
    if (this.rules[role].rules.length !== 0) {
      this.rules[role].rules.forEach((el) => {
        this.groups.forEach((group) => {
          if (el.key === group.name) {
            group.checked = el.checked;
            group.disabled = el.disabled;
          }
        });
      });
    }
  }

}
