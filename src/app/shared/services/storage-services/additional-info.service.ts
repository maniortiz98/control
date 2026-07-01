import { Injectable, signal } from '@angular/core';
import { AdditionalInfoData, AdditionalInfoPageData } from '../../../onboarding/models/additional-info';

@Injectable({
  providedIn: 'root',
})
export class AdditionalInfoService {
  private additionalInfoData = signal<AdditionalInfoPageData | null>(null);
  private _isRequeted = signal<boolean>(false);
  readonly isRequested = this._isRequeted.asReadonly();


  constructor() {}

  // Create or update the object
  setItem(value: AdditionalInfoPageData): void {
    this._isRequeted.set(true);
    this.additionalInfoData.set(value);
  }

  // Read the object
  getItem(): AdditionalInfoPageData | null {
    return this.additionalInfoData();
  }

  // Delete the object
  removeItem(): void {
    this._isRequeted.set(false);
    const currentData = this.additionalInfoData();
    if (currentData) {
      this.additionalInfoData = signal<AdditionalInfoPageData | null>(null);
    }
  }
}
