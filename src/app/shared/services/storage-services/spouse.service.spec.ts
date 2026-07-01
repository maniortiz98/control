import { DataSpouse } from '../../../onboarding/models/checkpoints/maintenance/spouse-checkpoint';
import { SpouseService } from './spouse.service';

describe('SpouseService', () => {
  let service: SpouseService;

  beforeEach(() => {
    service = new SpouseService();
  });

  it('should set an item correctly', () => {
    const data: DataSpouse = {
      spousedata: {
        curp: '',
        foreignerWithoutCurp: false,
        rfc: '',
        nif: '',
        tin: '',
        nss: '',
        firstName: '',
        middleName: '',
        firstLastName: '',
        secondLastName: '',
        dateOfBirth: '',
        gender: '0'
      },
      workingfields: {
        occupation: '0',
        businessActivity: '0'
      },
      address: {
        addressType: '',
        other: '',
        country: '',
        federalEntity: '',
        postalCode: '',
        city: '',
        municipality: '',
        neighborhood: '',
        street: '',
        externalNumber: '',
        internalNumber: ''
      }
    };
    service.setItem(data);
    expect(service.getItem()).toEqual(data);
  });

  it('should get the item correctly', () => {
    const data: DataSpouse = {
      spousedata: {
        curp: '',
        foreignerWithoutCurp: false,
        rfc: '',
        nif: '',
        tin: '',
        nss: '',
        firstName: '',
        middleName: '',
        firstLastName: '',
        secondLastName: '',
        dateOfBirth: '',
        gender: '0'
      },
      workingfields: {
        occupation: '0',
        businessActivity: '0'
      },
      address:{
        addressType: '',
        other: '',
        country: '',
        federalEntity: '',
        postalCode: '',
        city: '',
        municipality: '',
        neighborhood: '',
        street: '',
        externalNumber: '',
        internalNumber: ''
      }
    };
    service.setItem(data);
    const result = service.getItem();
    expect(result).toEqual(data);
  });

  it('should remove the item correctly', () => {
    const data: DataSpouse = {
      spousedata: {
        curp: '',
        foreignerWithoutCurp: false,
        rfc: '',
        nif: '',
        tin: '',
        nss: '',
        firstName: '',
        middleName: '',
        firstLastName: '',
        secondLastName: '',
        dateOfBirth: '',
        gender: '0'
      },
      workingfields: {
        occupation: '0',
        businessActivity: '0'
      },
      address: {
        addressType: '',
        other: '',
        country: '',
        federalEntity: '',
        postalCode: '',
        city: '',
        municipality: '',
        neighborhood: '',
        street: '',
        externalNumber: '',
        internalNumber: ''
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
