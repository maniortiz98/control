import { Injectable, signal } from '@angular/core';
import { TaxProfile } from '../../../onboarding/models/checkpoints/maintenance/fiscal-profile';

@Injectable({
  providedIn: 'root'
})
export class TaxProfileService {

  private taxProfileData = signal<TaxProfile | null>(null);
  private _isRequeted = signal<boolean>(false);
  readonly isRequested = this._isRequeted.asReadonly();

  constructor() { }

  // Create or update the object
  setItem(value: TaxProfile | null): void {
    this._isRequeted.set(true);
    this.taxProfileData.set(value);
  }

  // Read the object
  getItem(): TaxProfile | null {
    return this.taxProfileData();
  }

  // Delete the object
  removeItem(): void {
    this._isRequeted.set(false);
    const currentData = this.taxProfileData();
    if (currentData) {
      this.taxProfileData = signal<TaxProfile | null>(null);
    }
  }
}
