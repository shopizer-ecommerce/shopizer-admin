import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { CrudService } from '../../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class OptionValueImageService {

  constructor(
    private crudService: CrudService
  ) {
  }

  createImage(optionValueId, option): Observable<any> {
    return this.crudService.post(`/v1/private/product/option/value/${optionValueId}/image`, option);
  }

  deleteImage(optionValueId): Observable<any> {
    return this.crudService.delete(`/v1/private/product/option/value/${optionValueId}/image`);
  }

}
