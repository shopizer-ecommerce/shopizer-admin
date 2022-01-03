import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { StoreService } from '../services/store.service';
import { LocalDataSource } from 'ng2-smart-table';
import { TranslateService } from '@ngx-translate/core';
import { SecurityService } from '../../shared/services/security.service';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageService } from '../../shared/services/storage.service';
import { NbDialogService } from '@nebular/theme';
import { ToastrService } from 'ngx-toastr';
import { ShowcaseDialogComponent } from '../../shared/components/showcase-dialog/showcase-dialog.component';
import { ListingService } from '../../shared/services/listing.service';

@Component({
  selector: 'ngx-stores-list',
  templateUrl: './stores-list.component.html',
  styleUrls: ['./stores-list.component.scss']
})
export class StoresListComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  listingService: ListingService;
  store;
  loadingList = false;

  // paginator
  perPage = 10;
  currentPage = 1;
  totalCount;
  totalPages;
  merchant = '';
  searchValue: string = '';

  params = this.loadParams();


  settings = {};

  constructor(
    private storeService: StoreService,
    private storageService: StorageService,
    private router: Router,
    private toastr: ToastrService,
    private dialogService: NbDialogService,
    private translate: TranslateService,
    private securityService: SecurityService,
    private _sanitizer: DomSanitizer
  ) {
    this.listingService = new ListingService();
  }

  ngOnInit() {
    this.getList();

    //ng2-smart-table server side filter
    this.source.onChanged().subscribe((change) => {

      if (!this.loadingList) {//listing service
        this.listingService.filterDetect(this.params,change,this.loadList.bind(this),this.resetList.bind(this));
      }

    });

  }

  loadParams() {
    return {
      count: this.perPage,
      page: 0,
      store: ''
    };
  }


    /** callback methods for table list*/
    private loadList(newParams:any) {
      this.currentPage = 1; //back to page 1
      this.params = newParams;
      this.getList();
    }
  
    private resetList() {
      this.currentPage = 1;//back to page 1
      this.params = this.loadParams();
      this.getList();
    }

  getList() {
    const startFrom = this.currentPage - 1;
    this.merchant = localStorage.getItem('merchant');
    this.params.page = startFrom;
    this.params.store = this.merchant;
    this.loadingList = true;
    this.storeService.getListOfStores(this.params)
      .subscribe(res => {
        this.totalCount = res.recordsTotal;
        this.totalPages = res.totalPages;
        this.source.load(res.data);
        this.loadingList = false;
      });
    this.setSettings();
    this.translate.onLangChange.subscribe((event) => {
      this.setSettings();
    });
  }


  setSettings() {
    let customs = [];
    if (this.securityService.isAnAdmin()) {
      customs = [
        { name: 'details', title: '<i class="nb-edit"></i>' },
        { name: 'remove', title: this._sanitizer.bypassSecurityTrustHtml('<i class="nb-trash"></i>') }
      ]
    }

    this.settings = {
      actions: {
        columnTitle: '',
        add: false,
        edit: false,
        delete: false,
        position: 'right',
        sort: true,
        custom: customs
      },
      pager: { display: false },
      columns: {
        id: {
          filter: false,
          title: this.translate.instant('COMMON.ID'),
          type: 'number',
        },
        code: {
          filter: false,
          title: this.translate.instant('COMMON.CODE'),
          type: 'string',
        },
        retailer: {
          filter: false,
          title: this.translate.instant('COMPONENTS.RETAILER'),
          type: 'boolean',
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
    switch (event.action) {
      case 'details'://must be super admin or admin retail or admin
        if (!this.securityService.isAnAdmin()) {
        } else {
          this.router.navigate(['pages/store-management/store/', event.data.code]);
          break;
        }
      case 'remove':
        var code = event.data.code;
        var storeCode = this.storageService.getMerchant();
        if (code === storeCode) {
          this.dialogService.open(ShowcaseDialogComponent, {
            context: {
              title: '',
              text: '',
              actionText: this.translate.instant('USER_FORM.CANT_DELETE_YOUR_PROFILE')
            }
          })
        } else {
          this.dialogService.open(ShowcaseDialogComponent, {
            context: {
              title: '',
              text: event.data.name + ' ? '
            }
          })
          .onClose.subscribe(res => {
              if (res) {
                this.storeService.deleteStore(event.data.code)
                  .subscribe(data => {
                    this.toastr.success(this.translate.instant('USER_FORM.USER_REMOVED'));
                    this.getList();
                  });
              }
            });
        }
    }
  }

  // paginator

  changePage(event) {
    //console.log('Current page now' + this.currentPage);
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
      case 'onLast': {
        this.currentPage = this.totalPages;
        break;
      }
      case 'onFirst': {
        this.currentPage = 1;
        break;
      }
    }
    this.getList();
  }


}
