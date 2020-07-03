import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">© Shopizer 2010-{{currentYear}}</span>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
