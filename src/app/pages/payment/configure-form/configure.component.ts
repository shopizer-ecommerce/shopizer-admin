import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { ConfigService } from '../../shared/services/config.service';
import { ToastrService } from 'ngx-toastr';
// import { TaxService } from '../services/tax.service';
let moneyorder = require('../services/moneyorder.json');
let paypalData = require('../services/paypal.json');
@Component({
  selector: 'ngx-payment-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss'],
})
export class ConfigureComponent implements OnInit {
  // formValue = {
  //   country: '',
  //   zone: '',
  //   name: '',
  //   code: '',
  //   rate: '',
  //   compound: '',
  //   priority: 0,
  //   taxClass: ''
  // }
  active = '';
  formData: Array<any> = [];
  loadingList: boolean = false;
  paymentType: any;

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
      ['insert', ['table', 'picture', 'link', 'video']],
      ['customButtons', ['testBtn']]
    ],
    // buttons: {
    //   'testBtn': this.customButton.bind(this)
    // },
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
  };
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,

  ) {
    // this.getCountry();
    // this.getLanguages();
  }
  ngOnInit() {
    let paymenttype = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(paymenttype);
    if (paymenttype == '1') {
      this.formData = moneyorder;
      this.paymentType = "Money Order"
    } else if (paymenttype == '2') {
      this.formData = paypalData;
      this.paymentType = "PayPal Express Checkout"
    }

  }



  save() {
    console.log(this.formData)
  }

  goBack() {
    this.router.navigate(['pages/tax-management/rate-list']);
  }
}
