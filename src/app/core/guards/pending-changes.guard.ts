import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanDeactivate, GuardResult, MaybeAsync, RouterStateSnapshot } from '@angular/router';
import { CanComponentDeactivate } from '../interfaces/can-deactivate';
import { ModalNotificationComponent } from '../../shared/components/modals/modal-notification/modal-notification.component';
import { map } from 'rxjs';
import { UnsavedChangesService } from '../services/unsaved-changes.service';
import { OnboardingService } from '../../onboarding/services/onboarding.service';

@Injectable({providedIn: 'root'})
export class PendingChangesGuard implements CanDeactivate<CanComponentDeactivate> {

  private readonly dialog = inject(MatDialog);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly onboardingService = inject(OnboardingService);

  canDeactivate(component: CanComponentDeactivate, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot): MaybeAsync<GuardResult> {

    if ( !this.unsavedChangesService.hasUnsavedChanges) {
      return true;
    }

    return this.dialog.open(ModalNotificationComponent, {
      width: '530px',
      disableClose: true,
      data: {
        title: 'Tiene cambios sin guardar, ¿Desea salir?',
        btnAccept: 'Salir',
        btnDeny: 'Cancelar',
      },
      panelClass: 'custom-dialog'
    }).afterClosed().pipe(
      map((result: {value: boolean; message: any}) => {
        const isCurrentOnboarding = currentState.url.includes('/onboarding/new-customer');
        const isNextOnboarding = nextState.url.includes('/onboarding/new-customer');
        if ( result.value ) {
          if ( !isCurrentOnboarding || !isNextOnboarding ) {
            this.onboardingService.clearOnboardingInfo();
            this.onboardingService.restoreInitialTabs();
          }
          this.unsavedChangesService.setUnsavedChanges(false);
        } else {
          if ( Object.keys(result).length === 0 ) result = { value: false, message: undefined };
          if ( isCurrentOnboarding && isNextOnboarding ) {
            this.onboardingService.restoreTabPosition();
          }
        }
        return result.value;
      })
    );
  }
}
