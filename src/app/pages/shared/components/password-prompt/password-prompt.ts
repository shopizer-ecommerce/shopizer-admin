import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-password-prompt',
  templateUrl: 'password-prompt.html',
  styleUrls: ['password-prompt.scss'],
})
export class PasswordPromptComponent {

  constructor(protected ref: NbDialogRef<PasswordPromptComponent>) { }

  cancel() {
    this.ref.close();
  }

  submit(name) {
    this.ref.close(name);
  }
}
