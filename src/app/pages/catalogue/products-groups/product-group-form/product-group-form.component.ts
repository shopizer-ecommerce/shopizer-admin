import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { ProductGroupsService } from '../services/product-groups.service';
import { Router, ActivatedRoute } from '@angular/router';

import { StorageService } from '../../../shared/services/storage.service';
import { validators } from '../../../shared/validation/validators';
import { TranslateService } from '@ngx-translate/core';

import { ProductService } from '../../products/services/product.service';

@Component({
  selector: 'ngx-product-group-form',
  templateUrl: './product-group-form.component.html',
  styleUrls: ['./product-group-form.component.scss']
})
export class ProductGroupFormComponent implements OnInit {
  form: FormGroup;
  isCodeUnique = true;
  uniqueCode: string;
  loading: boolean = false;
  selectedItems = [];
  dropdownSettings = {};
  perPage = 50;
  params = this.loadParams();
  itemsParams = this.loadItemsParams();
  products: Array<any> = [];
  constructor(
    private fb: FormBuilder,
    private productGroupsService: ProductGroupsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private productService: ProductService,
    private translate: TranslateService,
  ) {
    this.uniqueCode = this.activatedRoute.snapshot.paramMap.get('code');
    if (this.uniqueCode) {
      this.getProductByCode();
    }
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      enableCheckAll: false,
      searchPlaceholderText: this.translate.instant('COMMON.SEARCH'),
      // unSelectAllText: 'UnSelect All',
      itemsShowLimit: 7,
      allowSearchFilter: true,
      allowRemoteDataSearch: true

    };
  }
  loadParams() {
    return {
      store: this.storageService.getMerchant(),
      lang: this.storageService.getLanguage(),
      count: this.perPage,
      page: 0
    };
  }

  loadItemsParams() {
    return {
      store: this.storageService.getMerchant(),
      lang: this.storageService.getLanguage()
    };
  }

  ngOnInit() {
    this.createForm();
  }

  getProductList() {
    this.productService.getListOfProducts(this.params)
      .subscribe(res => {
        let temp = []
        res.products.map((value) => {
          temp.push({ 'id': value.id, 'name': value.description.name })
        });
        this.products = temp;
      });
  }
  getProductByCode() {
    this.productGroupsService.getProductsByGroup(this.uniqueCode, this.itemsParams)
      .subscribe(res => {
        let temp = []
        res.products.map((value) => {
          temp.push({ 'id': value.id, 'name': value.description.name })
        });
        this.selectedItems = temp;

        this.getProductList()
        this.createForm();

        this.fillForm();
      });
  }

  onFilterChange(e) {
    if (e.length > 3) {
      this.params["name"] = e;
      this.getProductList();
    }
    if (e === '') {
      this.params = this.loadParams();
      this.getProductList();
    }
  }

  get code() {
    return this.form.get('code');
  }

  private createForm() {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(validators.alphanumericwithhyphen)]],
      active: [true],
      product: [this.selectedItems]
    });
  }
  private fillForm() {
    let data = JSON.parse(localStorage.getItem('groupData'));
    this.form.patchValue({
      code: data.code,
      active: data.active,
    });

  }
  checkCode(event) {
    // const code = event.target.value.trim();
    // this.productGroupsService.checkGroupCode(code)
    //   .subscribe(res => {
    //     this.isCodeUnique = !(res.exists && (this.option.code !== code));
    //   });
  }

  save() {
    this.productGroupsService.createProductGroup(this.form.value).subscribe(res => {
      this.router.navigate(['pages/catalogue/products-groups/groups-list']);
    });
  }
  update() {
    this.productGroupsService.updateGroupActiveValue(this.form.value)
      .subscribe(res => {
        this.router.navigate(['pages/catalogue/products-groups/groups-list']);
      });
  }
  goToback() {
    this.router.navigate(['pages/catalogue/products-groups/groups-list']);
  }

  onItemSelect(item: any) {
    this.addProductToGroup(item.id, this.uniqueCode)
    // this.loading = true;
  }
  onItemDeSelect(item: any) {
    this.removeProductFromGroup(item.id, this.uniqueCode)
  }
  addProductToGroup(productId, groupCode) {
    this.loading = true;
    this.productGroupsService.addProductToGroup(productId, groupCode)
      .subscribe(res => {
        this.loading = false;
      });
  }

  removeProductFromGroup(productId, groupCode) {
    this.loading = true;
    this.productGroupsService.removeProductFromGroup(productId, groupCode)
      .subscribe(res => {
        this.loading = false;
      });
  }

}
