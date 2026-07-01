import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CheckpointService } from '../../shared/services/checkpoint.service';
import { OnboardingService } from '../services/onboarding.service';
import { CurrentOnboardingInfo } from '../models/current-onboarding';
import { CreditDataService } from '../../shared/services/storage-services/credit-data.service';
import { transformCheckpointToCreditData } from '../services/mappers/maintenance/credit-data.mapper';

@Injectable({
    providedIn: 'root'
})
export class GetSectionCreditDataResolver implements Resolve<any> {

    private readonly onboardingService = inject(OnboardingService);
    private readonly checkpointService = inject(CheckpointService);
    private readonly creditDataService = inject(CreditDataService);

   
    constructor() { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
       const currentOnboarding: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();

        if (currentOnboarding.isMaintenance && !this.creditDataService.isRequested()) {
            return this.checkpointService.getMaintenanceSectionByPersonaFisica(['credit-information']).pipe(
                map((response: any) => {
                    this.creditDataService.setItem(transformCheckpointToCreditData(response['checkpoints'][0]['data']));
                    return true;
                }),
                catchError((err: any) => {
                    console.log('Error retrieving \"credit-information\" data section (Mantto.).');
                    console.log(err);
                    return of(null);
                })
            );
        } else {
            return of(null);
        }
    }
}

