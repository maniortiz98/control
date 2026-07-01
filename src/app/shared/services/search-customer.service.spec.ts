import { TestBed } from '@angular/core/testing';
import { HttpClientService } from '../../core/services/http-client.service';
import { SearchCustomerService } from './search-customer.service'; // Adjust the import according to your file structure
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

describe('SearchCustomerService', () => {
    let service: SearchCustomerService;
    let httpClientService: jasmine.SpyObj<HttpClientService>;

    beforeEach(() => {
        const httpClientSpy = jasmine.createSpyObj('HttpClientService', ['post']);

        TestBed.configureTestingModule({
            providers: [
                SearchCustomerService,
                { provide: HttpClientService, useValue: httpClientSpy }
            ]
        });

        service = TestBed.inject(SearchCustomerService);
        httpClientService = TestBed.inject(HttpClientService) as jasmine.SpyObj<HttpClientService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call HttpClientService.post with the correct URL and data', () => {

        const testData = { name: 'John Doe' };
        const apiUrl = environment.api.searchCustomer;
        httpClientService.post.and.returnValue(of({})); // Mock the post method to return an observable

        service.searchCustomer(testData).subscribe();

        expect(httpClientService.post).toHaveBeenCalledWith(apiUrl, testData);
    });

    it('should return an observable from searchCustomer', () => {
        const testData = { name: 'Jane Doe' };
        const mockResponse = { success: true };
        httpClientService.post.and.returnValue(of(mockResponse));

        service.searchCustomer(testData).subscribe(response => {
            expect(response).toEqual(mockResponse);
        });

        expect(httpClientService.post).toHaveBeenCalled();
    });

    // it('should handle error response correctly', () => {
    //     const testData = { name: 'Error Test' };
    //     const mockError = new Error('Error occurred');
    //     httpClientService.post.and.returnValue(of(mockError));

    //     service.searchCustomer(testData).subscribe({
    //         next: () => fail('expected an error, not customer data'),
    //         error: (error) => {
    //             expect(error).toEqual(mockError);
    //         }
    //     });

    //     expect(httpClientService.post).toHaveBeenCalled();
    // });
});