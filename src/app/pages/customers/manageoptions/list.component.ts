import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { CrudService } from '../../shared/services/crud.service';
import { Router } from '@angular/router';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';

@Component({
  selector: 'ngx-manage-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class ManageListComponent implements OnInit {

  constructor(private crudService: CrudService, public router: Router, private mScrollbarService: MalihuScrollbarService) {}
  settings = {
    mode: 'external',
    hideSubHeader: true,
    // actions: {
    //   add: false,
    //   edit: false,
    //   delete: false,
    //   position: 'right',
    //   custom: [
    //     {
    //       name: 'edit',
    //       title: '<i class="nb-edit"></i>'
    //     },
    //     // {
    //     //   name: 'delete',
    //     //   title: '<i class="nb-trash"></i>'
    //     // }
    //   ]
    // },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      optioncode: {
        title: 'Option Code',
        type: 'string',
      },
      optionname: {
        title: 'Option Name',
        type: 'string',
      },
      valuecode: {
        title: 'Option Value Code',
        type: 'string',
      },
      valuename: {
        title: 'Option Value Name',
        type: 'string',
      },
      order: {
        title: 'Order',
        type: 'string',
      }
    },
  };
  ngOnInit() {
  }
  ngAfterViewInit() {
    this.mScrollbarService.initScrollbar('.custom_scroll', { axis: 'y', theme: 'minimal-dark', scrollButtons: { enable: true } });
  }
  manageOptions() {
    this.router.navigate(['/pages/customer/manage/add']);
  }
}
