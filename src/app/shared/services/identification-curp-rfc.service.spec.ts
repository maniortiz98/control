import { TestBed } from '@angular/core/testing';

import { IdentificationCurpRfcService } from './identification-curp-rfc.service';
import { HttpClientService } from '../../core/services/http-client.service';
import { RequestIdentification, ResposeIdentification } from '../../onboarding/models/identification-curp-rfc';
import { of } from 'rxjs';

describe('IdentificationCurpRfcService', () => {
  let service: IdentificationCurpRfcService;

  let httpClientServiceSpy: jasmine.SpyObj<HttpClientService>;
  
    beforeEach(() => {
      const spy = jasmine.createSpyObj('HttpClientService', ['post']);
  
      TestBed.configureTestingModule({
        providers: [
          IdentificationCurpRfcService,
          { provide: HttpClientService, useValue: spy }
        ]
      });
  
      service = TestBed.inject(IdentificationCurpRfcService);
      httpClientServiceSpy = TestBed.inject(HttpClientService) as jasmine.SpyObj<HttpClientService>;
    });
  
    it('should call HttpClientService.post with correct URL and body', () => {
      const mockBody: RequestIdentification = {
        clientNumber: 0,
        nameOrBusinessName: '',
        lastName: '',
        secondLastName: '',
        secondName: '',
        genderId: '',
        birthDate: '',
        birthStateId: '',
        rfc: '',
        curp: '',
        user: ''
      };

      const mockResponse: ResposeIdentification = {
        timestamp: '',
        status: 0,
        error: '',
        message: '',
        details: ''
      };
  
      httpClientServiceSpy.post.and.returnValue(of(mockResponse));
  
      service.postDataIdentificationCurpRfcService(mockBody).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });
  
      expect(httpClientServiceSpy.post).toHaveBeenCalledOnceWith(service['url'], JSON.stringify(mockBody));
    });
});
