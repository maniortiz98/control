import { TestBed } from '@angular/core/testing';
import { UnsavedChangesService } from './unsaved-changes.service';

describe('UnsavedChangesService', () => {
  let service: UnsavedChangesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnsavedChangesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial value of hasUnsavedChanges as false', () => {
    expect(service.hasUnsavedChanges).toBeFalse();
  });

  it('should set hasUnsavedChanges to true', () => {
    service.setUnsavedChanges(true);
    expect(service.hasUnsavedChanges).toBeTrue();
  });

  it('should set hasUnsavedChanges to false', () => {
    service.setUnsavedChanges(false);
    expect(service.hasUnsavedChanges).toBeFalse();
  });
});