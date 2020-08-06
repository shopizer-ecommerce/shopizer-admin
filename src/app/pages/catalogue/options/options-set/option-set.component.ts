import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

// import { ConfigService } from '../../../shared/services/config.service';
// import { Option } from '../models/option';
import { OptionService } from '../services/option.service';
import { OptionValuesService } from '../services/option-values.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
// import { validators } from '../../../shared/validation/validators';
import { StorageService } from '../../../shared/services/storage.service';
import { error } from '@angular/compiler/src/util';
@Component({
  selector: 'ngx-option-set',
  templateUrl: './option-set.component.html',
  styleUrls: ['./option-set.component.scss']
})
export class OptionSetComponent implements OnInit {
  isCodeUnique = false;
  options = {
    id: '',
    code: '',
    option: '',
    optionValues: [],
    readOnly: false
  }
  loading: boolean = false;
  productOption: Array<any> = [];
  productOptionValue: Array<any> = [];
  constructor(
    private router: Router,
    private optionService: OptionService,
    private optionValuesService: OptionValuesService,
    private storageService: StorageService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.getOption()
  }
  ngOnInit() {
    // console.log(this.activatedRoute);
    const optionId = this.activatedRoute.snapshot.paramMap.get('optionId');
    // console.log(optionId);
    if (optionId) {
      // console.log('optionId')
      let param = {
        lang: this.storageService.getLanguage()
      }
      this.optionService.getOptionSetById(optionId, param)
        .subscribe((res) => {
          // console.log(res)
          this.options.id = res.id;
          this.options.code = res.code;
          this.options.option = res.option.id;
          this.options.readOnly = res.readOnly;
          let value = []
          // setTimeout(() => {
          res.values.map((optionValue) => {
            value.push(optionValue.id)
          });
          this.options.optionValues = value
          // console.log(this.options.optionValues);
          // }, 2000);

        }, error => {
          this.loading = false;
        });
    }
    this.translate.onLangChange.subscribe((lang) => {
      this.getOption();
    });
  }
  getOption() {
    this.productOption = []
    this.loading = true
    this.optionService.getListOfOptions({})
      .subscribe((res) => {
        res.options.map((value) => {
          const description = value.descriptions.find(el => {
            return el.language === this.storageService.getLanguage();
          });
          const name = description && description.name ? description.name : '';
          this.productOption.push({ id: value.id, code: value.code, name: name })
        })
      }, error => {
        this.loading = false;
      });
    this.getOptionValue()
  }
  getOptionValue() {
    this.productOptionValue = []
    this.optionValuesService.getListOfOptionValues({})
      .subscribe(res => {
        // console.log(res);
        res.optionValues.map((value) => {
          const description = value.descriptions.find(el => {
            return el.language === this.storageService.getLanguage();
          });
          const name = description && description.name ? description.name : '';
          this.productOptionValue.push({ id: value.id, code: value.code, name: name })
        })
        this.loading = false;
      }, error => {
        this.loading = false;
      });
  }

  checkCode(event) {
    const code = event.target.value.trim();
    this.optionService.checkOptionSetCode(this.options.code)
      .subscribe(res => {
        // console.log(res)
        this.isCodeUnique = res.exists;
      });
  }
  save() {
    this.loading = true;
    console.log(this.options)
    let param = {
      code: this.options.code,
      option: this.options.option,
      optionValues: this.options.optionValues,
      readOnly: this.options.readOnly,
    }
    if (this.options.id) {

      this.optionService.updateSetOption(this.options.id, param)
        .subscribe((res) => {
          this.toastr.success(this.translate.instant('OPTION.SET_OPTION_UPDATED'));
          // this.goToback();
          this.loading = false;
        }, error => {
          this.loading = false;
        });
    }
    else {
      this.optionService.createSetOption(param)
        .subscribe((res) => {
          this.toastr.success(this.translate.instant('OPTION.SET_OPTION_CREATED'));
          this.goToback();
          this.loading = false;
        }, error => {
          this.loading = false;
        });
    }
  }
  goToback() {
    this.router.navigate(['pages/catalogue/options/options-set-list']);
  }
  setSelected(e) {
    console.log(e)
    this.options.optionValues = e;
  }
}
