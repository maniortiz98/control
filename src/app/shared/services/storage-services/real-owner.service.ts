import { Injectable, signal } from '@angular/core';
import { RealOwnerData } from '../../../onboarding/models/real-owner';

@Injectable({
  providedIn: 'root'
})
export class RealOwnerService {

  private realOwnerData = signal<RealOwnerData | null>(null);
  private realOwnerDataCopy = signal<RealOwnerData | null>(null);
  private _isRequeted = signal<boolean>(false);
  readonly isRequested = this._isRequeted.asReadonly()

  constructor() { }

  // Create or update the object
  setItem(value: RealOwnerData): void {
    this._isRequeted.set(true);
    this.realOwnerData.set(value);
  }

  // Read the object
  getItem(): RealOwnerData | null {
    return this.realOwnerData();
  }

  // Delete the object
  removeItem(): void {
    this._isRequeted.set(false);
    const currentData = this.realOwnerData();
    if (currentData) {
      this.realOwnerData = signal<RealOwnerData | null>(null);
      this.realOwnerDataCopy = signal<RealOwnerData | null>(null);
    }
  }

  // Create or update the object
  setItemCopy(value: RealOwnerData): void {
    this._isRequeted.set(true);
    this.realOwnerDataCopy.set(value);
  }

  // Read the object
  getItemCopy(): RealOwnerData | null {
    return this.realOwnerDataCopy();
  }
}