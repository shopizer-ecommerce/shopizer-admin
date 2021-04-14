import { Component, OnInit } from '@angular/core';

import { Location, PlatformLocation } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
// import { TokenService } from '../services/token.service';
// import { UserService } from '../../shared/services/user.service';
// import { delay } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from '../../shared/services/config.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  showPass = 0;
  isCodeUnique = false;
  errorMessage: string = '';
  successMessage: string = '';
  user = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: '',
    name: '',
    code: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    state: ''
  }
  countries: Array<any> = [];
  provinces: Array<any> = [];
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    // private tokenService: TokenService,
    // private userService: UserService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private configService: ConfigService,
    private location: Location,
    private platformLocation: PlatformLocation
  ) {
    this.configService.getListOfCountries()
      .subscribe(data => {
        this.countries = data;
      }, error => {

      });
  }
  countryIsSelected(code) {
    this.provinces = [];
    // this.stateProvince.disable();
    this.configService.getListOfZonesProvincesByCountry(code)
      .subscribe(provinces => {
        this.provinces = [...provinces];
      }, error1 => {
        this.toastr.success(this.translate.instant('STORE_FORM.ERROR_STATE_PROVINCE'));
      });
  }
  ngOnInit() {


  }
  checkCode(event) {
    const code = event.target.value;
    this.authService.checkIfStoreExist(code)
      .subscribe(res => {
        console.log(res);
        this.isCodeUnique = res.exists;
      });
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

  onRegister() {
    let param = {
      "address": this.user.address,
      "city": this.user.city,
      "code": this.user.code,
      "country": this.user.country,
      "email": this.user.email,
      "firstName": this.user.firstName,
      "lastName": this.user.lastName,
      "name": this.user.name,
      "password": this.user.password,
      "postalCode": this.user.postalCode,
      "repeatPassword": this.user.repeatPassword,
      "stateProvince": this.user.state,
      "url": (this.platformLocation as any).location.origin + this.location.prepareExternalUrl('/')

    }
    this.authService.register(param)
      .subscribe(res => {
        console.log(res);
        this.errorMessage = ""
        this.successMessage = "Your account is created successfully and email has been sent to " + this.user.email + " with details on completing the new store signup"
        this.user = {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          repeatPassword: '',
          name: '',
          code: '',
          address: '',
          city: '',
          postalCode: '',
          country: '',
          state: ''
        }

      }, err => {
        console.log(err);
        if (err.status === 0) {
          this.errorMessage = this.translate.instant('COMMON.INTERNAL_SERVER_ERROR');
        } else {
          this.errorMessage = err.error.message;
        }

      });
  }
  onClickLogin() {
    this.router.navigate(['auth']);
  }

}
