import { TestBed } from '@angular/core/testing';
import { ResourceProviderService } from './resource-provider.service';
import { ResourceProviderData } from '../../../onboarding/models/resource-provider';

describe('ResourceProviderService', () => {
  let service: ResourceProviderService;

  beforeEach(() => {
    service = new ResourceProviderService();
  });

  it('should set an item correctly', () => {
    const data: ResourceProviderData = {
      generalData: {
        curp: '',
        foreignerWithoutCurp: false,
        rfc: '',
        firstName: '',
        middleName: '',
        dateOfBirth: '',
        firstLastName: '',
        secondLastName: '',
        gender: '',
        nationality: '',
        countryOfBirth: '',
        stateOfBirth: '',
        typeIden: '',
        relationship: '',
        field: '',
        phone: '',
        mail: '',
        economicActivity: '',
        expirationDateField: ''
      },
      ppe: {
        ppe: false,
        tppe: '',
        positionHeld: '',
        expirationDate: '',
        fppe: false,
        dataFamily: []
      },
      adrres: {
        addressType: '',
        country: '',
        postalCode: '',
        federalEntity: '',
        city: '',
        municipality: '',
        neighborhood: '',
        street: '',
        externalNumber: ''
      }
    };
    service.setItem(data);
    expect(service.getItem()).toEqual(data);
  });

  it('should get the item correctly', () => {
    const data: ResourceProviderData = {
      generalData: {
        curp: '',
        foreignerWithoutCurp: false,
        rfc: '',
        firstName: '',
        middleName: '',
        dateOfBirth: '',
        firstLastName: '',
        secondLastName: '',
        gender: '',
        nationality: '',
        countryOfBirth: '',
        stateOfBirth: '',
        typeIden: '',
        relationship: '',
        field: '',
        phone: '',
        mail: '',
        economicActivity: '',
        expirationDateField: ''
      },
      ppe: {
        ppe: false,
        tppe: '',
        positionHeld: '',
        expirationDate: '',
        fppe: false,
        dataFamily: []
      },
      adrres: {
        addressType: '',
        country: '',
        postalCode: '',
        federalEntity: '',
        city: '',
        municipality: '',
        neighborhood: '',
        street: '',
        externalNumber: ''
      }
    };
    service.setItem(data);
    const result = service.getItem();
    expect(result).toEqual(data);
  });

  it('should remove the item correctly', () => {
    const data: ResourceProviderData = {
      generalData: {
        curp: '',
        foreignerWithoutCurp: false,
        rfc: '',
        firstName: '',
        middleName: '',
        dateOfBirth: '',
        firstLastName: '',
        secondLastName: '',
        gender: '',
        nationality: '',
        countryOfBirth: '',
        stateOfBirth: '',
        typeIden: '',
        relationship: '',
        field: '',
        phone: '',
        mail: '',
        economicActivity: '',
        expirationDateField: ''
      },
      ppe: {
        ppe: false,
        tppe: '',
        positionHeld: '',
        expirationDate: '',
        fppe: false,
        dataFamily: []
      },
      adrres: {
        addressType: '',
        country: '',
        postalCode: '',
        federalEntity: '',
        city: '',
        municipality: '',
        neighborhood: '',
        street: '',
        externalNumber: ''
      }
    };
    service.setItem(data);
    service.removeItem();
    expect(service.getItem()).toBeNull();
  });

  it('should handle removing an item when none is set', () => {
    service.removeItem();
    expect(service.getItem()).toBeNull();
  });
});
