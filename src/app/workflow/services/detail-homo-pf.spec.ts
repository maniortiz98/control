import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { environment } from "../../../environments/environment";
import { HttpClientService } from "../../core/services/http-client.service";
import { RequestWorkflowAssignmentDetail, WorkflowAssignmentDetail } from "../models/contractApproval/detail";
import { WorkFlowClientHomoDet } from "../models/homoPf/detail-homo-pf";
import { TestBed } from "@angular/core/testing";
import { DetailServiceHomoPf } from "./detail-homo-pf";

describe('DetailServiceHomoPf', () => {
  let service: DetailServiceHomoPf;
  let httpClientServiceSpy: jasmine.SpyObj<HttpClientService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClientService', ['post']);

    TestBed.configureTestingModule({
      providers: [
        DetailServiceHomoPf,
        { provide: HttpClientService, useValue: spy }
      ]
    });

    service = TestBed.inject(DetailServiceHomoPf);
    httpClientServiceSpy = TestBed.inject(HttpClientService) as jasmine.SpyObj<HttpClientService>;
  });

  it('should call HttpClientService.post with correct URL and body', () => {
    const mockBody: RequestWorkflowAssignmentDetail = {
      workFlowDetailId: 1
    };
    const mockResponse: WorkFlowClientHomoDet[] = [{
      clientNumber: "1",
      firstName: "ASD",
      middleName: "ASD",
      lastName: "ASD",
      secondLastName: "ASD",
      typePerson: 1,
      curp: "ASDF900101HDFQWE01",
      rfc: "ASDF900101",
      nif: "",
      tin: "",
      nss: ""
    }];

    httpClientServiceSpy.post.and.returnValue(of(mockResponse));

    service.getDetailWFHomoPf(mockBody).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpClientServiceSpy.post).toHaveBeenCalledOnceWith(service['url'], JSON.stringify(mockBody));
  });
});