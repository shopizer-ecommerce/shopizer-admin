import { NgModule } from '@angular/core';


import { SharedModule } from '../../shared/shared.module';
import { ProductsComponent } from './products.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductCreationComponent } from './product-creation/product-creation.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { AvailableButtonComponent } from './products-list/available-button.component';
import { NgxSummernoteModule } from 'ngx-summernote';
import { ManageInventoryComponent } from './inventory/manage-inventory/manage-inventory.component';
import { InventoryFormComponent } from './inventory/inventory-form/inventory-form.component';
import { InventoryCreationComponent } from './inventory/inventory-creation/inventory-creation.component';
import { InventoryDetailsComponent } from './inventory/inventory-details/inventory-details.component';
import { PricesListComponent } from './price/prices-list/prices-list.component';
import { PriceFormComponent } from './price/price-form/price-form.component';
import { ProductToCategoryComponent } from './product-to-category/product-to-category.component';
import { ProductAttributesComponent } from './attribute/product-attributes/product-attributes.component';
import { AttributeFormComponent } from './attribute/attribute-form/attribute-form.component';
import { AttributeRoutingModule } from './routing/attribute-routing.module';
import { ProductsRoutingModule } from './routing/products-routing.module';
import { PriceRoutingModule } from './routing/price-routing.module';
import { InventoryRoutingModule } from './routing/inventory-routing.module';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductsListComponent,
    ProductCreationComponent,
    ProductFormComponent,
    ProductDetailsComponent,
    ProductToCategoryComponent,

    AvailableButtonComponent,

    ManageInventoryComponent,
    InventoryDetailsComponent,
    InventoryCreationComponent,
    InventoryFormComponent,

    PricesListComponent,
    PriceFormComponent,

    ProductAttributesComponent,
    AttributeFormComponent,
  ],
  imports: [
    ProductsRoutingModule,
    InventoryRoutingModule,
    PriceRoutingModule,
    AttributeRoutingModule,

    SharedModule,
    NgxSummernoteModule,
  ],
  entryComponents: [AvailableButtonComponent]
})

export class ProductsModule {
}
