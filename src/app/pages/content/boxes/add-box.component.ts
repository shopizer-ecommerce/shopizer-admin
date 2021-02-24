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
  selector: 'add-box',
  templateUrl: './add-box.component.html',
  styleUrls: ['./add-box.component.scss'],
})
export class AddBoxComponent {
  loadingList = false;
  languages: Array<any> = [{ 'code': 'en', 'name': 'English' }, { 'code': 'fr', 'name': 'French' }];
  contentBoxID: any;
  buttonText: any = 'Submit'
  title: any = 'Create Manage Box'
  page = {
    visible: false,
    mainmenu: false,
    code: '',
    order: '',
    language: 'en',
    ePagename: '',
    ePagecontent: '',
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

    private dialogService: NbDialogService
  ) {
    if (localStorage.getItem('contentBoxID')) {
      this.contentBoxID = localStorage.getItem('contentBoxID')
      this.getBoxDetails();
      this.title = "Update Manage Box"
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
    this.crudService.get('/v1/private/content/boxes/' + this.contentBoxID)
      .subscribe(data => {
        console.log(data)

        this.page.code = data.code;
        this.page.visible = data.visible;
        this.page.ePagename = data.description.name;
        this.page.ePagecontent = data.description.description;
      }, error => {
      });
  }
  createBoxes() {
    this.loadingList = true;
    let param = {
      "code": this.page.code,
      "contentType": "BOX",
      "descriptions": [
        {
          // "contentType": "BOXES",
          "language": 'en',
          "name": this.page.ePagename,
          "description": this.page.ePagecontent
        },
        {
          // "contentType": "BOXES",
          "language": 'fr',
          "name": this.page.ePagename,
          "description": this.page.ePagecontent
        }
      ],
      "displayedInMenu": this.page.mainmenu,
      "visible": this.page.visible
    }
    this.crudService.post('/v1/private/content/', param)
      .subscribe(data => {
        this.loadingList = false;
        this.toastr.success('Box added successfully');
        // this.buttonText = 'Update';
        // this.titleText = 'Update Manage Page';
        // this.getContentDetails();
        this.router.navigate(['/pages/content/boxes/list']);
      }, error => {
        this.loadingList = false;
      });
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
