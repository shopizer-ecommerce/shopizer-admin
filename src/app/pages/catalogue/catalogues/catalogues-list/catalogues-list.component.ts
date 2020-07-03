import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../shared/services/storage.service';
import { CatalogService } from '../services/catalog.service';

@Component({
  selector: 'ngx-catalogues-list',
  templateUrl: './catalogues-list.component.html',
  styleUrls: ['./catalogues-list.component.scss']
})
export class CataloguesListComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  loadingList = false;
  settings = {};

  // paginator
  perPage = 10;
  currentPage = 1;
  totalCount;

  // request params
  params = {
    store: this.storageService.getMerchant(),
    lang: this.storageService.getLanguage(),
    count: this.perPage,
    page: 0
  };

  constructor(
    private router: Router,
    private _sanitizer: DomSanitizer,
    private dialogService: NbDialogService,
    private translate: TranslateService,
    private storageService: StorageService,
    private catalogService: CatalogService,
  ) {
  }

  ngOnInit() {
    this.getList();
    this.translate.onLangChange.subscribe((lang) => {
      this.params.lang = this.storageService.getLanguage();
      this.getList();
    });
  }

  getList() {
    this.params.page = this.currentPage - 1;
    this.loadingList = true;
    this.catalogService.getListOfCatalogues(this.params)
      .subscribe(res => {
        this.totalCount = res.recordsTotal;
        this.source.load(res.catalogs);
        this.loadingList = false;
      });
    this.setSettings();
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
      },
      pager: { display: false },
      columns: {
        id: {
          filter: false,
          title: this.translate.instant('COMMON.ID'),
          type: 'html',
          valuePrepareFunction: (id) => {
            return `<a href="#/pages/catalogue/catalogues/catalogue/${id}">${id}</a>`;
          }
        },
        code: {
          title: this.translate.instant('COMMON.CODE'),
          type: 'string',
        },
        store: {
          title: this.translate.instant('COMPONENTS.STORE'),
          type: 'string',
          valuePrepareFunction: (store) => {
            if (store) {
              return store.code;
            }
          }
        },
        creationDate: {
          title: this.translate.instant('COMMON.CREATION_DATE'),
          type: 'string',
        }
      },
    };
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
      case 'onFirst': {
        this.currentPage = 1;
        break;
      }
      case 'onLast': {
        this.currentPage = event.data;
        break;
      }
    }
    this.getList();
  }

}
