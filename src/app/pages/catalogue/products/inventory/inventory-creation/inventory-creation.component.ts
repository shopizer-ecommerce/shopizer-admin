import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-inventory-creation',
  templateUrl: './inventory-creation.component.html',
  styleUrls: ['./inventory-creation.component.scss']
})
export class InventoryCreationComponent implements OnInit {
  inventory = {};

  constructor() {
  }

  ngOnInit() {
  }

}
