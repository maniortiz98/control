import { TestBed } from '@angular/core/testing';

import { CustomerIdentificationPmService } from './customer-identification-pm.service';

describe('CustomerIdentificationPmService', () => {
  let service: CustomerIdentificationPmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerIdentificationPmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with null data', () => {
    expect(service.getItem()).toBeNull();
  });

  it('should store and retrieve the item', () => {
    const item = {
      id: '001',
      name: 'Test PM',
    } as any;

    service.setItem(item);

    expect(service.getItem()).toEqual(item);
  });

  it('should clear the item when removeItem is called with stored data', () => {
    const item = {
      id: '001',
      name: 'Test PM',
    } as any;

    service.setItem(item);
    service.removeItem();

    expect(service.getItem()).toBeNull();
  });

  it('should keep null when removeItem is called without stored data', () => {
    service.removeItem();

    expect(service.getItem()).toBeNull();
  });
});
