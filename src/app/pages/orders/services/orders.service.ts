import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { CrudService } from '../../shared/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(
    private crudService: CrudService
  ) {
  }

  getOrders(params): Observable<any> {
    // const params = {
    //   'count': '50',
    //   'start': '0'
    // };
    return this.crudService.get('/v1/private/orders', params);
  }
  getOrderDetails(orderID): Observable<any> {
    return this.crudService.get('/v1/private/orders/' + orderID);
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
  getHistory(orderID): Observable<any> {
    return this.crudService.get('/v1/private/orders/' + orderID + '/history')
  }
  addHistory(orderID, param): Observable<any> {
    return this.crudService.post('/v1/private/orders/' + orderID + '/history', param);
  }
  updateOrder(orderID, param): Observable<any> {
    return this.crudService.patch('/v1/private/orders/' + orderID + '/customer', param);
  }
  getNextTransaction(orderID): Observable<any> {
    return this.crudService.get('/v1/private/orders/' + orderID + '/payment/nextTransaction');
  }
  refundOrder(orderID): Observable<any> {
    return this.crudService.post('/v1/private/orders/' + orderID + '/refund', {});
  }
  captureOrder(orderID): Observable<any> {
    return this.crudService.post('/v1/private/orders/' + orderID + '/capture', {});
  }
  getTransactions(orderID): Observable<any> {
    return this.crudService.get('/v1/private/orders/' + orderID + '/payment/transactions');
  }
}
