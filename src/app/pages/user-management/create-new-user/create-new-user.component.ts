import { Component, OnInit } from '@angular/core';

import { User } from '../../shared/models/user';

@Component({
  selector: 'ngx-create-new-user',
  templateUrl: './create-new-user.component.html',
  styleUrls: ['./create-new-user.component.scss']
})
export class CreateNewUserComponent implements OnInit {
  user: User;

  constructor() {
  }

  ngOnInit() {
  }

}
