import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { CrudService } from '../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(
    private crudService: CrudService
  ) {
  }
  getCustomers(params): Observable<any> {
    return this.crudService.get('/v1/private/customers', params);
  }
  getCustomerDetails(customerID): Observable<any> {
    return this.crudService.get('/v1/private/customer/' + customerID);
  }
  getGroup(): Observable<any> {
    return this.crudService.get('/v1/sec/private/groups')
  }
  getCountry(): Observable<any> {
    return this.crudService.get('/v1/country')
  }
  getBillingZone(value): Observable<any> {
    return this.crudService.get('/v1/zones?code=' + value)
  }
  getShippingZone(value): Observable<any> {
    return this.crudService.get('/v1/zones?code=' + value)
  }
  addCustomers(param): Observable<any> {
    return this.crudService.post('/v1/private/customer', param);
  }
  updateCustomers(param, customerID): Observable<any> {
    return this.crudService.put('/v1/private/customer/' + customerID, param);
  }
}
