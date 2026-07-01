import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { HttpClientService } from "../../core/services/http-client.service";
import { CustomerFielValitationResponse, CustomerFielValidationRequest } from "../models/customer-fiel-validation";
import { CustomerFielValidationService } from "./customer-fiel-validation.service";

describe('CustomerFielValidationService', () => {

  let service: CustomerFielValidationService;
  let mockHttp: jasmine.SpyObj<HttpClientService>;

  const buildResponse = (): CustomerFielValitationResponse => ({
    certificateStatus: 'ACTIVE',
    emissionDate: '2024-01-01',
    maturityDate: '2025-01-01',
    titularInfo: {
      companyName: 'Company',
      titularName: 'Titular',
      name: 'Name',
      countryISO: 'MX',
      rfc: 'RFC123',
      serialNumber: 'SER123'
    },
    certificate: 'cert-data',
    message: 'Valid',
    certificateNumber: 'ABC123'
  });

  beforeEach(() => {
    mockHttp = jasmine.createSpyObj('HttpClientService', ['post']);

    TestBed.configureTestingModule({
      providers: [
        CustomerFielValidationService,
        { provide: HttpClientService, useValue: mockHttp }
      ]
    });

    service = TestBed.inject(CustomerFielValidationService);

    (service as any).urls = {
      fielApi: '/mock-url'
    };
  });

  it('debe llamar http.post con url dinámica y body', (done) => {
    const name = 'fielApi' as any;
    const body: CustomerFielValidationRequest = {
      certificateNumber: 'ABC123'
    };
    const response = buildResponse();

    mockHttp.post.and.returnValue(of(response));

    service.validateFiel(name, body).subscribe(res => {
      expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
      expect(res).toEqual(response);
      done();
    });
  });

  it('debe retornar el objeto completo del response', (done) => {
    const name = 'fielApi' as any;
    const body: CustomerFielValidationRequest = {
      certificateNumber: 'XYZ999'
    };
    const response = buildResponse();

    mockHttp.post.and.returnValue(of(response));

    service.validateFiel(name, body).subscribe(res => {
      expect(res.certificateStatus).toBe('ACTIVE');
      expect(res.titularInfo.rfc).toBe('RFC123');
      expect(res.certificateNumber).toBe('ABC123');
      done();
    });
  });

});
