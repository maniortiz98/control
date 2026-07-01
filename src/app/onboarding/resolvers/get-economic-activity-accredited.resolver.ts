import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CatalogsService } from '../../shared/services/catalogs.service';
import { catchError, Observable, of } from 'rxjs';
import { EconomicActivityAccredited } from '../models/economic-activity';

@Injectable({
  providedIn: 'root'
})
export class GetEconomicActivityAccreditedResolver implements Resolve<any> {
  constructor(
    private readonly catalogsService: CatalogsService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<EconomicActivityAccredited[]> {
    return this.catalogsService.getEconomicActivityAccredited({}).pipe(
      catchError((error: any) => {
        console.error('Error al cargar catálogo.', error);
        return of([]);
      })
    );
  }
}
