import { TestBed } from '@angular/core/testing';

import { EntityStatusService } from './entity-status.service';

describe('EntityStatusService', () => {
  let service: EntityStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with null entity status', () => {
    expect(service.getEntityStatusPm()).toBeNull();
    expect(service.entityStatusPm()).toBeNull();
  });

  it('should store and return entity status data', () => {
    const item = {
      id: 'ES-01',
      active: true,
    } as any;

    service.setEntityStatusPm(item);

    expect(service.getEntityStatusPm()).toEqual(item);
    expect(service.entityStatusPm()).toEqual(item);
  });

  it('should clear entity status data', () => {
    const item = {
      id: 'ES-01',
      active: true,
    } as any;

    service.setEntityStatusPm(item);
    service.clearEntityStatusPm();

    expect(service.getEntityStatusPm()).toBeNull();
    expect(service.entityStatusPm()).toBeNull();
  });
});
