import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CheckpointService } from '../../shared/services/checkpoint.service';
import { OnboardingService } from '../services/onboarding.service';
import { CurrentOnboardingInfo } from '../models/current-onboarding';
import { SpouseService } from '../../shared/services/storage-services/spouse.service';
import { mapToCheckpointToSignalSpouse } from '../services/mappers/maintenance/spouse-mapper';

@Injectable({
  providedIn: 'root'
})
export class GetSectionDataSpouseResolver implements Resolve<any> {

  private readonly onboardingService = inject(OnboardingService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly spouseService = inject(SpouseService);

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const currentOnboarding: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
    if (currentOnboarding.isMaintenance && !this.spouseService.isRequested()) {
      return this.checkpointService.getMaintenanceSectionByPersonaFisica(['spouse-data']).pipe(
        map((response: any) => {
          this.spouseService.setItem(mapToCheckpointToSignalSpouse(response['checkpoints'][0]['data']));
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

