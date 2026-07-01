import {
    HttpErrorResponse,
    HttpHandler,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of, throwError } from 'rxjs';

import { AccessTokenInterceptor } from './access-token.interceptor';
import { AuthService } from '../services/auth.service';
import { CookiesService } from '../services/cookies.service';

describe('AccessTokenInterceptor', () => {
    let interceptor: AccessTokenInterceptor;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let cookiesServiceSpy: jasmine.SpyObj<CookiesService>;
    let nextHandlerSpy: jasmine.SpyObj<HttpHandler>;

    beforeEach(() => {
        authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['refreshAccessToken']);
        cookiesServiceSpy = jasmine.createSpyObj<CookiesService>('CookiesService', ['getAuthToken', 'setAuthToken']);
        nextHandlerSpy = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);

        TestBed.configureTestingModule({
            providers: [
                AccessTokenInterceptor,
                { provide: AuthService, useValue: authServiceSpy },
                { provide: CookiesService, useValue: cookiesServiceSpy },
            ],
        });

        interceptor = TestBed.inject(AccessTokenInterceptor);
        nextHandlerSpy.handle.and.returnValue(of(new HttpResponse({ status: 200 })));
    });

    it('debe crearse', () => {
        expect(interceptor).toBeTruthy();
    });

    it('debe omitir la modificación si la petición ya trae Authorization header', async () => {
        const request = new HttpRequest('GET', '/api/contracts', undefined, {
            headers: undefined,
        }).clone({
            setHeaders: {
                Authorization: 'Bearer existing-token',
            },
        });

        await firstValueFrom(interceptor.intercept(request, nextHandlerSpy));

        expect(nextHandlerSpy.handle).toHaveBeenCalledWith(request);
        expect(cookiesServiceSpy.getAuthToken).not.toHaveBeenCalled();
        expect(authServiceSpy.refreshAccessToken).not.toHaveBeenCalled();
    });

    it('debe omitir URLs excluidas aunque exista token en cookie', async () => {
        cookiesServiceSpy.getAuthToken.and.returnValue('cookie-token');
        const request = new HttpRequest('GET', '/assets/build-info.json');

        await firstValueFrom(interceptor.intercept(request, nextHandlerSpy));

        const forwardedRequest = nextHandlerSpy.handle.calls.mostRecent().args[0] as HttpRequest<unknown>;
        expect(forwardedRequest).toBe(request);
        expect(forwardedRequest.headers.has('Authorization')).toBeFalse();
        expect(authServiceSpy.refreshAccessToken).not.toHaveBeenCalled();
    });

    it('debe agregar bearer token y header x-actinver-spine cuando existe token en cookie', async () => {
        cookiesServiceSpy.getAuthToken.and.returnValue('cookie-token');
        const request = new HttpRequest('GET', '/api/contracts');

        await firstValueFrom(interceptor.intercept(request, nextHandlerSpy));

        const forwardedRequest = nextHandlerSpy.handle.calls.mostRecent().args[0] as HttpRequest<unknown>;
        expect(forwardedRequest).not.toBe(request);
        expect(forwardedRequest.headers.get('Authorization')).toBe('Bearer cookie-token');
        expect(forwardedRequest.headers.get('x-actinver-spine')).toBe('true');
        expect(authServiceSpy.refreshAccessToken).not.toHaveBeenCalled();
    });

    it('debe refrescar token y persistirlo cuando no existe token en cookie', async () => {
        const refreshedToken = {
            accessToken: 'new-access-token',
            clientId: 'client-id',
            tokenType: 'Bearer',
            issuedAt: '2026-05-14T00:00:00Z',
            expiresIn: '3600',
            status: 'OK',
            scopes: 'scope.read',
        };
        cookiesServiceSpy.getAuthToken.and.returnValue('');
        authServiceSpy.refreshAccessToken.and.resolveTo(refreshedToken as any);
        const request = new HttpRequest('GET', '/api/contracts');

        await firstValueFrom(interceptor.intercept(request, nextHandlerSpy));

        expect(authServiceSpy.refreshAccessToken).toHaveBeenCalled();
        expect(cookiesServiceSpy.setAuthToken).toHaveBeenCalledWith(refreshedToken as any);
        const forwardedRequest = nextHandlerSpy.handle.calls.mostRecent().args[0] as HttpRequest<unknown>;
        expect(forwardedRequest.headers.get('Authorization')).toBe('Bearer new-access-token');
        expect(forwardedRequest.headers.get('x-actinver-spine')).toBe('true');
    });

    it('debe propagar errores del refresh token', async () => {
        const error = new Error('refresh failed');
        cookiesServiceSpy.getAuthToken.and.returnValue('');
        authServiceSpy.refreshAccessToken.and.rejectWith(error);
        const request = new HttpRequest('GET', '/api/contracts');

        await expectAsync(firstValueFrom(interceptor.intercept(request, nextHandlerSpy))).toBeRejectedWith(error);
        expect(nextHandlerSpy.handle).not.toHaveBeenCalled();
    });

    it('debe propagar errores 401 del backend cuando usa token de cookie', async () => {
        const error = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
        cookiesServiceSpy.getAuthToken.and.returnValue('cookie-token');
        nextHandlerSpy.handle.and.returnValue(throwError(() => error));
        const request = new HttpRequest('GET', '/api/contracts');

        await expectAsync(firstValueFrom(interceptor.intercept(request, nextHandlerSpy))).toBeRejectedWith(error);
    });
});
