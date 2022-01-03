import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(
    private toastrService: ToastrService,
    private translateService: TranslateService
  ) {
  }

  success(code) {
    this.toastrService.success(this.translateService.instant(code));
  }

  error(errorCode, code) {
    this.toastrService.error(this.translateService.instant(errorCode));
    console.log('Application error [' + errorCode + ']' + code != null ? code:'');
  }


}
