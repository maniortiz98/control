import { effect, inject, Injectable } from '@angular/core';
import { HttpClientService } from '../../core/services/http-client.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CustomerOnboardingService } from './customer-onboarding.service';
import { CustomerCurrentOnboardingInfo } from '../models/customer-current-onboarding';

@Injectable({
  providedIn: 'root'
})
export class CustomerContractService {

  private readonly http                = inject(HttpClientService);
  private readonly onboardingService   = inject(CustomerOnboardingService);

  private readonly urls: any = {
    replicateCustomer: environment.api.maintenance.replicateCustomer,
  };

  private currentInfo: CustomerCurrentOnboardingInfo = this.onboardingService.getCurrentInfo();

  /**
   * Constructor
   */
  constructor() {
    effect(() => {
      this.currentInfo = this.onboardingService.getCurrentInfo();
    });
  }

   /**
   * Calls Re Print contacts service.
   *
   */
  callReprintCustomer(): Observable<any> {
    const bp: {clientId: number; } = {
      clientId: Number(this.currentInfo.clientId)
    };
    return this.http.post(this.urls.replicateCustomer, bp);
  }

}
