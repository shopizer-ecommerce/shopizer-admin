import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TypeDetailsComponent } from './type-details/type-details.component';
import { TypesListComponent } from './types-list/types-list.component';
import { TypesComponent } from './types.component';


const routes: Routes = [
  {
    path: '',
    component: TypesComponent,
    children: [
      {
        path: 'create-type',
        component: TypeDetailsComponent,
        // canActivate: [StoreGuard]
      },
      {
        path: 'types-list',
        component: TypesListComponent,
        // canActivate: [StoreGuard]
      },
      {
        path: 'type/:id',
        component: TypeDetailsComponent,
        // canActivate: [StoreGuard]
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TypesRoutingModule { }
