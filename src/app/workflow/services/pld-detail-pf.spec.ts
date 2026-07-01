import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { environment } from "../../../environments/environment";
import { HttpClientService } from "../../core/services/http-client.service";
import { RequestWorkflowAssignmentDetail } from "../models/contractApproval/detail";
import { ApplicationData } from "../models/pldPf/pld-pf-detail";
import { TestBed } from "@angular/core/testing";
import { DetailServicePldPf } from "./pld-detail-pf";

describe('DetailServicePldPf', () => {
  let service: DetailServicePldPf;
  let httpClientServiceSpy: jasmine.SpyObj<HttpClientService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClientService', ['post']);

    TestBed.configureTestingModule({
      providers: [
        DetailServicePldPf,
        { provide: HttpClientService, useValue: spy }
      ]
    });

    service = TestBed.inject(DetailServicePldPf);
    httpClientServiceSpy = TestBed.inject(HttpClientService) as jasmine.SpyObj<HttpClientService>;
  });

  it('should call HttpClientService.post with correct URL and body', () => {
    const mockBody: RequestWorkflowAssignmentDetail = {
      workFlowDetailId: 1
    };
    const mockResponse: ApplicationData = {
      "id": 2,
      "workFlowAssignmentId": 2,
      "applicationNumber": "174151",
      "curp": "ASDF9010101HDFOIU01",
      "identification": {
        "rfc": "ASDF9010101",
        "nif": "",
        "tin": "",
        "nss": ""
      },
      "client": {
        "clientNumber": 10446524,
        "firstName": "ASD",
        "middleName": "ASD",
        "lastName": "ASD",
        "secondLastName": "ASD",
        "typePerson": "1",
        "genre": "1",
        "nacionality": "",
        "stateId": "",
        "rol": "",
        "birthdate": ""
      },
      "financialCenter": "CDMX SANTA FE GLEZ CAMARENA",
      "advisor": "CLAUDIA PATRICIA ROJAS SANDOVAL",
      "typeOperation": "1",
      "contract": {
        "bankingArea": "999",
        "contractId": 1,
        "contractNumber": "10041234",
        "contractType": "1",
        "subContractType": "2"
      },
      "createdDate": "",
      "createdHour": "",
      "statusId": 1,
      "repeat": [
        {
          "id": 1,
          "clientNumber": "",
          "firstName": "CLAUDIA",
          "middleName": "PATRICIA",
          "lastName": "ROJAS",
          "secondLastName": "SANDOVAL",
          "status": "1",
          "listName": "",
          "stream": ""
        }
      ]
    };

    httpClientServiceSpy.post.and.returnValue(of(mockResponse));

    service.getDetailWFPldPf(mockBody).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpClientServiceSpy.post).toHaveBeenCalledOnceWith(service['url'], JSON.stringify(mockBody));
  });
});
