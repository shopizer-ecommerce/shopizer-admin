import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';


import { PagesComponent } from './pages.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { OrdersGuard } from './shared/guards/orders.guard';
import { SuperadminStoreRetailCatalogueGuard } from './shared/guards/superadmin-store-retail-catalogue.guard';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'home',
      loadChildren: 'app/pages/home/home.module#HomeModule'
    },
    {
      path: 'orders',
      // canActivate: [OrdersGuard],
      loadChildren: 'app/pages/orders/orders.module#OrdersModule'
    },
    {
      path: 'user-management',
      loadChildren: 'app/pages/user-management/user-management.module#UserManagementModule'
    },
    {
      path: 'store-management',
      loadChildren: 'app/pages/store-management/store-management.module#StoreManagementModule'
    },
    {
      path: 'catalogue',
      canActivate: [SuperadminStoreRetailCatalogueGuard],
      loadChildren: 'app/pages/catalogue/catalogue.module#CatalogueModule'
    },
    {
      path: 'content',
      loadChildren: 'app/pages/content/content.module#ContentModule'
    },
    {
      path: 'shipping',
      loadChildren: 'app/pages/shipping/shipping.module#ShippingModule'
    },
    {
      path: 'customer',
      loadChildren: 'app/pages/customers/customer.module#CustomersModule'
    },
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full'
    },
    {
      path: '**',
      component: NotFoundComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {
}
