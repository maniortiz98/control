import { TestBed } from '@angular/core/testing';

import { OtcService } from './otc.service';
import { HttpClientService } from '../../core/services/http-client.service';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('OtcService', () => {
  let service: OtcService;
  let httpClientSpy: jasmine.SpyObj<HttpClientService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClientService', ['post']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        OtcService,
        { provide: HttpClientService, useValue: spy }
      ]
    });

    service = TestBed.inject(OtcService);
    httpClientSpy = TestBed.inject(HttpClientService) as jasmine.SpyObj<HttpClientService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call post and return payload for otcSendSms', (done: DoneFn) => {
    const mockResponse = {
      status: 1,
      payload: {
        message: "OK",
      },
      messages: ['OK']
    };
    httpClientSpy.post.and.returnValue(of(mockResponse));

    service.sendSms({ code: "52", phoneNumber: "5212345678", onboarding: "abs" }).subscribe(result => {
      expect(result).toEqual(mockResponse.payload);
      expect(httpClientSpy.post).toHaveBeenCalledWith(service['urls']['otcSendSms'], { code: "52", phoneNumber: "5212345678", onboarding: "abs" });
      done();
    });
  });

  it('should call post and return payload for otcSendEmail', (done: DoneFn) => {
    const mockResponse = {
      status: 1,
      payload: {
        message: "OK",
        id: 1,
      },
      messages: ["OK"]
    };
    httpClientSpy.post.and.returnValue(of(mockResponse));

    service.sendEmail({ code: "1", email: "example@gmail.com", onboarding: "abs" }).subscribe(result => {
      expect(result).toEqual(mockResponse.payload);
      expect(httpClientSpy.post).toHaveBeenCalledWith(service['urls']['otcSendEmail'], { code: "1", email: "example@gmail.com", onboarding: "abs" });
      done();
    });
  });

  it('should call post and return payload for otcValidate', (done: DoneFn) => {
    const mockResponse = {
      status: 1, payload: {
        result: 'OK',
        intents: 123,
        investmentClientFlag: true,
        clientProspectId: null,
      },
      messages: ['OK']
    };
    httpClientSpy.post.and.returnValue(of(mockResponse));

    service.validateSms({ otc: 'ok', type: 'SMS', phoneNumber: '6212345678' }).subscribe(result => {
      expect(result).toEqual(mockResponse);
      expect(httpClientSpy.post).toHaveBeenCalledWith(service['urls']['otcValidate'], { otc: 'ok', type: 'SMS', phoneNumber: '6212345678' });
      done();
    });
  });
});
