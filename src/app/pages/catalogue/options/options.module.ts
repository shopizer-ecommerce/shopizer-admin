import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { OptionComponent } from './option/option.component';
import { OptionValuesComponent } from './option-values/option-values.component';
import { OptionsListComponent } from './options-list/options-list.component';
import { OptionsValuesListComponent } from './options-values-list/options-values-list.component';
import { OptionsRoutingModule } from './options-routing.module';
import { OptionsComponent } from './options.component';
import { OptionValueImageComponent } from './option-value-image/option-value-image.component';
import { OptionsSetListComponent } from './options-set-list/options-set-list.component';
import { OptionSetComponent } from './options-set/option-set.component';
import { CustomModule } from '../../custom-component/custom.module';
import { VariationsListComponent } from './variations/variations.component';
import { AddVariationsComponent } from './variations/add-variations.component';
@NgModule({
  declarations: [
    OptionsComponent,
    OptionComponent,
    OptionsListComponent,
    OptionValuesComponent,
    OptionsValuesListComponent,
    OptionValueImageComponent,
    OptionsSetListComponent,
    OptionSetComponent,
    VariationsListComponent,
    AddVariationsComponent
  ],
  imports: [
    OptionsRoutingModule,
    SharedModule,
    CustomModule
  ]
})
export class OptionsModule { }
