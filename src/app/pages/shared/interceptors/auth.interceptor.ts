import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { TokenService } from '../../auth/services/token.service';
import { catchError, finalize, switchMap, take, filter, map } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private tokenService: TokenService,
    private authService: AuthService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = this.tokenService.getToken();

    if (token) {
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    }

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.status === 0 || event.status === 401) {
            this.authService.logout();
          }
        }
        return event;
      }));

    // old version with token refreshing
    // const token = this.tokenService.getToken();
    // const chechReq = req.url.indexOf('login') === -1 ? this.addTokenToRequest(req, token) : req;
    // return next.handle(chechReq)
    //   .pipe(
    //     catchError(err => {
    //
    //       if (err.status === 0 || err.status === 401) {
    //         return this.handle401Error(req, next);
    //       } else {
    //         console.log();
    //         return throwError(err);
    //       }
    //     })
    //   );
  }


  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    const headers = {
      Authorization: `Bearer ${ token }`
    };
    return request.clone({ setHeaders: headers });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      this.tokenSubject.next(null);

      return <Observable<HttpEvent<any>>>from(this.authService.refresh())
        .pipe(
          switchMap((res: any) => {
            const tokenObj = res.token;
            this.tokenSubject.next(res.token);
            this.tokenService.saveToken(res.token);
            return next.handle(this.addTokenToRequest(request, tokenObj));
          }),
          catchError(err => {
            return from(<any>this.authService.logout());
          }),
          finalize(() => {
            this.isRefreshingToken = false;
          })
        );
    } else {
      this.isRefreshingToken = false;

      return this.tokenSubject
        .pipe(filter(token => token != null),
          take(1),
          switchMap(token => {
            return next.handle(this.addTokenToRequest(request, token));
          }));
    }
  }


}
