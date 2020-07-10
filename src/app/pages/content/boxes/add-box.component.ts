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
  languages: Array<any> = [{ 'code': 'en', 'name': 'English' }, { 'code': 'fr', 'name': 'French' }]
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

  public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  constructor(
    private crudService: CrudService,
    public router: Router,
    private toastr: ToastrService,

    private dialogService: NbDialogService
  ) {

  }
  createBoxes() {
    this.loadingList = true;
    let param = {
      "code": this.page.code,
      "descriptions": [
        {
          "contentType": "BOXES",
          "language": 'en',
          "name": this.page.ePagename,
          "pageContent": this.page.ePagecontent
        },
        {
          "contentType": "BOXES",
          "language": 'fr',
          "name": this.page.ePagename,
          "pageContent": this.page.ePagecontent
        }
      ],
      "displayedInMenu": this.page.mainmenu
    }
    this.crudService.post('/v1/private/content/page', param)
      .subscribe(data => {
        this.loadingList = false;
        this.toastr.success('Boxe added successfully');
        // this.buttonText = 'Update';
        // this.titleText = 'Update Manage Page';
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
