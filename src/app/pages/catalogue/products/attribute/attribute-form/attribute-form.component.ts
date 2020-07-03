import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { OptionService } from '../../../options/services/option.service';
import { OptionValuesService } from '../../../options/services/option-values.service';
import { ProductAttributesService } from '../../services/product-attributes.service';
import { validators } from '../../../../shared/validation/validators';
import { forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { formatMoney } from '../../../../shared/validation/price-validation';

@Component({
  selector: 'ngx-attribute-form',
  templateUrl: './attribute-form.component.html',
  styleUrls: ['./attribute-form.component.scss']
})
export class AttributeFormComponent implements OnInit {
  productId;
  attributeId;
  attribute: any = {};

  form: FormGroup;
  loader = false;

  options = [];
  optionValues = [];

  currency = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private optionService: OptionService,
    private optionValuesService: OptionValuesService,
    private productAttributesService: ProductAttributesService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    forkJoin(this.optionService.getListOfOptions({}), this.optionValuesService.getListOfOptionValues({}))
      .subscribe(([optionRes, optionValueRes]) => {
        optionRes.options.forEach((option) => {
          this.options.push({ value: option.code, label: option.code });
        });
        optionValueRes.optionValues.forEach((optionValue) => {
          this.optionValues.push({ value: optionValue.code, label: optionValue.code });
        });
        this.options.push({ value: '', label: '---' });
        this.optionValues.push({ value: '', label: '---' });
      });
  }

  ngOnInit() {
    this.productId = this.activatedRoute.snapshot.paramMap.get('productId');
    this.attributeId = this.activatedRoute.snapshot.paramMap.get('attributeId');
    this.createForm();
    if (this.attributeId) {
      this.productAttributesService.getAttributesById(this.productId, this.attributeId).subscribe(res => {
        this.attribute = res;
        this.fillForm();
      });
    }
  }

  private createForm() {
    this.form = this.fb.group({
      option: ['', [Validators.required]],
      attributeDisplayOnly: [false],
      optionValue: ['', [Validators.required]],
      productAttributePrice: ['', [Validators.required]],
      sortOrder: ['', [Validators.pattern(validators.number)]],
      attributeDefault: [false],
      requiredOption: [false],
      productAttributeWeight: ['', [Validators.required]]
    });
  }

  transformTotal() {
    const value = '' + this.form.controls.productAttributePrice.value;
    if (value !== '') {
      this.form.controls.productAttributePrice.setValue(
        formatMoney(value.replace(/,/g, '')),
        { emitEvent: false }
      );
    }
  }

  fillForm() {
    const priceSeparator = this.attribute.productAttributePrice.indexOf('$') + 1;
    this.currency = this.attribute.productAttributePrice.slice(0, priceSeparator);
    this.form.patchValue({
      option: this.attribute.option.code,
      attributeDisplayOnly: this.attribute.attributeDisplayOnly,
      optionValue: this.attribute.optionValue.code,
      productAttributePrice: this.attribute.productAttributePrice.slice(priceSeparator),
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

  get productAttributePrice() {
    return this.form.get('productAttributePrice');
  }

  save() {
    const optionObj = this.form.value;
    optionObj.option = { code: optionObj.option };
    optionObj.optionValue = { code: optionObj.optionValue };
    optionObj.productAttributePrice = optionObj.productAttributePrice.replace(/,/g, '');
    if (this.attribute.id) {
      this.productAttributesService.updateAttribute(this.productId, this.attributeId, this.form.value)
        .subscribe(res => {
          this.attribute = res;
          this.toastr.success(this.translate.instant('PRODUCT_ATTRIBUTES.PRODUCT_ATTRIBUTES_UPDATED'));
        });
    } else {
      this.productAttributesService.createAttribute(this.productId, this.form.value).subscribe(res => {
        this.attribute = res;
        this.toastr.success(this.translate.instant('PRODUCT_ATTRIBUTES.PRODUCT_ATTRIBUTES_UPDATED'));
      });
    }
  }

}
