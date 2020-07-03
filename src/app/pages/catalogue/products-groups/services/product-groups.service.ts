import { Injectable } from '@angular/core';

import { CrudService } from '../../../shared/services/crud.service';
import { Observable } from 'rxjs';
import { StorageService } from '../../../shared/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProductGroupsService {
  constructor(
    private crudService: CrudService,
    private storageService: StorageService
  ) {
  }

  getListOfProductGroups(): Observable<any> {
    const store = this.storageService.getMerchant();
    return this.crudService.get(`/v1/private/products/groups`, { store });
  }

  // TODO
  // checkGroupCode(code): Observable<any> {
  //   const params = {
  //     'code': code,
  //   };
  //   return this.crudService.get(`/v1/private/product/unique`, params);
  // }

  createProductGroup(group): Observable<any> {
    return this.crudService.post(`/v1/private/products/group`, group);
  }

  updateGroupActiveValue(group): Observable<any> {
    return this.crudService.patch(`/v1/private/products/group/${group.code}`, group);
  }

  addProductToGroup(productId, groupCode): Observable<any> {
    return this.crudService.post(`/v1/private/products/${productId}/group/${groupCode}`, {});
  }

  removeProductFromGroup(productId, groupCode) {
    return this.crudService.delete(`/v1/private/products/${productId}/group/${groupCode}`);
  }

  getProductsByGroup(groupCode) {
    return this.crudService.get(`/v1/products/group/${groupCode}`);
  }

  removeProductGroup(groupCode) {
    return this.crudService.delete(`/v1/products/group/${groupCode}`);
  }

}
