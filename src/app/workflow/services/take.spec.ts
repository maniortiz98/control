import { inject, Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { RequestWfTake, ResponceWfTake } from "../models/inbox/inboxData";
import { environment } from "../../../environments/environment";
import { HttpClientService } from "../../core/services/http-client.service";
import { TestBed } from "@angular/core/testing";
import { TakeService } from "./take";

describe('TakeService', () => {
  let service: TakeService;
  let httpClientServiceSpy: jasmine.SpyObj<HttpClientService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClientService', ['post']);

    TestBed.configureTestingModule({
      providers: [
        TakeService,
        { provide: HttpClientService, useValue: spy }
      ]
    });

    service = TestBed.inject(TakeService);
    httpClientServiceSpy = TestBed.inject(HttpClientService) as jasmine.SpyObj<HttpClientService>;
  });

  it('should call HttpClientService.post with correct URL and body', () => {
    const mockBody: RequestWfTake = {
      workflowId: 1,
      domainUser: '1'
    };
    const mockResponse: ResponceWfTake = {
      workflowId: 1,
      name: "ASD"
    };

    httpClientServiceSpy.post.and.returnValue(of(mockResponse));

    service.take(mockBody).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpClientServiceSpy.post).toHaveBeenCalledOnceWith(service['url'], JSON.stringify(mockBody));
  });
});
