import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClientService } from '../../core/services/http-client.service';
import { RfcCurpData, RfcCurpRequest } from '../models/curpAndRfc/rfcCurpData.interface';

@Injectable({
  providedIn: 'root'
})
export class CurpRfcPfService {
  private readonly url: any = environment.api.detailCurpAndrfc;
  private readonly httpClientService = inject(HttpClientService);

  getDetailCurpAndRfc(body: RfcCurpRequest): Observable<RfcCurpData> {
    const data = this.httpClientService.post<RfcCurpData>(this.url, JSON.stringify(body)).pipe();
    return data;
  }
}
