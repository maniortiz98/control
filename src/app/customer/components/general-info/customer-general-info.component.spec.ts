import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CustomerGeneralInfoComponent } from './customer-general-info.component';
import { CustomerCatalogsService } from '../../services/customer-catalogs.service';
import { CustomerNotificationsService } from '../../services/customer-notifications.service';
import { CustomerGeneralInfoStorageService } from '../../services/storage-services/customer-general-info-storage.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { CustomerCheckpointService } from '../../services/customer-customer-checkpoint-core.service';
import { CustomerOnboardingService } from '../../services/customer-onboarding.service';
import { PermissionRolService } from '../../../core/services/rol.service';
import { CustomerFielValidationService } from '../../services/customer-fiel-validation.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomerNotificationModalService } from '../../services/customer-notification-modal.service';
import { MatSelectChange } from '@angular/material/select';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../constants/customer-form-messages';
import { CustomerInformationService } from '../../services/customer-information.service';

class MockCustomerInformationService {
  getCustomerInfo = jasmine.createSpy().and.returnValue(of({}));
}

class MockCatalogsService {
  getCountry = jasmine.createSpy().and.returnValue(of([]));
  getClassificationPerson = jasmine.createSpy().and.returnValue(of([]));
  getEconomicActivity = jasmine.createSpy().and.returnValue(of([]));
  getEconomicActivityByPersonType = jasmine.createSpy().and.returnValue(of([]));
  getOccupations = jasmine.createSpy().and.returnValue(of([]));
  getMaritalStatus = jasmine.createSpy().and.returnValue(of([]));
  getMarriageType = jasmine.createSpy().and.returnValue(of([]));
  getRelationships = jasmine.createSpy().and.returnValue(of([]));
  getSector = jasmine.createSpy().and.returnValue(of([]));
}

class MockNotificationsService {
  success = jasmine.createSpy();
  error = jasmine.createSpy();
  warning = jasmine.createSpy();
}

class MockNotificationModalService {
  success = jasmine.createSpy().and.returnValue(Promise.resolve({ value: true }));
  confirm = jasmine.createSpy().and.returnValue(Promise.resolve({ value: true }));
}

class MockStorageService {
  isSavedInfoFlag = jasmine.createSpy().and.returnValue(false);
  generalInfoItem = jasmine.createSpy().and.returnValue(null);
  testamentarySection = jasmine.createSpy().and.returnValue(null);
  generalInfoContract = jasmine.createSpy().and.returnValue(null);
  setFullSectionSingal = jasmine.createSpy();
}

class MockUnsavedChangesService {
  setUnsavedChanges = jasmine.createSpy();
}

class MockOnboardingService {
  getCurrentInfo = jasmine.createSpy().and.returnValue({ isMaintenance: false });
  getCustomerInitialData = jasmine.createSpy().and.returnValue({ contractTypeId: 1, typeContractSubtypeId: 1 });
  enableTabs = jasmine.createSpy();
  hideTabs = jasmine.createSpy();
  showTabs = jasmine.createSpy();
}

class MockCheckpointService {
  saveSection = jasmine.createSpy().and.returnValue(of({ status: 'CREATED' }));
  saveSectionNonContract = jasmine.createSpy().and.returnValue(of({ status: 'CREATED' }));
}

class MockDialog {
  open = jasmine.createSpy().and.returnValue({
    afterClosed: () => of(undefined)
  });
}

class MockFielValidationService {
  validateFiel = jasmine.createSpy().and.returnValue(of({ certificateStatus: 'VALID', maturityDate: '2026-06-01' }));
}

class MockPermissionRolService {
  getPermissionsCustomer = jasmine.createSpy().and.returnValue({});
}

