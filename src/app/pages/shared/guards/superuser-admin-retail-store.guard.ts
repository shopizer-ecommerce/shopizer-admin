import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuperuserAdminRetailStoreGuard implements CanActivate {

  constructor(
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {
    const roles = JSON.parse(localStorage.getItem('roles'));
    console.log('8');
    if (roles.isSuperadmin || roles.isAdmin || roles.isAdminRetail || roles.isAdminStore) {
      return true;
    }
    this.router.navigate(['home']);
    return false;
  }
}
