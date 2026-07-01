import { TestBed } from '@angular/core/testing';

import { IdentificationAndContactService } from './identification-and-contact.service';
import { ContactInformationPm, IndentificationAndContactInformation } from '../../../onboarding/models/identification-and-contact';

describe('IdentificationAndContactService', () => {
  let service: IdentificationAndContactService;

  const mockIdentificationAndContact: IndentificationAndContactInformation = {
    identifications: [],
    manifestLetter: false,
    emails: [],
    phones: []
  }

//  const mockContactPM: ContactInformationPm = {
//     emails: [{id: '1', mail: 'example@a.com', mailNotification: true}],
//     phones: []
//   }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdentificationAndContactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial value null in signal', () => {
    expect(service.identificationAndContactInfo()).toBeNull();
  });

  it('should store a SingSection with signal readonly', () => {
    service.setIdentificationAndContactInfo(mockIdentificationAndContact);
    expect(service.identificationAndContactInfo()).toEqual(mockIdentificationAndContact);
  });

  it('should store a SingSection with signal', () => {
    service.setIdentificationAndContactInfo(mockIdentificationAndContact);
    expect(service.getIdentificationAndContactInfo()).toEqual(mockIdentificationAndContact);
  });

  it('should have initial value null in signal', () => {
    expect(service.getContactInfo()).toBeNull();
  });

  // it('should store a SingSection with signal readonly', () => {
  //   service.setContactInfoPm(mockContactPM);
  //   expect(service.contactInfoPm()).toEqual(mockContactPM);
  // });

  // it('should store a SingSection with signal', () => {
  //   service.setContactInfoPm(mockContactPM);
  //   expect(service.getContactInfo()).toEqual(mockContactPM);
  // });
});
