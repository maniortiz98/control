import { TestBed } from '@angular/core/testing';

import { HomonymsService } from './homonyms.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HomonymsRequest, HomonymsResponse } from '../../onboarding/models/homonyms';

describe('HomonymsService', () => {
  let service: HomonymsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HomonymsService]
    });

    service = TestBed.inject(HomonymsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should post homonyms and return processed response', () => {
    const mockBody: HomonymsRequest = {
      channelId: '',
      applicationId: '',
      personType: 0,
      name: '',
      middleName: '',
      lastName: '',
      secondLastName: '',
      birthDate: '',
      rfc: '',
      curp: '',
      nif: '',
      tin: '',
      nss: '',
      birthPlace: ''
    };
    const mockResponse: HomonymsResponse[] = [
      {
        firstName: '',
        secondName: '',
        lastName: '',
        secondLastName: '',
        rfc: '',
        curp: '',
        percentSimilarity: 0,
        clientNumber: ''
      }
    ];

    service.postHomonyms(mockBody).subscribe((result: HomonymsResponse[]) => {
      expect(result).toEqual(
        mockResponse.map(item => ({
          ...item,
          percentSimilarity: Math.round(item.percentSimilarity * 100) / 100
        }))
      );
    });

    const req = httpMock.expectOne(service['urls']);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});
