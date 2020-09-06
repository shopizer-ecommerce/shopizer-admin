import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TypesComponent } from './types/types.component';
import { TypesListComponent } from './types-list/types-list.component';


const routes: Routes = [
  {
    path: '',
    component: TypesListComponent,
    children: [
      {
        path: 'types-list',
        component: TypesListComponent,
        // canActivate: [StoreGuard]
      },
      {
        path: 'type',
        component: TypesComponent,
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
