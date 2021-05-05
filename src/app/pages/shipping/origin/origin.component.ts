import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { CrudService } from '../../shared/services/crud.service';
import { ShippingOriginReq } from '../models/ShippingOriginReq';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from './../../shared/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { StoreService } from '../../store-management/services/store.service';
import { SharedService } from '../services/shared.service';


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
  visible: any;
  loadingList: boolean = false;
  countries = [];
  states = [];
  stores: Array<any> = [];
  selectedStore: String = '';
  isSuperAdmin: boolean;
  constructor(
    // private crudService: CrudService,
    private sharedService: SharedService,
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
        res.forEach((store) => {
          this.stores.push({ value: store.code, label: store.code });
        });
        // this.stores = res;
      });
    this.getShippingOrigin();

  }
  onCountryChange(e) {
    this.getState(1);
  }


  onSubmit() {
    this.loadingList = true;

    let param = {
      address: this.shipOriginForm.address,
      city: this.shipOriginForm.city,
      postalCode: this.shipOriginForm.postalCode,
      country: this.shipOriginForm.country,
      stateProvince: this.shipOriginForm.stateProvince
    };
    this.sharedService.saveOrigin(this.selectedStore, param)
      .subscribe(res => {
        localStorage.setItem('originActive', this.visible)
        this.loadingList = false;
        this.toastr.success(this.translate.instant('SHIPPING.ORIGIN_UPDATE'));
      }, error => {
        this.loadingList = false;
      });

  }

  getCountry() {
    this.sharedService.getCountries()
      .subscribe(data => {
        data.forEach((item) => {
          this.countries.push({ 'code': item.id, 'label': item.name, 'countryCode': item.code })
        });
      }, error => {
      });
  }
  getState(flag) {
    this.sharedService.getStates(this.shipOriginForm.country)
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

    this.loadingList = true;
    this.sharedService.getShippingOrigin(this.selectedStore)
      .subscribe(data => {
        this.loadingList = false;
        this.shipOriginForm = data;
        // console.log(localStorage.getItem('originActive'));
        this.visible = localStorage.getItem('originActive') == 'true' ? true : false
        this.getCountry();
        this.getState(0);
      }, error => {
        this.loadingList = false;
        this.shipOriginForm = {
          address: '',
          city: '',
          country: '',
          stateProvince: '',
          postalCode: ''
        }
        this.getCountry();
        this.getState(0);
      });

  }
  onSelectStore(e) {
    this.selectedStore = e.value;
    this.getShippingOrigin()
  }

}
