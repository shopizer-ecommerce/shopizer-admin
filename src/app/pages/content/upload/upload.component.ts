import { Component, Input } from '@angular/core';

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {

  files: File[] = [];
  validDrag: Boolean;
  @Input() multi: string

  @Input() onUpload = (files: File[]) => { };

  onFilesChange() {

    this.onUpload([...this.files]);

    this.files.length = 0;
  }

}
