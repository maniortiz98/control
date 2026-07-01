import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CheckpointService } from '../../shared/services/checkpoint.service';
import { OnboardingService } from '../services/onboarding.service';
import { CurrentOnboardingInfo } from '../models/current-onboarding';
import { TaxProfileService } from '../../shared/services/storage-services/tax-profile.service';
import { mapToCheckpointToSignalTaxProfile } from '../services/mappers/maintenance/fiscal-profile-mapper';

@Injectable({
  providedIn: 'root'
})
export class GetSectionDataTaxProfileResolver implements Resolve<any> {

  private readonly onboardingService = inject(OnboardingService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly taxProfileService = inject(TaxProfileService);

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const currentOnboarding: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
    if (currentOnboarding.isMaintenance && !this.taxProfileService.isRequested()) {
      return this.checkpointService.getMaintenanceSectionByPersonaFisica(['tax-profile']).pipe(
        map((response: any) => {
          this.taxProfileService.setItem(mapToCheckpointToSignalTaxProfile(response['checkpoints'][0]['data']));
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

