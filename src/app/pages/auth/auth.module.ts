import { NgModule } from '@angular/core';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgotpassword/forgot.component';
// import { ResetPasswordComponent } from './resetpassword/reset.component';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../shared/shared.module';
import { MatchPassword } from '../shared/validation/match-password';
@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    ForgotPasswordComponent,
    RegisterComponent,
    // ResetPasswordComponent,
    MatchPassword
  ],
  imports: [
    AuthRoutingModule,
    SharedModule
  ],
})
export class AuthModule { }
