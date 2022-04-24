import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { CategoryService } from '../services/category.service';
import { LocalDataSource } from 'ng2-smart-table';
import { ButtonRenderComponent } from './button-render.component';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../../shared/components/showcase-dialog/showcase-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from '../../products/services/product.service';
import { StorageService } from '../../../shared/services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { ListingService } from '../../../shared/services/listing.service';

@Component({
  selector: 'ngx-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  listingService: ListingService;
  loadingList = false;
  loading: boolean = false;
  categories = [];
  settings = {};

  // paginator
  perPage = 25;
  currentPage = 1; //start base
  totalCount;
  roles;
  searchValue: string = '';

  // request params
  params = this.loadParams();

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private _sanitizer: DomSanitizer,
    private dialogService: NbDialogService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private productService: ProductService,
    private storageService: StorageService,

  ) {
    this.roles = JSON.parse(localStorage.getItem('roles'));
    this.listingService = new ListingService();
  }

  loadParams() {
    return {
      lang: this.storageService.getLanguage(),
      store: this.storageService.getMerchant(),
      count: this.perPage,
      page: 1
    };
  }

    /** callback methods for table list*/
    private loadList(newParams: any) {
      this.currentPage = 1; //back to page 1
      this.params = newParams;
      this.fetchTableData();
    }
  
    private resetList() {
      this.currentPage = 1;//back to page 1
      this.params = this.loadParams();
      this.getList();
    }
    /** */


  ngOnInit() {
    this.getList();
    this.translate.onLangChange.subscribe((lang) => {
      this.params.lang = this.storageService.getLanguage();
      this.getList();
    });

    //ng2-smart-table server side filter
    this.source.onChanged().subscribe((change) => {
      if (!this.loadingList) {//listing service
        this.listingService.filterDetect(this.params, change, this.loadList.bind(this), this.resetList.bind(this));
      }
    });

  }

  // creating array of categories include children
  //specific to category
  getChildren(node) {
    node.name = node.description.name;
    if (node.children && node.children.length !== 0) {
      this.categories.push(node);
      node.children.forEach((el) => {
        this.getChildren(el);
      });
    } else {
      this.categories.push(node);
    }
  }

  //specific to category
  getList() {
    this.categories = [];
    this.fetchTableData()  
    this.setSettings();
  }

  fetchTableData(){
    this.loadingList = true;
    var page = this.currentPage -1;
    this.params.page = page;
    this.categoryService.getListOfCategories(this.params)
      .subscribe(categories => {
        categories.categories.forEach((el) => {
          el.name = el.description.name;
          this.getChildren(el);

        });
        this.totalCount = categories.recordsTotal;
        this.source.load(this.categories);
        this.loadingList = false;
      });
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
          { name: 'details', title: '<i class="nb-edit"></i>' },
          { name: 'remove', title: this._sanitizer.bypassSecurityTrustHtml('<i class="nb-trash"></i>') }
        ],
      },
      pager: {
        display: false
      },
      columns: {
        id: {
          filter: false,
          title: this.translate.instant('COMMON.ID'),
          type: 'number',
        },
        store: {
          title: this.translate.instant('STORE.MERCHANT_STORE'),
          type: 'string',
          filter: false,
        },
        name: {
          title: this.translate.instant('CATEGORY.CATEGORY_NAME'),
          type: 'string',
          filter: true
        },
        code: {
          title: this.translate.instant('COMMON.CODE'),
          type: 'string',
          filter: false,
        },
        parent: {
          title: this.translate.instant('CATEGORY.PARENT'),
          type: 'string',
          filter: false,
          valuePrepareFunction: (parent) => {
            return parent ? parent.code : 'root';
          }
        },
        visible: {
          filter: false,
          title: this.translate.instant('COMMON.VISIBLE'),
          type: 'custom',
          renderComponent: ButtonRenderComponent,
          defaultValue: false,
        },
      },
    };
  }

  route(event) {
    switch (event.action) {
      case 'details':
        this.router.navigate(['pages/catalogue/categories/category/', event.data.id]);
        break;
      case 'remove':
        this.dialogService.open(ShowcaseDialogComponent, {})
          .onClose.subscribe(res => {
            if (res) {
              this.categoryService.deleteCategory(event.data.id)
                .subscribe(data => {
                  this.toastr.success(this.translate.instant('CATEGORY_FORM.CATEGORY_REMOVED'));
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

  createNew() {
    this.router.navigate(['pages/catalogue/categories/create-category']);
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

    this.params["name"] = query;
    this.getList();
    this.searchValue = query;

  }

}
