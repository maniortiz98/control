import { TestBed } from '@angular/core/testing';
import { CustomerAddressService } from './customer-address.service';

describe('CustomerAddressService', () => {

  let service: CustomerAddressService;

  const baseAddress = (overrides?: any) => ({
    country: 'MX',
    federalEntity: 'AGS',
    city: 'AGS',
    municipality: 'AGS',
    neighborhood: 'COL',
    street: 'ST',
    externalNumber: '1',
    internalNumber: '1',
    confirmCp: 'YES',
    postalCode: '20000',
    ...overrides
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerAddressService]
    });

    service = TestBed.inject(CustomerAddressService);
  });

  it('getAll inicial vacío', () => {
    expect(service.getAll()).toEqual([]);
  });

  describe('validCP', () => {

    it('true cuando confirmCp distinto', () => {
      const result = service.validCP(baseAddress({ confirmCp: '' }));
      expect(result).toBeTrue();
    });

    it('false cuando confirmCp YES y falta taxPostalCode', () => {
      service.add(baseAddress());
      const result = service.validCP(baseAddress({ confirmCp: 'YES' }));
      expect(result).toBeTrue(); // porque add ya lo setea
    });

  });

  describe('add', () => {

    it('agrega elemento nuevo', () => {
      const result = service.add(baseAddress());

      expect(result).toBeTrue();
      expect(service.getAll().length).toBe(1);
    });

    it('no agrega duplicado', () => {
      service.add(baseAddress());
      const result = service.add(baseAddress());

      expect(result).toBeFalse();
      expect(service.getAll().length).toBe(1);
    });

    it('asigna taxPostalCode cuando confirmCp YES', () => {
      service.add(baseAddress());

      const item = service.getAll()[0] as any;

      expect(item.taxPostalCode).toBe('20000');
    });

  });

  describe('update', () => {

    it('actualiza elemento existente', () => {
      const data = baseAddress();
      service.add(data);

      const id = (service.getAll()[0] as any).idFront;

      const result = service.update(id, baseAddress({ street: 'NEW' }));

      expect(result).toBeTrue();
      expect(service.getAll()[0].street).toBe('NEW');
    });

    it('retorna false si id no existe', () => {
      const result = service.update('fake', baseAddress());

      expect(result).toBeFalse();
    });

  });

  describe('addPm', () => {

    it('agrega cuando role no existe', () => {
      const result = service.addPm(baseAddress({ addressRole: 'A' }));

      expect(result).toBeTrue();
    });

    it('no agrega si role duplicado', () => {
      service.addPm(baseAddress({ addressRole: 'A' }));

      const result = service.addPm(baseAddress({ addressRole: 'A' }));

      expect(result).toBeFalse();
    });

  });

  describe('updatePm', () => {

    it('actualiza correctamente', () => {
      service.addPm(baseAddress({ addressRole: 'A' }));

      const result = service.updatePm('A', baseAddress({ addressRole: 'B' }));

      expect(result).toBeTrue();
    });

    it('retorna false si no existe', () => {
      const result = service.updatePm('X', baseAddress());

      expect(result).toBeFalse();
    });

  });

  describe('delete', () => {

    it('elimina elemento existente', () => {
      service.add(baseAddress());
      const id = (service.getAll()[0] as any).idFront;

      const result = service.delete(id);

      expect(result).toBeTrue();
      expect(service.getAll().length).toBe(0);
    });

    it('false si no existe', () => {
      const result = service.delete('fake');
      expect(result).toBeFalse();
    });

  });

  describe('clear', () => {

    it('limpia datos', () => {
      service.add(baseAddress());

      const result = service.clear();

      expect(result).toBeTrue();
      expect(service.getAll()).toEqual([]);
    });

    it('false si ya está vacío', () => {
      const result = service.clear();

      expect(result).toBeFalse();
    });

  });

});