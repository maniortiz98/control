import { Injectable, signal } from '@angular/core';
import { CustomerIdentificationPm } from '../../../../onboarding/models/pm/customer-identification-pm';

@Injectable({
  providedIn: 'root'
})
export class CustomerIdentificationPmService {

  private dataClient = signal<CustomerIdentificationPm | null>(null);

  constructor() { }

  // Create or update the object
  setItem(value: CustomerIdentificationPm): void {
    this.dataClient.set(value);
  }

  // Read the object
  getItem(): CustomerIdentificationPm | null {
    return this.dataClient();
  }

  // Delete the object
  removeItem(): void {
    const currentData = this.dataClient();
    if (currentData) {
      this.dataClient = signal<CustomerIdentificationPm | null>(null);
    }
  }
}
