import { TestBed } from '@angular/core/testing';

import { CheckpointService } from './checkpoint.service';
import { HttpClientService } from '../../core/services/http-client.service';
import { of } from 'rxjs';
import { OnboardingService } from '../../onboarding/services/onboarding.service';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { SaveCheckpointMantResponse, SaveCheckpointResponse } from '../models/checkpoint';
import { CheckpointSectionsPF, CheckpointSectionsPM } from '../../onboarding/constants/checkpoint-sections';
import { CurrentOnboardingInfo } from '../../onboarding/models/current-onboarding';
import { UserInfo } from '../../core/models/user-info';
import { signal } from '@angular/core';
import * as CHECKPOINT_SECTIONS from '../../onboarding/constants/checkpoint-sections';

describe('CheckpointService', () => {
  let service: CheckpointService;
  let httpServiceSpy: jasmine.SpyObj<HttpClientService>;
  let onboardingServiceSpy: jasmine.SpyObj<OnboardingService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const createCurrentInfo = (overrides: Partial<CurrentOnboardingInfo> = {}): CurrentOnboardingInfo => ({
    requestId: 'REQ-123',
    personType: 'PF',
    name: 'Test User',
    contractType: 'contract',
    contractSubtype: 'subtype',
    businessType: 'BANKING',
    onboardingId: 1,
    isMaintenance: false,
    isCustomer: false,
    isOnboarding: true,
    clientId: 999,
    accountId: 555,
    accountData: null,
    ...overrides,
  });

  const createUserInfo = (overrides: Partial<UserInfo> = {}): UserInfo => ({
    name: 'User',
    username: 'user.test',
    employeeId: 'EMP-001',
    homeAccountId: 'home',
    localAccountId: 'local',
    idToken: 'token',
    roles: [],
    rol: '',
    ...overrides,
  });

  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('HttpClientService', ['post']);
    const onboardingSpy = jasmine.createSpyObj('OnboardingService', ['getCurrentInfo']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getUserInfo']);

    TestBed.configureTestingModule({
      providers: [
        CheckpointService,
        { provide: HttpClientService, useValue: httpSpy },
        { provide: OnboardingService, useValue: onboardingSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    });

    service = TestBed.inject(CheckpointService);
    httpServiceSpy = TestBed.inject(HttpClientService) as jasmine.SpyObj<HttpClientService>;
    onboardingServiceSpy = TestBed.inject(OnboardingService) as jasmine.SpyObj<OnboardingService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    onboardingServiceSpy.getCurrentInfo.and.returnValue(createCurrentInfo());
    authServiceSpy.getUserInfo.and.returnValue(signal<UserInfo>(createUserInfo()));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save a section', () => {
    const mockCurrentInfo = createCurrentInfo({ requestId: '123' });
    const mockResponse: SaveCheckpointResponse = {
      applicationNumber: 123,
      sectionId: '',
      status: ''
    };
    const body = { street: 'A' };

    onboardingServiceSpy.getCurrentInfo.and.returnValue(mockCurrentInfo);
    httpServiceSpy.post.and.returnValue(of(mockResponse));

    service.saveSection('address', body).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpServiceSpy.post).toHaveBeenCalledWith(environment.api.services.saveCheckpoint, {
      clientId: '123',
      sectionId: 'address',
      data: body,
    });
  });

  it('should include customer number when saving a section for customer flow', () => {
    const mockCurrentInfo = createCurrentInfo({
      requestId: 'APP-789',
      isCustomer: true,
      clientId: 321,
    });
    const body = { city: 'CDMX' };
    const mockResponse: SaveCheckpointResponse = {
      applicationNumber: 789,
      sectionId: 'address',
      status: 'OK',
    };

    onboardingServiceSpy.getCurrentInfo.and.returnValue(mockCurrentInfo);
    httpServiceSpy.post.and.returnValue(of(mockResponse));

    service.saveSection('address', body).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpServiceSpy.post).toHaveBeenCalledWith(environment.api.services.saveCheckpoint, {
      clientId: 'APP-789',
      sectionId: 'address',
      data: body,
      customerNumber: 321,
    });
  });

  it('should save a section in maintenance mode', () => {
    const mockCurrentInfo = createCurrentInfo({
      clientId: 101,
      accountId: 202,
    });
    const mockUserInfoSignal = signal<UserInfo>(createUserInfo({ employeeId: 'EMP-123' }));
    const mockResponse: SaveCheckpointMantResponse = {
      applicationNumber: '1',
      sectionId: '1',
      status: '1'
    };
    const body = { state: 'MX' };

    onboardingServiceSpy.getCurrentInfo.and.returnValue(mockCurrentInfo);
    authServiceSpy.getUserInfo.and.returnValue(mockUserInfoSignal);
    httpServiceSpy.post.and.returnValue(of(mockResponse));

    service.saveSectionMant('address', body).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpServiceSpy.post).toHaveBeenCalledWith(environment.api.services.saveCheckpointMant, {
      clientId: 101,
      sectionId: 'address',
      accountId: 202,
      advisorId: 'EMP-123',
      data: body,
    });
  });

  it('should get a section', () => {
    const mockCurrentInfo = createCurrentInfo({ requestId: 'APP-001' });
    const sectionIds = ['address'] as any;
    const mockResponse = { sectionData: {} };

    onboardingServiceSpy.getCurrentInfo.and.returnValue(mockCurrentInfo);
    httpServiceSpy.post.and.returnValue(of(mockResponse));

    service.getSection(sectionIds).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpServiceSpy.post).toHaveBeenCalledWith(environment.api.services.getCheckpoints, {
      applicationId: 'APP-001',
      sectionId: sectionIds,
    });
  });

  it('should get sections by persona fisica', () => {
    const mockCurrentInfo = createCurrentInfo({ requestId: 'APP-PF' });
    const mockResponse = { sections: [] };

    onboardingServiceSpy.getCurrentInfo.and.returnValue(mockCurrentInfo);
    httpServiceSpy.post.and.returnValue(of(mockResponse));

    service.getSectionsByPersonaFisica().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpServiceSpy.post).toHaveBeenCalledWith(environment.api.services.getCheckpoints, {
      applicationId: 'APP-PF',
      sectionId: CheckpointSectionsPF,
    });
  });

  it('should get sections by persona moral', () => {
    const mockCurrentInfo = createCurrentInfo({ requestId: 'APP-PM' });
    const mockResponse = { sections: [] };

    onboardingServiceSpy.getCurrentInfo.and.returnValue(mockCurrentInfo);
    httpServiceSpy.post.and.returnValue(of(mockResponse));

    service.getSectionsByPersonaMoral().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpServiceSpy.post).toHaveBeenCalledWith(environment.api.services.getCheckpoints, {
      applicationId: 'APP-PM',
      sectionId: CheckpointSectionsPM,
    });
  });

  it('should get maintenance sections by persona fisica', () => {
    const mockCurrentInfo = createCurrentInfo({
      clientId: 700,
      accountId: 800,
      businessType: 'PRIVATE_BANKING',
    });
    const mockResponse = { sections: [] };

    onboardingServiceSpy.getCurrentInfo.and.returnValue(mockCurrentInfo);
    httpServiceSpy.post.and.returnValue(of(mockResponse));

    service.getMaintenanceSectionsByPersonaFisica().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpServiceSpy.post).toHaveBeenCalledWith(environment.api.services.getCheckpointsMant, {
      applicationId: 700,
      accountId: 800,
      bankingAreaId: 'PRIVATE_BANKING',
      sectionId: CHECKPOINT_SECTIONS.CheckpointMaintenanceSectionsPF,
    });
  });

  it('should get a maintenance section by persona fisica', () => {
    const mockCurrentInfo = createCurrentInfo({
      clientId: 111,
      accountId: 222,
      businessType: 'WEALTH',
    });
    const sectionIds = ['address'] as any;
    const mockResponse = { section: {} };

    onboardingServiceSpy.getCurrentInfo.and.returnValue(mockCurrentInfo);
    httpServiceSpy.post.and.returnValue(of(mockResponse));

    service.getMaintenanceSectionByPersonaFisica(sectionIds).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpServiceSpy.post).toHaveBeenCalledWith(environment.api.services.getCheckpointsMant, {
      applicationId: 111,
      accountId: 222,
      bankingAreaId: 'WEALTH',
      sectionId: sectionIds,
    });
  });

  it('should get sections by customer', () => {
    const mockCurrentInfo = createCurrentInfo({ clientId: 5050 });
    const mockResponse = { sections: [] };

    onboardingServiceSpy.getCurrentInfo.and.returnValue(mockCurrentInfo);
    httpServiceSpy.post.and.returnValue(of(mockResponse));

    service.getSectionsByCustomer().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(httpServiceSpy.post).toHaveBeenCalledWith(environment.api.services.getCheckpointsCustomer, {
      customerNumber: 5050,
    });
  });

});
