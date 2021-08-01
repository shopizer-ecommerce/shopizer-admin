import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
// import { TreeNode } from 'primeng/primeng';
import { ProductAttributesService } from '../../services/product-attributes.service';
import { AttributeFormComponent } from '../attribute-form/attribute-form.component';
import { OptionService } from '../../../options/services/option.service';
import { Attribute } from '../model/attribute';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../../shared/services/storage.service';
import { ShowcaseDialogComponent } from '../../../../shared/components/showcase-dialog/showcase-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { DomSanitizer } from '@angular/platform-browser';
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
  @Input() productId;
  @Output() loading = new EventEmitter<any>();
  // loader = false;
  data: TreeNode[] = [];
  source: LocalDataSource = new LocalDataSource();
  options = [];

  // params = {
  //   lang: this.storageService.getLanguage(),
  //   count: 1000,
  // };
  isEmpty = false;
  settings = {};
  perPage = 20;
  currentPage = 1;
  totalCount;

  params = this.loadParams();
  public input: string = '<input type="checkbox"></input>';
  constructor(
    private productAttributesService: ProductAttributesService,
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
      page: 0
    };
  }
  ngOnInit() {
    // this.productId = this.activatedRoute.snapshot.paramMap.get('productId');
    this.getList();
    this.translate.onLangChange.subscribe((lang) => {
      this.params.lang = this.storageService.getLanguage();
      this.getList();
    });
  }

  getList() {
    this.loading.emit(true);
    this.productAttributesService.getListOfProductsAttributes(this.productId, this.params)
      .subscribe(res => {
        // this.isEmpty = res.attributes.length === 0;
        // const newArr = this.prepareData(res.attributes);
        // this.data = [...newArr];
        var tempArray = res.attributes.filter((value) => {
          return value.attributeDisplayOnly === false;
        });
        if (tempArray.length !== 0) {
          this.source.load(tempArray);
        } else {
          this.source.load([]);
        }
        this.totalCount = res.recordsTotal;
        this.loading.emit(false);
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
        // attributeDisplayOnly: {
        //   filter: false,
        //   title: this.translate.instant('PRODUCT_ATTRIBUTES.DISPLAY_ONLY'),
        //   type: 'custom',
        //   renderComponent: ActiveButtonComponent,
        //   defaultValue: false,
        //   editable: true,
        //   editor: {
        //     type: 'checkbox'
        //   }
        // },
        attributeDisplayOnly: {
          title: this.translate.instant('PRODUCT_ATTRIBUTES.DISPLAY_ONLY'),
          type: 'html',
          valuePrepareFunction: (value) => { return this._sanitizer.bypassSecurityTrustHtml(this.input) },
          filter: false
        },
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


  route(event) {
    console.log(event)
    switch (event.action) {
      case 'edit':
        this.dialogService.open(AttributeFormComponent, {
          context: {
            productId: this.productId,
            attributeId: event.data.id
          }
        }).onClose.subscribe(res => {
          this.getList()
        });
        // this.router.navigate(['/pages/catalogue/products/' + this.productId + '/attribute/' + event.data.id]);
        break;
      case 'remove':
        this.removeAttribute(event.data.id);
        break;

    }
  }
  onClickAdd() {
    console.log('jaimin')
    this.dialogService.open(AttributeFormComponent, {
      context: {
        productId: this.productId
      }
    }).onClose.subscribe(res => {
      this.getList()
    });
  }
  removeAttribute(id) {
    // this.loading.emit(true);
    this.dialogService.open(ShowcaseDialogComponent, {})
      .onClose.subscribe(res => {
        if (res) {
          this.loading.emit(true);
          this.productAttributesService.deleteAttribute(this.productId, id).subscribe(res => {
            this.getList();
            this.toastr.success(this.translate.instant('PRODUCT_ATTRIBUTES.PRODUCT_ATTRIBUTES_REMOVED'));
          });
          this.loading.emit(false);
        } else {
          this.loading.emit(false);
          // event.confirm.reject();
        }
      });

  }

}
