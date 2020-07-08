import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
// import { CrudService } from '../../shared/services/crud.service';
import { Router } from '@angular/router';
// import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { StorageService } from '../../shared/services/storage.service';
import { CustomersService } from '../services/customer.service';
import { StoreService } from '../../store-management/services/store.service';
@Component({
  selector: 'ngx-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  source: any = new LocalDataSource();
  settings = {};
  search_text: string = '';
  loadingList = false;
  perPage = 10;
  currentPage = 1;
  totalCount;
  stores: Array<any> = [];
  selectedStore: String = '';
  searchValue: string = '';
  params = this.loadParams();
  constructor(
    private customersService: CustomersService,
    public router: Router,
    // private mScrollbarService: MalihuScrollbarService,
    private storageService: StorageService,
    private storeService: StoreService
  ) {
    this.getStoreList()
    this.selectedStore = this.storageService.getMerchant();
  }
  ngOnInit() {
    this.getCustomers();
  }
  getStoreList() {
    this.storeService.getListOfMerchantStoreNames({ 'store': '' })
      .subscribe(res => {
        this.stores = res;
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
  getCustomers() {
    this.params.page = this.currentPage;

    this.loadingList = true;
    this.customersService.getCustomers(this.params)
      .subscribe(customer => {
        // console.log(customer)
        this.loadingList = false;
        this.source.load(customer.customers);
        this.totalCount = customer.totalPages;
      }, error => {

      });
    this.setSettings();
  }
  setSettings() {
    this.settings = {

      actions: {
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
          title: 'ID',
          type: 'number',
          filter: false
        },
        storeCode: {
          title: 'Merchant Store',
          type: 'string'
        },
        firstName: {
          title: 'First Name',
          type: 'string',
          filter: false
        },
        lastName: {
          title: 'Last Name',
          type: 'string',
        },
        emailAddress: {
          title: 'Email',
          type: 'string'
        },
        // country: {
        //   title: 'Country',
        //   type: 'string',
        //   valuePrepareFunction: (cell, row) => {
        //     return row.billing.country
        //   }
        // }
      },
    };
  }

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
    this.getCustomers()
  }
  onSearch(query: string = '') {

    if (query.length == 0) {
      this.searchValue = null;
      return;
    }

    this.params["name"] = query;
    this.getCustomers();
    this.searchValue = query;

  }
  resetSearch() {
    this.searchValue = null;
    this.params = this.loadParams();
    this.getCustomers();
  }
  addCustomer() {
    localStorage.setItem('customerid', '');
    this.router.navigate(['/pages/customer/add']);
  }
  onSelectStore(value) {
    this.params["store"] = value;
    this.getCustomers();
  }
  // ngAfterViewInit() {
  //   this.mScrollbarService.initScrollbar('.custom_scroll', { axis: 'y', theme: 'minimal-dark', scrollButtons: { enable: true } });
  // }
  onClickAction(event) {
    switch (event.action) {
      case 'edit':
        this.onEdit(event);
        break;

    }
  }
  onEdit(event) {
    localStorage.setItem('customerid', event.data.id);
    this.router.navigate(['/pages/customer/add']);
  }
}
