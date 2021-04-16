import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OptionService } from '../services/option.service';
import { OptionValuesService } from '../services/option-values.service';
import { VariationService } from '../services/variation.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { validators } from '../../../shared/validation/validators';
import { StorageService } from '../../../shared/services/storage.service';
// import { TypesService } from '../../types/services/types.service';
import { error } from '@angular/compiler/src/util';
@Component({
  selector: 'ngx-variation-add',
  templateUrl: './add-variations.component.html',
  styleUrls: ['./add-variations.component.scss']
})
export class AddVariationsComponent implements OnInit {
  isCodeExist = false;
  isReadonlyCode = false;

  // isValidCode = true;
  // isValidOption = true;

  defaultParam = {
  }

  opt = {
    id: '',
    code: '',
    option: '',
    optionValue: ''
  }
  loading: boolean = false;
  form: FormGroup;
  productOption: Array<any> = [];
  productOptionValue: Array<any> = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private optionService: OptionService,
    private optionValuesService: OptionValuesService,
    private storageService: StorageService,
    private translate: TranslateService,
    private variationService: VariationService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.getOption()
  }

  loadDefaultParam() {
    this.defaultParam = {
      "lang": this.storageService.getLanguage,
      "store": this.storageService.getMerchant
    }
  }
  ngOnInit() {
    this.loadDefaultParam();
    this.createForm();
    // const optionId = this.activatedRoute.snapshot.paramMap.get('optionId');
    // if (optionId) {
    //   let param = {
    //     lang: this.storageService.getLanguage(),
    //     store: this.storageService.getMerchant()
    //   }
    //   this.optionService.getOptionSetById(optionId, param)
    //     .subscribe((res) => {

    //       //console.log(JSON.stringify(res));

    //       this.option.id = res.id;
    //       this.option.code = res.code;
    //       this.option.option = res.option.id;
    //       this.option.readOnly = res.readOnly;
    //       let value = []
    //       let types = []
    //       if (res.values) {
    //         res.values.map((optionValue) => {
    //           value.push(optionValue.id)
    //         });
    //       }
    //       if (res.productTypes) {
    //         res.productTypes.map((productType) => {
    //           types.push(productType.id)
    //         });
    //       }
    //       this.option.optionValues = value;
    //       this.option.productTypes = types;
    //       this.adjustForm();

    //     }, error => {
    //       this.loading = false;
    //     });


    // }
    // this.translate.onLangChange.subscribe((lang) => {
    //   this.getOption();
    // });

  }

  private adjustForm() {
    this.form.patchValue({
      code: this.opt.code,
      option: this.opt.option,
      optionValue: this.opt.optionValue
    });

    if (this.opt.id) {
      this.form.controls['code'].disable();
    }
  }


  private createForm() {
    this.form = this.fb.group({
      code: [{ value: '', disabled: false }, [Validators.required, Validators.pattern(validators.alphanumeric)]],
      option: ['', [Validators.required]],
      optionValue: ['', [Validators.required]]
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
        //TODO error
        this.loading = false;
      });
    this.getOptionValue();
    this.loading = false;
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
      }, error => {
        //TODO error
        this.loading = false;
      });
  }


  get code() {
    return this.form.get('code');
  }

  get option() {
    return this.form.get('option');
  }

  get optionValue() {
    return this.form.get('optionValue');
  }


  checkCode(event) {
    // this.isValidCode = true;
    this.variationService.checkCode(event.target.value)
      .subscribe(res => {
        //console.log(res)
        this.isCodeExist = res.exists;
      });
  }


  save() {
    console.log(this.form.value);
    this.loading = true;
    // //console.log(this.options)

    // this.isValidCode = true;
    // this.isValidOption = true;

    // let optionObj = this.form.value;
    // optionObj.optionValues = this.option.optionValues;
    // optionObj.productTypes = this.option.productTypes;

    // //console.log('From object values ' + JSON.stringify(optionObj));

    // if (this.form.invalid) {
    //   if (this.code.invalid) {
    //     this.isValidCode = false;
    //   }
    //   if (this.opt.invalid) {
    //     this.isValidOption = false;
    //   }
    //   this.loading = false;
    //   return;
    // }

    if (this.opt.id) {

      //   this.optionService.updateSetOption(this.option.id, optionObj)
      //     .subscribe((res) => {
      //       this.toastr.success(this.translate.instant('OPTION.SET_OPTION_UPDATED'));
      //       this.loading = false;
      //     }, error => {
      //       this.loading = false;
      //     });

    }
    else {
      this.variationService.addVariations(this.form.value)
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
    this.router.navigate(['pages/catalogue/options/varations/list']);
  }
  // setSelected(e) {
  //   //console.log(e)
  //   this.option.optionValues = e;
  // }



  // public findInvalidControls() {
  //   const invalid = [];
  //   const controls = this.form.controls;
  //   for (const name in controls) {
  //     if (controls[name].invalid) {
  //       invalid.push(name);
  //     }
  //   }
  //   //console.log('Invalid fields ' + invalid);
  //   //console.log('Form invalid ' + this.form.invalid);
  // }
}
