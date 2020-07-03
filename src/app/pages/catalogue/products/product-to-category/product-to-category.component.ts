import { Component, OnInit } from '@angular/core';

import { CategoryService } from '../../categories/services/category.service';
import { ProductService } from '../services/product.service';
import { LocalDataSource } from 'ng2-smart-table';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../shared/services/storage.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'ngx-product-to-category',
  templateUrl: './product-to-category.component.html',
  styleUrls: ['./product-to-category.component.scss']
})
export class ProductToCategoryComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource();
  loadingList = false;
  categories = [];
  settings = {};

  // paginator
  perPage = 10;
  currentPage = 1;
  totalCount;

  // request params
  params = {
    lang: this.storageService.getLanguage(),
    count: this.perPage,
    page: 0
  };

  selectedCategory;
  availableList: any[];
  selectedList: any[];

  constructor(
    private translate: TranslateService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private storageService: StorageService,
  ) {
  }

  ngOnInit() {
    this.getList();
    this.productService.getListOfProducts({})
      .subscribe(res => {
        this.availableList = [...res.products];
        this.selectedList = [];
      });
  }

  getList() {
    this.categories = [];
    this.params.page = this.currentPage - 1;
    this.loadingList = true;
    this.categoryService.getListOfCategories(this.params)
      .subscribe(categories => {
        categories.categories.forEach((el) => {
          this.getChildren(el);
        });
        this.totalCount = categories.totalPages;
        this.source.load(this.categories);
        this.loadingList = false;
      });
    this.translate.onLangChange.subscribe((event) => {
    });
  }

  getChildren(node) {
    if (node.children && node.children.length !== 0) {
      this.categories.push(node);
      node.children.forEach((el) => {
        this.getChildren(el);
      });
    } else {
      this.categories.push(node);
    }
  }

  moveEvent(e, type) {
    switch (type) {
      case 'toTarget':
        // this.addProductToGroup(e.items[0].id, this.selectedGroup);
        this.productService.addProductToCategory(e.items[0].id, this.selectedCategory)
          .subscribe(res => {
            console.log(res);
          });
        break;
      case 'toSource':
        this.productService.removeProductFromCategory(e.items[0].id, this.selectedCategory)
          .subscribe(res => {
            console.log(res);
          });
        break;
      case 'allToTarget':
        // const addArray = [];
        // e.items.forEach((el) => {
        //   // const req = this.addProductToGroup(el.id, this.selectedGroup);
        //   // addArray.push(req);
        // });
        // console.log(addArray);
        // forkJoin(addArray).subscribe(res => {
        //   console.log(res);
        // });
        break;
      case 'allToSource':
        // const removeArr = [];
        // e.items.forEach((el) => {
        //   // const req = this.removeProductFromGroup(el.id, this.selectedGroup);
        //   // removeArr.push(req);
        // });
        // console.log(removeArr);
        // forkJoin(removeArr).subscribe(res => {
        //   console.log(res);
        // });
        break;
    }
  }

  addProductToCategory(productId, groupCode) {
    // this.productGroupsService.addProductToGroup(productId, groupCode)
    //   .subscribe(res => {
    //     console.log(res);
    //   });
  }

  removeProductFromCategory(productId, groupCode) {
    // this.productGroupsService.removeProductFromGroup(productId, groupCode)
    //   .subscribe(res => {
    //     console.log(res);
    //   });
  }

  selectGroup(categoryCode) {
    this.selectedCategory = categoryCode;
    this.productService.getListOfProducts({ category: this.selectedCategory })
      .subscribe(res => {
        console.log(res);
        this.selectedList = [...res.products];
        this.availableList = this.availableList.filter(n => !this.selectedList.some(n2 => n.id === n2.id));
      });
  }

}
