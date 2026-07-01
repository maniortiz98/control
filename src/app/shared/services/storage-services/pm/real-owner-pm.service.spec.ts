import { TestBed } from '@angular/core/testing';

import { RealOwnerPmService } from './real-owner-pm.service';

describe('RealOwnerPmService', () => {
  let service: RealOwnerPmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealOwnerPmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with null data', () => {
    expect(service.getRealOwnerPm()).toBeNull();
    expect(service.realOwnerPm()).toBeNull();
  });

  it('should store and return real owner data', () => {
    const item = {
      id: 'RO-01',
      name: 'Real Owner Test',
    } as any;

    service.setRealOwnerPm(item);

    expect(service.getRealOwnerPm()).toEqual(item);
    expect(service.realOwnerPm()).toEqual(item);
  });

  it('should clear stored data', () => {
    const item = {
      id: 'RO-01',
      name: 'Real Owner Test',
    } as any;

    service.setRealOwnerPm(item);
    service.clearRealOwnerPM();

    expect(service.getRealOwnerPm()).toBeNull();
    expect(service.realOwnerPm()).toBeNull();
  });
});

describe('RealOwnerPmService', () => {
  let service: RealOwnerPmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealOwnerPmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
