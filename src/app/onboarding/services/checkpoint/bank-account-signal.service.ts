import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BankAccountCheckpointSignalService {

  constructor() { }

  /**
   * Signal object for Beneficiaries PM
   */
  private _bankAccount = signal<Array<any>>([]);
  readonly bankAccount = this._bankAccount.asReadonly();

  /**
   * Property to determinate if data has been requested and saved on Signal.
   */
  private _isDataRequeted = signal<boolean>(false);
  readonly isDataRequested = this._isDataRequeted.asReadonly();


  /**
   * Sets Bank-Account page data.
   * For PERSONA FISICA
   */
  setData(data: any): void {
    this._isDataRequeted.set(true);
    this._bankAccount.set(data);
  }

  /**
   * Retrurn Bank Account paga data section.
   * For PERSONA FISICA
   */
  getData(): any {
    return this.bankAccount();
  }

  /**
   * clears data
   */
  clear(): void {
    this._isDataRequeted.set(false);
    this._bankAccount.set([]);
  }
}
