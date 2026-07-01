import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CustomerCheckpointService } from '../services/customer-customer-checkpoint-core.service';
import { CustomerOnboardingService } from '../services/customer-onboarding.service';
import { CustomerCurrentOnboardingInfo } from '../models/customer-current-onboarding';
import { CustomerPpeService } from '../services/storage-services/customer-ppe.service';
import { mapToSignalPPE } from '../services/mappers/response/customer-ppe-mapper';

@Injectable()
export class CustomerGetSectionDataPpeResolver implements Resolve<any> {

  private readonly onboardingService = inject(CustomerOnboardingService);
  private readonly checkpointService = inject(CustomerCheckpointService);
  private readonly ppeService = inject(CustomerPpeService);



  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const currentOnboarding: CustomerCurrentOnboardingInfo = (this.onboardingService as any).getCurrentInfo();
    if (currentOnboarding.isOnboarding && !this.ppeService.isRequested()) {
      return this.checkpointService.getSection(['ppe-information'], currentOnboarding.requestId).pipe(
        map((response: any) => {
          this.ppeService.set(mapToSignalPPE(response['checkpoints'][0]['data']));
          return true;
        }),
        catchError((err: any) => {
          console.log(err);
          return of(null);
        })
      );
    } else {
      return of(null);
    }
  }
}




