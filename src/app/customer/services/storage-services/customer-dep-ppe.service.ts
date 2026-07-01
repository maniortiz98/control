import { Injectable, signal } from '@angular/core';
import { DataClientDepPPE } from '../../models/customer-client-data';

@Injectable({
  providedIn: 'root'
})
export class CustomerDepPPEService {
  private dataClientDepPPE = signal<DataClientDepPPE[]>([]);

  // Method to get all objects
  getAll(): DataClientDepPPE[] {
    return this.dataClientDepPPE();
  }

  // Method to add a new object
  add(data: DataClientDepPPE): boolean {
    const currentData = this.dataClientDepPPE();
    // Example logic to prevent duplicates based on `rfc`
    const exists = currentData.some(item => item.rfc === data.rfc);
    if (!exists) {
      this.dataClientDepPPE.set([...currentData, data]);
      return true;
    }
    return false;
  }

  // Method to add a list of new objects
  addList(dataList: DataClientDepPPE[]): void {
    this.dataClientDepPPE.set([...dataList]);
  }

  // Method to update an existing object
  update(id: string, updatedData: DataClientDepPPE): boolean {
    const currentData = this.dataClientDepPPE();
    const index = currentData.findIndex(item => item.rfc === id);
    if (index !== -1) {
      currentData[index] = updatedData;
      this.dataClientDepPPE.set([...currentData]);
      return true;
    }
    return false;
  }

  // Method to delete an object
  delete(id: string): boolean {
    const currentData = this.dataClientDepPPE();
    const newData = currentData.filter(item => item.rfc !== id);
    if (newData.length !== currentData.length) {
      this.dataClientDepPPE.set(newData);
      return true;
    }
    return false;
  }

  // Method to clear the object
  clear(): boolean {
    const currentData = this.dataClientDepPPE();
    if (currentData) {
      this.dataClientDepPPE = signal<DataClientDepPPE[]>([]);
      return true;
    }
    return false;
  }
}



export type DepPPEService = CustomerDepPPEService;


