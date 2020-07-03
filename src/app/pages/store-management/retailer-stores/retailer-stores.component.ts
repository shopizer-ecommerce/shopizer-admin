import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StoreService } from '../services/store.service';
import { LocalDataSource } from 'ng2-smart-table';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-retailer-stores',
  templateUrl: './retailer-stores.component.html',
  styleUrls: ['./retailer-stores.component.scss']
})
export class RetailerStoresComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  retailer;
  loadingList = false;

  // paginator
  perPage = 10;
  currentPage = 1;
  totalCount;

  // server params
  params = {
    length: this.perPage,
    start: 0
  };

  settings = {};

  constructor(
    private storeService: StoreService,
    private router: Router,
    private translate: TranslateService,
  ) {
  }

  ngOnInit() {
    this.getList();
  }

  getList() {
    const startFrom = (this.currentPage - 1) * this.perPage;
    this.params.start = startFrom;
    this.loadingList = true;
    
    //this.storeService.getListOfMerchantStores({count: 10000}).subscribe(res => {
    this.storeService.getListOfMerchantStoreNames('').subscribe(res => {
      this.totalCount = res.totalPages;
      this.source.load(res.data);
      this.loadingList = false;
    });
    this.setSettings();
    this.translate.onLangChange.subscribe((event) => {
      this.setSettings();
    });
  }

  setSettings() {
    this.settings = {
      actions: {
        columnTitle: '',
        add: false,
        edit: false,
        delete: false,
        position: 'right',
        sort: true,
        // uncomment if need redirect to store page
        // custom: [
        //   {
        //     name: 'activate',
        //     title: `${this.translate.instant('COMMON.DETAILS')}`
        //   }
        // ],
      },
      pager: { display: false },
      columns: {
        id: {
          title: this.translate.instant('COMMON.ID'),
          type: 'number',
        },
        name: {
          title: this.translate.instant('COMMON.STORE_NAME'),
          type: 'string',
        },
        email: {
          title: this.translate.instant('COMMON.EMAIL_ADDRESS'),
          type: 'string',
        }
      },
    };
  }

  route(event) {
    // add logic if need redirect to store page
  }

  // paginator
  changePage(event) {
    switch (event.action) {
      case 'onPage': {
        this.currentPage = event.data;
        break;
      }
      case 'onPrev': {
        this.currentPage--;
        break;
      }
      case 'onNext': {
        this.currentPage++;
        break;
      }
    }
    this.getList();
  }

}
