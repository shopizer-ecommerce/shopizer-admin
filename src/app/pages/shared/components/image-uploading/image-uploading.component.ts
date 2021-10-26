import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ImageUploadingAdapter } from "./image-uploading-adapter";
import {
  FilePickerComponent,
  FilePreviewModel,
  UploaderCaptions,
  ValidationError,
} from "ngx-awesome-uploader";
import { Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { Image } from "../../../shared/models/image";
import { StoreService } from "../../../store-management/services/store.service";
import { UserService } from "../../../../@core/mock/users.service";

@Component({
  selector: "ngx-image-uploading",
  templateUrl: "./image-uploading.component.html",
  styleUrls: ["./image-uploading.component.scss"],
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
  @Output() update = new EventEmitter<any>();
  @Output() error = new EventEmitter<string>();
  @Output() success = new EventEmitter<string>();
  @Output() fileAdded = new EventEmitter<any>();

  // imageList: Image[] = [];

  addUrl;
  removeUrl;
  maxSize = 10485760;
  details = true;
  timer: any;
  uploadItemTemplate: any;

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService,
    private http: HttpClient,
    private storeService: UserService
  ) { }

  drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.images, event.previousIndex, event.currentIndex);
    let imageId = event.currentIndex;
    this.updateImage(event.currentIndex, this.images[imageId])
  }

  ngOnInit() {
    this.addUrl = this.addImageUrl;
    // console.log(this.addUrl, '--------------');
    this.adapter = new ImageUploadingAdapter(this.http, this.addUrl);
  }

  // refreshGrid() {
  //   this.imageList = this.images;
  // }

  onUploadError(file: FilePreviewModel) { }



  errorImage(code) {
    console.log("Error image " + code);
    this.error.emit(code);

    //hide upload status
  }

  removeImage(image) {
    this.remove.emit(image.id);
  }

  updateImage(index, id) {
    console.log("id::", id);
    let newObj = { "index": index + 1, "id": id.id }
    this.update.emit(newObj)
  }

  public onValidationError(error: ValidationError): void {
    this.errorImage(error.error);
  }

  public onChangeimage(e: any): void {
    console.log("function==>", e);

  }

  public onUploadSuccess(e: FilePreviewModel): void {
    var me = this;
    this.timer = setTimeout(() => {
      me.success.emit(e.fileName);
      me.details = false;
    }, 2000);
  }

  /* remove success */
  public onRemoveSuccess(e: FilePreviewModel) {
    console.log("Remove");
    console.log(e);
  }

  public onFileAdded(file: FilePreviewModel) {
    console.log("File added ", file);
    this.fileAdded.emit(true);
    clearTimeout(this.timer);
  }
}
