import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { from, Observable, switchMap, throwError } from 'rxjs';
import { NotificationModalService } from '../notification-modal.service';

@Injectable({ providedIn: 'root' })
export class ErrorValidFiscalService {

  constructor(private modal: NotificationModalService) { }

  /** ------------------------------
   *  TIMER: 3 intentos por 5 minutos
   * --------------------------------
   */

  private readonly STORAGE_KEY = 'fiscal_retry_timer';
  private readonly MAX_ATTEMPTS = 3;
  private readonly WINDOW_MS = 5 * 60 * 1000;

  private loadAttempts(): number[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) ?? '[]');
  }

  private saveAttempts(data: number[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  private registerAttempt() {
    const now = Date.now();
    const valid = this.loadAttempts().filter(t => now - t < this.WINDOW_MS);
    valid.push(now);
    this.saveAttempts(valid);
  }

  private canRetry(): boolean {
    const now = Date.now();
    const valid = this.loadAttempts().filter(t => now - t < this.WINDOW_MS);
    return valid.length < this.MAX_ATTEMPTS;
  }

  private minutesRemaining(): number {
    const attempts = this.loadAttempts();
    if (!attempts.length) return 0;
    const now = Date.now();
    const oldest = attempts[0];
    return Math.ceil((this.WINDOW_MS - (now - oldest)) / 60000);
  }

  /** ------------------------------
   *  MAPEO DE MENSAJES 420
   * -------------------------------
   */

  private readonly messageMap: Record<string, string> = {
    'El código postal del domicilio fiscal no coincide con los registros del SAT.':
      'El código postal fiscal no coincide con los registros del SAT.',
    'Error en la validación de los datos fiscales.':
      'Error en la validación de los datos fiscales.',
  };

  handle(error: HttpErrorResponse): Observable<never> | null {
    const err = error.error;
    const backendMessage: string = err?.messages?.[0] ?? '';

    if (backendMessage.includes('Información exitosa para la solicitud')) {
      return from(
        this.modal.success({
          title: '',
          afterMessages: [backendMessage],
          btnAccept: 'Aceptar',
          keepOnHttpError: true
        })
      ).pipe(
        switchMap(() =>
          throwError(() => ({
            handled: true,
            type: 'info-exitosa'
          }))
        )
      );
    }

    if (backendMessage.includes('Servicio no disponible')) {


      if (!this.canRetry()) {
        const mins = this.minutesRemaining();

        return from(
          this.modal.warning({
            title: `Intentos agotados, espera ${mins} minutos para reintentar`,
            btnAccept: 'Aceptar',
            keepOnHttpError: true
          })
        ).pipe(
          switchMap(() =>
            throwError(() => ({
              handled: true,
              type: 'retry-timeout'
            }))
          )
        );
      }


      return from(
        this.modal.warning({
          title: 'Servicio no disponible',
          afterMessages: [],
          btnAccept: 'Reintentar',
          btnDeny: 'Cancelar',
          keepOnHttpError: true,
          forceDisableClose: true
        })
      ).pipe(
        switchMap(result => {
          const retry = result?.value === true;

          if (retry) this.registerAttempt();

          return throwError(() => ({
            handled: true,
            type: 'servicio-no-disponible',
            retry
          }));
        })
      );
    }

    if (
      backendMessage.includes('No fue posible continuar con el registro') ||
      backendMessage.includes('Favor de revisar los siguientes datos')
    ) {
      return from(
        this.modal.warning({
          title: '',
          afterMessages: [backendMessage],
          btnAccept: 'Aceptar',
          keepOnHttpError: true
        })
      ).pipe(
        switchMap(() =>
          throwError(() => ({
            handled: true,
            type: 'datos-fiscales-invalidos'
          }))
        )
      );
    }

    if (err?.appCode === 'PERSON_ONBOARDING-B-420') {
      const uiMessage = this.messageMap[backendMessage] ?? backendMessage;

      return from(
        this.modal.warning({
          title: '',
          afterMessages: [uiMessage],
          btnAccept: 'Aceptar',
          keepOnHttpError: true
        })
      ).pipe(
        switchMap(() =>
          throwError(() => ({
            handled: true,
            type: '420-error',
            message: uiMessage
          }))
        )
      );
    }

    return null;
  }
}