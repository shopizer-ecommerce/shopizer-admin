import { NgModule } from '@angular/core';

import { TaxComponent } from './tax-management.component';
import { TaxRoutingModule } from './tax-management-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TaxClassListComponent } from './tax-class/list.component';
import { TaxRateListComponent } from './tax-rate/list.component';
import { TaxClassAddComponent } from './tax-class/add.component';
import { TaxRateAddComponent } from './tax-rate/add.component';
import { NbDialogModule } from '@nebular/theme';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { CustomModule } from '../custom-component/custom.module';
@NgModule({
  declarations: [
    TaxComponent,
    TaxClassListComponent,
    TaxClassAddComponent,
    TaxRateListComponent,
    TaxRateAddComponent
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
