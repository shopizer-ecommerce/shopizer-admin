import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { CrudService } from '../../shared/services/crud.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ImageBrowserComponent } from '../../../@theme/components/image-browser/image-browser.component';
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
  mainmenu: any = false;
  code: string = '';
  order: number = 0;
  buttonText: string = 'Submit';
  titleText: string = 'Create Manage Page';
  language: string = 'en';
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
  en = {
    metaDetails: '',
    name: '',
    pageContent: '',
    path: '',
    slug: '',
    title: '',
    keyword: '',
    productGroup: ''
  }

  languages: Array<any> = [{ 'code': 'en', 'name': 'English' }, { 'code': 'fr', 'name': 'French' }]
  codeExits: any;
  message: string = '';
  constructor(
    private crudService: CrudService,
    public router: Router,
    private toastr: ToastrService,

    private dialogService: NbDialogService
  ) {
    if (localStorage.getItem('contentpageid')) {
      this.buttonText = 'Update';
      this.titleText = 'Update Manage Page';
      this.getContentDetails()
    }
  }

  getContentDetails() {

    this.crudService.get('/v1/content/pages/' + localStorage.getItem('contentpageid') + '?lang=' + this.language)
      .subscribe(data => {
        console.log(data, '************')
        this.en = data;
        this.visible = data.visible;
        this.mainmenu = data.displayedInMenu;
        this.code = data.code;
        this.order = 0;
        this.en.name = data.description.name
        this.en.slug = data.description.friendlyUrl
        this.en.title = data.description.title
        this.en.keyword = data.description.keyWords
        this.en.metaDetails = data.description.metaDescription
        this.en.pageContent = data.description.description
      }, error => {
      });
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
  urlTitle(event) {
    let text = event.target.value;
    var characters = [' ', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '+', '=', '_', '{', '}', '[', ']', '|', '/', '<', '>', ',', '.', '?', '--'];

    for (var i = 0; i < characters.length; i++) {
      var char = String(characters[i]);
      text = text.replace(new RegExp("\\" + char, "g"), '-');
    }
    text = text.toLowerCase();
    this.en.slug = text;
  }

  createPages() {
    this.loadingList = true;
    let param = {
      "code": this.code,
      "contentType": "PAGE",
      "descriptions": [
        {

          "language": 'en',
          "metaDescription": this.en.metaDetails,
          "keyWords": this.en.keyword,
          "name": this.en.name,
          "description": this.en.pageContent,
          "friendlyUrl": this.en.slug,
          "title": this.en.title
        },
        {
          // "contentType": "PAGE",
          "language": 'fr',
          "metaDescription": this.en.metaDetails,
          "keyWords": this.en.keyword,
          "name": this.en.name,
          "description": this.en.pageContent,
          "friendlyUrl": this.en.slug,
          "title": this.en.title
        }
      ],
      "displayedInMenu": this.mainmenu,
      "visible": this.visible
    }
    this.crudService.post('/v1/private/content', param)
      .subscribe(data => {
        console.log(data);
        this.loadingList = false;
        this.toastr.success('Page added successfully');
        this.buttonText = 'Update';
        this.titleText = 'Update Manage Page';
        // this.getContentDetails();
        // this.router.navigate(['/pages/content/pages/list']);
      }, error => {
        this.loadingList = false;
      });
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
