import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoryCreationComponent } from './category-creation/category-creation.component';
import { CategoriesComponent } from './categories.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoriesHierarchyComponent } from './categories-hierarchy/categories-hierarchy.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent,
    children: [
      {
        path: 'create-category',
        component: CategoryCreationComponent,
        // canActivate: [SuperadminGuard]
      },
      {
        path: 'categories-list',
        component: CategoriesListComponent,
        // canActivate: [StoreGuard]
      },
      {
        path: 'categories-hierarchy',
        component: CategoriesHierarchyComponent,
        // canActivate: [SuperadminGuard]
      },
      {
        path: 'category/:id',
        component: CategoryDetailComponent,
        // canActivate: [SuperadminGuard]
      },
    ],
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule {
}
