import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user';

@Component({
  selector: 'ngx-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  form: FormGroup;
  user: User;
  loading = false;

  constructor(
    private userService: UserService,
  ) {
  }

  ngOnInit() {
    //const id = this.userService.getUserId();
    this.loading = true;
    //this.userService.getUser(this.userService.getUserId())
    this.userService.getUserProfile()
      .subscribe(user => {
        this.user = user;
        this.loading = false;
      });
  }

}
