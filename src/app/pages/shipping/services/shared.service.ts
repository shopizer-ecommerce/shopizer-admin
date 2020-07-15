import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CrudService } from '../../shared/services/crud.service';
@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(
    private crudService: CrudService
  ) { }

  private subject = new Subject<any>();
  private subject1 = new Subject<any>();
  sendClickEvent() {
    this.subject.next();
  }
  selectStore(store) {
    this.subject1.next(store);
  }
  getClickEvent(): Observable<any> {
    return this.subject.asObservable();
  }
  getStoreEvent(): Observable<any> {
    return this.subject1.asObservable();
  }
  getCountry(): Observable<any> {
    return this.crudService.get('/v1/country')
  }
  getExpedition(storeCode): Observable<any> {
    return this.crudService.get('/v1/private/shipping/expedition?store=' + storeCode);
  }
  saveExpedition(storeCode, param): Observable<any> {
    return this.crudService.post('/v1/private/shipping/expedition?store=' + storeCode, param);
  }
  getShippingOrigin(param): Observable<any> {
    return this.crudService.get('/v1/private/origin', param);
  }
}

