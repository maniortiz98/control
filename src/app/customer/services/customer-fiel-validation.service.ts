import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClientService } from '../../core/services/http-client.service';
import { CustomerApisServices } from '../types/customer-catalogs.type';
import { map, Observable } from 'rxjs';
import { CustomerFielValidationRequest, CustomerFielValitationResponse } from '../models/customer-fiel-validation';


@Injectable({
  providedIn: 'root'
})
export class CustomerFielValidationService {

  private readonly urls: any = environment.api.services;

  constructor(
    private httpClientService: HttpClientService
  ) { }

  validateFiel(name: CustomerApisServices, body: CustomerFielValidationRequest): Observable<CustomerFielValitationResponse> {

    let data: CustomerFielValitationResponse;
    return this.httpClientService.post(this.urls[name], body).pipe(
      map((response: any) => {
        data = response;
        return data;
      })
    );
  }
}




export type FielValidationService = CustomerFielValidationService;

