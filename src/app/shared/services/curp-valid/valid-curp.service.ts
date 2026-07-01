import { inject, Injectable } from '@angular/core';
import { catchError, delay, from, map, Observable, retry, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CurpValidationRequest, CurpValidationResponse } from '../../../onboarding/models/curp-valid';
import { HttpClientService } from '../../../core/services/http-client.service';
import { NotificationModalService } from '../notification-modal.service';

@Injectable({
  providedIn: 'root'
})
export class ValidCurpService {
  private readonly url: any = environment.api.services.curpValidate;
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly httpClientService = inject(HttpClientService);



  postData(body: CurpValidationRequest): Observable<CurpValidationResponse> {
    return this.httpClientService
      .post<CurpValidationResponse>(this.url, JSON.stringify(body))
      .pipe(
        map((response) => response),
        retry({
          count: 0,
          delay: (error, retryCount) => {
            return from(
              this.notificationModalService.warning({
                title: 'Intento Fallido',
                afterMessages: ['Intenta Nuevamente'],
                btnAccept: 'OK',
              })
            ).pipe();
          },
        }),
        catchError((originalError) =>
          from(
            this.notificationModalService.warning({
              title: 'Intento Final Fallido',
              afterMessages: ['Captura la Información del Cliente Manualmente'],
              btnAccept: 'OK',
            })
          ).pipe(
            switchMap(() =>
              throwError(() => ({
                finalAttempt: true,
                originalError,
              }))
            )
          )
        )
      );
  }
}