import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CustomerValidCurpService } from './customer-valid-curp.service';
import { HttpClientService } from '../../../core/services/http-client.service';
import { CustomerNotificationModalService } from '../customer-notification-modal.service';
import { CustomerCurpValidationResponse } from '../../models/customer-curp-valid';

describe('CustomerValidCurpService', () => {

  let service: CustomerValidCurpService;
  let mockHttp: jasmine.SpyObj<HttpClientService>;
  let mockModal: jasmine.SpyObj<CustomerNotificationModalService>;

  const buildResponse = (): CustomerCurpValidationResponse => ({
    status: 200,
    messages: ['ok'],
    payload: {
      result: true,
      renapoResponse: true,
      intents: 1,
      curp: 'CURP123',
      names: 'NAME',
      lastName: 'LAST',
      secondLastName: 'SECOND',
      gender: 'M',
      birthDate: '2000-01-01',
      birthStateCode: 'AGS',
      birthState: 'AGUASCALIENTES'
    }
  });

  beforeEach(() => {
    mockHttp = jasmine.createSpyObj('HttpClientService', ['post']);
    mockModal = jasmine.createSpyObj('CustomerNotificationModalService', ['warning']);

    TestBed.configureTestingModule({
      providers: [
        CustomerValidCurpService,
        { provide: HttpClientService, useValue: mockHttp },
        { provide: CustomerNotificationModalService, useValue: mockModal }
      ]
    });

    service = TestBed.inject(CustomerValidCurpService);
    (service as any).url = '/mock-url';
  });

  it('llama post con body stringificado', (done) => {
    const body = { curp: 'ABC123' };
    const response = buildResponse();

    mockHttp.post.and.returnValue(of(response));

    service.postData(body).subscribe(res => {
      expect(mockHttp.post).toHaveBeenCalledWith('/mock-url', JSON.stringify(body));
      expect(res).toEqual(response);
      done();
    });
  });

  it('retorna payload completo en flujo exitoso', (done) => {
    const response = buildResponse();

    mockHttp.post.and.returnValue(of(response));

    service.postData({ curp: 'X' }).subscribe(res => {
      expect(res.payload.curp).toBe('CURP123');
      expect(res.payload.result).toBeTrue();
      done();
    });
  });

  it('maneja error final y llama modal', (done) => {
    const error = { status: 500 };

    mockHttp.post.and.returnValue(throwError(() => error));
    mockModal.warning.and.returnValue(Promise.resolve({ value: true }));

    service.postData({ curp: 'X' }).subscribe({
      error: (err) => {
        expect(mockModal.warning).toHaveBeenCalled();
        expect(err.finalAttempt).toBeTrue();
        expect(err.originalError).toBe(error);
        done();
      }
    });
  });

  it('envía configuración correcta al modal en error', (done) => {
    mockHttp.post.and.returnValue(throwError(() => ({})));
    mockModal.warning.and.returnValue(Promise.resolve({ value: true }));

    service.postData({ curp: 'X' }).subscribe({
      error: () => {
        const args = mockModal.warning.calls.mostRecent().args[0] as any;

        expect(args.title).toBe('Intento Final Fallido');
        expect(args.afterMessages).toEqual([
          'Captura la Información del Cliente Manualemente'
        ]);
        expect(args.btnAccept).toBe('OK');

        done();
      }
    });
  });

});
``