import { TestBed } from '@angular/core/testing';
import { AddressService } from './address.service';
import { Address } from '../../../onboarding/models/address';


describe('AddressService', () => {
  let service: AddressService;

  beforeEach(() => {
    service = new AddressService();
  });

  it('should add a new address correctly', () => {
    const data: Address = {
      addressRole: 'role1',
      country: 'Country',
      confirmCp: 'YES',
      postalCode: '12345',
      addressType: '',
      federalEntity: '',
      city: '',
      municipality: '',
      neighborhood: '',
      street: '',
      externalNumber: ''
    };

    const result = service.add(data);

    expect(result).toBeTrue();

    const all = service.getAll();
    expect(all.length).toBe(1);
    expect(all[0].addressRole).toBe('role1');
    expect(all[0].country).toBe('Country');
    expect(all[0].postalCode).toBe('12345');
    expect(all[0].taxPostalCode).toBe('12345');
    expect(all[0].idFront).toBeDefined();
  });

  it('should not add a duplicate address', () => {
    const data: Address = {
      addressRole: 'role1', country: 'Country',
      addressType: '',
      postalCode: '',
      federalEntity: '',
      city: '',
      municipality: '',
      neighborhood: '',
      street: '',
      externalNumber: ''
    };
    service.add(data);
    const result = service.add(data);
    expect(result).toBeFalse();
    expect(service.getAll().length).toBe(1);
  });

  it('should validate postal code correctly', () => {
    const data: Address = {
      confirmCp: 'YES', postalCode: '12345',
      addressType: '',
      country: '',
      federalEntity: '',
      city: '',
      municipality: '',
      neighborhood: '',
      street: '',
      externalNumber: ''
    };
    const result = service.validCP(data);
    expect(result).toBeTrue();
  });

  it('should return false when confirmCp is YES or NO and taxPostalCode is missing', () => {
    const data: Address = {
      confirmCp: 'YES',
      addressType: '',
      country: '',
      postalCode: '',
      federalEntity: '',
      city: '',
      municipality: '',
      neighborhood: '',
      street: '',
      externalNumber: ''
    };
    service.add(data); // Añadir para probar validCP
    const result = service.validCP(data);
    expect(result).toBeFalse();
  });

  it('should add an address with empty fields', () => {
    const data: Address = {
      addressRole: 'role1', country: '', city: '',
      addressType: '',
      postalCode: '',
      federalEntity: '',
      municipality: '',
      neighborhood: '',
      street: '',
      externalNumber: ''
    };
    const result = service.add(data);
    expect(result).toBeTrue();
    expect(service.getAll()).toContain({...data, idFront: service.getAll()[0].idFront ?? ''});
  });

  it('should update an existing address', () => {
    const data: Address = {
      addressRole: 'role1', country: 'Country',
      addressType: '',
      postalCode: '',
      federalEntity: '',
      city: '',
      municipality: '',
      neighborhood: '',
      street: '',
      externalNumber: ''
    };
    service.add(data);
    const updatedData: Address = {
      addressRole: 'role1', country: 'NewCountry',
      addressType: '',
      postalCode: '',
      federalEntity: '',
      city: '',
      municipality: '',
      neighborhood: '',
      street: '',
      externalNumber: ''
    };
    const result = service.update(service.getAll()[0].idFront ?? '', updatedData);
    expect(result).toBeTrue();
    expect(service.getAll()).toContain(updatedData);
  });

  it('should not update a non-existing address', () => {
    const updatedData: Address = {
      addressRole: 'role1', country: 'NewCountry',
      addressType: '',
      postalCode: '',
      federalEntity: '',
      city: '',
      municipality: '',
      neighborhood: '',
      street: '',
      externalNumber: ''
    };
    const result = service.update('non-existing-role', updatedData);
    expect(result).toBeFalse();
  });

  it('should add a new PM address correctly', () => {
    const data: Address = {
      addressRole: 'role2', federalEntity: 'Entity',
      addressType: '',
      country: '',
      postalCode: '',
      city: '',
      municipality: '',
      neighborhood: '',
      street: '',
      externalNumber: ''
    };
    const result = service.addPm(data);
    expect(result).toBeTrue();
    expect(service.getAll()).toContain(data);
  });

  it('should not add duplicate PM address', () => {
    const data: Address = {
      addressRole: 'role2', federalEntity: 'Entity',
      addressType: '',
      country: '',
      postalCode: '',
      city: '',
      municipality: '',
      neighborhood: '',
      street: '',
      externalNumber: ''
    };
    service.addPm(data);
    const result = service.addPm(data);
    expect(result).toBeFalse();
    expect(service.getAll().length).toBe(1);
  });

  it('should update an existing PM address', () => {
    const data: Address = {
      addressRole: 'role2', federalEntity: 'Entity',
      addressType: '',
      country: '',
      postalCode: '',
      city: '',
      municipality: '',
      neighborhood: '',
      street: '',
      externalNumber: ''
    };
    service.addPm(data);
    const updatedData: Address = {
      addressRole: 'role2', federalEntity: 'NewEntity',
      addressType: '',
      country: '',
      postalCode: '',
      city: '',
      municipality: '',
      neighborhood: '',
      street: '',
      externalNumber: ''
    };
    const result = service.updatePm('role2', updatedData);
    expect(result).toBeTrue();
    expect(service.getAll()).toContain(updatedData);
  });

  it('should not update a non-existing PM address', () => {
    const updatedData: Address = {
      addressRole: 'role2', federalEntity: 'NewEntity',
      addressType: '',
      country: '',
      postalCode: '',
      city: '',
      municipality: '',
      neighborhood: '',
      street: '',
      externalNumber: ''
    };
    const result = service.updatePm('non-existing-role', updatedData);
    expect(result).toBeFalse();
  });

  it('should delete an existing address', () => {
    const data: Address = {
      addressRole: 'role1', country: 'Country',
      addressType: '',
      postalCode: '',
      federalEntity: '',
      city: '',
      municipality: '',
      neighborhood: '',
      street: '',
      externalNumber: ''
    };
    service.add(data);
    const result = service.delete(service.getAll()[0].idFront ?? '');
    expect(result).toBeTrue();
    expect(service.getAll()).not.toContain(data);
  });

  it('should not delete a non-existing address', () => {
    const result = service.delete('non-existing-role');
    expect(result).toBeFalse();
  });

  it('should clear all addresses', () => {
    const data: Address = {
      addressRole: 'role1', country: 'Country',
      addressType: '',
      postalCode: '',
      federalEntity: '',
      city: '',
      municipality: '',
      neighborhood: '',
      street: '',
      externalNumber: ''
    };
    service.add(data);
    const result = service.clear();
    expect(result).toBeTrue();
    expect(service.getAll()).toEqual([]);
  });

  it('should handle clear when no addresses are set', () => {
    const result = service.clear();
    expect(result).toBeFalse();
  });

  it('should handle multiple addresses correctly', () => {
    const data1: Address = {
      addressRole: 'role1', country: 'Country1',
      addressType: '',
      postalCode: '',
      federalEntity: '',
      city: '',
      municipality: '',
      neighborhood: '',
      street: '',
      externalNumber: ''
    };
    const data2: Address = {
      addressRole: 'role2', country: 'Country2',
      addressType: '',
      postalCode: '',
      federalEntity: '',
      city: '',
      municipality: '',
      neighborhood: '',
      street: '',
      externalNumber: ''
    };
    service.add(data1);
    service.add(data2);
    expect(service.getAll().length).toBe(2);
  });
});

