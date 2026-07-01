import { inject, Injectable } from '@angular/core';
import { catchError, delay, from, map, Observable, retry, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CustomerCurpValidationRequest, CustomerCurpValidationResponse } from '../../models/customer-curp-valid';

import { HttpClientService } from '../../../core/services/http-client.service';
import { CustomerNotificationModalService } from '../customer-notification-modal.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerValidCurpService {
  private readonly url: any = environment.api.services.curpValidate;
  private readonly notificationModalService = inject(CustomerNotificationModalService);
  private readonly httpClientService = inject(HttpClientService);



  postData(body: CustomerCurpValidationRequest): Observable<CustomerCurpValidationResponse> {
    return this.httpClientService
      .post<CustomerCurpValidationResponse>(this.url, JSON.stringify(body))
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
              afterMessages: ['Captura la Información del Cliente Manualemente'],
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

export type ValidCurpService = CustomerValidCurpService;


