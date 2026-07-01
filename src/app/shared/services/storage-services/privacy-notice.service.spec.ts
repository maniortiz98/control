import { TestBed } from '@angular/core/testing';

import { PrivacyNoticeService } from './privacy-notice.service';

describe('PrivacyNoticeService', () => {
  let service: PrivacyNoticeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrivacyNoticeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
