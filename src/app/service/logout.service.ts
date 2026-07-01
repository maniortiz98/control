import { Injectable, inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { LoadingService } from '../shared/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  private msalService = inject(MsalService);
  private loadingService = inject(LoadingService);

  logout(): void {
    this.loadingService.show();

    this.msalService.logoutRedirect({
      postLogoutRedirectUri: window.location.origin,
    });
  }
}
