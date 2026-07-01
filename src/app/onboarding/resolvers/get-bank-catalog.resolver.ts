import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CatalogsService } from '../../shared/services/catalogs.service';
import { catchError, Observable, of } from 'rxjs';
import { Bank } from '../models/bank';
import { CATALOG_NAME, STRINGS } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class GetBankCatalogResolver implements Resolve<any> {
  constructor(
    private readonly catalogsService: CatalogsService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Bank[]> {
    return this.catalogsService.getBank({country: STRINGS.MEXICAN}).pipe(
      catchError((error: any) => {
        console.error('Error al cargar catálogo.', error);
        return of([]);
      })
    );
  }
}
