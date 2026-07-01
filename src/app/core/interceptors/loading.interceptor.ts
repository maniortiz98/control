import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoadingService } from '../../shared/services/loading.service';
import { finalize, Observable } from 'rxjs';
import { NO_LOADING } from './http-contexts';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private readonly loadingService = inject(LoadingService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.context.get(NO_LOADING)) {
      return next.handle(req);
    }

    this.loadingService.show();

    return next.handle(req).pipe(finalize(() => this.loadingService.hide()));
  }
}
