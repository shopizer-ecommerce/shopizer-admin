import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { CrudService } from '../../shared/services/crud.service';
import { Router } from '@angular/router';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { StoreService } from '../../store-management/services/store.service';
import { StorageService } from '../../shared/services/storage.service';
import { TranslateService } from '@ngx-translate/core';
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
  params = this.loadParams();
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
        {
          name: 'delete',
          title: '<i class="nb-trash"></i>'
        },
        // {
        //   name: 'delete',
        //   title: '<i class="nb-info"></i>'
        // }
      ]
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
      },
      code: {
        title: 'Code',
        type: 'string',
      },
      description: {
        title: 'Name',
        type: 'string',
        valuePrepareFunction: (cell, row) => {
          // console.log(row.description.name)
          return row.description.name
        }
      }
    },
  };

  // request params

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private crudService: CrudService,
    public router: Router,
    private mScrollbarService: MalihuScrollbarService,
    private storeService: StoreService,
    private storageService: StorageService,
    private translate: TranslateService
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

  getBox() {
    // let action = Action.CONTENT + Action.BOXES;
    this.params.page = this.currentPage - 1;
    this.crudService.get('/v1/private/content/boxes/', this.params)
      .subscribe(data => {
        this.source = data.items;
        this.totalCount = data.recordsTotal * data.totalPages
      }, error => {
      });
  }
  addBoxes() {
    localStorage.setItem('contentBoxID', '');
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
    console.log(event);
    switch (event.action) {
      case 'edit':
        this.onEdit(event);
        break;

    }
  }
  onEdit(event) {
    console.log(event)
    localStorage.setItem('contentBoxID', event.data.code);
    this.router.navigate(['/pages/content/boxes/add']);
  }
  // onDeleteConfirm(event): void {
  //   if (window.confirm('Are you sure you want to delete?')) {
  //     event.confirm.resolve();
  //   } else {
  //     event.confirm.reject();
  //   }
  // }
  ngAfterViewInit() {
    this.mScrollbarService.initScrollbar('.custom_scroll', { axis: 'y', theme: 'minimal-dark', scrollButtons: { enable: true } });
  }
}
