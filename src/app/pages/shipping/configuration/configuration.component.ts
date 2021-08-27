import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { SharedService } from '../services/shared.service';
import { StoreService } from '../../store-management/services/store.service';
import { StorageService } from '../../shared/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'shipping-config',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
})
export class ConfigurationComponent {
  leftAreaItems = [];
  rightAreaItems = [];
  leftAreaLabel = this.translate.instant('SHIPPING.COUNTRY_AVAILABLE');
  rightAreaLabel = this.translate.instant('SHIPPING.COUNTRY_SELECTED');

  leftAreaId = "Available";
  rightAreaId = "Selected";
  code = "code";
  label = "label";
  loading = false;
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
    private translate: TranslateService,
  ) {
    this.isSuperAdmin = this.storageService.getUserRoles().isSuperadmin;
    this.selectedStore = this.storageService.getMerchant()
  }


  ngOnInit() {
    this.initService();
  }

  initService() {
    this.loading = true;
    const store = localStorage.getItem('merchant');
    forkJoin([this.sharedService.getExpedition(this.selectedStore), this.storeService.getListOfMerchantStoreNames({ 'store': '' }), this.sharedService.getCountry()])
      .subscribe(([expedition, stores, countries]) => {

        this.getCountry(countries);
        this.expedition = expedition.iternationalShipping
        this.taxOnShipping = expedition.taxOnShipping
        this.rightAreaItems = expedition.shipToCountry;

        stores.forEach((store) => {
          this.stores.push({ value: store.code, label: store.code });
        });


        this.loading = false;
    });
  }

  getCountry(values) {
      values.forEach((item) => {
        this.leftAreaItems.push({ 'code': item.id, 'label': item.name, 'countryCode': item.code })
      });
  }


  saveShipToCountries() {
    this.sharedService.sendClickEvent();
  }


  onSelectStore(e) {
    this.loading = true;
    this.selectedStore = e.value;
    this.sharedService.selectStore(e.value);
    this.initService();


  }
}
