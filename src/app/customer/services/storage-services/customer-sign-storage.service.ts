import { Injectable, signal, WritableSignal } from '@angular/core';
import { CustomerSingSection } from '../../models/customer-sign-section';

@Injectable({
  providedIn: 'root'
})
export class CustomerSignStorageService {

  id = crypto.randomUUID();
  private readonly _singSectionSignal: WritableSignal<CustomerSingSection | null> = signal<CustomerSingSection | null>(null);

  readonly singSectionSignal = this._singSectionSignal.asReadonly();

  private _isRequeted = signal<boolean>(false);
  readonly isRequested = this._isRequeted.asReadonly()

  constructor() { }

  setSingSection(data: CustomerSingSection): void {
    this._isRequeted.set(true);
    this._singSectionSignal.set(data);
  }

  clear(): void {
    this._isRequeted.set(false);
    this._singSectionSignal.set(null);
  }
}



export type SignStorageService = CustomerSignStorageService;

