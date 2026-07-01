import { Injectable } from '@angular/core';
import { HttpClientService } from '../../core/services/http-client.service';
import { map, Observable } from 'rxjs';
import { CustomerOtcSmsRequest, CustomerOtcSmsResponse } from '../models/customer-otc-sms';
import { environment } from '../../../environments/environment';
import { CustomerOtcMailRequest, CustomerOtcMailResponse } from '../models/customer-otc-mail-request';
import { CustomerOtcValidateEmail, CustomerOtcValidateEmailRequest, CustomerOtcValidateEmailResponse, CustomerOtcValidateSms, CustomerOtcValidateSmsRequest, CustomerOtcValidateSmsResponse } from '../models/customer-otc-validate';

@Injectable({
  providedIn: 'root'
})
export class CustomerOtcService {

  private readonly urls = environment.api.services;

  constructor(
    private readonly httpClientService: HttpClientService
  ) { }

  // otcOperation(name: CustomerApisServices, body: any = {}): Observable<any> {
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
  sendSms(body: CustomerOtcSmsRequest): Observable<{message: string;}> {
    return this.httpClientService.post<CustomerOtcSmsResponse>(this.urls.otcSendSms, body).pipe(
      map((response: CustomerOtcSmsResponse) => {
        return response.payload;
      })
    );
  }

  /**
   * Send Email OTC
   *
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/195821569/cross+security+otc+sendEmail
   */
  sendEmail(body: CustomerOtcMailRequest): Observable<{message: string; id: number; }> {
    return this.httpClientService.post<CustomerOtcMailResponse>(this.urls.otcSendEmail, body).pipe(
      map((response: CustomerOtcMailResponse) => {
        return response.payload;
      })
    );
  }

  /**
   * SMS OTC validation
   *
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/195330140/cross+security+otc+validate
   */
  validateSms(body: CustomerOtcValidateSmsRequest): Observable<CustomerOtcValidateSmsResponse> {
    return this.httpClientService.post<CustomerOtcValidateSmsResponse>(this.urls.otcValidate, body).pipe(
      map((response: CustomerOtcValidateSmsResponse) => {
        return response;
      })
    );
  }

  /**
   * Email OTC validation
   *
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/195330140/cross+security+otc+validate
   */
  validateEmail(body: CustomerOtcValidateEmailRequest): Observable<CustomerOtcValidateEmailResponse> {
    return this.httpClientService.post<CustomerOtcValidateEmailResponse>(this.urls.otcValidate, body).pipe(
      map((response: CustomerOtcValidateEmailResponse) => {
        return response;
      })
    );
  }
}




export type OtcService = CustomerOtcService;





