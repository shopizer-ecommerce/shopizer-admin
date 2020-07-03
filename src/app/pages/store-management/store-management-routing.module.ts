import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StoreManagementComponent } from './store-management.component';
import { RetailerComponent } from './retailer/retailer.component';
import { RetailerListComponent } from './retailer-list/retailer-list.component';
import { SuperuserAdminGuard } from '../shared/guards/superuser-admin.guard';
import { SuperuserAdminRetailGuard } from '../shared/guards/superuser-admin-retail.guard';
import { SuperuserAdminRetailStoreGuard } from '../shared/guards/superuser-admin-retail-store.guard';
import { StoreDetailsComponent } from './store-details/store-details.component';
import { StoreCreationComponent } from './store-creation/store-creation.component';
import { StoresListComponent } from './stores-list/stores-list.component';
import { StoreLandingPageComponent } from './store-landing-page/store-landing-page.component';
import { StoreDetailInfoComponent } from './store-detail-info/store-detail-info.component';
import { StoreBrandingComponent } from './store-branding/store-branding.component';
import { RetailerStoresComponent } from './retailer-stores/retailer-stores.component';

const routes: Routes = [
  {
    path: '', component: StoreManagementComponent, children: [
      {
        path: 'store',
        component: StoreDetailsComponent,
        canActivate: [SuperuserAdminRetailStoreGuard]
      },
      {
        path: 'create-store',
        component: StoreCreationComponent,
        canActivate: [SuperuserAdminRetailGuard]
      },
      {
        path: 'stores-list',
        component: StoresListComponent,
        canActivate: [SuperuserAdminGuard]
      },
      {
        path: 'store-landing/:code',
        component: StoreLandingPageComponent,
        canActivate: [SuperuserAdminRetailStoreGuard]
      },
      {
        path: 'store/:code',
        component: StoreDetailInfoComponent,
        canActivate: [SuperuserAdminRetailStoreGuard]
      },
      {
        path: 'store-branding/:code',
        component: StoreBrandingComponent,
        canActivate: [SuperuserAdminRetailStoreGuard]
      },
      {
        path: 'retailer',
        component: RetailerComponent,
        canActivate: [SuperuserAdminRetailGuard]
      },
      {
        path: 'retailer-list',
        component: RetailerListComponent,
        canActivate: [SuperuserAdminGuard]
      },
      {
        path: 'retailer-stores',
        component: RetailerStoresComponent,
        canActivate: [SuperuserAdminRetailGuard]
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreManagementRoutingModule {
}
