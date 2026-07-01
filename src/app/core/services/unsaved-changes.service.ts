import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesService {

  private _hasUnsavedChanges = signal<boolean>(false);

  constructor() { }

  /**
   * Sets if user "has unsaved changes"
   * True = Has unsaved changes.
   * False = Has Not unsaved changes.
   */
  setUnsavedChanges(value: boolean): void {
    this._hasUnsavedChanges.set(value);
  }

  /**
   * hasUnsavedChanges Getter
   */
  get hasUnsavedChanges(): boolean {
    return this._hasUnsavedChanges();
  }

}
