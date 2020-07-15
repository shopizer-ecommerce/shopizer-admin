import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CrudService } from '../../shared/services/crud.service';
import { ShippingOriginReq } from '../models/ShippingOriginReq';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from './../../shared/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { StoreService } from '../../store-management/services/store.service';



@Component({
  selector: 'ngx-origin',
  templateUrl: './origin.component.html',
  styleUrls: ['./origin.component.scss']
})
export class OriginComponent implements OnInit {
  shipOriginForm = {
    address: '',
    city: '',
    country: '',
    stateProvince: '',
    postalCode: ''
  }
  // shipOriginForm = new FormGroup({
  //   address: new FormControl('', [Validators.required]),
  //   cityName: new FormControl('', [Validators.required]),
  //   countryName: new FormControl('', [Validators.required]),
  //   stateName: new FormControl('', [Validators.required]),
  //   postalCode: new FormControl('', [Validators.required])
  // });
  // shippingOriginReq: ShippingOriginReq;
  isSubmitted: boolean = false;
  countries = [];
  states = [];
  // store: string;
  stores: Array<any> = [];
  selectedStore: String = '';
  isSuperAdmin: boolean;
  constructor(private crudService: CrudService,
    private toastr: ToastrService,
    private translate: TranslateService,

    private storeService: StoreService,
    private storageService: StorageService
  ) {
    this.isSuperAdmin = this.storageService.getUserRoles().isSuperadmin;
    this.selectedStore = this.storageService.getMerchant()
  }

  ngOnInit() {
    this.storeService.getListOfMerchantStoreNames({ 'store': '' })
      .subscribe(res => {
        this.stores = res;
      });
    this.getShippingOrigin();

  }
  onCountryChange(e) {
    this.getState(1);
  }


  onSubmit() {
    // this.isSubmitted = true;
    // if (!this.shipOriginForm.valid) {
    //   return false;
    // } else {
    //   this.shippingOriginReq = new ShippingOriginReq(this.shipOriginForm.value.address,
    //     this.shipOriginForm.value.cityName,
    //     this.shipOriginForm.value.countryName,
    //     this.shipOriginForm.value.stateName,
    //     this.shipOriginForm.value.postalCode);
    //   this.crudService.post('/v1/private/origin?store=' + this.store, this.shippingOriginReq).subscribe(res => {
    //     this.toastr.success(this.translate.instant('SHIPPING.ORIGIN_UPDATE'));
    //   });
    // }

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
  getState(flag) {
    this.crudService.get('/v1/zones?code=' + this.shipOriginForm.country)
      .subscribe(data => {

        if (data.length > 0) {
          data.forEach((item) => {
            this.states.push({ 'code': item.id, 'label': item.name, 'stateCode': item.code })
          });
          if (flag == 1) {
            this.shipOriginForm.stateProvince = data[0].code;
          }
        } else {
          this.states = data;
          this.shipOriginForm.stateProvince = '';
        }
      }, error => {
      });
  }

  getShippingOrigin() {
    this.crudService.get('/v1/private/shipping/origin?store=' + this.selectedStore)
      .subscribe(data => {
        this.shipOriginForm = data;
        // this.shipOriginForm.get('address').setValue(data.address);
        // this.shipOriginForm.get('cityName').setValue(data.city);
        // this.shipOriginForm.get('countryName').setValue(data.country);
        // this.shipOriginForm.get('stateName').setValue(data.stateProvince);
        // this.shipOriginForm.get('postalCode').setValue(data.postalCode);
        // this.getCountry();
        // this.getState();
      }, error => {
      });
    this.getCountry();
    this.getState(0);
  }


}
