import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CrudService } from '../../../pages/shared/services/crud.service';
import { NbDialogRef } from '@nebular/theme';
@Component({
  selector: 'ngx-image-browser',
  templateUrl: './image-browser.component.html',
  styleUrls: ['./image-browser.component.scss']
})
export class ImageBrowserComponent implements OnInit {
  uploadedFiles: any[] = [];
  loadingList = false;
  constructor(
    private crudService: CrudService,
    protected ref: NbDialogRef<ImageBrowserComponent>
  ) {
  }

  ngOnInit() {
    this.getImages();
  }
  getImages() {
    this.loadingList = true;
    this.crudService.get('/v1/content/images')
      .subscribe(data => {

        this.uploadedFiles = data.content;
        this.loadingList = false;
      }, error => {
        this.loadingList = false;
      });
  }
  cancel() {
    this.ref.close();
  }
  openImage(value) {
    this.ref.close(value.path + value.name);
  }
}
