import { Injectable, signal } from '@angular/core';
import { CustomerFiscalSelfDeclaration } from '../../models/checkpoints/customer-fiscal-self-declaration-checkpoint';

@Injectable({
  providedIn: 'root',
})
export class CustomerFiscalSelfDeclarationDataClientService {
  private fiscalSelfDeclarationData = signal<CustomerFiscalSelfDeclaration | null>(
    null,
  );
  private _isRequested = signal<boolean>(false);
  readonly isRequested = this._isRequested.asReadonly();

  constructor() {}

  // Create or update the object
  setItem(value: any): void {
    this._isRequested.set(true);
    this.fiscalSelfDeclarationData.set(value);
  }

  // Read the object
  getItem(): CustomerFiscalSelfDeclaration | null {
    return this.fiscalSelfDeclarationData();
  }

  // Delete the object
  removeItem(): void {
    this._isRequested.set(false);
    const currentData = this.fiscalSelfDeclarationData();
    if (currentData) {
      this.fiscalSelfDeclarationData = signal<CustomerFiscalSelfDeclaration | null>(
        null
      );
    }
  }
  
}

export type FiscalSelfDeclarationDataClientService = CustomerFiscalSelfDeclarationDataClientService;


