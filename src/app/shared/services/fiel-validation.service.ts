import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClientService } from '../../core/services/http-client.service';
import { ApisServices } from '../types/catalogs.type';
import { map, Observable } from 'rxjs';
import { FielValidationRequest, FielValitationResponse } from '../../onboarding/models/fiel-validation';

@Injectable({
  providedIn: 'root'
})
export class FielValidationService {

  private readonly urls: any = environment.api.services;

  constructor(
    private httpClientService: HttpClientService
  ) { }

  validateFiel(name: ApisServices, body: FielValidationRequest): Observable<FielValitationResponse> {

    let data: FielValitationResponse;
    return this.httpClientService.post(this.urls[name], body).pipe(
      map((response: any) => {
        data = response;
        return data;
      })
    );
  }
}
