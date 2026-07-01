import { Injectable, signal, WritableSignal } from '@angular/core';
import { SingSection } from '../../../onboarding/models/sign-section';

@Injectable({
  providedIn: 'root'
})
export class SignStorageService {

  id = crypto.randomUUID();
  private readonly _singSectionSignal: WritableSignal<SingSection | null> = signal<SingSection | null>(null);

  readonly singSectionSignal = this._singSectionSignal.asReadonly();

  private _isRequeted = signal<boolean>(false);
  readonly isRequested = this._isRequeted.asReadonly()

  constructor() { }

  setSingSection(data: SingSection): void {
    this._isRequeted.set(true);
    this._singSectionSignal.set(data);
  }

  clear(): void {
    this._isRequeted.set(false);
    this._singSectionSignal.set(null);
  }
}
