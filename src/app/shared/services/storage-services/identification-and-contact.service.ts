import { Injectable, signal } from '@angular/core';
import { ContactInformationPm, IndentificationAndContactInformation } from '../../../onboarding/models/identification-and-contact';

@Injectable({
  providedIn: 'root'
})
export class IdentificationAndContactService {

  id = crypto.randomUUID();
  otherId = crypto.randomUUID();
  private readonly identificationAndContactSignal = signal<IndentificationAndContactInformation | null>(null);
  private readonly contactSignalPm = signal<ContactInformationPm | null>(null);

  constructor() { }

  get identificationAndContactInfo() {
    console.log('consultando')
    return this.identificationAndContactSignal.asReadonly();
  }

  setIdentificationAndContactInfo(item: IndentificationAndContactInformation) {
    console.log('seteando')
    this.identificationAndContactSignal.set(item);
  }

  getIdentificationAndContactInfo(): IndentificationAndContactInformation | null {
    return this.identificationAndContactSignal();
  }

  cleartIdentificationAndContactInfo() {
    this.identificationAndContactSignal.set(null);
  }
  get contactInfoPm() {
    return this.contactSignalPm.asReadonly();
  }

  setContactInfoPm(item: ContactInformationPm) {
    this.contactSignalPm.set(item);
  }

  getContactInfo(): ContactInformationPm | null {
    return this.contactSignalPm();
  }
}
