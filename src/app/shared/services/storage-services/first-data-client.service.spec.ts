import { TestBed } from '@angular/core/testing';

import { FirstDataClientService } from './first-data-client.service';
import { Data } from '../../../onboarding/models/checkpoints/initial-data-checkpoint';

describe('YourServiceClass', () => {
  let service: FirstDataClientService;

  beforeEach(() => {
    service = new FirstDataClientService();
  });

  it('should set an item correctly', () => {
    const data: Data = {
      curp: '',
      nif: '',
      tin: '',
      nss: '',
      rfc: '',
      firstName: '',
      middleName: '',
      firstLastName: '',
      secondLastName: '',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      countryOfBirth: '',
      stateOfBirth: '',
      cityOfBirth: '',
      ppe: false,
      foreignerWithoutCurp: false,
      bankAreaTypeId: '',
      contraTypeId: 0,
      typeContractSubtypeId: 0
    };
    service.setItem(data);
    expect(service.getItem()).toEqual(data);
  });

  it('should update the PPE item correctly', () => {
    const data: Data = {
      curp: '',
      nif: '',
      tin: '',
      nss: '',
      rfc: '',
      firstName: '',
      middleName: '',
      firstLastName: '',
      secondLastName: '',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      countryOfBirth: '',
      stateOfBirth: '',
      cityOfBirth: '',
      ppe: false,
      foreignerWithoutCurp: false,
      bankAreaTypeId: '',
      contraTypeId: 0,
      typeContractSubtypeId: 0
    };
    service.setItem(data);
    service.updatePpeItem();
    expect(service.getItem()?.ppe).toBeTrue();
  });

  it('should get the item correctly', () => {
    const data: Data = {
      curp: '',
      nif: '',
      tin: '',
      nss: '',
      rfc: '',
      firstName: '',
      middleName: '',
      firstLastName: '',
      secondLastName: '',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      countryOfBirth: '',
      stateOfBirth: '',
      cityOfBirth: '',
      ppe: false,
      foreignerWithoutCurp: false,
      bankAreaTypeId: '',
      contraTypeId: 0,
      typeContractSubtypeId: 0
    };
    service.setItem(data);
    const result = service.getItem();
    expect(result).toEqual(data);
  });

  it('should remove the item correctly', () => {
    const data: Data = {
      curp: '',
      nif: '',
      tin: '',
      nss: '',
      rfc: '',
      firstName: '',
      middleName: '',
      firstLastName: '',
      secondLastName: '',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      countryOfBirth: '',
      stateOfBirth: '',
      cityOfBirth: '',
      ppe: false,
      foreignerWithoutCurp: false,
      bankAreaTypeId: '',
      contraTypeId: 0,
      typeContractSubtypeId: 0
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
