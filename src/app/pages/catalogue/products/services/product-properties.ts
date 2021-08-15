import { Injectable } from '@angular/core';
import { CrudService } from '../../../shared/services/crud.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PropertiesService {

    constructor(
        private crudService: CrudService
    ) {
    }

    getProductProperties(productType, lang): Observable<any> {
        const params = {
            productType: productType,
            lang: lang
        };
        return this.crudService.get(`/v1/private/product/property/set`, params);
    }

}
