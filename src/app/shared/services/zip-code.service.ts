import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClientService } from '../../core/services/http-client.service';
import { environment } from '../../../environments/environment';
import { ZipCode, ZipCodeRequest, ZipCodeResponse } from '../../onboarding/models/zip-code';

/* https://actinver.atlassian.net/wiki/spaces/DMA/pages/187924481/cross+catalogs+zip-code */
@Injectable({
  providedIn: 'root'
})
export class ZipCodeService {

  private readonly url: any = environment.api.zipCode;
  private readonly httpClientService = inject(HttpClientService);
  postData(body: ZipCodeRequest): Observable<ZipCode> {

    console.log(JSON.stringify(body));
    return this.httpClientService.post<ZipCodeResponse>(this.url, JSON.stringify(body)).pipe(
      map((response: ZipCodeResponse) => {
        return response.payload;
      })
    );
  }
}