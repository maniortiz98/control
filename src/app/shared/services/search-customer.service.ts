import { inject, Injectable } from '@angular/core';
import { HttpClientService } from '../../core/services/http-client.service';
import { map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchCustomerService {

  private readonly httpClient = inject(HttpClientService);
  private readonly url: string = environment.api.searchCustomer;
  private readonly urlApplication: string = environment.api.searchApplication;

  constructor() { }

  /**
   *
   */
  searchCustomer(data: any): Observable<any> {
    return this.httpClient.post(this.url, data);
  }

  /**
   *
   */
  searchProspect(data: any): Observable<any> {
    return this.httpClient.post(this.urlApplication, data);
  }
}
