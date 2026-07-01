import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CheckpointService } from '../../shared/services/checkpoint.service';
import { OnboardingService } from '../services/onboarding.service';
import { CurrentOnboardingInfo } from '../models/current-onboarding';
import { BeneficiariesSignalService } from '../services/checkpoint/beneficiaries-signal.service';
import { beneficiariesMapperQueryMaint, mapToSignalBeneficiaries } from '../services/mappers/beneficiaries.mapper';

@Injectable({
  providedIn: 'root'
})
export class GetSectionDataBeneficiariesResolver implements Resolve<any> {

  private readonly onboardingService = inject(OnboardingService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly beneficiariesSignalService = inject(BeneficiariesSignalService);

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const currentOnboarding: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
    if (currentOnboarding.isOnboarding && !this.beneficiariesSignalService.isRequested()) {
      return this.checkpointService.getSection(['beneficiaries']).pipe(
        map((response: any) => {
          this.beneficiariesSignalService.setBeneficiaries(
            mapToSignalBeneficiaries(response['checkpoints'][0]['data']['beneficiaries'])
          );
          return true;
        }),
        catchError((err: any) => {
          console.log(err);
          return of(null);
        })
      );
    } else if (currentOnboarding.isMaintenance && !this.beneficiariesSignalService.isRequested()) {
        return this.checkpointService.getMaintenanceSectionByPersonaFisica(['beneficiaries']).pipe(
            map((response: any) => {
                this.beneficiariesSignalService.setBeneficiaries(
                  beneficiariesMapperQueryMaint(response['checkpoints'][0]['data']['beneficiaries'])
                );
                return true;
            }),
            catchError((err: any) => {
                console.log('Error retrieving \"beneficiaries\" data section (Mantto.).');
                console.log(err);
                return of(null);
            })
            );
    } else {
      return of(null);
    }
  }
}
