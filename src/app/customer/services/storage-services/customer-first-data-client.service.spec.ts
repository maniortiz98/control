import { TestBed } from '@angular/core/testing';
import { CustomerFirstDataClientService } from './customer-first-data-client.service';

describe('CustomerFirstDataClientService', () => {

  let service: CustomerFirstDataClientService;

  const buildData = (overrides?: any) => ({
    curp: 'CURP123',
    ppe: false,
    firstName: 'Name',
    ...overrides
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerFirstDataClientService]
    });

    service = TestBed.inject(CustomerFirstDataClientService);
  });

  it('getItem inicial es null', () => {
    spyOn(console, 'log');
    expect(service.getItem()).toBeNull();
    expect(console.log).toHaveBeenCalledWith('obteniendo Initial info');
  });

  describe('setItem', () => {

    it('guarda información correctamente', () => {
      spyOn(console, 'log');

      const data = buildData();

      service.setItem(data);

      expect(service.getItem()).toEqual(data);
      expect(console.log).toHaveBeenCalledWith('seteando Initial info');
    });

  });

  describe('updatePpeItem', () => {

    it('actualiza ppe a true', () => {
      const data = buildData({ ppe: false });

      service.setItem(data);
      service.updatePpeItem();

      const result = service.getItem() as any;

      expect(result.ppe).toBeTrue();
    });

    it('no hace nada si no hay datos', () => {
      service.updatePpeItem();

      expect(service.getItem()).toBeNull();
    });

  });

  describe('removeItem', () => {

    it('elimina datos existentes', () => {
      const data = buildData();

      service.setItem(data);
      service.removeItem();

      expect(service.getItem()).toBeNull();
    });

    it('no falla si no hay datos', () => {
      expect(() => service.removeItem()).not.toThrow();
    });

  });

  describe('getDataClientSignal', () => {

    it('retorna la señal', () => {
      const signal = service.getDataClientSignal();

      expect(typeof signal).toBe('function');
      expect(signal()).toBeNull();
    });

    it('refleja cambios en la señal', () => {
      const data = buildData();

      service.setItem(data);

      const signal = service.getDataClientSignal();

      expect(signal()).toEqual(data);
    });

  });

});