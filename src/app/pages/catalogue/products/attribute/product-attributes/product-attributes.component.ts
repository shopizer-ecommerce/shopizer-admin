import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
// import { TreeNode } from 'primeng/primeng';
import { ProductAttributesService } from '../../services/product-attributes.service';
import { OptionService } from '../../../options/services/option.service';
import { Attribute } from '../model/attribute';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../../shared/services/storage.service';
import { ActiveButtonComponent } from './active-button.component';
import { ShowcaseDialogComponent } from '../../../../shared/components/showcase-dialog/showcase-dialog.component';
import { NbDialogService } from '@nebular/theme';
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
  productId: any;
  loader = false;
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
  constructor(
    private productAttributesService: ProductAttributesService,
    private optionService: OptionService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private translate: TranslateService,
    private storageService: StorageService,
    private dialogService: NbDialogService,
    private router: Router
  ) {
    this.optionService.getListOfOptions({ count: 1000 })
      .subscribe(res => {
        this.options = [...res.options];
      });
  }
  loadParams() {
    return {
      // store: this.storageService.getMerchant(),
      lang: this.storageService.getLanguage(),
      count: this.perPage,
      page: 0
    };
  }
  ngOnInit() {
    this.productId = this.activatedRoute.snapshot.paramMap.get('productId');
    this.getList();
    this.translate.onLangChange.subscribe((lang) => {
      this.params.lang = this.storageService.getLanguage();
      this.getList();
    });
  }

  getList() {
    this.loader = true;
    this.productAttributesService.getListOfProductsAttributes(this.productId, this.params)
      .subscribe(res => {
        // this.isEmpty = res.attributes.length === 0;
        // const newArr = this.prepareData(res.attributes);
        // this.data = [...newArr];
        if (res.attributes && res.attributes.length !== 0) {
          this.source.load(res.attributes);
        } else {
          this.source.load([]);
        }
        this.totalCount = res.recordsTotal;
        this.loader = false;
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


  // prepareData(basicArray) {
  //   const parentArray = [];
  //   // create options groups
  //   this.options.forEach((option) => {
  //     const parent: TreeNode = {
  //       data: {
  //         id: option.id,
  //         parentName: option.code,
  //         parent: true
  //       },
  //       expanded: true,
  //       children: []
  //     };
  //     parentArray.push(parent);
  //   });
  //   // fill each group by data
  //   parentArray.forEach((parent) => {
  //     basicArray.forEach((attribute) => {
  //       if (parent.data.parentName === attribute.option.code) {
  //         parent.children.push({
  //           data: {
  //             ...attribute,
  //             option: attribute.option.code,
  //             optionValue: attribute.optionValue.code,
  //           }
  //         });
  //       }
  //     });
  //   });
  //   // find empty children's arrays
  //   parentArray.forEach((parent) => {
  //     if (parent.children.length === 0) {
  //       parent.data.empty = true;
  //     }
  //   });
  //   return parentArray;
  // }
  route(event) {
    console.log(event)
    switch (event.action) {
      case 'edit':
        this.router.navigate(['/pages/catalogue/products/' + this.productId + '/attribute/' + event.data.id]);
        break;
      case 'remove':
        this.removeAttribute(event.data.id);
        break;

    }
  }
  removeAttribute(id) {
    this.loader = true;
    this.dialogService.open(ShowcaseDialogComponent, {})
      .onClose.subscribe(res => {
        if (res) {
          this.productAttributesService.deleteAttribute(this.productId, id).subscribe(res => {
            this.getList();
            this.toastr.success(this.translate.instant('PRODUCT_ATTRIBUTES.PRODUCT_ATTRIBUTES_REMOVED'));
          });
        } else {
          this.loader = false;
          // event.confirm.reject();
        }
      });

  }

}
