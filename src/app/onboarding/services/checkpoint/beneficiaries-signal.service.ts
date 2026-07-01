import { Injectable, signal } from '@angular/core';
// import { Beneficiaries } from '../../models/checkpoints/beneficiaries';
// import { DataClient } from '../../models/client-data';
import { BeneficiariesPMPageData } from '../../models/checkpoints/beneficiaries-pm';

@Injectable({
  providedIn: 'root'
})
export class BeneficiariesSignalService {

  constructor() { }

  /**
   * Signal object for Beneficiaries tab
   */
  private _beneficiaries = signal<any>([]);
  readonly beneficiaries = this._beneficiaries.asReadonly();

  /**
   * Signaul used in resolver, to know if the section was requested info
   */
  private _isRequested = signal<boolean>(false);
  readonly isRequested = this._isRequested.asReadonly();

  /**
   * Signal object for Beneficiaries PM
   */
  private _beneficiariesPM = signal<BeneficiariesPMPageData>({data: [], table: []});
  readonly beneficiariesPM = this._beneficiariesPM.asReadonly();

  /**
   *
   */
  setBeneficiaries(data: any): void {
    this._isRequested.set(true);
    this._beneficiaries.set(data);
  }

  /**
   *
   */
  getBeneficiaries(): any {
    return this.beneficiaries();
  }

  /**
   * clears both data signal, PF and PM
   */
  clear(): void {
    this._beneficiaries.set([]);
    this._beneficiariesPM.set({data: [], table: []});
    this._isRequested.set(false);
  }

  /**
   * sets beneficiaries Persona Moral page data
   */
  setBeneficiariesPM(data: BeneficiariesPMPageData): void {
    this._beneficiariesPM.set(data);
  }

  /**
   * gets beneficiaries Persona Moral page data
   */
  getBeneficiariesPM(): BeneficiariesPMPageData {
    return this.beneficiariesPM();
  }
}
