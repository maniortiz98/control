import { TestBed } from '@angular/core/testing';

import { RealOwnerPpeFamilyService } from './real-owner-ppe-family.service';
import { DataRealOwnerClientFamilyPPE } from '../../../onboarding/models/real-owner';

describe('RealOwnerPpeFamilyService', () => {
  let service: RealOwnerPpeFamilyService;

  beforeEach(() => {
    service = new RealOwnerPpeFamilyService();
  });

  it('should add a new object correctly', () => {
    const data: DataRealOwnerClientFamilyPPE = {
      curp: '123', firstName: 'John',
      foreignerWithoutCurp: false,
      rfc: '',
      middleName: '',
      dateOfBirth: '',
      firstLastName: '',
      secondLastName: '',
      nationality: '',
      countryOfBirth: '',
      typeIden: '',
      chargeDueDate: '',
      relationship: '',
      positionHeld: ''
    };
    const result = service.add(data);
    expect(result).toBeTrue();
    expect(service.getAll().length).toBe(1);
  });

  it('should not add a duplicate object', () => {
    const data: DataRealOwnerClientFamilyPPE = {
      curp: '123', firstName: 'John',
      foreignerWithoutCurp: false,
      rfc: '',
      middleName: '',
      dateOfBirth: '',
      firstLastName: '',
      secondLastName: '',
      nationality: '',
      countryOfBirth: '',
      typeIden: '',
      chargeDueDate: '',
      relationship: '',
      positionHeld: ''
    };
    service.add(data);
    const result = service.add(data);
    expect(result).toBeFalse();
    expect(service.getAll().length).toBe(1);
  });

  it('should update an existing object', () => {
    const data: DataRealOwnerClientFamilyPPE = {
      curp: '123', firstName: 'John',
      foreignerWithoutCurp: false,
      rfc: '',
      middleName: '',
      dateOfBirth: '',
      firstLastName: '',
      secondLastName: '',
      nationality: '',
      countryOfBirth: '',
      typeIden: '',
      chargeDueDate: '',
      relationship: '',
      positionHeld: ''
    };
    service.add(data);
    const updatedData: DataRealOwnerClientFamilyPPE = {
      curp: '123', firstName: 'Jane',
      foreignerWithoutCurp: false,
      rfc: '',
      middleName: '',
      dateOfBirth: '',
      firstLastName: '',
      secondLastName: '',
      nationality: '',
      countryOfBirth: '',
      typeIden: '',
      chargeDueDate: '',
      relationship: '',
      positionHeld: ''
    };
    const id = service.getAll()[0].id?.toString();
    const result = service.update(id ?? '', updatedData);
    expect(result).toBeTrue();
    expect(service.getAll()[0].firstName).toBe('Jane');
  });

  it('should not update a non-existing object', () => {
    const updatedData: DataRealOwnerClientFamilyPPE = {
      curp: '123', firstName: 'Jane',
      foreignerWithoutCurp: false,
      rfc: '',
      middleName: '',
      dateOfBirth: '',
      firstLastName: '',
      secondLastName: '',
      nationality: '',
      countryOfBirth: '',
      typeIden: '',
      chargeDueDate: '',
      relationship: '',
      positionHeld: ''
    };
    const result = service.update('non-existing-id', updatedData);
    expect(result).toBeFalse();
  });

  it('should delete an existing object', () => {
    const data: DataRealOwnerClientFamilyPPE = {
      curp: '123', firstName: 'John',
      foreignerWithoutCurp: false,
      rfc: '',
      middleName: '',
      dateOfBirth: '',
      firstLastName: '',
      secondLastName: '',
      nationality: '',
      countryOfBirth: '',
      typeIden: '',
      chargeDueDate: '',
      relationship: '',
      positionHeld: ''
    };
    service.add(data);
    const id = service.getAll()[0].id?.toString();
    const result = service.delete(id ?? '');
    expect(result).toBeTrue();
    expect(service.getAll().length).toBe(0);
  });

  it('should not delete a non-existing object', () => {
    const result = service.delete('non-existing-id');
    expect(result).toBeFalse();
  });

  it('should clear all objects', () => {
    const data: DataRealOwnerClientFamilyPPE = {
      curp: '123', firstName: 'John',
      foreignerWithoutCurp: false,
      rfc: '',
      middleName: '',
      dateOfBirth: '',
      firstLastName: '',
      secondLastName: '',
      nationality: '',
      countryOfBirth: '',
      typeIden: '',
      chargeDueDate: '',
      relationship: '',
      positionHeld: ''
    };
    service.add(data);
    const result = service.clear();
    expect(result).toBeTrue();
    expect(service.getAll().length).toBe(0);
  });
});

