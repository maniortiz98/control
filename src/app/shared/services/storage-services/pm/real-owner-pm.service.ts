import { Injectable, signal } from '@angular/core';
import { RealOwnerPM } from '../../../../onboarding/models/pm/real-owner-pm';

@Injectable({
  providedIn: 'root'
})
export class RealOwnerPmService {

  private realOwnerPmSignal = signal<RealOwnerPM | null>(null);

  constructor() {}

  get realOwnerPm() {
    return this.realOwnerPmSignal.asReadonly();
  }

  setRealOwnerPm(item: RealOwnerPM) {
    this.realOwnerPmSignal.set(item);
  }

  getRealOwnerPm(): RealOwnerPM | null {
    return this.realOwnerPmSignal();
  }

  clearRealOwnerPM(){
    this.realOwnerPmSignal.set(null);
  }
}
