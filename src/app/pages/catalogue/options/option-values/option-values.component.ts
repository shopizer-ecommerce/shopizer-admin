import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfigService } from '../../../shared/services/config.service';
import { OptionValuesService } from '../services/option-values.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { OptionValue } from '../models/optionValue';
import { validators } from '../../../shared/validation/validators';
import { OptionValueImageService } from '../services/option-value-image.service';

@Component({
  selector: 'ngx-option-values',
  templateUrl: './option-values.component.html',
  styleUrls: ['./option-values.component.scss']
})
export class OptionValuesComponent implements OnInit {
  form: FormGroup;
  loader = false;
  optionValue = new OptionValue();
  languages = [];
  types = [
    'Select', 'Radio', 'Checkbox', 'Text'
  ];
  isCodeUnique = true;
  uploadImage = new FormData();

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private configService: ConfigService,
    private optionValuesService: OptionValuesService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router,
    private optionValueImageService: OptionValueImageService
  ) {
    this.languages = [...this.configService.languages];
  }

  ngOnInit() {
    const optionValueId = this.activatedRoute.snapshot.paramMap.get('optionValueId');
    this.createForm();
    if (optionValueId) {
      this.loader = true;
      this.optionValuesService.getOptionValueById(optionValueId).subscribe(res => {
        this.optionValue = res;
        this.fillForm();
        this.loader = false;
      });
    }
  }

  get selectedLanguage() {
    return this.form.get('selectedLanguage');
  }

  get descriptions(): FormArray {
    return <FormArray>this.form.get('descriptions');
  }

  get code() {
    return this.form.get('code');
  }

  private createForm() {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(validators.alphanumeric)]],
      selectedLanguage: [''],
      descriptions: this.fb.array([])
    });
    this.addFormArray();
  }

  addFormArray() {
    const control = <FormArray>this.form.controls.descriptions;
    this.languages.forEach(lang => {
      control.push(
        this.fb.group({
          language: [lang.code, [Validators.required]],
          name: ['', [Validators.required]]
        })
      );
    });
  }

  fillForm() {
    this.form.patchValue({
      code: this.optionValue.code,
      selectedLanguage: 'en',
    });
    this.fillFormArray();
  }

  fillFormArray() {
    this.form.value.descriptions.forEach((desc, index) => {
      this.optionValue.descriptions.forEach((description) => {
        if (desc.language === description.language) {
          (<FormArray>this.form.get('descriptions')).at(index).patchValue({
            language: description.language,
            name: description.name,
          });
        }
      });
    });
  }

  checkCode(event) {
    const code = event.target.value.trim();
    this.optionValuesService.checkOptionValueCode(code)
      .subscribe(res => {
        this.isCodeUnique = !(res.exists && (this.optionValue.code !== code));
      });
  }

  onImageChanged(event) {
    switch (event.type) {
      case 'add': {
        this.uploadImage = new FormData();
        this.uploadImage.append('file', event.data, event.data.name);
        break;
      }
      case 'remove': {
        this.uploadImage.delete('file');
        break;
      }
    }
  }

  save() {
    if (!this.isCodeUnique) {
      this.toastr.error(this.translate.instant('COMMON.CODE_EXISTS'));
      return;
    }
    if (this.optionValue.id) {
      const optionObj = { ...this.form.value, id: this.optionValue.id };
      this.optionValuesService.updateOptionValue(this.optionValue.id, optionObj).subscribe(res => {
        if (this.uploadImage.get('file')) {
          this.optionValueImageService.createImage(this.optionValue.id, this.uploadImage).subscribe(r => {
            this.toastr.success(this.translate.instant('OPTION_VALUE.OPTION_VALUE_UPDATED'));
          });
        } else {
          this.optionValueImageService.deleteImage(this.optionValue.id).subscribe(r => {
            this.toastr.success(this.translate.instant('OPTION_VALUE.OPTION_VALUE_UPDATED'));
          });
        }
      });
    } else {
      this.optionValuesService.createOptionValue(this.form.value).subscribe(res => {
        this.optionValueImageService.createImage(res.id, this.uploadImage).subscribe(r => {
          this.toastr.success(this.translate.instant('OPTION_VALUE.OPTION_VALUE_CREATED'));
          this.router.navigate(['pages/catalogue/options/options-values-list']);
        });
      });
    }
  }
}
