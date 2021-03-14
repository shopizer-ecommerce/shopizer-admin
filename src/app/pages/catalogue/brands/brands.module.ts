import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { BrandsRoutingModule } from './brands-routing.module';
import { BrandsComponent } from './brands.component';
import { BrandFormComponent } from './brand-form/brand-form.component';
import { BrandCreationComponent } from './brand-creation/brand-creation.component';
import { BrandDetailsComponent } from './brand-details/brand-details.component';
import { BrandsListComponent } from './brands-list/brands-list.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { NbDialogModule } from '@nebular/theme';
import { CustomModule } from '../../custom-component/custom.module';
@NgModule({
  declarations: [
    BrandsComponent,
    BrandCreationComponent,
    BrandFormComponent,
    BrandDetailsComponent,
    BrandsListComponent
  ],
  imports: [
    BrandsRoutingModule,

    SharedModule,

    NgxSummernoteModule,
    NbDialogModule.forChild(),
    CustomModule
  ]
})
export class BrandsModule {
}
