import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UrlTree, UrlSegment, UrlSegmentGroup, ActivatedRoute, Router, PRIMARY_OUTLET } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ProductImageService } from '../services/product-image.service';
import { ProductService } from '../services/product.service';
import { Location } from '@angular/common';

import { Image } from '../../../shared/models/image';
import { ImageBrowserComponent } from '../../../../@theme/components/image-browser/image-browser.component';

@Component({
  selector: 'ngx-products-images',
  templateUrl: './products-images.component.html',
  styleUrls: ['./products-images.component.css']
})
export class ProductsImagesComponent implements OnInit {

  // product: any;
  images : any;
  id : any;
  loaded = false;
  loading = false;


  @Output() refreshProduct = new EventEmitter<string>();


  // loading = true;
  addImageUrlComponent = '';//add image url to be used by uploader

  constructor(

    private toastr: ToastrService,
    private translate: TranslateService,
    private productImageService: ProductImageService,
    private productService: ProductService,
    private location: Location,
    private router: Router

  ) {


  }

  ngOnInit() {
    this.id = this.productService.getProductIdRoute(this.router,this.location);
    this.load();
    //specify add image url to image component
    this.addImageUrlComponent = this.productImageService.addImageUrl(this.id);
    //this only happens when /images, not when default
    if(this.location.path().includes('images')) {
      let el = document.getElementById('tabs');
      el.scrollIntoView();
    }
  }

  load() {
    this.loading = true;
    this.productImageService.getImages(this.id)
    .subscribe(res => {
      this.images = res;
      this.loading = false;
      this.loaded = true;
    });
  }

  /** image component */
  removeImage(event) {
    this.loading = true;
    this.productImageService.removeImage(this.id, event)
      .subscribe(res1 => {
        this.load();
        this.toastr.success(this.translate.instant('PRODUCT.PRODUCT_UPDATED'));
      }, error => {
        this.toastr.error(error.error.message);
        this.loading = false;
      });
  }
  updateImage(event) {
    this.loading = true;
    this.productImageService.updateImage(this.id, event).subscribe(res => {
      this.load();
    }, error => {
      this.toastr.error(error.error.message);
      this.loading = false;
    });

  }

  errorImage(event) {
    this.toastr.error(this.translate.instant('COMMON.' + event));
  }

  addedImage(event) {
    this.load();
    this.toastr.success(this.translate.instant('PRODUCT.PRODUCT_UPDATED'));

  }
  fileAdded(e) {
    this.load();
  }


  /** end image component */

}
