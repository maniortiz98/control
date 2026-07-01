import { TestBed } from '@angular/core/testing';

import { AdministratorExercisingPfControlService } from './administrator-exercising-pf-control.service';

describe('AdministratorExercisingPfControlService', () => {
  let service: AdministratorExercisingPfControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdministratorExercisingPfControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with null data', () => {
    expect(service.get()).toBeNull();
  });

  it('should set and return the stored data', () => {
    const data = {
      id: 'A-01',
      status: 'ACTIVE',
    } as any;

    expect(service.set(data)).toBeTrue();
    expect(service.get()).toEqual(data);
  });

  it('should clear the stored data when clear is called and data exists', () => {
    const data = {
      id: 'A-01',
      status: 'ACTIVE',
    } as any;

    service.set(data);

    expect(service.clear()).toBeTrue();
    expect(service.get()).toBeNull();
  });

  it('should return false when clear is called without data', () => {
    expect(service.clear()).toBeFalse();
    expect(service.get()).toBeNull();
  });
});
