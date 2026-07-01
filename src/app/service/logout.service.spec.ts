import { TestBed } from '@angular/core/testing';
import { MsalService } from '@azure/msal-angular';
import { LoadingService } from '../shared/services/loading.service';
import { LogoutService } from './logout.service';

describe('LogoutService', () => {
  let service: LogoutService;
  let msalService: jasmine.SpyObj<MsalService>;
  let loadingService: jasmine.SpyObj<LoadingService>;

  beforeEach(() => {
    msalService = jasmine.createSpyObj<MsalService>('MsalService', ['logoutRedirect']);
    loadingService = jasmine.createSpyObj<LoadingService>('LoadingService', ['show']);

    TestBed.configureTestingModule({
      providers: [
        LogoutService,
        { provide: MsalService, useValue: msalService },
        { provide: LoadingService, useValue: loadingService },
      ],
    });

    service = TestBed.inject(LogoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show the loading indicator before redirecting logout', () => {
    service.logout();

    expect(loadingService.show).toHaveBeenCalled();
    expect(msalService.logoutRedirect).toHaveBeenCalledWith({
      postLogoutRedirectUri: window.location.origin,
    });
    expect(loadingService.show).toHaveBeenCalledBefore(msalService.logoutRedirect);
  });
});
