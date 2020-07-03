import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrdersComponent } from './orders.component';
import { OrderListComponent } from './order-list/order-list.component';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';
import { OrderDetailsComponent } from './order-details/order-details.component';


const routes: Routes = [
  {
    path: '', component: OrdersComponent, children: [
      {
        path: '',
        redirectTo: 'order-list',
        pathMatch: 'full',
      },
      {
        path: 'order-list',
        component: OrderListComponent,
      },
      {
        path: 'order-details',
        component: OrderDetailsComponent,
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
export class OrdersRoutingModule {
}
