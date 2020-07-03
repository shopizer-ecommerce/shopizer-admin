import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LocalDataSource } from 'ng2-smart-table';
import { StoreService } from '../services/store.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-retailer-list',
  templateUrl: './retailer-list.component.html',
  styleUrls: ['./retailer-list.component.scss']
})
export class RetailerListComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  store;
  loadingList = false;

  // paginator
  perPage = 10;
  currentPage = 1;
  totalCount;

  // server params
  params = {
    count: this.perPage,
    page: 0,
    retailer: true
  };

  settings = {};

  constructor(
    private storeService: StoreService,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.params.page = this.currentPage - 1;
    this.loadingList = true;
    this.storeService.getListOfStores(this.params)
      .subscribe(res => {
        this.totalCount = res.recordsTotal;
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
        custom: [
          {
            name: 'activate',
            title: `${this.translate.instant('COMMON.DETAILS')}`
          }
        ],
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
    this.router.navigate(['pages/store-management/store/', event.data.code]);
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
