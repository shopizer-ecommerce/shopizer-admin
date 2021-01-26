import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { ConfigService } from '../../shared/services/config.service';
import { ToastrService } from 'ngx-toastr';
// import { TaxService } from '../services/tax.service';
let canadapost = require('../services/canadapost.json');
let upsData = require('../services/ups.json');
let customRulesData = require('../services/customrules.json');
let storePickUpData = require('../services/storepickup.json');
// let braintreeData = require('../services/braintree.json');
@Component({
  selector: 'ngx-shipping-configure',
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss'],
})
export class ShippingConfigureComponent implements OnInit {

  active = '';
  formData: Array<any> = [];
  loadingList: boolean = false;
  shippingType: any;

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
    let type = this.activatedRoute.snapshot.paramMap.get('id');
    if (type == 'canadapost') {
      this.formData = canadapost;
      this.shippingType = "Canada Post";
    }
    else if (type == 'ups') {
      this.formData = upsData;
      this.shippingType = "UPS";
    }
    else if (type == 'customQuotesRules') {
      this.formData = customRulesData;
      this.shippingType = 'Shipping by Fresh Organics '
    }
    else if (type == 'priceByDistance') {
      this.formData = customRulesData;
      this.shippingType = 'Shipping by Fresh Organics'
    }
    else if (type == 'storePickUp') {
      this.formData = storePickUpData;
      this.shippingType = 'Store Pick Up'
    }

  }

  save() {
    console.log(this.formData)
    let param = {};
    this.formData.map((value) => {
      param[value.name] = value.value
    });
    console.log(param)
  }

  goBack() {
    this.router.navigate(['pages/shipping/methods']);
  }
}
