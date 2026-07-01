import { Injectable, signal } from '@angular/core';
import { CustomerAdditionalInfoData, CustomerAdditionalInfoPageData } from '../../models/customer-additional-info';

@Injectable({
  providedIn: 'root',
})
export class CustomerAdditionalInfoService {
  private additionalInfoData = signal<CustomerAdditionalInfoPageData | null>(null);
  private _isRequeted = signal<boolean>(false);
  readonly isRequested = this._isRequeted.asReadonly();


  constructor() {}

  // Create or update the object
  setItem(value: CustomerAdditionalInfoPageData): void {
    this._isRequeted.set(true);
    this.additionalInfoData.set(value);
  }

  // Read the object
  getItem(): CustomerAdditionalInfoPageData | null {
    return this.additionalInfoData();
  }

  // Delete the object
  removeItem(): void {
    this._isRequeted.set(false);
    const currentData = this.additionalInfoData();
    if (currentData) {
      this.additionalInfoData = signal<CustomerAdditionalInfoPageData | null>(null);
    }
  }
}

export type AdditionalInfoService = CustomerAdditionalInfoService;


