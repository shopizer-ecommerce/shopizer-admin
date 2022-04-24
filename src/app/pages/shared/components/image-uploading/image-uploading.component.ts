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

import { CdkDropListGroup, CdkDragEnter, CdkDropList, CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

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
import { ViewportRuler } from '@angular/cdk/overlay';
import { UserService } from "../../../../@core/mock/users.service";

@Component({
  selector: "ngx-image-uploading",
  templateUrl: "./image-uploading.component.html",
  styleUrls: ["./image-uploading.component.scss"],
})
export class ImageUploadingComponent implements OnInit {
  @ViewChild("uploader", { static: false }) uploader: FilePickerComponent;
  @ViewChild(CdkDropListGroup) listGroup: CdkDropListGroup<CdkDropList>;
  @ViewChild(CdkDropList) placeholder: CdkDropList;

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

  public target: CdkDropList;
  public targetIndex: number;
  public source: CdkDropList;
  public sourceIndex: number;
  public activeContainer;
  // public items: Array<number> = Array(10)
  //   .fill(0)
  //   .map((_, i) => i + 1);

  constructor(
    private toastr: ToastrService,
    private translate: TranslateService,
    private http: HttpClient,
    private storeService: UserService,
    private viewportRuler: ViewportRuler
  ) {
    this.target = null;
    this.source = null;
  }


  ngOnInit() {
    this.addUrl = this.addImageUrl;
    // console.log(this.addUrl, '--------------');
    this.adapter = new ImageUploadingAdapter(this.http, this.addUrl);
  }

  public itemTrackBy(item) {
    return item.id;
  }

  ngAfterViewInit() {
    const phElement = this.placeholder.element.nativeElement;

    phElement.style.display = 'none';
    phElement.parentElement.removeChild(phElement);
  }

  dropListDropped() {
    if (!this.target) {
      return;
    }

    const phElement = this.placeholder.element.nativeElement;
    const parent = phElement.parentElement;

    phElement.style.display = 'none';

    parent.removeChild(phElement);
    parent.appendChild(phElement);
    parent.insertBefore(
      this.source.element.nativeElement,
      parent.children[this.sourceIndex]
    );

    this.target = null;
    this.source = null;
    this.activeContainer = null;

    if (this.sourceIndex !== this.targetIndex) {
      moveItemInArray(this.images, this.sourceIndex, this.targetIndex);
    }
  }

  cdkDropListEntered(e: CdkDragEnter) {
    const drag = e.item;
    const drop = e.container;

    if (drop === this.placeholder) {
      return true;
    }

    const phElement = this.placeholder.element.nativeElement;
    const sourceElement = drag.dropContainer.element.nativeElement;
    const dropElement = drop.element.nativeElement;

    sourceElement.style.backgroundColor = 'transparent';

    console.log(phElement.getBoundingClientRect());
    console.log(sourceElement.getBoundingClientRect());
    console.log(dropElement.getBoundingClientRect());

    const dragIndex = __indexOf(
      dropElement.parentElement.children,
      this.source ? phElement : sourceElement
    );
    const dropIndex = __indexOf(
      dropElement.parentElement.children,
      dropElement
    );

    console.log("drag::", dragIndex, dropIndex);
    let newObj = { "id": this.images[dragIndex].id, "position": dropIndex + 1 }
    this.update.emit(newObj)


    if (!this.source) {
      this.sourceIndex = dragIndex;
      this.source = drag.dropContainer;

      phElement.style.width = dropElement.clientWidth / 2 + 'px';
      phElement.style.height = dropElement.clientHeight + 'px';
      console.log('dCont', sourceElement.clientWidth);
      console.log('ph', phElement.style.width, phElement.style.height);

      sourceElement.parentElement.removeChild(sourceElement);
    }

    this.targetIndex = dropIndex;
    this.target = drop;

    phElement.style.display = '';
    dropElement.parentElement.insertBefore(
      phElement,
      dropIndex > dragIndex ? dropElement.nextSibling : dropElement
    );

    requestAnimationFrame(() => {
      this.placeholder._dropListRef.enter(
        drag._dragRef,
        drag.element.nativeElement.offsetLeft,
        drag.element.nativeElement.offsetTop
      );
    });
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

  // updateImage(index, id) {
  //   console.log("id::", id);
  //   let newObj = { "previousIndex": index + 1, "currentIndex": id.id }
  //   this.update.emit(newObj)
  // }

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

function __indexOf(collection, node) {
  return Array.prototype.indexOf.call(collection, node);
}