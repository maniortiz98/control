import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CheckpointService } from '../../shared/services/checkpoint.service';
import { OnboardingService } from '../services/onboarding.service';
import { CurrentOnboardingInfo } from '../models/current-onboarding';
import { PersonalInterviewService } from '../../shared/services/storage-services/personal-interview.service';
import { mapResToPersonalInterview } from '../services/mappers/response/personal-interview-mapper';

@Injectable({
  providedIn: 'root'
})
export class GetSectionDataInterviewResolver implements Resolve<any> {

  private readonly onboardingService = inject(OnboardingService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly personalInterviewService = inject(PersonalInterviewService);

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const currentOnboarding: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
    if (currentOnboarding.isOnboarding && !this.personalInterviewService.isRequested()) {
      return this.checkpointService.getSection(['personal-interview']).pipe(
        map((response: any) => {
          this.personalInterviewService.setItem(mapResToPersonalInterview(response['checkpoints'][0]['data']));
          return true;
        }),
        catchError((err: any) => {
          console.log(err);
          return of(null);
        })
      );
    } else if (
      currentOnboarding.isMaintenance &&
      !this.personalInterviewService.isRequested()
    ) {
      return this.checkpointService
        .getMaintenanceSectionByPersonaFisica(
          ['personal-interview']
        )
        .pipe(
          map((response: any) => {
            this.personalInterviewService.setItem(
              mapResToPersonalInterview(
                response['checkpoints'][0]['data'],
              ),
            );
          }),
          catchError((err: any) => {
            console.log('Error retrieving \"personal-interview\" data section (Mantto.).');
            console.log(err);
            return of(null);
          }),
        );
    } else {
      return of(null);
    }
  }
}

