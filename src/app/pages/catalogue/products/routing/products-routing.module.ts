import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsComponent } from '../products.component';
import { ProductCreationComponent } from '../product-creation/product-creation.component';
import { ProductsListComponent } from '../products-list/products-list.component';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { ProductToCategoryComponent } from '../product-to-category/product-to-category.component';
import { ProductsImagesComponent } from './../products-images/products-images.component';
import { ProductDiscountComponent } from '../product-discount/product-discount.component';
import { ProductOrderingComponent } from '../product-ordering/product-ordering.component';
import { ProductAttributesComponent } from '../attribute/product-attributes/product-attributes.component';
import { ProductProperties } from '../property/list/product-property.component';



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
        path: 'product-ordering',
        component: ProductOrderingComponent
      },
      {
        path: 'product/:id',
        // canDeactivate: [ExitGuard],
        component: ProductDetailsComponent,

        children: [
          {
            path: '',
            redirectTo: 'default',
            pathMatch: 'full',
          },
          {
            path: 'default', //images by default
            component: ProductsImagesComponent,
          },
          {
            path: 'images', //images by default
            component: ProductsImagesComponent,
          },
          {
            path: 'category',
            component: ProductToCategoryComponent,
          },
          {
            path: 'options',
            component: ProductAttributesComponent,
          },
          {
            path: 'properties',
            component: ProductProperties,
          },
          {
            path: 'discount',
            component: ProductDiscountComponent,
          },
        ],
        
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
  imports: [
    RouterModule.forChild(routes)
    //RouterModule.forRoot(routes, {
    //  anchorScrolling: 'enabled',
    //  enableTracing: false
    //}),
  ],
  exports: [RouterModule]
})

export class ProductsRoutingModule {
}
