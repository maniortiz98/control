import { inject, Injectable, signal } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { CheckpointService } from '../../shared/services/checkpoint.service';
import { OnboardingService } from '../services/onboarding.service';
import { CurrentOnboardingInfo } from '../models/current-onboarding';
import { SignStorageService } from '../../shared/services/storage-services/sign-storage.service';
import { checkpointToSignSection } from '../services/mappers/signature-mapper';
import { CatalogsService } from '../../shared/services/catalogs.service';
import { Countries } from '../models/country';
import { IdentificationType } from '../models/identification-type';
import { PhoneType } from '../models/phone-type';
import { checkpointMantToSignSection } from '../services/mappers/maintenance/signature-mapper-mant';
import { ZipCodeService } from '../../shared/services/zip-code.service';

@Injectable({
  providedIn: 'root'
})
export class GetSectionDataSignatureResolver implements Resolve<any> {

  private readonly onboardingService = inject(OnboardingService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly signStorageService = inject(SignStorageService);
  private readonly catalogsService = inject(CatalogsService);
  private readonly zipCodeService = inject(ZipCodeService);

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
    if (currentOnboarding.isOnboarding && !this.signStorageService.isRequested()) {
      return this.checkpointService.getSection(['signature']).pipe(
        map(async (response: any) => {
          const info = await checkpointToSignSection(response['checkpoints'][0]['data'], this.phoneTypes(), this.countries(), this.identifications(), this.zipCodeService);
          this.signStorageService.setSingSection(info);
          return true;
        }),
        catchError((err: any) => {
          console.log(err);
          return of(null);
        })
      );
    } else if(currentOnboarding.isMaintenance && !this.signStorageService.isRequested()){
      return this.checkpointService.getMaintenanceSectionByPersonaFisica(['signature']).pipe(
        map(async (response: any) => {
          const info = await checkpointMantToSignSection(response['checkpoints'][0]['data'], this.phoneTypes(), this.countries(), this.identifications(), this.zipCodeService);
          this.signStorageService.setSingSection(info);
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

