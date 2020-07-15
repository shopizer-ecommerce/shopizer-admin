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
  rightAreaItems = null;
  leftAreaLabel = "Available";
  rightAreaLabel = "Selected";

  leftAreaId = "Available";
  rightAreaId = "Selected";
  code = "code";
  label = "label";
  loadingList = false;
  expedition: boolean = false;
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

  // source: LocalDataSource = new LocalDataSource();
  settings = {
    mode: 'external',
    hideSubHeader: true,
    selectMode: 'multi',
    actions: {
      add: false,
      edit: false,
      delete: false,
      select: true
    },
    columns: {
      code: {
        title: 'Code',
        type: 'string',
      },
      name: {
        title: 'Name',
        type: 'string'
      }
    },
  };
  getStoreList() {
    this.storeService.getListOfMerchantStoreNames({ 'store': '' })
      .subscribe(res => {
        this.stores = res;
      });
  }
  getCountry() {
    this.loadingList = true;
    this.sharedService.getCountry()
      .subscribe(data => {
        this.loadingList = false;
        let value = [];
        data.forEach((item) => {
          value.push({ 'code': item.id, 'label': item.name, 'countryCode': item.code })
        });
        this.leftAreaItems = value;
      }, error => {
        this.loadingList = false;

      });
  }

  saveShipToCountries() {
    // console.log(this.expedition);
    this.sharedService.sendClickEvent();
  }
  onSelectStore(value) {
    console.log(value)
    this.sharedService.selectStore(value)
  }
}
