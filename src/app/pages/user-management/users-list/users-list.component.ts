import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';

import { UserService } from '../../shared/services/user.service';
import { LocalDataSource } from 'ng2-smart-table';
import { TranslateService } from '@ngx-translate/core';
import { NbDialogService } from '@nebular/theme';
import { StorageService } from '../../shared/services/storage.service';
import { SecurityService } from '../../shared/services/security.service';
import { StoreService } from '../../store-management/services/store.service';
import { ToastrService } from 'ngx-toastr';
import { ButtonRenderUserComponent } from './button-render-user.component'
import { ShowcaseDialogComponent } from '../../shared/components/showcase-dialog/showcase-dialog.component';
import { ListingService } from '../../shared/services/listing.service';


@Component({
  selector: 'ngx-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  listingService: ListingService;
  loadingList = false;
  isSuperadmin: boolean;

  // paginator
  perPage = 15;
  currentPage = 1;
  totalCount;
  totalPages;

  // server params
  params = this.loadParams();

  settings = {};
  stores = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private translate: TranslateService,
    private storageService: StorageService,
    private securityService: SecurityService,
    private dialogService: NbDialogService,
    private storeService: StoreService,
    private toastr: ToastrService
  ) {
    this.listingService = new ListingService()
    this.getList();
  }

  //object
  loadParams() {
    return {
      lang: this.storageService.getLanguage(),
      store: this.storageService.getMerchant(),
      count: this.perPage,
      page: 0,
    };
  }

  getList() {

    /**
     * Rules
     * 
     * Can't remove superadmin
     * Can't remove self
     */

    this.params.page = this.currentPage - 1;
    this.loadingList = true;
    this.userService.getUsersList(this.storageService.getMerchant(), this.params)
      .subscribe(res => {
        const usersArray = [...res.data];
        this.totalCount = res.recordsTotal;
        this.totalPages = res.totalPages;

        usersArray.map(user => {
          user.name = user.firstName + ' ' + user.lastName;
          return user;
        });
        this.source.load(usersArray);
        this.loadingList = false;
        this.source.refresh();
      });
    this.setSettings();
    this.translate.onLangChange.subscribe((event) => {
      this.setSettings();
    });
  }

  /** callback methods for table list*/
  private loadList(newParams: any) {
    this.currentPage = 1; //back to page 1
    this.params = newParams;
    this.getList();
  }

  choseStore(event) {
    this.params.store = event;
    this.getList();
  }

  private resetList() {
    //console.log('CallBack resetList');
    this.currentPage = 1;//back to page 1
    this.params = this.loadParams();
    this.getList();
  }

  ngOnInit() {
    this.isSuperadmin = this.securityService.isSuperAdmin();
    this.storeService.getListOfStores({ start: 0 })
      .subscribe(res => {
        res.data.forEach((store) => {
          this.stores.push({ value: store.code, label: store.code });
        });
      });

    //ng2-smart-table server side filter
    this.source.onChanged().subscribe((change) => {

      if (!this.loadingList) {//listing service
        this.listingService.filterDetect(this.params, change, this.loadList.bind(this), this.resetList.bind(this));
      }

    });
  }


  setSettings() {
    //nothing by default
    let customs = [];
    if (this.securityService.isAnAdmin()) {
      customs = [
        { name: 'details', title: '<i class="nb-edit"></i>' },
      ]
    }
    this.settings = {

      actions: {
        columnTitle: '',
        add: false,
        edit: false,
        filter: false,
        delete: false,
        position: 'right',
        sort: true,
        custom: customs
      },

      pager: { display: false },
      columns: {
        id: {
          filter: false,
          title: this.translate.instant('COMMON.ID'),
          type: 'number',
        },
        name: {
          filter: true,
          title: this.translate.instant('COMMON.NAME'),
          type: 'string',
        },
        emailAddress: {
          filter: true,
          title: this.translate.instant('COMMON.EMAIL_ADDRESS'),
          type: 'string',
        },
        active: {
          filter: false,
          title: this.translate.instant('COMMON.STATUS'),
          type: 'custom',
          renderComponent: ButtonRenderUserComponent,
          defaultValue: false,
        }
      },
    };
  }

  route(event) {
    switch (event.action) {
      case 'details'://must be super admin or admin retail or admin
        if (!this.securityService.isAnAdmin()) {
        } else {
          this.router.navigate(['pages/user-management/user/', event.data.id]);
          break;
        }
      case 'remove':
        var userId = event.data.id;
        var objUserId = this.storageService.getUserId();
        if (userId === parseInt(objUserId)) {
          this.dialogService.open(ShowcaseDialogComponent, {
            context: {
              title: '',
              text: '',
              actionText: this.translate.instant('USER_FORM.CANT_DELETE_YOUR_PROFILE')
            }
          })
        } else {
          this.dialogService.open(ShowcaseDialogComponent, {
            context: {
              title: '',
              text: event.data.name + ' ? '
            }
          })
            .onClose.subscribe(res => {
              if (res) {
                this.userService.deleteUser(event.data.id, this.storageService.getMerchant())
                  .subscribe(data => {
                    this.toastr.success(this.translate.instant('USER_FORM.USER_REMOVED'));
                    this.getList();
                  });
              }
            });
        }
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
      case 'onLast': {
        this.currentPage = this.totalPages;
        break;
      }
      case 'onFirst': {
        this.currentPage = 1;
        break;
      }
    }
    this.getList();
  }




}
