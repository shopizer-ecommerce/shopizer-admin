import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { CrudService } from '../../shared/services/crud.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare var CKEDITOR: any;

CKEDITOR.plugins.addExternal('imagebrowser', '../imagebrowser/', 'plugin.js');
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
  ckeConfig = {

    uiColor: '#d1d1d1',
    height: 400,
    language: "en",
    allowedContent: true,
    // ckfinder: {
    // 	uploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files&responseType=json',
    // },
    filebrowserBrowseUrl: 'http://localhost:4200/#/gallery',
    // filebrowserUploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Files',
    toolbar: [
      { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
      {
        name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv',
          '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl']
      },
      '/',
      { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
      { name: 'colors', items: ['TextColor', 'BGColor'] },
      { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
      { name: "insert", items: ["Image", "Table", "HorizontalRule", "SpecialChar", "Iframe", "imageExplorer"] }

    ]
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
        this.visible = data.displayedInMenu;
        this.mainmenu = data.displayedInMenu;
        this.code = data.code;
        this.order = 0;
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
      "descriptions": [
        {
          "contentType": "PAGE",
          "language": 'en',
          "metaDetails": this.en.metaDetails,
          "name": this.en.name,
          "pageContent": this.en.pageContent,
          "slug": this.en.slug,
          "title": this.en.title
        },
        {
          "contentType": "PAGE",
          "language": 'fr',
          "metaDetails": this.en.metaDetails,
          "name": this.en.name,
          "pageContent": this.en.pageContent,
          "slug": this.en.slug,
          "title": this.en.title
        }
      ],
      "displayedInMenu": this.mainmenu
    }
    this.crudService.post('/v1/private/content/page', param)
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


}
