import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalDataSource } from 'ng2-smart-table';
// import { CrudService } from '../../shared/services/crud.service';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { StoreService } from '../../store-management/services/store.service';
import { StorageService } from '../../shared/services/storage.service';
@Component({
  selector: 'shipping-config',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent {
  leftAreaItems = [];
  rightAreaItems = [];
  leftAreaLabel = "Available";
  rightAreaLabel = "Selected";

  leftAreaId = "Available";
  rightAreaId = "Selected";
  code = "code";
  label = "label";
  loadingList = false;
  expedition: boolean = false;
  taxOnShipping: boolean = false;
  stores: Array<any> = [];
  selectedStore: String = '';
  isSuperAdmin: boolean;

  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  constructor(
    private sharedService: SharedService,
    private storeService: StoreService,
    private storageService: StorageService,
  ) {
    this.getStoreList();
    this.getCountry();
    this.isSuperAdmin = this.storageService.getUserRoles().isSuperadmin;
    this.selectedStore = this.storageService.getMerchant()
  }


  fetchShipToCountries() {
    this.loadingList = true;
    this.sharedService.getExpedition(this.selectedStore)
      .subscribe(data => {
        this.expedition = data.iternationalShipping
        this.taxOnShipping = data.taxOnShipping
        this.rightAreaItems = data.shipToCountry;
        this.loadingList = false;
      }, error => {
        this.loadingList = false;

      });

  }
  getStoreList() {
    this.storeService.getListOfMerchantStoreNames({ 'store': '' })
      .subscribe(res => {
        res.forEach((store) => {
          this.stores.push({ value: store.code, label: store.code });
        });
        // this.stores = res;
      });
    this.fetchShipToCountries()
  }
  getCountry() {
    // this.loadingList = true;
    this.sharedService.getCountry()
      .subscribe(data => {
        // this.loadingList = false;
        let value = [];
        data.forEach((item) => {
          value.push({ 'code': item.id, 'label': item.name, 'countryCode': item.code })
        });
        this.leftAreaItems = value;
      }, error => {
        // this.loadingList = false;

      });
  }

  saveShipToCountries() {
    // console.log(this.expedition);
    this.sharedService.sendClickEvent();
  }
  onSelectStore(e) {
    // console.log(value)
    this.selectedStore = e.value;
    this.fetchShipToCountries();
    setTimeout(() => {
      this.sharedService.selectStore(e.value)
    }, 1000);

  }
}
