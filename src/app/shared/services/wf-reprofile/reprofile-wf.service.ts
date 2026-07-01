import { inject, Injectable } from '@angular/core';
import { Observable, map, retry, from, catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClientService } from '../../../core/services/http-client.service';
import { RequestWfReprofile, ResponseWfReprofile } from '../../../onboarding/models/generate-reprofile';
import { NotificationModalService } from '../notification-modal.service';

@Injectable({
  providedIn: 'root'
})
export class ReprofileWfService {
  private readonly url: any = environment.api.salesPractices.generateWfReprofile;
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly httpClientService = inject(HttpClientService);



  postData(body: RequestWfReprofile): Observable<ResponseWfReprofile> {
    return this.httpClientService
      .post<ResponseWfReprofile>(this.url, JSON.stringify(body))
      .pipe(
        map((response) => response),
        retry({
          count: 999,
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
              afterMessages: [''],
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
