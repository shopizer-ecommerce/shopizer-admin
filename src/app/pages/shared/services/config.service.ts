import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CrudService } from './crud.service';
import { Language } from '../models/Language';
import { TranslateService } from '@ngx-translate/core';



@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  languages = [];

  constructor(
    private crudService: CrudService,
    private translate: TranslateService,
  ) {
  }


  getListOfSupportedLanguages(store: string) {
    const params = {
      'store': store
    };

    return this.crudService.get(`/v1/store/languages`, params)


    /**
    return this.crudService.get(`/v1/store/languages`, params)
    .map(function(languages) {
      //console.log('Filtering languages ' + JSON.stringify(language));
      languages.forEach(lang => {
        console.log('Filtering language ' + JSON.stringify(lang));
        console.log('Filtering languages ' + JSON.stringify(langs));
        if(langs.indexOf(lang.code) > -1) {
          console.log('Found ' + JSON.stringify(lang.code));
          return lang;
        }
      });
    })
    **/
    

   /**
    return this.crudService.get(`/v1/store/languages`, params)
      .pipe(
        map(function(languages) {
          //console.log('Filtering languages ' + JSON.stringify(language));
          languages.forEach(lang => {
            console.log('Filtering language ' + JSON.stringify(lang));
            console.log('Filtering languages ' + JSON.stringify(langs));
            if(langs.indexOf(lang.code) > -1) {
              console.log('Found ' + JSON.stringify(lang.code));
              return lang;
            }
          });
        })
      );
 **/
      

    //console.log('Return langs ' + JSON.stringify(supportedLangs));
    //return supportedLangs;
  }


  //getListOfSupportedLanguages(store: string) {
  //  const params = {
  //    'store': store
  //  };
  //  return this.crudService.get(`/v1/store/languages`, params );
  //}

  //getMerchantListOfSupportedLanguages() {
  //  return JSON.parse(localStorage.getItem('supportedLanguages'));
  //}


  getListOfSystemSupportedLanguages() {
    return this.crudService.get(`/v1/languages`).subscribe((languages) => {
      this.languages = [...languages];
    });
  }

  getListOfGlobalLanguages(): Language[] {
      let langs:string[] = environment.client.language.array
      let languages: Language[] = [];
      langs.forEach(lang => {
        var l = new Language(0,lang,this.translate.instant('LANG.' + lang));
        languages.push(l);
      });

      //console.log('Global languages -> ' + JSON.stringify(languages));
      return languages;
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
