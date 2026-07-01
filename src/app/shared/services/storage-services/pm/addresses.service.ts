import { Injectable, signal } from '@angular/core';
import { DataClientAddres } from '../../../../onboarding/models/client-data';

@Injectable({
  providedIn: 'root'
})
export class AddressesService {

   private readonly dataClientPmAddress = signal<DataClientAddres | null>(null);

  // Method to get the object
  get(): DataClientAddres | null {
    return this.dataClientPmAddress();
  }

  // Method to set a new object
  set(data: DataClientAddres): boolean {
      this.dataClientPmAddress.set(data);
      return true;
  }

  // Method to clear the object
  clear(): boolean {
    const currentData = this.dataClientPmAddress();
    if (currentData) {
      this.dataClientPmAddress.set(null);
      return true;
    }
    return false;
  }
}
