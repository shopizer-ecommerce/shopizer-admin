import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsGroupsListComponent } from './products-groups-list/products-groups-list.component';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { ProductsGroupsComponent } from './products-groups.component';
import { ProductGroupFormComponent } from './product-group-form/product-group-form.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsGroupsComponent,
    children: [
      {
        path: 'create-products-group',
        component: ProductGroupFormComponent,
      },
      {
        path: 'products-groups-list',
        component: ProductsGroupsListComponent,
      },
      {
        path: 'groups-list',
        component: GroupsListComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsGroupsRoutingModule {
}
