import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log("Error component");
  }

}
