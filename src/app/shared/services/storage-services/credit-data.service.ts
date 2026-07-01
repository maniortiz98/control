import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreditDataService {
  public creditData = signal<any>({});
  public readonly initialCreditData = {};
  private _isRequested = signal<boolean>(false);
  readonly isRequested = this._isRequested.asReadonly();

  setItem(value: any): void {
    this._isRequested.set(true);
    this.creditData.set(value);
  }

  getItem(): any | null {
    return this.creditData();
  }

  // Delete the object
  removeItem(): void {
    this._isRequested.set(false);
    this.creditData.set({});
  }
}
