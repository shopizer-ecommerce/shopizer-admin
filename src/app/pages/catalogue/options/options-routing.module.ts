import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OptionsComponent } from './options.component';
import { OptionsListComponent } from './options-list/options-list.component';
import { OptionComponent } from './option/option.component';
import { OptionsValuesListComponent } from './options-values-list/options-values-list.component';
import { OptionValuesComponent } from './option-values/option-values.component';
import { OptionsSetListComponent } from './options-set-list/options-set-list.component';
import { OptionSetComponent } from './options-set/option-set.component';

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
      {
        path: 'options-set-list',
        component: OptionsSetListComponent
      },
      {
        path: 'option-set',
        component: OptionSetComponent
      },
      {
        path: 'option-set/:optionId',
        component: OptionSetComponent
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class OptionsRoutingModule { }
