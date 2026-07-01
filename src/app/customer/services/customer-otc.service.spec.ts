import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { HttpClientService } from "../../core/services/http-client.service";
import { CustomerOtcService } from "./customer-otc.service";

describe('CustomerOtcService', () => {

  let service: CustomerOtcService;
  let mockHttp: jasmine.SpyObj<HttpClientService>;

  beforeEach(() => {
    mockHttp = jasmine.createSpyObj('HttpClientService', ['post']);

    TestBed.configureTestingModule({
      providers: [
        CustomerOtcService,
        { provide: HttpClientService, useValue: mockHttp }
      ]
    });

    service = TestBed.inject(CustomerOtcService);

    (service as any).urls = {
      otcSendSms: '/sms',
      otcSendEmail: '/email',
      otcValidate: '/validate'
    };
  });

  it('sendSms', (done) => {
    const body = { phone: '123' } as any;
    const response = {
      payload: { message: 'sent' }
    };

    mockHttp.post.and.returnValue(of(response));

    service.sendSms(body).subscribe(res => {
      expect(mockHttp.post).toHaveBeenCalledWith('/sms', body);
      expect(res).toEqual(response.payload);
      done();
    });
  });

  it('sendEmail', (done) => {
    const body = { email: 'test@test.com' } as any;
    const response = {
      payload: { message: 'ok', id: 1 }
    };

    mockHttp.post.and.returnValue(of(response));

    service.sendEmail(body).subscribe(res => {
      expect(mockHttp.post).toHaveBeenCalledWith('/email', body);
      expect(res).toEqual(response.payload);
      done();
    });
  });

  it('validateSms', (done) => {
    const body = { code: '1234' } as any;
    const response = { valid: true } as any;

    mockHttp.post.and.returnValue(of(response));

    service.validateSms(body).subscribe(res => {
      expect(mockHttp.post).toHaveBeenCalledWith('/validate', body);
      expect(res).toEqual(response);
      done();
    });
  });

  it('validateEmail', (done) => {
    const body = { code: '9999' } as any;
    const response = { valid: true } as any;

    mockHttp.post.and.returnValue(of(response));

    service.validateEmail(body).subscribe(res => {
      expect(mockHttp.post).toHaveBeenCalledWith('/validate', body);
      expect(res).toEqual(response);
      done();
    });
  });

});