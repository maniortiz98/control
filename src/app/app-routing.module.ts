import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './app/components/welcome/welcome.component';
import { MsalGuard } from '@azure/msal-angular';
import { LogoutComponent } from './app/components/logout/logout.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./onboarding/onboarding.module').then((m) => m.OnboardingModule),
    canActivate: [MsalGuard]
  },
  {
    path: 'customer',
    loadChildren: () => import('./customer/customer.module').then((m) => m.CustomerModule),
    canActivate: [MsalGuard]
  },
  {
    path: 'workflow',
    loadChildren: () => import('./workflow/workflow.module').then((m) => m.WorkflowModule),
    canActivate: [MsalGuard]
  },
  {
    path: 'maintenance',
    loadChildren: () => import('./maintenance/maintenance.module').then((m) => m.MaintenanceModule),
    canActivate: [MsalGuard]
  },
  {
    path: 'logout',
    component: LogoutComponent,
    data: {
      temp: false
    }
  },
  {
    path: 'logout-temp',
    component: LogoutComponent,
    data: {
      temp: true
    }
  },
  {
    path: '**',
    redirectTo: '',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
