import { inject, Injectable, signal } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CheckpointService } from '../../shared/services/checkpoint.service';
import { OnboardingService } from '../services/onboarding.service';
import { CurrentOnboardingInfo } from '../models/current-onboarding';

import { GeneralInfoStorageService } from '../../shared/services/storage-services/general-info-storage.service';
import { checkpointMantToGeneralInfo } from '../services/mappers/maintenance/general-info-mant-mapper';
import { PhoneType } from '../models/phone-type';
import { Countries } from '../models/country';
import { IdentificationType } from '../models/identification-type';
import { CatalogsService } from '../../shared/services/catalogs.service';

@Injectable({
  providedIn: 'root'
})
export class GetSectionDataGeneralInfoResolver implements Resolve<any> {

  private readonly onboardingService = inject(OnboardingService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly generalInfoStrorage = inject(GeneralInfoStorageService);
  private readonly catalogsService = inject(CatalogsService);

  phoneTypes = signal<Array<PhoneType>>([]);
  countries = signal<Array<Countries>>([]);
  identifications = signal<Array<IdentificationType>>([]);

  constructor() { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const currentOnboarding: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
    this.catalogsService.getCountry({ land: [] }).subscribe(c => {
      this.countries.set(c);
    });
    this.catalogsService.getPhoneType({ telephoneTypeIds: [] }).subscribe(c => {
      this.phoneTypes.set(c);
    });
    this.catalogsService.getIdentificationType({ types: [] }).subscribe(c => {
      this.identifications.set(c);
    });
    if (currentOnboarding.isMaintenance) {
      return this.checkpointService.getMaintenanceSectionByPersonaFisica(['general-information']).pipe(
        map(async (response: any) => {
          const info = await checkpointMantToGeneralInfo(response['checkpoints'][0]['data'], this.phoneTypes(), this.countries(), this.identifications());
          info ? this.generalInfoStrorage.setFullSectionSingal(info) : console.log('No hay info capturada previamente para datos generales');
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

