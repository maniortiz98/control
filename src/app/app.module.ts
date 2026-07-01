import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './app/components/welcome/welcome.component';

import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { LoadingComponent } from './shared/components/loading/loading.component';

import {
  MsalGuard,
  MsalInterceptor,
  MsalBroadcastService,
  MsalModule,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalRedirectComponent,
} from '@azure/msal-angular';
import { WorkflowModule } from './workflow/workflow.module';
import { LogoutComponent } from './app/components/logout/logout.component';
import { MSALGuardConfigFactory, MSALInstanceFactory, MSALInterceptorConfigFactory } from './service/msal-auth.service';
import { appConfig } from './app.config';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    LogoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    CoreModule,
    OnboardingModule,
    LoadingComponent,
    WorkflowModule,
    MsalModule,
    MaintenanceModule,
  ],
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    ...(appConfig.providers || [])
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
