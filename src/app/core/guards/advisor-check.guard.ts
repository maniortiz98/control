import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CatalogsService } from '../../shared/services/catalogs.service';
import { Advisor } from '../../onboarding/models/catalogs/advisor';
import { NotificationModalService } from '../../shared/services/notification-modal.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({providedIn: 'root'})
export class AdvisorCheckGuard implements CanActivate {

  private readonly authService  = inject(AuthService);
  private readonly catService   = inject(CatalogsService);
  private readonly modalService = inject(NotificationModalService);
  private readonly localService = inject(LocalStorageService);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    void route;
    void state;
    this.localService.setCatalog('advisor', []);
    const user = this.authService.getUserInfo()();
    return this.catService.getAdvisor().pipe(
      map((result: Advisor[]) => {
        let found = result.some((item: Advisor) => item.advisorCode === user.employeeId);
        if ( !found ) {
          this.modalService.warning({
          title: 'No es posible generar clientes porque el usuario actual no cuenta con un registro activo como asesor dentro de Spine.',
          afterCopyMessages: [
            `Por favor, valida que tu perfil se encuentre correctamente configurado o solicita el alta correspondiente
            para continuar con la operación.`
          ],
          btnAccept: 'Aceptar',
          forceDisableClose: true,
        });
        }
        return found;
      })
    );
  }
}
