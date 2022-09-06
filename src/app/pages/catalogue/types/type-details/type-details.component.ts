import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { validators } from '../../../shared/validation/validators';
import { TypesService } from '../services/types.service';
import { StorageService } from '../../../shared/services/storage.service';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../../shared/components/showcase-dialog/showcase-dialog.component';
import { forkJoin } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigService } from '../../../shared/services/config.service';
@Component({
  selector: 'ngx-types',
  templateUrl: './type-details.component.html',
  styleUrls: ['./type-details.component.scss']
})
export class TypeDetailsComponent implements OnInit {

  form: FormGroup;
  loading: boolean = false;
  loaded: boolean = false;
  isReadonlyCode = false;
  isCodeExist = false;
  isValidCode = true;
  defaultLanguage = localStorage.getItem('lang');
  languages = [];
  type = {
    id: '',
    code: '',
    allowAddToCart: false,
    visible: '',
    description: { name: '', language: '' },
    descriptions: []
  }

  constructor(
    private _sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private dialogService: NbDialogService,
    private toastr: ToastrService,
    private storageService: StorageService,
    private typesService: TypesService,
    private activatedRoute: ActivatedRoute,
    private configService: ConfigService
  ) { }

  ngOnInit(): void {

    this.loading = true;
    
    let param = {
      //lang: this.storageService.getLanguage(),
      lang: "_all",
      store: this.storageService.getMerchant()
    }
    const typeId = this.activatedRoute.snapshot.paramMap.get('id');
    if (typeId) {
    const types$ = this.typesService.getType(typeId, param)
    const config$ = this.configService.getListOfSupportedLanguages(localStorage.getItem('merchant'));
    forkJoin([types$, config$])
      .subscribe(([productType, languages]) => {

        this.type.id = productType.id;
        this.type.code = productType.code;
        this.type.allowAddToCart = productType.allowAddToCart;
        this.type.visible = productType.visible;
        this.type.description = productType.description;
        this.type.descriptions = productType.descriptions;

        this.isReadonlyCode = true;
        this.languages = [...languages];
        this.createForm();
        this.addFormArray();
        if(this.type) {
          this.fillForm();
        }

        this.loading = false;
        this.loaded = true;

      
    });
  } else {
    const config$ = this.configService.getListOfSupportedLanguages(localStorage.getItem('merchant'))
      .subscribe((languages) => {
        this.languages = [...languages];
        this.createForm();
        this.addFormArray();
        this.loading = false;
        this.loaded = true;
    });
  }


  }

  private createForm() {
    this.form = this.fb.group({
      allowAddToCart: [true],
      visible: [false],
      code: [{ value: '', disabled: false }, [Validators.required, Validators.pattern(validators.alphanumeric)]],
      selectedLanguage: this.defaultLanguage,
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
        })
      );
    });
  }

  private fillForm() {
    this.form.patchValue({
      allowAddToCart: this.type.allowAddToCart,
      visible: this.type.visible,
      code: this.type.code,
      selectedLanguage: this.defaultLanguage
    });
    if (this.type.id) {
      this.form.controls['code'].disable();
    }
    if (this.type.descriptions) {
      this.fillFormArray();
    }
  }
  fillFormArray() {
    this.form.value.descriptions.forEach((desc, index) => {
      if (desc.language === this.selectedLanguage.value) {
        this.type.descriptions.forEach((d, i) => {
          if(d.language === this.selectedLanguage.value) {
            (<FormArray>this.form.get('descriptions')).at(index).patchValue({
              language: d.language,
              name: d.name,
            });
          }
        });
      }
    });
  }

  save() {
    this.loading = true;
    this.isValidCode = true;


    if (this.form.invalid) {
      if (this.code.invalid) {
        this.isValidCode = false;
      }

      this.loading = false;
      return;
    }

    let obj = this.form.value;

    if (this.type.id) {

      this.typesService.updateType(this.type.id, obj)
        .subscribe((res) => {
          this.toastr.success(this.translate.instant('PRODUCT_TYPE.PRODUCT_TYPE_UPDATED'));
          this.loading = false;
        }, error => {
          this.loading = false;
        });

    }
    else {
      this.typesService.createType(obj)
        .subscribe((res) => {
          this.toastr.success(this.translate.instant('PRODUCT_TYPE.PRODUCT_TYPE_CREATED'));
          this.goToback();
          this.loading = false;
        }, error => {
          this.loading = false;
        });
    }
  }
  goToback() {
    this.router.navigate(['pages/catalogue/types/types-list']);
  }


  get code() {
    return this.form.get('code');
  }
  get selectedLanguage() {
    return this.form.get('selectedLanguage');
  }



  selectLanguage(lang) {
    this.form.patchValue({
      selectedLanguage: lang,
    });
  }

  get descriptions(): FormArray {
    return <FormArray>this.form.get('descriptions');
  }

  checkCode(event) {
    const code = event.target.value.trim();
    //console.log('Entering checkCode ' + code);
    this.isValidCode = true;

    this.typesService.checkCode(code)
      .subscribe(res => {
        //console.log(res)
        this.isCodeExist = res.exists;
      });
  }

}
