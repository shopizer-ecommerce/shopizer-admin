import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-image-uploading',
  templateUrl: './image-uploading.component.html',
  styleUrls: ['./image-uploading.component.scss']
})
export class ImageUploadingComponent implements OnInit, OnChanges {
  @Input() productImages;
  @Output() imageChanged = new EventEmitter<any>();
  images = [];
  maxSize = 10485760;

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.productImages.previousValue && changes.productImages.currentValue) {
      this.images = this.productImages ? [...this.productImages] : [];
    }
  }

  onSelectFile(event) {
    const quantity = event.target.files.length + this.images.length;
    if (event.target.files && quantity < 10) {
      const filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        this.readfiles(event.target.files[i]);
      }
    } else {
      this.toastr.error(this.translate.instant('COMMON.ONLY_TEN_IMAGES'));
    }
  }

  readfiles(files) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileReader = event.target as FileReader;
      const img = {
        id: 'img' + Math.floor(Math.random() * 1000),
        imageUrl: fileReader.result as string,
        newImage: true,
        bigSize: files.size > this.maxSize,
        name: files.name
      };
      this.images.push(img);
      this.imageChanged.emit({ type: 'add', data: files });
    };
    reader.readAsDataURL(files);
  }

  removeImage(image) {
    if (!image.hasOwnProperty('newImage')) {
      this.imageChanged.emit({ type: 'remove', data: image.id });
    } else {
      this.imageChanged.emit({ type: 'remove-one', data: image });
    }
    const index = this.images.findIndex((el) => el.id === image.id);
    if (index !== -1) {
      this.images.splice(index, 1);
    }
  }

}
