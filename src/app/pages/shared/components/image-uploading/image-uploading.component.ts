import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from "@angular/common/http";
import { ImageUploadingAdapter } from "./image-uploading-adapter";
import { FilePickerComponent } from "ngx-awesome-uploader";
import { FilePreviewModel } from "ngx-awesome-uploader";
import { UploaderCaptions } from "ngx-awesome-uploader";
import { ValidationError } from "ngx-awesome-uploader";
import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { Image } from '../../../shared/models/image';


@Component({
  selector: 'ngx-image-uploading',
  templateUrl: './image-uploading.component.html',
  styleUrls: ['./image-uploading.component.scss']
})
export class ImageUploadingComponent implements OnInit {
  
  @ViewChild("uploader", { static: false }) uploader: FilePickerComponent;

  //accept add api with params
  
  //send add and remove api with params
  //

    //an array of image path
  @Input() images;
  //url to be used when adding
  @Input() addImageUrl;
  //url to be used when deleting
  @Input() deleteImageUrl;

  public adapter;

  @Output() remove = new EventEmitter<string>();

  imageList: Image[] = [];

  addUrl;
  removeUrl;
  maxSize = 10485760;
  details = false;

  uploadItemTemplate: any;

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService,
    private http: HttpClient
  ) {
    //this.addUrl = this.addImageUrl;
    //this.removeUrl = this.deleteImageUrl;
    //this.adapter = new ImageUploadingAdapter(this.http, this.addImageUrl, this.deleteImageUrl);
  }

  ngOnInit() {

  }

  refreshGrid() {
    this.imageList = this.images; 
  }

  ngOnChanges(changes: SimpleChanges) {
   //console.log('On change');
    //if (!changes.productImages.previousValue && changes.productImages.currentValue) {
      //this.imageList = this.images ? [...this.images
      //] : [];
    //}
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
    this.details = true;
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
      console.log(files)
      //this.imageChanged.emit({ type: 'add', data: files });
    };
    reader.readAsDataURL(files);
    this.details = false;
  }

  removeImage(image) {
    //this.details = true;
    console.log('Image remove ' + image.id);
    this.remove.emit(image.id);
    console.log('After image remove ' + image.id);
    //emit image remove
    /**
    if (!image.hasOwnProperty('newImage')) {
      this.imageChanged.emit({ type: 'remove', data: image.id });
    } else {
      this.imageChanged.emit({ type: 'remove-one', data: image });
    }
    const index = this.images.findIndex((el) => el.id === image.id);
    if (index !== -1) {
      this.images.splice(index, 1);
    }
    this.details = false;
    **/
  }

  public onValidationError(error: ValidationError): void {
    alert(`Validation Error ${error.error} in ${error.file.name}`);
  }
  public onUploadSuccess(e: FilePreviewModel): void {
    console.log(e);
    //console.log(this.myFiles);
  }
  public onRemoveSuccess(e: FilePreviewModel) {
    console.log(e);
  }
  public onFileAdded(file: FilePreviewModel) {
   // this.myFiles.push(file);
  }
  public myCustomValidator(file: File): Observable<boolean> {
    if (!file.name.includes("uploader")) {
      return of(true).pipe(delay(2000));
    }
    return of(false).pipe(delay(2000));
  }

}
