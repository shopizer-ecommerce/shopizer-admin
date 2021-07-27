import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { PropertiesService } from '../../services/product-properties';
// import { StorageService } from '../../../../shared/services/storage.service';
import { ConfigService } from '../../../../shared/services/config.service';
import { ProductAttributesService } from '../../services/product-attributes.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-product-property-form',
  templateUrl: './product-property-form.component.html',
  styleUrls: ['./product-property-form.component.scss']
})
export class ProductPropertyForm implements OnInit {
  product: any;
  form: FormGroup;
  loader: boolean = false;
  languages: Array<any> = [];
  options: Array<any> = [];
  optionValues: Array<any> = [];
  selectedType: any = '';
  constructor(
    private propertiesService: PropertiesService,
    private configService: ConfigService,
    private productAttributesService: ProductAttributesService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private fb: FormBuilder,
    protected ref: NbDialogRef<ProductPropertyForm>
  ) {
    this.getLanguages()
  }
  getLanguages() {
    this.configService.getListOfSupportedLanguages(localStorage.getItem('merchant'))
      .subscribe(data => {
        this.languages = data;
        this.addFormArray();
      }, error => {

      });
  }
  ngOnInit() {
    this.getProductProperty();
    this.createForm()
  }
  getProductProperty() {
    this.propertiesService.getProductProperties("test")
      .subscribe(property => {
        // console.log(property);
        let temp = []
        property.map((data) => {
          temp.push({ value: data.option.id, label: data.option.name, type: data.option.type, values: data.values })
        });
        this.options = temp;
      });
  }
  private createForm() {
    this.form = this.fb.group({
      option: ['', [Validators.required]],
      optionValue: ['', []],
      descriptions: this.fb.array([]),
    });

  }
  addFormArray() {
    const control = <FormArray>this.form.controls.descriptions;
    this.languages.forEach(lang => {
      control.push(
        this.fb.group({
          language: [lang.code, []],
          name: ['', []]
        })
      );
    });
  }

  onChangePropertyOption(e) {
    console.log('------------', e)
    let record = this.options.find((a) => {
      return a.value === e.value
    })
    this.selectedType = record.type;
    if (record.type !== 'text') {
      let temp = [];
      if (record.values && record.values.length > 0) {
        record.values.map((data) => {
          temp.push({ value: data.code, label: data.name })
        });
        this.optionValues = temp;
      }
      this.form.get('descriptions')['controls'].forEach(c => c.controls.name.clearValidators());
      this.form.controls['optionValue'].setValidators([Validators.required]);
      this.form.controls['optionValue'].updateValueAndValidity();
    } else {
      this.form.controls['optionValue'].clearValidators();
      this.form.get('descriptions')['controls'].forEach(c => c.controls.name.setValidators([Validators.required]));
      this.form.controls['optionValue'].updateValueAndValidity();
    }

  }

  fillForm() {
    // const priceSeparator = this.attribute.productAttributePrice.indexOf('$') + 1;
    // this.currency = this.attribute.productAttributePrice.slice(0, priceSeparator);
    // this.form.patchValue({
    //   option: this.attribute.option.code,
    //   attributeDisplayOnly: this.attribute.attributeDisplayOnly,
    //   optionValue: this.attribute.optionValue.code,
    //   productAttributePrice: this.attribute.productAttributePrice.slice(priceSeparator),
    //   sortOrder: this.attribute.sortOrder,
    //   attributeDefault: this.attribute.attributeDefault,
    //   requiredOption: this.attribute.requiredOption,
    //   productAttributeWeight: this.attribute.productAttributeWeight,
    // });
  }

  get option() {
    return this.form.get('option');
  }

  get optionValue() {
    return this.form.get('optionValue');
  }
  get descriptions(): FormArray {
    return <FormArray>this.form.get('descriptions');
  }

  save() {
    console.log(this.form.value);
    let param = {};
    if (this.selectedType === 'text') {
      param = {
        "attributeDefault": false,
        "attributeDisplayOnly": true,
        "option": {
          "id": this.form.value.option
        },
        "optionValue": {
          "descriptions": this.form.value.descriptions
        },
        "sortOrder": 0
      }
    } else {
      param = {
        "attributeDefault": false,
        "attributeDisplayOnly": true,
        "option": {
          "id": this.form.value.option
        },
        "optionValue": this.form.value.optionValue,
        "sortOrder": 1
      }
    }
    this.loader = true;
    // const optionObj = this.form.value;
    // optionObj.option = { code: optionObj.option };
    // optionObj.optionValue = { code: optionObj.optionValue };
    // optionObj.productAttributePrice = optionObj.productAttributePrice.replace(/,/g, '');
    // if (this.attribute.id) {
    //   this.productAttributesService.updateAttribute(this.productId, this.attributeId, this.form.value)
    //     .subscribe(res => {
    //       this.loader = false;
    //       this.attribute = res;
    //       this.goToback();
    //       this.toastr.success(this.translate.instant('PRODUCT_ATTRIBUTES.PRODUCT_ATTRIBUTES_UPDATED'));
    //     });
    // } else {
    this.productAttributesService.createAttribute(this.product.id, param).subscribe(res => {
      this.loader = false;
      this.goToback();
      this.toastr.success(this.translate.instant('PRODUCT_ATTRIBUTES.PRODUCT_ATTRIBUTES_UPDATED'));
    }, error => {
      this.loader = false;
    });
    // }
  }
  goToback() {
    this.ref.close();
  }

}