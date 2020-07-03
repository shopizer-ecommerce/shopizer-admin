import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BrandService } from '../services/brand.service';
import { ConfigService } from '../../../shared/services/config.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { validators } from '../../../shared/validation/validators';
import { slugify } from '../../../shared/utils/slugifying';

@Component({
  selector: 'ngx-brand-form',
  templateUrl: './brand-form.component.html',
  styleUrls: ['./brand-form.component.scss']
})
export class BrandFormComponent implements OnInit {
  @Input() brand;
  form: FormGroup;
  loader = false;
  languages = [];
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

  constructor(
    private brandService: BrandService,
    private fb: FormBuilder,
    private configService: ConfigService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.createForm();
    this.loader = true;
    this.configService.getListOfSupportedLanguages()
      .subscribe(res => {
        this.languages = [...res];
        this.createForm();
        this.addFormArray();
        if (this.brand.id) {
          this.fillForm();
        }
        this.loader = false;
      });
  }

  createForm() {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(validators.alphanumeric)]],
      order: ['', [Validators.required, Validators.pattern(validators.number)]],
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
      code: this.brand.code,
      order: this.brand.order,
      selectedLanguage: 'en',
      descriptions: [],
    });
    this.fillFormArray();
  }

  fillFormArray() {
    this.form.value.descriptions.forEach((desc, index) => {
      this.brand.descriptions.forEach((description) => {
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


  get code() {
    return this.form.get('code');
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

  checkCode(event) {
    const code = event.target.value;
    this.brandService.checkCategoryCode(code)
      .subscribe(res => {
        this.isCodeUnique = !(res.exists && (this.brand.code !== code));
      });
  }

  save() {
    const brandObject = this.form.value;
    // save important values for filling empty field in result object
    const tmpObj = {
      name: '',
      friendlyUrl: ''
    };
    brandObject.descriptions.forEach((el) => {
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
    if (tmpObj.name === '' || tmpObj.friendlyUrl === '' || brandObject.code === '') {
      this.toastr.error(this.translate.instant('COMMON.FILL_REQUIRED_FIELDS'));
    } else {
      brandObject.descriptions.forEach((el) => {
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
      brandObject.descriptions.forEach(el => {
        for (const elKey in el) {
          if (el.hasOwnProperty(elKey)) {
            el.name = el.name.trim(); // trim name
            if (typeof el[elKey] === 'undefined') {
              el[elKey] = '';
            }
          }
        }
      });

      if (!this.isCodeUnique) {
        this.toastr.error(this.translate.instant('COMMON.CODE_EXISTS'));
        return;
      }

      if (this.brand.id) {
        this.brandService.updateBrand(this.brand.id, brandObject)
          .subscribe(result => {
            this.toastr.success(this.translate.instant('BRAND.BRAND_UPDATED'));
          });
      } else {
        this.brandService.createBrand(brandObject)
          .subscribe(result => {
            this.toastr.success(this.translate.instant('BRAND.BRAND_CREATED'));
            this.router.navigate(['pages/catalogue/brands/brands-list']);
          });
      }
    }
  }

}
