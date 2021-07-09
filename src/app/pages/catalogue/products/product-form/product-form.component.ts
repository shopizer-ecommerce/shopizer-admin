import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
import { environment } from '../../../../../environments/environment';
import { slugify } from '../../../shared/utils/slugifying';
import { forkJoin } from 'rxjs';
import { TypesService } from '../../types/services/types.service';
import { Image } from '../../../shared/models/image';
// import { ProductsImagesComponent } from './../products-images/products-images.component';
import { ImageBrowserComponent } from '../../../../@theme/components/image-browser/image-browser.component';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'ngx-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  @Input() product: any;
  @Input() _title: string;

  // @ViewChild("imagesManager", { static: false }) imagesManager: ProductsImagesComponent;

  form: FormGroup;
  loaded = false;
  loading = false;
  manufacturers = [];
  languages = [];
  typesCount = 15;
  productTypes = [];
  selectedItem = '0';
  defaultLanguage = localStorage.getItem('lang');
  //changed from seo section
  currentLanguage = localStorage.getItem('lang');
  // tabs: any[];
  images: Image[] = [];
  // addImageUrlComponent = '';//add image url to be used by uploader
  sidemenuLinks = [
    {
      id: '0',
      title: 'Product details',
      key: 'COMPONENTS.PRODUCT_DETAILS',
      link: 'product-details'
    },
    {
      id: '1',
      title: 'Inventory management',
      key: 'COMPONENTS.MANAGE_INVENTORY',
      link: 'inventory-list'
    },
    // {
    //   id: '2',
    //   title: 'Product attributes',
    //   key: 'PRODUCT_ATTRIBUTES',
    //   link: 'product-attributes'
    // },
    // {
    //   id: '3',
    //   title: 'Product to category',
    //   key: 'PRODUCT_TO_CATEGORY',
    //   link: 'category-association'
    // }
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
    private dialogService: NbDialogService
  ) {
  }

  ngOnInit() {
    this.loadEvent();
    console.log('Parent ' + this.product.id);
    // this.tabs = [
    //   {
    //     title: 'Product images',
    //     route: `/pages/catalogue/products/product/${this.product.id}/details`,
    //   },
    //   {
    //     title: 'Product to Category',
    //     route: '/pages/layout/tabs/tab2',
    //   },
    //   {
    //     title: 'Product options',
    //     route: '/pages/catalogue/products/product/200/options',
    //   },
    //   {
    //     title: 'Product properties',
    //     route: '/pages/catalogue/products/product/200/properties',
    //   },
    // ];
    const manufacture$ = this.manufactureService.getManufacturers();
    const types$ = this.productService.getProductTypes();
    //TODO local cache
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
      console.log(JSON.stringify(this.product.images));
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
      identifier: ['', [Validators.required, Validators.pattern(validators.alphanumeric)]],
      visible: [false],
      dateAvailable: [new Date()],
      manufacturer: ['', [Validators.required]],
      type: [''],
      // price: [''],
      // quantity: ['', [Validators.required, Validators.pattern(validators.number)]],
      // sortOrder: ['', [Validators.required, Validators.pattern(validators.number)]],
      // productShipeable: [false, [Validators.required]],
      // productSpecifications: this.fb.group({
      //   weight: ['', [Validators.pattern(validators.number)]],
      //   height: ['', [Validators.pattern(validators.number)]],
      //   width: ['', [Validators.pattern(validators.number)]],
      //   length: ['', [Validators.pattern(validators.number)]],
      // }),
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
    //this.addImageUrlComponent = this.productImageService.addImageUrl(this.product.id);
    //this.refreshChilds();
    this.form.patchValue({
      identifier: this.product.identifier,
      visible: this.product.visible,
      dateAvailable: new Date(this.product.dateAvailable),
      manufacturer: this.product.manufacturer == null ? '' : this.product.manufacturer.code,
      type: this.product.type == null ? '' : this.product.type.code,
      // price: this.product.price,
      // quantity: this.product.quantity,
      // sortOrder: this.product.sortOrder,
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

  get identifier() {
    return this.form.get('identifier');
  }

  get manufacturer() {
    return this.form.get('manufacturer');
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
    this.fillFormArray();
  }

  changeName(event, index) {
    (<FormArray>this.form.get('descriptions')).at(index).patchValue({
      friendlyUrl: slugify(event)
    });
  }

  refreshProduct() {
    this.productService.getProductDefinitionById(this.product.id)
      .subscribe(res => {
        // console.log(res);
        this.images = res.images;
      }, error => {
        this.toastr.error(error.error.message);
      });

  }

  //images and other childs
  /**
  refreshChilds() {
    let productImages = this.product.images;
    productImages.forEach(val => {
      this.images.push( { // Return the new object structure
        id: val.id,
        name: val.imageName,
        path: val.imageUrl
      })
    });
  }


  removeImage(event) {
    this.loading = true;
    this.productImageService.removeImage(this.product.id,event)
       .subscribe(res1 => {
        this.refreshProduct();
        this.loading = false;
        this.toastr.success(this.translate.instant('PRODUCT.PRODUCT_UPDATED'));
    }, error => {
         this.toastr.error(error.error.message);
         this.loading = false;
    });
  }

  errorImage(event) {
    this.toastr.error(this.translate.instant('COMMON.'+event));
  }

  addedImage(event) {
    this.refreshProduct();
    this.toastr.success(this.translate.instant('PRODUCT.PRODUCT_UPDATED'));

  }
  /** end image component */

  checkSku(event) {
    this.loading = true;
    this.productService.checkProductSku(event.target.value)
      .subscribe(res => {
        this.isCodeUnique = !(res.exists && (this.product.identifier !== event.target.value));
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
        this.isCodeUnique = !(res.exists && (this.product.identifier !== event.target.value));
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
    if (this.findInvalidControls().length > 0) {
      return;
    }

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
      for (const elKey in el) {
        if (el.hasOwnProperty(elKey)) {
          if (!tmpObj.hasOwnProperty(elKey) && el[elKey] !== '') {
            tmpObj[elKey] = el[elKey];
          }
        }
      }
    });
    // check required fields
    //object validations on the form
    if (tmpObj.name === '' || tmpObj.friendlyUrl === '' || productObject.identifier === '' || productObject.manufacturer === '' || tmpObj.title === '') {
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
      this.toastr.error(this.translate.instant('COMMON.FILL_REQUIRED_FIELDS'));
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
}
