import { Injectable } from '@angular/core';

import { UserService } from './user.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private userService: UserService,
  ) {
  }

  getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      this.userService.getUserProfile()
        .subscribe(res => {
          userId = res.id;
          localStorage.setItem('userId', userId);
        });
    }
    return userId;
  }

  getMerchant() {
    let merchant = localStorage.getItem('merchant');
    if (!merchant) {
      this.userService.getUser(this.getUserId())
        .subscribe(user => {
          merchant = user.merchant;
          localStorage.setItem('merchant', merchant);
        });
    }
    return merchant;
  }

  getMerchantName() {
    return localStorage.getItem('merchant');
  }

  getMerchantCountry() {
    return localStorage.getItem('defaultCountry');
  }

  getLanguage () {
    return localStorage.getItem('lang') || environment.client.language.default;
  }

  getUserRoles () {
    return JSON.parse(localStorage.getItem('roles'));
  }

}
