import { Injectable } from '@angular/core';

import { CrudService } from '../../../shared/services/crud.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OptionValuesService {

  constructor(
    private crudService: CrudService
  ) {
  }

  getListOfOptionValues(params): Observable<any> {
    return this.crudService.get(`/v1/private/product/options/values`, params);
  }

  deleteOptionValue(id): Observable<any> {
    return this.crudService.delete(`/v1/private/product/option/value/${id}`);
  }

  getOptionValueById(id): Observable<any> {
    const params = {
      lang: '_all'
    };
    return this.crudService.get(`/v1/private/product/option/value/${id}`, params);
  }

  createOptionValue(option): Observable<any> {
    return this.crudService.post(`/v1/private/product/option/value`, option);
  }

  updateOptionValue(id, option): Observable<any> {
    return this.crudService.put(`/v1/private/product/option/value/${id}`, option);
  }

  checkOptionValueCode(code): Observable<any> {
    const params = {
      'code': code,
    };
    return this.crudService.get(`/v1/private/product/option/value/unique`, params);
  }
}
