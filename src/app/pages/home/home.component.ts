import { Component, OnInit } from '@angular/core';

import { UserService } from '../shared/services/user.service';
import { CrudService } from '../shared/services/crud.service';
import { Country } from '../shared/models/country';
import { forkJoin } from 'rxjs';
import { StorageService } from '../shared/services/storage.service';

@Component({
  selector: 'ngx-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loading = false;
  user = {
    userName: '',
    lastAccess: '',
    merchantName: '',
    address: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: '',
    phone: ''
  };
  canAccessToOrder: boolean;
  userId;
  _countryArray: Country[];

  constructor(
    private userService: UserService,
    private crudService: CrudService,
    private storageService: StorageService
  ) {
    //this.userService.getUser(this.userService.getUserId())
    this.userService.getUserProfile()
      .subscribe(user => {
        this.userService.checkForAccess(user.groups);
        this.canAccessToOrder = this.userService.roles.canAccessToOrder;
      });
  }

  ngOnInit() {
    let lang = this.storageService.getLanguage()
    this.loading = true;
    const store = localStorage.getItem('merchant');
    forkJoin(this.crudService.listCountriesByLanguage(lang), this.userService.getUserProfile()/**this.userService.getUser(this.userService.getUserId())*/, this.userService.getMerchant(store))
      .subscribe(([countries, user, merchant]) => {
        this._countryArray = countries;
        this.user.userName = user.userName;
        this.user.lastAccess = user.lastAccess;
        this.user.merchantName = merchant.name;
        this.user.address = merchant.address.address;
        this.user.city = merchant.address.city;
        this.user.stateProvince = merchant.address.stateProvince;
        this.user.postalCode = merchant.address.postalCode;
        this.user.country = this.country(merchant.address.country)[0].name;
        this.user.phone = merchant.phone;

        //require merchant supported language
        //console.log("Supported languages " + JSON.stringify(merchant.supportedLanguages));
        
        
        localStorage.setItem('merchantLanguage',JSON.stringify(merchant.defaultLanguage));
        localStorage.setItem('supportedLanguages',JSON.stringify(merchant.supportedLanguages));

        //require merchant country
        localStorage.setItem('defaultCountry',merchant.address.country);

        this.loading = false;
      });
  }

  country(code : string) {
    return this._countryArray.filter(c => c.code === code);
  }

}
