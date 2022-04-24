import { ExtraOptions, RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { AuthGuard } from "./pages/shared/guards/auth.guard";
import { ErrorComponent } from "../app/@theme/components/error/error.component";
import { ImageBrowserComponent } from "./@theme/components/image-browser/image-browser.component";
import { ResetPasswordComponent } from "./pages/auth/resetpassword/reset.component";
const routes: Routes = [
  { path: "auth", loadChildren: "app/pages/auth/auth.module#AuthModule" },
  { path: "errorPage", component: ErrorComponent },
  { path: "user/:id/reset/:id", component: ResetPasswordComponent },
  {
    path: "pages",
    loadChildren: "app/pages/pages.module#PagesModule",
    canActivate: [AuthGuard],
  },
  { path: "gallery", component: ImageBrowserComponent },
  { path: "", redirectTo: "pages", pathMatch: "full" },
  { path: "**", redirectTo: "pages" },
];

const config: ExtraOptions = {
  useHash: true,
  anchorScrolling: 'enabled',
  relativeLinkResolution: "legacy",
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
