import { TestBed } from '@angular/core/testing';
import { ErrorValidFiscalService } from './valid-fiscal.service';
import { NotificationModalService } from '../notification-modal.service';

describe('ErrorValidFiscalService', () => {
  let service: ErrorValidFiscalService;
  let modalServiceSpy: jasmine.SpyObj<NotificationModalService>;
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return store[key] ?? null;
    });

    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      store[key] = value;
    });

    spyOn(localStorage, 'clear').and.callFake(() => {
      store = {};
    });

    store['fiscal_retry_timer'] = '[]';

    modalServiceSpy = jasmine.createSpyObj('NotificationModalService', [
      'success',
      'warning',
      'error',
    ]);

    TestBed.configureTestingModule({
      providers: [
        ErrorValidFiscalService,
        { provide: NotificationModalService, useValue: modalServiceSpy },
      ],
    });

    service = TestBed.inject(ErrorValidFiscalService);
  });

  const mockError = (msg: string, appCode?: string) =>
    ({
      error: {
        messages: [msg],
        appCode,
      },
    }) as any;

  it('should handle successful information', (done) => {
    modalServiceSpy.success.and.returnValue(Promise.resolve({ value: true }));

    service.handle(mockError('Información exitosa para la solicitud ABC123'))!.subscribe({
      error: (res) => {
        expect(modalServiceSpy.success).toHaveBeenCalled();
        expect(res.type).toBe('info-exitosa');
        done();
      },
    });
  });

  it('should allow retry on Service Unavailable', (done) => {
    modalServiceSpy.warning.and.returnValue(Promise.resolve({ value: true }));

    service.handle(mockError('Servicio no disponible'))!.subscribe({
      error: (res) => {
        expect(res.retry).toBeTrue();
        expect(res.type).toBe('servicio-no-disponible');

        const attempts = JSON.parse(store['fiscal_retry_timer']);
        expect(attempts.length).toBe(1);

        done();
      },
    });
  });

  it('should cancel retry on Service Unavailable', (done) => {
    modalServiceSpy.warning.and.returnValue(Promise.resolve({ value: false }));

    service.handle(mockError('Servicio no disponible'))!.subscribe({
      error: (res) => {
        expect(res.retry).toBeFalse();

        const attempts = JSON.parse(store['fiscal_retry_timer']);
        expect(attempts.length).toBe(0);

        done();
      },
    });
  });

  it('should block retry when retry limit is reached', (done) => {
    const now = Date.now();
    store['fiscal_retry_timer'] = JSON.stringify([now, now, now]);

    modalServiceSpy.warning.and.returnValue(Promise.resolve({ value: true }));

    service.handle(mockError('Servicio no disponible'))!.subscribe({
      error: (res) => {
        expect(res.type).toBe('retry-timeout');
        done();
      },
    });
  });

  it('should handle fiscal validation error without retry', (done) => {
    modalServiceSpy.warning.and.returnValue(Promise.resolve({ value: true }));

    service.handle(mockError('No fue posible continuar con el registro'))!.subscribe({
      error: (res) => {
        expect(modalServiceSpy.warning).toHaveBeenCalled();
        expect(res.type).toBe('datos-fiscales-invalidos');
        done();
      },
    });
  });

  it('should handle 420 fiscal code mapping', (done) => {
    modalServiceSpy.warning.and.returnValue(Promise.resolve({ value: true }));

    const err = mockError(
      'El código postal del domicilio fiscal no coincide con los registros del SAT.',
      'PERSON_ONBOARDING-B-420',
    );

    service.handle(err)!.subscribe({
      error: (res) => {
        expect(res.type).toBe('420-error');
        expect(res.message).toBe('El código postal fiscal no coincide con los registros del SAT.');
        done();
      },
    });
  });

  it('should return null for unrecognized error case', () => {
    const result = service.handle(mockError('unknown message'));
    expect(result).toBeNull();
  });
});
