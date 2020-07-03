import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserManagementComponent } from './user-management.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UsersListComponent } from './users-list/users-list.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CreateNewUserComponent } from './create-new-user/create-new-user.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { SuperuserAdminGuard } from '../shared/guards/superuser-admin.guard';
import { SuperuserAdminRetailGuard } from '../shared/guards/superuser-admin-retail.guard';

const routes: Routes = [
  {
    path: '', component: UserManagementComponent, children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        component: UserProfileComponent,
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      },
      {
        path: 'create-user',
        canActivate: [SuperuserAdminRetailGuard],
        component: CreateNewUserComponent,
      },
      {
        path: 'users',
        canActivate: [SuperuserAdminGuard],
        component: UsersListComponent,
      },
      {
        path: 'user/:id',
        canActivate: [SuperuserAdminGuard],
        component: UserDetailsComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule {
}
