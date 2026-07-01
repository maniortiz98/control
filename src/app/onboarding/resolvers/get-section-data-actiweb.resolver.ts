import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CheckpointService } from '../../shared/services/checkpoint.service';
import { OnboardingService } from '../services/onboarding.service';
import { CurrentOnboardingInfo } from '../models/current-onboarding';
import { ActiwebService } from '../../shared/services/actiweb.service';

@Injectable({
  providedIn: 'root'
})
export class GetSectionDataActiwebResolver implements Resolve<any> {

  private readonly onboardingService = inject(OnboardingService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly actiwebSignal     = inject(ActiwebService);

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const currentOnboarding: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
    if (currentOnboarding.isMaintenance && !this.actiwebSignal.isDataRequested()) {
      return this.checkpointService.getMaintenanceSectionByPersonaFisica(['actiweb']).pipe(
        map((response: any) => {
            this.actiwebSignal.setItem(response['checkpoints'][0]['data']);
            return true;
        }),
        catchError((err: any) => {
            console.log('Error retrieving \"actiweb\" data section (Mantto.).');
            console.log(err);
            return of(null);
        })
      );
    } else {
      return of(null);
    }
  }
}

