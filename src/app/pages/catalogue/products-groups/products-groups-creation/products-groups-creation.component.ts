import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { OptionService } from '../../options/services/option.service';
import { OptionValuesService } from '../../options/services/option-values.service';

@Component({
  selector: 'ngx-products-groups-creation',
  templateUrl: './products-groups-creation.component.html',
  styleUrls: ['./products-groups-creation.component.scss']
})
export class ProductsGroupsCreationComponent implements OnInit {
  form: FormGroup;
  loader = false;

  options = [];
  optionValues = [];

  constructor(
    private fb: FormBuilder,
    private optionService: OptionService,
    private optionValuesService: OptionValuesService,
    ) {
    this.optionService.getListOfOptions({}).subscribe(res => {
      res.options.forEach((option) => {
        this.options.push({ value: option.code, label: option.code });
      });
    });
    this.optionValuesService.getListOfOptionValues({}).subscribe(res => {
      res.optionValues.forEach((optionValue) => {
        this.optionValues.push({ value: optionValue.code, label: optionValue.code });
      });
    });
  }

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.form = this.fb.group({
      attributeName: ['', [Validators.required]],
      displayOnly: [false, [Validators.required]],
      optionValue: ['', [Validators.required]],
      optionPrice: [0, [Validators.required]],
      order: [0, [Validators.required]],
      defaultOption: [false, [Validators.required]],
      requiredOption: [false, [Validators.required]],
      additionalWeight: [0, [Validators.required]]
    });
  }

  save() {
    console.log(this.form.value);
  }

}
