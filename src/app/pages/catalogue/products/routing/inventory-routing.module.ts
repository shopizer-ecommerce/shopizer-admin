import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsComponent } from '../products.component';
import { ManageInventoryComponent } from '../inventory/manage-inventory/manage-inventory.component';
import { InventoryDetailsComponent } from '../inventory/inventory-details/inventory-details.component';
import { InventoryCreationComponent } from '../inventory/inventory-creation/inventory-creation.component';


const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    children: [
      {
        path: ':productId/inventory-list',
        component: ManageInventoryComponent,
      },
      {
        path: ':productId/inventory/:inventoryId',
        component: InventoryDetailsComponent,
      },
      {
        path: ':productId/inventory-creation',
        component: InventoryCreationComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
