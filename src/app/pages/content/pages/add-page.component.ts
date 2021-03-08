import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { CrudService } from '../../shared/services/crud.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from '../../shared/services/config.service';
import { ImageBrowserComponent } from '../../../@theme/components/image-browser/image-browser.component';
// import { environment } from '../../../';
import { NbDialogService } from '@nebular/theme';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss'],
})
export class AddPageComponent {
  loadingList = false;
  visible: any = false;
  descData: any;
  updatedID: any;
  mainmenu: any = false;
  code: string = '';
  order: number = 0;
  buttonText: string = 'Save';
  // titleText: string = 'Add page details';
  language: string = 'en';
  description: Array<any> = []
  languages: Array<any> = [];
  codeExits: any;
  message: string = '';

  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };


  editorConfig = {
    placeholder: '',
    tabsize: 2,
    height: 300,
    toolbar: [
      ['misc', ['codeview', 'undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video']],
      ['customButtons', ['testBtn']]
    ],
    buttons: {
      'testBtn': this.customButton.bind(this)
    },
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
  };
  constructor(
    private crudService: CrudService,
    public router: Router,
    private toastr: ToastrService,
    private configService: ConfigService,
    private dialogService: NbDialogService
  ) {
    this.configService.getListOfSupportedLanguages(localStorage.getItem('merchant'))
      .subscribe(res => {
        console.log(res);
        this.languages = res;
        this.languages.forEach(lang => {
          this.description.push({
            language: lang.code,
            name: '',
            description: '',
            path: '',
            friendlyUrl: '',
            title: '',
            metaDescription: '',
            keyWords: '',
            // highlights: ''
          });
        });
      });
    if (localStorage.getItem('contentpageid')) {
      this.buttonText = 'Update';
      // this.titleText = 'Update page details';
      this.getContentDetails()
    }

  }
  getContentDetails() {
    // console.log(this.language)
    this.crudService.get('/v1/content/pages/' + localStorage.getItem('contentpageid') + '?lang=_all')
      .subscribe(data => {
        // console.log(data, '************')
        // this.en = data;
        this.updatedID = data.id;
        this.visible = data.visible;
        this.mainmenu = data.displayedInMenu;
        this.code = data.code;
        this.order = 0;
        this.descData = data.descriptions
        this.fillForm()

      }, error => {
      });
  }
  fillForm() {
    this.descData.forEach((newvalue, index) => {
      this.description.forEach((value, index) => {
        if (newvalue.language == value.language) {
          value.name = newvalue.name
          value.friendlyUrl = newvalue.friendlyUrl
          value.title = newvalue.title
          value.description = newvalue.description
          value.metaDescription = newvalue.metaDescription
          value.keyWords = newvalue.keyWords
          // value.highlights = newvalue.highlights
        }
      });

    })
    // console.log(this.description);
  }
  focusOutFunction() {
    this.crudService.get('/v1/content/' + this.code)
      .subscribe(data => {
        this.codeExits = true;
        this.message = "This code already exist"
      }, error => {
        this.codeExits = false;
        this.message = "This code is available"
      });
  }
  urlTitle(event, lang) {
    let text = event.target.value;
    var characters = [' ', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '+', '=', '_', '{', '}', '[', ']', '|', '/', '<', '>', ',', '.', '?', '--'];

    for (var i = 0; i < characters.length; i++) {
      var char = String(characters[i]);
      text = text.replace(new RegExp("\\" + char, "g"), '-');
    }
    text = text.toLowerCase();
    this.description.forEach((value, index) => {
      if (lang == value.language) {
        value.friendlyUrl = text
      }
    });
    // this.en.slug = text;
  }

  createPages() {
    this.loadingList = true;
    let param = {
      "code": this.code,
      // "contentType": "PAGE",
      "descriptions": this.description,
      "linkToMenu": this.mainmenu,
      "visible": this.visible
    }
    if (localStorage.getItem('contentpageid')) {
      this.crudService.put('/v1/private/content/page/' + this.updatedID, param)
        .subscribe(data => {
          console.log(data);
          this.loadingList = false;
          this.toastr.success('Page updated successfully');
          // this.buttonText = 'Update';
          // this.titleText = 'Update page details';
          // // this.getContentDetails();
          this.router.navigate(['/pages/content/pages/list']);
        }, error => {
          this.loadingList = false;
        });
    } else {
      this.crudService.post('/v1/private/content/page', param)
        .subscribe(data => {
          console.log(data);
          this.loadingList = false;
          this.toastr.success('Page added successfully');
          // this.getContentDetails();
          this.router.navigate(['/pages/content/pages/list']);
        }, error => {
          this.loadingList = false;
        });
    }

  }
  goToback() {
    this.router.navigate(['/pages/content/pages/list']);
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
