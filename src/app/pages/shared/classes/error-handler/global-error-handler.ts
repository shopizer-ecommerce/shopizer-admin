import { ErrorHandler, Injectable, Injector, NgZone} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor(
        private injector: Injector,
        private authService: AuthService,
        private zone: NgZone
        ) { }

    handleError(error: Error) {
        // Do whatever you like with the error (send it to the server?)
        // And log it to the console

        //let router = this.injector.get(Router);
        //console.log('URL: ' + this.router.url);

        //this.router.navigate(['/rerrorPage'], { relativeTo: this.route });
        //this.zone.run(() => router.navigateByUrl('/errorPage'));
        //router.navigate(['/errorPage'])
        

        if (error instanceof HttpErrorResponse) {
            // Server or connection error happened
            if (!navigator.onLine) {
              // Handle offline error
              console.log('Error offline ' + error.status);
            } else {
              // Handle Http Error (error.status === 403, 404...)
              console.log('Error status ' + error.status);
              if(error.status === 401) {
                this.authService.logout();
                //router.navigate(['/auth']);
                //this.zone.run(() => router.navigate(['/auth']));
              } else if(error.status === 404) {

              } else if(error.status === 0) {
                  window.location.href = '/assets/static/error.html';
              }
            }
         } else {
           // Handle Client Error (Angular Error, ReferenceError...)     
         }



        //console.log('Error occured: ', error);
        //router.navigate(['/errorPage']);
     }
}
