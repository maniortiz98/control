import { TestBed } from '@angular/core/testing';

import { ResourceProviderPmService } from './resource-provider-pm.service';

describe('ResourceProviderPmService', () => {
  let service: ResourceProviderPmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResourceProviderPmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with null data', () => {
    expect(service.getResourceProviderPm()).toBeNull();
    expect(service.resourceProviderPm()).toBeNull();
  });

  it('should store and return the resource provider data', () => {
    const item = {
      id: 'RP-01',
      name: 'Provider',
    } as any;

    service.setResourceProviderPm(item);

    expect(service.getResourceProviderPm()).toEqual(item);
    expect(service.resourceProviderPm()).toEqual(item);
  });

  it('should start with null when no data has been set', () => {
    expect(service.getResourceProviderPm()).toBeNull();
    expect(service.resourceProviderPm()).toBeNull();
  });
});
