import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActiwebService {

  public actiwebData = signal<any>({});
  public readonly initialActiwebData = {};

  /**
   * Property to determinate if data has been requested and saved on Signal.
   */
  private _isDataRequeted = signal<boolean>(false);
  readonly isDataRequested = this._isDataRequeted.asReadonly();

  setItem(value: any):void{
    this._isDataRequeted.set(true);
    this.actiwebData.set(value);
  }

  /**
   *
   */
  getData(): any {
    return this.actiwebData();
  }

  /**
   * clears data signal and if requested Flag
   */
  clear(): void {
    this._isDataRequeted.set(false);
    this.actiwebData.set({});
  }
}
