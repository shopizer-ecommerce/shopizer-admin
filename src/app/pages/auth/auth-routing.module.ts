import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgotpassword/forgot.component';
import { AuthComponent } from './auth.component';

// import { ResetPasswordComponent } from './resetpassword/reset.component';
const routes: Routes = [
  {
    path: '', component: AuthComponent, children: [
      { path: '', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      // { path: 'user/:id/reset/:id', component: ResetPasswordComponent },
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
