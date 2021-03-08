import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { CrudService } from '../../shared/services/crud.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ImageBrowserComponent } from '../../../@theme/components/image-browser/image-browser.component';
import { NbDialogService } from '@nebular/theme';
import { ConfigService } from '../../shared/services/config.service';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'add-box',
  templateUrl: './add-box.component.html',
  styleUrls: ['./add-box.component.scss'],
})
export class AddBoxComponent {
  loadingList = false;
  languages: Array<any> = [];
  contentBoxID: any;
  updatedID: any;
  buttonText: any = 'Save'
  // title: any = 'Add Box Details'
  language: string = 'en';
  description: Array<any> = []
  page = {
    visible: false,
    mainmenu: false,
    code: '',
    order: '',
    //   language: 'en',
    //   ePagename: '',
    //   ePagecontent: '',
  }
  editorConfig = {
    placeholder: '',
    tabsize: 2,
    height: 195,
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
  params = this.loadParams();
  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
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
            // path: '',
            // friendlyUrl: '',
            // title: '',
            // metaDescription: '',
            // keyWords: '',
            // highlights: ''
          });
        });
      });
    if (localStorage.getItem('contentBoxID')) {
      this.contentBoxID = localStorage.getItem('contentBoxID')
      this.getBoxDetails();
      // this.title = "Update Box Details"
      this.buttonText = "Update"
    }
  }
  loadParams() {
    return {
      // store: this.storageService.getMerchant(),
      lang: "_all"
    };
  }
  getBoxDetails() {
    this.crudService.get('/v1/private/content/boxes/' + this.contentBoxID + '?lang=' + this.language)
      .subscribe(data => {
        console.log(data)
        this.updatedID = data.id;
        this.page.code = data.code;
        this.page.visible = data.visible;
        this.page.mainmenu = data.displayedInMenu;


        // data.descriptions.forEach((newvalue, index) => {
        this.description.forEach((value, index) => {
          if (this.language == value.language) {
            value.name = data.description.name
            // value.friendlyUrl = data.description.friendlyUrl
            // value.title = data.description.title
            value.description = data.description.description
            // value.metaDescription = data.description.metaDescription
            // value.keyWords = data.description.keyWords
          }
          // });

        })
      }, error => {
      });
  }
  createBoxes() {
    this.loadingList = true;
    let param = {
      "code": this.page.code,
      // "contentType": "BOX",
      "descriptions": this.description,
      // "displayedInMenu": this.page.mainmenu,
      "visible": this.page.visible
    }
    if (localStorage.getItem('contentBoxID')) {
      this.crudService.put('/v1/private/content/box/' + this.updatedID, param)
        .subscribe(data => {
          console.log(data);
          this.loadingList = false;
          this.toastr.success('Box updated successfully');
          this.router.navigate(['/pages/content/boxes/list']);
        }, error => {
          this.loadingList = false;
        });
    } else {
      this.crudService.post('/v1/private/content/box', param)
        .subscribe(data => {
          this.loadingList = false;
          this.toastr.success('Box added successfully');
          this.router.navigate(['/pages/content/boxes/list']);
        }, error => {
          this.loadingList = false;
        });
    }
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
