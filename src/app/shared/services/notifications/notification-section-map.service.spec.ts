import { TestBed } from '@angular/core/testing';

import { NotificationSectionMapService } from './notification-section-map.service';

describe('NotificationSectionMapService', () => {
  let service: NotificationSectionMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationSectionMapService],
    });

    service = TestBed.inject(NotificationSectionMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the mapped enum for addressList', () => {
    expect(service.enumForList('addressList')).toBe('TAX_ADDRESS');
  });

  it('should return the mapped enum for telephones', () => {
    expect(service.enumForList('telephones')).toBe('PHONE');
  });

  it('should return the mapped enum for emails', () => {
    expect(service.enumForList('emails')).toBe('EMAIL_ADDRESS');
  });

  it('should return the mapped enum for residenceList and postalAddress', () => {
    expect(service.enumForList('residenceList')).toBe('RESIDENCE_ADDRESS');
    expect(service.enumForList('postalAddress')).toBe('POSTAL_ADDRESS');
  });

  it('should return null for an unknown list name', () => {
    expect(service.enumForList('unknown')).toBeNull();
  });
});