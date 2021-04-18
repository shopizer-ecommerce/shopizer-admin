import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { CrudService } from '../../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor(
    private crudService: CrudService
  ) {
  }

  getListOfCatalogues(params?): Observable<any> {
    return this.crudService.get(`/v1/private/catalogs`, params);
  }

  getCatalogById(id): Observable<any> {
    return this.crudService.get(`/v1/private/catalog/${id}`);
  }

  createCatalog(catalog): Observable<any> {
    return this.crudService.post(`/v1/private/catalog`, catalog);
  }

  updateCatalog(id, catalog): Observable<any> {
    return this.crudService.patch(`/v1/private/catalog/${id}`, catalog);
  }

  deleteCatalog(id): Observable<any> {
    return this.crudService.delete(`/v1/private/catalog/${id}`);
  }

  checkCatalogCode(code): Observable<any> {
    const params = {
      'code': code,
    };
    return this.crudService.get(`/v1/private/catalog/unique`, params);
  }

  // todo
  // addCatalogEntry(id, catalogEntry): Observable<any> {
  //   return this.crudService.post(`/v1/private/catalog/${id}`, catalogEntry);
  // }
  //
  // removeCatalogEntry(id, entryId): Observable<any> {
  //   return this.crudService.delete(`/v1/private/catalog/${id}/entry/${entryId}`);
  // }

}
