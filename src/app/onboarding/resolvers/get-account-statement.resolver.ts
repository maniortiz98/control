import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CatalogsService } from '../../shared/services/catalogs.service';
import { AccountStatement } from '../models/account-statement';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetAccountStatementResolver implements Resolve<any> {
  constructor(
    private readonly catalogsService: CatalogsService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AccountStatement[]> {
    return this.catalogsService.getAccountStatement({accountStatementsIds: []}).pipe(
      catchError((error: any) => {
        console.error('Error al cargar catálogo.', error);
        return of([]);
      })
    );
  }
}
