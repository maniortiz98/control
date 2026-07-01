import { Injectable, signal } from '@angular/core';
import { DirectoratePageData } from '../../models/directorate';

@Injectable({
  providedIn: 'root'
})
export class DirectorateSignalService {

  constructor() { }

  /**
   * Directorate ( Consejo Administrativo | PM ) section.
   */
  private _directorate = signal<DirectoratePageData>({
    data: [],
    table: []
  } as DirectoratePageData);
  readonly directorate = this._directorate.asReadonly();


  /**
   * gets data signal
   */
  setData(data: DirectoratePageData): void {
    this._directorate.set(data);
  }

  /**
   * gets data signal
   */
  getData(): DirectoratePageData {
    return this.directorate();
  }

  /**
   * clear data signal for Directorate seccion (PM)
   */
  clear(): void {
    this._directorate.set({ data: [], table: []});
  }
}
