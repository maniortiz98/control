import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { PermissionRolService } from '../../../core/services/rol.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { PrivacyNoticeService } from '../../../shared/services/storage-services/privacy-notice.service';
import { OnboardingService } from '../../services/onboarding.service';
import { PrivacyNoticeComponent } from './privacy-notice.component';

describe('PrivacyNoticeComponent', () => {
  let component: PrivacyNoticeComponent;
  let fixture: ComponentFixture<PrivacyNoticeComponent>;

  let currentInfo: { isMaintenance: boolean };
  let onboardingRegister: Record<string, unknown>;
  let permissions: { 'privacy-notice': { allDisabled: boolean } };
  let privacyData: any;

  let onboardingServiceMock: any;
  let permissionRolServiceMock: any;
  let authServiceMock: any;
  let unsavedChangesServiceMock: any;
  let privacyNoticeServiceMock: any;
  let notificationsServiceMock: any;
  let checkpointServiceMock: any;
  let routerMock: any;

  const createComponent = () => {
    fixture = TestBed.createComponent(PrivacyNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    return component;
  };

  beforeEach(async () => {
    currentInfo = { isMaintenance: false };
    onboardingRegister = {};
    permissions = { 'privacy-notice': { allDisabled: false } };
    privacyData = {
      marketing: {
        id: 11,
        marketingConsent: false,
        advertisingConsentActinverGroup: false,
        rejectFinancialOffersFromActinver: false,
      },
      privacyNotice: {
        id: 22,
        consentToPrimaryDataProcessing: true,
        consentToSecondaryUse: true,
        consentToMarketingContactAndDataTransfer: true,
      },
      active: true,
    };

    onboardingServiceMock = {
      getCurrentInfo: jasmine.createSpy('getCurrentInfo').and.callFake(() => currentInfo),
      getOnboardingRegister: jasmine.createSpy('getOnboardingRegister').and.callFake(() => onboardingRegister),
      btnConfirmData: { set: jasmine.createSpy('btnConfirmData.set') },
      btnConfirmDataDisabled: { set: jasmine.createSpy('btnConfirmDataDisabled.set') },
    };
    permissionRolServiceMock = {
      getPermissions: jasmine.createSpy('getPermissions').and.callFake(() => permissions),
    };
    authServiceMock = {
      getUserInfo: jasmine.createSpy('getUserInfo').and.returnValue(() => ({ rol: 'ROL_ANALISTA_DE_CONTRATOS' })),
    };
    unsavedChangesServiceMock = {
      setUnsavedChanges: jasmine.createSpy('setUnsavedChanges'),
    };
    privacyNoticeServiceMock = {
      defaultPrivacyNoticeData: [{ key: 'marketingConsent' }],
      initialPrivacyNoticeData: structuredClone(privacyData),
      privacyNoticeData: Object.assign(
        jasmine.createSpy('privacyNoticeData').and.callFake(() => structuredClone(privacyData)),
        { set: jasmine.createSpy('privacyNoticeData.set') }
      ),
    };
    notificationsServiceMock = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error'),
    };
    checkpointServiceMock = {
      saveSection: jasmine.createSpy('saveSection').and.returnValue(of({ status: 'CREATED' })),
      saveSectionMant: jasmine.createSpy('saveSectionMant').and.returnValue(of({ status: 'CREATED' })),
    };
    routerMock = {
      navigate: jasmine.createSpy('navigate'),
    };

    await TestBed.configureTestingModule({
      declarations: [PrivacyNoticeComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: OnboardingService, useValue: onboardingServiceMock },
        { provide: PermissionRolService, useValue: permissionRolServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: UnsavedChangesService, useValue: unsavedChangesServiceMock },
        { provide: PrivacyNoticeService, useValue: privacyNoticeServiceMock },
        { provide: NotificationsService, useValue: notificationsServiceMock },
        { provide: CheckpointService, useValue: checkpointServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: {} },
      ],
    })
      .overrideComponent(PrivacyNoticeComponent, {
        set: { template: '' },
      })
      .compileComponents();
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it('creates with computed flags and disabled privacy controls', () => {
    createComponent();

    expect(component).toBeTruthy();
    expect(component.isMaintenance()).toBeFalse();
    expect(component.isEditable()).toBeFalse();
    expect(component.hasRolePermissionToEdit()).toBeTrue();
    expect(component.privacyChecksArr.length).toBe(1);
    expect(component.form.get('consentToPrimaryDataProcessing')?.disabled).toBeTrue();
    expect(component.form.get('consentToSecondaryUse')?.disabled).toBeTrue();
    expect(component.form.get('consentToMarketingContactAndDataTransfer')?.disabled).toBeTrue();
  });

  it('disables the full form on maintenance startup and snapshots the initial data', () => {
    currentInfo.isMaintenance = true;

    createComponent();

    expect(component.form.disabled).toBeTrue();
    expect(component.isMaintenance()).toBeTrue();
    expect(privacyNoticeServiceMock.initialPrivacyNoticeData).toEqual(privacyData);
  });

  it('redirects to finalization when onboarding register already exists', () => {
    onboardingRegister = { id: 99 };

    createComponent();

    expect(routerMock.navigate).toHaveBeenCalledWith(['../../finalization'], { relativeTo: TestBed.inject(ActivatedRoute) });
  });

  it('keeps the user on the page when onboarding register is empty', () => {
    createComponent();

    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('tracks unsaved changes from pristine events', () => {
    createComponent();

    component.form.markAsDirty();

    expect(unsavedChangesServiceMock.setUnsavedChanges).toHaveBeenCalledWith(true);
    expect(onboardingServiceMock.btnConfirmDataDisabled.set).toHaveBeenCalledWith(true);
  });

  it('keeps the confirm button disabled when the form becomes pristine but stays invalid', () => {
    createComponent();
    component.enableForm();
    component.form.get('consentToSecondaryUse')?.setValue(false);
    component.form.markAsDirty();
    onboardingServiceMock.btnConfirmDataDisabled.set.calls.reset();

    component.form.markAsPristine();

    expect(component.form.valid).toBeFalse();
    expect(onboardingServiceMock.btnConfirmDataDisabled.set).toHaveBeenCalledWith(true);
  });

  it('falls back to false values when maintenance data is missing', () => {
    currentInfo.isMaintenance = true;
    privacyData = {
      marketing: {},
      privacyNotice: {},
      active: false,
    };
    privacyNoticeServiceMock.initialPrivacyNoticeData = structuredClone(privacyData);
    privacyNoticeServiceMock.privacyNoticeData.and.callFake(() => structuredClone(privacyData));

    createComponent();

    expect(component.form.get('marketingConsent')?.value).toBeFalse();
    expect(component.form.get('advertisingConsentActinverGroup')?.value).toBeFalse();
    expect(component.form.get('rejectFinancialOffersFromActinver')?.value).toBeFalse();
    expect(component.form.get('consentToPrimaryDataProcessing')?.value).toBeFalse();
    expect(component.form.get('consentToSecondaryUse')?.value).toBeFalse();
    expect(component.form.get('consentToMarketingContactAndDataTransfer')?.value).toBeFalse();
  });

  it('saves through saveSection when not in maintenance mode', () => {
    createComponent();
    component.enableForm();
    component.form.patchValue({
      marketingConsent: true,
      advertisingConsentActinverGroup: true,
      rejectFinancialOffersFromActinver: true,
    });

    component.save();

    expect(checkpointServiceMock.saveSection).toHaveBeenCalledWith('privacy-notice', {
      marketing: {
        marketingConsent: true,
        advertisingConsentActinverGroup: true,
        rejectFinancialOffersFromActinver: true,
        id: 11,
      },
      privacyNotice: {
        consentToPrimaryDataProcessing: true,
        consentToSecondaryUse: true,
        consentToMarketingContactAndDataTransfer: true,
        id: 22,
      },
      active: true,
    });
    expect(privacyNoticeServiceMock.privacyNoticeData.set).toHaveBeenCalled();
    expect(notificationsServiceMock.success).toHaveBeenCalled();
    expect(unsavedChangesServiceMock.setUnsavedChanges).toHaveBeenCalledWith(false);
    expect(component.form.pristine).toBeTrue();
  });

  it('uses saveSectionMant and disables the form after a successful maintenance save', () => {
    currentInfo.isMaintenance = true;
    createComponent();
    component.enableForm();

    component.save();

    expect(checkpointServiceMock.saveSectionMant).toHaveBeenCalled();
    expect(component.form.disabled).toBeTrue();
    expect(component.editMode()).toBeFalse();
  });

  it('shows an error when the checkpoint is not created', () => {
    checkpointServiceMock.saveSection.and.returnValue(of({ status: 'ERROR' }));
    createComponent();

    component.save();

    expect(notificationsServiceMock.error).toHaveBeenCalled();
  });

  it('marks the form pristine even when the save observable errors', () => {
    checkpointServiceMock.saveSection.and.returnValue(throwError(() => new Error('save failed')));
    createComponent();
    component.enableForm();
    component.form.get('marketingConsent')?.setValue(true);

    component.save();

    expect(component.form.pristine).toBeTrue();
    expect(notificationsServiceMock.success).not.toHaveBeenCalled();
  });

  it('resets values on cancel and clears unsaved changes', () => {
    createComponent();
    component.enableForm();
    component.form.patchValue({
      marketingConsent: true,
      advertisingConsentActinverGroup: true,
    });

    component.cancel();

    expect(component.form.disabled).toBeTrue();
    expect(component.form.get('marketingConsent')?.value).toBeFalse();
    expect(component.form.get('advertisingConsentActinverGroup')?.value).toBeFalse();
    expect(component.editMode()).toBeFalse();
    expect(unsavedChangesServiceMock.setUnsavedChanges).toHaveBeenCalledWith(false);
  });

  it('toggles editable state through enableForm and disableForm', () => {
    createComponent();

    component.enableForm();
    expect(component.form.get('marketingConsent')?.enabled).toBeTrue();
    expect(component.form.get('consentToPrimaryDataProcessing')?.enabled).toBeTrue();
    expect(component.editMode()).toBeTrue();

    component.disableForm();
    expect(component.form.disabled).toBeTrue();
    expect(component.editMode()).toBeFalse();
  });

  it('delegates edit() to enableForm()', () => {
    createComponent();
    spyOn(component, 'enableForm').and.callThrough();

    component.edit();

    expect(component.enableForm).toHaveBeenCalled();
    expect(component.editMode()).toBeTrue();
  });

  it('maps the current form state preserving persisted ids', () => {
    createComponent();
    component.enableForm();
    component.form.patchValue({
      marketingConsent: true,
      advertisingConsentActinverGroup: true,
      rejectFinancialOffersFromActinver: true,
      consentToSecondaryUse: false,
    });

    expect(component.mapToCheckpointPrivacyNotice()).toEqual({
      marketing: {
        marketingConsent: true,
        advertisingConsentActinverGroup: true,
        rejectFinancialOffersFromActinver: true,
        id: 11,
      },
      privacyNotice: {
        consentToPrimaryDataProcessing: true,
        consentToSecondaryUse: false,
        consentToMarketingContactAndDataTransfer: true,
        id: 22,
      },
      active: true,
    });
  });

  it('clears the confirm button when the component is destroyed', () => {
    createComponent();

    fixture.destroy();

    expect(onboardingServiceMock.btnConfirmData.set).toHaveBeenCalledWith(false);
  });
});
