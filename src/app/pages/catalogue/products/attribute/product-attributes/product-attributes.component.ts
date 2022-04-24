import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { ProductAttributesService } from '../../services/product-attributes.service';
import { ProductService } from '../../services/product.service';
import { AttributeFormComponent } from '../attribute-form/attribute-form.component';
import { OptionService } from '../../../options/services/option.service';
import { Attribute } from '../model/attribute';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../../shared/services/storage.service';
import { ShowcaseDialogComponent } from '../../../../shared/components/showcase-dialog/showcase-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { ListingService } from '../../../../shared/services/listing.service';

export interface TreeNode {
  data?: Attribute;
  children?: TreeNode[];
  leaf?: boolean;
  expanded: boolean;
}

@Component({
  selector: 'ngx-product-attributes',
  templateUrl: './product-attributes.component.html',
  styleUrls: ['./product-attributes.component.scss']
})
export class ProductAttributesComponent implements OnInit {

  id : any;
  loaded = false;
  loading = false;
  loadingList = false;


  data: TreeNode[] = [];
  source: LocalDataSource = new LocalDataSource();
  options = [];
  listingService: ListingService;


  isEmpty = false;
  settings = {};
  perPage = 20;
  currentPage = 1;
  totalCount;

  params = this.loadParams();
  public input: string = '<input type="checkbox"></input>';
  constructor(
    private productAttributesService: ProductAttributesService,
    private productService: ProductService,
    private location: Location,
    private optionService: OptionService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private translate: TranslateService,
    private storageService: StorageService,
    private dialogService: NbDialogService,
    private router: Router,
    private _sanitizer: DomSanitizer
  ) {
    this.optionService.getListOfOptions({ count: 1000 })
      .subscribe(res => {
        this.options = [...res.options];
      });
  }
  loadParams() {
    return {
      store: this.storageService.getMerchant(),
      lang: "_all",
      count: this.perPage,
      page: 0,
    };
  }



  ngOnInit() {

    this.id = this.productService.getProductIdRoute(this.router,this.location);

    //specify add image url to image component
    let el = document.getElementById('tabs');
    el.scrollIntoView();
    this.getList();

    this.translate.onLangChange.subscribe((lang) => {
      this.params.lang = this.storageService.getLanguage();
      this.getList();
    });

    //ng2-smart-table server side filter
    this.source.onChanged().subscribe((change) => {
      //if (!this.loadingList) {//listing service
      //    this.listingService.filterDetect(this.params, change, this.loadList.bind(this), this.resetList.bind(this));
      //}
    });
  }



  getList() {
    var page = this.currentPage -1;
    this.params.page = page;
    this.loading = true;
    this.productAttributesService.getListOfProductsAttributes(this.id, this.params)
      .subscribe(res => {
        var tempArray = res.attributes.filter((value) => {
          return value.attributeDisplayOnly === false;
        });
        if (tempArray.length !== 0) {
          this.source.load(tempArray);
        } else {
          this.source.load([]);
        }
        this.totalCount = res.recordsTotal;
        this.loading = false;
      });
    this.setSettings();
  }
  setSettings() {
    this.settings = {
      hideSubHeader: true,
      actions: {
        columnTitle: this.translate.instant('ORDER.ACTIONS'),
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
          editable: false,
          filter: false
        },
        option: {
          title: this.translate.instant('PRODUCT_ATTRIBUTES.OPTION_NAME'),
          type: 'string',
          editable: false,
          filter: false,
          valuePrepareFunction: (name) => {
            return name.code;
          }
        },
        optionValue: {
          title: this.translate.instant('PRODUCT_ATTRIBUTES.PRODUCT_OPTION'),
          type: 'string',
          editable: false,
          filter: false,
          valuePrepareFunction: (name) => {
            return name.code;
          }
        },
        /**
        attributeDisplayOnly: {
           filter: false,
           title: this.translate.instant('PRODUCT_ATTRIBUTES.DISPLAY_ONLY'),
           type: 'custom',
           renderComponent: ActiveButtonComponent,
           defaultValue: false,
           editable: true,
           editor: {
             type: 'checkbox'
           }
         },
        **/
       /**
        attributeDisplayOnly: {
          title: this.translate.instant('PRODUCT_ATTRIBUTES.DISPLAY_ONLY'),
          type: 'html',
          valuePrepareFunction: (value) => { return this._sanitizer.bypassSecurityTrustHtml(this.input) },
          filter: false
        },
        **/
        productAttributePrice: {
          title: this.translate.instant('PRODUCT_ATTRIBUTES.PRICE'),
          type: 'string',
          editable: false,
          filter: false
        },
        sortOrder: {
          title: this.translate.instant('COMMON.ORDER'),
          type: 'string',
          editable: false,
          filter: false
        }
      }
    };
  }

  // paginator
  changePage(event) {
    console.log(JSON.stringify(event));
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

  route(event) {
    switch (event.action) {
      case 'edit':
        this.dialogService.open(AttributeFormComponent, {
          context: {
            productId: this.id,
            attributeId: event.data.id
          }
        }).onClose.subscribe(res => {
          this.getList()
        });
        break;
      case 'remove':
        this.removeAttribute(event.data.id);
        break;

    }
  }
  onClickAdd() {
    this.dialogService.open(AttributeFormComponent, {
      context: {
        productId: this.id
      }
    }).onClose.subscribe(res => {
      this.getList()
    });
  }
  removeAttribute(id) {
    this.loading=true;
    this.dialogService.open(ShowcaseDialogComponent, {})
      .onClose.subscribe(res => {
        if (res) {
          this.loading=false;
                                                      //product id, attribute id
          this.productAttributesService.deleteAttribute(this.id, id).subscribe(res => {
            this.getList();
            this.toastr.success(this.translate.instant('PRODUCT_ATTRIBUTES.PRODUCT_ATTRIBUTES_REMOVED'));
          });
          this.loading=false;
        } else {
          this.loading=false;
        }
      });
  }


  
}
