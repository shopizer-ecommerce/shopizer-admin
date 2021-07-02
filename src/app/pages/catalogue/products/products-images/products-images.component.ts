import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ProductImageService } from '../services/product-image.service';

import { Image } from '../../../shared/models/image';
import { ImageBrowserComponent } from '../../../../@theme/components/image-browser/image-browser.component';

@Component({
  selector: 'ngx-products-images',
  templateUrl: './products-images.component.html',
  styleUrls: ['./products-images.component.css']
})
export class ProductsImagesComponent implements OnInit {

  product: any;
  images: Image[] = [];
  loading = false;
  addImageUrlComponent = '';//add image url to be used by uploader

  public setImages(mageList: Image[]) {
    console.log('Setting images');
  }

  constructor(

    private toastr: ToastrService,
    private translate: TranslateService,
    private productImageService: ProductImageService,

  ) { 
    

  }

   ngOnInit() {

    console.log('Image Tab init');
    console.log(this.product == null);
    console.log(this.images == null);
    //console.log(this.images.length);

    //todo load images
    //console.log(JSON.stringify(this.product));

    //specify add image url to image component
    //this.addImageUrlComponent = this.productImageService.addImageUrl(this.product.id);
   
   }

    /** image component */
    removeImage(event) {
      this.loading = true;
      this.productImageService.removeImage(this.product.id,event)
         .subscribe(res1 => {
          //this.refreshProduct();
          this.loading = false;
          this.toastr.success(this.translate.instant('PRODUCT.PRODUCT_UPDATED'));
      }, error => {
           this.toastr.error(error.error.message);
           this.loading = false;
      });
    }
  
    errorImage(event) {
      this.toastr.error(this.translate.instant('COMMON.'+event));
    }
  
    addedImage(event) {
      //this.refreshProduct();
      this.toastr.success(this.translate.instant('PRODUCT.PRODUCT_UPDATED'));
  
    }
    /** end image component */

}
