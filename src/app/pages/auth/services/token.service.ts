import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  tokenKey = 'token';

  constructor() { }

  getToken(): string {
    return localStorage.getItem(this.tokenKey);
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  destroyToken () {
    localStorage.removeItem(this.tokenKey);
  }

}
