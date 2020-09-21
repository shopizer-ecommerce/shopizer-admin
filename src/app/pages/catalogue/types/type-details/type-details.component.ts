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

  type = {
    id: '',
    code: '',
    name: '',
    allowAddToCart: false
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
  ) { 


  }

  ngOnInit(): void {
    const typeCode = this.activatedRoute.snapshot.paramMap.get('typCode');
    this.createForm();
    if (typeCode) {
      this.loading = true;
      let param = {
        lang: this.storageService.getLanguage(),
        store: this.storageService.getMerchant()
      }
      this.typesService.getType(typeCode, param)
        .subscribe((res) => {

          console.log(JSON.stringify(res));

          this.type.id = res.id;
          this.type.code = res.code;
          this.type.name = res.name;
          this.type.allowAddToCart = res.allowAddToCart;
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
      code: [{ value: '', disabled: false }, [Validators.required, Validators.pattern(validators.alphanumeric)]],
      name: ['',[Validators.required]],
    });
  }

  private adjustForm() {
    this.form.patchValue({
      allowAddToCart: this.type.allowAddToCart,
      code: this.type.code,
      name: this.type.name,
    });

    if (this.type.id) {
      this.form.controls['code'].disable();
    }
  }

  save() {
    this.loading = true;
    this.isValidCode = true;


    if(this.form.invalid) {
      if(this.code.invalid) {
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

  checkCode(event) {
    const code = event.target.value.trim();
    console.log('Entering checkCode ' + code);
    this.isValidCode = true;
    
    this.typesService.checkCode(code)
      .subscribe(res => {
        console.log(res)
        this.isCodeExist = res.exists;
      });
  }

}
