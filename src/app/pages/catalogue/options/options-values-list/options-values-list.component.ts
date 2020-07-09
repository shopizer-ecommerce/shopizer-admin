import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LocalDataSource } from 'ng2-smart-table';
import { TranslateService } from '@ngx-translate/core';
import { OptionValuesService } from '../services/option-values.service';
import { ShowcaseDialogComponent } from '../../../shared/components/showcase-dialog/showcase-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../../../shared/services/storage.service';

@Component({
  selector: 'ngx-options-values-list',
  templateUrl: './options-values-list.component.html',
  styleUrls: ['./options-values-list.component.scss']
})
export class OptionsValuesListComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  optionValues = [];
  loadingList = false;

  // paginator
  perPage = 10;
  currentPage = 1;
  totalCount;

  // request params
  params = {
    count: this.perPage,
    page: 0
  };
  settings = {};

  constructor(
    private translate: TranslateService,
    private optionValuesService: OptionValuesService,
    private router: Router,
    private dialogService: NbDialogService,
    private toastr: ToastrService,
    private storageService: StorageService,
  ) {
  }

  ngOnInit() {
    this.getList();
  }

  getList() {
    this.loadingList = true;
    this.params.page = this.currentPage - 1;
    this.optionValuesService.getListOfOptionValues(this.params)
      .subscribe(res => {
        this.totalCount = res.recordsTotal;
        this.optionValues = [...res.optionValues];
        this.optionValues.forEach(element => {
          element.descriptions.forEach(description => {
            description.parent_id = element.id;
          });
        });
        this.source.load(this.optionValues);
        this.loadingList = false;
      });
    this.setSettings();
    this.translate.onLangChange.subscribe((lang) => {
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
        columnTitle: '',
        add: false,
        edit: false,
        delete: false,
        position: 'right',
        sort: true,
        custom: [
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
        code: {
          title: this.translate.instant('COMMON.CODE'),
          type: 'string',
          editable: false
        },
        descriptions: {
          title: this.translate.instant('COMMON.NAME'),
          type: 'html',
          editable: false,
          valuePrepareFunction: (descriptions) => {
            // parent_id for link
            let parent_id = -1;
            // find element with certain language
            const description = descriptions.find(el => {
              // set parent_id
              if (parent_id === -1 && el) {
                parent_id = el.parent_id;
              }
              return el.language === this.storageService.getLanguage();
            });
            const name = description && description.name ? description.name : 'null';
            return `<a href="#/pages/catalogue/options/option-value/${parent_id}">${name}</a>`;
          }
        }
      },
    };
  }

  deleteRecord(event) {
    this.dialogService.open(ShowcaseDialogComponent, {})
      .onClose.subscribe(res => {
        if (res) {
          event.confirm.resolve();
          this.optionValuesService.deleteOptionValue(event.data.id)
            .subscribe(result => {
              this.toastr.success(this.translate.instant('OPTION_VALUE.OPTION_VALUE_REMOVED'));
              this.getList();
            });
        } else {
          event.confirm.reject();
        }
      });
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
