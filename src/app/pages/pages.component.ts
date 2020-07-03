import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { TranslateService } from '@ngx-translate/core';

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
    private translate: TranslateService
  ) {
    this.menu = MENU_ITEMS;
    this.translateMenu(this.menu);
    this.checkAccess(this.menu);
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

}
