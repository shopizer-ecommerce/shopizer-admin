import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';

const routes: Routes = [
  {
    path: '', component: AuthComponent, children: [
      { path: '', component: LoginComponent },
      // { path: 'forgot-password', component: ForgotPasswordComponent },
      // { path: 'set-new-password/:token', component: SetNewPasswordComponent },
      // {
      //   path: 'sign-up', children: [
      //     { path: '', component: SignUpComponent },
      //   ]
      // },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AuthRoutingModule {
}
