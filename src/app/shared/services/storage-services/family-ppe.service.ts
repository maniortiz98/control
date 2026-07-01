import { Injectable, signal } from '@angular/core';
import { DataClientFamilyPPE } from '../../../onboarding/models/client-data';
import { DataRealOwnerClientFamilyPPE } from '../../../onboarding/models/real-owner';

@Injectable({
  providedIn: 'root'
})
export class FamilyPPEService {
  private dataClientFamilyPPE = signal<DataClientFamilyPPE[]>([]);

  // Method to get all objects
  getAll(): DataClientFamilyPPE[] {
    return this.dataClientFamilyPPE();
  }

  // Method to add a new object
  add(data: DataClientFamilyPPE): boolean {
    const currentData = this.dataClientFamilyPPE();
    // Example logic to prevent duplicates based on `rfc`
    const exists = currentData.some(item => item.rfc === data.rfc);
    if (!exists) {
      this.dataClientFamilyPPE.set([...currentData, data]);
      return true;
    }
    return false;
  }

  // Method to add a list of new objects
  addList(dataList: DataClientFamilyPPE[]): void {
    this.dataClientFamilyPPE.set([...dataList]);
  }

  // Method to update an existing object
  update(id: string, updatedData: DataClientFamilyPPE): boolean {
    const currentData = this.dataClientFamilyPPE();
    const index = currentData.findIndex(item => item.rfc === id);
    if (index !== -1) {
      currentData[index] = updatedData;
      this.dataClientFamilyPPE.set([...currentData]);
      return true;
    }
    return false;
  }

  // Method to delete an object
  delete(id: string): boolean {
    const currentData = this.dataClientFamilyPPE();
    const newData = currentData.filter(item => item.rfc !== id);
    if (newData.length !== currentData.length) {
      this.dataClientFamilyPPE.set(newData);
      return true;
    }
    return false;
  }

  // Method to clear the object
  clear(): boolean {
    const currentData = this.dataClientFamilyPPE();
    if (currentData) {
      this.dataClientFamilyPPE = signal<DataClientFamilyPPE[]>([]);
      return true;
    }
    return false;
  }
}
