import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-store-creation',
  templateUrl: './store-creation.component.html',
  styleUrls: ['./store-creation.component.scss']
})
export class StoreCreationComponent implements OnInit {
  store = {};
  constructor() { }

  ngOnInit() {
  }

}
