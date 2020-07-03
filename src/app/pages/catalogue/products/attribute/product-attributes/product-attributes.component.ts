import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// import { TreeNode } from 'primeng/primeng';
import { ProductAttributesService } from '../../services/product-attributes.service';
import { OptionService } from '../../../options/services/option.service';
import { Attribute } from '../model/attribute';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../../shared/services/storage.service';

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
  productId;
  loader = false;
  data: TreeNode[] = [];
  options = [];
  params = {
    lang: this.storageService.getLanguage(),
    count: 1000,
  };
  isEmpty = false;

  constructor(
    private productAttributesService: ProductAttributesService,
    private optionService: OptionService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private translate: TranslateService,
    private storageService: StorageService,
  ) {
    this.optionService.getListOfOptions({ count: 1000 })
      .subscribe(res => {
        this.options = [...res.options];
      });
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
        this.isEmpty = res.attributes.length === 0;
        const newArr = this.prepareData(res.attributes);
        this.data = [...newArr];
        this.loader = false;
      });
  }

  prepareData(basicArray) {
    const parentArray = [];
    // create options groups
    this.options.forEach((option) => {
      const parent: TreeNode = {
        data: {
          id: option.id,
          parentName: option.code,
          parent: true
        },
        expanded: true,
        children: []
      };
      parentArray.push(parent);
    });
    // fill each group by data
    parentArray.forEach((parent) => {
      basicArray.forEach((attribute) => {
        if (parent.data.parentName === attribute.option.code) {
          parent.children.push({
            data: {
              ...attribute,
              option: attribute.option.code,
              optionValue: attribute.optionValue.code,
            }
          });
        }
      });
    });
    // find empty children's arrays
    parentArray.forEach((parent) => {
      if (parent.children.length === 0) {
        parent.data.empty = true;
      }
    });
    return parentArray;
  }

  removeAttribute(id) {
    this.productAttributesService.deleteAttribute(this.productId, id).subscribe(res => {
      this.getList();
      this.toastr.success(this.translate.instant('PRODUCT_ATTRIBUTES.PRODUCT_ATTRIBUTES_REMOVED'));
    });
  }

}
