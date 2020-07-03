import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { CrudService } from '../../shared/services/crud.service';
import { Router } from '@angular/router';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';

@Component({
  selector: 'ngx-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  search_text: string = '';
  settings = {
    mode: 'external',
    hideSubHeader: true,
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
        // {
        //   name: 'delete',
        //   title: '<i class="nb-trash"></i>'
        // }
      ]
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      firstName: {
        title: 'First Name',
        type: 'string',
      },
      lastName: {
        title: 'Last Name',
        type: 'string',
      },
      emailAddress: {
        title: 'Email',
        type: 'string',
      },
      country: {
        title: 'Country',
        type: 'string',
        valuePrepareFunction: (cell, row) => {
          return row.billing.country
        }
      }
    },
  };
  //public scrollbarOptions = { axis: 'yx', theme: 'minimal-dark' };
  source: any = new LocalDataSource();
  tempData: Array<any> = [];
  loadingList = false;
  constructor(private crudService: CrudService, public router: Router, private mScrollbarService: MalihuScrollbarService) {}
  ngOnInit() {
    this.getCustomers();
  }
  ngAfterViewInit() {
    this.mScrollbarService.initScrollbar('.custom_scroll', { axis: 'y', theme: 'minimal-dark', scrollButtons: { enable: true } });
  }
  getCustomers() {
    this.loadingList = true
    this.crudService.get('/v1/private/customers')
      .subscribe(data => {
        console.log(data, '************')
        this.source = data.customers;
        this.tempData = data.customers;
        this.loadingList = false
      }, error => {
        this.loadingList = false
      });
  }
  search() {
    const val = this.search_text.toLowerCase();
    const temp = this.tempData.filter(function (d) {
      return d.firstName.toLowerCase().indexOf(val) !== -1 || !val ||
        d.lastName.toLowerCase().indexOf(val) !== -1 || !val ||
        d.emailAddress.toLowerCase().indexOf(val) !== -1 || !val;
      d.billing.country.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.source = temp;
  }
  addCustomer() {
    localStorage.setItem('customerid', '');
    this.router.navigate(['/pages/customer/add']);
  }
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
