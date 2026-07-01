import { inject, Injectable, signal } from '@angular/core';
import { HttpClientService } from '../../core/services/http-client.service';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HomonymsRequest, HomonymsResponse } from '../../onboarding/models/homonyms';

@Injectable({
  providedIn: 'root'
})
export class HomonymsService {
  private readonly urls: any = environment.api.homonyms;

  private readonly httpClientService = inject(HttpClientService);

  postHomonyms(body: HomonymsRequest): Observable<HomonymsResponse[]> {
    return this.httpClientService.post<HomonymsResponse[]>(this.urls, body).pipe(
      map(response =>
        response.map(item => ({
          ...item,
          percentSimilarity: Math.round(item.percentSimilarity * 100) / 100
        }))
      )
    );
  }

  private readonly dataSignal = signal<HomonymsResponse[]>([]);

  setData(data: HomonymsResponse[]) {
    this.dataSignal.set(data);
  }

  getData() {
    return this.dataSignal();
  }
}