describe('CustomerGeneralInfoComponent', () => {
  let component: CustomerGeneralInfoComponent;
  let fixture: ComponentFixture<CustomerGeneralInfoComponent>;
  let catalogsService: MockCatalogsService;
  let notificationService: MockNotificationsService;
  let storageService: MockStorageService;
  let checkpointService: MockCheckpointService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomerGeneralInfoComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: CustomerCatalogsService, useClass: MockCatalogsService },
        { provide: CustomerNotificationsService, useClass: MockNotificationsService },
        { provide: CustomerNotificationModalService, useClass: MockNotificationModalService },
        { provide: CustomerGeneralInfoStorageService, useClass: MockStorageService },
        { provide: UnsavedChangesService, useClass: MockUnsavedChangesService },
        { provide: CustomerOnboardingService, useClass: MockOnboardingService },
        { provide: CustomerCheckpointService, useClass: MockCheckpointService },
        { provide: MatDialog, useClass: MockDialog },
        { provide: CustomerFielValidationService, useClass: MockFielValidationService },
        { provide: PermissionRolService, useClass: MockPermissionRolService },
        { provide: CustomerInformationService, useClass: MockCustomerInformationService }
      ]
    })
      .overrideComponent(CustomerGeneralInfoComponent, {
        set: { template: '' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(CustomerGeneralInfoComponent);
    component = fixture.componentInstance;

    catalogsService = TestBed.inject(CustomerCatalogsService) as any;
    notificationService = TestBed.inject(CustomerNotificationsService) as any;
    storageService = TestBed.inject(CustomerGeneralInfoStorageService) as any;
    checkpointService = TestBed.inject(CustomerCheckpointService) as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark actinverEmployeeNumber required if actinverEmployee is true', () => {
    const actinverCtrl = component.form.get('actinverEmployee');
    const numCtrl = component.form.get('actinverEmployeeNumber');

    actinverCtrl?.setValue(true);
    expect(numCtrl?.validator).toBeTruthy();
  });

  it('should clear actinverEmployeeNumber if actinverEmployee is false', () => {
    const actinverCtrl = component.form.get('actinverEmployee');
    const numCtrl = component.form.get('actinverEmployeeNumber');

    actinverCtrl?.setValue(false);
    expect(numCtrl?.value).toBe('');
  });

  it('should require maritalType if civilStatus is CASADO/A (code 2)', () => {
    component.form.get('civilStatus')?.setValue('2');
    const maritalCtrl = component.form.get('maritalType');
    expect(maritalCtrl?.validator).toBeTruthy();
  });

  it('should require profession and isParentOfEmployee if ocupation is EMPLEADO (code 02)', () => {
    component.form.get('ocupation')?.setValue('02');
    const profCtrl = component.form.get('profession');
    const parentCtrl = component.form.get('isParentOfEmployee');
    expect(profCtrl?.validator).toBeTruthy();
    expect(parentCtrl?.validator).toBeTruthy();
  });

  it('should call checkpoint.saveSection on valid submit in onboarding flow', async () => {
    component.form.patchValue({
      personClasification: '1',
      economicActivity: '12345',
      ocupation: '01',
      sector: '01',
      actinverEmployee: false,
      civilStatus: '1',
      maritalType: '',
      isParentOfEmployee: false,
    });

    await component.onSubmit();

    expect(checkpointService.saveSection).toHaveBeenCalled();
    expect(notificationService.success).toHaveBeenCalledWith(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
  });

  it('should call checkpoint.saveSectionNonContract on valid submit in maintenance flow', async () => {
    const fielValidationService = TestBed.inject(CustomerFielValidationService);
    (fielValidationService.validateFiel as jasmine.Spy).and.returnValue(
      of({ certificateStatus: 'Válido', maturityDate: '30/11/2030' })
    );

    component.isMaintenance = true;
    component.form.patchValue({
      personClasification: '1',
      economicActivity: '12345',
      ocupation: '01',
      sector: '01',
      actinverEmployee: false,
      civilStatus: '1',
      maritalType: '',
      isParentOfEmployee: false,
      fiel: 'ABC123456789'
    });

    await component.onSubmit();

    expect(checkpointService.saveSectionNonContract).toHaveBeenCalledWith(
      'general-information',
      jasmine.objectContaining({
        fielExpirationDate: '30/11/2030'
      })
    );
    expect(notificationService.success).toHaveBeenCalledWith(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
  });



  it('should show validation errors on invalid submit', async () => {
    component.form.reset();
    await component.onSubmit();
    expect(notificationService.error).toHaveBeenCalledWith(ERROR_MESSAGES.REQUIRED_FIELDS);
  });

  it('should toggle isInMarriage signal on onMaritalStatusChange', () => {
    component.onMaritalStatusChange({ value: '2' } as MatSelectChange);
    expect(component.isInMarriage()).toBeTrue();

    component.onMaritalStatusChange({ value: '1' } as MatSelectChange);
    expect(component.isInMarriage()).toBeFalse();
  });

  it('should toggle isEmployee signal on onOcupationChange', () => {
    component.onOcupationChange({ value: '02' } as MatSelectChange);
    expect(component.isEmployee()).toBeTrue();

    component.onOcupationChange({ value: '01' } as MatSelectChange);
    expect(component.isEmployee()).toBeFalse();
  });

  it('should map otherAddress from storage to dataAddress.other', () => {
    storageService.generalInfoItem.and.returnValue({
      personClassification: 'PF',
      economicActivity: 'ACT',
      maritalStatus: '1',
      marriageType: '0',
      sector: 'SEC',
      actinverEmployee: false,
      employeeNumber: '',
      occupation: 'EMP',
      profession: 'LIC',
      domicilieType: '1',
      country: 'MX',
      postalCode: '28001',
      federalEntity: '09',
      city: '01',
      municipality: '010',
      colony: 'Centro',
      street: 'Calle 1',
      externalNumber: '10',
      internalNumber: '',
      website: '',
      related: false,
      relationship: '',
      institutionName: '',
      fiel: '',
      fielExpirationDate: '',
      otherAddress: 'OTHER_STREET'
    });
    component.ngOnInit();
    expect(component.dataAddress?.other).toBe('OTHER_STREET');
  });
});
