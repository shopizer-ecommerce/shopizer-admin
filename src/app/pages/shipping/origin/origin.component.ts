import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CrudService } from '../../shared/services/crud.service';
import { ShippingOriginReq } from '../models/ShippingOriginReq';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from './../../shared/services/storage.service';
import { TranslateService } from '@ngx-translate/core';




@Component({
  selector: 'ngx-origin',
  templateUrl: './origin.component.html',
  styleUrls: ['./origin.component.scss']
})
export class OriginComponent implements OnInit {

  shipOriginForm = new FormGroup({
    address: new FormControl('', [Validators.required]),
    cityName: new FormControl('', [Validators.required]),
    countryName: new FormControl('', [Validators.required]),
    stateName: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required])
  });
  shippingOriginReq: ShippingOriginReq;
  isSubmitted: boolean = false;
  countries = [];
  states = [];
  store: string;

  constructor(private crudService: CrudService, private toastr: ToastrService, private translate: TranslateService, private storageService: StorageService) { }

  ngOnInit() {
    this.store = this.storageService.getMerchant();
    this.getShippingOrigin();

  }
  // convenience getter for easy access to form fields
  get f() { return this.shipOriginForm.controls; }
  // Choose city using select dropdown
  changeCountry(e) {
    console.log(e.value)
    this.shipOriginForm.get('countryName').setValue(e.target.value);
    if (this.shipOriginForm.value.countryName != '') {

      this.getState();
    }
  }

  changeState(e) {
    this.shipOriginForm.get('stateName').setValue(e.target.value);
  }

  onSubmit() {
    this.isSubmitted = true;
    if (!this.shipOriginForm.valid) {
      return false;
    } else {
      this.shippingOriginReq = new ShippingOriginReq(this.shipOriginForm.value.address,
        this.shipOriginForm.value.cityName,
        this.shipOriginForm.value.countryName,
        this.shipOriginForm.value.stateName,
        this.shipOriginForm.value.postalCode);
      this.crudService.post('/v1/private/origin?store=' + this.store, this.shippingOriginReq).subscribe(res => {
        this.toastr.success(this.translate.instant('SHIPPING.ORIGIN_UPDATE'));
      });
    }

  }

  getCountry() {
    this.crudService.get('/v1/country')
      .subscribe(data => {
        data.forEach((item) => {
          this.countries.push({ 'code': item.id, 'label': item.name, 'countryCode': item.code })
        });
      }, error => {
      });
  }
  getState() {
    this.crudService.get('/v1/zones?code=' + this.shipOriginForm.value.countryName)
      .subscribe(data => {
        data.forEach((item) => {
          this.states.push({ 'code': item.id, 'label': item.name, 'stateCode': item.code })
        });
      }, error => {
      });
  }

  getShippingOrigin() {
    this.crudService.get('/v1/private/origin?store=' + this.store)
      .subscribe(data => {
        this.shipOriginForm.get('address').setValue(data.address);
        this.shipOriginForm.get('cityName').setValue(data.city);
        this.shipOriginForm.get('countryName').setValue(data.country);
        this.shipOriginForm.get('stateName').setValue(data.stateProvince);
        this.shipOriginForm.get('postalCode').setValue(data.postalCode);
        this.getCountry();
        this.getState();
      }, error => {
      });
  }


}
