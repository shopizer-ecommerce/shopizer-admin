import { Component, OnInit } from '@angular/core';

import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ShowcaseDialogComponent } from '../../../shared/components/showcase-dialog/showcase-dialog.component';
import { ProductGroupsService } from '../services/product-groups.service';
import { ActiveButtonComponent } from './active-button.component';

@Component({
  selector: 'ngx-groups-list',
  templateUrl: './groups-list.component.html',
  styleUrls: ['./groups-list.component.scss']
})
export class GroupsListComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  loadingList = false;

  settings = {};

  constructor(
    private dialogService: NbDialogService,
    private translate: TranslateService,
    private productGroupsService: ProductGroupsService
  ) {
  }

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.loadingList = true;
    this.productGroupsService.getListOfProductGroups().subscribe(res => {
      this.source.load(res);
      this.loadingList = false;
    });
    this.setSettings();
    this.translate.onLangChange.subscribe((event) => {
      this.setSettings();
    });
  }

  setSettings() {
    this.settings = {
      // mode: 'inline',
      // delete: {
      //   deleteButtonContent: '<i class="nb-trash"></i>',
      //   confirmDelete: true
      // },
      actions: {
        columnTitle: 'Action',
        add: false,
        edit: false,
        delete: false,
        position: 'right',
        sort: true,
        custom: [
          // { name: 'edit', title: '<i class="nb-edit"></i>' },
          { name: 'remove', title: '<i class="nb-trash"></i>' }
        ],
      },
      pager: { display: false },
      columns: {
        code: {
          title: this.translate.instant('COMMON.CODE'),
          type: 'string',
          editable: false
        },
        active: {
          filter: false,
          title: this.translate.instant('COMMON.ACTIVE'),
          type: 'custom',
          renderComponent: ActiveButtonComponent,
          defaultValue: false,
          editable: true,
          editor: {
            type: 'checkbox'
          }
        },
      },
    };
  }

  deleteRecord(event) {
    this.dialogService.open(ShowcaseDialogComponent, {})
      .onClose.subscribe(res => {
        if (res) {
          event.confirm.resolve();
          this.productGroupsService.removeProductGroup(event.data.id)
            .subscribe(result => {
              this.getList();
            });
        } else {
          event.confirm.reject();
        }
      });
  }

}
