import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CatalogueComponent } from './catalogue.component';
import { MarketplaceGuard } from '../shared/guards/marketplace.guard';

const routes: Routes = [{
  path: '',
  component: CatalogueComponent,
  children: [
    {
      path: 'categories',
      canActivate: [MarketplaceGuard],
      loadChildren: 'app/pages/catalogue/categories/categories.module#CategoriesModule'
    },
    {
      path: 'products',
      loadChildren: 'app/pages/catalogue/products/products.module#ProductsModule'
    },
    {
      path: 'brands',
      loadChildren: 'app/pages/catalogue/brands/brands.module#BrandsModule'
    },
    {
      path: 'catalogues',
      loadChildren: 'app/pages/catalogue/catalogues/catalogues.module#CataloguesModule'
    },
    {
      path: 'products-groups',
      loadChildren: 'app/pages/catalogue/products-groups/products-groups.module#ProductsGroupsModule'
    },
    {
      path: 'options',
      loadChildren: 'app/pages/catalogue/options/options.module#OptionsModule'
    },
  ]
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogueRoutingModule {
}
