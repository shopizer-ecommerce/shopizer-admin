import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  goToHome() {
    this.router.navigate(['/']);
  }

}
