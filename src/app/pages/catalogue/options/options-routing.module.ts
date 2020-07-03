import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OptionsComponent } from './options.component';
import { OptionsListComponent } from './options-list/options-list.component';
import { OptionComponent } from './option/option.component';
import { OptionsValuesListComponent } from './options-values-list/options-values-list.component';
import { OptionValuesComponent } from './option-values/option-values.component';

const routes: Routes = [
  {
    path: '',
    component: OptionsComponent,
    children: [
      {
        path: 'options-list',
        component: OptionsListComponent,
      },
      {
        path: 'create-option',
        component: OptionComponent,
      },
      {
        path: 'option/:optionId',
        component: OptionComponent,
      },
      {
        path: 'options-values-list',
        component: OptionsValuesListComponent,
      },
      {
        path: 'create-option-value',
        component: OptionValuesComponent,
      },
      {
        path: 'option-value/:optionValueId',
        component: OptionValuesComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class OptionsRoutingModule { }
