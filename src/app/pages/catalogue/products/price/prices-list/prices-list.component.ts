import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { LocalDataSource } from 'ng2-smart-table';
import { ProductService } from '../../services/product.service';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { InventoryService } from '../../services/inventory.service';
import { ShowcaseDialogComponent } from '../../../../shared/components/showcase-dialog/showcase-dialog.component';

@Component({
  selector: 'ngx-prices-list',
  templateUrl: './prices-list.component.html',
  styleUrls: ['./prices-list.component.scss']
})
export class PricesListComponent implements OnInit {
  @Input() prices;
  source: LocalDataSource = new LocalDataSource();
  loadingList = false;

  // paginator
  perPage = 10;
  currentPage = 1;
  totalCount;

  settings = {};

  params = {
    productId: '',
    inventoryId: ''
  };

  constructor(
    private productService: ProductService,
    private dialogService: NbDialogService,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private inventoryService: InventoryService,
    private _sanitizer: DomSanitizer,
    private router: Router,
  ) {
    this.params.productId = this.activatedRoute.snapshot.paramMap.get('productId');
    this.params.inventoryId = this.activatedRoute.snapshot.paramMap.get('inventoryId');
  }

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.prices = (this.prices && this.prices.length) ? this.prices : [];
    this.source.load(this.prices);
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
        const path = `pages/catalogue/products/${this.params.productId}/` +
          `inventory/${this.params.inventoryId}/price/${event.data.id}`;
        this.router.navigate([path]);
        break;
      case 'remove':
        this.dialogService.open(ShowcaseDialogComponent, {})
          .onClose.subscribe(res => {
          if (res) {
            // todo remove price item from list
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
