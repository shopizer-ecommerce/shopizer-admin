import { Injectable } from '@angular/core';

import { CrudService } from '../../../shared/services/crud.service';
import { Observable } from 'rxjs';
import { StorageService } from '../../../shared/services/storage.service';
import { UrlTree, UrlSegment, UrlSegmentGroup, ActivatedRoute, Router, PRIMARY_OUTLET } from '@angular/router';
import {Location} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private crudService: CrudService,
    private storageService: StorageService,
  ) {
  }

  getListOfProducts(params): Observable<any> {
    return this.crudService.get(`/v1/products`, params);
  }

  updateProductFromTable(id, product): Observable<any> {
    return this.crudService.patch(`/v1/private/product/${id}`, product);
  }

  updateProduct(id, product): Observable<any> {
    const params = {
      store: this.storageService.getMerchant()
    };
    return this.crudService.put(`/v2/private/product/definition/${id}`, product, { params });
  }

  getProductById(id): Observable<any> {
    const params = {
      lang: '_all'
    };
    return this.crudService.get(`/v1/products/${id}`, params);
  }

  getProductDefinitionById(id): Observable<any> {
    const params = {
      lang: '_all'
    };
    return this.crudService.get(`/v2/private/product/definition/${id}`, params);
  }

  createProduct(product): Observable<any> {
    const params = {
      store: this.storageService.getMerchant()
    };
    return this.crudService.post(`/v2/private/product/definition`, product, { params });
  }

  deleteProduct(id): Observable<any> {
    return this.crudService.delete(`/v1/private/product/${id}`);
  }

  getProductTypes(): Observable<any> {
    return this.crudService.get(`/v1/private/products/types`);
  }

  checkProductSku(code): Observable<any> {
    const params = {
      'code': code,
    };
    return this.crudService.get(`/v1/private/product/unique`, params);
  }

  addProductToCategory(productId, categoryId): Observable<any> {
    return this.crudService.post(`/v1/private/product/${productId}/category/${categoryId}`, {});
  }

  removeProductFromCategory(productId, categoryId): Observable<any> {
    return this.crudService.delete(`/v1/private/product/${productId}/category/${categoryId}`);
  }
  getProductByOrder(): Observable<any> {
    return this.crudService.get(`/v1/products?count=200&lang=en&page=0`)
  }
  getProductOrderById(id): Observable<any> {
    return this.crudService.get(`/v1/products?category=${id}&count=200&lang=en&page=0`)
  }
  getProductIdRoute(router: Router, location: Location) {
    const tree: UrlTree = router.parseUrl(location.path());
    const g: UrlSegmentGroup = tree.root.children[PRIMARY_OUTLET];
    const s: UrlSegment[] = g.segments; // returns 2 segments
    return s[4].path;
  }

}
