import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-showcase-dialog',
  templateUrl: 'showcase-dialog.component.html',
  styleUrls: ['showcase-dialog.component.scss'],
})
export class ShowcaseDialogComponent {

  @Input() title: string;
  @Input() text: string;
  @Input() actionText: string = this.translate.instant('COMMON.REMOVE_GEN_QUESTION');

  constructor(protected ref: NbDialogRef<ShowcaseDialogComponent>, private translate: TranslateService,) {}


  dismiss() {
    this.ref.close();
  }

  remove() {
    this.ref.close(true);
  }

}
