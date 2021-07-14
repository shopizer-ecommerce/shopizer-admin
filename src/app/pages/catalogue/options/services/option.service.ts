import { Injectable } from '@angular/core';

import { CrudService } from '../../../shared/services/crud.service';
import { Observable } from 'rxjs';
import { StorageService } from '../../../shared/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class OptionService {

  constructor(
    private crudService: CrudService,
    private storageService: StorageService
  ) {
  }

  getListOfOptions(params): Observable<any> {
    return this.crudService.get(`/v1/private/product/options`, params);
  }

  createOption(option): Observable<any> {
    return this.crudService.post(`/v1/private/product/option`, option);
  }

  updateOption(id, option): Observable<any> {
    return this.crudService.put(`/v1/private/product/option/${id}`, option);
  }

  deleteOption(id): Observable<any> {
    return this.crudService.delete(`/v1/private/product/option/${id}`);
  }

  getOptionById(id): Observable<any> {
    const params = {
      lang: '_all'
    };
    return this.crudService.get(`/v1/private/product/option/${id}`, params);
  }

  checkOptionCode(code): Observable<any> {
    const params = {
      'code': code,
    };
    return this.crudService.get(`/v1/private/product/option/unique`, params);
  }

  // Set option API
  getListOfOptionsSet(): Observable<any> {
    const params = {
      store: this.storageService.getMerchant(),
      lang: this.storageService.getLanguage()
    };
    return this.crudService.get('/v1/private/product/property/set',params);
  }

  deleteOptionSet(id): Observable<any> {
    const reqparams = {
      store: this.storageService.getMerchant(),
      lang: this.storageService.getLanguage()
    };
    return this.crudService.delete(`/v1/private/product/property/set/${id}`, reqparams);
  }

  checkOptionSetCode(code): Observable<any> {
    return this.crudService.get('/v1/private/product/property/set/unique?code=' + code);
  }
  
  createSetOption(req): Observable<any> {
    const reqparams = {
      store: this.storageService.getMerchant(),
      lang: this.storageService.getLanguage()
    };
    return this.crudService.post('/v1/private/product/property/set', req, reqparams);
  }

  getOptionSetById(id, params): Observable<any> {
    return this.crudService.get(`/v1/private/product/property/set/${id}`, params);
  }
  updateSetOption(id, param): Observable<any> {
    const reqparams = {
      store: this.storageService.getMerchant(),
      lang: this.storageService.getLanguage()
    };
    return this.crudService.put(`/v1/private/product/property/set/${id}`, param, reqparams);
  }
}
