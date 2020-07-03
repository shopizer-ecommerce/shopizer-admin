import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CataloguesComponent } from './catalogues.component';
import { CataloguesListComponent } from './catalogues-list/catalogues-list.component';
import { CatalogueFormComponent } from './catalogue-form/catalogue-form.component';
import { ProductToCatalogueComponent } from './product-to-catalogue/product-to-catalogue.component';

const routes: Routes = [
  {
    path: '',
    component: CataloguesComponent,
    children: [
      {
        path: 'create-catalogue',
        component: CatalogueFormComponent,
      },
      {
        path: 'catalogue/:catalogId',
        component: CatalogueFormComponent,
      },
      {
        path: 'catalogues-list',
        component: CataloguesListComponent,
      },
      {
        path: ':catalogId/catalogues-products',
        component: ProductToCatalogueComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CataloguesRoutingModule {
}
