import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
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

  public adapter;

  //accept add api with params
  
  //send add and remove api with params
  //

    //an array of image path
  @Input() images;
  //url to be used when adding
  @Input() addImageUrl;
  //url to be used when deleting
  @Input() deleteImageUrl;

  @Output() remove = new EventEmitter<string>();
  @Output() error = new EventEmitter<string>();
  @Output() success = new EventEmitter<string>();

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
  ) { }

  ngOnInit() {
    this.addUrl = this.addImageUrl;
    this.adapter = new ImageUploadingAdapter(this.http, this.addUrl);
  }

  refreshGrid() {
    this.imageList = this.images; 
  }

  onUploadError(file: FilePreviewModel) {

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

  errorImage(code) {
    console.log("Error image " + code);
    this.error.emit(code);

    //hide upload status
  }

  removeImage(image) {
    this.remove.emit(image.id);
  }

  public onValidationError(error: ValidationError): void {
    //alert(`Validation Error ${error.error} in ${error.file.name}`);
    this.errorImage(error.error);
  }

  public onUploadSuccess(e: FilePreviewModel): void {
    console.log(e);
    this.success.emit(e.fileName);
  }

  /* remove success */
  public onRemoveSuccess(e: FilePreviewModel) {
    console.log('Remove ');
    console.log(e);
  }

  public onFileAdded(file: FilePreviewModel) {
    console.log('File added ');
   // this.myFiles.push(file);
  }


}
