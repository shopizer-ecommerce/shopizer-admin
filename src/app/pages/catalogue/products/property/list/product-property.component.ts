import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PropertiesService } from '../../services/product-properties';
import { ProductAttributesService } from '../../services/product-attributes.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../../shared/services/storage.service';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService } from '@nebular/theme';
import { ProductPropertyForm } from '../form/product-property-form.component';
import { ToastrService } from 'ngx-toastr';
import { ShowcaseDialogComponent } from '../../../../shared/components/showcase-dialog/showcase-dialog.component';
@Component({
  selector: 'ngx-product-property',
  templateUrl: './product-property.component.html',
  styleUrls: ['./product-property.component.scss']
})
export class ProductProperties implements OnInit {
  @Input() product;
  @Output() loading = new EventEmitter<any>();


  source: LocalDataSource = new LocalDataSource();
  settings = {};
  perPage = 20;
  currentPage = 1;
  totalCount;

  params = this.loadParams();

  constructor(
    private propertiesService: PropertiesService,
    private productAttributesService: ProductAttributesService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private storageService: StorageService,
    private dialogService: NbDialogService,
  ) {

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
    this.getProductProperties();
    this.translate.onLangChange.subscribe((lang) => {
      this.params.lang = this.storageService.getLanguage();
      this.getProductProperties();
    });
  }

  getProductProperties() {
    this.loading.emit(true);
    this.productAttributesService.getListOfProductsAttributes(this.product.id, this.params)
      .subscribe(res => {
        var tempArray = res.attributes.filter((value) => {
          return value.attributeDisplayOnly === true;
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
            return name.description.name;
          }
        },
        // productAttributePrice: {
        //   title: this.translate.instant('PRODUCT_ATTRIBUTES.PRICE'),
        //   type: 'string',
        //   editable: false,
        //   filter: false
        // }
      }
    };
  }
  onClickAdd() {
    this.dialogService.open(ProductPropertyForm, {
      context: {
        product: this.product
      }
    }).onClose.subscribe(res => {
      this.getProductProperties()
    });
  }

  route(event) {
    console.log(event)
    switch (event.action) {
      case 'edit':
        this.dialogService.open(ProductPropertyForm, {
          context: {
            product: this.product,
            attributeId: event.data.id
          }
        }).onClose.subscribe(res => {
          this.getProductProperties()
        });
        // this.router.navigate(['/pages/catalogue/products/' + this.productId + '/attribute/' + event.data.id]);
        break;
      case 'remove':
        this.removeAttribute(event.data.id);
        break;

    }
  }
  removeAttribute(id) {

    this.dialogService.open(ShowcaseDialogComponent, {})
      .onClose.subscribe(res => {
        if (res) {
          this.loading.emit(true);
          this.productAttributesService.deleteAttribute(this.product.id, id).subscribe(res => {
            this.getProductProperties();
            this.toastr.success(this.translate.instant('PROPERTY.PRODUCT_PROPERTY_REMOVED'));
          });
          this.loading.emit(false);
        } else {
          this.loading.emit(false);
        }
      });

  }

}
