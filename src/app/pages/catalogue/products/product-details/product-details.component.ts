import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from '../services/product.service';

@Component({
  selector: 'ngx-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: any = {};
  loadingInfo = false;
  selectedItem = '0';
  sidemenuLinks = [
    {
      id: '0',
      title: 'Product details',
      key: 'COMPONENTS.PRODUCT_DETAILS',
      link: 'product-details'
    },
    {
      id: '1',
      title: 'Inventory management',
      key: 'COMPONENTS.MANAGE_INVENTORY',
      link: 'inventory-list'
    },
    {
      id: '2',
      title: 'Product attributes',
      key: 'PRODUCT_ATTRIBUTES',
      link: 'product-attributes'
    },
    {
      id: '3',
      title: 'Product to category',
      key: 'PRODUCT_TO_CATEGORY',
      link: 'category-association'
    }
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.loadingInfo = true;
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.productService.getProductById(id)
      .subscribe(res => {
        this.product = res;
        this.loadingInfo = false;
      });
  }

  route(link) {
    this.router.navigate(['pages/catalogue/products/' + this.product.id + '/' + link]);
  }

}
