import { Injectable } from '@angular/core';

import { CrudService } from '../../../shared/services/crud.service';
import { Observable } from 'rxjs';
import { StorageService } from '../../../shared/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class TypesService {

  constructor(
    private crudService: CrudService,
    private storageService: StorageService
  ) { }


  getListOfTypes(params): Observable<any> {
    return this.crudService.get(`/v1/private/products/types`, params);
  }
}
