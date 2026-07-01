import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { environment } from "../../../environments/environment";
import { HttpClientService } from "../../core/services/http-client.service";
import { RequestWorkflowAssignmentDetail, WorkflowAssignmentDetail } from "../models/contractApproval/detail";
import { TestBed } from "@angular/core/testing";
import { DetailService } from "./detail-contract-approval";

describe('DetailService', () => {
  let service: DetailService;
  let httpClientServiceSpy: jasmine.SpyObj<HttpClientService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClientService', ['post']);

    TestBed.configureTestingModule({
      providers: [
        DetailService,
        { provide: HttpClientService, useValue: spy }
      ]
    });

    service = TestBed.inject(DetailService);
    httpClientServiceSpy = TestBed.inject(HttpClientService) as jasmine.SpyObj<HttpClientService>;
  });

  it('should call HttpClientService.post with correct URL and body', () => {
    const mockBody: RequestWorkflowAssignmentDetail = {
      workFlowDetailId: 0
    };
    const mockResponse: WorkflowAssignmentDetail = {
      id: 1,
      workFlowAssignmentId: 1,
      applilcationNumber: "1",
      clientNumber: "1",
      contractNumberBank: {
        contractId: 1,
        contractNumber: "1",
        contractType: "1",
        subContractType: "1"
      },
      stockExchangeContract: {
        contractId: 1,
        contractNumber: "1",
        contractType: "1",
        subContractType: "1"
      },
      financialCenter: "1",
      createdDate: "1",
      status: "1",
      createdBy: {
        id: 0,
        firstName: "1",
        middleName: "1",
        lastName: "1",
        secondLastName: "1"
      }
    };

    httpClientServiceSpy.post.and.returnValue(of(mockResponse));

    service.getDetailWF(mockBody).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpClientServiceSpy.post).toHaveBeenCalledOnceWith(service['url'], JSON.stringify(mockBody));
  });
});