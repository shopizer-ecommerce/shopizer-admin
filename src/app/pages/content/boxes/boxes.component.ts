import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { CrudService } from '../../shared/services/crud.service';
import { Router } from '@angular/router';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { StoreService } from '../../store-management/services/store.service';
import { StorageService } from '../../shared/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../shared/components/showcase-dialog/showcase-dialog.component';
@Component({
  selector: 'boxes-table',
  templateUrl: './boxes.component.html',
  styleUrls: ['./boxes.component.scss'],
})
export class BoxesComponent {
  perPage = 10;
  currentPage = 1;
  totalCount;
  stores: Array<any> = [];
  loadingList = false;
  params = this.loadParams();
  settings = {}
  // request params

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private crudService: CrudService,
    public router: Router,
    private mScrollbarService: MalihuScrollbarService,
    private storeService: StoreService,
    private storageService: StorageService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private dialogService: NbDialogService
  ) {
    this.getStoreList();
    this.translate.onLangChange.subscribe((lang) => {
      this.params.lang = this.storageService.getLanguage();
      this.getBox();
    });
  }
  ngOnInit() {
    this.getBox();
  }
  loadParams() {
    return {
      store: this.storageService.getMerchant(),
      lang: '_all',
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

  getBox() {
    this.params.page = this.currentPage - 1;
    this.crudService.get('/v1/private/content/boxes/', this.params)
      .subscribe(data => {
        this.source = data.items;
        this.totalCount = data.recordsTotal * data.totalPages
      }, error => {
      });
    this.setSettings();
  }
  setSettings() {
    this.settings = {
      mode: 'external',
      hideSubHeader: true,
      actions: {
        columnTitle: this.translate.instant('ORDER.ACTIONS'),
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
      columns: {
        id: {
          title: this.translate.instant('COMMON.ID'),
          type: 'number',
        },
        code: {
          title: this.translate.instant('CONTENT.CODE'),
          type: 'string',
        },
        description: {
          title: this.translate.instant('CONTENT.NAME'),
          type: 'string',
          valuePrepareFunction: (cell, row) => {
            // console.log(row.descriptions)
            if (this.params.lang == '_all') {
              return row.descriptions[0].name
            } else {
              let value = row.descriptions.find((a) => a.language == this.params.lang);
              return value.name
            }
          }
        }
      },
    };

  }
  addBoxes() {
    this.router.navigate(['/pages/content/boxes/add']);
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
    this.getBox()
  }
  onSelectStore(e) {
    this.params["store"] = e;
    this.getBox();
  }
  onClickAction(event) {
    switch (event.action) {
      case 'edit':
        this.onEdit(event);
        break;
      case 'delete':
        this.onDelete(event);
    }
  }
  onEdit(event) {
    this.router.navigate(['/pages/content/boxes/add/' + event.data.code]);
  }
  onDelete(event) {

    this.dialogService.open(ShowcaseDialogComponent, {
      context: 'Do you really want to remove this entity?'
      // context: {
      //   title: 'Are you sure!',
      //   body: 'Do you really want to remove this entity?'
      // },
    }).onClose.subscribe(res => {
      if (res) {
        this.loadingList = true;
        this.crudService.delete('/v1/private/content/' + event.data.id + '?id=' + event.data.id)
          .subscribe(data => {
            this.loadingList = false;
            this.toastr.success('Content box deleted successfully');
            this.getBox();
          }, error => {
            this.loadingList = false;
          });
      } else {
        this.loadingList = false;
      }
    });

  }
  ngAfterViewInit() {
    this.mScrollbarService.initScrollbar('.custom_scroll', { axis: 'y', theme: 'minimal-dark', scrollButtons: { enable: true } });
  }
}
