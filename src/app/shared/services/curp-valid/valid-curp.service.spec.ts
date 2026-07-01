import { TestBed } from '@angular/core/testing';

import { ValidCurpService } from './valid-curp.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CurpValidationRequest, CurpValidationResponse } from '../../../onboarding/models/curp-valid';
import { environment } from '../../../../environments/environment';
import { of, throwError } from 'rxjs';
import { HttpClientService } from '../../../core/services/http-client.service';
import { NotificationModalService } from '../notification-modal.service';

describe('ValidCurpService', () => {
  let service: ValidCurpService;
  let mockHttpClientService: any;
  let mockNotificationModalService: any;

  beforeEach(() => {
    mockHttpClientService = {
      post: jasmine.createSpy('post')
    };

    mockNotificationModalService = {
      warning: jasmine.createSpy('warning').and.returnValue(of(void 0))
    };

    TestBed.configureTestingModule({
      providers: [
        ValidCurpService,
        { provide: HttpClientService, useValue: mockHttpClientService },
        { provide: NotificationModalService, useValue: mockNotificationModalService }
      ]
    });

    service = TestBed.inject(ValidCurpService);
  });

  it('should post data and return curp', (done) => {
    const mockRequest: CurpValidationRequest = {
      curp: 'ROOI850909HMCSLV07'
    };
    const mockResponse: CurpValidationResponse = {
      status: 200,
      messages: ['Success validate curp'],
      payload: {
        result: true,
        renapoResponse: true,
        intents: 1,
        curp: 'ROOI850909HMCSLV07',
        names: 'IVAN MAURICIO',
        lastName: 'DE LA ROSA',
        secondLastName: 'OLVERA',
        gender: 'H',
        birthDate: '09/09/1985',
        birthStateCode: 'MC',
        birthState: 'Estado de México'
      }
    };

    mockHttpClientService.post.and.returnValue(of(mockResponse));

    service.postData(mockRequest).subscribe({
      next: (response) => {
        expect(response).toEqual(mockResponse);
        expect(mockHttpClientService.post).toHaveBeenCalledWith(service['url'], JSON.stringify(mockRequest));
        expect(mockNotificationModalService.warning).not.toHaveBeenCalled();
        done();
      },
      error: (err) => {
        fail('Expected success, got error: ' + err);
        done();
      }
    });
  });

  it('should retry on error and call notification warning during retries then error finally', (done) => {
    const mockRequest: CurpValidationRequest = {
      curp: 'ROOI850909HMCSLV07'
    };
    const httpError = new Error('network error');

    mockHttpClientService.post.and.returnValue(throwError(() => httpError));
    mockNotificationModalService.warning.and.returnValue(of(void 0));

    service.postData(mockRequest).subscribe({
      next: () => {
        fail('Expected an error observable (final attempt failed), but got success');
        done();
      },
      error: (err) => {
        expect(err).toBeDefined();
        expect(err.finalAttempt).toBeTrue();
        expect(err.originalError).toBe(httpError);

        expect(mockHttpClientService.post).toHaveBeenCalledTimes(1);

        expect(mockNotificationModalService.warning).toHaveBeenCalledTimes(1);
        done();
      }
    });
  });
});
