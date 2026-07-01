import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { signal } from '@angular/core';
import { CustomerCheckpointService } from './customer-customer-checkpoint-core.service';
import { HttpClientService } from '../../core/services/http-client.service';
import { CustomerOnboardingService } from './customer-onboarding.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationModalService } from '../../shared/services/notification-modal.service';
import { NotificationsService } from '../../shared/services/notifications.service';
import { of } from 'rxjs';

describe('CustomerCheckpointService', () => {
  let service: CustomerCheckpointService;
  let httpClientSpy: jasmine.SpyObj<HttpClientService>;
  let onboardingSpy: jasmine.SpyObj<CustomerOnboardingService>;
  let authSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClientService', ['post', 'put']);
    onboardingSpy = jasmine.createSpyObj('CustomerOnboardingService', ['getCurrentInfo']);
    authSpy = jasmine.createSpyObj('AuthService', ['getUserInfo']);

    onboardingSpy.getCurrentInfo.and.returnValue({
      requestId: '123',
      clientId: 456,
      accountId: 789
    } as any);
    authSpy.getUserInfo.and.returnValue(signal({ employeeId: '999' } as any));

    TestBed.configureTestingModule({
      providers: [
        CustomerCheckpointService,
        { provide: HttpClientService, useValue: httpClientSpy },
        { provide: CustomerOnboardingService, useValue: onboardingSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: NotificationModalService, useValue: jasmine.createSpyObj('NotificationModalService', ['error']) },
        { provide: NotificationsService, useValue: jasmine.createSpyObj('NotificationsService', ['error']) }
      ]
    });
    service = TestBed.inject(CustomerCheckpointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call saveSection with correct data', () => {
    httpClientSpy.post.and.returnValue(of({ status: 'OK' }));
    service.saveSection('general-information' as any, { someData: true }).subscribe(res => {
      expect(res).toEqual({ status: 'OK' } as any);
    });
    expect(httpClientSpy.post).toHaveBeenCalled();
  });

  it('should call getSection with correct parameters', () => {
    httpClientSpy.post.and.returnValue(of({ data: 'test' }));
    service.getSection(['general-information'] as any, '123').subscribe(res => {
      expect(res).toEqual({ data: 'test' });
    });
    expect(httpClientSpy.post).toHaveBeenCalled();
  });
});
