import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    SharedModule
  ],
  declarations: [
    PagesComponent,
  ]
})
export class PagesModule {
}
