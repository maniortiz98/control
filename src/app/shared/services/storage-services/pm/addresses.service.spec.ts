import { TestBed } from '@angular/core/testing';

import { AddressesService } from './addresses.service';

describe('AddressesService', () => {
  let service: AddressesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddressesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with null data', () => {
    expect(service.get()).toBeNull();
  });

  it('should store and return the address data', () => {
    const data = {
      addressId: 1,
      addressType: 'HOME',
      country: 'MX',
      postalCode: '28001',
    } as any;

    expect(service.set(data)).toBeTrue();
    expect(service.get()).toEqual(data);
  });

  it('should clear the stored data when clear is called and data exists', () => {
    const data = {
      addressId: 1,
      addressType: 'HOME',
      country: 'MX',
      postalCode: '28001',
    } as any;

    service.set(data);

    expect(service.clear()).toBeTrue();
    expect(service.get()).toBeNull();
  });

  it('should return false when clear is called without stored data', () => {
    expect(service.clear()).toBeFalse();
    expect(service.get()).toBeNull();
  });
});
