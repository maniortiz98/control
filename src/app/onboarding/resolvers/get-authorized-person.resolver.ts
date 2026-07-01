import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CatalogsService } from '../../shared/services/catalogs.service';
import { catchError, Observable, of } from 'rxjs';
import { AuthorizedPersonCatalog } from '../models/authorized-person-page-data';

@Injectable({
  providedIn: 'root'
})
export class GetAuthorizedPersonCatalogResolver implements Resolve<any> {
  constructor(
    private readonly catalogsService: CatalogsService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AuthorizedPersonCatalog[]> {
    return this.catalogsService.getAuthorizedPerson({authorizedPersonsIds: [""]}).pipe(
      catchError((error: any) => {
        console.error('Error al cargar catálogo.', error);
        return of([]);
      })
    );
  }
}
