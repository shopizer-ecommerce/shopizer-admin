import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OptionService } from '../services/option.service';
import { LocalDataSource } from 'ng2-smart-table';
import { TranslateService } from '@ngx-translate/core';
import { ShowcaseDialogComponent } from '../../../shared/components/showcase-dialog/showcase-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '../../../shared/services/storage.service';
import { StoreService } from '../../../store-management/services/store.service';

@Component({
  selector: 'ngx-options-list',
  templateUrl: './options-list.component.html',
  styleUrls: ['./options-list.component.scss']
})
export class OptionsListComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  loadingList = false;
  options = [];
  settings = {};

  // paginator
  perPage = 15;
  currentPage = 1;
  totalCount;
  searchValue: string = '';
  stores: Array<any> = [];
  selectedStore: String = '';
  params = this.loadParams();
  constructor(
    private optionService: OptionService,
    private translate: TranslateService,
    private router: Router,
    private dialogService: NbDialogService,
    private toastr: ToastrService,
    private storageService: StorageService,
    private storeService: StoreService,
  ) {
    this.getStoreList()
  }

  ngOnInit() {
    this.getList();
  }
  loadParams() {
    return {
      store: this.storageService.getMerchant(),
      lang: this.storageService.getLanguage(),
      count: this.perPage,
      page: 0
    };
  }
  getStoreList() {
    this.storeService.getListOfMerchantStoreNames({ 'store': '' })
      .subscribe(res => {
        res.forEach((store) => {
          this.stores.push({ value: store.code, label: store.code });
        });
      });
  }
  getList() {
    this.params.page = this.currentPage - 1;
    this.loadingList = true;
    this.optionService.getListOfOptions(this.params).subscribe((res) => {
      this.totalCount = res.recordsTotal;
      this.options = [...res.options];
      this.source.load(this.options);
      this.loadingList = false;
    });
    this.setSettings();
    this.translate.onLangChange.subscribe((lang) => {
      this.setSettings();
    });
  }

  setSettings() {
    this.settings = {
      //hideSubHeader: true,
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
          filter: false,

        },
        descriptions: {
          title: this.translate.instant('COMMON.NAME'),
          type: 'html',
          editable: false,
          filter: true,
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
            const name = description && description.name ? description.name : '';
            return name;
          }
        },
        type: {
          title: "Type",
          type: 'string',
          filter: false,
          valuePrepareFunction: (type) => {
            return this.translate.instant('COMMON.' + type);
          }
        }
      },
    };
  }

  deleteRecord(event) {
    this.dialogService.open(ShowcaseDialogComponent, {})
      .onClose.subscribe(res => {
        if (res) {
          // event.confirm.resolve();
          this.optionService.deleteOption(event.data.id)
            .subscribe(result => {
              this.toastr.success(this.translate.instant('OPTION.OPTION_REMOVED'));
              this.getList();
            });
        } else {
          // event.confirm.reject();
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
  onSearch(value) {
    this.params["name"] = value;
    this.searchValue = value;
    this.getList()
  }
  resetSearch() {
    this.params = this.loadParams();
    this.searchValue = null;
    this.getList();
  }
  onSelectStore(e) {
    this.params["store"] = e;
    this.getList();
  }
  onClickAction(event) {
    switch (event.action) {
      case 'edit':
        this.onEdit(event);
        break;
      case 'remove':
        this.deleteRecord(event)
        break
    }
  }
  onEdit(event) {
    this.router.navigate(['/pages/catalogue/options/option/' + event.data.id]);
  }
}
