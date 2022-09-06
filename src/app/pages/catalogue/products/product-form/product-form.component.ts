import { Component, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ManufactureService } from '../../../shared/services/manufacture.service';
import { ConfigService } from '../../../shared/services/config.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NbDialogService } from '@nebular/theme';
import { ProductService } from '../services/product.service';
import { ProductImageService } from '../services/product-image.service';
import { TranslateService } from '@ngx-translate/core';
import { validators } from '../../../shared/validation/validators';
import { slugify } from '../../../shared/utils/slugifying';
import { forkJoin } from 'rxjs';
import { TypesService } from '../../types/services/types.service';
import { StorageService } from '../../../shared/services/storage.service';
import { Image } from '../../../shared/models/image';
import { ImageBrowserComponent } from '../../../../@theme/components/image-browser/image-browser.component';
//import { threadId } from 'worker_threads';
declare var jquery: any;
declare var $: any;

export interface TabItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'ngx-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  @Input() product: any;
  @Input() _title: string;

  form: FormGroup;
  loaded = false;
  tabLoader = false;
  loading = false;
  manufacturers = [];
  languages = [];
  typesCount = 15;
  productTypes = [];
  selectedItem = '0';
  defaultLanguage = localStorage.getItem('lang');
  //changed from seo section
  currentLanguage = localStorage.getItem('lang');
  images: Image[] = [];


  tabs = [
    {
      title: this.translate.instant('COMPONENTS.PRODUCTS_IMAGES'),
      route: 'images',
      icon: 'home',
      fragment: 'tabs',
      responsive: true, // hide title before `$tabset-tab-text-hide-breakpoint` value
    },
    {
      title: this.translate.instant('COMPONENTS.PRODUCT_TO_CATEGORY'),
      route: 'category',
      fragment: 'tabs',
  
    },
    {
      title: this.translate.instant('COMPONENTS.OPTIONS_CONFIG'),
      route: 'options',
      fragment: 'tab1',
    },
    {
      title: this.translate.instant('COMPONENTS.PRODUCTS_PROPERTIES'),
      route: 'properties',
      fragment: 'tab1',
    },
    {
      title: this.translate.instant('COMPONENTS.PRODUCTS_DISCOUNT'),
      route: 'discount',
      fragment: 'tab1',
    }
   ];


  //summernote
  config = {
    placeholder: '',
    tabsize: 2,
    height: 300,
    //edit toolbar
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'link', 'video', 'hr']],
      ['customButtons', ['testBtn']]
    ],
    buttons: {
      'testBtn': this.customButton.bind(this)
    },
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
  };
  isCodeUnique = true;
  uploadData = new FormData();
  removedImagesArray = [];
  constructor(
    private fb: FormBuilder,
    private manufactureService: ManufactureService,
    private configService: ConfigService,
    private toastr: ToastrService,
    private productService: ProductService,
    private productImageService: ProductImageService,
    private router: Router,
    private translate: TranslateService,
    private typeService: TypesService,
    private dialogService: NbDialogService,
    private storageService: StorageService
  ) {
  }

  ngOnInit() {

    this.loadEvent();

    const manufacture$ = this.manufactureService.getManufacturers();
    const types$ = this.productService.getProductTypes();
    const config$ = this.configService.getListOfSupportedLanguages(localStorage.getItem('merchant'));
    forkJoin([manufacture$, types$, config$])
      .subscribe(([manufacturers, productTypes, languages]) => {

        manufacturers.manufacturers.forEach((option) => {
          this.manufacturers.push({ value: option.code, label: option.code });
        });

        productTypes.list.forEach((option) => {
          this.productTypes.push({ value: option.code, label: option.code });
        });

        this.languages = [...languages];
        this.createForm();//init
        this.addFormArray();//create array
        if (this.product.id) {
          this.fillForm();//bind content to the form
        }
        this.loadedEvent();
      });
  }

  ngAfterViewInit() {

    if (this.product != null) {
      //console.log(JSON.stringify(this.product.images));
      this.images = this.product.images;
      // this.imagesManager.setImages(this.product);
    }

  }

  private loadEvent() {
    this.loading = true;
    this.loaded = false;
  }

  private loadedEvent() {
    this.loading = false;
    this.loaded = true;
  }

  private createForm() {
    this.form = this.fb.group({
      sku: ['', [Validators.required, Validators.pattern(validators.alphanumeric)]],
      visible: [false],
      dateAvailable: [new Date()],
      manufacturer: ['', [Validators.required]],
      type: [''],
      display: [true],
      canBePurchased: [true],
      timeBound: [false],
      price: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.pattern(validators.number)]],
      // discountedPrice: [Validators.pattern(validators.number)],
      // percentageOff: [Validators.pattern(validators.number)],
      // rebatePrice: [Validators.required, Validators.pattern(validators.number)],
      // startDate: [new Date()],
      // endDate: [new Date()],
      sortOrder: ['', [Validators.required, Validators.pattern(validators.number)]],
      // productShipeable: [false, [Validators.required]],
      productSpecifications: this.fb.group({
        weight: [''],
        height: [''],
        width: [''],
        length: ['']
      }),
      // placementOrder: [0, [Validators.required]],  // ???
      // taxClass: [0, [Validators.required]], // ???
      selectedLanguage: [this.defaultLanguage, [Validators.required]],
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
      visible: this.product.visible,
      canBePurchased: this.product.canBePurchased,
      dateAvailable: new Date(this.product.dateAvailable),
      manufacturer: this.product.manufacturer == null ? '' : this.product.manufacturer.code,
      type: this.product.type == null ? '' : this.product.type.code,
      price: this.product.price,
      quantity: this.product.quantity,
      productSpecifications: {
        weight: this.product.productSpecifications.weight,
        height: this.product.productSpecifications.height,
        width: this.product.productSpecifications.width,
        length: this.product.productSpecifications.length
      },
      sortOrder: this.product.sortOrder,
      // productShipeable: this.product.productShipeable,
      // placementOrder: [0, [Validators.required]],  // ???
      // taxClass: [0, [Validators.required]], // ???
      selectedLanguage: this.defaultLanguage,
      descriptions: [],
    });
    this.fillFormArray();

    //this.findInvalidControls();

    // const dimension = {
    //   weight: this.product.productSpecifications.weight,
    //   height: this.product.productSpecifications.height,
    //   width: this.product.productSpecifications.width,
    //   length: this.product.productSpecifications.length,
    // };
    // this.form.patchValue({ productSpecifications: dimension });
  }

  fillFormArray() {
    this.form.value.descriptions.forEach((desc, index) => {
      if (this.product != null && this.product.descriptions) {
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
      }
    });
  }

  get sku() {
    return this.form.get('sku');
  }

  get manufacturer() {
    return this.form.get('manufacturer');
  }

  onChangeDisplay(e) {
    //console.log(e.target.checked);
    if (e.target.checked) {
      this.form.controls['price'].setValidators([Validators.required]);
    } else {
      this.form.controls['price'].clearValidators();
    }
    this.form.controls['price'].updateValueAndValidity();
    // return this.form.get('display').valueChanges.subscribe(val => {
    //   console.log(val)
    // });
  }
  get price() {
    return this.form.get('price');
  }
  get quantity() {
    return this.form.get('quantity');
  }

  get selectedLanguage() {
    return this.form.get('selectedLanguage');
  }

  get descriptions(): FormArray {
    return <FormArray>this.form.get('descriptions');
  }

  selectLanguage(lang) {
    this.form.patchValue({
      selectedLanguage: lang,
    });
    this.currentLanguage = lang;
  }

  changeName(event, index) {
    (<FormArray>this.form.get('descriptions')).at(index).patchValue({
      friendlyUrl: slugify(event)
    });
  }

  refreshProduct() {
    //v1 product details
    this.productService.getProductById(this.product.id)
      .subscribe(res => {
        this.images = res.images;
      }, error => {
        this.toastr.error(error.error.message);
      });

  }

  checkSku(event) {
    this.loading = true;
    this.productService.checkProductSku(event.target.value)
      .subscribe(res => {
        this.isCodeUnique = !(res.exists && (this.product.sku !== event.target.value));
        this.loading = false;
      });
  }



  // onImageChanged(event) {
  //   console.log(event);
  //   switch (event.type) {
  //     case 'add': {
  //       this.uploadData.append('file', event.data);
  //       break;
  //     }
  //     case 'remove': {
  //       this.removedImagesArray.push(event.data);
  //       break;
  //     }
  //     case 'remove-one': {
  //       const fd = new FormData();
  //       this.uploadData.delete(event.data.name);
  //       this.uploadData.forEach((img) => {
  //         if (img['name'] !== event.data.name) {
  //           fd.append('file[]', img, img['name']);
  //         }
  //       });
  //       this.uploadData = new FormData();
  //       this.uploadData = fd;
  //       break;
  //     }
  //   }
  // }

  /**
  checkSku(event) {
    this.productService.checkProductSku(event.target.value)
      .subscribe(res => {
        this.isCodeUnique = !(res.exists && (this.product.sku !== event.target.value));
      });
  }
  **/

  // removeImages(array) {
  //   array.forEach((el) => {
  //     this.productImageService.removeImage(el)
  //       .subscribe(res1 => {
  //       }, error => {
  //         console.log('Something went wrong', error);
  //       });
  //   });
  // }

  save() {
    this.form.markAllAsTouched();

    this.loading = true;
    const productObject = this.form.value;
    productObject.dateAvailable = moment(productObject.dateAvailable).format('yyyy-MM-DD');
    // productObject.productSpecifications.manufacturer = productObject.manufacturer;

    // save important values for filling empty field in result object
    const tmpObj = {
      name: '',
      friendlyUrl: '',
      title: '',
      language: ''
    };
    productObject.descriptions.forEach((el) => {
      tmpObj.language = el.language;
      if (tmpObj.name === '' && el.name !== '') {
        tmpObj.name = el.name;
      }
      if (tmpObj.friendlyUrl === '' && el.friendlyUrl !== '') {
        tmpObj.friendlyUrl = el.friendlyUrl;
      }
      if (tmpObj.title === '' && el.title !== '') {
        tmpObj.title = el.title;
      }
      if (tmpObj.title === '' && el.title === '') {
        tmpObj.title = this.storageService.getMerchantName + ' | ' + el.name;
      }
      for (const elKey in el) {
        if (el.hasOwnProperty(elKey)) {
          if (!tmpObj.hasOwnProperty(elKey) && el[elKey] !== '') {
            tmpObj[elKey] = el[elKey];
          }
        }
      }
    });
    /** do the validation */
    if (this.findInvalidControls().length > 0) {
      this.loading = false;
      return;
    }
    // check required fields
    //object validations on the form
    if (tmpObj.name === '' || tmpObj.friendlyUrl === '' || productObject.sku === '' || productObject.manufacturer === '') {
      this.toastr.error(this.translate.instant('COMMON.FILL_REQUIRED_FIELDS'));
      this.loading = false;
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
      delete productObject.selectedLanguage;
      if (this.product.id) {
        this.productService.updateProduct(this.product.id, productObject)
          .subscribe(res => {
            this.loading = false;
            this.toastr.success(this.translate.instant('PRODUCT.PRODUCT_UPDATED'));
          }, err => {
            this.toastr.error(err.error.message);
            this.loading = false;
          });
      } else {
        this.productService.createProduct(productObject)
          .subscribe(res => {
            this.loading = false;
            this.toastr.success(this.translate.instant('PRODUCT.PRODUCT_CREATED'));
            this.router.navigate(['pages/catalogue/products/products-list']);
          }
            , err => {
              this.toastr.error(err.error.message);
              this.loading = false;
            });
      }
    }
  }

  route(link) {
    this.router.navigate(['pages/catalogue/products/' + this.product.id + '/' + link]);
  }
  goToback() {
    this.router.navigate(['pages/catalogue/products/products-list'])
  }
  public findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    if (invalid.length > 0) {
      this.toastr.error(this.translate.instant('COMMON.FILL_REQUIRED_FIELDS') + " [" + invalid + " ]");
    }
    return invalid;
  }



  customButton(context) {
    const me = this;
    const ui = $.summernote.ui;
    const button = ui.button({
      contents: '<i class="note-icon-picture"></i>',
      tooltip: 'Gallery',
      container: '.note-editor',
      className: 'note-btn',
      click: function () {
        //console.log(me);
        me.dialogService.open(ImageBrowserComponent, {}).onClose.subscribe(name => name && context.invoke('editor.pasteHTML', '<img src="' + name + '">'));
      }
    });
    return button.render();
  }
  loadingTab(e) {
    this.tabLoader = e;
  }
}
