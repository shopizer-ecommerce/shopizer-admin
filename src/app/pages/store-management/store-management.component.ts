import { Component, DoCheck, OnInit, Input } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../shared/services/storage.service';

@Component({
  selector: 'ngx-store-management',
  templateUrl: './store-management.component.html',
  styleUrls: ['./store-management.component.scss']
})
export class StoreManagementComponent implements OnInit, DoCheck {
  path = 'Store';
  sidemenuTitle = 'Merchant store';
  sidemenuValue = 'DEFAULT';
  showSide = true;
  /**
  sidemenuLinks = [
    {
      title: 'Store branding',
      key: 'COMPONENTS.STORE_BRANDING',
      link: 'store-branding'
    },
    {
      title: 'Store home page',
      key: 'COMPONENTS.STORE_LANDING',
      link: 'store-landing'
    },
    {
      title: 'Store details',
      key: 'COMPONENTS.STORE_DETAILS',
      link: 'store'
    }
  ];
  **/


  constructor(
    private translate: TranslateService,
    private storageService: StorageService
  ) {
    //this.sidemenuValue = this.storageService.getMerchant();
    //this.translateArray(this.sidemenuLinks);
    //this.translate.onLangChange.subscribe((event) => {
    //  this.translateArray(this.sidemenuLinks);
    //});
  }

  ngOnInit() {

  }

  /**
  translateArray(array) {
    array.forEach((el) => {
      el.title = this.translate.instant(el.key);
    });
  }
  */

  ngDoCheck() {
    this.showSide = window.location.hash.indexOf('stores-list') === -1 &&
      window.location.hash.indexOf('retailer') === -1;
  }

}
