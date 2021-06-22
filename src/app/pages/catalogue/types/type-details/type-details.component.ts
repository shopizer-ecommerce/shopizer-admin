import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { validators } from '../../../shared/validation/validators';
import { TypesService } from '../services/types.service';
import { StorageService } from '../../../shared/services/storage.service';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../../shared/components/showcase-dialog/showcase-dialog.component';
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
  isReadonlyCode = false;
  isCodeExist = false;
  isValidCode = true;
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
  ) {

    this.languages = [...this.configService.languages];
  }

  ngOnInit(): void {
    const typeId = this.activatedRoute.snapshot.paramMap.get('id');
    this.createForm();
    if (typeId) {
      this.loading = true;
      let param = {
        //lang: this.storageService.getLanguage(),
        lang: "_all",
        store: this.storageService.getMerchant()
      }
      this.typesService.getType(typeId, param)
        .subscribe((res) => {

          //console.log(JSON.stringify(res));

          this.type.id = res.id;
          this.type.code = res.code;
          this.type.allowAddToCart = res.allowAddToCart;
          this.type.visible = res.visible;
          this.type.description = res.description;
          this.type.descriptions = res.descriptions;

          this.isReadonlyCode = true;

          this.adjustForm();
          this.loading = false;

        }, error => {
          this.loading = false;
        });
    }

  }

  private createForm() {
    this.form = this.fb.group({
      allowAddToCart: [true],
      visible: [false],
      code: [{ value: '', disabled: false }, [Validators.required, Validators.pattern(validators.alphanumeric)]],
      selectedLanguage: ['en'],
      descriptions: this.fb.array([]),
      // name: ['', [Validators.required]]
    });
    this.addFormArray();
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

  private adjustForm() {
    this.form.patchValue({
      allowAddToCart: this.type.allowAddToCart,
      visible: this.type.visible,
      code: this.type.code,
      selectedLanguage: 'en',
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
    //this.fillFormArray();
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
