import { NgModule } from '@angular/core';
import { ShippingRoutingModule, routedComponents } from './shipping-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TransferBoxModule } from './transferlistbox/transferlistbox.module';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { OriginComponent } from './origin/origin.component';

@NgModule({
  declarations: [
    ...routedComponents,
    OriginComponent
  ],
  imports: [
    ShippingRoutingModule,
    SharedModule,
    TransferBoxModule,
    MalihuScrollbarModule.forRoot()
    // ngfModule,
    // QueryBuilderModule
  ],
  exports: []
})
export class ShippingModule { }
