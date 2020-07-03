import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ManufactureService } from '../../../shared/services/manufacture.service';
import { ConfigService } from '../../../shared/services/config.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../services/product.service';
import { ProductImageService } from '../services/product-image.service';
import { TranslateService } from '@ngx-translate/core';
import { validators } from '../../../shared/validation/validators';
import { slugify } from '../../../shared/utils/slugifying';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'ngx-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  @Input() product;
  form: FormGroup;
  loader = false;
  manufacturers = [];
  languages = [];
  productTypes = [];
  config = {
    placeholder: '',
    tabsize: 2,
    height: 300,
    uploadImagePath: '',
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
  };
  isCodeUnique = true;
  uploadData = new FormData();
  removedImagesArray = [];
  saved = false;

  constructor(
    private fb: FormBuilder,
    private manufactureService: ManufactureService,
    private configService: ConfigService,
    private toastr: ToastrService,
    private productService: ProductService,
    private productImageService: ProductImageService,
    private router: Router,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
    this.loader = true;
    const manufacture$ = this.manufactureService.getManufacturers();
    const product$ = this.productService.getProductTypes();
    const config$ = this.configService.getListOfSupportedLanguages();
    forkJoin(manufacture$, product$, config$)
      .subscribe(([manufacturers, productTypes, languages]) => {
        this.manufacturers = [...manufacturers.manufacturers];
        this.productTypes = [...productTypes];
        this.languages = [...languages];
        this.createForm();
        this.addFormArray();
        if (this.product.id) {
          this.fillForm();
        }
        this.loader = false;
      });
  }

  private createForm() {
    this.form = this.fb.group({
      sku: ['', [Validators.required, Validators.pattern(validators.alphanumeric)]],
      available: [false],
      preOrder: [false],
      dateAvailable: [new Date()],
      manufacturer: ['DEFAULT'],
      type: ['GENERAL'],
      price: [''],
      quantity: ['', [Validators.required, Validators.pattern(validators.number)]],
      sortOrder: ['', [Validators.required, Validators.pattern(validators.number)]],
      productShipeable: [false, [Validators.required]],
      productSpecifications: this.fb.group({
        weight: ['', [Validators.pattern(validators.number)]],
        height: ['', [Validators.pattern(validators.number)]],
        width: ['', [Validators.pattern(validators.number)]],
        length: ['', [Validators.pattern(validators.number)]],
      }),
      // placementOrder: [0, [Validators.required]],  // ???
      // taxClass: [0, [Validators.required]], // ???
      selectedLanguage: ['', [Validators.required]],
      descriptions: this.fb.array([]),
    });
  }

  addFormArray() {
    const control = <FormArray>this.form.controls.descriptions;
    this.languages.forEach(lang => {
      control.push(
        this.fb.group({
          language: [lang.code, [Validators.required]],
          name: ['', [Validators.required]],
          highlights: [''],
          friendlyUrl: ['', [Validators.required]],
          description: [''],
          title: [''],
          keyWords: [''],
          metaDescription: [''],
        })
      );
    });
  }

  fillForm() {
    this.form.patchValue({
      sku: this.product.sku,
      available: this.product.available,
      preOrder: this.product.preOrder,
      dateAvailable: this.product.dateAvailable,
      manufacturer: this.product.manufacturer.code,
      type: this.product.type.code,
      price: this.product.price,
      quantity: this.product.quantity,
      sortOrder: this.product.sortOrder,
      productShipeable: this.product.productShipeable,
      // placementOrder: [0, [Validators.required]],  // ???
      // taxClass: [0, [Validators.required]], // ???
      selectedLanguage: 'en',
      descriptions: [],
    });
    this.fillFormArray();
    const dimension = {
      weight: this.product.productSpecifications.weight,
      height: this.product.productSpecifications.height,
      width: this.product.productSpecifications.width,
      length: this.product.productSpecifications.length,
    };
    this.form.patchValue({ productSpecifications: dimension });
  }

  fillFormArray() {
    this.form.value.descriptions.forEach((desc, index) => {
      this.product.descriptions.forEach((description) => {
        if (desc.language === description.language) {
          (<FormArray>this.form.get('descriptions')).at(index).patchValue({
            language: description.language,
            name: description.name,
            highlights: description.highlights,
            friendlyUrl: description.friendlyUrl,
            description: description.description,
            title: description.title,
            keyWords: description.keyWords,
            metaDescription: description.metaDescription,
          });
        }
      });
    });
  }

  get sku() {
    return this.form.get('sku');
  }

  get selectedLanguage() {
    return this.form.get('selectedLanguage');
  }

  get descriptions(): FormArray {
    return <FormArray>this.form.get('descriptions');
  }

  changeName(event, index) {
    (<FormArray>this.form.get('descriptions')).at(index).patchValue({
      friendlyUrl: slugify(event)
    });
  }

  onImageChanged(event) {
    switch (event.type) {
      case 'add': {
        this.uploadData.append('file[]', event.data, event.data.name);
        break;
      }
      case 'remove': {
        this.removedImagesArray.push(event.data);
        break;
      }
      case 'remove-one': {
        const fd = new FormData();
        this.uploadData.delete(event.data.name);
        this.uploadData.forEach((img) => {
          if (img['name'] !== event.data.name) {
            fd.append('file[]', img, img['name']);
          }
        });
        this.uploadData = new FormData();
        this.uploadData = fd;
        break;
      }
    }
  }

  checkSku(event) {
    const sku = event.target.value;
    this.productService.checkProductSku(sku)
      .subscribe(res => {
        this.isCodeUnique = !(res.exists && (this.product.sku !== sku));
      });
  }

  removeImages(array) {
    array.forEach((el) => {
      this.productImageService.removeImage(el)
        .subscribe(res1 => {
        }, error => {
          console.log('Something went wrong', error);
        });
    });
  }

  save() {
    if (!this.isCodeUnique) {
      this.toastr.error(this.translate.instant('COMMON.CODE_EXISTS'));
      return;
    }

    const productObject = this.form.value;
    productObject.dateAvailable = moment(productObject.dateAvailable).format('YYYY-MM-DD');
    productObject.productSpecifications.manufacturer = productObject.manufacturer;
    // productObject.type = this.productTypes.find((type) => type.code === productObject.type); // TODO

    // save important values for filling empty field in result object
    const tmpObj = {
      name: '',
      friendlyUrl: ''
    };
    productObject.descriptions.forEach((el) => {
      if (tmpObj.name === '' && el.name !== '') {
        tmpObj.name = el.name;
      }
      if (tmpObj.friendlyUrl === '' && el.friendlyUrl !== '') {
        tmpObj.friendlyUrl = el.friendlyUrl;
      }
      for (const elKey in el) {
        if (el.hasOwnProperty(elKey)) {
          if (!tmpObj.hasOwnProperty(elKey) && el[elKey] !== '') {
            tmpObj[elKey] = el[elKey];
          }
        }
      }
    });

    // check required fields
    if (tmpObj.name === '' || tmpObj.friendlyUrl === '' || productObject.sku === '') {
      this.toastr.error(this.translate.instant('COMMON.FILL_REQUIRED_FIELDS'));
    } else {
      productObject.descriptions.forEach((el) => {
        // fill empty fields
        for (const elKey in el) {
          if (el.hasOwnProperty(elKey)) {
            if (el[elKey] === '' && tmpObj[elKey] !== '') {
              el[elKey] = tmpObj[elKey];
            }
          }
        }
      });
      // check for undefined
      productObject.descriptions.forEach(el => {
        for (const elKey in el) {
          if (el.hasOwnProperty(elKey)) {
            if (typeof el[elKey] === 'undefined' || !el[elKey]) {
              el.name = el.name.trim(); // trim name
              el[elKey] = '';
            }
          }
        }
      });

      if (this.product.id) {
        this.saved = true;
        this.removeImages(this.removedImagesArray);
        this.productService.updateProduct(this.product.id, productObject)
          .subscribe(res => {
            this.productImageService.createImage(res.id, this.uploadData)
              .subscribe(res1 => {
                this.toastr.success(this.translate.instant('PRODUCT.PRODUCT_UPDATED'));
              });
          });
      } else {
        this.saved = true;
        this.productService.createProduct(productObject)
          .subscribe(res => {
            this.productImageService.createImage(res.id, this.uploadData)
              .subscribe(res1 => {
                this.toastr.success(this.translate.instant('PRODUCT.PRODUCT_CREATED'));
                this.router.navigate(['pages/catalogue/products/products-list']);
              });
          });
      }
    }
  }

}
