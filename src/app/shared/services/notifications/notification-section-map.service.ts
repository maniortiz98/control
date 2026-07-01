import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class NotificationSectionMapService {

  private sectionToEnum: Record<string, string> = {
    addressList: 'TAX_ADDRESS',
    telephones: 'PHONE',
    emails: 'EMAIL_ADDRESS',
    residenceList: 'RESIDENCE_ADDRESS',
    postalAddress: 'POSTAL_ADDRESS'
  };

  enumForList(listName: string): string | null {
    return this.sectionToEnum[listName] ?? null;
  }
}