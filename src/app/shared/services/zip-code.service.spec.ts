import { HttpTestingController, HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { environment } from "../../../environments/environment";
import { ZipCodeRequest, ZipCodeResponse } from "../../onboarding/models/zip-code";
import { ZipCodeService } from "./zip-code.service";

describe('ZipCodeService', () => {
  let service: ZipCodeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ZipCodeService]
    });

    service = TestBed.inject(ZipCodeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should post data and return ZipCode', () => {
    const mockRequest: ZipCodeRequest = {
      zipCode: "20000"
    };
    const mockResponse: ZipCodeResponse = {
    "status": 200,
    "messages": [
        "Success"
    ],
    "payload": {
        "city": "101003",
        "cityDesc": "AGUASCALIENTES MUNICIPIO DE, AGS",
        "federalEntityId": "AGS",
        "federalEntity": "AGUASCALIENTES",
        "listSuburb": {
            "item": [
                {
                    "zipCode": "20000",
                    "idSuburb": "0001",
                    "centerRep": "20001",
                    "suburb": "ZONA CENTRO"
                }
            ]
        },
        "result": {
            "result": "1",
            "messages": [
                "items"
            ]
        },
        "town": "001",
        "townDesc": "AGUASCALIENTES",
        "zoneGeo": "B"
    }
};

    service.postData(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse.payload);
    });

    const req = httpMock.expectOne(environment.api.zipCode);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(mockRequest));

    req.flush(mockResponse);
  });
});
