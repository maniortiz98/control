import { TestBed } from '@angular/core/testing';

import { AddressesService } from './addresses.service';
import { DataClientAddres } from '../../../onboarding/models/client-data';

describe('AddressesService', () => {
  let service: AddressesService;

  beforeEach(() => {
    service = new AddressesService();
  });

  it('should set an address correctly', () => {
    const data: DataClientAddres = {
      addressList: []
    };
    const result = service.set(data);
    expect(result).toBeTrue();
    expect(service.get()).toEqual(data);
  });

  it('should get the address correctly', () => {
    const data: DataClientAddres = {
      addressList: []
    };
    service.set(data);
    const result = service.get();
    expect(result).toEqual(data);
    service.setCopy(data);
    const resultC = service.getCopy();
    expect(resultC).toEqual(data);
  });

  it('should clear the address correctly', () => {
    const data: DataClientAddres = {
      addressList: []
    };
    service.set(data);
    const result = service.clear();
    expect(result).toBeTrue();
    expect(service.get()).toBeNull();
  });

  it('should handle clearing when no address is set', () => {
    const result = service.clear();
    expect(result).toBeFalse();
  });
});
