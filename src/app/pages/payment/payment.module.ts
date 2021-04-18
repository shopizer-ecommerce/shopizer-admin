import { NgModule } from '@angular/core';

import { PaymentComponent } from './payment.component';
import { PaymentRoutingModule } from './payment-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NbDialogModule } from '@nebular/theme';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { CustomModule } from '../custom-component/custom.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { PaymentMethodsComponent } from './methods/methods.component';
import { ConfigureComponent } from './configure-form/configure.component';
@NgModule({
  declarations: [
    PaymentComponent,
    PaymentMethodsComponent,
    ConfigureComponent
  ],
  entryComponents: [

  ],
  imports: [
    PaymentRoutingModule,
    SharedModule,
    CustomModule,
    NbDialogModule.forChild(),
    MalihuScrollbarModule.forRoot(),
    NgxSummernoteModule
  ]
})
export class PaymentModule { }
