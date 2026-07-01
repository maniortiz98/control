import { TestBed } from "@angular/core/testing";
import { HttpClientService } from "../../core/services/http-client.service";
import { CustomerZipCodeService } from "./customer-zip-code.service";
import { of } from "rxjs";

describe('CustomerZipCodeService', () => {

  let service: CustomerZipCodeService;
  let mockHttp: jasmine.SpyObj<HttpClientService>;

  const buildResponse = () => ({
    status: 200,
    payload: {
      city: 'CDMX',
      cityDesc: 'Ciudad de México',
      federalEntityId: '09',
      federalEntity: 'CDMX',
      listSuburb: {} as any,
      result: {} as any,
      town: 'MX',
      townDesc: 'México',
      zoneGeo: 'URB'
    },
    messages: []
  });

  beforeEach(() => {
    mockHttp = jasmine.createSpyObj('HttpClientService', ['post']);

    TestBed.configureTestingModule({
      providers: [
        CustomerZipCodeService,
        { provide: HttpClientService, useValue: mockHttp }
      ]
    });

    service = TestBed.inject(CustomerZipCodeService);

    (service as any).url = '/mock-url';
  });

  it('debe llamar POST y mapear payload', (done) => {
    const body = { zipCode: '01000' };
    const response = buildResponse();

    spyOn(console, 'log');

    mockHttp.post.and.returnValue(of(response));

    service.postData(body).subscribe(res => {

      expect(console.log).toHaveBeenCalledWith(JSON.stringify(body));

      expect(mockHttp.post).toHaveBeenCalledWith(
        '/mock-url',
        JSON.stringify(body)
      );

      expect(res).toEqual(response.payload);

      done();
    });
  });

  it('debe retornar solo payload del response', (done) => {
    const body = { zipCode: '20000' };
    const response = buildResponse();

    mockHttp.post.and.returnValue(of(response));

    service.postData(body).subscribe(res => {
      expect(res.city).toBe('CDMX');
      expect(res.federalEntity).toBe('CDMX');
      done();
    });
  });

});