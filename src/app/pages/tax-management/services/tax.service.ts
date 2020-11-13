import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { CrudService } from '../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class TaxService {

  constructor(
    private crudService: CrudService
  ) {
  }

  getTaxClass(params): Observable<any> {

    return this.crudService.get('/v1/private/tax/class', params);
  }
  deleteTaxClass(id): Observable<any> {
    return this.crudService.delete(`/v1/private/tax/class/${id}`);
  }
  getUniqueTax(code) {
    return this.crudService.get(`/v1/private/tax/class/unique?code=${code}`);
  }
  addTaxClasses(param) {
    return this.crudService.post(`/v1/private/tax/class`, param);
    // return this.crudService.post(`/v1/private/tax/class?store=${storeCode}`, param);
  }
}
