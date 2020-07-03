import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'ngx-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent implements OnInit {

  constructor(
    private location: Location,
  ) {
  }

  ngOnInit() {
  }

  backToList() {
    this.location.back();
  }
}
