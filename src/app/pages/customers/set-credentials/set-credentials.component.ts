import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { constants } from '../../shared/classes/constants';
import { CustomersService } from '../services/customer.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-set-credentials',
  templateUrl: './set-credentials.component.html',
  styleUrls: ['./set-credentials.component.scss']
})
export class SetCredentialsComponent implements OnInit {

  form: FormGroup;
  loading = false;
  pwdPattern : string = constants.PASSWORD_PATTERN;
  customerID: any;
  errorMessage = '';
  selectedItem = '0';
  sidemenuLinks = [
    {
      id: '0',
      title: 'Set credentials',
      key: 'FORGOT_PASSWORD.RESET',
      link: 'customer/set-credentials'
    },
    {
      id: '1',
      title: 'Customer details',
      key: 'CUSTOMERS.DETAILS',
      link: 'customer/add'
    }
  ];

  customer = {
    emailAddress: ''
  }

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private customersService: CustomersService,
    private translate: TranslateService,
    public router: Router) {
      this.createForm();
   }

  ngOnInit(): void {

    if (!localStorage.getItem('customerid')) {
    }

    this.customerID = localStorage.getItem('customerid')
    this.getCustomerDetails();

  }

  private createForm() {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.pattern(this.pwdPattern)]],
      confirmNewPassword: ['', [Validators.required]],
    }, { validator: this.checkPasswords });
  }

  getCustomerDetails() {
    this.loading = true;
    this.customersService.getCustomerDetails(this.customerID)
      .subscribe(data => {

        this.loading = false;
        this.customer.emailAddress = data.emailAddress;

      });
  }

  checkPasswords(group: FormGroup) {
    const pass = group.controls.newPassword.value;
    const confirmPass = group.controls.confirmNewPassword.value;

    return pass === confirmPass ? null : { notSame: true };
  }

  get newPassword(): any {
    return this.form.get('newPassword');
  }

  get confirmNewPassword(): any {
    return this.form.get('confirmNewPassword');
  }

  onClickRoute(link) {
    this.router.navigate(['pages/' + link]);
  }
  goToback() {
    this.router.navigate(['/pages/customer/add']);
  }


  save() {
    this.loading = true;
    const obj = {
      username: this.customer.emailAddress,
      password: this.form.value.newPassword
    };
    this.customersService
      .setPassword(obj)
      .subscribe(res => {
        this.loading = false;
        this.toastr.success(this.translate.instant('USER.PASSWORD_CHANGED'));
      }, err => {
        this.loading = false;
        console.log("An error occured " + err);
        this.toastr.error(this.translate.instant('USER.PASSWORD_NOT_MATCH'));
        //this.errorMessage = this.translate.instant('USER.PASSWORD_NOT_MATCH');
      });
  }
  

}

