import { NgModule } from '@angular/core';
import { InvoicesRoutingModule, routedComponents } from './invoices-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NbDialogModule } from '@nebular/theme';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { CustomModule } from '../custom-component/custom.module';
@NgModule({
  declarations: [
    ...routedComponents
  ],
  imports: [
    InvoicesRoutingModule,
    SharedModule,
    NbDialogModule.forChild(),
    MalihuScrollbarModule.forRoot(),
    CustomModule
  ],
  exports: [
  ]
})
export class InvoicesModule { }
