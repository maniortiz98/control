import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CheckpointService } from '../../shared/services/checkpoint.service';
import { OnboardingService } from '../services/onboarding.service';
import { CurrentOnboardingInfo } from '../models/current-onboarding';
import { mapToSignalRealOwner } from '../services/mappers/response/real-owner-mapper';
import { RealOwnerService } from '../../shared/services/storage-services/real-owner.service';
import { mapToSignalRealOwnerMant } from '../services/mappers/maintenance/respnse/real-owner-mapper';

@Injectable({
  providedIn: 'root'
})
export class GetSectionDataRealOwnerResolver implements Resolve<any> {

  private readonly onboardingService = inject(OnboardingService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly realOwnerService = inject(RealOwnerService);

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const currentOnboarding: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
    if (currentOnboarding.isOnboarding && !this.realOwnerService.isRequested()) {
      return this.checkpointService.getSection(['real-owner']).pipe(
        map((response: any) => {
          this.realOwnerService.setItem(mapToSignalRealOwner(response['checkpoints'][0]['data']));
          return true;
        }),
        catchError((err: any) => {
          console.log(err);
          return of(null);
        })
      );
    } else if (currentOnboarding.isMaintenance && !this.realOwnerService.isRequested()) {
      return this.checkpointService.getMaintenanceSectionByPersonaFisica(['real-owner']).pipe(
        map((response: any) => {
          const resInfo = mapToSignalRealOwnerMant(response['checkpoints'][0]['data']);
          this.realOwnerService.setItem(resInfo);
          this.realOwnerService.setItemCopy(resInfo);
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


