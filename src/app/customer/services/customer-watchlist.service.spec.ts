import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CustomerWatchlistService } from "./customer-watchlist.service";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CustomerWatchListBody, CustomerWatchListResponse, WatchList } from "../models/customer-watch-list";
import { environment } from "../../../environments/environment";

describe('YourService', () => {
  
  let service: CustomerWatchlistService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule ],
      providers: [CustomerWatchlistService]
    });

    service = TestBed.inject(CustomerWatchlistService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should post data and return WatchList', () => {
    const mockBody: CustomerWatchListBody = {
      personalInfo: {
        fullName: '',
        birthDate: '',
        rfc: '',
        curp: '',
        nif: '',
        clientNumber: '',
        ssn: '',
        personType: '',
        name: '',
        middleName: '',
        lastName: '',
        secondLastName: '',
        gender: '',
        countryOfBirth: '',
        federalEntity: ''
      }
    };
    const mockResponse: CustomerWatchListResponse = {
      payload: {
        step: 0,
        matchLists: [],
        fullName: "",
        birthDate: "",
        rfc: "",
        curp: "",
        nif: "",
        clientNumber: "",
        ssn: "",
        personType: "",
        name: "",
        middleName: "",
        lastName: "",
        secondLastName: "",
        gender: "",
        countryOfBirth: "",
        federalEntity: ""
      },
      status: 0,
      messages: []
    };

    service.postData(mockBody).subscribe((result: WatchList) => {
      expect(result).toEqual(mockResponse.payload);
    });

    const req = httpMock.expectOne(environment.api.watchlist);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});