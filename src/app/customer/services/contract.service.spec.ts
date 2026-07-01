import { TestBed } from "@angular/core/testing";
import { of } from "rxjs";
import { HttpClientService } from "../../core/services/http-client.service";
import { CustomerContractService } from "./contract.service";
import { CustomerOnboardingService } from "./customer-onboarding.service";

describe('CustomerContractService', () => {

  let service: CustomerContractService;
  let mockHttp: jasmine.SpyObj<HttpClientService>;
  let mockOnboarding: jasmine.SpyObj<CustomerOnboardingService>;

  const mockInfo = {
    clientId: '123'
  } as any;

  beforeEach(() => {
    mockHttp = jasmine.createSpyObj('HttpClientService', ['post']);
    mockOnboarding = jasmine.createSpyObj('CustomerOnboardingService', ['getCurrentInfo']);

    mockOnboarding.getCurrentInfo.and.returnValue(mockInfo);

    TestBed.configureTestingModule({
      providers: [
        CustomerContractService,
        { provide: HttpClientService, useValue: mockHttp },
        { provide: CustomerOnboardingService, useValue: mockOnboarding }
      ]
    });

    service = TestBed.inject(CustomerContractService);

    (service as any).urls = {
      replicateCustomer: '/mock-url'
    };
  });

  it('debe inicializar currentInfo desde onboardingService', () => {
    expect(mockOnboarding.getCurrentInfo).toHaveBeenCalled();
    expect((service as any).currentInfo.clientId).toBe('123');
  });

  it('debe llamar HTTP POST con clientId correcto', (done) => {
    const response = { ok: true };

    mockHttp.post.and.returnValue(of(response));

    service.callReprintCustomer().subscribe(res => {

      expect(mockHttp.post).toHaveBeenCalledWith(
        '/mock-url',
        { clientId: 123 }
      );

      expect(res).toEqual(response);

      done();
    });
  });

  it('debe convertir clientId a number', (done) => {
    mockOnboarding.getCurrentInfo.and.returnValue({ clientId: '123' } as any);
    service = TestBed.inject(CustomerContractService);

    (service as any).urls = {
      replicateCustomer: '/mock-url'
    };

    mockHttp.post.and.returnValue(of({}));

    service.callReprintCustomer().subscribe(() => {
      expect(mockHttp.post).toHaveBeenCalledWith(
        '/mock-url',
        { clientId: 123 }
      );
      done();
    });
  });

});
