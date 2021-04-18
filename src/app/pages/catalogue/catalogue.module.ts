import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { CatalogueRoutingModule } from './catalogue-routing.module';
import { CatalogueComponent } from './catalogue.component';
import { NbDialogModule } from '@nebular/theme';
import { CustomModule } from '../custom-component/custom.module';

@NgModule({
  declarations: [
    CatalogueComponent
  ],
  imports: [
    CatalogueRoutingModule,
    NbDialogModule.forChild(),
    SharedModule,
    CustomModule
  ]
})
export class CatalogueModule {
}
