import { TestBed } from '@angular/core/testing';

import { FamilyPPEService } from './family-ppe.service';
import { DataClientFamilyPPE } from '../../../onboarding/models/client-data';

describe('FamilyPPEService', () => {
  let service: FamilyPPEService;

  beforeEach(() => {
    service = new FamilyPPEService();
  });

  it('should add a new object correctly', () => {
    const data: DataClientFamilyPPE = {
      rfc: '123',
      curp: '',
      foreignerWithoutCurp: false,
      typeIden: '',
      dateOfBirth: '',
      nationality: '',
      countryOfBirth: '',
      stateOfBirth: '',
      firstName: '',
      middleName: '',
      firstLastName: '',
      secondLastName: '',
      chargeDueDate: '',
      relationship: '',
      positionHeld: ''
    };
    const result = service.add(data);
    expect(result).toBeTrue();
    expect(service.getAll()).toContain(data);
  });

  it('should not add a duplicate object', () => {
    const data: DataClientFamilyPPE = {
      rfc: '123',
      curp: '',
      foreignerWithoutCurp: false,
      typeIden: '',
      dateOfBirth: '',
      nationality: '',
      countryOfBirth: '',
      stateOfBirth: '',
      firstName: '',
      middleName: '',
      firstLastName: '',
      secondLastName: '',
      chargeDueDate: '',
      relationship: '',
      positionHeld: ''
    };
    service.add(data);
    const result = service.add(data);
    expect(result).toBeFalse();
    expect(service.getAll().length).toBe(1);
  });

  it('should add a list of objects', () => {
    const dataList: DataClientFamilyPPE[] = [
      {
        rfc: '123',
        curp: '',
        foreignerWithoutCurp: false,
        typeIden: '',
        dateOfBirth: '',
        nationality: '',
        countryOfBirth: '',
        stateOfBirth: '',
        firstName: '',
        middleName: '',
        firstLastName: '',
        secondLastName: '',
        chargeDueDate: '',
        relationship: '',
        positionHeld: ''
      },
      {
        rfc: '456',
        curp: '',
        foreignerWithoutCurp: false,
        typeIden: '',
        dateOfBirth: '',
        nationality: '',
        countryOfBirth: '',
        stateOfBirth: '',
        firstName: '',
        middleName: '',
        firstLastName: '',
        secondLastName: '',
        chargeDueDate: '',
        relationship: '',
        positionHeld: ''
      }
    ];
    service.addList(dataList);
    expect(service.getAll()).toEqual(dataList);
  });

  it('should update an existing object', () => {
    const data: DataClientFamilyPPE = {
      rfc: '123',
      curp: '',
      foreignerWithoutCurp: false,
      typeIden: '',
      dateOfBirth: '',
      nationality: '',
      countryOfBirth: '',
      stateOfBirth: '',
      firstName: '',
      middleName: '',
      firstLastName: '',
      secondLastName: '',
      chargeDueDate: '',
      relationship: '',
      positionHeld: ''
    };
    service.add(data);
    const updatedData: DataClientFamilyPPE = {
      rfc: '123',
      curp: '',
      foreignerWithoutCurp: false,
      typeIden: '',
      dateOfBirth: '',
      nationality: '',
      countryOfBirth: '',
      stateOfBirth: '',
      firstName: '',
      middleName: '',
      firstLastName: '',
      secondLastName: '',
      chargeDueDate: '',
      relationship: '',
      positionHeld: ''
    };
    const result = service.update('123', updatedData);
    expect(result).toBeTrue();
    expect(service.getAll()).toContain(updatedData);
  });

  it('should not update a non-existing object', () => {
    const updatedData: DataClientFamilyPPE = {
      rfc: '123',
      curp: '',
      foreignerWithoutCurp: false,
      typeIden: '',
      dateOfBirth: '',
      nationality: '',
      countryOfBirth: '',
      stateOfBirth: '',
      firstName: '',
      middleName: '',
      firstLastName: '',
      secondLastName: '',
      chargeDueDate: '',
      relationship: '',
      positionHeld: ''
    };
    const result = service.update('123', updatedData);
    expect(result).toBeFalse();
  });

  it('should delete an existing object', () => {
    const data: DataClientFamilyPPE = {
      rfc: '123',
      curp: '',
      foreignerWithoutCurp: false,
      typeIden: '',
      dateOfBirth: '',
      nationality: '',
      countryOfBirth: '',
      stateOfBirth: '',
      firstName: '',
      middleName: '',
      firstLastName: '',
      secondLastName: '',
      chargeDueDate: '',
      relationship: '',
      positionHeld: ''
    };
    service.add(data);
    const result = service.delete('123');
    expect(result).toBeTrue();
    expect(service.getAll()).not.toContain(data);
  });

  it('should not delete a non-existing object', () => {
    const result = service.delete('123');
    expect(result).toBeFalse();
  });

  it('should clear all objects', () => {
    const data: DataClientFamilyPPE = {
      rfc: '123',
      curp: '',
      foreignerWithoutCurp: false,
      typeIden: '',
      dateOfBirth: '',
      nationality: '',
      countryOfBirth: '',
      stateOfBirth: '',
      firstName: '',
      middleName: '',
      firstLastName: '',
      secondLastName: '',
      chargeDueDate: '',
      relationship: '',
      positionHeld: ''
    };
    service.add(data);
    const result = service.clear();
    expect(result).toBeTrue();
    expect(service.getAll()).toEqual([]);
  });
});
