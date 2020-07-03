import 'rxjs/Rx';
import { map } from 'rxjs/operators';// This is where I import map operator
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Rx"
import { Http, Response } from "@angular/http"
import { CrudService } from './crud.service';
import { Country } from '../models/country';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  url = environment.apiUrl;

  constructor(
    private crudService: CrudService,
    private http: Http
  ) {
  }

  getListOfCountriesByLanguage(lang : string) : Observable<Country[]> {
    //const params = {
    //  'lang': lang,
    //};


    /**
    return this.crudService.get(`/v1/country`, params).pipe(
      map((data: any[]) => data.map((country: any) => new Country(
        country.id,
        country.code,
        country.name,
        country.zones
      )))
    );
    **/

   let countryUrl = this.url+`/v1/country?lang=` + lang;

   return this.http.get(countryUrl) 
   .map(res => res.json())
   .publishReplay(1) // this tells Rx to cache the latest emitted value
   .refCount(); // and this tells Rx to keep the Observable alive as long as there are any Subscribers


    //return this.crudService.get(`/v1/country`, params)
    //.map(res => res.json())
    //.publishReplay(1) // this tells Rx to cache the latest emitted value
    //.refCount(); // and this tells Rx to keep the Observable alive as long as there are any Subscribers
  }

  /**
  getCountry(lang, code) : Observable<Country> {
    //let c  = this.getListOfCountriesByLanguage(lang)
    //  .subscribe(countries => countries.find(country => country.code == code));
    let d  = this.getListOfCountriesByLanguage(lang)
      .map(countries => countries.find(country => country.code == code));
    return d
  }
  **/

}
