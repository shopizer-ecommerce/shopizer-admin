import { NgModule } from '@angular/core';
import { CustomersRoutingModule, routedComponents } from './customer-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NbDialogModule } from '@nebular/theme';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';

@NgModule({
  declarations: [
    ...routedComponents

  ],
  imports: [
    CustomersRoutingModule,
    SharedModule,
    NbDialogModule.forChild(),
    MalihuScrollbarModule.forRoot(),
  ],
  exports: []
})
export class CustomersModule { }
