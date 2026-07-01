import { inject, Injectable } from '@angular/core';
import { HttpClientService } from '../../core/services/http-client.service';
import { environment } from '../../../environments/environment';
import { WorkflowHomonymsRequest, WorkflowHomonymsResponse } from '../../onboarding/models/homonyms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateWfHomoPfService {
  private readonly url: any = environment.api.createWfHomoPf;
  private readonly httpClientService = inject(HttpClientService);

  createWfPf(body: WorkflowHomonymsRequest): Observable<WorkflowHomonymsResponse> {
    console.log(body);
    const data = this.httpClientService.post<WorkflowHomonymsResponse>(this.url, JSON.stringify(body)).pipe();
    return data;
  }
}
