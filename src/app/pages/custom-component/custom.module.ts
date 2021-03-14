import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { storeAutoCompleteComponent } from './store-autocomplete/store-autocomplete';
@NgModule({
  declarations: [
    storeAutoCompleteComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [storeAutoCompleteComponent]
})
export class CustomModule { }
