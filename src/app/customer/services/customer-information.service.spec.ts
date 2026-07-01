import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CustomerInformationService } from './customer-information.service';
import { HttpClientService } from '../../core/services/http-client.service';
import { CustomerNotificationModalService } from './customer-notification-modal.service';
import { CustomerNotificationsService } from './customer-notifications.service';
import { of, throwError } from 'rxjs';

describe('CustomerInformationService', () => {
  let service: CustomerInformationService;
  let httpClientSpy: jasmine.SpyObj<HttpClientService>;
  let notificationModalSpy: jasmine.SpyObj<CustomerNotificationModalService>;
  let notificationsSpy: jasmine.SpyObj<CustomerNotificationsService>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClientService', ['post']);
    notificationModalSpy = jasmine.createSpyObj('CustomerNotificationModalService', ['error']);
    notificationsSpy = jasmine.createSpyObj('CustomerNotificationsService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        CustomerInformationService,
        { provide: HttpClientService, useValue: httpClientSpy },
        { provide: CustomerNotificationModalService, useValue: notificationModalSpy },
        { provide: CustomerNotificationsService, useValue: notificationsSpy }
      ]
    });
    service = TestBed.inject(CustomerInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get customer info successfully without sections', () => {
    const mockResponse = {
      initialData: { name: 'Test' },
      identificationContact: {
        emails: [{ email: 'test@test.com' }]
      }
    };
    httpClientSpy.post.and.returnValue(of(mockResponse));

    service.getCustomerInfo(123).subscribe((res: any) => {
      expect(res.initialData).toEqual({ name: 'Test' });
      expect(res.emails).toEqual([{ email: 'test@test.com' }]);
    });
    expect(httpClientSpy.post).toHaveBeenCalled();
  });

  it('should fail and notify on 412 error', fakeAsync(() => {
    const errorResponse = { status: 412 };
    httpClientSpy.post.and.returnValue(throwError(() => errorResponse));

    service.getCustomerInfo(123).subscribe({
      error: (err) => {
        expect(err.status).toBe(412);
      }
    });
    tick();
    expect(notificationsSpy.error).toHaveBeenCalledWith('Dato no Encontrado');
  }));
});
