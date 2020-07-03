import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { OptionComponent } from './option/option.component';
import { OptionValuesComponent } from './option-values/option-values.component';
import { OptionsListComponent } from './options-list/options-list.component';
import { OptionsValuesListComponent } from './options-values-list/options-values-list.component';
import { OptionsRoutingModule } from './options-routing.module';
import { OptionsComponent } from './options.component';
import { OptionValueImageComponent } from './option-value-image/option-value-image.component';

@NgModule({
  declarations: [
    OptionsComponent,
    OptionComponent,
    OptionsListComponent,
    OptionValuesComponent,
    OptionsValuesListComponent,
    OptionValueImageComponent
  ],
  imports: [
    OptionsRoutingModule,

    SharedModule,
  ]
})
export class OptionsModule { }
