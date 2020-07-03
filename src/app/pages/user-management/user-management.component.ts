import { Component, DoCheck, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit, DoCheck {

  sidemenuTitle = 'User profile';
  sidemenuValue = 'admin';
  sidemenuLinks = [
    {
      title: 'COMPONENTS.MY_PROFILE',
      key: 'COMPONENTS.MY_PROFILE',
      link: 'profile'
    },
    {
      title: 'COMPONENTS.CHANGE_PASSWORD',
      key: 'COMPONENTS.CHANGE_PASSWORD',
      link: 'change-password'
    }
  ];
  showSide = false;

  constructor(
    private translate: TranslateService
  ) {
    this.translateArray(this.sidemenuLinks);
    this.translate.onLangChange.subscribe((event) => {
      this.translateArray(this.sidemenuLinks);
    });
  }

  ngOnInit() {
  }

  translateArray(array) {
    array.forEach((el) => {
      el.title = this.translate.instant(el.key);
    });
  }

  ngDoCheck() {
    this.showSide =
      window.location.hash.indexOf('users') === -1 &&
      window.location.hash.indexOf('create-user') === -1;
  }

}
