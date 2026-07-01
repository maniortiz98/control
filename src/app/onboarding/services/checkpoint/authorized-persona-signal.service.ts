import { Injectable, signal } from '@angular/core';
import { AuthorizedPersonPageData } from '../../models/authorized-person-page-data';

@Injectable({
  providedIn: 'root'
})
export class AuthorizedPersonSignalService {

  constructor() { }

  /**
   * Authorized Person section
   */
  private _authorizedPerson = signal<AuthorizedPersonPageData>({
    data: [],
    table: []
  });
  readonly authorizedPerson = this._authorizedPerson.asReadonly();

  /**
   * Property to determinate if data has been requested and saved on Signal.
   */
  private _isDataRequeted = signal<boolean>(false);
  readonly isDataRequested = this._isDataRequeted.asReadonly();


  /**
   *
   */
  setData(data: AuthorizedPersonPageData): void {
    this._isDataRequeted.set(true);
    this._authorizedPerson.set(data);
  }

  /**
   *
   */
  getData(): AuthorizedPersonPageData {
    return this.authorizedPerson();
  }

  /**
   * clears data signal.
   */
  clear(): void {
    this._isDataRequeted.set(false);
    this._authorizedPerson.set(
      {
        data: [],
        table: []
      } as AuthorizedPersonPageData
    );
  }
}
