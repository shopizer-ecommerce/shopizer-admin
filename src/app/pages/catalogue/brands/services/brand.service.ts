import { Injectable } from '@angular/core';

import { CrudService } from '../../../shared/services/crud.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(
    private crudService: CrudService
  ) {
  }

  getListOfBrands(params): Observable<any> {
    return this.crudService.get(`/v1/manufacturers/`, params);
  }

  updateBrand(id, brand): Observable<any> {
    return this.crudService.put(`/v1/private/manufacturer/${id}`, brand);
  }

  getBrandById(id): Observable<any> {
    const params = {
      lang: '_all'
    };
    return this.crudService.get(`/v1/manufacturers/${id}`, params);
  }

  createBrand(brand): Observable<any> {
    return this.crudService.post(`/v1/private/manufacturer`, brand);
  }

  deleteBrand(id): Observable<any> {
    return this.crudService.delete(`/v1/manufacturer/${id}`);
  }

  checkCategoryCode(code): Observable<any> {
    const params = {
      'code': code,
    };
    return this.crudService.get(`/v1/private/manufacturer/unique`, params);
  }

}
