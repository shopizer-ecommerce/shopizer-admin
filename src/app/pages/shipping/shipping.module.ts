import { NgModule } from '@angular/core';
import { ShippingRoutingModule, routedComponents } from './shipping-routing.module';
import { SharedModule } from '../shared/shared.module';
import { TransferBoxModule } from './transferlistbox/transferlistbox.module';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { QueryBuilderModule } from "angular2-query-builder";
import { CustomModule } from '../custom-component/custom.module';
import { NgxSummernoteModule } from 'ngx-summernote';
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
    QueryBuilderModule,
    CustomModule,
    NgxSummernoteModule
  ],
  exports: []
})
export class ShippingModule { }
