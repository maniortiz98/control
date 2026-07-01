import { Component, inject } from '@angular/core';
import { PermissionRolService } from '../../../core/services/rol.service';
import { Router } from '@angular/router';
import { OnboardingService } from '../../../onboarding/services/onboarding.service';
import { CustomerOnboardingService as OnboardingServiceCls  } from '../../../customer/services/customer-onboarding.service';
@Component({
  selector: 'app-welcome',
  standalone: false,
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  private readonly permissionRolService = inject(PermissionRolService);
  private readonly router               = inject(Router);
  private readonly onboar               = inject(OnboardingService);
  private readonly onboarCli               = inject(OnboardingServiceCls);
  constructor() {
    console.log("WELCOME");
    if (this.permissionRolService.validRole()) {
      this.onboar.clearOnboardingInfo();
      this.onboarCli.clearOnboardingInfo();
      this.router.navigate(['onboarding']);
    } else {
      this.router.navigate(['logout-temp']);
    }
  }
}
