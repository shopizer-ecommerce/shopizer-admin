import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { OptionService } from '../../../options/services/option.service';
import { OptionValuesService } from '../../../options/services/option-values.service';
import { ProductAttributesService } from '../../services/product-attributes.service';
import { ErrorService } from '../../../../shared/services/error.service';
import { validators } from '../../../../shared/validation/validators';
import { forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../../shared/services/storage.service';
import { ToastrService } from 'ngx-toastr';
import { formatMoney } from '../../../../shared/validation/price-validation';
import { NbDialogRef } from '@nebular/theme';
@Component({
  selector: 'ngx-attribute-form',
  templateUrl: './attribute-form.component.html',
  styleUrls: ['./attribute-form.component.scss']
})
export class AttributeFormComponent implements OnInit {
  productId: any;
  attributeId: any;
  attribute: any = {};

  form: FormGroup;
  loading = false;

  options = [];
  optionValues = [];

  currency = '';

  perPage = 50;

  constructor(
    private fb: FormBuilder,
    private optionService: OptionService,
    private storageService: StorageService,
    private optionValuesService: OptionValuesService,
    private productAttributesService: ProductAttributesService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private errorService: ErrorService,
    protected ref: NbDialogRef<AttributeFormComponent>
  ) {
    forkJoin([
      this.optionService.getListOfOptions({}), 
      this.optionValuesService.getListOfOptionValues({})])
      .subscribe(([optionRes, optionValueRes]) => {
        optionRes.options.forEach((option) => {
          this.options.push({ value: option.code, label: option.code });
        });
        optionValueRes.optionValues.forEach((optionValue) => {
          this.optionValues.push({ value: optionValue.code, label: optionValue.code });
        });
        this.options.push({ value: '', label: 'Please select options' });
        this.optionValues.push({ value: '', label: 'Please select option values' });
      });
  };

  
  params =  {
      store: this.storageService.getMerchant(),
      lang: "_all",
      name: null,
      count: this.perPage,
      page: 0,
  }



  ngOnInit() {

    this.createForm();
    if (this.attributeId) {
      this.loading = true;
      this.productAttributesService.getAttributesById(this.productId, this.attributeId, {}).subscribe(res => {
        this.attribute = res;
        this.fillForm();
        this.loading = false;
      }, error => {
        this.loading = false;
      });
    }
  }



  private createForm() {
    this.form = this.fb.group({
      option: ['', [Validators.required]],
      attributeDisplayOnly: [false],
      optionValue: ['', [Validators.required]],
      //optionValue: [''],
      productAttributeUnformattedPrice: [0, [Validators.required]],
      sortOrder: [0, [Validators.pattern(validators.number)]],
      attributeDefault: [false],
      requiredOption: [false],
      productAttributeWeight: [0, [Validators.required]]
    });
  }

  transformTotal() {
    const value = '' + this.form.controls.productAttributeUnformattedPrice.value;
    if (value !== '') {
      this.form.controls.productAttributeUnformattedPrice.setValue(
        formatMoney(value.replace(/,/g, '')),
        { emitEvent: false }
      );
    }
  }

  fillForm() {
    let index = this.optionValues.findIndex((a) => a.value === this.attribute.optionValue.code);
    let value = null;
    if(this.attribute.optionValue != null) {
      value = this.attribute.optionValue.code;
    }

    this.form.patchValue({
      
      option: this.attribute.option.code,
      attributeDisplayOnly: this.attribute.attributeDisplayOnly,
      optionValue: this.attribute.optionValue.code,
      productAttributeUnformattedPrice: this.attribute.productAttributeUnformattedPrice,
      sortOrder: this.attribute.sortOrder,
      attributeDefault: this.attribute.attributeDefault,
      requiredOption: this.attribute.requiredOption,
      productAttributeWeight: this.attribute.productAttributeWeight,
    });
  }

  get option() {
    return this.form.get('option');
  }

  get optionValue() {
    return this.form.get('optionValue');
  }

  get productAttributeUnformattedPrice() {
    return this.form.get('productAttributeUnformattedPrice');
  }

  onSelectOptionValue(event) {
    this.loading = true;
    //console.log('----------Found value ' + event.query);
    this.optionValues.push({ value: 'ABCD', label: 'ABCD' });
    this.loading = true;
    this.params.name = event.query;
    this.optionValuesService.getListOfOptionValues(this.params)
    .subscribe(res => {
      if(res.recordsTotal === 0 ) {
        //invalid selection
        //this.form.controls['optionValue'].setErrors({'invalid': true});
        //this.form.controls['optionValue'].markAsTouched();
        this.loading = false;
      } else {
        //this.optionValues = new Array();
        res.optionValues.forEach((optionValue) => {
          this.optionValues.push({ value: optionValue.code, label: optionValue.code });
        });
        this.loading = false;
      }
     
    });
  }

  searchOptionValue(event) {
    //this.loading = true;
    this.params.name = event.query;
    this.optionValuesService.getListOfOptionValues(this.params)
    .subscribe(res => {
      if(res.recordsTotal === 0 ) {
        //invalid selection, empty list
        //this.optionValues = new Array();
        this.form.controls['optionValue'].markAsTouched();
        this.form.controls['optionValue'].setErrors({'invalid': true});
        //this.loading = false;
        //this.optionValues.push({ value: '', label: '' });
        
      } else {
        //this.optionValues = new Array();
        //this.loading = false;
        res.optionValues.forEach((optionValue) => {
          this.optionValues.push({ value: optionValue.code, label: optionValue.code });
        });
        
      }
      
    });

  }

  save() {
    this.loading = true;
    const optionObj = this.form.value;
    optionObj.option = { code: optionObj.option };
    optionObj.optionValue = { code: optionObj.optionValue };
    //optionObj.productAttributePrice = optionObj.productAttributeUnformattedPrice.replace(/,/g, '');
    optionObj.productAttributePrice = optionObj.productAttributeUnformattedPrice;
    if (this.attribute.id) {
      this.productAttributesService.updateAttribute(this.productId, this.attributeId, this.form.value)
        .subscribe(res => {
          this.loading = false;
          // this.attribute = res;
          this.errorService.success("PRODUCT_ATTRIBUTES.PRODUCT_ATTRIBUTES_UPDATED");
          this.goToback();
        }, error => {
          this.loading = false;
          this.errorService.error("ERROR.SYSTEM_ERROR_TEXT", 500);
        });;
    } else {
      this.productAttributesService.createAttribute(this.productId, this.form.value).subscribe(res => {
        this.loading = false;
        // this.attribute = res;
        
        this.toastr.success(this.translate.instant('PRODUCT_ATTRIBUTES.PRODUCT_ATTRIBUTES_UPDATED'));
        this.goToback();
      }, error => {
        this.loading = false;
        this.errorService.error("ERROR.SYSTEM_ERROR_TEXT", 500);
      });
    }
  }
  goToback() {
    this.ref.close();
  }

}