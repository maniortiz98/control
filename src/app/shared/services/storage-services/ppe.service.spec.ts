import { TestBed } from '@angular/core/testing';

import { PpeService } from './ppe.service';
import { DataClientPPE } from '../../../onboarding/models/client-data';

describe('PpeService', () => {
  let service: PpeService;

  beforeEach(() => {
    service = new PpeService();
  });

  it('should set an object correctly', () => {
    const data: DataClientPPE = {
      ppe: false,
      fppe: '',
      dppe: '',
      sappe: '',
      dataClientFamilyPPE: [],
      dataClientDepPPE: [],
      dataClientSocAndAssoPPE: []
    };
    const result = service.set(data);
    expect(result).toBeTrue();
    expect(service.get()).toEqual(data);
  });

  it('should get the object correctly', () => {
    const data: DataClientPPE = {
      ppe: false,
      fppe: '',
      dppe: '',
      sappe: '',
      dataClientFamilyPPE: [],
      dataClientDepPPE: [],
      dataClientSocAndAssoPPE: []
    };
    service.set(data);
    const result = service.get();
    expect(result).toEqual(data);
  });

  it('should clear the object correctly', () => {
    const data: DataClientPPE = {
      ppe: false,
      fppe: '',
      dppe: '',
      sappe: '',
      dataClientFamilyPPE: [],
      dataClientDepPPE: [],
      dataClientSocAndAssoPPE: []
    };
    service.set(data);
    const result = service.clear();
    expect(result).toBeTrue();
    expect(service.get()).toBeNull();
  });

  it('should handle clearing when no object is set', () => {
    const result = service.clear();
    expect(result).toBeFalse();
  });
});
