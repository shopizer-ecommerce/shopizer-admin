import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CatalogueRoutingModule } from './catalogue-routing.module';
import { CatalogueComponent } from './catalogue.component';
import { NbDialogModule } from '@nebular/theme';

@NgModule({
  declarations: [
    CatalogueComponent,
  ],
  imports: [
    CatalogueRoutingModule,

    NbDialogModule.forChild(),
    SharedModule
  ]
})
export class CatalogueModule {
}
