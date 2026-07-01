import { Injectable, signal } from '@angular/core';
import { InternTrust } from '../../../../onboarding/models/trust';

@Injectable({
  providedIn: 'root'
})
export class TrustService {

  constructor() { }

  private readonly signalInternTrust = signal<InternTrust | null>(null);

  get internTrust() {
    return this.signalInternTrust.asReadonly();
  }

  setInternTrust(item: InternTrust) {
    this.signalInternTrust.set(item);
  }

  getInternTrust(): InternTrust | null {
    return this.signalInternTrust();
  }

  clearInternTrust(){
    this.signalInternTrust.set(null);
  }
}
