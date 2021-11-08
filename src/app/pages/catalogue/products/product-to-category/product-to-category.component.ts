import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { CategoryService } from '../../categories/services/category.service';
import { ProductService } from '../services/product.service';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../shared/services/storage.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
    selector: 'ngx-product-to-category',
    templateUrl: './product-to-category.component.html',
    styleUrls: ['./product-to-category.component.scss']
})
export class ProductToCategoryComponent implements OnInit {
    @Input() product;
    @Output() loading = new EventEmitter<any>();

    perPage: number = 50;//ideally display all category
    currentPage: number = 1;

    dropdownList = [];
    categories = [];
    selectedItems = [];
    dropdownSettings = {};
    categoryLoading = false;
    filteredCategories = [];

    params = this.loadParams();
    constructor(
        private translate: TranslateService,
        private categoryService: CategoryService,
        private storageService: StorageService,
        private productService: ProductService,
    ) {
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'name',
            enableCheckAll: false,
            searchPlaceholderText: 'Search by code',
            // unSelectAllText: 'UnSelect All',
            itemsShowLimit: 10,
            allowSearchFilter: true,
            allowRemoteDataSearch: true

        };
    }
    loadParams() {
        return {
            count: this.perPage,
            page: 0,
            lang: localStorage.getItem('lang')
        };
    }
    ngOnInit() {
        // console.log(this.pro duct)
        if (this.product.categories.length > 0) {
            this.product.categories.forEach((data) => {
                // console.log('Current product has' + JSON.stringify(data));
                //this.categories.push(data);
                this.selectedItems.push({ 'id': data.id, 'name': data.code })
            });
        }
        this.product
        this.getList();
    }

    getList() {
        this.categoryLoading = true;
        this.params.page = this.currentPage - 1;
        this.loading.emit(true);
        // this.loading = true;
        this.categoryService.getListOfCategories(this.params)
            .subscribe(categories => {
                categories.categories.forEach((value) => {
                    //console.log(JSON.stringify(value));
                    this.getChildren(value);

                })
                //console.log(JSON.stringify(this.categories));
                this.loading.emit(false);
                this.categoryLoading = false;
            });
    }

    getChildren(node) {
        // console.log('CATEGORY ' + JSON.stringify(node));
        if (node.children && node.children.length !== 0) {
            this.categories.push({ 'id': node.id, 'name': node.description.name })
            node.children.forEach((el) => {
                this.getChildren(el);
            });
        } else {
            this.categories.push({ 'id': node.id, 'name': node.description.name })
        }
    }

    onFilterChange(e) {
        console.log(e);
        if (e.length > 2) {
            this.params["name"] = e;
            this.categoryService.filterCategory(this.params).subscribe(res => {
            }, error => {

            }
            )
            // this.getList();
        }
        // this.loading = true;
    }

    onItemSelect(item: any) {
        this.loading.emit(true);
        this.addProductToCategory(this.product.id, item.id)
        // this.loading = true;
    }
    onItemDeSelect(item: any) {
        this.loading.emit(true);
        this.removeProductFromCategory(this.product.id, item.id)
    }
    addProductToCategory(productId, groupCode) {
        this.productService.addProductToCategory(productId, groupCode)
            .subscribe(res => {
                console.log(res, '========');
                this.loading.emit(false);
            });
    }

    removeProductFromCategory(productId, groupCode) {
        this.productService.removeProductFromCategory(productId, groupCode)
            .subscribe(res => {
                console.log(res);
                this.loading.emit(false);
            });
    }


}
