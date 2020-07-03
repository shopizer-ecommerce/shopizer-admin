import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsComponent } from '../products.component';
import { ProductAttributesComponent } from '../attribute/product-attributes/product-attributes.component';
import { AttributeFormComponent } from '../attribute/attribute-form/attribute-form.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    children: [
      {
        path: ':productId/product-attributes',
        component: ProductAttributesComponent,
      },
      {
        path: ':productId/create-attribute',
        component: AttributeFormComponent,
      },
      {
        path: ':productId/attribute/:attributeId',
        component: AttributeFormComponent,
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AttributeRoutingModule {
}
