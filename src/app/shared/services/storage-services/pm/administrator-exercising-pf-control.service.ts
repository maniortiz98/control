import { Injectable, signal } from '@angular/core';
import { AdministratorExercisingPfControlDataSave } from '../../../../onboarding/models/pm/administrator-exercising-pf-control';
@Injectable({
  providedIn: 'root'
})
export class AdministratorExercisingPfControlService {

   private readonly dataAdministratorExercisingPf = signal<AdministratorExercisingPfControlDataSave | null>(null);

  // Method to get the object
  get(): AdministratorExercisingPfControlDataSave | null {
    return this.dataAdministratorExercisingPf();
  }

  // Method to set a new object
  set(data: AdministratorExercisingPfControlDataSave): boolean {
      this.dataAdministratorExercisingPf.set(data);
      return true;
  }

  // Method to clear the object
  clear(): boolean {
    const currentData = this.dataAdministratorExercisingPf();
    if (currentData) {
      this.dataAdministratorExercisingPf.set(null);
      return true;
    }
    return false;
  }
}
