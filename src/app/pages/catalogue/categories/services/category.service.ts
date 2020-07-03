import { Injectable } from '@angular/core';

import { CrudService } from '../../../shared/services/crud.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private crudService: CrudService
  ) {
  }

  getListOfCategories(params?): Observable<any> {
    return this.crudService.get(`/v1/category`, params);
  }

  getCategoryById(id): Observable<any> {
    const params = {
      lang: '_all'
    };
    return this.crudService.get(`/v1/category/${ id }`, params);
  }

  addCategory(category): Observable<any> {
    return this.crudService.post(`/v1/private/category`, category);
  }

  updateCategory(id, category): Observable<any> {
    return this.crudService.put(`/v1/private/category/${id}`, category);
  }

  updateCategoryVisibility(category): Observable<any> {
    return this.crudService.patch(`/v1/private/category/${category.id}/visible`, category);
  }

  deleteCategory(id): Observable<any> {
    return this.crudService.delete(`/v1/private/category/${ id }`);
  }

  checkCategoryCode(code): Observable<any> {
    const params = {
      'code': code,
    };
    return this.crudService.get(`/v1/private/category/unique`, params);
  }

  updateHierarchy (childId, parentId): Observable<any> {
    return this.crudService.put(`/v1/private/category/${childId}/move/${parentId}`, {});
  }

}
