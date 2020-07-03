import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { environment } from '../../../../environments/environment';
import { SecurityService } from '../../shared/services/security.service';

@Injectable({
  providedIn: 'root'
})
export class MarketplaceGuard implements CanActivate {

  mode = environment.mode;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private securityService: SecurityService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {

      // do not show environment (mode) is marketplace and user not superamdin
      if('MARKETPLACE' === this.mode) {
        if(this.securityService.isSuperAdmin()) {
          return true;
        }
      } else {//B2C
        if(this.securityService.isRetailAdmin()) {
          return true;
        }
     }

    this.router.navigate(['home']);

  }}
