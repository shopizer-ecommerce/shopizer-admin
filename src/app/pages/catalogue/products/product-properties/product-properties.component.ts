import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PropertiesService } from '../services/product-properties';


@Component({
  selector: 'ngx-product-properties',
  templateUrl: './product-properties.component.html',
  styleUrls: ['./product-properties.component.scss']
})
export class ProductProperties implements OnInit {
  @Input() product;
  @Output() loading = new EventEmitter<any>();

  constructor(
    private propertiesService: PropertiesService
  ) {

  }

  ngOnInit() {
    // console.log(this.product, '-----------');
    this.getProductProperties()
  }

  getProductProperties() {
    this.loading.emit(true);
    this.propertiesService.getProductProperties(this.product.type.code)
      .subscribe(property => {
        console.log(property);
        this.loading.emit(false);
      });
  }

}
