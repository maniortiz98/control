import { TestBed } from '@angular/core/testing';

import { TrustService } from './trust.service';

describe('TrustService', () => {
  let service: TrustService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrustService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with null data', () => {
    expect(service.getInternTrust()).toBeNull();
    expect(service.internTrust()).toBeNull();
  });

  it('should store and return intern trust data', () => {
    const item = {
      id: 'T-01',
      name: 'Trust Test',
    } as any;

    service.setInternTrust(item);

    expect(service.getInternTrust()).toEqual(item);
    expect(service.internTrust()).toEqual(item);
  });

  it('should clear intern trust data', () => {
    const item = {
      id: 'T-01',
      name: 'Trust Test',
    } as any;

    service.setInternTrust(item);
    service.clearInternTrust();

    expect(service.getInternTrust()).toBeNull();
    expect(service.internTrust()).toBeNull();
  });
});
