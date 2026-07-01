import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CheckpointService } from '../../shared/services/checkpoint.service';
import { OnboardingService } from '../services/onboarding.service';
import { CurrentOnboardingInfo } from '../models/current-onboarding';
import { AdditionalInfoService } from '../../shared/services/storage-services/additional-info.service';
import { additionalInfoCheckpointToSection } from '../services/mappers/maintenance/additional-info-mapper';

@Injectable({
  providedIn: 'root'
})
export class GetSectionDataAdditionalInfoResolver implements Resolve<any> {

  private readonly onboardingService = inject(OnboardingService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly additionalInfoService = inject(AdditionalInfoService);

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const currentOnboarding: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
    if (currentOnboarding.isMaintenance && !this.additionalInfoService.isRequested()) {
      return this.checkpointService.getMaintenanceSectionByPersonaFisica(['additional-information']).pipe(
        map((response: any) => {
          this.additionalInfoService.setItem(additionalInfoCheckpointToSection(response['checkpoints'][0]['data']));
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

