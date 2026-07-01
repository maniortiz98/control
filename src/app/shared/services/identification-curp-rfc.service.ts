import { inject, Injectable } from '@angular/core';
import { HttpClientService } from '../../core/services/http-client.service';
import { environment } from '../../../environments/environment';
import { RequestIdentification, ResposeIdentification } from '../../onboarding/models/identification-curp-rfc';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdentificationCurpRfcService {
  private readonly url: any = environment.api.identification;
  private readonly httpClientService = inject(HttpClientService);

  postDataIdentificationCurpRfcService(body: RequestIdentification): Observable<ResposeIdentification> {
    return this.httpClientService.post<ResposeIdentification>(this.url, JSON.stringify(body)).pipe(
      map((response: ResposeIdentification) => {
        return response;
      })
    );
  }
}
