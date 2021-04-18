import { NgModule } from '@angular/core';
import { ContentRoutingModule, routedComponents } from './content-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ngfModule } from 'angular-file';
import { QueryBuilderModule } from "angular2-query-builder";
import { NbDialogModule } from '@nebular/theme';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { LightboxModule } from 'ngx-lightbox';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { FileManagerModule } from 'ng6-file-man';
import { NgxSummernoteModule } from 'ngx-summernote';
import { CustomModule } from '../custom-component/custom.module';
@NgModule({
  declarations: [
    ...routedComponents
  ],
  imports: [
    ContentRoutingModule,
    SharedModule,
    ngfModule,
    FileManagerModule,
    QueryBuilderModule,
    NbDialogModule.forChild(),
    NgxSummernoteModule,
    NgxDropzoneModule,
    LightboxModule,
    MalihuScrollbarModule.forRoot(),
    CustomModule
  ],
  exports: [ngfModule]
})
export class ContentModule { }
