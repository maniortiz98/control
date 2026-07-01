import { Injectable, signal } from '@angular/core';
import { Address } from '../../../onboarding/models/address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private dataAddress = signal<Address[]>([]);

  // Method to get all objects
  getAll(): Address[] {
    return this.dataAddress();
  }

  // Method to add a new object
  validCP(data: Address): boolean {
    const currentData = this.dataAddress();
    if (((data.confirmCp || '') === "YES") || ((data.confirmCp || '') === "NO")) {
      const taxPostal = currentData.every(item => (item.taxPostalCode || '') != "");
      if (!taxPostal) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  // Method to add a new object
  add(data: Address): boolean {
    console.log(data)
    const currentData = this.dataAddress();
    const roleExists = currentData.some(item => (item.addressRole === data.addressRole && item.addressRole != ''));
    if (!roleExists) {
      const currentData = this.dataAddress();
      const exists = currentData.some(item => (
        (item.country || '') === (data.country || '') &&
        ((item.federalEntity || '') === (data.federalEntity || '') || (item.federalEntity || '') === (data.federalEntityID || '')) &&
        ((item.city || '') === (data.city || '') || (item.city || '') === (data.cityID || '')) &&
        ((item.municipality || '') === (data.municipality || '') || (item.municipality || '') === (data.municipalityID || '')) &&
        (item.neighborhood || '') === (data.neighborhood || '') &&
        (item.street || '') === (data.street || '') &&
        (item.externalNumber || '') === (data.externalNumber || '') &&
        (item.internalNumber || '') === (data.internalNumber || '')
      ));
      if (!exists) {
        const saveData = { ...data, idFront: crypto.randomUUID() };
        if (((data.confirmCp || '') === "YES")) {
          saveData.taxPostalCode = data.postalCode;
        }
        this.dataAddress.set([...currentData, saveData]);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  // Method to update an existing object
  update(id: string, updatedData: Address): boolean {
    const currentData = this.dataAddress();
    const indexCurrentData = currentData.findIndex(item => item.idFront === id);
    console.log(indexCurrentData)
    if (indexCurrentData !== -1) {
      const currentData = this.dataAddress();
      const roleExists = currentData.filter((_, index) => index !== indexCurrentData).some(item => item.addressRole === updatedData.addressRole);
      if (!roleExists) {
        const currentData = this.dataAddress();
        const exists = currentData
          .filter((_, index) => index !== indexCurrentData)
          .some(item => (
            (item.country || '') === (updatedData.country || '') &&
            ((item.federalEntity || '') === (updatedData.federalEntity || '') || (item.federalEntity || '') === (updatedData.federalEntityID || '')) &&
            ((item.city || '') === (updatedData.city || '') || (item.city || '') === (updatedData.cityID || '')) &&
            ((item.municipality || '') === (updatedData.municipality || '') || (item.municipality || '') === (updatedData.municipalityID || '')) &&
            (item.neighborhood || '') === (updatedData.neighborhood || '') &&
            (item.street || '') === (updatedData.street || '') &&
            (item.externalNumber || '') === (updatedData.externalNumber || '') &&
            (item.internalNumber || '') === (updatedData.internalNumber || '')
          ));
        console.log(exists)
        if (!exists) {
          const saveData = updatedData;
          if (((updatedData.confirmCp || '') === "YES")) {
            saveData.taxPostalCode = updatedData.postalCode;
          }
          currentData[indexCurrentData] = saveData;
          this.dataAddress.set([...currentData]);
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
    return false;
  }

  // Method to add a new object
  addPm(data: Address): boolean {
    console.log(data)
    const currentData = this.dataAddress();
    const roleExists = currentData.some(item => item.addressRole === data.addressRole);
    if (!roleExists) {
      const currentData = this.dataAddress();
      const exists = currentData.some(item => (
        (item.federalEntity || '') === (data.federalEntity || '') &&
        (item.city || '') === (data.city || '') &&
        (item.municipality || '') === (data.municipality || '') &&
        (item.neighborhood || '') === (data.neighborhood || '') &&
        (item.street || '') === (data.street || '') &&
        (item.externalNumber || '') === (data.externalNumber || '') &&
        (item.internalNumber || '') === (data.internalNumber || '')
      ));
      if (!exists) {
        const saveData = data;
        if (((data.confirmCp || '') === "YES")) {
          saveData.taxPostalCode = data.postalCode;
        }
        this.dataAddress.set([...currentData, saveData]);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  // Method to update an existing object
  updatePm(id: string, updatedData: Address): boolean {
    const currentData = this.dataAddress();
    const indexCurrentData = currentData.findIndex(item => item.addressRole === id);
    console.log(indexCurrentData)
    if (indexCurrentData !== -1) {
      const currentData = this.dataAddress();
      const roleExists = currentData.filter((_, index) => index !== indexCurrentData).some(item => item.addressRole === updatedData.addressRole);
      if (!roleExists) {
        const currentData = this.dataAddress();
        const exists = currentData
          .filter((_, index) => index !== indexCurrentData)
          .some(item => (
            (item.federalEntity || '') === (updatedData.federalEntity || '') &&
            (item.city || '') === (updatedData.city || '') &&
            (item.municipality || '') === (updatedData.municipality || '') &&
            (item.neighborhood || '') === (updatedData.neighborhood || '') &&
            (item.street || '') === (updatedData.street || '') &&
            (item.externalNumber || '') === (updatedData.externalNumber || '') &&
            (item.internalNumber || '') === (updatedData.internalNumber || '')
          ));
        console.log(exists)
        if (!exists) {
          const saveData = updatedData;
          if (((updatedData.confirmCp || '') === "YES")) {
            saveData.taxPostalCode = updatedData.postalCode;
          }
          currentData[indexCurrentData] = saveData;
          this.dataAddress.set([...currentData]);
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
    return false;
  }

  // Method to delete an object
  delete(id: string): boolean {
    const currentData = this.dataAddress();
    const newData = currentData.filter(item => item.idFront !== id);
    if (newData.length !== currentData.length) {
      this.dataAddress.set(newData);
      return true;
    }
    return false;
  }

  // Method to clear the object
  clear(): boolean {
    const currentData = this.dataAddress();
    if (currentData.length > 0) {
      this.dataAddress = signal<Address[]>([]);
      return true;
    }
    return false;
  }
}
