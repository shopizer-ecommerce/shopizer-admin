import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';
import { UserService } from '../../shared/services/user.service';
import { delay } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  errorMessage = '';
  showPass = 0;
  isSubmitted = false;
  loading = false;
  user = {
    email: '',
    password: ''
  }
  isRemember: Boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService,
    private userService: UserService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {

    document.getElementsByTagName('body')[0].className += ' nb-theme-corporate';
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    if (localStorage.getItem('isRemember') === 'true') {
      this.isRemember = true;
      let loginEmail = localStorage.getItem('loginEmail')
      this.form.patchValue({
        username: loginEmail
      });

    }
  }

  passwordType() {
    return this.showPass;
  }

  showPassword() {
    if (this.showPass == 0) {
      this.showPass = 1;
    }
    else {
      this.showPass = 0;
    }
  }

  get formControls() {
    return this.form.controls;
  }

  onSubmit() {
    //console.log(this.form.value);
    this.loading = true;
    this.isSubmitted = true;
    if (this.form.invalid) {
      //this.getFormValidationErrors();
      return;
    }


    this.errorMessage = '';
    const formData = this.form.value;

    this.authService.login(formData.username, formData.password)
      .subscribe(res => {
        this.tokenService.saveToken(res.token);
        this.userService.saveUserId(res.id);
        this.userService.getUserProfile()
          .subscribe(user => {
            this.userService.checkForAccess(user.groups);
            localStorage.setItem('roles', JSON.stringify(this.userService.roles));
            localStorage.setItem('merchant', user.merchant);
            delay(1000);
            if (this.isRemember) {
              localStorage.setItem('loginEmail', formData.username)
            } else {
              localStorage.setItem('loginEmail', '')
            }
            this.router.navigate(['pages']);
            this.loading = false;
          }, err => {
            this.toastr.error(err.error.message);
            this.loading = false;
          });
      }, err => {
        if (err.status === 0) {
          this.errorMessage = this.translate.instant('COMMON.INTERNAL_SERVER_ERROR');
        } else {
          this.errorMessage = this.translate.instant('LOGIN.INVALID_DATA');
        }
        this.loading = false;
      });
  }
  onCheckRemember(e) {
    //console.log(e.target.checked)
    this.isRemember = e.target.checked;
    if (e.target.checked) {
      localStorage.setItem('isRemember', 'true')
    } else {
      localStorage.setItem('isRemember', 'false')
    }
  }

  getFormValidationErrors() {
    Object.keys(this.form.controls).forEach(key => {

      const controlErrors: ValidationErrors = this.form.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }

  onClickForgotPassword() {
    this.router.navigate(['auth/forgot-password']);
  }

  onClickRegister() {
    this.router.navigate(['auth/register']);
  }

}
