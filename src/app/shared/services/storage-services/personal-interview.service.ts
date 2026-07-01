import { Injectable, signal } from '@angular/core';
import { PersonalInterviewData } from '../../../onboarding/models/checkpoints/personal-interview';

@Injectable({
  providedIn: 'root'
})
export class PersonalInterviewService {

  private personalInterviewData = signal<PersonalInterviewData | null>(null);
  private _isRequested = signal<boolean>(false);
  readonly isRequested = this._isRequested.asReadonly();

  constructor() { }

  // Create or update the object
  setItem(value: PersonalInterviewData): void {
    this._isRequested.set(true);
    this.personalInterviewData.set(value);
  }

  // Read the object
  getItem(): PersonalInterviewData | null {
    return this.personalInterviewData();
  }

  // Delete the object
  removeItem(): void {
    this._isRequested.set(false);
    const currentData = this.personalInterviewData();
    if (currentData) {
      this.personalInterviewData = signal<PersonalInterviewData | null>(null);
    }
  }
}
