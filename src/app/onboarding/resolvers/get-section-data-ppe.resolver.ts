import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CheckpointService } from '../../shared/services/checkpoint.service';
import { OnboardingService } from '../services/onboarding.service';
import { CurrentOnboardingInfo } from '../models/current-onboarding';
import { PpeService } from '../../shared/services/storage-services/ppe.service';
import { mapToSignalPPE } from '../services/mappers/response/ppe-mapper';
import { mapToSignalPPEm } from '../services/mappers/maintenance/respnse/ppe-mapper';

@Injectable({
  providedIn: 'root'
})
export class GetSectionDataPpeResolver implements Resolve<any> {

  private readonly onboardingService = inject(OnboardingService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly ppeService = inject(PpeService);

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const currentOnboarding: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
    if (currentOnboarding.isOnboarding && !this.ppeService.isRequested()) {
      return this.checkpointService.getSection(['ppe-information']).pipe(
        map((response: any) => {
          this.ppeService.set(mapToSignalPPE(response['checkpoints'][0]['data']));
          return true;
        }),
        catchError((err: any) => {
          console.log(err);
          return of(null);
        })
      );
    } else if (currentOnboarding.isMaintenance && !this.ppeService.isRequested()) {
      return this.checkpointService.getMaintenanceSectionByPersonaFisica(['ppe-information']).pipe(
          map((response: any) => {
            this.ppeService.set(mapToSignalPPEm(response['checkpoints'][0]['data']));
            this.ppeService.setCopy(this.ppeService.get() ?? {
              ppe: false,
              fppe: 'no',
              dppe: 'no',
              sappe: 'no',
              dataClientFamilyPPE: [],
              dataClientDepPPE: [],
              dataClientSocAndAssoPPE: []
            });
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
