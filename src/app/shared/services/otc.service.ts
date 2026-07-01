import { Injectable } from '@angular/core';
import { HttpClientService } from '../../core/services/http-client.service';
import { map, Observable } from 'rxjs';
import { OtcSmsRequest, OtcSmsResponse } from '../../onboarding/models/otc-sms';
import { environment } from '../../../environments/environment';
import { OtcMailRequest, OtcMailResponse } from '../../onboarding/models/otc-mail-request';
import { OtcValidateEmail, OtcValidateEmailRequest, OtcValidateEmailResponse, OtcValidateSms, OtcValidateSmsRequest, OtcValidateSmsResponse } from '../../onboarding/models/otc-validate';

@Injectable({
  providedIn: 'root'
})
export class OtcService {

  private readonly urls = environment.api.services;

  constructor(
    private readonly httpClientService: HttpClientService
  ) { }

  // otcOperation(name: ApisServices, body: any = {}): Observable<any> {
  //   let data: any;

  //   return this.httpClientService.post(this.urls[name], body).pipe(
  //     map((response: any) => {
  //       switch (name) {
  //         case 'otcSendSms':
  //         case 'otcSendEmail':
  //         case 'otcValidate':
  //           data = response['payload'];
  //           break;
  //       }
  //       return data;
  //     })
  //   );
  // }

  /**
   * Send SMS OTC
   *
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/195788801/cross+security+otc+sendSms
   */
  sendSms(body: OtcSmsRequest): Observable<{message: string;}> {
    return this.httpClientService.post<OtcSmsResponse>(this.urls.otcSendSms, body).pipe(
      map((response: OtcSmsResponse) => {
        return response.payload;
      })
    );
  }

  /**
   * Send Email OTC
   *
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/195821569/cross+security+otc+sendEmail
   */
  sendEmail(body: OtcMailRequest): Observable<{message: string; id: number; }> {
    return this.httpClientService.post<OtcMailResponse>(this.urls.otcSendEmail, body).pipe(
      map((response: OtcMailResponse) => {
        return response.payload;
      })
    );
  }

  /**
   * SMS OTC validation
   *
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/195330140/cross+security+otc+validate
   */
  validateSms(body: OtcValidateSmsRequest): Observable<OtcValidateSmsResponse> {
    return this.httpClientService.post<OtcValidateSmsResponse>(this.urls.otcValidate, body).pipe(
      map((response: OtcValidateSmsResponse) => {
        return response;
      })
    );
  }

  /**
   * Email OTC validation
   *
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/195330140/cross+security+otc+validate
   */
  validateEmail(body: OtcValidateEmailRequest): Observable<OtcValidateEmailResponse> {
    return this.httpClientService.post<OtcValidateEmailResponse>(this.urls.otcValidate, body).pipe(
      map((response: OtcValidateEmailResponse) => {
        return response;
      })
    );
  }
}
