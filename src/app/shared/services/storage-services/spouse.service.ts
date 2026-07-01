import { Injectable, signal } from '@angular/core';
import { DataSpouse } from '../../../onboarding/models/checkpoints/maintenance/spouse-checkpoint';

@Injectable({
  providedIn: 'root'
})
export class SpouseService {
  private spouseData = signal<DataSpouse | null>(null);
  private _isRequeted = signal<boolean>(false);
  readonly isRequested = this._isRequeted.asReadonly();

  constructor() { }

  // Create or update the object
  setItem(value: DataSpouse | null): void {
    this._isRequeted.set(true);
    this.spouseData.set(value);
  }

  // Read the object
  getItem(): DataSpouse | null {
    return this.spouseData();
  }

  // Delete the object
  removeItem(): void {
    this._isRequeted.set(false);
    const currentData = this.spouseData();
    if (currentData) {
      this.spouseData = signal<DataSpouse | null>(null);
    }
  }
}
