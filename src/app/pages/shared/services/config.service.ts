import { Injectable } from '@angular/core';

import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  languages = [];

  constructor(
    private crudService: CrudService
  ) {
  }

  getListOfSupportedLanguages() {

    return this.crudService.get(`/v1/store/languages`);
  }

  //getListOfSupportedLanguages(store: string) {
  //  const params = {
  //    'store': store
  //  };
  //  return this.crudService.get(`/v1/store/languages`, params );
  //}

  getMerchantListOfSupportedLanguages() {
    return JSON.parse(localStorage.getItem('supportedLanguages'));
  }

  getListOfSupportedLanguages1() {
    return this.crudService.get(`/v1/languages`).subscribe((languages) => {
      this.languages = [...languages];
    });
  }

  getListOfGroups() {
    return this.crudService.get(`/v1/sec/private/groups`);
  }

  getListOfCountries() {
    return this.crudService.get(`/v1/country`);
  }

  getListOfCountriesByLanguage(lang) {
    const params = {
      'lang': lang,
    };
    return this.crudService.get(`/v1/country`, params);
  }

  getListOfZonesProvincesByCountry(countryCode) {
    const params = {
      'code': countryCode,
    };
    return this.crudService.get(`/v1/zones`, params);
  }

  getListOfSupportedCurrency() {
    return this.crudService.get(`/v1/currency`);
  }

  getWeightAndSizes() {
    return this.crudService.get(`/v1/measures`);
  }

  getSiteConfig() {
    return this.crudService.get(`/v1/config`);
  }

}
