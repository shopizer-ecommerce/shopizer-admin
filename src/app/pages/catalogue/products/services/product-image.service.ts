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

  removeImage(id): Observable<any> {
    return this.crudService.delete(`/v1/private/products/images/${id}`);
  }

  createImage(id, uploadData): Observable<any> {
    return this.crudService.post(`/v1/private/products/${id}/images`, uploadData);
  }

}
