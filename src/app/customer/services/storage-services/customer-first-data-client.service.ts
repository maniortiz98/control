import { Injectable, signal } from '@angular/core';
import { CustomerCLIENT } from '../../constants/customer-constants';
import { DataClient } from '../../models/customer-client-data';
import { Data } from '../../models/checkpoints/customer-initial-data-checkpoint';

@Injectable({
  providedIn: 'root'
})
export class CustomerFirstDataClientService {
  // dataDemo: Data =
  //   {
  //     curp: "ROOI850909HMCSLV07",
  //     foreignerWithoutCurp: false,
  //     rfc: "ROOI850909",
  //     firstName: "IVAN",
  //     middleName: "MAURICIO",
  //     dateOfBirth: "09/09/1985",
  //     firstLastName: "GOMEZ",
  //     secondLastName: "LOPEZ",
  //     gender: "2",
  //     nationality: "AF",
  //     countryOfBirth: "MX",
  //     stateOfBirth: "MC",
  //     ppe: true,
  //     bankAreaTypeId: '1',
  //     contraTypeId: 1,
  //     typeContractSubtypeId: 1,
  //     nif: '',
  //     tin: '',
  //     nss: '',
  //     cityOfBirth: 'ASD'
  //   };

  private dataClient = signal<Data | null>(null);

  constructor() { }

  // Create or update the object
  setItem(value: Data): void {
    console.log('seteando Initial info')
    this.dataClient.set(value);
  }

  // Create or update the object
  updatePpeItem(): void {
    const currentData = this.dataClient();
    if (currentData) {
      this.dataClient.set({
        ...currentData,
        ppe: true
      });
    }
  }

  // Read the object
  getItem(): Data | null {
    console.log('obteniendo Initial info')
    return this.dataClient();
  }

  // Delete the object
  removeItem(): void {
    const currentData = this.dataClient();
    if (currentData) {
      this.dataClient = signal<Data | null>(null);
    }
  }

  // Método para acceder a la señal
  getDataClientSignal() {
    return this.dataClient;
  }
}


export type FirstDataClientService = CustomerFirstDataClientService;


