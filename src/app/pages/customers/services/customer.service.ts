import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { CrudService } from '../../shared/services/crud.service';
import { StorageService } from '../../shared/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  constructor(
    private crudService: CrudService,
    private storageService: StorageService,
  ) {
  }
  getCustomers(params): Observable<any> {
    return this.crudService.get('/v1/private/customers', params);
  }
  getCustomerDetails(customerID): Observable<any> {
    return this.crudService.get('/v1/private/customer/' + customerID);
  }

  deleteCustomer(customerID, store): Observable<any> {
    const params = {
      store: store
    };
    return this.crudService.delete('/v1/private/customer/' + customerID, params);
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
  setPassword(obj): Observable<any>  {
    const params = {
      store: this.storageService.getMerchant()
    };
    return this.crudService.put('/v1/private/customer/password', obj, { params });
  }            
}
