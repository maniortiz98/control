import { inject, Injectable, signal } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CheckpointService } from '../../shared/services/checkpoint.service';
import { OnboardingService } from '../services/onboarding.service';
import { CurrentOnboardingInfo } from '../models/current-onboarding';
import { checkpointToOperateChangeSection } from '../services/mappers/operate-changes.mappers';
import { OperateChangesStorageService } from '../../shared/services/storage-services/operate-changes-storage.service';
import { checkpointToOperateChangeSectionMant } from '../services/mappers/maintenance/operate-changes-mant-mapper';

@Injectable({
  providedIn: 'root'
})
export class GetSectionDataExchangeOperationResolver implements Resolve<any> {

  private readonly onboardingService = inject(OnboardingService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly operateChangesStorageService = inject(OperateChangesStorageService);

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const currentOnboarding: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
    if (currentOnboarding.isOnboarding && !this.operateChangesStorageService.isRequested()) {

      return this.checkpointService.getSection(['exchange-operation']).pipe(
        map(async (response: any) => {
          const info = checkpointToOperateChangeSection(response['checkpoints'][0]['data']);
          info ? this.operateChangesStorageService.setoperateChanges(info) : console.log('No hay info capturada previamente para opera-cambios');
          return true;
        }),
        catchError((err: any) => {
          console.log(err);
          return of(null);
        })
      );
    } else if(currentOnboarding.isMaintenance && !this.operateChangesStorageService.isRequested()){
      return this.checkpointService.getMaintenanceSectionByPersonaFisica(['exchange-operation']).pipe(
        map(async (response: any) => {
          const info = checkpointToOperateChangeSectionMant(response['checkpoints'][0]['data']);
          info ? this.operateChangesStorageService.setoperateChanges(info) : console.log('No hay info capturada previamente para opera-cambios');
          return true;
        }),
        catchError((err: any) => {
          console.log(err);
          return of(null);
        })
      );
    } else{
      return of(null);
    }
  }
}

