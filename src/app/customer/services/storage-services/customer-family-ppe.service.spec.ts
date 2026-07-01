import { TestBed } from '@angular/core/testing';
import { CustomerFamilyPPEService } from './customer-family-ppe.service';

describe('CustomerFamilyPPEService', () => {

  let service: CustomerFamilyPPEService;

  const buildItem = (overrides?: any) => ({
    rfc: 'RFC1',
    firstName: 'Test',
    ...overrides
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerFamilyPPEService]
    });

    service = TestBed.inject(CustomerFamilyPPEService);
  });

  it('getAll inicial vacío', () => {
    expect(service.getAll()).toEqual([]);
  });

  describe('add', () => {

    it('agrega elemento nuevo', () => {
      const result = service.add(buildItem());

      expect(result).toBeTrue();
      expect(service.getAll().length).toBe(1);
    });

    it('no agrega duplicado por rfc', () => {
      service.add(buildItem());

      const result = service.add(buildItem());

      expect(result).toBeFalse();
      expect(service.getAll().length).toBe(1);
    });

  });

  describe('addList', () => {

    it('reemplaza lista completa', () => {
      const list = [
        buildItem({ rfc: '1' }),
        buildItem({ rfc: '2' })
      ];

      service.addList(list);

      expect(service.getAll()).toEqual(list);
    });

  });

  describe('update', () => {

    it('actualiza si encuentra el rfc', () => {
      service.add(buildItem({ rfc: '1', firstName: 'A' }));

      const result = service.update('1', buildItem({ rfc: '1', firstName: 'B' }));

      expect(result).toBeTrue();
      expect(service.getAll()[0].firstName).toBe('B');
    });

    it('retorna false si no encuentra el rfc', () => {
      const result = service.update('X', buildItem());

      expect(result).toBeFalse();
    });

  });

  describe('delete', () => {

    it('elimina elemento existente', () => {
      service.add(buildItem({ rfc: '1' }));

      const result = service.delete('1');

      expect(result).toBeTrue();
      expect(service.getAll().length).toBe(0);
    });

    it('retorna false si no existe', () => {
      const result = service.delete('X');
      expect(result).toBeFalse();
    });

  });

  describe('clear', () => {

    it('limpia colección', () => {
      service.add(buildItem());

      const result = service.clear();

      expect(result).toBeTrue();
      expect(service.getAll()).toEqual([]);
    });

    it('retorna true aun si está vacío', () => {
      const result = service.clear();

      expect(result).toBeTrue();
      expect(service.getAll()).toEqual([]);
    });

  });

});
``