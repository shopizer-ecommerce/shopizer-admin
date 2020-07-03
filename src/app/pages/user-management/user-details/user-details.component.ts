import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'ngx-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  user: any = {};
  loadingInfo = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.loadingInfo = true;
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    //console.log('User details - User id ' + id);
    this.userService.getUser(id)
      .subscribe(res => {
        this.user = res;
        this.loadingInfo = false;
      });
  }

}
