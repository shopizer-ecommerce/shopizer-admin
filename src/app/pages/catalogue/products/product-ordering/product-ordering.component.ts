import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ProductService } from '../services/product.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CategoryService } from '../../categories/services/category.service';
import { StorageService } from '../../../shared/services/storage.service';
@Component({
  selector: 'ngx-product-ordering',
  templateUrl: './product-ordering.component.html',
  styleUrls: ['./product-ordering.component.scss']
})
export class ProductOrderingComponent implements OnInit {

  products = [];
  loadingList = false;
  loading: boolean = false;
  stores = [];
  isSuperadmin: boolean;
  selectedStore: String = '';
  // paginator
  data = [];
  category: any = '';
  categoryData: Array<any> = [];
  categoryTemp: Array<any> = [];
  // server params
  params = this.loadParams();

  settings = {};

  constructor(
    private productService: ProductService,
    private translate: TranslateService,
    private router: Router,
    private categoryService: CategoryService,
    private storageService: StorageService
  ) { }

  loadParams() {
    return {
      count: 50,
      page: 0,
      lang: localStorage.getItem('lang')
    };
  }
  ngOnInit(): void {
    this.getList();
    this.getCategory();
    this.translate.onLangChange.subscribe((lang) => {
      this.params.lang = this.storageService.getLanguage();
      this.getList();
    });
  }

  searchCategory() {
    this.getCategory()
  }
  onSelectCategory(event) {
    this.categoryTemp.map((item) => {
      if (event == item.name) {

        this.productService.getProductOrderById(item.id).subscribe(res => {
          if (res.products.length == 0) {
            this.data = []
          }
          else {
            res.products.map((item) => {
              this.data.push({
                id: item.id,
                name: item.name,
                sku: item.sku,
                quantity: item.quantity,
                price: item.price,
                creationDate: item.creationDate
              })
            })
          }

        })
      }
    })


  }


  getList() {
    this.loadingList = true;
    this.productService.getProductByOrder()
      .subscribe(res => {
        this.loadingList = false;
        res.products.map((item) => {
          this.data.push({
            id: item.id,
            name: item.name,
            sku: item.sku,
            quantity: item.quantity,
            price: item.price,
            creationDate: item.creationDate
          })
        })
      });
  }
  getCategory() {
    this.categoryService.getListOfCategories(this.params)
      .subscribe(categories => {
        console.log(categories)
        let tempValue = [];
        categories.categories.forEach((value) => {
          tempValue.push(value.code);
          this.categoryTemp.push({ 'id': value.id, 'name': value.description.name.toLowerCase() })
        })
        this.categoryData = tempValue
      });
    console.log("data::", this.categoryTemp);

  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.data, event.previousIndex, event.currentIndex);
  }
}
