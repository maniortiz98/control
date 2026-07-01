// import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { HttpClientService, HttpRequestOptions } from './http-client.service';
// import { OnboardingService } from '../../onboarding/services/onboarding.service';

// describe('HttpClientService', () => {
//   let service: HttpClientService;
//   let httpMock: HttpTestingController;
//   let onboardingServiceSpy: jasmine.SpyObj<OnboardingService>;

//   beforeEach(() => {
//     const httpClientSpy = jasmine.createSpyObj('HttpClientService', ['get', 'post', 'put', 'delete']);
//     onboardingServiceSpy = jasmine.createSpyObj('OnboardingService', ['getCurrentInfo']);

//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [
//         HttpClientService, // Use the actual implementation
//         { provide: OnboardingService, useValue: onboardingServiceSpy }
//       ]
//     });
//     service = TestBed.inject(HttpClientService);
//     httpMock = TestBed.inject(HttpTestingController);
//   });

//   afterEach(() => {
//     httpMock.verify();
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should perform a GET request', () => {
//     const testUrl = '/test';
//     const mockResponse = { data: 'test' };

//     service.get(testUrl).subscribe(response => {
//       expect(response).toEqual(mockResponse);
//     });

//     const req = httpMock.expectOne(testUrl);
//     expect(req.request.method).toBe('GET');
//     req.flush(mockResponse);
//   });

//   it('should perform a POST request', () => {
//     const testUrl = '/test';
//     const mockBody = { key: 'value' };
//     const mockResponse = { success: true };

//     service.post(testUrl, mockBody).subscribe(response => {
//       expect(response).toEqual(mockResponse);
//     });

//     const req = httpMock.expectOne(testUrl);
//     expect(req.request.method).toBe('POST');
//     expect(req.request.body).toEqual(mockBody);
//     req.flush(mockResponse);
//   });

//   it('should perform a PUT request', () => {
//     const testUrl = '/test';
//     const mockBody = { key: 'value' };
//     const mockResponse = { success: true };

//     service.put(testUrl, mockBody).subscribe(response => {
//       expect(response).toEqual(mockResponse);
//     });

//     const req = httpMock.expectOne(testUrl);
//     expect(req.request.method).toBe('PUT');
//     expect(req.request.body).toEqual(mockBody);
//     req.flush(mockResponse);
//   });

//   it('should perform a DELETE request', () => {
//     const testUrl = '/test';
//     const mockResponse = { success: true };

//     service.delete(testUrl).subscribe(response => {
//       expect(response).toEqual(mockResponse);
//     });

//     const req = httpMock.expectOne(testUrl);
//     expect(req.request.method).toBe('DELETE');
//     req.flush(mockResponse);
//   });

//   it('should create options with default headers', () => {
//     const options: HttpRequestOptions = {};
//     const result = (service as any).createOptions(options);

//     expect(result.headers.get('Content-Type')).toBe('application/json');
//     expect(result.headers.get('Accept')).toBe('application/json');
//   });

//   it('should merge custom headers and params', () => {
//     const options: HttpRequestOptions = {
//       headers: { Authorization: 'Bearer token' },
//       params: { search: 'query' }
//     };
//     const result = (service as any).createOptions(options);

//     expect(result.headers.get('Authorization')).toBe('Bearer token');
//     expect(result.params.get('search')).toBe('query');
//   });
// });
