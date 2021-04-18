import { NbMenuService } from '@nebular/theme';
import { Component } from '@angular/core';

@Component({
  selector: 'ngx-five-hundred',
  styleUrls: ['./five-hundred.component.scss'],
  templateUrl: './five-hundred.component.html',
})
export class FiveHundredComponent {

  constructor(private menuService: NbMenuService) {
  }

  goToHome() {
    this.menuService.navigateHome();
  }
}
