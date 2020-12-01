import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PaymentComponent } from './payment.component';
import { PaymentMethodsComponent } from './methods/methods.component';
import { ConfigureComponent } from './configure-form/configure.component';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';


const routes: Routes = [
  {
    path: '', component: PaymentComponent, children: [
      {
        path: '',
        redirectTo: 'payment-methods',
        pathMatch: 'full',
      },
      {
        path: 'methods',
        component: PaymentMethodsComponent,
      },
      {
        path: 'configure/:id',
        component: ConfigureComponent
      },
      // {
      //   path: 'classes-add',
      //   component: TaxClassAddComponent,
      // },
      // {
      //   path: 'rate-list',
      //   component: TaxRateListComponent,
      // },
      // {
      //   path: 'rate-add',
      //   component: TaxRateAddComponent,
      // },
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
export class PaymentRoutingModule {
}
