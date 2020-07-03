import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Country } from '../models/country';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  get(path, params?: { [ param: string ]: string | string[]; }): Observable<any> {
    return this.http.get(`${this.url}${path}`, { responseType: 'json', params });
  }

  getWithEmpty(path, params?: { [ param: string ]: string | string[]; }): Observable<any> {
    return this.http.get(`${this.url}${path}`, { responseType: 'json', params }).pipe(catchError(error => of(error)))
  }

  post(path, body: any | null, options?: any): Observable<any> {
    return this.http.post(`${this.url}${path}`, body, options);
  }

  postWithStorParam(path, body: any | null, storeCode, options?: any): Observable<any> {
    if(storeCode) {
      path = path + '?store=' + storeCode;
    }
    return this.http.post(`${this.url}${path}`, body, options);
  }

  patch(path, body: any | null, options?: any) {
    return this.http.patch(`${this.url}${path}`, body, options);
  }

  put(path, body: any | null, options?: any): Observable<any> {
    return this.http.put(`${this.url}${path}`, body, options);
  }

  delete(path, options?: any): Observable<any> {
    return this.http.delete(`${this.url}${path}`, options);
  }

  listCountriesByLanguage(lang : string) : Observable<Country[]> {
    let countryUrl = this.url + `/v1/country?lang=` + lang;

    return this.http.get<Country[]>(countryUrl);
        //.publishReplay(1) // this tells Rx to cache the latest emitted value
        //.refCount(); // and this tells Rx to keep the Observable alive as long as there are any Subscribers
    //;

   }


}
