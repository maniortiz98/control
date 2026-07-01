import { TestBed } from '@angular/core/testing';
import { OnboardingStateServiceService } from './onboarding-state-service.service';
import { CurrentOnboardingInfo } from '../models/current-onboarding';

describe('OnboardingStateServiceService', () => {
  let service: OnboardingStateServiceService;

  const mockInfo: CurrentOnboardingInfo = {
    requestId: 'REQ-123',
    personType: 'PM',
    name: 'Test Name',
    contractType: 'CT',
    contractSubtype: 'CST',
    businessType: 'BT',
    onboardingId: 10,
    isMaintenance: true,
    isCustomer: true,
    isOnboarding: true,
    clientId: 20,
    accountId: 30,
    accountData: { test: true } as any,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OnboardingStateServiceService],
    });

    service = TestBed.inject(OnboardingStateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize currentInfo with default values', () => {
    const info = service.getCurrentInfo();

    expect(info.requestId).toBe('');
    expect(info.personType).toBe('PF');
    expect(info.onboardingId).toBe(0);
    expect(info.accountData).toBeNull();
  });

  it('should set currentInfo correctly using setCurrentInfo', () => {
    service.setCurrentInfo(mockInfo);

    expect(service.getCurrentInfo()).toEqual(mockInfo);
  });

  it('should return the currentInfo using getCurrentInfo', () => {
    service.setCurrentInfo(mockInfo);

    const info = service.getCurrentInfo();

    expect(info).toBe(mockInfo);
    expect(info.requestId).toBe('REQ-123');
  });

  it('should return requestId from getter when currentInfo is set', () => {
    service.setCurrentInfo(mockInfo);

    expect(service.requestId).toBe('REQ-123');
  });

  it('should return empty string requestId when initialized', () => {
    expect(service.requestId).toBe('');
  });

});