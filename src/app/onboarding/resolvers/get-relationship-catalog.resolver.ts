import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CatalogsService } from '../../shared/services/catalogs.service';
import { catchError, Observable, of } from 'rxjs';
import { Relationships } from '../models/relationships';

@Injectable({
  providedIn: 'root'
})
export class GetRelationShipCatalogResolver implements Resolve<any> {
  constructor(
    private readonly catalogsService: CatalogsService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Relationships[]> {
    return this.catalogsService.getRelationships({bool: '', clientId: '', language: ''}).pipe(
      catchError((error: any) => {
        console.error('Error al cargar catálogo.', error);
        return of([]);
      })
    );
  }
}
