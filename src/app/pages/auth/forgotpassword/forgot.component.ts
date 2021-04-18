import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { Location, PlatformLocation } from '@angular/common';
// import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  errorMessage = '';
  successMessage = '';
  isSubmitted: boolean = false;
  loadingList: boolean = false;
  user = {
    email: '',
    url: ''
  }
  constructor(
    private authService: AuthService,
    private router: Router,
    // private toastr: ToastrService,
    private translate: TranslateService,
    private location: Location,
    private platformLocation: PlatformLocation
  ) {
  }

  ngOnInit() {
    console.log(this.location.prepareExternalUrl('/'));
  }
  onKeyUp() {
    this.isSubmitted = false;
  }
  goToLogin() {
    this.router.navigate(['auth']);
  }
  onSubmit() {
    this.loadingList = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitted = true;
    this.user.url = (this.platformLocation as any).location.origin + this.location.prepareExternalUrl('/')
    this.authService.forgot(this.user.email, this.user.url)
      .subscribe(res => {
        this.loadingList = false;
        this.user.email = '';
        this.successMessage = this.translate.instant('FORGOT_PASSWORD.SENT_LINK');
      }, err => {
        this.loadingList = false;
        this.errorMessage = this.translate.instant('FORGOT_PASSWORD.USER_NOT_FOUND');
      });
  }


}
