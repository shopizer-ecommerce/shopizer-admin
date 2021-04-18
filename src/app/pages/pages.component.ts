import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { TranslateService } from '@ngx-translate/core';
import { ConnectionStatusService } from './shared/services/connection-status.service';
import { NbToastRef, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-sample-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-sample-layout>
  `,
})
export class PagesComponent {
  menu;

  constructor(
    private translate: TranslateService,
    private connectionStatusService: ConnectionStatusService,
    private toastrService: NbToastrService,
    private router: Router,
  ) {
    this.menu = MENU_ITEMS;
    this.translateMenu(this.menu);
    this.checkAccess(this.menu);
    this.checkConnection();
    this.translate.onLangChange.subscribe((lang) => {
      this.translateMenu(this.menu);
    });
  }

  checkAccess(menu) {
    menu.forEach(el => {
      el.hidden = el.guards && !el.guards.some((guard) => guard());

      if (!el.hidden) {
        if (el.children && el.children.length) {
          this.checkAccess(el.children);
        }
      }
    });
  }

  translateMenu(array) {
    array.forEach((el, index) => {
      el.title = this.translate.instant(el.key);
      if (el.children) {
        this.translateMenu(el.children);
      }
    });
  }

  checkConnection() {

    this.connectionStatusService.getStatusConnection().subscribe(res => {
      let toast: NbToastRef = null;
      console.log(res);
      if (res.status !== 'UP') {
        this.router.navigate(['/errorPage']);
        // toast = this.toastrService.show(status, `The connection to the server has been lost.`, { status: 'danger', duration: 0, preventDuplicates: true });
      } else {
        if (toast) {
          toast.close();
        }
      }
    })
  }

}
