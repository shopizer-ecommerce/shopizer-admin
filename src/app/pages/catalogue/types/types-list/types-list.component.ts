import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../shared/services/storage.service';
import { StoreService } from '../../../store-management/services/store.service';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../../shared/components/showcase-dialog/showcase-dialog.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TypesService } from '../services/types.service';
import { LocalDataSource } from 'ng2-smart-table';
import { ListingService } from '../../../shared/services/listing.service';

@Component({
  selector: 'ngx-types-list',
  templateUrl: './types-list.component.html',
  styleUrls: ['./types-list.component.scss']
})
export class TypesListComponent implements OnInit {

  source: LocalDataSource = new LocalDataSource();
  listingService: ListingService;
  perPage = 15;
  totalCount = 0;
  loadingList = false;
  settings = {};
  stores: Array<any> = [];
  params = this.loadParams();
  currentPage = 1;
  types = [];

  constructor(
    private _sanitizer: DomSanitizer,
    private translate: TranslateService,
    private router: Router,
    private dialogService: NbDialogService,
    private toastr: ToastrService,
    private storageService: StorageService,
    private storeService: StoreService,
    private typesService: TypesService,
  ) {
    this.listingService = new ListingService();
  }

  loadParams() {
    return {
      store: this.storageService.getMerchant(),
      lang: this.storageService.getLanguage(),
      count: this.perPage,
      page: 0
    };
  }

  ngOnInit(): void {

    this.setSettings();
    this.getStoreList();
    this.getList();
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
      pager: {
        display: false
      },
      columns: {
        id: {
          filter: false,
          title: this.translate.instant('COMMON.ID'),
          type: 'number',
        },
        store: {
          title: this.translate.instant('STORE.MERCHANT_STORE'),
          type: 'string',
          filter: false,
        },
        code: {
          title: this.translate.instant('COMMON.CODE'),
          type: 'string',
          filter: true,
        },
      },
    };
  }

  getList() {
    this.loadingList = true;
    this.params.page = this.currentPage - 1;
    this.typesService.getListOfTypes(this.params).subscribe((res) => {
      //console.log(JSON.stringify(res));
      this.totalCount = res.recordsTotal;
      this.types = [...res.list];
      this.source.load(this.types);
      this.loadingList = false;
    });
    this.setSettings();
    this.translate.onLangChange.subscribe((lang) => {
      this.setSettings();
    });
  }

  private loadList(newParams: any) {
    this.currentPage = 1; //back to page 1
    this.params = newParams;
    this.getList();
  }

  private resetList() {
    this.currentPage = 1;//back to page 1
    this.params = this.loadParams();
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


  deleteRecord(event) {
    this.dialogService.open(ShowcaseDialogComponent, {})
      .onClose.subscribe(res => {
        if (res) {

          this.typesService.deleteType(event.data.id)
            .subscribe(result => {
              this.toastr.success(this.translate.instant('OPTION.OPTION_REMOVED'));
              this.getList();
            });

        } else {
          // TODO navigate generic error
          // event.confirm.reject();
        }
      });
  }


  onSelectStore(e) {
    this.params["store"] = e;
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
    this.router.navigate(['/pages/catalogue/types/type/' + event.data.id]);
  }

}
