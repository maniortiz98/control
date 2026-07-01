import { Injectable, signal } from '@angular/core';
import { PersonalInterviewData } from '../../../onboarding/models/checkpoints/personal-interview';

@Injectable({
  providedIn: 'root',
})
export class PersonalInterviewService {
  private interviewData = signal<PersonalInterviewData | null>(null);

  constructor() {}

  // Crear o actualizar el objeto
  setItem(value: PersonalInterviewData): void {
    this.interviewData.set(value);
  }

  // Leer el objeto
  getItem(): PersonalInterviewData | null {
    return this.interviewData();
  }

  // Eliminar el objeto
  removeItem(): void {
    const currentData = this.interviewData();
    if (currentData) {
      this.interviewData = signal<PersonalInterviewData | null>(null);
    }
  }
}
