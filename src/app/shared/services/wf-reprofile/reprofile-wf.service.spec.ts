import { TestBed } from "@angular/core/testing";
import { of, throwError } from "rxjs";
import { HttpClientService } from "../../../core/services/http-client.service";
import { RequestWfReprofile, ResponseWfReprofile } from "../../../onboarding/models/generate-reprofile";
import { NotificationModalService } from "../notification-modal.service";
import { ReprofileWfService } from "./reprofile-wf.service";

describe('ReprofileWdService', () => {
  let service: ReprofileWfService;
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
        ReprofileWfService,
        { provide: HttpClientService, useValue: mockHttpClientService },
        { provide: NotificationModalService, useValue: mockNotificationModalService }
      ]
    });

    service = TestBed.inject(ReprofileWfService);
  });

  it('should post data and return curp', (done) => {
    const mockRequest: RequestWfReprofile = {
      contractNumber: 0,
      clientNumber: 0,
      bankingArea: '',
      workflowId: '',
      workflowStatusId: 0,
      userId: '',
      workflowRequestNum: '',
      itemList: '',
      applicationId: 123,
      origin: '',
      user: '',
      contract: '',
    };
    const mockResponse: ResponseWfReprofile = {
      workflowDetalleId: 0
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
    const mockRequest: RequestWfReprofile = {
      contractNumber: 0,
      clientNumber: 0,
      bankingArea: '',
      workflowId: '',
      workflowStatusId: 0,
      userId: '',
      workflowRequestNum: '',
      itemList: '',
      applicationId: 123,
      origin: '',
      user: '',
      contract: '',
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

        expect(mockNotificationModalService.warning).toHaveBeenCalledTimes(1000);
        done();
      }
    });
  });
});
