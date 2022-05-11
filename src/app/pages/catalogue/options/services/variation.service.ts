import { Injectable } from '@angular/core';

import { CrudService } from '../../../shared/services/crud.service';
import { Observable } from 'rxjs';
import { StorageService } from '../../../shared/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class VariationService {

  constructor(
    private crudService: CrudService,
    private storageService: StorageService
  ) {
  }

  checkCode(code): Observable<any> {
    const params = {
      'code': code,
    };
    return this.crudService.get(`/v2/private/product/variation/unique`, params);
  }

  addVariations(param): Observable<any> {
    return this.crudService.post(`/v2/private/product/variation`, param);
  }
  getListOfVariations(): Observable<any> {
    return this.crudService.get(`/v2/private/product/variation`);
  }
}
