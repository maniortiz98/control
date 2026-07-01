import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { RequestWfUpdate, ResponceWfUpdate } from "../models/inbox/inboxData";
import { environment } from "../../../environments/environment";
import { HttpClientService } from "../../core/services/http-client.service";
import { HttpTestingController, HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { UpdateService } from "./update";

describe('UpdateService', () => {
  let service: UpdateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UpdateService]
    });

    service = TestBed.inject(UpdateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should update and return response', () => {
    const mockRequest: RequestWfUpdate = {
      workflowId: 1,
      status: 1
    };
    const mockResponse: ResponceWfUpdate = {
      workflowId: 1,
      status: "1"
    };

    service.update(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(environment.api.updateStatus);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(mockRequest));

    req.flush(mockResponse);
  });
});
