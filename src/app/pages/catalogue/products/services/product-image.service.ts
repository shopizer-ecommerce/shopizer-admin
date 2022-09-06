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
    return this.crudService.getBaseUrl() + `/v1/private/product/${id}/images`;
  }

  removeImageUrl(id) {//delete
    return this.crudService.getBaseUrl() + `/v1/private/product/${id}/images`;
  }

  getImages(productId): Observable<any> {
    return this.crudService.get(`/v1/product/${productId}/images`);
  }

  removeImage(productId, imageId): Observable<any> {
    return this.crudService.delete(`/v1/private/product/${productId}/image/${imageId}`);
  }

  createImage(id, uploadData): Observable<any> {
    return this.crudService.post(`/v1/private/product/${id}/images`, uploadData);
  }

  updateImage(productId, event): Observable<any> {
    return this.crudService.patch(`/v1/private/product/${productId}/image/${event.id}?order=${event.position}`, []);
  }

}
