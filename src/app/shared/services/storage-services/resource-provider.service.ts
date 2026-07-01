import { Injectable, signal } from '@angular/core';
import { ResourceProviderData } from '../../../onboarding/models/resource-provider';

@Injectable({
  providedIn: 'root'
})
export class ResourceProviderService {

  private resourceProviderDataData = signal<ResourceProviderData | null>(null);
  private resourceProviderDataDataCopy = signal<ResourceProviderData | null>(null);
  private _isRequeted = signal<boolean>(false);
  readonly isRequested = this._isRequeted.asReadonly()

  constructor() { }

  // Create or update the object
  setItem(value: ResourceProviderData): void {
    this._isRequeted.set(true);
    this.resourceProviderDataData.set(value);
  }

  // Read the object
  getItem(): ResourceProviderData | null {
    return this.resourceProviderDataData();
  }

  // Delete the object
  removeItem(): void {
    this._isRequeted.set(false);
    const currentData = this.resourceProviderDataData();
    if (currentData) {
      this.resourceProviderDataData = signal<ResourceProviderData | null>(null);
      this.resourceProviderDataDataCopy = signal<ResourceProviderData | null>(null);
    }
  }

  // Create or update the object
  setItemCopy(value: ResourceProviderData): void {
    this._isRequeted.set(true);
    this.resourceProviderDataDataCopy.set(value);
  }

  // Read the object
  getItemCopy(): ResourceProviderData | null {
    return this.resourceProviderDataDataCopy();
  }
}
