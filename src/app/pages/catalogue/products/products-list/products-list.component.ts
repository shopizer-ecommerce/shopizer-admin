import { Component, OnInit } from '@angular/core';

import { ProductService } from '../services/product.service';
import { LocalDataSource } from 'ng2-smart-table';
import { AvailableButtonComponent } from './available-button.component';
import { ShowcaseDialogComponent } from '../../../shared/components/showcase-dialog/showcase-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { StoreService } from '../../../store-management/services/store.service';
import { UserService } from '../../../shared/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../shared/services/storage.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {
  products = [];
  source: LocalDataSource = new LocalDataSource();
  loadingList = false;
  stores = [];
  isSuperadmin: boolean;

  // paginator
  perPage = 10;
  currentPage = 1;
  totalCount;

  // server params
  params = {
    store: this.storageService.getMerchant(),
    lang: this.storageService.getLanguage(),
    count: this.perPage,
    start: 0
  };
  settings = {};

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private dialogService: NbDialogService,
    private storeService: StoreService,
    private translate: TranslateService,
    private storageService: StorageService,
    private toastr: ToastrService,
  ) {
    this.isSuperadmin = this.storageService.getUserRoles().isSuperadmin;
  }

  ngOnInit() {
    this.storeService.getListOfStores({ start: 0 })
      .subscribe(res => {
        this.stores = res.data;
      });
    this.getList();
    this.translate.onLangChange.subscribe((lang) => {
      this.params.lang = this.storageService.getLanguage();
      this.getList();
    });
  }

  getList() {
    const startFrom = (this.currentPage - 1) * this.perPage;
    this.params.start = startFrom;
    this.loadingList = true;
    this.productService.getListOfProducts(this.params)
      .subscribe(res => {
        const products = res.products;
        this.totalCount = res.recordsTotal;
        products.forEach(el => {
          el.name = el.description.name;
        });
        this.products = [...products];
        this.source.load(products);
        this.loadingList = false;
      });
    this.setSettings();
  }

  setSettings() {
    this.settings = {
      actions: {
        columnTitle: 'Action',
        add: false,
        edit: false,
        delete: false,
        position: 'right',
        sort: true,
        custom: [
          { name: 'edit', title: '<i class="nb-edit"></i>' },
          { name: 'remove', title: '<i class="nb-trash"></i>' }
        ],
      },
      pager: {
        display: false
      },
      columns: {
        id: {
          title: this.translate.instant('COMMON.ID'),
          type: 'number',
          editable: false
        },
        sku: {
          title: this.translate.instant('PRODUCT.SKU'),
          type: 'string',
          editable: false
        },
        name: {
          title: this.translate.instant('PRODUCT.PRODUCT_NAME'),
          type: 'html',
          editable: false,
          valuePrepareFunction: (name) => {
            const id = this.products.find(el => el.name === name).id;
            return `<a href="#/pages/catalogue/products/product/${id}">${name}</a>`;
          }
        },
        quantity: {
          title: this.translate.instant('PRODUCT.QTY'),
          type: 'number',
          editable: true
        },
        available: {
          filter: false,
          title: this.translate.instant('COMMON.AVAILABLE'),
          type: 'custom',
          renderComponent: AvailableButtonComponent,
          defaultValue: false,
          editable: true,
          editor: {
            type: 'checkbox'
          }
        },
        price: {
          title: this.translate.instant('PRODUCT.PRICE'),
          type: 'string',
          editable: true
        },
        creationDate: {
          title: this.translate.instant('PRODUCT.CREATION_DATE'),
          type: 'string',
          editable: false
        },
      },
    };
  }

  updateRecord(event) {
    const product = {
      available: event.newData.available,
      price: event.newData.price,
      quantity: event.newData.quantity
    };
    event.confirm.resolve(event.newData);
    this.productService.updateProductFromTable(event.newData.id, product)
      .subscribe(res => {
        event.confirm.resolve(event.newData);
        this.toastr.success(this.translate.instant('PRODUCT.PRODUCT_UPDATED'));
      }, error => {
        console.log(error.error.message);
      });
  }

  deleteRecord(event) {
    this.dialogService.open(ShowcaseDialogComponent, {})
      .onClose.subscribe(res => {
        if (res) {
          this.productService.deleteProduct(event.data.id)
            .subscribe(result => {
              event.confirm.resolve();
              this.getList();
            });
        } else {
          event.confirm.reject();
        }
      });
  }

  choseStore(event) {
    this.params.store = event;
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

}
