import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  errorMessage = '';
  passwordType = 0;
  newPasswordType = 0;
  user = {
    password: '',
    newpassword: ''
  }
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {

  }

  showPassword() {
    if (this.passwordType == 0) {
      this.passwordType = 1;
    }
    else {
      this.passwordType = 0;
    }
  }
  showNewPassword() {
    if (this.newPasswordType == 0) {
      this.newPasswordType = 1;
    }
    else {
      this.newPasswordType = 0;
    }
  }

}
