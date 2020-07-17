import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
// import { StorageService } from '../../shared/services/storage.service';
// import { StoreService } from '../../store-management/services/store.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../services/shared.service';
import { error } from '@angular/compiler/src/util';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'ngx-packages-list',
  templateUrl: './packages-list.component.html',
  styleUrls: ['./packages-list.component.scss']
})
export class PackagesListComponent implements OnInit {
  @ViewChild('item', { static: false }) accordion;
  source: LocalDataSource = new LocalDataSource();
  loadingList = false;
  settings = {};
  // stores: Array<any> = [];
  // selectedStore: String = '';
  // perPage = 10;
  // paginator
  perPage = 10;
  currentPage = 1;
  totalCount;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private sharedService: SharedService,
    private toastr: ToastrService,
  ) {
    this.getPackagesList();
  }

  ngOnInit() {
    this.translate.onLangChange.subscribe((lang) => {
      this.getPackagesList();
    });
  }

  getPackagesList() {
    this.loadingList = true;
    this.sharedService.getPackaging()
      .subscribe(data => {
        this.loadingList = false;
        this.source.load(data);
      }, error => {

      });
    this.setSettings();
  }

  setSettings() {
    var me = this;
    this.settings = {

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
        ],
      },
      pager: {
        display: false
      },
      columns: {
        code: {
          title: 'Code',
          type: 'string',
          filter: false
        },
        shippingWidth: {
          title: 'Width',
          type: 'double',
          filter: false
        },
        shippingHeight: {
          title: 'Height',
          type: 'double',
          filter: false
        },
        shippingLength: {
          title: 'Length',
          type: 'double',
          filter: false
        },
        shippingWeight: {
          title: 'Weight',
          type: 'double',
          filter: false
        },

        type: {
          title: 'Type',
          type: 'string',
          filter: false
        }
      },

    };

  }
  // paginator
  // changePage(event) {
  //   switch (event.action) {
  //     case 'onPage': {
  //       this.currentPage = event.data;
  //       break;
  //     }
  //     case 'onPrev': {
  //       this.currentPage--;
  //       break;
  //     }
  //     case 'onNext': {
  //       this.currentPage++;
  //       break;
  //     }
  //     case 'onFirst': {
  //       this.currentPage = 1;
  //       break;
  //     }
  //     case 'onLast': {
  //       this.currentPage = event.data;
  //       break;
  //     }
  //   }

  // }
  delete(e) {
    this.loadingList = true;
    this.sharedService.deletePackaging(e.data.code)
      .subscribe(res => {
        this.loadingList = false;
        this.toastr.success("Packages has been deleted successfully");
      }, error => {
        this.loadingList = false;

      });
  }
  route(e) {
    if (e.action == 'delete') {
      this.delete(e);
    } if (e.action == 'edit') {
      localStorage.setItem('packagesID', e.data.code);
      this.router.navigate(['pages/shipping/packaging/add']);
    }
  }
  addPackages() {
    localStorage.setItem('packagesID', '');
    this.router.navigate(['pages/shipping/packaging/add']);
  }
}
