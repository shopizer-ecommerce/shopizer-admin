import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CatalogueRoutingModule } from './catalogue-routing.module';
import { CatalogueComponent } from './catalogue.component';
import { NbDialogModule } from '@nebular/theme';
import { TypesComponent } from './types/types.component';

@NgModule({
  declarations: [
    CatalogueComponent,
    TypesComponent,
  ],
  imports: [
    CatalogueRoutingModule,

    NbDialogModule.forChild(),
    SharedModule
  ]
})
export class CatalogueModule {
}
