import { Injectable } from '@angular/core';

import { CrudService } from '../../../shared/services/crud.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductImageService {

  constructor(
    private crudService: CrudService
  ) {
  }

  addImageUrl(id) {//post
    return this.crudService.getBaseUrl() + `/v1/private/products/${id}/images`;
  }

  removeImageUrl(id) {//delete
    return this.crudService.getBaseUrl() + `/v1/private/products/${id}/images`;
  }

  getImages(productId): Observable<any> {
    return this.crudService.get(`/v1/products/${productId}/images`);
  }

  removeImage(productId, imageId): Observable<any> {
    return this.crudService.delete(`/v1/private/products/${productId}/image/${imageId}`);
  }

  createImage(id, uploadData): Observable<any> {
    return this.crudService.post(`/v1/private/products/${id}/images`, uploadData);
  }

  updateImage(productId, event): Observable<any> {
    return this.crudService.patch(`/v1/private/products/${productId}/image/${event.id}?order=${event.position}`, []);
  }

}
