import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaxComponent } from './tax-management.component';
import { TaxClassListComponent } from './tax-class/list.component';
import { TaxClassAddComponent } from './tax-class/add.component';
import { TaxRateListComponent } from './tax-rate/list.component';
import { TaxRateAddComponent } from './tax-rate/add.component';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';


const routes: Routes = [
  {
    path: '', component: TaxComponent, children: [
      {
        path: '',
        redirectTo: 'classes-list',
        pathMatch: 'full',
      },
      {
        path: 'classes-list',
        component: TaxClassListComponent,
      },
      {
        path: 'classes-add',
        component: TaxClassAddComponent,
      },
      {
        path: 'rate-list',
        component: TaxRateListComponent,
      },
      {
        path: 'rate-add',
        component: TaxRateAddComponent,
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ],
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxRoutingModule {
}
