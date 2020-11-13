import { NgModule } from '@angular/core';

import { TaxComponent } from './tax-management.component';
import { TaxRoutingModule } from './tax-management-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TaxClassListComponent } from './tax-class-list/tax-class-list.component';
import { TaxClassAddComponent } from './tax-class-add/tax-class-add.component';
import { NbDialogModule } from '@nebular/theme';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { CustomModule } from '../custome-component/custom.module';
@NgModule({
  declarations: [
    TaxComponent,
    TaxClassListComponent,
    TaxClassAddComponent
  ],
  entryComponents: [

  ],
  imports: [
    TaxRoutingModule,
    SharedModule,
    CustomModule,
    NbDialogModule.forChild(),
    MalihuScrollbarModule.forRoot(),
  ]
})
export class TaxManagementModule { }
