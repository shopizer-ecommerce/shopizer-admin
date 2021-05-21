import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { CrudService } from '../../shared/services/crud.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ImageBrowserComponent } from '../../../@theme/components/image-browser/image-browser.component';
import { NbDialogService } from '@nebular/theme';
import { validators } from '../../shared/validation/validators';
import { TranslateService } from '@ngx-translate/core';
import { ConfigService } from '../../shared/services/config.service';
import { forkJoin } from 'rxjs';

declare var jquery: any;
declare var $: any;
@Component({
  selector: 'add-box',
  templateUrl: './add-box.component.html',
  styleUrls: ['./add-box.component.scss'],
})
export class AddBoxComponent implements OnInit  {
  loader = false;
  
  form: FormGroup;
  content: any;
  uniqueCode: string;//identifier fromroute

  languages = [];

  isCodeUnique = true;
  buttonText: any = 'Save'

  defaultLanguage = localStorage.getItem('lang');
  //changed from seo section
  currentLanguage = localStorage.getItem('lang');
  // title: any = 'Add Box Details'
  uploadData = new FormData();
  description: Array<any> = []
  page = {
    visible: false,
    mainmenu: false,
    code: '',
    order: '',
  }
  config = {
    placeholder: '',
    tabsize: 2,
    height: 195,
    toolbar: [
      ['misc', ['codeview', 'fullscreen', 'undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style', 'ul', 'ol', 'height']],
      ['insert', ['table', 'link', 'video']],
      ['customButtons', ['testBtn']]
    ],
    buttons: {
      'testBtn': this.customButton.bind(this)
    },
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
  };
  params = this.param();
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  constructor(
    private fb: FormBuilder,
    private crudService: CrudService,
    public router: Router,
    private toastr: ToastrService,
    private configService: ConfigService,
    private dialogService: NbDialogService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService
  ) { }

  param() {
    return {
      store: localStorage.getItem('merchant'),
      lang: "_all"
    };
  }
  ngOnInit() {
    this.loader = true;
    this.uniqueCode = this.activatedRoute.snapshot.paramMap.get('code');
    const languages = this.configService.getListOfSupportedLanguages(localStorage.getItem('merchant'))
    .subscribe((languages) => {
      console.log(JSON.stringify(languages));
      this.languages = [...languages];
      this.createForm();
      this.addFormArray();
      if (this.uniqueCode != null) {
        this.loadContent();
        this.fillForm();
      }
      this.loader = false;


    }, error => {
      this.toastr.error(error.error.message);
      this.loader = false;
    });
  }

  private loadContent() {
    this.loader = true;
    const box = this.crudService.get('/v1/private/content/boxes/' + this.uniqueCode, this.param());
    this.content = box;
    this.loader = false;

  }

  private createForm() {
    this.form = this.fb.group({
      code: ['', [Validators.required,Validators.pattern(validators.alphanumeric)]],
      visible: [false],
      name: ['', [Validators.required]],
      selectedLanguage: [this.defaultLanguage, [Validators.required]],
      descriptions: this.fb.array([]),
    });
  }

  addFormArray() {
    const control = <FormArray>this.form.controls.descriptions;
    this.languages.forEach(lang => {
      control.push(
        this.fb.group({
          language: [lang.code, [Validators.required]],
          description: ['']
        })
      );
    });
  }
  
  fillForm() {
    this.form.patchValue({
      code: this.content.code,
      visible: this.content.visible,
      name: this.content.description.name,
      selectedLanguage: this.defaultLanguage,
      descriptions: [],
    });
    this.fillFormArray();
    this.findInvalidControls();

  }

  fillFormArray() {
    this.form.value.descriptions.forEach((desc, index) => {
      if (this.content != null && this.content.descriptions) {
        this.content.descriptions.forEach((description) => {
          if (desc.language === description.language) {
            (<FormArray>this.form.get('descriptions')).at(index).patchValue({
              language: description.language,
              description: description.description,
              name: this.content.name
            });
          }
        });
      }
    });
  }


  save() {

    this.form.markAllAsTouched();
    if(this.findInvalidControls().length > 0) {
      return;
    }
    this.loader = true;
    const object = this.form.value;
    console.log('Content saved ' + JSON.stringify(object));

    /**
    if (this.content.id) {//update
      this.crudService.put('/v1/private/content/box/' + this.content.id, object, this.param())
        .subscribe(data => {
          console.log(data);
          this.loader = false;
          this.toastr.success(this.translate.instant('CONTENT.CONTENT_UPDATED'));
          this.router.navigate(['/pages/content/boxes/list']);
        }, error => {
          this.toastr.error(error.error.message);
          this.loader = false;
        });
    } else {
      this.crudService.post('/v1/private/content/box', object)
        .subscribe(data => {
          this.loader = false;
          this.toastr.success(this.translate.instant('PRODUCT.PRODUCT_UPDATED'));
          this.router.navigate(['/pages/content/boxes/list']);
        }, error => {
          this.toastr.error(error.error.message);
          this.loader = false;
        });
    }
    **/
    this.loader = false;
  }


  public findInvalidControls() {
    const invalid = [];
    const controls = this.form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  get code() {
    return this.form.get('code');
  }

  get name() {
    return this.form.get('name');
  }

  get descriptions(): FormArray {
    return <FormArray>this.form.get('descriptions');
  }

  get selectedLanguage() {
    return this.form.get('selectedLanguage');
  }

  
  selectLanguage(lang) {
    this.form.patchValue({
      selectedLanguage: lang,
    });
    this.currentLanguage = lang;
    this.fillFormArray();
  }


  goToback() {
    this.router.navigate(['/pages/content/boxes/list']);
  }
  customButton(context) {
    const me = this;
    const ui = $.summernote.ui;
    const button = ui.button({
      contents: '<i class="note-icon-picture"></i>',
      tooltip: 'Gallery',
      container: '.note-editor',
      className: 'note-btn',
      click: function () {
        me.dialogService.open(ImageBrowserComponent, {}).onClose.subscribe(name => name && context.invoke('editor.pasteHTML', '<img src="' + name + '">'));
      }
    });
    return button.render();
  }
}
