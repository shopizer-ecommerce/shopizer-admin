import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { TypesRoutingModule } from './types-routing.module';
import { TypesListComponent } from './types-list/types-list.component';
import { TypesComponent } from './types/types.component';


@NgModule({
  declarations: [TypesListComponent, TypesComponent],
  imports: [
    CommonModule,
    TypesRoutingModule,
    SharedModule,
  ]
})
export class TypesModule { }
