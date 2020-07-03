import { Component, Input } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../shared/services/user.service';
import { StorageService } from '../../shared/services/storage.service';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../shared/components/showcase-dialog/showcase-dialog.component';

@Component({
  template: `
    <input type="checkbox" [checked]="value" (click)="clicked()"/>
  `,
})
export class ButtonRenderUserComponent {
  @Input() value: string | number;
  @Input() rowData: any;

  constructor(
    private userService: UserService,
    private translate: TranslateService,
    private toastr: ToastrService,
    private storageService: StorageService,
    private dialogService: NbDialogService,
  ) {
  }

  clicked() {
    this.rowData.active = !this.value;
    if(this.rowData.id ===  parseInt(this.storageService.getUserId())) {
      this.dialogService.open(ShowcaseDialogComponent, {
        context: {
          title: '',
          text: '',
          actionText : this.translate.instant('USER_FORM.CANT_UPDATE_YOUR_PROFILE')
          }
        })
    } else {
      this.userService.updateUserEnabled(this.rowData)
        .subscribe(res => {
          this.toastr.success(this.translate.instant('AVAILABILITY.AVAILABILITY'));
        });

    }

  }

}
