import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CustomerCheckpointService } from '../services/customer-customer-checkpoint-core.service';
import { CustomerAddressesService } from '../services/storage-services/customer-addresses.service';
import { CustomerOnboardingService } from '../services/customer-onboarding.service';
import { CustomerCurrentOnboardingInfo } from '../models/customer-current-onboarding';
import { mapToSignalAddress } from '../services/mappers/response/customer-address';

@Injectable()
export class CustomerGetSectionDataAddressResolver implements Resolve<any> {

  private readonly onboardingService = inject(CustomerOnboardingService);
  private readonly checkpointService = inject(CustomerCheckpointService);
  private readonly addressesService = inject(CustomerAddressesService);



  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const currentOnboarding: CustomerCurrentOnboardingInfo = (this.onboardingService as any).getCurrentInfo();
    if (currentOnboarding.isOnboarding && !this.addressesService.isRequested()) {
      return this.checkpointService.getSection(['address'], currentOnboarding.requestId).pipe(
        map((response: any) => {
          this.addressesService.set(mapToSignalAddress(response['checkpoints'][0]['data']));
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









