import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TypesRoutingModule } from './types-routing.module';
import { TypesListComponent } from './types-list/types-list.component';
import { TypesComponent } from './types/types.component';


@NgModule({
  declarations: [TypesListComponent, TypesComponent],
  imports: [
    CommonModule,
    TypesRoutingModule
  ]
})
export class TypesModule { }
