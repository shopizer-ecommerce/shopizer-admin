import { NgModule } from '@angular/core';

import { OrdersComponent } from './orders.component';
import { OrdersRoutingModule } from './orders-routing.module';
import { SharedModule } from '../shared/shared.module';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderInvoiceComponent } from './order-invoice/order-invoice';
import { OrderHistoryComponent } from './order-history/order-history';
import { OrderTransactionComponent } from './order-transaction/order-transaction';
import { NbDialogModule } from '@nebular/theme';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
@NgModule({
  declarations: [
    OrdersComponent,
    OrderDetailsComponent,
    OrderInvoiceComponent,
    OrderHistoryComponent,
    OrderTransactionComponent
  ],
  entryComponents: [
    OrderInvoiceComponent,
    OrderHistoryComponent,
    OrderTransactionComponent
  ],
  imports: [
    OrdersRoutingModule,

    SharedModule,
    NbDialogModule.forChild(),
    MalihuScrollbarModule.forRoot(),
  ]
})
export class OrdersModule { }
