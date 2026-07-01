import { Injectable, signal } from '@angular/core';
import { DataClientPPE } from '../../../onboarding/models/client-data';

@Injectable({
  providedIn: 'root'
})
export class PpeService {

  private readonly dataClientPPE = signal<DataClientPPE | null>(null);
  private readonly dataClientPPECopy = signal<DataClientPPE | null>(null);
  private _isRequeted = signal<boolean>(false);
  readonly isRequested = this._isRequeted.asReadonly();

  // Method to get the object
  get(): DataClientPPE | null {
    return this.dataClientPPE();
  }

  // Method to set a new object
  set(data: DataClientPPE): boolean {
    this._isRequeted.set(true);
    this.dataClientPPE.set(data);
    return true;
  }

  // Method to clear the object
  clear(): boolean {
    this._isRequeted.set(false);
    const currentData = this.dataClientPPE();
    if (currentData) {
      this.dataClientPPE.set(null);
      this.dataClientPPECopy.set(null);
      return true;
    }
    return false;
  }

  // Method to get the object
  getCopy(): DataClientPPE | null {
    return this.dataClientPPECopy();
  }

  // Method to set a new object
  setCopy(data: DataClientPPE): boolean {
    this.dataClientPPECopy.set(data);
    return true;
  }
}
