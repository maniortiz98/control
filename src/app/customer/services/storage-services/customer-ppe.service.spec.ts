import { TestBed } from '@angular/core/testing';
import { CustomerPpeService } from './customer-ppe.service';

describe('CustomerPpeService', () => {

  let service: CustomerPpeService;

  const buildData = (overrides?: any) => ({
    name: 'Test',
    ...overrides
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomerPpeService]
    });

    service = TestBed.inject(CustomerPpeService);
  });

  it('get inicial es null', () => {
    expect(service.get()).toBeNull();
  });

  it('set guarda datos y marca isRequested', () => {
    const data = buildData();

    const result = service.set(data);

    expect(result).toBeTrue();
    expect(service.get()).toEqual(data);
    expect(service.isRequested()).toBeTrue();
  });

  it('clear limpia datos cuando existen', () => {
    const data = buildData();

    service.set(data);
    service.setCopy(data);

    const result = service.clear();

    expect(result).toBeTrue();
    expect(service.get()).toBeNull();
    expect(service.getCopy()).toBeNull();
    expect(service.isRequested()).toBeFalse();
  });

  it('clear retorna false si no hay datos', () => {
    const result = service.clear();

    expect(result).toBeFalse();
    expect(service.isRequested()).toBeFalse();
  });

  it('getCopy inicial es null', () => {
    expect(service.getCopy()).toBeNull();
  });

  it('setCopy guarda datos correctamente', () => {
    const data = buildData();

    const result = service.setCopy(data);

    expect(result).toBeTrue();
    expect(service.getCopy()).toEqual(data);
  });

});
``