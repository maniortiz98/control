import { inject, Injectable, signal } from '@angular/core';
import { HttpClientService } from '../../core/services/http-client.service';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomerHomonymsRequest, CustomerHomonymsResponse } from '../models/customer-homonyms';


@Injectable({
  providedIn: 'root'
})
export class CustomerHomonymsService {
  private readonly urls: any = environment.api.homonyms;

  private readonly httpClientService = inject(HttpClientService);

  postHomonyms(body: CustomerHomonymsRequest): Observable<CustomerHomonymsResponse[]> {
    return this.httpClientService.post<CustomerHomonymsResponse[]>(this.urls, body).pipe(
      map(response =>
        response.map(item => ({
          ...item,
          percentSimilarity: Math.round(item.percentSimilarity * 100) / 100
        }))
      )
    );
  }

  private readonly dataSignal = signal<CustomerHomonymsResponse[]>([]);

  setData(data: CustomerHomonymsResponse[]) {
    this.dataSignal.set(data);
  }

  getData() {
    return this.dataSignal();
  }
}


export type HomonymsService = CustomerHomonymsService;


