import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CatalogsService } from '../../shared/services/catalogs.service';
import { catchError, Observable, of } from 'rxjs';
import { AccountType } from '../models/account-type';

@Injectable({
  providedIn: 'root'
})
export class GetAccountTypeResolver implements Resolve<any> {
  constructor(
    private readonly catalogsService: CatalogsService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AccountType[]> {
    return this.catalogsService.getAccountType({ accountTypeIds: []}).pipe(
      catchError((error: any) => {
        console.error('Error al cargar catálogo.', error);
        return of([]);
      })
    );
  }
}
