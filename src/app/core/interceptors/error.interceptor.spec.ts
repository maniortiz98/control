import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';

import { ErrorInterceptor } from './error.interceptor';
import { NotificationModalService } from '../../shared/services/notification-modal.service';
import { LoadingService } from '../../shared/services/loading.service';
import { OnboardingService } from '../../onboarding/services/onboarding.service';
import { ErrorValidFiscalService } from '../../shared/services/fiscal-valid/valid-fiscal.service';
import { UnsavedChangesService } from '../services/unsaved-changes.service';
import { CurrentOnboardingInfo } from '../../onboarding/models/current-onboarding';

function makeCurrentInfo(override: Partial<CurrentOnboardingInfo> = {}): CurrentOnboardingInfo {
  return {
    requestId: 'REQ-123',
    personType: 'PF',
    name: 'John Doe',
    contractType: 'STANDARD',
    contractSubtype: 'BASIC',
    businessType: 'COMERCIAL',
    onboardingId: 1000,
    isMaintenance: false,
    isCustomer: false,
    isOnboarding: false,
    clientId: 11,
    accountId: 22,
    accountData: null,
    ...override,
  };
}

describe('ErrorInterceptor – 504 Timeout', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let router: Router;

  let modalService: jasmine.SpyObj<NotificationModalService>;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let onboardingService: jasmine.SpyObj<OnboardingService>;
  let errorValidFiscalService: jasmine.SpyObj<ErrorValidFiscalService>;
  let unsavedChangesService: jasmine.SpyObj<UnsavedChangesService>;

  beforeEach(() => {
    modalService = jasmine.createSpyObj('NotificationModalService', ['error']);
    loadingService = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
    onboardingService = jasmine.createSpyObj('OnboardingService', [
      'getCurrentInfo',
      'clearOnboardingInfo',
    ]);
    errorValidFiscalService = jasmine.createSpyObj('ErrorValidFiscalService', ['handle']);
    unsavedChangesService = jasmine.createSpyObj('UnsavedChangesService', ['setUnsavedChanges']);

    onboardingService.getCurrentInfo.and.returnValue(makeCurrentInfo());
    errorValidFiscalService.handle.and.returnValue(null);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: NotificationModalService, useValue: modalService },
        { provide: LoadingService, useValue: loadingService },
        { provide: OnboardingService, useValue: onboardingService },
        { provide: ErrorValidFiscalService, useValue: errorValidFiscalService },
        { provide: UnsavedChangesService, useValue: unsavedChangesService },
        { provide: MatDialog, useValue: { openDialogs: [] } },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true,
        },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    spyOnProperty(router, 'url', 'get').and.returnValue('/onboarding/new/step');
  });

  afterEach(() => {
    httpMock.verify({ ignoreCancelled: true });
  });

  it('504 con URL absoluta: extrae último segmento y reintenta hasta agotar', fakeAsync(() => {
    modalService.error.and.returnValues(
      Promise.resolve({ value: true }),
      Promise.resolve({ value: true }),
    );

    const endpoint = 'https://api.example.com/v1/customer/tax-info';
    http.get(endpoint).subscribe();

    httpMock.expectOne(endpoint).flush('timeout', { status: 504, statusText: 'Gateway Timeout' });
    flushMicrotasks();

    httpMock.expectOne(endpoint).flush('timeout', { status: 504, statusText: 'Gateway Timeout' });
    flushMicrotasks();

    httpMock.expectOne(endpoint).flush('timeout', { status: 504, statusText: 'Gateway Timeout' });
    flushMicrotasks();

    expect(modalService.error).toHaveBeenCalledTimes(2);

    const cfg = modalService.error.calls.argsFor(0)[0];
    expect(cfg.afterMessages).toContain('Endpoint: "tax-info"');
    expect(cfg.afterCopyMessages).toContain('Timeout en "tax-info"');
  }));

  it('504 con URL relativa: extrae último segmento correcto', fakeAsync(() => {
    modalService.error.and.returnValues(
      Promise.resolve({ value: true }),
      Promise.resolve({ value: true }),
    );

    const endpoint = '/api/customer/tax-info/save';
    http.post(endpoint, {}).subscribe();

    httpMock.expectOne(endpoint).flush('timeout', { status: 504, statusText: 'Gateway Timeout' });
    flushMicrotasks();

    httpMock.expectOne(endpoint).flush('timeout', { status: 504, statusText: 'Gateway Timeout' });
    flushMicrotasks();

    httpMock.expectOne(endpoint).flush('timeout', { status: 504, statusText: 'Gateway Timeout' });
    flushMicrotasks();

    const cfg = modalService.error.calls.argsFor(0)[0];
    expect(cfg.afterMessages).toContain('Endpoint: "save"');
    expect(cfg.afterCopyMessages).toContain('Timeout en "save"');
  }));

  it('504: si el usuario cancela, no se reintenta', fakeAsync(() => {
    modalService.error.and.returnValue(Promise.resolve({ value: false }));

    const endpoint = '/api/customer/tax-info';
    http.get(endpoint).subscribe();

    httpMock.expectOne(endpoint).flush('timeout', { status: 504, statusText: 'Gateway Timeout' });
    flushMicrotasks();

    expect(modalService.error).toHaveBeenCalledTimes(1);
    expect(httpMock.match(endpoint).length).toBe(0);
  }));
});
