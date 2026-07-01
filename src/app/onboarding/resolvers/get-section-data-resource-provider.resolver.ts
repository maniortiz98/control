import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CheckpointService } from '../../shared/services/checkpoint.service';
import { OnboardingService } from '../services/onboarding.service';
import { CurrentOnboardingInfo } from '../models/current-onboarding';
import { ResourceProviderService } from '../../shared/services/storage-services/resource-provider.service';
import { mapToSignalResourceProvider } from '../services/mappers/response/resources-provider';
import { mapToSignalResourceProviderMant } from '../services/mappers/maintenance/respnse/resources-provider';

@Injectable({
  providedIn: 'root'
})
export class GetSectionDataResourceProviderResolver implements Resolve<any> {

  private readonly onboardingService = inject(OnboardingService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly resourceProviderService = inject(ResourceProviderService);

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const currentOnboarding: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
    if (currentOnboarding.isOnboarding && !this.resourceProviderService.isRequested()) {
      return this.checkpointService.getSection(['resources-provider']).pipe(
        map((response: any) => {
          this.resourceProviderService.setItem(mapToSignalResourceProvider(response['checkpoints'][0]['data']));
          return true;
        }),
        catchError((err: any) => {
          console.log(err);
          return of(null);
        })
      );
    } else if (currentOnboarding.isMaintenance && !this.resourceProviderService.isRequested()) {
      return this.checkpointService.getMaintenanceSectionByPersonaFisica(['resources-provider']).pipe(
        map((response: any) => {
          const resInfo = mapToSignalResourceProviderMant(response['checkpoints'][0]['data']);
          this.resourceProviderService.setItem(resInfo);
          this.resourceProviderService.setItemCopy(resInfo);
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

