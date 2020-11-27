import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { CrudService } from '../../shared/services/crud.service';
import { Router } from '@angular/router';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import { StoreService } from '../../store-management/services/store.service';
import { StorageService } from '../../shared/services/storage.service';

@Component({
  selector: 'boxes-table',
  templateUrl: './boxes.component.html',
  styleUrls: ['./boxes.component.scss'],
})
export class BoxesComponent {
  perPage = 15;
  stores: Array<any> = [];
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
        {
          name: 'delete',
          title: '<i class="nb-info"></i>'
        }
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
      name: {
        title: 'Name',
        type: 'string',
      }
    },
  };

  // request params
  params = {
    lang: this.storageService.getLanguage(),
    store: this.storageService.getMerchant(),
    count: this.perPage,
    page: 0
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private crudService: CrudService,
    public router: Router,
    private mScrollbarService: MalihuScrollbarService,
    private storeService: StoreService,
    private storageService: StorageService
  ) {
    this.getStoreList();
    this.getBox()
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

    this.crudService.get('/v1/private/content/boxes', { 'store': this.storageService.getMerchant() })
      .subscribe(data => {
        this.source = data;
      }, error => {
        // this.router.navigate(['/error']);
      });
  }
  addBoxes() {
    this.router.navigate(['/pages/content/boxes/add']);
  }
  onSelectStore(e) {
    this.params["store"] = e;
    this.getBox();
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
