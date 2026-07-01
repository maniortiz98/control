import { TestBed } from '@angular/core/testing';

import { FielValidationService } from './fiel-validation.service';
import { HttpClientService } from '../../core/services/http-client.service';
import { of } from 'rxjs';
import { FielValitationResponse } from '../../onboarding/models/fiel-validation';

describe('FielValidationService', () => {
  let service: FielValidationService;
  let httpClientSpy: jasmine.SpyObj<HttpClientService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClientService', ['post']);

    TestBed.configureTestingModule({
      providers: [
        FielValidationService,
        { provide: HttpClientService, useValue: spy }
      ]
    });
    service = TestBed.inject(FielValidationService);
    httpClientSpy = TestBed.inject(HttpClientService) as jasmine.SpyObj<HttpClientService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call post and return response for field validation', (done: DoneFn)=> {
    const mockResponse: FielValitationResponse = {
      certificateStatus: "Válido",
      emissionDate:      "12/01/2026",
      maturityDate:      "31/12/3000",
      certificate:       "",
      message:           "OK",
      certificateNumber: "01020202020202020",
      titularInfo:       {
        companyName:  "TEST",
        titularName:  "Jonh",
        name:         "Doe",
        countryISO:   "MX",
        rfc:          "RFCTEST",
        serialNumber: "01010101",
      }
    };
    httpClientSpy.post.and.returnValue(of(mockResponse));
    service.validateFiel('fielValidation', { certificateNumber: "00000100000100014713"}).subscribe(result =>{
      expect(result).toEqual(mockResponse)
      expect(httpClientSpy.post).toHaveBeenCalledWith(service['urls']['fielValidation'], { certificateNumber: "00000100000100014713"})
      done()
    })

  });
});
