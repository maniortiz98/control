import { Injectable, signal } from '@angular/core';
import { DataClientAddres } from '../../../onboarding/models/client-data';

@Injectable({
  providedIn: 'root'
})
export class AddressesService {

   private readonly dataClientAddress = signal<DataClientAddres | null>(null);
   private readonly dataClientAddressCopy = signal<DataClientAddres | null>(null);
   private _isRequeted = signal<boolean>(false);
   readonly isRequested = this._isRequeted.asReadonly();

  // Method to get the object
  get(): DataClientAddres | null {
    return this.dataClientAddress();
  }

  // Method to set a new object
  set(data: DataClientAddres): boolean {
      this._isRequeted.set(true);
      this.dataClientAddress.set(data);
      return true;
  }

  // Method to clear the object
  clear(): boolean {
    this._isRequeted.set(false);
    const currentData = this.dataClientAddress();
    if (currentData) {
      this.dataClientAddress.set(null);
      this.dataClientAddressCopy.set(null);
      return true;
    }
    return false;
  }

    // Method to get the object
  getCopy(): DataClientAddres | null {
    return this.dataClientAddressCopy();
  }

  // Method to set a new object
  setCopy(data: DataClientAddres): boolean {
      this.dataClientAddressCopy.set(data);
      return true;
  }
}
