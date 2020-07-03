import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CrudService } from '../../../pages/shared/services/crud.service';
@Component({
  selector: 'ngx-image-browser',
  templateUrl: './image-browser.component.html',
  styleUrls: ['./image-browser.component.scss']
})
export class ImageBrowserComponent implements OnInit {
  uploadedFiles: any[] = [];
  constructor(
    private crudService: CrudService
  ) {
  }

  ngOnInit() {
    this.getImages();
  }
  getImages() {
    this.crudService.get('/v1/content/images')
      .subscribe(data => {
        this.uploadedFiles = data.content;
      }, error => {

      });
  }
  openImage(value) {
    window.close();
    window.opener.CKEDITOR.tools.callFunction(1, value.path + value.name);
  }
}
