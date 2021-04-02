import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { StorageService } from '../../shared/services/storage.service';
import { StoreService } from '../../store-management/services/store.service';
import { TaxService } from '../services/tax.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
// import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { TranslateService } from '@ngx-translate/core';
import { error } from '@angular/compiler/src/util';
import { ShowcaseDialogComponent } from '../../shared/components/showcase-dialog/showcase-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'ngx-tax-class-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class TaxClassListComponent implements OnInit {
  @ViewChild('item', { static: false }) accordion;
  source: LocalDataSource = new LocalDataSource();
  loadingList = false;
  settings = {};
  stores: Array<any> = [];
  selectedStore: String = '';
  // paginator
  perPage = 20;
  currentPage = 1;
  totalCount;
  // roles;
  searchValue: string = '';
  isSuperAdmin: boolean;

  params = this.loadParams();

  constructor(
    private taxService: TaxService,
    private router: Router,
    private dialogService: NbDialogService,
    // private mScrollbarService: MalihuScrollbarService,
    private translate: TranslateService,
    private storageService: StorageService,
    private storeService: StoreService,
    private toastr: ToastrService
  ) {
    this.isSuperAdmin = this.storageService.getUserRoles().isSuperadmin;
    this.getStoreList();
    this.selectedStore = this.storageService.getMerchant()
  }
  getStoreList() {
    this.storeService.getListOfMerchantStoreNames({ 'store': '' })
      .subscribe(res => {

        res.forEach((store) => {
          this.stores.push({ value: store.code, label: store.code });
        });
      });
  }
  ngOnInit() {
    this.getTaxClassList();
    this.translate.onLangChange.subscribe((lang) => {
      this.params.lang = this.storageService.getLanguage();
      this.getTaxClassList();
    });

  }
  loadParams() {
    return {
      // store: this.storageService.getMerchant(),
      lang: this.storageService.getLanguage(),
      count: this.perPage,
      page: 0
    };
  }
  getTaxClassList() {
    this.params.page = this.currentPage;

    this.loadingList = true;
    this.taxService.getTaxClass(this.params)
      .subscribe(data => {
        this.loadingList = false;
        if (data.items && data.items.length !== 0) {
          this.source.load(data.items);
        } else {
          this.source.load([]);
        }
        this.totalCount = data.recordsTotal;
      }, error => {
        this.loadingList = false;
        this.source.load([]);
      });
    this.setSettings();
  }

  setSettings() {
    var me = this;
    this.settings = {
      // mode: 'external',
      hideSubHeader: true,
      actions: {
        columnTitle: this.translate.instant('ORDER.ACTIONS'),
        add: false,
        edit: false,
        delete: false,
        position: 'right',
        custom: [
          {
            name: 'edit',
            title: '<i class="nb-edit"></i>'
          },
          {
            name: 'delete',
            title: '<i class="nb-trash"></i>'
          }
        ]
      },
      pager: {
        display: false
      },
      columns: {
        id: {
          title: this.translate.instant('COMMON.ID'),
          type: 'number'
          // filterFunction(cell: any, search?: string): boolean {
          //   return true;
          // }
        },
        code: {
          title: this.translate.instant('COMMON.CODE'),
          type: 'string'
        },
        name: {
          title: this.translate.instant('COMMON.NAME'),
          type: 'string'
        }
      }
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
    this.getTaxClassList()
  }

  onSelectStore(e) {
    this.params["store"] = e;
    this.getTaxClassList();
  }
  route(event) {
    console.log(event)
    switch (event.action) {
      case 'edit':
        this.editTaxClass(event);
        // this.onEdit(event);
        break;
      case 'delete':
        this.onDelete(event);
        break;

    }
  }
  onDelete(event) {
    // console.log(data.data.id)
    this.loadingList = true;
    this.dialogService.open(ShowcaseDialogComponent, {})
      .onClose.subscribe(res => {
        if (res) {
          this.taxService.deleteTaxClass(event.data.id)
            .subscribe(result => {
              this.loadingList = false;

              this.toastr.success("Tax class has been deleted successfully");
              this.getTaxClassList();
              event.confirm.resolve();
            });
        } else {
          this.loadingList = false;
          event.confirm.reject();
        }
      });
  }
  createTaxClass() {
    localStorage.setItem('classId', '');
    this.router.navigate(['pages/tax-management/classes-add']);
  }
  editTaxClass(event) {
    localStorage.setItem('classId', event.data.code);
    this.router.navigate(['pages/tax-management/classes-add']);
  }

}
