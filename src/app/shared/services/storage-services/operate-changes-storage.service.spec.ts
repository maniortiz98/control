import { TestBed } from '@angular/core/testing';

import { OperateChangesStorageService } from './operate-changes-storage.service';

describe('OperateChangesStorageService', () => {
  let service: OperateChangesStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperateChangesStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
