import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../../shared/services/config.service';
import { ToastrService } from 'ngx-toastr';
import { TaxService } from '../services/tax.service';

@Component({
  selector: 'ngx-tax-rate-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class TaxRateAddComponent implements OnInit {
  formValue = {
    country: '',
    zone: '',
    name: '',
    code: '',
    rate: '',
    compound: '',
    priority: 0,
    taxClass: ''
  }
  loadingList: boolean = false;
  codeExits: boolean = false;
  isUpdated: boolean = false;
  taxRateID: any;
  language: string = 'en'
  isUpdate: boolean = false;
  countryData: Array<any> = [];
  stateData: Array<any> = [];
  taxClassData: Array<any> = [];
  langData: Array<any> = [];
  constructor(
    private configService: ConfigService,
    private toastr: ToastrService,
    private router: Router,
    private taxService: TaxService
  ) {
    this.getCountry();
    this.getLanguages();
  }
  getLanguages() {
    this.configService.getListOfSupportedLanguages(localStorage.getItem('merchant'))
      .subscribe(data => {
        console.log(data)
        this.langData = data;
      }, error => {

      });
  }
  getCountry() {
    this.configService.getListOfCountries()
      .subscribe(data => {
        this.countryData = data;
      }, error => {

      });
  }
  onCountryChange(event) {
    this.configService.getListOfZonesProvincesByCountry(event)
      .subscribe(data => {
        this.stateData = data;
      }, error => {

      });
  }
  ngOnInit() {
    if (localStorage.getItem('rateId')) {
      this.taxRateID = localStorage.getItem('rateId')
      this.getTaxRateDetail();

      this.isUpdate = true;
    }

    this.getTaxClassList();
  }
  getTaxClassList() {

    this.taxService.getTaxClass({})
      .subscribe(data => {
        // console.log(data);
        this.taxClassData = data.items;
      }, error => {

      });
  }
  getTaxRateDetail() {
    this.loadingList = true;
    this.taxService.getTaxRateDetails(this.taxRateID, this.language)
      .subscribe(data => {
        this.loadingList = false;
        console.log(data)

        this.formValue = data;
        this.formValue.name = data.description.name
        this.onCountryChange(data.country)
      }, error => {
        this.loadingList = false;
      });
  }
  focusOutFunction() {
    this.taxService.getUniqueRate(this.formValue.code)
      .subscribe(data => {
        // console.log(data)
        this.codeExits = data.exists;
      }, error => {
        // this.source.load([]);
      });
  }

  save() {
    this.loadingList = true;
    console.log(this.formValue);
    let param = {
      code: this.formValue.code,
      country: this.formValue.country,
      descriptions: [
        { description: '', language: this.language, name: this.formValue.name }
      ],
      zone: this.formValue.zone,
      taxClass: this.formValue.taxClass,
      priority: this.formValue.priority,
      rate: this.formValue.rate

    }
    this.taxService.addTaxRate(param)
      .subscribe(res => {
        this.loadingList = false;
        this.toastr.success("Tax rate has been added successfully");
        this.router.navigate(['pages/tax-management/rate-list']);
      }, error => {
        this.loadingList = false;

      });
  }
  update() {
    this.loadingList = true;
    console.log(this.formValue)
    let param = {
      code: this.formValue.code,
      country: this.formValue.country,
      descriptions: [
        { description: '', language: this.language, name: this.formValue.name }
      ],
      zone: this.formValue.zone,
      taxClass: this.formValue.taxClass,
      priority: this.formValue.priority,
      rate: this.formValue.rate
    }
    this.taxService.updateTaxRate(this.taxRateID, param)
      .subscribe(res => {
        this.loadingList = false;
        this.toastr.success("Tax rate has been updated successfully");
        this.router.navigate(['pages/tax-management/rate-list']);
      }, error => {
        this.loadingList = false;
        this.toastr.success("Tax classes has been updated fail");
      });
  }
  goBack() {
    this.router.navigate(['pages/tax-management/rate-list']);
  }
}
