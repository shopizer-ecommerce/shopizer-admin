import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { OptionService } from '../../../options/services/option.service';
import { OptionValuesService } from '../../../options/services/option-values.service';
import { ProductAttributesService } from '../../services/product-attributes.service';
import { validators } from '../../../../shared/validation/validators';
import { forkJoin } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
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
  loader = false;

  options = [];
  optionValues = [];

  currency = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private optionService: OptionService,
    private optionValuesService: OptionValuesService,
    private productAttributesService: ProductAttributesService,
    private toastr: ToastrService,
    private translate: TranslateService,
    protected ref: NbDialogRef<AttributeFormComponent>
  ) {
    forkJoin(this.optionService.getListOfOptions({}), this.optionValuesService.getListOfOptionValues({}))
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
  }

  ngOnInit() {

    this.createForm();
    if (this.attributeId) {
      this.loader = true;
      this.productAttributesService.getAttributesById(this.productId, this.attributeId, {}).subscribe(res => {
        this.attribute = res;
        this.fillForm();
        this.loader = false;
      }, error => {
        this.loader = false;
      });
    }
  }

  private createForm() {
    this.form = this.fb.group({
      option: ['', [Validators.required]],
      attributeDisplayOnly: [false],
      optionValue: ['', [Validators.required]],
      productAttributeUnformattedPrice: ['', [Validators.required]],
      sortOrder: ['', [Validators.pattern(validators.number)]],
      attributeDefault: [false],
      requiredOption: [false],
      productAttributeWeight: ['', [Validators.required]]
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
    // console.log(index)

    this.form.patchValue({
      option: this.attribute.option.code,
      attributeDisplayOnly: this.attribute.attributeDisplayOnly,
      optionValue: index === -1 ? '' : this.attribute.optionValue.code,
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

  save() {
    this.loader = true;
    const optionObj = this.form.value;
    optionObj.option = { code: optionObj.option };
    optionObj.optionValue = { code: optionObj.optionValue };
    //optionObj.productAttributePrice = optionObj.productAttributeUnformattedPrice.replace(/,/g, '');
    optionObj.productAttributePrice = optionObj.productAttributeUnformattedPrice;
    if (this.attribute.id) {
      this.productAttributesService.updateAttribute(this.productId, this.attributeId, this.form.value)
        .subscribe(res => {
          this.loader = false;
          // this.attribute = res;
          this.goToback();
          this.toastr.success(this.translate.instant('PRODUCT_ATTRIBUTES.PRODUCT_ATTRIBUTES_UPDATED'));
        }, error => {
          this.loader = false;
        });;
    } else {
      this.productAttributesService.createAttribute(this.productId, this.form.value).subscribe(res => {
        this.loader = false;
        // this.attribute = res;
        this.goToback();
        this.toastr.success(this.translate.instant('PRODUCT_ATTRIBUTES.PRODUCT_ATTRIBUTES_UPDATED'));
      }, error => {
        this.loader = false;
      });
    }
  }
  goToback() {
    this.ref.close();
    // this.router.navigate(['pages/catalogue/products/' + this.productId + '/product-attributes']);
  }

}