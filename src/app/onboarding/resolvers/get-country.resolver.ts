import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CatalogsService } from '../../shared/services/catalogs.service';
import { catchError, Observable, of } from 'rxjs';
import { Countries } from '../models/country';

@Injectable({
  providedIn: 'root'
})
export class GetCountryCatalogResolver implements Resolve<any> {
  constructor(
    private readonly catalogsService: CatalogsService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Countries[]> {
    return this.catalogsService.getCountry({land: []}).pipe(
      catchError((error: any) => {
        console.error('Error al cargar catálogo.', error);
        return of([]);
      })
    );
  }
}
