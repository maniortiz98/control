import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PermissionRolService } from '../../../core/services/rol.service';
import { PermissionMenuButton } from '../../../core/services/menu_role';
import { OnboardingService } from '../../services/onboarding.service';

@Component({
  selector: 'app-app',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  private readonly router      = inject(Router);
  private readonly route       = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly rolService  = inject(PermissionRolService);
  private readonly _onboarding = inject(OnboardingService);

  readonly userinfo = this.authService.getUserInfo();

  buttonsPermission: PermissionMenuButton;

  constructor() {
    if ( !this.rolService.validRole() ) {
      this.router.navigate(['logout']);
    }

    this._onboarding.clearOnboardingInfo();
    this._onboarding.restoreInitialTabs();

    this.buttonsPermission = this.rolService.getMenuButtonPermission();
  }

  open(type: string): void {
    if ('new' === type) {
      this.router.navigate(['new-contract'], { relativeTo: this.route });
    } else if ('customer' === type) {
      this.router.navigate(['customer/new-contract']);
    } else if ('search' === type) {
      this.router.navigate(['search'], {relativeTo: this.route});
    } else if ( 'prospective' === type ) {
      this.router.navigate(['search-id'], {relativeTo: this.route});
    } else if ( 'inbox' === type ) {
      this.router.navigate(['workflow']);
    } else if ( 'maintenance' === type ) {
      this.router.navigate(['maintenance']);
    } else if ( 'transfer' === type ) {
      this.router.navigate(['maintenance/advisors-transfer']);
    } else if ( 'trust' === type ) {
      this.router.navigate(['maintenance/trust']);
    } else if ( 'catalogs' === type){
      this.router.navigate(['maintenance/catalogs']);
    }
  }

}
