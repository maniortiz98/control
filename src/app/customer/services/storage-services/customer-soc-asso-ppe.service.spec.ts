import { TestBed } from '@angular/core/testing';
import { CustomerSocAssoPPEService } from './customer-soc-asso-ppe.service';

describe('CustomerSocAssoPPEService', () => {

  let service: CustomerSocAssoPPEService;

  const buildItem = (overrides?: any) => ({
    rfc: 'RFC1',
    companyName: 'Test',
    ...overrides
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerSocAssoPPEService]
    });

    service = TestBed.inject(CustomerSocAssoPPEService);
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
      service.add(buildItem({ rfc: '1', companyName: 'A' }));

      const result = service.update('1', buildItem({ rfc: '1', companyName: 'B' }));

      expect(result).toBeTrue();
      expect(service.getAll()[0].companyName).toBe('B');
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