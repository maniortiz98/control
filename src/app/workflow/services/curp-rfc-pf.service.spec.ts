import { TestBed } from '@angular/core/testing';

import { CurpRfcPfService } from './curp-rfc-pf.service';
import { HttpClientService } from '../../core/services/http-client.service';
import { RfcCurpData, RfcCurpRequest } from '../models/curpAndRfc/rfcCurpData.interface';
import { of } from 'rxjs';

describe('CurpRfcPfService', () => {
  let service: CurpRfcPfService;
  let httpClientServiceSpy: jasmine.SpyObj<HttpClientService>;

    beforeEach(() => {
      const spy = jasmine.createSpyObj('HttpClientService', ['post']);

      TestBed.configureTestingModule({
        providers: [
          CurpRfcPfService,
          { provide: HttpClientService, useValue: spy }
        ]
      });

      service = TestBed.inject(CurpRfcPfService);
      httpClientServiceSpy = TestBed.inject(HttpClientService) as jasmine.SpyObj<HttpClientService>;
    });

    it('should call HttpClientService.post with correct URL and body', () => {
      const mockBody: RfcCurpRequest = {
        idWorkflowDetalle: 0
      };

      const mockResponse: RfcCurpData = {
        id: '0',
        taskNumber: 0,
        workflowRequestStatus: 0,
        workflowRequestDate: '',
        workflowRequestTime: '',
        bankingArea: 0,
        financialCenter: '',
        advisor: '',
        contractNumber: 0,
        personType: '',
        role: '',
        clientNumber: '',
        firstName: '',
        secondName: '',
        lastName: '',
        secondLastName: '',
        updatedRfc: '',
        updatedCurp: '',
        comment: '',
        rfc: '',
        curp: '',
      };

      httpClientServiceSpy.post.and.returnValue(of(mockResponse));

      service.getDetailCurpAndRfc(mockBody).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      expect(httpClientServiceSpy.post).toHaveBeenCalledOnceWith(service['url'], JSON.stringify(mockBody));
    });
});
