import { Injectable, signal } from '@angular/core';
import { SpidProfile, SpidProfilePageData } from '../../models/pm/spid-profile';

@Injectable({
  providedIn: 'root'
})
export class SpidProfileSignalService {

  constructor() { }

  /**
   * SPID Profile ( Captura de Perfil Transaccional | PM ) section.
   */
  private _spidProfile = signal<SpidProfilePageData>({
    data: {} as SpidProfile,
    table: []
  } as SpidProfilePageData);
  readonly spidProfile = this._spidProfile.asReadonly();


  /**
   * sets data signal.
   */
  setData(data: SpidProfilePageData): void {
    this._spidProfile.set(data);
  }

  /**
   * gets data signal.
   */
  getData(): SpidProfilePageData {
    return this.spidProfile();
  }

  /**
   * clears data from signal.
   */
  clear(): void {
    this._spidProfile.set({data: {} as SpidProfile, table: []});
  }
}
