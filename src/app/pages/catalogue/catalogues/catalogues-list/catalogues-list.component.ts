import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../shared/services/storage.service';
import { CatalogService } from '../services/catalog.service';
import { StoreService } from '../../../store-management/services/store.service';
import { ShowcaseDialogComponent } from '../../../shared/components/showcase-dialog/showcase-dialog.component';

@Component({
  selector: 'ngx-catalogues-list',
  templateUrl: './catalogues-list.component.html',
  styleUrls: ['./catalogues-list.component.scss']
})
export class CataloguesListComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  loadingList = false;
  settings = {};
  stores: Array<any> = [];

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
    private storeService: StoreService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    this.getStoreList();
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
        console.log(res)
        this.source.load(res.items);
        this.loadingList = false;
      });
    this.setSettings();
  }

  getStoreList() {
    this.storeService.getListOfMerchantStoreNames({ 'store': '' })
      .subscribe(res => {
        res.forEach((store) => {
          this.stores.push({ value: store.code, label: store.code });
        });
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
          { name: 'edit', title: '<i class="nb-edit"></i>' },
          { name: 'remove', title: this._sanitizer.bypassSecurityTrustHtml('<i class="nb-trash"></i>') }
        ],
      },
      pager: { display: false },
      columns: {
        id: {
          filter: false,
          title: this.translate.instant('COMMON.ID'),
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

  onSelectStore(e) {
    this.params["store"] = e;
    this.getList();
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

  onClickAction(event) {
    switch (event.action) {
      case 'edit':
        this.onEdit(event);
        break;
      case 'remove':
        this.deleteRecord(event)
        break
    }
  }
  onEdit(event) {
    this.router.navigate(['/pages/catalogue/catalogues/catalogue/' + event.data.id]);
  }

  deleteRecord(event) {
    this.dialogService.open(ShowcaseDialogComponent, {})
      .onClose.subscribe(res => {
        if (res) {
          this.catalogService.deleteCatalog(event.data.id)
            .subscribe(result => {
              this.toastr.success(this.translate.instant('CATALOG.CATALOG_REMOVED'));
              this.getList();
            });

        } else {
          // TODO navigate generic error
          // event.confirm.reject();
        }
      });
  }

}
