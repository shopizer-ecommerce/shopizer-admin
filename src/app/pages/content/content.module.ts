import { NgModule } from '@angular/core';
import { ContentRoutingModule, routedComponents } from './content-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ngfModule } from 'angular-file';
import { QueryBuilderModule } from "angular2-query-builder";
import { NbDialogModule } from '@nebular/theme';
import { CKEditorModule } from 'ng2-ckeditor';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { LightboxModule } from 'ngx-lightbox';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { FileManagerModule } from '../../ng6-file-man';
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
    CKEditorModule,
    NgxDropzoneModule,
    LightboxModule,
    MalihuScrollbarModule.forRoot()
  ],
  exports: [ngfModule]
})
export class ContentModule { }
