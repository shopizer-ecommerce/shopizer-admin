import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-types-list',
  templateUrl: './types-list.component.html',
  styleUrls: ['./types-list.component.css']
})
export class TypesListComponent implements OnInit {

  currentPage:0
  perPage:0
  totalCount:0

  constructor() { }

  ngOnInit(): void {
  }

}
