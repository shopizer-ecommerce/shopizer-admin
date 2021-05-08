import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminCatalogueGuard implements CanActivate {

  constructor(
    private router: Router,
    private storageService: StorageService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {
    const roles = this.storageService.getUserRoles();
    if (roles.isSuperadmin || roles.isAdmin || roles.isAdminCatalogue) {
      return true;
    }
    this.router.navigate(['home']);
    return false;
  }}
