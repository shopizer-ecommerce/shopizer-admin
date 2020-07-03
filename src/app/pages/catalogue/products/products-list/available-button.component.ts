import { Component, Input, OnInit } from '@angular/core';

import { ProductService } from '../services/product.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  template: `<input type="checkbox" [checked]="value"  (click)="clicked() "/>`,
})
export class AvailableButtonComponent implements OnInit {
  @Input() value: boolean;
  @Input() rowData: any;

  constructor(
    private productService: ProductService,
    private translate: TranslateService,
    private toastr: ToastrService,
  ) {
  }

  ngOnInit() {
  }

  clicked() {
    this.value = !this.value;
    const product = {
      available: this.value,
      price: this.rowData.price,
      quantity: this.rowData.quantity
    };
    this.productService.updateProductFromTable(this.rowData.id, product)
      .subscribe(res => {
        this.toastr.success(this.translate.instant('PRODUCT.PRODUCT_UPDATED'));
      });
  }

}
