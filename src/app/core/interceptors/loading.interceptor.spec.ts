import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  HttpEvent,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { LoadingInterceptor } from './loading.interceptor';
import { LoadingService } from '../../shared/services/loading.service';
import { of } from 'rxjs';
import { HttpContext } from '@angular/common/http';
import { NO_LOADING } from './http-contexts';

describe('LoadingInterceptor', () => {
  let interceptor: LoadingInterceptor;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let next: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
    next = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LoadingInterceptor,
        { provide: LoadingService, useValue: loadingServiceSpy }
      ]
    });

    interceptor = TestBed.inject(LoadingInterceptor);
  });

  it('should not show loading indicator if NO_LOADING context is set', () => {
    const req = new HttpRequest('GET', '/test', { context: new HttpContext().set(NO_LOADING, true) });

    next.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(req, next).subscribe();

    expect(loadingServiceSpy.show).not.toHaveBeenCalled();
    expect(loadingServiceSpy.hide).not.toHaveBeenCalled();
    expect(next.handle).toHaveBeenCalledWith(req);
  });

  it('should show and hide loading indicator for normal requests', () => {
    const req = new HttpRequest('GET', '/test');

    next.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(req, next).subscribe();

    expect(loadingServiceSpy.show).toHaveBeenCalled();
    expect(next.handle).toHaveBeenCalledWith(req);
    expect(loadingServiceSpy.hide).toHaveBeenCalled();
  });
});
