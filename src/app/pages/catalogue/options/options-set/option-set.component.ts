import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OptionService } from '../services/option.service';
import { OptionValuesService } from '../services/option-values.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { validators } from '../../../shared/validation/validators';
import { StorageService } from '../../../shared/services/storage.service';
import { TypesService } from '../../types/services/types.service';
import { error } from '@angular/compiler/src/util';
@Component({
  selector: 'ngx-option-set',
  templateUrl: './option-set.component.html',
  styleUrls: ['./option-set.component.scss']
})
export class OptionSetComponent implements OnInit {
  isCodeExist = false;
  isReadonlyCode = false;

  isValidCode = true;
  isValidOption = true;

  defaultParam = {
  }

  option = {
    id: '',
    code: '',
    option: '',
    optionValues: [],
    productTypes: [],
    readOnly: false
  }
  loading: boolean = false;
  form: FormGroup;
  productOption: Array<any> = [];
  productOptionValue: Array<any> = [];
  productTypes: Array<any> = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private optionService: OptionService,
    private optionValuesService: OptionValuesService,
    private storageService: StorageService,
    private translate: TranslateService,
    private typesService: TypesService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.getOption()
  }

  loadDefaultParam() {
    this.defaultParam = {
      "lang":this.storageService.getLanguage,
      "store":this.storageService.getMerchant 
    }
  }
  ngOnInit() {
    this.loadDefaultParam();
    this.createForm();
    const optionId = this.activatedRoute.snapshot.paramMap.get('optionId');
    if (optionId) {
      let param = {
        lang: this.storageService.getLanguage(),
        store: this.storageService.getMerchant()
      }
      this.optionService.getOptionSetById(optionId, param)
        .subscribe((res) => {

          //console.log(JSON.stringify(res));

          this.option.id = res.id;
          this.option.code = res.code;
          this.option.option = res.option.id;
          this.option.readOnly = res.readOnly;
          let value = []
          let types = []
          if(res.values) {
            res.values.map((optionValue) => {
              value.push(optionValue.id)
            });
          }
          if(res.productTypes) {
            res.productTypes.map((productType) => {
              types.push(productType.id)
            });
          }
          this.option.optionValues = value;
          this.option.productTypes = types;
          this.adjustForm();

        }, error => {
          this.loading = false;
        });

        
    }
    this.translate.onLangChange.subscribe((lang) => {
      this.getOption();
    });
    
  }

  private adjustForm() {
    this.form.patchValue({
      readOnly: this.option.readOnly,
      code: this.option.code,
      option: this.option.option,
      optionValues: this.option.optionValues
    });

    if (this.option.id) {
      this.form.controls['code'].disable();
    }
  }


  private createForm() {
    this.form = this.fb.group({
      readOnly: [false],
      code: [{ value: '', disabled: false }, [Validators.required, Validators.pattern(validators.alphanumeric)]],
      option: ['',[Validators.required]],
      optionValues: this.fb.array([]),
      productTypes: this.fb.array([])
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
    this.getProductTypes();
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

  getProductTypes() {

    this.productTypes = [];
    this.typesService.getListOfTypes(this.defaultParam)
      .subscribe(res => {
        console.log(JSON.stringify(res));
        //this.productTypes = [...res];
        res.list.map((value) => {
          this.productTypes.push({ id: value.id, code: value.code});
        })
    }, error => {
      //TODO error
      this.loading = false;
    });
  }

  get code() {
    return this.form.get('code');
  }

  get opt() {
    return this.form.get('option');
  }


  checkCode(event) {
    this.isValidCode = true;
    const code = event.target.value.trim();
    this.optionService.checkOptionSetCode(this.option.code)
      .subscribe(res => {
        //console.log(res)
        this.isCodeExist = res.exists;
      });
  }

  clickOption() {
    this.isValidOption = true;
  }

  save() {
    this.loading = true;
    //console.log(this.options)

    this.isValidCode = true;
    this.isValidOption = true;

    let optionObj = this.form.value;
    optionObj.optionValues = this.option.optionValues;
    optionObj.productTypes = this.option.productTypes;

    //console.log('From object values ' + JSON.stringify(optionObj));

    if(this.form.invalid) {
      if(this.code.invalid) {
        this.isValidCode = false;
      }
      if(this.opt.invalid) {
        this.isValidOption = false;
      }
      this.loading = false;
      return;
    }

    if (this.option.id) {
      
      this.optionService.updateSetOption(this.option.id, optionObj)
        .subscribe((res) => {
          this.toastr.success(this.translate.instant('OPTION.SET_OPTION_UPDATED'));
          this.loading = false;
        }, error => {
          this.loading = false;
        });
     
    }
    else {
      this.optionService.createSetOption(optionObj)
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
    //console.log(e)
    this.option.optionValues = e;
  }

  setProductTypeSelected(e) {
    this.option.productTypes = e;
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    //console.log('Invalid fields ' + invalid);
    //console.log('Form invalid ' + this.form.invalid);
  }
}
