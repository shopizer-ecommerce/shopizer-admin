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
  // Tax Classes Services 
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
  }
  updateTaxClasses(taxClassID, params) {
    return this.crudService.put('/v1/private/tax/class/' + taxClassID, params);
  }
  getTaxClassesDetails(param): Observable<any> {
    return this.crudService.get('/v1/private/tax/class/' + param);
  }
  // Country & State
  getCountry(): Observable<any> {
    return this.crudService.get('/v1/country')
  }
  getBillingZone(value): Observable<any> {
    return this.crudService.get('/v1/zones?code=' + value)
  }
  // Tax Rate Services

  getTaxRate(params): Observable<any> {

    return this.crudService.get('/v1/private/tax/rates', params);
  }
  getUniqueRate(code) {
    return this.crudService.get(`/v1/private/tax/rate/unique?code=${code}`);
  }
  addTaxRate(param) {
    return this.crudService.post(`/v1/private/tax/rate`, param);
  }
  deleteTaxRate(id): Observable<any> {
    return this.crudService.delete(`/v1/private/tax/rate/${id}`);
  }
  getTaxRateDetails(param, lan): Observable<any> {
    return this.crudService.get('/v1/private/tax/rate/' + param + '/?lang=' + lan);
  }
  updateTaxRate(taxrateID, params) {
    return this.crudService.put('/v1/private/tax/rate/' + taxrateID, params);
  }
}
