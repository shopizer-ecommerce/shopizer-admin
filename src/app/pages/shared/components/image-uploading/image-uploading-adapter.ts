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

    constructor(
      private http: HttpClient,
      private addUrl: string,
      private removeUrl: string) {
        super();
    }
    public uploadFile(fileItem: FilePreviewModel): Observable<UploadResponse> {
      /** add api */
      //must parent class
      const form = new FormData();
      form.append("file", fileItem.file);
      const api = this.addUrl;
      const req = new HttpRequest("POST", api, form, { reportProgress: true });
      return this.http.request(req).pipe(
        map((res: HttpEvent<any>) => {
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
          console.log(er);
          return of({ status: UploadStatus.ERROR, body: er });
        })
      );
    }
    public removeFile(fileItem: FilePreviewModel): Observable<any> {
      /** remove api */
      const id = 50;
      const responseFromBackend = fileItem.uploadResponse;
      console.log(fileItem);
      const removeApi = this.removeUrl;
      return this.http.post(removeApi, { id });
    }
  }
  