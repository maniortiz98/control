// create-wf-homo-pf.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CreateWfHomoPfService } from './create-wf-homo-pf.service';
import { HttpClientService } from '../../core/services/http-client.service';
import { environment } from '../../../environments/environment';
import {
  WorkflowHomonymsRequest,
  WorkflowHomonymsResponse
} from '../../onboarding/models/homonyms';

describe('CreateWfHomoPfService', () => {
  let service: CreateWfHomoPfService;
  let httpClientServiceSpy: jasmine.SpyObj<HttpClientService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClientService', ['post']);

    TestBed.configureTestingModule({
      providers: [
        CreateWfHomoPfService,
        { provide: HttpClientService, useValue: spy }
      ]
    });

    service = TestBed.inject(CreateWfHomoPfService);
    httpClientServiceSpy = TestBed.inject(HttpClientService) as jasmine.SpyObj<HttpClientService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call HttpClientService.post with correct url and body and return response', (done) => {
    const request: WorkflowHomonymsRequest = {
      // completa con campos reales si quieres, o deja el cast
    } as WorkflowHomonymsRequest;

    const mockResponse: WorkflowHomonymsResponse = {
      // completa con campos reales si quieres, o deja el cast
    } as WorkflowHomonymsResponse;

    httpClientServiceSpy.post.and.returnValue(of(mockResponse));

    service.createWfPf(request).subscribe(response => {
      // devuelve lo que mockeamos
      expect(response).toEqual(mockResponse);

      // se llama con la URL del environment y el body stringificado
      expect(httpClientServiceSpy.post).toHaveBeenCalledWith(
        environment.api.createWfHomoPf,
        JSON.stringify(request)
      );

      done();
    });
  });
});
