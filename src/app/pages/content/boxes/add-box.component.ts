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
import { Description } from '../../shared/models/description';

declare var jquery: any;
declare var $: any;
@Component({
  selector: 'add-box',
  templateUrl: './add-box.component.html',
  styleUrls: ['./add-box.component.scss'],
})
export class AddBoxComponent implements OnInit {
  loader = false;

  form: FormGroup;
  content: any;

  languages = [];

  uniqueCode: string;//identifier fromroute
  isCodeExists = false;
  action: any = 'save'

  //default selected lang
  defaultLanguage = localStorage.getItem('lang');
  //changed from seo section
  currentLanguage = localStorage.getItem('lang');
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
    this.createForm();

    const languages = this.configService.getListOfSupportedLanguages(localStorage.getItem('merchant'))
      .subscribe((languages) => {
        this.languages = [...languages];
        this.addFormArray();//create array
        if (this.uniqueCode != null) {
          this.action = 'edit';
          this.loadContent();
        } else {
          this.loader = false;
        }

      }, error => {
        this.toastr.error(error.error.message);
        this.loader = false;
      });
  }


  private loadContent() {
    const box = this.crudService.get('/v1/private/content/boxes/' + this.uniqueCode, this.param()).subscribe(data => {
      this.content = data;
      this.fillForm();
      this.loader = false;
    });
  }

  private createForm() {
    this.form = this.fb.group({
      id: 0,
      code: ['', [Validators.required, Validators.pattern(validators.alphanumeric)]],
      visible: [false],
      selectedLanguage: [this.defaultLanguage, [Validators.required]],
      descriptions: this.fb.array([]),
    });
  }

  private addFormArray() {
    const control = <FormArray>this.form.controls.descriptions;
    this.languages.forEach(lang => {
      control.push(
        this.fb.group({
          language: [lang.code, [Validators.required]],
          description: [''],
          name: [''],
          title: [''],
          id: 0
        })
      );
    });
  }

  private fillForm() {
    this.form.patchValue({
      id: this.content.id,
      code: this.content.code,
      visible: this.content.visible,
      selectedLanguage: this.defaultLanguage,
      descriptions: [],
    });
    this.fillFormArray();
    this.findInvalidControls();

  }

  private fillFormArray() {
    this.form.value.descriptions.forEach((desc, index) => {
      if (this.content != null && this.content.descriptions) {
        this.content.descriptions.forEach((description) => {
          if (desc.language === description.language) {
            (<FormArray>this.form.get('descriptions')).at(index).patchValue({
              id: description.id,
              language: description.language,
              description: description.description,
              name: description.name,
              title: description.title
            });
          }
        });
      }
    });
  }

  private checkCode(event) {
    //check if box code already exists
    const code = event.target.value.trim();
    this.crudService.get('/v1/private/content/box/' + code + '/exists', this.param())
      .subscribe(res => {
        this.isCodeExists = res.exists;
      });

  }

  private save() {
    this.form.markAllAsTouched();
    if (this.findInvalidControls().length > 0) {
      return;
    }
    this.loader = true;

    //manouver resulting object
    var object = this.form.value;

    //remove un necessary
    delete object.selectedLanguage;


    /**
     * TODO revise put in utility
     */
    const tmpObj = {
      name: '',
      friendlyUrl: ''
    };
    object.descriptions.forEach((el) => {
      if (el.name === '') {
        el.name = object.code;
      }
    });

    // check required fields
    if (tmpObj.name === '' || tmpObj.friendlyUrl === '' || object.code === '') {

    } else {
      object.descriptions.forEach((el) => {
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
      object.descriptions.forEach(el => {
        for (const elKey in el) {
          if (el.hasOwnProperty(elKey)) {
            el.name = el.name.trim(); // trim name
            if (typeof el[elKey] === 'undefined') {
              el[elKey] = '';
            }
          }
        }
      });
    }

    /**
    let errors = this.findInvalidControls();
    if (errors.length > 0) {
      this.toastr.error(this.translate.instant('COMMON.FILL_REQUIRED_FIELDS'));
      return;
    }
    **/
    //for debugging
    //console.log(JSON.stringify(categoryObject));
    //return;

    //console.log('Content saved ' + JSON.stringify(object));

    if (object.id > 0) {//update
      //set content name required field
      this.crudService.put('/v1/private/content/box/' + this.content.id, object, this.param())
        .subscribe(data => {
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
