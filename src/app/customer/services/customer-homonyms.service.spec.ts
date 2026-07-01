import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { HttpClientService } from "../../core/services/http-client.service";
import { CustomerHomonymsResponse } from "../models/customer-homonyms";
import { CustomerHomonymsService } from "./customer-homonyms.service";

describe('CustomerHomonymsService', () => {

  let service: CustomerHomonymsService;
  let mockHttp: jasmine.SpyObj<HttpClientService>;

  const buildItem = (similarity: number): CustomerHomonymsResponse => ({
    firstName: 'Name',
    secondName: 'SName',
    lastName: 'Last',
    secondLastName: 'Last2',
    rfc: 'RFC',
    curp: 'CURP',
    percentSimilarity: similarity,
    clientNumber: '123'
  });

  beforeEach(() => {
    mockHttp = jasmine.createSpyObj('HttpClientService', ['post']);

    TestBed.configureTestingModule({
      providers: [
        CustomerHomonymsService,
        { provide: HttpClientService, useValue: mockHttp }
      ]
    });

    service = TestBed.inject(CustomerHomonymsService);

    (service as any).urls = '/mock-url';
  });

  it('debe llamar http.post con url y body correcto', (done) => {
    const body = { name: 'test' } as any;
    const response = [buildItem(0.456)];

    mockHttp.post.and.returnValue(of(response));

    service.postHomonyms(body).subscribe(() => {
      expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', body);
      done();
    });
  });

  it('debe redondear percentSimilarity a 2 decimales', (done) => {
    const body = {} as any;

    const response = [
      buildItem(0.4567), // -> 0.46
      buildItem(0.451)   // -> 0.45
    ];

    mockHttp.post.and.returnValue(of(response));

    service.postHomonyms(body).subscribe(res => {
      expect(res[0].percentSimilarity).toBe(0.46);
      expect(res[1].percentSimilarity).toBe(0.45);
      done();
    });
  });

  it('debe conservar las demás propiedades intactas', (done) => {
    const body = {} as any;
    const response = [buildItem(0.5)];

    mockHttp.post.and.returnValue(of(response));

    service.postHomonyms(body).subscribe(res => {
      expect(res[0].firstName).toBe('Name');
      expect(res[0].clientNumber).toBe('123');
      done();
    });
  });

  it('setData y getData deben manejar signal correctamente', () => {
    const data = [buildItem(0.3), buildItem(0.7)];

    service.setData(data);

    const result = service.getData();

    expect(result).toEqual(data);
  });

  it('getData inicial debe ser arreglo vacío', () => {
    expect(service.getData()).toEqual([]);
  });

});