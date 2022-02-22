import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { CategoryService } from '../services/category.service';
import { ConfigService } from '../../../shared/services/config.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { StoreService } from '../../../store-management/services/store.service';
import { StorageService } from '../../../shared/services/storage.service';
import { SecurityService } from '../../../shared/services/security.service';
import { validators } from '../../../shared/validation/validators';
import { slugify } from '../../../shared/utils/slugifying';
import { ImageBrowserComponent } from '../../../../@theme/components/image-browser/image-browser.component';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'ngx-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  @Input() category: any;
  form: FormGroup;
  //category
  roots = [];

  perPage = 100;
  //supported languages
  languages = [];
  //default language
  defaultLanguage = localStorage.getItem('lang');
  //select store
  stores = [];
  isSuperAdmin = false;
  isRetailAdmin = false;
  //roles;
  //current user associated merchant
  merchant;

  //inline editor
  editorConfig = {
    placeholder: '',
    tabsize: 2,
    height: 300,
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'link', 'video']],
      ['customButtons', ['testBtn']]
    ],
    buttons: {
      'testBtn': this.customButton.bind(this)
    },
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
  };
  //loader image
  loader = false;
  loading = false;

  //category code must be unique
  isCodeUnique = true;

  params = this.loadParams();

  loadParams() {
    return {
      lang: this.storageService.getLanguage(),
      store: this.storageService.getMerchant(),
      count: this.perPage,
      page: 0
    };
  }

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private configService: ConfigService,
    private storeService: StoreService,
    private storageService: StorageService,
    private securityService: SecurityService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private dialogService: NbDialogService
  ) {
    //this.roles = JSON.parse(localStorage.getItem('roles'));
  }

  ngOnInit() {

    this.isSuperAdmin = this.securityService.isSuperAdmin();
    this.isRetailAdmin = this.securityService.isRetailAdmin();
    this.merchant = this.storageService.getMerchant();
    //for populating stores dropdown list
    this.storeService.getListOfMerchantStoreNames({ 'store': '' })
      .subscribe(res => {
        this.stores = res;
      });

    //for selecting parent category - root or child of a parent
    this.categoryService.getListOfCategories(this.params)
      .subscribe(res => {
        res.categories.push({ id: 0, code: 'root', children: [] });
        res.categories.forEach((el) => {
          this.getChildren(el);
        });
        this.roots.sort((a, b) => {
          if (a.code < b.code)
            return -1;
          if (a.code > b.code)
            return 1;
          return 0;
        });
        //this.roots = [...res.categories];
        //console.log(JSON.stringify(this.roots));
      });
    this.loader = true;
 
    //determines how many languages should be supported
    this.configService.getListOfSupportedLanguages(localStorage.getItem('merchant'))
      .subscribe(res => {
        this.languages = [...res];
        this.createForm();
        this.addFormArray();
        this.fillEmptyForm();
        if (this.category.id) {
          this.fillForm();
        }
        this.loader = false;
      });
  }

  getChildren(node) {
    if(node.id === this.category.id) return;
    if (node.children && node.children.length !== 0) {
      this.roots.push(node);
      node.children.forEach((el) => {
        this.getChildren(el);
      });
    } else {
      this.roots.push(node);
    }
  }

  private createForm() {
    this.form = this.fb.group({
      parent: ['root', [Validators.required]],
      store: [this.merchant],
      visible: [false],
      code: ['', [Validators.required, Validators.pattern(validators.alphanumericwithhyphen)]],
      sortOrder: [0, [Validators.required, Validators.pattern(validators.number)]],
      selectedLanguage: ['', [Validators.required]],
      descriptions: this.fb.array([]),
    });
    if (!this.isSuperAdmin) {
      this.form.get("store").disable();
    }
  }

  addFormArray() {
    const control = <FormArray>this.form.controls.descriptions;
    this.languages.forEach(lang => {
      control.push(
        this.fb.group({
          language: [lang.code, [Validators.required]],
          name: ['', [Validators.required]],
          highlights: [''],
          friendlyUrl: ['', [Validators.required]],
          description: [''],
          title: [''],
          metaDescription: [''],
        })
      );
    });
  }

  fillEmptyForm() {
    this.form.patchValue({
      store: this.merchant,
      sortOrder: 0,
      selectedLanguage: this.defaultLanguage,
      descriptions: [],
    });

  }

  fillForm() {
    this.form.patchValue({
      parent: this.category.parent === null ? 'root' : this.category.parent.code,
      store: this.category.store,
      visible: this.category.visible,
      code: this.category.code,
      sortOrder: this.category.sortOrder,
      selectedLanguage: this.defaultLanguage,
      descriptions: [],
    });
    this.fillFormArray();
  }

  fillFormArray() {
    //each supported language
    this.form.value.descriptions.forEach((desc, index) => {
      if(this.category != null && this.category.descriptions) {
        this.category.descriptions.forEach((description) => {
          if (desc.language === description.language) {
            //6 fields + language
            (<FormArray>this.form.get('descriptions')).at(index).patchValue({
              language: description.language,
              name: description.name,
              highlights: description.highlights,
              friendlyUrl: description.friendlyUrl,
              description: description.description,
              title: description.title,
              metaDescription: description.metaDescription,
            });
          }
        });
      }
    });
  }

  get code() {
    return this.form.get('code');
  }

  get selectedLanguage() {
    return this.form.get('selectedLanguage');
  }

  get descriptions(): FormArray {
    return <FormArray>this.form.get('descriptions');
  }

  get titles(): FormArray {
    return <FormArray>this.form.get('titles');
  }

  get names(): FormArray {
    return <FormArray>this.form.get('names');
  }

  selectLanguage(lang) {
    this.form.patchValue({
      selectedLanguage: lang,
    });
  }

  changeName(event, index) {
    
    (<FormArray>this.form.get('descriptions')).at(index).patchValue({
      friendlyUrl: slugify(event)
    });

  }

  //determines if category code is unique
  checkCode(event) {
    const code = event.target.value;
    this.categoryService.checkCategoryCode(code)
      .subscribe(res => {
        this.isCodeUnique = !(res.exists && (this.category.code !== code));
      });
  }

  private prepareSaveData() {
    const data = this.form.value;
    const category = this.roots.find((el) => el.code === data.parent);
    data.parent = { id: category.id, code: category.code };

    return data;
  }

  save() {
    this.loading = true;
    const categoryObject = this.prepareSaveData();

    if (!this.isSuperAdmin) {
      this.form.patchValue({ store: this.merchant });
    }

    /**
     * TODO put in utility
     */
    const tmpObj = {
      name: '',
      friendlyUrl: ''
    };
    categoryObject.descriptions.forEach((el) => {
      if (tmpObj.name === '' && el.name !== '') {
        tmpObj.name = el.name;
      }
      if (tmpObj.friendlyUrl === '' && el.friendlyUrl !== '') {
        tmpObj.friendlyUrl = el.friendlyUrl;
      }
      for (const elKey in el) {
        if (el.hasOwnProperty(elKey)) {
          if (!tmpObj.hasOwnProperty(elKey) && el[elKey] !== '') {
            tmpObj[elKey] = el[elKey];
          }
        }
      }
    });

    // check required fields
    if (tmpObj.name === '' || tmpObj.friendlyUrl === '' || categoryObject.code === '') {
      this.toastr.error(this.translate.instant('COMMON.FILL_REQUIRED_FIELDS'));
    } else {
      categoryObject.descriptions.forEach((el) => {
        // fill empty fields
        for (const elKey in el) {
          if (el.hasOwnProperty(elKey)) {
            if (el[elKey] === '' && tmpObj[elKey] !== '') {
              el[elKey] = tmpObj[elKey];
            }
          }
        }
      });
      // check for undefined
      categoryObject.descriptions.forEach(el => {
        for (const elKey in el) {
          if (el.hasOwnProperty(elKey)) {
            el.name = el.name.trim(); // trim name
            if (typeof el[elKey] === 'undefined') {
              el[elKey] = '';
            }
          }
        }
      });

      if (!this.isCodeUnique) {
        this.toastr.error(this.translate.instant('COMMON.CODE_EXISTS'));
        this.loading = false;
        return;
      }

      let errors = this.findInvalidControls();
      if (errors.length > 0) {
        this.toastr.error(this.translate.instant('COMMON.FILL_REQUIRED_FIELDS'));
        this.loading = false;
        return;
      }
      //for debugging
      //console.log(JSON.stringify(categoryObject));
      //return;

      if (this.category.id) {
        this.categoryService.updateCategory(this.category.id, categoryObject)
          .subscribe(result => {
            this.loading = false;
            this.toastr.success(this.translate.instant('CATEGORY_FORM.CATEGORY_UPDATED'));
          });
      } else {
        this.categoryService.addCategory(categoryObject)
          .subscribe(result => {
            this.loading = false;
            this.toastr.success(this.translate.instant('CATEGORY_FORM.CATEGORY_CREATED'));
            this.router.navigate(['pages/catalogue/categories/categories-list']);
          });
      }
    }
  }

  public findInvalidControls(): string[] {
    var invalidControls: string[] = [];
    let recursiveFunc = (form: FormGroup | FormArray) => {
      Object.keys(form.controls).forEach(field => {
        const control = form.get(field);
        if (control.invalid) invalidControls.push(field);
        if (control instanceof FormGroup) {
          recursiveFunc(control);
        } else if (control instanceof FormArray) {
          recursiveFunc(control);
        }
      });
    }
    recursiveFunc(this.form);
    //console.log('Invalids ' + invalidControls);
    return invalidControls;
  }
  customButton(context) {
    const me = this;
    const ui = $.summernote.ui;
    const button = ui.button({
      contents: '<i class="note-icon-picture"></i>',
      tooltip: 'Gallery',
      container: '.note-editor',
      className: 'note-btn',
      click: function () {
        //console.log(me);
        me.dialogService.open(ImageBrowserComponent, {}).onClose.subscribe(name => name && context.invoke('editor.pasteHTML', '<img src="' + name + '">'));
      }
    });
    return button.render();
  }
  goToback() {
    this.router.navigate(['pages/catalogue/categories/categories-list']);
  }
}
