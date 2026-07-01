import { HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';

import { NotificationInterceptor } from './notification.interceptor';
import { NotificationFormRegistry } from './notification-form-registry.service';
import { NotificationChangeDetectorService } from './notification-change-detector.service';
import { NotificationSectionMapService } from './notification-section-map.service';
import { NotificationService } from './notification.service';
import { OnboardingService } from '../../../onboarding/services/onboarding.service';

describe('NotificationInterceptor', () => {
  let interceptor: NotificationInterceptor;
  let registrySpy: jasmine.SpyObj<NotificationFormRegistry>;
  let detectorSpy: jasmine.SpyObj<NotificationChangeDetectorService>;
  let sectionMapSpy: jasmine.SpyObj<NotificationSectionMapService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let onboardingServiceSpy: jasmine.SpyObj<OnboardingService>;
  let nextHandlerSpy: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    registrySpy = jasmine.createSpyObj<NotificationFormRegistry>('NotificationFormRegistry', [
      'getCurrentForm',
      'getInitialValue',
    ]);
    detectorSpy = jasmine.createSpyObj<NotificationChangeDetectorService>('NotificationChangeDetectorService', [
      'detectArrayChanges',
    ]);
    sectionMapSpy = jasmine.createSpyObj<NotificationSectionMapService>('NotificationSectionMapService', [
      'enumForList',
    ]);
    notificationServiceSpy = jasmine.createSpyObj<NotificationService>('NotificationService', [
      'sendNotifications',
    ]);
    onboardingServiceSpy = jasmine.createSpyObj<OnboardingService>('OnboardingService', [
      'getCurrentInfo',
    ]);
    nextHandlerSpy = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        NotificationInterceptor,
        { provide: NotificationFormRegistry, useValue: registrySpy },
        { provide: NotificationChangeDetectorService, useValue: detectorSpy },
        { provide: NotificationSectionMapService, useValue: sectionMapSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: OnboardingService, useValue: onboardingServiceSpy },
      ],
    });

    interceptor = TestBed.inject(NotificationInterceptor);
    nextHandlerSpy.handle.and.returnValue(of(new HttpResponse({ status: 200, body: { status: 'OK' } })));
    onboardingServiceSpy.getCurrentInfo.and.returnValue({
      clientId: 123,
      accountId: 456,
    } as any);
    notificationServiceSpy.sendNotifications.and.returnValue(of({ status: 'OK' }));
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should bypass when there is no current form', async () => {
    const request = new HttpRequest('POST', '/test', { data: { addressList: [] } });
    registrySpy.getCurrentForm.and.returnValue(null);

    await firstValueFrom(interceptor.intercept(request, nextHandlerSpy));

    expect(nextHandlerSpy.handle).toHaveBeenCalledWith(request);
    expect(notificationServiceSpy.sendNotifications).not.toHaveBeenCalled();
  });

  it('should bypass when the request has no data payload', async () => {
    const request = new HttpRequest('POST', '/test', { other: true });
    registrySpy.getCurrentForm.and.returnValue({} as any);
    registrySpy.getInitialValue.and.returnValue({ data: {} });

    await firstValueFrom(interceptor.intercept(request, nextHandlerSpy));

    expect(nextHandlerSpy.handle).toHaveBeenCalledWith(request);
    expect(notificationServiceSpy.sendNotifications).not.toHaveBeenCalled();
  });

  it('should send notifications when the detector finds changes', async () => {
    const request = new HttpRequest('POST', '/test', {
      data: {
        addressList: [{ id: 1, active: true }],
        telephones: [],
        emails: [],
        residenceList: [],
        postalAddress: [],
      },
    });

    registrySpy.getCurrentForm.and.returnValue({} as any);
    registrySpy.getInitialValue.and.returnValue({
      data: {
        addressList: [],
        telephones: [],
        emails: [],
        residenceList: [],
        postalAddress: [],
      },
    });

    sectionMapSpy.enumForList.and.callFake((listName: string) => {
      if (listName === 'addressList') return 'TAX_ADDRESS';
      return null;
    });
    detectorSpy.detectArrayChanges.and.returnValue({ created: true, updated: false, down: false });

    await firstValueFrom(interceptor.intercept(request, nextHandlerSpy));

    expect(notificationServiceSpy.sendNotifications).toHaveBeenCalledWith('notifications', {
      clientId: '123',
      accountId: '456',
      notifications: ['TAX_ADDRESS_CREATED'],
    });
  });

  it('should not send notifications when the backend response is not eligible', async () => {
    nextHandlerSpy.handle.and.returnValue(of(new HttpResponse({ status: 500, body: { status: 'OK' } })));
    const request = new HttpRequest('POST', '/test', {
      data: {
        addressList: [],
        telephones: [],
        emails: [],
        residenceList: [],
        postalAddress: [],
      },
    });

    registrySpy.getCurrentForm.and.returnValue({} as any);
    registrySpy.getInitialValue.and.returnValue({ data: {} });

    await firstValueFrom(interceptor.intercept(request, nextHandlerSpy));

    expect(notificationServiceSpy.sendNotifications).not.toHaveBeenCalled();
  });
});