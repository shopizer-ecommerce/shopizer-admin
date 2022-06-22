import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  
  private _user: User;

  get user(): User { return this._user; }
  form: FormGroup;
  loader = false;
  //user: User;
  pwdPattern = '^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{6,12}$';
  errorMessage = '';
  selfEdit = true;
  selectedItem = '1';
  sidemenuLinks = [
    {
      id: '0',
      title: 'COMPONENTS.MY_PROFILE',
      key: 'COMPONENTS.MY_PROFILE',
      link: '/pages/user-management/profile',
    },
    {
      id: '1',
      title: 'COMPONENTS.CHANGE_PASSWORD',
      key: 'COMPONENTS.CHANGE_PASSWORD',
      link: '/pages/user-management/change-password',
    }
  ];

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.userService.getUserProfile()
      .subscribe(user => {
        this._user = user;
      }); 
  }

  private createForm() {
    this.form = this.fb.group({
      password: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.pattern(this.pwdPattern)]],
      confirmNewPassword: ['', [Validators.required]],
    }, { validator: this.checkPasswords });
  }

  get password(): any {
    return this.form.get('password');
  }

  get newPassword(): any {
    return this.form.get('newPassword');
  }

  get confirmNewPassword(): any {
    return this.form.get('confirmNewPassword');
  }

  checkPasswords(group: FormGroup) {
    const pass = group.controls.newPassword.value;
    const confirmPass = group.controls.confirmNewPassword.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  goToProfile() {
    this.router.navigate(['pages/user-management/profile']);
  }

  route(link) {
    this.router.navigate([link]);
  }

  save() {
    this.loader = true;
    const passwords = {
      changePassword: this.form.value.newPassword,
      password: this.form.value.password
    };
    this.userService.updatePassword(this.userService.getUserId(), passwords)
      .subscribe(res => {
        this.loader = false;
        this.toastr.success(this.translate.instant('USER.PASSWORD_CHANGED'));
      }, err => {
        this.errorMessage = this.translate.instant('USER.PASSWORD_NOT_MATCH');
      });
  }

}
