import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';

import { NotificationService, NotificationRequest, NotificationResponse } from './notification.service';
import { HttpClientService } from '../../../core/services/http-client.service';
import { environment } from '../../../../environments/environment';
import { ApisServices } from '../../types/catalogs.type';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpServiceSpy: jasmine.SpyObj<HttpClientService>;

  beforeEach(() => {
    httpServiceSpy = jasmine.createSpyObj<HttpClientService>('HttpClientService', ['post']);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: HttpClientService, useValue: httpServiceSpy },
      ],
    });

    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sendNotifications should POST to the configured api url and return the mapped response', async () => {
    const api = 'notifications' as ApisServices;
    const body: NotificationRequest = {
      clientId: '123456',
      accountId: 'ABC-001',
      notifications: ['EMAIL', 'SMS'],
    };
    const expectedResponse: NotificationResponse = {
      status: 'OK',
      message: 'Notifications sent',
    };

    httpServiceSpy.post.and.returnValue(of(expectedResponse));

    const response = await firstValueFrom(service.sendNotifications(api, body));

    expect(httpServiceSpy.post).toHaveBeenCalledWith(environment.api.services[api], body);
    expect(response).toEqual(expectedResponse);
  });

  it('sendNotifications should preserve a minimal response body', async () => {
    const api = 'notifications' as ApisServices;
    const body: NotificationRequest = {
      clientId: '123456',
      accountId: 'ABC-001',
      notifications: [],
    };
    const expectedResponse: NotificationResponse = {
      status: 'EMPTY_OK',
    };

    httpServiceSpy.post.and.returnValue(of({ status: 'EMPTY_OK' }));

    const response = await firstValueFrom(service.sendNotifications(api, body));

    expect(httpServiceSpy.post).toHaveBeenCalledWith(environment.api.services[api], body);
    expect(response).toEqual(expectedResponse);
  });
});