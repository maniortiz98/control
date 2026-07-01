import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, throwError } from "rxjs";

@Injectable()
export class ErrorSimulatorInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if ( req.url.includes('test-error-500')) {
            return throwError(() => new HttpErrorResponse({
                status: 500,
                statusText: 'Internal Server Error',
                error: { message: 'Error Simulado'}
            }));
        }

        return next.handle(req);
    }
}