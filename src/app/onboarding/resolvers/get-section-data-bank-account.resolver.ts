import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CheckpointService } from '../../shared/services/checkpoint.service';
import { OnboardingService } from '../services/onboarding.service';
import { CurrentOnboardingInfo } from '../models/current-onboarding';
import { BankAccountCheckpointSignalService } from '../services/checkpoint/bank-account-signal.service';
import { bankAccountMapperQueryMaint, mapBankAccounts } from '../services/mappers/bank-account.mapper';

@Injectable({
  providedIn: 'root'
})
export class GetSectionDataBankAccountResolver implements Resolve<any> {

  private readonly onboardingService = inject(OnboardingService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly bankAccountCheckpointSignalService = inject(BankAccountCheckpointSignalService);

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const currentOnboarding: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();

    if (currentOnboarding.isOnboarding && !this.bankAccountCheckpointSignalService.isDataRequested()) {
      return this.checkpointService.getSection(['bank-account']).pipe(
        map((response: any) => {
          this.bankAccountCheckpointSignalService.setData(mapBankAccounts(response['checkpoints'][0]['data']));
          return true;
        }),
        catchError((err: any) => {
          console.log('Error retrieving \"bank-account\" data section.');
          console.log(err);
          return of(null);
        })
      );
    } else if (currentOnboarding.isMaintenance && !this.bankAccountCheckpointSignalService.isDataRequested()) {

      return this.checkpointService.getMaintenanceSectionByPersonaFisica(['bank-account']).pipe(
              map((response: any) => {
                  this.bankAccountCheckpointSignalService.setData(
                    bankAccountMapperQueryMaint(response['checkpoints'][0]['data']['bankAccounts'])
                  );
                  return true;
              }),
              catchError((err: any) => {
                  console.log('Error retrieving \"bank-account\" data section (Mantto.).');
                  console.log(err);
                  return of(null);
              })
            );
    } else {
      return of(null);
    }
  }
}

