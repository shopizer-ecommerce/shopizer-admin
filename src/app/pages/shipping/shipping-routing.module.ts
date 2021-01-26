import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShippingComponent } from './shipping.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { OriginComponent } from './origin/origin.component';
import { PackagesListComponent } from './packages/packages-list.component';
import { PackagesAddComponent } from './packages/packages-add.component';
import { RulesComponent } from './rules/rules.component';
import { RulesListComponent } from './rules/rules-list.component';
import { ShippingMethodsComponent } from './methods/methods.component';
import { ShippingConfigureComponent } from './methods/configure.component';

const routes: Routes = [{
  path: '',
  component: ShippingComponent,
  children: [
    {
      path: 'config',
      component: ConfigurationComponent,
    },
    {
      path: 'origin',
      component: OriginComponent,
    },
    {
      path: 'packaging',
      component: PackagesListComponent,
    },
    {
      path: 'packaging/add',
      component: PackagesAddComponent,
    },
    {
      path: 'rules/add',
      component: RulesComponent,
    },
    {
      path: 'rules',
      component: RulesListComponent,
    },
    {
      path: 'methods',
      component: ShippingMethodsComponent,
    },
    {
      path: 'methods-configure/:id',
      component: ShippingConfigureComponent,
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
  OriginComponent,
  PackagesListComponent,
  PackagesAddComponent,
  RulesComponent,
  RulesListComponent,
  ShippingMethodsComponent,
  ShippingConfigureComponent
];
