import { inject, Injectable } from "@angular/core";
import { map, Observable, of } from "rxjs";
import { RfcCurpData } from "../models/curpAndRfc/rfcCurpData.interface";
import { AssignmentDetail, RequestWF } from "../models/inbox/inboxData";
import { environment } from "../../../environments/environment";
import { HttpClientService } from "../../core/services/http-client.service";
import { TestBed } from "@angular/core/testing";
import { InboxService } from "./inbox.service";

describe('InboxService', () => {
  let service: InboxService;
  let httpClientServiceSpy: jasmine.SpyObj<HttpClientService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClientService', ['post']);

    TestBed.configureTestingModule({
      providers: [
        InboxService,
        { provide: HttpClientService, useValue: spy }
      ]
    });

    service = TestBed.inject(InboxService);
    httpClientServiceSpy = TestBed.inject(HttpClientService) as jasmine.SpyObj<HttpClientService>;
  });

  it('should call HttpClientService.post with correct URL and body', () => {
    const mockBody: RequestWF = {
      domainUser: '1'
    };
    const mockResponse: AssignmentDetail[] = [
      {
        "id": 4,
        "number": 1001,
        "accountId": 1,
        "clientId": 1,
        "personType": 1,
        "description": "Detalle de Asignación del Flujo de Trabajo",
        "operativeFlow": "Flujo Operativo 1",
        "observations": "Ninguna observación",
        "rejectedReason": "Motivo de rechazo",
        "list": "Lista 1",
        "requestDate": "2024-01-01T12:00:00Z",
        "responseDate": "2024-01-02T12:00:00Z",
        "workFlow": {
          "id": 3,
          "name": "Aprobación Contrato PF"
        },
        "workflowStatus": {
          "id": 1,
          "description": "Listo/Inicializado"
        },
        "causeWorkflowChange": {
          "id": 1,
          "cve": "01",
          "description": "APROBADO POR SISTEMA"
        },
        "createdBy": {
          "id": 1,
          "firstName": "Juan",
          "middleName": "Carlos",
          "lastName": "Pérez",
          "secondLastName": "Gómez"
        },
        "approvedBy": {
          "id": 1,
          "firstName": "Juan",
          "middleName": "Carlos",
          "lastName": "Pérez",
          "secondLastName": "Gómez"
        }
    }];

    httpClientServiceSpy.post.and.returnValue(of(mockResponse));

    service.getTask(mockBody).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpClientServiceSpy.post).toHaveBeenCalledOnceWith(service['url'], JSON.stringify(mockBody));
  });
})
