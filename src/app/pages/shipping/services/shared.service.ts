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
  getShippingOrigin(selectedStore): Observable<any> {
    return this.crudService.get('/v1/private/shipping/origin?store=' + selectedStore);
  }
  saveOrigin(storeCode, param): Observable<any> {
    return this.crudService.post('/v1/private/shipping/origin?store=' + storeCode, param);
  }
  getCountries(): Observable<any> {
    return this.crudService.get('/v1/country');
  }
  getStates(countryCode): Observable<any> {
    return this.crudService.get('/v1/zones?code=' + countryCode);
  }
  getPackaging(): Observable<any> {
    return this.crudService.get('/v1/private/shipping/packages');
  }
  getPackagingDetails(code): Observable<any> {
    return this.crudService.get('/v1/private/shipping/package/' + code);
  }
  addPackaging(param): Observable<any> {
    return this.crudService.post('/v1/private/shipping/package', param);
  }
  updatePackaging(code, param): Observable<any> {
    return this.crudService.put('/v1/private/shipping/package/' + code, param);
  }
  deletePackaging(code): Observable<any> {
    return this.crudService.delete('/v1/private/shipping/package/' + code);
  }


  // ************ Shipping Rules API NEW Start ***************
  getRulesCriterias(): Observable<any> {
    return this.crudService.getShipping('/private/criterias');
  }
  getRulesActions(): Observable<any> {
    return this.crudService.getShipping('/private/actions');
  }
  createShippingRules(param): Observable<any> {
    return this.crudService.postShipping('/private/rules', param);
  }
  updateShippingRules(id, param): Observable<any> {
    return this.crudService.putShipping('/private/rules/' + id, param);
  }
  getShippingRules(storeCode): Observable<any> {
    return this.crudService.getShipping('/private/rules/?store=' + storeCode);
  }
  getShippingRulesDetails(id): Observable<any> {
    return this.crudService.getShipping('/private/rules/' + id);
  }
  deleteRules(code): Observable<any> {
    return this.crudService.deleteShipping('/private/rules/' + code);
  }
  checkCode(value): Observable<any> {
    return this.crudService.getShipping('/private/rules/' + value + '/unique?store=DEFAULT');
  }

  // ************ Shipping Rules API NEW Start ***************
  getShippingModules(): Observable<any> {
    return this.crudService.get('/v1/private/modules/shipping');
  }
  getShippingModulesDetails(type): Observable<any> {
    return this.crudService.get('/v1/private/modules/shipping/' + type);
  }
  saveShippingMethods(param): Observable<any> {
    return this.crudService.post('/v1/private/modules/shipping/', param);
  }
}

