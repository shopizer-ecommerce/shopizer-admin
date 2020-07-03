/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { ConfigService } from './pages/shared/services/config.service';

@Component({
  selector: 'ngx-app',
  template: '<div *ngIf="configService.languages.length!==0"><router-outlet></router-outlet></div>',
})
export class AppComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private configService: ConfigService
  ) {
    this.configService.getListOfSupportedLanguages1();
    if (!localStorage.getItem('lang')) {
      localStorage.setItem('lang', environment.client.language.default);
    }
    translate.addLangs([...environment.client.language.array]);
    translate.setDefaultLang(localStorage.getItem('lang'));
    translate.use(localStorage.getItem('lang'));
  }

  ngOnInit(): void {
  }
}
