import { Injectable, signal } from '@angular/core';
import { DataClientSocAndAssoPPE } from '../../models/customer-client-data';

@Injectable({
  providedIn: 'root'
})
export class CustomerSocAssoPPEService {

  private dataClientSocAndAssoPPE = signal<DataClientSocAndAssoPPE[]>([]);

  // Method to get all objects
  getAll(): DataClientSocAndAssoPPE[] {
    return this.dataClientSocAndAssoPPE();
  }

  // Method to add a new object
  add(data: DataClientSocAndAssoPPE): boolean {
    const currentData = this.dataClientSocAndAssoPPE();
    // Example logic to prevent duplicates based on `rfc`
    const exists = currentData.some(item => item.rfc === data.rfc);
    if (!exists) {
      this.dataClientSocAndAssoPPE.set([...currentData, data]);
      return true;
    }
    return false;
  }

  // Method to add a list of new objects
  addList(dataList: DataClientSocAndAssoPPE[]): void {
    this.dataClientSocAndAssoPPE.set([...dataList]);
  }

  // Method to update an existing object
  update(id: string, updatedData: DataClientSocAndAssoPPE): boolean {
    const currentData = this.dataClientSocAndAssoPPE();
    const index = currentData.findIndex(item => item.rfc === id);
    if (index !== -1) {
      currentData[index] = updatedData;
      this.dataClientSocAndAssoPPE.set([...currentData]);
      return true;
    }
    return false;
  }

  // Method to delete an object
  delete(id: string): boolean {
    const currentData = this.dataClientSocAndAssoPPE();
    const newData = currentData.filter(item => item.rfc !== id);
    if (newData.length !== currentData.length) {
      this.dataClientSocAndAssoPPE.set(newData);
      return true;
    }
    return false;
  }

  // Method to clear the object
  clear(): boolean {
    const currentData = this.dataClientSocAndAssoPPE();
    if (currentData) {
      this.dataClientSocAndAssoPPE = signal<DataClientSocAndAssoPPE[]>([]);
      return true;
    }
    return false;
  }
}



export type SocAssoPPEService = CustomerSocAssoPPEService;


