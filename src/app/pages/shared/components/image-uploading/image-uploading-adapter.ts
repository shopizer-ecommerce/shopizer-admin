import {
  HttpRequest,
  HttpClient,
  HttpEvent,
  HttpEventType
} from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, of } from "rxjs";
import {
  FilePickerAdapter,
  UploadResponse,
  UploadStatus,
  FilePreviewModel
} from "ngx-awesome-uploader";

export class ImageUploadingAdapter extends FilePickerAdapter {

  //add entity api
  //remove api - what is the id
  addImage: string

  constructor(
    private http: HttpClient, addImageUrl: string) {
    super();
    this.addImage = addImageUrl;
  }
  public uploadFile(fileItem: FilePreviewModel): Observable<UploadResponse> {
    /** add api */
    //must parent class
    console.log('UPLOAD ADAPT ' + this.addImage);
    const form = new FormData();
    form.append("file", fileItem.file);
    const api = this.addImage;
    console.log(api, '-----------')
    const req = new HttpRequest("POST", api, form, { reportProgress: true });
    return this.http.request(req).pipe(
      map((res: HttpEvent<any>) => {
        console.log(JSON.stringify(res));
        if (res.type === HttpEventType.Response) {
          const responseFromBackend = res.body;
          return {
            body: responseFromBackend,
            status: UploadStatus.UPLOADED
          };
        } else if (res.type === HttpEventType.UploadProgress) {
          /** Compute and show the % done: */
          const uploadProgress = +Math.round((100 *
            res.loaded) / res.total);
          return {
            status: UploadStatus.IN_PROGRESS,
            progress: uploadProgress
          };
        }
      }),
      catchError(er => {
        console.log(JSON.stringify(er));
        return of({ status: UploadStatus.ERROR, body: er });
      })
    );
  }
  public removeFile(fileItem: FilePreviewModel): Observable<any> {
    /** remove api */
    const id = 50;
    const responseFromBackend = fileItem.uploadResponse;
    console.log(fileItem);
    const removeApi = '';
    return this.http.post(removeApi, { id });
  }
}
