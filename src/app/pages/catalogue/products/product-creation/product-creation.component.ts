import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-product-creation',
  templateUrl: './product-creation.component.html',
  styleUrls: ['./product-creation.component.scss']
})
export class ProductCreationComponent implements OnInit {
  product = {};

  constructor() {
  }

  ngOnInit() {
  }

}
