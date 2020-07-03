import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../../shared/services/config.service';
import { StoreService } from '../services/store.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../shared/services/storage.service';
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'ngx-store-landing-page',
  templateUrl: './store-landing-page.component.html',
  styleUrls: ['./store-landing-page.component.scss']
})
export class StoreLandingPageComponent implements OnInit {
  form: FormGroup;
  store;
  languages = [];
  selectedItem = '1';
  sidemenuLinks = [
    {
      id: '0',
      title: 'Store branding',
      key: 'COMPONENTS.STORE_BRANDING',
      link: 'store-branding'
    },
    {
      id: '1',
      title: 'Store home page',
      key: 'COMPONENTS.STORE_LANDING',
      link: 'store-landing'
    },
    {
      id: '2',
      title: 'Store details',
      key: 'COMPONENTS.STORE_DETAILS',
      link: 'store'
    }
  ];
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
  loading = false;
  page;

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private storeService: StoreService,
    private toastrService: ToastrService,
    private translate: TranslateService,
    private storageService: StorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.createForm();
    const code = this.activatedRoute.snapshot.paramMap.get('code');

    forkJoin(
        this.storeService.getPageContent('LANDING_PAGE', code),
        this.storeService.getStore(code)
      )
      .subscribe(([res, st]) => {
        if(!res.status) {//404 should not rais an error
          this.page = res;
        }
        this.store = st;
        this.languages = this.store.supportedLanguages;
        this.createForm();
        this.fillForm();
    });
  }

  route(link) {
    this.router.navigate(['pages/store-management/' + link + "/", this.store.code]);
  }

  private createForm() {
    this.form = this.fb.group({
      selectedLanguage: ['', [Validators.required]],
      code: [''],
      id: '',
      descriptions: this.fb.array([]),
    });
    this.addFormArray();
  }

  addFormArray() {
    const control = <FormArray>this.form.controls.descriptions;
    this.languages.forEach(lang => {
      control.push(
        this.fb.group({
          language: [lang.code, [Validators.required]],
          name: ['', [Validators.required]],
          metaDescription: [''],
          id: '',
          keyWords: [''],
          description: [''],
        })
      );
    });
  }

  fillForm() {
    this.form.patchValue({
      descriptions: [],
      selectedLanguage: 'en',
    });
    if(this.page) {
      this.fillFormArray();
    }
  }

  fillFormArray() {
    this.form.patchValue({
      id: this.page.id
    });
    this.form.value.descriptions.forEach((desc, index) => {
      this.page.descriptions.forEach((description) => {
        if (desc.language === description.language) {
          (<FormArray>this.form.get('descriptions')).at(index).patchValue({
            language: description.language,
            name: description.name,
            metaDescription: description.metaDescription,
            keyWords: description.keyWords,
            description: description.description,
          });
        }
      });
    });
  }

  get selectedLanguage() {
    return this.form.get('selectedLanguage');
  }

  get descriptions(): FormArray {
    return <FormArray>this.form.get('descriptions');
  }

  save() {
    this.form.patchValue({ name: this.storageService.getMerchant() });
    this.form.patchValue({ code: 'LANDING_PAGE' });
    console.log(JSON.stringify(this.form.value));
    if (this.page && this.page.id) {
      this.storeService.updatePageContent(this.page.id, this.form.value)
        .subscribe(res => {
          this.toastrService.success(this.translate.instant('STORE_LANDING.PAGE_UPDATED'));
        });
    } else {
      JSON.stringify(this.form.value);
      this.storeService.createPageContent(this.form.value, this.store.code)
        .subscribe(res => {
          this.toastrService.success(this.translate.instant('STORE_LANDING.PAGE_ADDED'));
          this.router.navigate(['pages/store-management/store/', this.store.code]);
        });
    }
  }

}
