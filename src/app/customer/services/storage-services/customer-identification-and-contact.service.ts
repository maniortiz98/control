import { Injectable, signal } from '@angular/core';
import { CustomerContactInformationPm, CustomerIndentificationAndContactInformation } from '../../models/customer-identification-and-contact';

@Injectable({
  providedIn: 'root'
})
export class CustomerIdentificationAndContactService {

  id = crypto.randomUUID();
  otherId = crypto.randomUUID();
  private readonly identificationAndContactSignal = signal<CustomerIndentificationAndContactInformation | null>(null);
  private readonly contactSignalPm = signal<CustomerContactInformationPm | null>(null);

  constructor() { }

  get identificationAndContactInfo() {
    console.log('consultando')
    return this.identificationAndContactSignal.asReadonly();
  }

  setIdentificationAndContactInfo(item: CustomerIndentificationAndContactInformation) {
    console.log('seteando')
    this.identificationAndContactSignal.set(item);
  }

  getIdentificationAndContactInfo(): CustomerIndentificationAndContactInformation | null {
    return this.identificationAndContactSignal();
  }

  cleartIdentificationAndContactInfo() {
    this.identificationAndContactSignal.set(null);
  }
  get contactInfoPm() {
    return this.contactSignalPm.asReadonly();
  }

  setContactInfoPm(item: CustomerContactInformationPm) {
    this.contactSignalPm.set(item);
  }

  getContactInfo(): CustomerContactInformationPm | null {
    return this.contactSignalPm();
  }
}



export type IdentificationAndContactService = CustomerIdentificationAndContactService;

