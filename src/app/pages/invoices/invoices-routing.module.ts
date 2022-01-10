import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvoicesComponent } from './invoices.component';
import { ListComponent } from './invoices/list.component';
import { AddComponent } from './invoices/add.component';

const routes: Routes = [{
  path: '',
  component: InvoicesComponent,
  children: [
    {
      path: '',
      redirectTo: 'list',
      pathMatch: 'full',
    },
    {
      path: 'list',
      component: ListComponent,
    },
    {
      path: 'add',
      component: AddComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvoicesRoutingModule { }

export const routedComponents = [
  InvoicesComponent,
  ListComponent,
  AddComponent
];
