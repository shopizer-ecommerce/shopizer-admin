import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsComponent } from '../products.component';
import { ProductCreationComponent } from '../product-creation/product-creation.component';
import { ProductsListComponent } from '../products-list/products-list.component';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { ProductToCategoryComponent } from '../product-to-category/product-to-category.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    children: [
      {
        path: 'create-product',
        // canDeactivate: [ExitGuard],
        component: ProductCreationComponent,
      },
      {
        path: 'products-list',
        component: ProductsListComponent,
      },
      {
        path: 'product/:id',
        // canDeactivate: [ExitGuard],
        component: ProductDetailsComponent,
      },
      {
        path: ':productId/category-association',
        component: ProductToCategoryComponent,
      },
      {
        path: 'association',
        component: ProductToCategoryComponent,
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProductsRoutingModule {
}
