import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { ProductsGroupsRoutingModule } from './products-groups-routing.module';
import { ProductsGroupsComponent } from './products-groups.component';
import { ProductsGroupsListComponent } from './products-groups-list/products-groups-list.component';
import { GroupsListComponent } from './groups-list/groups-list.component';
import { ProductsGroupsCreationComponent } from './products-groups-creation/products-groups-creation.component';
import { ProductGroupFormComponent } from './product-group-form/product-group-form.component';
import { ActiveButtonComponent } from './groups-list/active-button.component';
import { CustomModule } from '../../custom-component/custom.module';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
@NgModule({
  declarations: [
    ProductsGroupsComponent,
    ProductsGroupsCreationComponent,
    ProductsGroupsListComponent,
    GroupsListComponent,
    ProductGroupFormComponent,

    ActiveButtonComponent
  ],
  imports: [
    ProductsGroupsRoutingModule,
    SharedModule,
    NgxSummernoteModule,
    CustomModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  entryComponents: [ActiveButtonComponent]
})
export class ProductsGroupsModule {
}
