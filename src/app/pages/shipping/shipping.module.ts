import { NgModule } from '@angular/core';
import { ShippingRoutingModule, routedComponents } from './shipping-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TransferBoxModule } from './transferlistbox/transferlistbox.module';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
// import { OriginComponent } from './origin/origin.component';
import { QueryBuilderModule } from "angular2-query-builder";
import { CustomModule } from '../custome-component/custom.module';
@NgModule({
  declarations: [
    ...routedComponents,
    // OriginComponent
  ],
  imports: [
    ShippingRoutingModule,
    SharedModule,
    TransferBoxModule,
    MalihuScrollbarModule.forRoot(),
    // ngfModule,
    QueryBuilderModule,
    CustomModule
  ],
  exports: []
})
export class ShippingModule { }
