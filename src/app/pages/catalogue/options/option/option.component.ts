import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ConfigService } from '../../../shared/services/config.service';
import { Option } from '../models/option';
import { OptionService } from '../services/option.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { validators } from '../../../shared/validation/validators';

@Component({
  selector: 'ngx-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss']
})
export class OptionComponent implements OnInit {
  form: FormGroup;
  loader = false;
  loadingInfo: boolean = false;
  option = new Option();
  languages = [];
  defaultLanguage = localStorage.getItem('lang');
  types = [
    'select', 'radio', 'checkbox', 'text'
  ];
  isCodeUnique = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private configService: ConfigService,
    private optionService: OptionService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private router: Router,
  ) {
    //this.languages = [...this.configService.languages];
    //const config = this.configService.getListOfSupportedLanguages(localStorage.getItem('merchant'));
  }

  ngOnInit() {
    this.loader = true;
    const optionId = this.activatedRoute.snapshot.paramMap.get('optionId');
    
    this.createForm();
    
    this.configService.getListOfSupportedLanguages(localStorage.getItem('merchant'))
       .subscribe(res => {
        this.languages = [...res];
        this.addFormArray();
        if (optionId) {
          this.optionService.getOptionById(optionId).subscribe(res => {
            this.option = res;
            this.fillForm();//bind content to the form
            this.loader=false;
         });
        } else {
          this.loader=false;
        }
        
    });
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
      type: ['', [Validators.required]],
      selectedLanguage: [this.defaultLanguage, [Validators.required]],
      descriptions: this.fb.array([])
    });
  }

  addFormArray() {
    const control = <FormArray>this.form.controls.descriptions;
    //console.log('Here ' + JSON.stringify(this.languages));
    this.languages.forEach(lang => {
      control.push(
        this.fb.group({
          language: [lang.code, []],
           name: ['', []]
        })
      );
    });
  }

  fillForm() {
    this.form.patchValue({
      code: this.option.code,
      type: this.option.type,
      selectedLanguage: this.defaultLanguage
    });
    this.fillFormArray();
  }

  fillFormArray() {
    this.form.value.descriptions.forEach((desc, index) => {
      //console.log(JSON.stringify(desc));
      this.option.descriptions.forEach((description) => {
        //console.log('Comparing ' + desc.language + ' - ' + description.language);
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
    this.optionService.checkOptionCode(code)
      .subscribe(res => {
        this.isCodeUnique = !(res.exists && (this.option.code !== code));
      });
  }

  save() {
    if (!this.isCodeUnique) {
      this.toastr.error(this.translate.instant('COMMON.CODE_EXISTS'));
      return;
    }
    if (this.option.id) {
      const optionObj = { ...this.form.value, id: this.option.id };
      this.optionService.updateOption(this.option.id, optionObj).subscribe(res => {
        this.toastr.success(this.translate.instant('OPTION.OPTION_UPDATED'));
      });
    } else {
      this.optionService.createOption(this.form.value).subscribe(res => {
        this.toastr.success(this.translate.instant('OPTION.OPTION_CREATED'));
        this.router.navigate(['pages/catalogue/options/options-list']);
      });
    }
  }
  goToback() {
    this.router.navigate(['pages/catalogue/options/options-list']);
  }
}
