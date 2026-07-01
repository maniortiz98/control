import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, finalize, from, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CookiesService } from '../services/cookies.service';
import { environment } from '../../../environments/environment';
import { AccessToken } from '../interfaces/access-token';

@Injectable()
export class AccessTokenInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);
  private readonly cookieService = inject(CookiesService);

  private readonly securityUrls = environment.api.security;

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // If the request already has an Authorization header, do not modify it.
    if ( req.headers.has('Authorization') ) {
      return next.handle(req);
    }

    const token = this.cookieService.getAuthToken();

    const excludedUrls = [
      this.securityUrls.userRoles,
      this.securityUrls.userLogin,
      this.securityUrls.accessToken,
      '/assets/',
      '/public/'
    ];

    const isExcluded = excludedUrls.some(url => req.url.includes(url));

    // if request is to refresh token ( dont include access token daa )
    if ( isExcluded ) {
      return next.handle(req);
    }

    // if token exist and not expired.
    if ( token ) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'x-actinver-spine': 'true'
        }
      });
      return next.handle(cloned).pipe(
        catchError((err: any) => this.handleError(err, req, next))
      );
    }

    // if token not exist or expired, then refresh
    return from(this.authService.refreshAccessToken()).pipe(
      switchMap((newToken: AccessToken) => {
        this.cookieService.setAuthToken(newToken);
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${newToken.accessToken}`,
            'x-actinver-spine': 'true'
          },
        });
        return next.handle(cloned);
      }),
      catchError((err) => this.handleError(err, req, next))
    );
  }

  private handleError(err: any, req: HttpRequest<any>, next: HttpHandler) {
    if ( err instanceof HttpErrorResponse && err.status === 401 ) {
      console.log('eeerroorrr')
    }
    return throwError(() => err);
  }
}