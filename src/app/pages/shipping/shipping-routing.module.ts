import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShippingComponent } from './shipping.component';
import { ConfigurationComponent } from './configuration/configuration.component';

const routes: Routes = [{
  path: '',
  component: ShippingComponent,
  children: [
    {
      path: 'config',
      component: ConfigurationComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShippingRoutingModule { }

export const routedComponents = [
  ShippingComponent,
  ConfigurationComponent,
];
