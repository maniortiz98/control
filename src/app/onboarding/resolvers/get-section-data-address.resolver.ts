import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CheckpointService } from '../../shared/services/checkpoint.service';
import { OnboardingService } from '../services/onboarding.service';
import { CurrentOnboardingInfo } from '../models/current-onboarding';
import { AddressesService } from '../../shared/services/storage-services/addresses.service';
import { mapToSignalAddress } from '../services/mappers/response/address';
import { mapToSignalAddressM } from '../services/mappers/maintenance/respnse/address';

@Injectable({
  providedIn: 'root'
})
export class GetSectionDataAddressResolver implements Resolve<any> {

  private readonly onboardingService = inject(OnboardingService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly addressesService = inject(AddressesService);

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const currentOnboarding: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
    if (currentOnboarding.isOnboarding && !this.addressesService.isRequested()) {
      return this.checkpointService.getSection(['address']).pipe(
        map((response: any) => {
          this.addressesService.set(mapToSignalAddress(response['checkpoints'][0]['data']));
          return true;
        }),
        catchError((err: any) => {
          console.log(err);
          return of(null);
        })
      );
    } else if (currentOnboarding.isMaintenance && !this.addressesService.isRequested()) {
      return this.checkpointService.getMaintenanceSectionByPersonaFisica(['address']).pipe(
        map((response: any) => {
          this.addressesService.set(mapToSignalAddressM(response['checkpoints'][0]['data']));
          this.addressesService.setCopy(this.addressesService.get() ?? { addressList: [] });
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

