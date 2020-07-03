import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { LocalDataSource } from 'ng2-smart-table';
import { ProductService } from '../../services/product.service';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { InventoryService } from '../../services/inventory.service';
import { ShowcaseDialogComponent } from '../../../../shared/components/showcase-dialog/showcase-dialog.component';
import { StorageService } from '../../../../shared/services/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-manage-inventory',
  templateUrl: './manage-inventory.component.html',
  styleUrls: ['./manage-inventory.component.scss']
})
export class ManageInventoryComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  loadingList = false;
  stores = [];
  product;
  productId;

  // paginator
  perPage = 10;
  currentPage = 1;
  totalCount;

  // server params
  params = {
    count: this.perPage,
    page: 0,
    lang: this.storageService.getLanguage(),
  };
  settings = {};

  constructor(
    private productService: ProductService,
    private dialogService: NbDialogService,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private inventoryService: InventoryService,
    private _sanitizer: DomSanitizer,
    private router: Router,
    private storageService: StorageService,
    private toastr: ToastrService,
  ) {
    this.productId = this.activatedRoute.snapshot.paramMap.get('productId');
    this.productService.getProductById(this.productId).subscribe(product => {
      this.product = product;
    });
  }

  ngOnInit() {
    this.getList();
    this.translate.onLangChange.subscribe((lang) => {
      this.params.lang = this.storageService.getLanguage();
      this.getList();
    });
  }

  getList() {
    this.loadingList = true;
    const id = (this.product && this.product.id) || this.productId;
    this.params.page = this.currentPage - 1;
    this.inventoryService.getListOfInventories(id, this.params)
      .subscribe(res => {
        this.totalCount = res.recordsTotal;
        this.source.load(res.inventory);
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
        custom: [
          { name: 'details', title: `${this.translate.instant('COMMON.EDIT')}` },
          { name: 'remove', title: this._sanitizer.bypassSecurityTrustHtml('<i class="fas fa-trash-alt"></i>') }
        ],
      },
      pager: { display: false },
      columns: {
        store: {
          title: this.translate.instant('INVENTORY.INVENTORY_STORE'),
          type: 'string',
          editable: false,
          valuePrepareFunction: (store) => {
            return store.code;
          }
        },
        owner: {
          title: this.translate.instant('INVENTORY.INVENTORY_OWNER'),
          type: 'string',
          editable: false,
          valuePrepareFunction: (owner) => {
            return owner ? owner : 'null';
          }
        },
        quantity: {
          title: this.translate.instant('PRODUCT.QTY'),
          type: 'number',
          editable: true
        },
        prices: {
          title: this.translate.instant('PRODUCT.PRICE'),
          type: 'string',
          editable: true,
          valuePrepareFunction: (prices) => {
            return (prices.length && prices[0].originalPrice) ? prices[0].originalPrice : 'null';
          }
        },
        creationDate: {
          title: this.translate.instant('PRODUCT.CREATION_DATE'),
          type: 'string',
          editable: false
        },
      },
    };
  }

  route(event) {
    switch (event.action) {
      case 'details':
        this.router.navigate([`pages/catalogue/products/${this.product.id}/inventory/${event.data.id}`]);
        break;
      case 'remove':
        this.dialogService.open(ShowcaseDialogComponent, {})
          .onClose.subscribe(res => {
          if (res) {
            this.inventoryService.deleteProduct(event.data.id)
              .subscribe((data) => {
                this.toastr.success(this.translate.instant('INVENTORY.INVENTORY_REMOVED'));
                this.getList();
              });
          }
        });
    }
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
