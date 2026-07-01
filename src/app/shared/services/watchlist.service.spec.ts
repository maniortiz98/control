import { TestBed } from '@angular/core/testing';
import { environment } from "../../../environments/environment";
import { WatchlistService } from './watchlist.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CustomerWatchListBody, CustomerWatchListResponse, WatchList } from '../../onboarding/models/customer-watch-list';
import { RouterTestingModule } from '@angular/router/testing';

describe('YourService', () => {
  
  let service: WatchlistService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule ],
      providers: [WatchlistService]
    });

    service = TestBed.inject(WatchlistService);
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
        isOnWatchlist: false,
        step: 0,
        matchLists: []
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