import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { CrudService } from '../../shared/services/crud.service';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private tokenService: TokenService,
    private crudService: CrudService,
    private userService: UserService,
    private router: Router,
  ) {
  }

  login(username: string, password: string): Observable<any> {
    return this.crudService.post('/v1/private/login', { username, password });
  }

  logout() {
    this.tokenService.destroyToken();
    this.userService.destroyUserId();
    this.userService.roles = {
      canAccessToOrder: false,
      isSuperadmin: false,
      isAdmin: false,
      isAdminCatalogue: false,
      isAdminStore: false,
      isAdminOrder: false,
      isAdminContent: false,
      isCustomer: false,
      isAdminRetail: false,
    };
    localStorage.removeItem('roles');
    localStorage.removeItem('merchant');
    this.router.navigate(['auth']);
  }

  refresh(): Observable<any> {
    return this.crudService.get('/v1/auth/refresh');
  }

  forgot(username: string, returnUrl: string): Observable<any> {
    return this.crudService.post('/v1/user/password/reset/request', { username, returnUrl });
  }
  validateResetToken(token): Observable<any> {
    return this.crudService.get('/v1/user/DEFAULT/reset/' + token);
  }
  resetPassword(token, param): Observable<any> {
    return this.crudService.post('/v1/user/DEFAULT/password/' + token, param);
  }
  checkIfStoreExist(code): Observable<any> {
    const params = {
      'code': code,
    };
    return this.crudService.get(`/v1/store/unique`, params);
  }
  register(param): Observable<any> {
    return this.crudService.post('/v1/store/signup', param)
  }

}
