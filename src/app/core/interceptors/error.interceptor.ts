import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, from, of, throwError, EMPTY } from 'rxjs';
import { catchError, mergeMap, switchMap, take, finalize } from 'rxjs/operators';
import { NotificationModalService } from '../../shared/services/notification-modal.service';
import { NO_LOADING } from './http-contexts';
import { OnboardingService } from '../../onboarding/services/onboarding.service';
import { LoadingService } from '../../shared/services/loading.service';
import { UnsavedChangesService } from '../services/unsaved-changes.service';
import { ErrorValidFiscalService } from '../../shared/services/fiscal-valid/valid-fiscal.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly modalService = inject(NotificationModalService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly onboardingService = inject(OnboardingService);
  private readonly loadingService = inject(LoadingService);
  private readonly errorValidFiscalService = inject(ErrorValidFiscalService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);

  private static readonly MAX_RETRIES = 3;
  private exitingToOnboarding = false;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isExcludedEndpoint(req.url)) {
      return next.handle(req);
    }

    const currentUrl = this.cleanUrl(this.router.url);

    return next.handle(req).pipe(
      mergeMap((event) => {
        if (this.exitingToOnboarding) return EMPTY;

        if (event instanceof HttpResponse) {
          if (this.isOnboarding(currentUrl) && this.isFailedResponse(event.body)) {
            this.loadingService.hide();
            let applicationNumber = 0;

            if (this.onboardingService.getCurrentInfo().isMaintenance) {
              applicationNumber =
                this.onboardingService.getCurrentInfo()?.accountId ?? 'Sin Registro';
            } else {
              applicationNumber =
                Number(this.onboardingService.getCurrentInfo()?.requestId) ?? 'Sin Registro';
            }

            const sectionPath =
              this.extractSectionId(this.router.parseUrl(currentUrl)) ?? 'Sin Registro';
            const lines: string[] = [
              `ApplicationNumber: "${applicationNumber}"`,
              `SectionId: "${sectionPath}"`,
            ];

            return this.confirmRetry$(
              next,
              req,
              {
                title: 'Ha ocurrido un error al guardar',
                afterMessages: lines,
              },
              this.onboardingService.getCurrentInfo().isOnboarding
                ? 999
                : ErrorInterceptor.MAX_RETRIES,
            );
          }
        }
        return of(event);
      }),
      catchError((error: HttpErrorResponse) => {
        console.log('HTTP ERROR', {
          status: error.status,
          message: error.message,
          url: error.url,
        });
        if (this.exitingToOnboarding) return EMPTY;

        this.loadingService.hide();

        const fiscalValid = this.errorValidFiscalService.handle(error);
        if (fiscalValid) return fiscalValid;

        if (error.status === 400) {
          return this.confirmRetry$(
            next,
            req,
            {
              title: 'Error 400',
              afterCopyMessages: [
                'Sucedió algo inesperado',
                'Se registró un error al registrar la solicitud.',
                'Por favor, inténtalo más tarde.',
              ],
              forceDisableClose: true,
            },
            ErrorInterceptor.MAX_RETRIES,
          );
        }

        if (error.status === 404) {
          this.modalService.warning({
            title: 'Error 404',
            afterCopyMessages: ['Recurso no encontrado', 'Por favor, inténtalo más tarde.'],
            btnAccept: 'Aceptar',
            keepOnHttpError: true,
            forceDisableClose: true,
          } as any);
          return EMPTY;
        }

        if (error.status === 412 || error.status === 422) {
          const cleanMessage = error?.error?.messages?.[0]?.replace(/"/g, '');
          const message = cleanMessage?.startsWith('412 PRECONDITION_FAILED')
            ? cleanMessage.split(':').slice(1).join(':')
            : cleanMessage;

          this.modalService.warning({
            title: '¡Atención!',
            afterCopyMessages: [message],
            btnAccept: 'Aceptar',
            forceDisableClose: true,
          });
          return EMPTY;
        }

        if (error.status === 500) {
          return this.confirmRetry$(
            next,
            req,
            {
              title: 'Error 500',
              afterCopyMessages: [
                'Ha ocurrido un problema en el servidor',
                'Por favor, inténtalo más tarde.',
              ],
              forceDisableClose: true,
            },
            ErrorInterceptor.MAX_RETRIES,
          );
        }

        if (error.status === 504) {
          const lastSeg = this.getLastPathSegment(req.url);
          return this.confirmRetry$(
            next,
            req,
            {
              title: 'Error 504',
              afterMessages: [`Endpoint: "${lastSeg}"`],
              afterCopyMessages: [`Timeout en "${lastSeg}"`, 'Por favor, inténtalo más tarde.'],
            },
            ErrorInterceptor.MAX_RETRIES,
          );
        }

        this.modalService.warning({
          title: 'Error',
          afterCopyMessages: ['Ocurrió un problema en la solicitud.'],
          btnAccept: 'Aceptar',
          keepOnHttpError: true,
          forceDisableClose: true,
        } as any);

        return EMPTY;
      }),
    );
  }

  private confirmRetry$(
    next: HttpHandler,
    req: HttpRequest<any>,
    uiCfg:
      | {
          title: string;
          afterMessages?: string[];
          afterCopyMessages?: string[];
        }
      | any,
    remaining: number,
  ): Observable<HttpEvent<any>> {
    if (remaining <= 1) {
      this.loadingService.hide();
      return EMPTY;
    }

    return from(
      this.modalService.error({
        ...uiCfg,
        btnAccept: 'Intentar de nuevo',
        keepOnHttpError: true,
        forceDisableClose: true,
      } as any),
    ).pipe(
      take(1),
      switchMap((r) => {
        if (r?.value === true) {
          const retryReq = req.clone({
            context: req.context.set(NO_LOADING, true),
          });
          this.loadingService.show();

          return next.handle(retryReq).pipe(
            mergeMap((ev) => {
              if (ev instanceof HttpResponse && this.isFailedResponse(ev.body)) {
                this.loadingService.hide();
                return this.confirmRetry$(next, req, uiCfg, remaining - 1);
              }
              return of(ev);
            }),
            catchError(() => {
              this.loadingService.hide();
              return this.confirmRetry$(next, req, uiCfg, remaining - 1);
            }),
            finalize(() => this.loadingService.hide()),
          );
        }

        return EMPTY;
      }),
    );
  }

  private extractSectionId(tree: UrlTree): string | undefined {
    const segs = tree.root.children['primary']?.segments?.map((s) => s.path) ?? [];
    const idx = segs.indexOf('onboarding');
    if (idx === -1) return undefined;
    const s2 = segs[idx + 2];
    const s3 = segs[idx + 3];
    if (s2 && s2 !== 'section' && s2 !== 'step') return s2;
    if ((s2 === 'section' || s2 === 'step') && s3) return s3;
    return undefined;
  }

  private cleanUrl(url: string): string {
    return (url || '').split('?')[0].split('#')[0];
  }

  private isOnboarding(url: string): boolean {
    return /^\/onboarding(\/.*)?$/.test(url || '');
  }

  private isFailedResponse(body: any): boolean {
    if (!body) return false;
    if (body.success === false) return true;
    if (body.ok === false) return true;
    if (typeof body.status === 'string' && ['failed', 'error'].includes(body.status.toLowerCase()))
      return true;
    if (typeof body.code === 'string' && body.code.toUpperCase() === 'FAILED') return true;
    return false;
  }

  private getLastPathSegment(u: string): string {
    try {
      const url = new URL(u, window?.location?.origin ?? 'http://localhost');
      const segs = url.pathname.split('/').filter(Boolean);
      const last = segs[segs.length - 1] ?? '';
      return decodeURIComponent(last);
    } catch {
      const clean = u.split('?')[0].split('#')[0];
      const segs = clean.split('/').filter(Boolean);
      const last = segs[segs.length - 1] ?? '';
      try {
        return decodeURIComponent(last);
      } catch {
        return last;
      }
    }
  }

  private readonly EXCLUDED_ENDPOINTS = [
    'cross/kyc/validation/curp',
    'cross/kyc/validation/watchlist',
    'person/onboarding/validation/homonyms',
    '/customers/workflow/registerDetail',
    '/customers/search/detail',
    '/customers/workflow/update/identification',
  ];

  private isExcludedEndpoint(url: string): boolean {
    const u = (url || '').toLowerCase();
    return this.EXCLUDED_ENDPOINTS.some((p) => u.includes(p));
  }
}
