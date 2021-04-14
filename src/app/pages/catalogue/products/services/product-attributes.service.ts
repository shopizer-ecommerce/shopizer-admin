import { Injectable } from '@angular/core';

import { CrudService } from '../../../shared/services/crud.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductAttributesService {


  constructor(
    private crudService: CrudService
  ) {
  }

  getListOfProductsAttributes(productId, params): Observable<any> {
    return this.crudService.get(`/v1/private/product/${productId}/attributes`, params);
  }

  createAttribute(productId, attribute): Observable<any> {
    return this.crudService.post(`/v1/private/product/${productId}/attribute`, attribute);
  }

  updateAttribute(productId, attributeId, attribute): Observable<any> {
    return this.crudService.put(`/v1/private/product/${productId}/attribute/${attributeId}`, attribute);
  }

  deleteAttribute(id, attributeId): Observable<any> {
    return this.crudService.delete(`/v1/private/product/${id}/attribute/${attributeId}`);
  }

  getAttributesById(productId, attributeId): Observable<any> {
    return this.crudService.get(`/v1/private/product/${productId}/attribute/${attributeId}`);
  }

}
