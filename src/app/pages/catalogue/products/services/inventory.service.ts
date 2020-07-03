import { Injectable } from '@angular/core';
import { CrudService } from '../../../shared/services/crud.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(
    private crudService: CrudService
  ) {
  }

  getListOfInventories(idProduct, params): Observable<any> {
    return this.crudService.get(`/v1/private/product/${idProduct}/inventory`, params);
  }

  createInventory (inventory): Observable<any> {
    return this.crudService.post(`/v1/private/product/inventory`, inventory);
  }

  getInventoryById(id, idInventory): Observable<any> {
    const params = {
      lang: '_all'
    };
    return this.crudService.get(`/v1/private/product/${id}/inventory/${idInventory}`, params);
  }

  deleteProduct(id): Observable<any> {
    return this.crudService.delete(`/v1/private/product/inventory/${ id }`);
  }

  updateInventory(idProduct, idInventory, inventory): Observable<any> {
    return this.crudService.put(`/v1/private/product/${idProduct}/inventory/${idInventory}`, inventory);
  }

}
