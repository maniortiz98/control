import { Injectable, signal } from '@angular/core';
import { CurrentOnboardingInfo } from '../models/current-onboarding';

@Injectable({
  providedIn: 'root'
})
export class OnboardingStateServiceService {

  currentInfo = signal<CurrentOnboardingInfo>({
    requestId: '',
    personType: 'PF',
    name: '',
    contractType: '',
    contractSubtype: '',
    businessType: '',
    onboardingId: 0,
    isMaintenance: false,
    isCustomer: false,
    isOnboarding: false,
    isOnboardingWL: false,
    clientId: 0,
    accountId: 0,
    accountData: null,
  });

  setCurrentInfo(info: CurrentOnboardingInfo): void {
    this.currentInfo.set(info);
  }

  getCurrentInfo(): CurrentOnboardingInfo {
    return this.currentInfo();
  }

  get requestId(): string | null {
    return this.currentInfo()?.requestId ?? null;
  }
}
