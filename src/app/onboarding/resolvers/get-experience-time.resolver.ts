import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CatalogsService } from '../../shared/services/catalogs.service';
import { catchError, Observable, of } from 'rxjs';
import { OnboardingService } from '../services/onboarding.service';
import { ExperienceTimeResponse } from '../models/experience-time';

@Injectable({
  providedIn: 'root'
})
export class GetExperienceTimeCatalogResolver implements Resolve<any> {
  constructor(
    private readonly catalogsService: CatalogsService,
    private readonly onboardingService: OnboardingService,
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ExperienceTimeResponse[]> {
    const personType = this.onboardingService.currentInfo().personType === 'PF' ? '1' : '2';
    return this.catalogsService.getExperienceTime( { idTipoPersona: personType}).pipe(
      catchError((error: any) => {
        console.error('Error al cargar catálogo.', error);
        return of([]);
      })
    );
  }
}
