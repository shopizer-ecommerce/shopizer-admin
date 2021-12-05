import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { BrandService } from '../services/brand.service';
import { LocalDataSource } from 'ng2-smart-table';
import { TranslateService } from '@ngx-translate/core';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../../shared/components/showcase-dialog/showcase-dialog.component';
import { StorageService } from '../../../shared/services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { listenerCount } from 'process';

@Component({
  selector: 'ngx-brands-list',
  templateUrl: './brands-list.component.html',
  styleUrls: ['./brands-list.component.scss']
})
export class BrandsListComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  loadingList = false;
  settings = {};
  searchValue: string = '';
  // paginator
  perPage = 25;
  currentPage = 1;
  totalCount;

  // request params
  params = {
    lang: this.storageService.getLanguage(),
    store: this.storageService.getMerchant(),
    count: this.perPage,
    page: 0
  };

  constructor(
    private brandService: BrandService,
    private router: Router,
    private _sanitizer: DomSanitizer,
    private dialogService: NbDialogService,
    private translate: TranslateService,
    private storageService: StorageService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
    this.getList();
    this.translate.onLangChange.subscribe((lang) => {
      this.params.lang = this.storageService.getLanguage();
      this.getList();
    });
  }

  getList() {
    this.params.page = this.currentPage - 1;
    this.loadingList = true;
    this.brandService.getListOfBrands(this.params)
      .subscribe(brands => {
        this.totalCount = brands.recordsTotal;
        this.source.load(brands.manufacturers);
        this.loadingList = false;
      });
    this.setSettings();
  }
  onSelectStore(e) {
    this.params["store"] = e;
    this.getList();
  }
  setSettings() {
    this.settings = {
      actions: {
        columnTitle: '',
        add: false,
        edit: false,
        delete: false,
        position: 'right',
        sort: true,
        custom: [
          { name: 'details', title: this._sanitizer.bypassSecurityTrustHtml('<i class="nb-edit"></i>') },
          { name: 'remove', title: this._sanitizer.bypassSecurityTrustHtml('<i class="nb-trash"></i>') }
        ],
      },
      pager: { display: false },
      columns: {
        id: {
          filter: false,
          title: this.translate.instant('COMMON.ID'),
          type: 'number',
        },
        description: {
          title: this.translate.instant('BRAND.BRAND_NAME'),
          type: 'string',
          valuePrepareFunction: (description) => {
            if (description) {
              return description.name;
            }
          }
        },
        code: {
          title: this.translate.instant('COMMON.CODE'),
          type: 'string',
        },
      },
    };
  }

  route(event) {
    switch (event.action) {
      case 'details':
        this.router.navigate(['pages/catalogue/brands/brand/', event.data.id]);
        break;
      case 'remove':
        this.dialogService.open(ShowcaseDialogComponent, {})
          .onClose.subscribe(res => {
            if (res) {
              this.brandService.deleteBrand(event.data.id)
                .subscribe(data => {
                  this.toastr.success(this.translate.instant('BRAND.BRAND_REMOVED'));
                  this.getList();
                });
            }
          });
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
