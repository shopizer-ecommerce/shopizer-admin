import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';

import { UserService } from '../../shared/services/user.service';
import { LocalDataSource } from 'ng2-smart-table';
import { TranslateService } from '@ngx-translate/core';
import { NbDialogService } from '@nebular/theme';
import { StorageService } from '../../shared/services/storage.service';
import { SecurityService } from '../../shared/services/security.service';
import { ToastrService } from 'ngx-toastr';
import { ButtonRenderUserComponent } from './button-render-user.component'
import { ShowcaseDialogComponent } from '../../shared/components/showcase-dialog/showcase-dialog.component';

@Component({
  selector: 'ngx-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  loadingList = false;

  // paginator
  perPage = 10;
  currentPage = 1;
  totalCount;
  totalPages;

  searchValue: string = '';

  // server params
  params = this.loadParams();

  settings = {};

  constructor(
    private userService: UserService,
    private router: Router,
    private translate: TranslateService,
    private _sanitizer: DomSanitizer,
    private storageService: StorageService,
    private securityService: SecurityService,
    private dialogService: NbDialogService,
    private toastr: ToastrService,
  ) {
    this.getList();
  }

  loadParams() {
    return {
      lang: this.storageService.getLanguage(),
      store: this.storageService.getMerchant(),
      count: this.perPage,
      page: 0,
    };
  }

  getList() {
    console.log('Getting list');
    this.params.page = this.currentPage - 1;
    this.loadingList = true;
    this.userService.getUsersList(this.storageService.getMerchant(), this.params)
      .subscribe(res => {
        const usersArray = [...res.data];
        this.totalCount = res.recordsTotal;
        this.totalPages = res.totalPages;

        // remove current user from list
        // const index = usersArray.findIndex(el => el.id === +this.userService.getUserId());
        // usersArray.splice(index, 1);

        // creating 'name' property for displaying in the table
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

  ngOnInit() { }

  setSettings() {

    //nothing by default
    let customs = [];
    if (this.securityService.isAnAdmin()) {
      customs = [
        { name: 'details', title: '<i class="nb-edit"></i>' },
        { name: 'remove', title: '<i class="nb-trash"></i>' }
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

  resetSearch() {
    this.searchValue = null;
    this.params = this.loadParams();
    this.getList();
  }

  onSearch(query: string = '') {

    if (query.length == 0) {
      this.searchValue = null;
      return;
    }

    //server side search
    this.params["emailAddress"] = query;
    this.getList();

    /**
    this.source.setFilter([
      {
        field: 'name',
        search: query
      },
      {
        field: 'emailAddress',
        search: query
      }
    ], false); 
    **/

    this.searchValue = query;

  }

}
