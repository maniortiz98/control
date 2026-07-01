import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClientService } from '../../core/services/http-client.service';
import { environment } from '../../../environments/environment';
import { CustomerZipCode, CustomerZipCodeRequest, CustomerZipCodeResponse } from '../models/customer-zip-code';


/* https://actinver.atlassian.net/wiki/spaces/DMA/pages/187924481/cross+catalogs+zip-code */
@Injectable({
  providedIn: 'root'
})
export class CustomerZipCodeService {

  private readonly url: any = environment.api.zipCode;
  private readonly httpClientService = inject(HttpClientService);
  postData(body: CustomerZipCodeRequest): Observable<CustomerZipCode> {

    console.log(JSON.stringify(body));
    return this.httpClientService.post<CustomerZipCodeResponse>(this.url, JSON.stringify(body)).pipe(
      map((response: CustomerZipCodeResponse) => {
        return response.payload;
      })
    );
  }
}

export type ZipCodeService = CustomerZipCodeService;


