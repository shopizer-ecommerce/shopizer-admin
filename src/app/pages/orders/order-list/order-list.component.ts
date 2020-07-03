import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { StorageService } from '../../shared/services/storage.service';
import { StoreService } from '../../store-management/services/store.service';
import { OrdersService } from '../services/orders.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'ngx-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  @ViewChild('item', { static: false }) accordion;
  source: LocalDataSource = new LocalDataSource();
  loadingList = false;
  settings = {};
  stores: Array<any> = [];
  selectedStore: String = '';
  // perPage = 10;
  // paginator
  perPage = 10;
  currentPage = 1;
  totalCount;
  roles;
  searchValue: string = '';
  isSuperAdmin: boolean;

  timeoutHandler: any;
  params = this.loadParams();

  constructor(
    private ordersService: OrdersService,
    private router: Router,
    private mScrollbarService: MalihuScrollbarService,
    private translate: TranslateService,
    private storageService: StorageService,
    private storeService: StoreService,
  ) {
    this.isSuperAdmin = this.storageService.getUserRoles().isSuperadmin;
    this.getStoreList();
  }
  getStoreList() {
    this.storeService.getListOfMerchantStoreNames({ 'store': '' })
      .subscribe(res => {
        this.stores = res;
      });
  }
  ngOnInit() {
    this.getOrderList();
    this.translate.onLangChange.subscribe((lang) => {
      this.params.lang = this.storageService.getLanguage();
      this.getOrderList();
    });
    this.source.onChanged().subscribe((change) => {
      // console.log(change)
      let time = 0;
      if (change.action == 'refresh' || change.action == 'load') {
        clearTimeout(this.timeoutHandler);
      } else {
        time = 1000;
      }
      if (this.timeoutHandler) {
        clearTimeout(this.timeoutHandler);
      }

      this.timeoutHandler = setTimeout(() => {
        if (change.action == 'filter') {
          change.filter.filters.map((a) => {
            if (a.field == "id") {
              this.params["id"] = a.search;
            } else if (a.field == "billingName") {
              this.params["name"] = a.search;
            } else if (a.field == "billingPhone") {
              this.params["phone"] = a.search;
            } else if (a.field == "billingEmail") {
              this.params["email"] = a.search;
            } else if (a.field == "orderStatus") {
              this.params["status"] = a.search;
            }
          });

          this.getOrderList()
        }
      }, time);

    });
  }
  loadParams() {
    return {
      store: this.storageService.getMerchant(),
      lang: this.storageService.getLanguage(),
      count: this.perPage,
      page: 0
    };
  }
  getOrderList() {
    this.params.page = this.currentPage;

    let data = [];
    this.loadingList = true;
    this.ordersService.getOrders(this.params)
      .subscribe(orders => {
        // console.log(orders)
        this.loadingList = false;
        data = orders.orders
        if (orders.orders && orders.orders.length !== 0) {
          console.log('sdfsdf')
          this.source.load(orders.orders);
        } else {
          console.log('123')
          this.source.load([]);
        }
        this.totalCount = orders.recordsTotal;
      });
    this.setSettings();
  }

  setSettings() {
    var me = this;
    this.settings = {
      // mode: 'external',
      // hideSubHeader: false,
      actions: {
        columnTitle: this.translate.instant('ORDER.ACTIONS'),
        add: false,
        edit: false,
        delete: false,
        position: 'right',
        custom: [
          {
            name: 'view',
            title: '<i class="nb-edit"></i>'
          }
        ],
      },
      pager: {
        display: false
      },
      columns: {
        id: {
          title: this.translate.instant('COMMON.ID'),
          type: 'number'
        },
        billingName: {
          title: this.translate.instant('ORDER.CUSTOMER_NAME'),
          type: 'string',
          valuePrepareFunction: (customer, data) => {
            // console.log(data);
            return data.billing.firstName + ' ' + data.billing.lastName;
          }
        },
        billingPhone: {
          title: this.translate.instant('ORDER.CUSTOMER_PHONE'),
          type: 'string',
          valuePrepareFunction: (customer, data) => {
            // console.log(customer)
            return data.billing.phone;
          }
        },
        billingEmail: {
          title: this.translate.instant('ORDER.CUSTOMER_EMAIL'),
          type: 'string',
          valuePrepareFunction: (customer, data) => {
            // console.log(customer)
            return data.billing.email;
          }
        },
        total: {
          title: this.translate.instant('ORDER.TOTAL'),
          type: 'string',
          filter: false,
          valuePrepareFunction: (total) => {
            return total.value;
          }
        },
        datePurchased: {
          title: this.translate.instant('ORDER.ORDER_DATE'),
          type: 'string',
          filter: false,
          valuePrepareFunction: (date) => {
            if (date) {
              return new DatePipe('en-GB').transform(date, 'yyyy-MM-dd');
            }
          }
        },
        orderStatus: {
          title: this.translate.instant('ORDER.STATUS'),
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
    this.getOrderList()
  }
  onSearch(query: string = '') {

    if (query.length == 0) {
      this.searchValue = null;
      return;
    }

    this.params["name"] = query;
    this.getOrderList();
    this.searchValue = query;

  }
  onSelectStore(value) {
    this.params["store"] = value;
    this.getOrderList();
  }
  resetSearch() {
    this.searchValue = null;
    this.params = this.loadParams();
    this.getOrderList();
  }
  ngAfterViewInit() {
    this.mScrollbarService.initScrollbar('.custom_scroll', { axis: 'y', theme: 'minimal-dark', scrollButtons: { enable: true } });
  }
  route(e) {
    localStorage.setItem('orderID', e.data.id);
    this.router.navigate(['pages/orders/order-details']);
  }

}
