import { Injectable, signal } from '@angular/core';
import { OperateChangesSection } from '../../../onboarding/models/operate-changes';

@Injectable({
  providedIn: 'root'
})
export class OperateChangesStorageService {

  private readonly operateChangesSignal = signal<OperateChangesSection | null>(null);
  private _isRequeted = signal<boolean>(false);
  readonly isRequested = this._isRequeted.asReadonly()

  constructor() {}

  get operateChanges() {
    return this.operateChangesSignal.asReadonly();
  }

  setoperateChanges(item: OperateChangesSection) {
    this._isRequeted.set(true);
    this.operateChangesSignal.set(item);
  }

  getoperateChanges(): OperateChangesSection | null {
    return this.operateChangesSignal();
  }

  clearOperateChanges(){
    this._isRequeted.set(false);
    this.operateChangesSignal.set(null);
  }
}
