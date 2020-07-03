import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngx-right-sidemenu',
  templateUrl: './right-sidemenu.component.html',
  styleUrls: ['./right-sidemenu.component.scss']
})
export class RightSidemenuComponent implements OnInit {
  @Input() title: string;
  @Input() value: string;
  @Input() links: any;

  constructor(
  ) {
  }

  ngOnInit() {
  }

}
