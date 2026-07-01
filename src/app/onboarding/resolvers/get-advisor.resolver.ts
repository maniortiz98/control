import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CatalogsService } from '../../shared/services/catalogs.service';
import { catchError, Observable, of } from 'rxjs';
import { Advisor } from '../models/catalogs/advisor';

@Injectable({
  providedIn: 'root'
})
export class GetAdvisorCatalogResolver implements Resolve<any> {
  constructor(
    private readonly catalogsService: CatalogsService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Advisor[]> {
    return this.catalogsService.getAdvisor().pipe(
      catchError((error: any) => {
        console.error('Error al cargar catálogo.', error);
        return of([]);
      })
    );
  }
}