import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial value', () => {
    expect(service.loading()).toBeFalse();
  });

  it('should update to true when calling show()', () => {
    service.show();
    expect(service.loading()).toBeTrue();
  });

  it('should update to false when calling hide()', () => {
    service.hide();
    expect(service.loading()).toBeFalse();
  });

});
