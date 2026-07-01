import { Injectable, signal } from "@angular/core";
import { FiscalSelfDeclaration } from "../../../onboarding/models/checkpoints/fiscal-self-declaration-checkpoint";

@Injectable({ providedIn: 'root' })
export class FiscalSelfDeclarationDataClientService {
  private fiscalSelfDeclarationData = signal<FiscalSelfDeclaration | null>(
    null,
  );
  private _isRequested = signal<boolean>(false);
  readonly isRequested = this._isRequested.asReadonly();

  setItem(value: FiscalSelfDeclaration | null): void {
    this._isRequested.set(!!value);
    this.fiscalSelfDeclarationData.set(value);
  }

  getItem(): FiscalSelfDeclaration | null {
    return this.fiscalSelfDeclarationData();
  }

  removeItem(): void {
    this._isRequested.set(false);
    this.fiscalSelfDeclarationData.set(null);
  }
}
