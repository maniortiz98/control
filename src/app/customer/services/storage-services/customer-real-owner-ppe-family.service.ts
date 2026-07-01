import { Injectable, signal } from '@angular/core';
import { DataRealOwnerClientFamilyPPE } from '../../models/customer-real-owner';


@Injectable({
  providedIn: 'root'
})
export class CustomerRealOwnerPpeFamilyService {
  // Function to generate a unique id
  private generateUniqueId(): string {
    return crypto.randomUUID();
  }

  private dataRealOwnerClientFamilyPPE = signal<DataRealOwnerClientFamilyPPE[]>([]);

  // Method to get all objects
  getAll(): DataRealOwnerClientFamilyPPE[] {
    return this.dataRealOwnerClientFamilyPPE();
  }

  // Method to add a new object
  add(data: DataRealOwnerClientFamilyPPE): boolean {
    const currentData = this.dataRealOwnerClientFamilyPPE();
    const curpExists = currentData.some(item =>  data.curp !== '' && item.curp === data.curp);
    if (!curpExists) {
      const currentData = this.dataRealOwnerClientFamilyPPE();
      const exists = currentData.some(item => (
        (item.firstName || '') === (data.firstName || '') &&
        (item.middleName || '') === (data.middleName || '') &&
        (item.dateOfBirth || '') === (data.dateOfBirth || '') &&
        (item.firstLastName || '') === (data.firstLastName || '') &&
        (item.secondLastName || '') === (data.secondLastName || '')
      ));
      if (!exists) {
        // Generate a unique id for the new object
        const newData = { ...data, id: data.id ?? this.generateUniqueId() };
        this.dataRealOwnerClientFamilyPPE.set([...currentData, newData]);
        return true;
      }
    }
    return false;
  }

  // Method to update an existing object
  update(id: string, updatedData: DataRealOwnerClientFamilyPPE): boolean {
    const currentData = this.dataRealOwnerClientFamilyPPE();
    const index = currentData.findIndex(item => item.id === id);
    if (index !== -1) {
      const currentData = this.dataRealOwnerClientFamilyPPE();
      const curpExists = currentData.filter((_, index) => index !== index).some(item => item.curp === updatedData.curp);
      if (!curpExists) {
        const currentData = this.dataRealOwnerClientFamilyPPE();
        const exists = currentData.filter((_, index) => index !== index).some(item => (
          (item.firstName || '') === (updatedData.firstName || '') &&
          (item.middleName || '') === (updatedData.middleName || '') &&
          (item.dateOfBirth || '') === (updatedData.dateOfBirth || '') &&
          (item.firstLastName || '') === (updatedData.firstLastName || '') &&
          (item.secondLastName || '') === (updatedData.secondLastName || '')
        ));
        if (!exists) {
          currentData[index] = { ...updatedData, id };
          this.dataRealOwnerClientFamilyPPE.set([...currentData]);
          return true;
        }
      }
    }
    return false;
  }

  // Method to delete an object
  delete(id: string): boolean {
    const currentData = this.dataRealOwnerClientFamilyPPE();
    const newData = currentData.filter(item => item.id !== id);
    if (newData.length !== currentData.length) {
      this.dataRealOwnerClientFamilyPPE.set(newData);
      return true;
    }
    return false;
  }

  // Method to clear the object
  clear(): boolean {
    const currentData = this.dataRealOwnerClientFamilyPPE();
    if (currentData.length > 0) {
      this.dataRealOwnerClientFamilyPPE.set([]);
      return true;
    }
    return false;
  }
}



export type RealOwnerPpeFamilyService = CustomerRealOwnerPpeFamilyService;




