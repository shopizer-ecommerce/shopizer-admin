import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomersComponent } from './customer.component';
import { ListComponent } from './customer/list.component';
import { AddComponent } from './customer/add.component';
import { OptionListComponent } from './options/list.component';
import { OptionsAddComponent } from './options/add.component';
import { ValueListComponent } from './optionsvalue/list.component';
import { ValueAddComponent } from './optionsvalue/add.component';
import { ManageListComponent } from './manageoptions/list.component';
import { ManageAddComponent } from './manageoptions/add.component';
const routes: Routes = [{
  path: '',
  component: CustomersComponent,
  children: [
    {
      path: 'list',
      component: ListComponent,
    },
    {
      path: 'add',
      component: AddComponent,
    },
    {
      path: 'option/list',
      component: OptionListComponent,
    },
    {
      path: 'option/add',
      component: OptionsAddComponent,
    },
    {
      path: 'value/list',
      component: ValueListComponent,
    },
    {
      path: 'value/add',
      component: ValueAddComponent,
    },
    {
      path: 'manage/list',
      component: ManageListComponent,
    },
    {
      path: 'manage/add',
      component: ManageAddComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersRoutingModule { }

export const routedComponents = [
  CustomersComponent,
  ListComponent,
  AddComponent,
  OptionListComponent,
  OptionsAddComponent,
  ValueListComponent,
  ValueAddComponent,
  ManageListComponent,
  ManageAddComponent
];
