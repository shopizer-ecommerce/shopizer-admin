import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { NbDialogModule } from '@nebular/theme';
import { CataloguesComponent } from './catalogues.component';
import { CataloguesRoutingModule } from './catalogues-routing.module';
import { CataloguesListComponent } from './catalogues-list/catalogues-list.component';
import { CatalogueFormComponent } from './catalogue-form/catalogue-form.component';
import { ProductToCatalogueComponent } from './product-to-catalogue/product-to-catalogue.component';

@NgModule({
  declarations: [
    CataloguesComponent,
    CataloguesListComponent,
    CatalogueFormComponent,
    ProductToCatalogueComponent
  ],
  imports: [
    CataloguesRoutingModule,

    SharedModule,

    NgxSummernoteModule,
    NbDialogModule.forChild(),
  ]
})
export class CataloguesModule {
}
