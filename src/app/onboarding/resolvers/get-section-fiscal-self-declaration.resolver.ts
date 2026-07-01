import { inject, Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CheckpointService } from '../../shared/services/checkpoint.service';
import { OnboardingService } from '../services/onboarding.service';
import { CurrentOnboardingInfo } from '../models/current-onboarding';
import { FiscalSelfDeclarationDataClientService } from '../../shared/services/storage-services/fiscal-self-declaration.service';
import { mapResToSignalFiscalSelfDeclaration } from '../services/mappers/response/fiscal-self-declaration-mapper';
import { mapResToSignalFiscalSelfDeclarationM } from '../services/mappers/maintenance/respnse/fiscal-self-declaration-mapper';

@Injectable({
  providedIn: 'root',
})
export class GetSectionDataFiscalSelfDeclarationResolver implements Resolve<any> {
  private readonly onboardingService = inject(OnboardingService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly fiscalSelfService = inject(
    FiscalSelfDeclarationDataClientService,
  );

  constructor() { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<any> {
    const currentOnboarding: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
    if (
      currentOnboarding.isOnboarding &&
      !this.fiscalSelfService.isRequested()
    ) {
      return this.checkpointService
        .getSection(
          ['fiscal-self-declaration']
        )
        .pipe(
          map((response: any) => {
            this.fiscalSelfService.setItem(
              mapResToSignalFiscalSelfDeclaration(
                response['checkpoints'][0]['data'],
              ),
            );
            return true;
          }),
          catchError((err: any) => {
            console.log(err);
            return of(null);
          }),
        );
    } else if (
      currentOnboarding.isMaintenance &&
      !this.fiscalSelfService.isRequested()
    ) {
      return this.checkpointService
        .getMaintenanceSectionByPersonaFisica(
          ['fiscal-self-declaration']
        )
        .pipe(
          map((response: any) => {
            this.fiscalSelfService.setItem(
              mapResToSignalFiscalSelfDeclarationM(
                response['checkpoints'][0]['data'],
              ),
            );
            return true;
          }),
          catchError((err: any) => {
            console.log('Error retrieving \"fiscal-self-declaration\" data section (Mantto.).');
            console.log(err);
            return of(null);
          }),
        );
    } else {
      return of(null);
    }
  }
}
