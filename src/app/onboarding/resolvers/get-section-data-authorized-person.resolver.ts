import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { CheckpointService } from '../../shared/services/checkpoint.service';
import { OnboardingService } from '../services/onboarding.service';
import { CurrentOnboardingInfo } from '../models/current-onboarding';
import { AuthorizedPersonSignalService } from '../services/checkpoint/authorized-persona-signal.service';
import { authorizedPersonMapperQueryMaint, mapAuthorizedPersonsToData } from '../services/mappers/authorized-person.mapper';

@Injectable({
  providedIn: 'root'
})
export class GetSectionDataAuthorizedPersonResolver implements Resolve<any> {

  private readonly onboardingService       = inject(OnboardingService);
  private readonly checkpointService       = inject(CheckpointService);
  private readonly authPersonSignalService = inject(AuthorizedPersonSignalService);

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const currentOnboarding: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
    if (currentOnboarding.isOnboarding && !this.authPersonSignalService.isDataRequested()) {

      return this.checkpointService.getSection(['authorized-person']).pipe(
        map((response: any) => {
          this.authPersonSignalService.setData(
            mapAuthorizedPersonsToData(response['checkpoints'][0]['data']['authorizedPerson'])
          );
          return true;
        }),
        catchError((err: any) => {
          console.log('Error retrieving \"authorized-person\" data section. ()');
          console.log(err);
          return of(null);
        })
      );

    } else if (currentOnboarding.isMaintenance && !this.authPersonSignalService.isDataRequested()) {

      return this.checkpointService.getMaintenanceSectionByPersonaFisica(['authorized-person']).pipe(
          map((response: any) => {
              this.authPersonSignalService.setData(
                authorizedPersonMapperQueryMaint(response['checkpoints'][0]['data']['authorizedPerson'])
              );
              return true;
          }),
          catchError((err: any) => {
              console.log('Error retrieving \"authorized-person\" data section (Mantto.).');
              console.log(err);
              return of(null);
          })
        );

      } else {
      return of(null);
    }
  }
}