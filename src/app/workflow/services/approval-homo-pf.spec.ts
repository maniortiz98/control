import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ResponceWfUpdate } from "../models/inbox/inboxData";
import { environment } from "../../../environments/environment";
import { HttpClientService } from "../../core/services/http-client.service";
import { WorkFlowAssignmentHomo } from "../models/homoPf/appproval-homo-pf";
import { TestBed } from "@angular/core/testing";
import { ApprovalHomoPfService } from "./approval-homo-pf";

describe('ApprovalHomoPfService', () => {
  let service: ApprovalHomoPfService;
  let httpClientServiceSpy: jasmine.SpyObj<HttpClientService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClientService', ['post']);

    TestBed.configureTestingModule({
      providers: [
        ApprovalHomoPfService,
        { provide: HttpClientService, useValue: spy }
      ]
    });

    service = TestBed.inject(ApprovalHomoPfService);
    httpClientServiceSpy = TestBed.inject(HttpClientService) as jasmine.SpyObj<HttpClientService>;
  });

  it('should call HttpClientService.post with correct URL and body', () => {
    const mockBody: WorkFlowAssignmentHomo = {
      workFlowAssignmentId: 0,
      person: {
        typePerson: 1,
        firstName: "ASD",
        middleName: "ASD",
        lastName: "ASD",
        secondLastName: "ASD",
        curp: "ASDF9010101HDFOIU01",
        rfc: "ASDF9010101",
        nif: "",
        tin: "",
        nss: ""
      },
      advisor: {
        id: 1
      }
    };
    const mockResponse: ResponceWfUpdate = {
      workflowId: 1,
      status: "1"
    };

    httpClientServiceSpy.post.and.returnValue(of(mockResponse));

    service.update(mockBody).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpClientServiceSpy.post).toHaveBeenCalledOnceWith(service['url'], JSON.stringify(mockBody));
  });
});
