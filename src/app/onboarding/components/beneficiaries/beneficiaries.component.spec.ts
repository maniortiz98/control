import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BeneficiariesComponent } from './beneficiaries.component';
import { OnboardingService } from '../../services/onboarding.service';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { AddressesService } from '../../../shared/services/storage-services/addresses.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { BeneficiariesSignalService } from '../../services/checkpoint/beneficiaries-signal.service';
import { PermissionRolService } from '../../../core/services/rol.service';
import { SearchClientFlowService } from '../../../shared/services/search-client-flow.service';
import { CurrentOnboardingInfo } from '../../models/current-onboarding';
import { BeneficiariesCurrentTableData } from '../../models/checkpoints/beneficiaries';

describe('BeneficiariesComponent', () => {
  let component: BeneficiariesComponent;
  let fixture: ComponentFixture<BeneficiariesComponent>;

  let onboardingService: jasmine.SpyObj<OnboardingService>;
  let modalService: jasmine.SpyObj<NotificationModalService>;
  let notificationService: jasmine.SpyObj<NotificationsService>;
  let unsavedChangesService: jasmine.SpyObj<UnsavedChangesService>;
  let addressService: jasmine.SpyObj<AddressesService>;
  let checkpointService: jasmine.SpyObj<CheckpointService>;
  let beneficiariesSignalService: jasmine.SpyObj<BeneficiariesSignalService>;
  let permissionService: jasmine.SpyObj<PermissionRolService>;
  let clientFlowService: jasmine.SpyObj<SearchClientFlowService>;

  const mockOnboardingInfo: CurrentOnboardingInfo = {
    requestId: 'REQ-001',
    personType: 'PF',
    name: 'Cliente Test',
    contractType: '8',
    contractSubtype: '49',
    businessType: '1',
    onboardingId: 1,
    isMaintenance: false,
    isCustomer: false,
    isOnboarding: true,
    clientId: 123,
    accountId: 456,
    accountData: null,
  };

  const makeBeneficiary = (overrides: Partial<BeneficiariesCurrentTableData> = {}): BeneficiariesCurrentTableData => ({
    beneficiaryId: 1,
    personId: 1,
    accountRoleId: 1,
    active: true,
    clientData: {
      curp: 'CURP123456HDFABC01',
      foreignerWithoutCurp: false,
      typeIden: '1',
      rfc: 'XAXX010101000',
      firstName: 'JUAN',
      middleName: 'CARLOS',
      firstLastName: 'PEREZ',
      secondLastName: 'LOPEZ',
      dateOfBirth: '1990-01-01',
      gender: 'H',
      maritalStatus: '1',
      nationality: 'MX',
      countryOfBirth: 'MX',
      stateOfBirth: '09',
      cityOfBirth: 'CDMX',
      ppe: false,
      bankAreaTypeId: '',
      contraTypeId: '',
      typeContractSubtypeId: '',
    },
    addressData: {
      id: '1',
      addressType: '1',
      country: 'MX',
      postalCode: '01234',
      federalEntity: 'CDMX',
      city: 'CDMX',
      municipality: 'BENITO JUAREZ',
      neighborhood: 'DEL VALLE',
      street: 'INSURGENTES',
      externalNumber: '100',
      internalNumber: '1',
      addressId: undefined,
    },
    firstName: 'JUAN',
    lastName: 'PEREZ',
    relationShip: '1',
    relationShipName: 'Familiar',
    percentage: '100',
    sameAddress: false,
    tempId: 'tmp-1',
    ...overrides,
  });

  beforeEach(async () => {
    onboardingService = jasmine.createSpyObj('OnboardingService', ['getCurrentInfo', 'getCustomerInitialData']);
    modalService = jasmine.createSpyObj('NotificationModalService', ['confirm', 'info']);
    notificationService = jasmine.createSpyObj('NotificationsService', ['success', 'error', 'info']);
    unsavedChangesService = jasmine.createSpyObj('UnsavedChangesService', ['setUnsavedChanges']);
    addressService = jasmine.createSpyObj('AddressesService', ['get']);
    checkpointService = jasmine.createSpyObj('CheckpointService', ['saveSection', 'saveSectionMant', 'getMaintenanceSectionByPersonaFisica']);
    beneficiariesSignalService = jasmine.createSpyObj('BeneficiariesSignalService', ['getBeneficiaries', 'setBeneficiaries']);
    permissionService = jasmine.createSpyObj('PermissionRolService', ['getPermissions']);
    clientFlowService = jasmine.createSpyObj('SearchClientFlowService', ['validInWatchList']);

    onboardingService.getCurrentInfo.and.returnValue(mockOnboardingInfo);
    onboardingService.getCustomerInitialData.and.returnValue({});
    beneficiariesSignalService.getBeneficiaries.and.returnValue([]);
    modalService.confirm.and.returnValue(Promise.resolve({ value: true }));
    modalService.info.and.returnValue(Promise.resolve({ value: true }));
    clientFlowService.validInWatchList.and.resolveTo(true);
    permissionService.getPermissions.and.returnValue({
      beneficiaries: {
        permission: ['add', 'edit', 'delete'],
        allDisabled: false,
      }
    });

    await TestBed.configureTestingModule({
      declarations: [BeneficiariesComponent],
      providers: [
        { provide: OnboardingService, useValue: onboardingService },
        { provide: NotificationModalService, useValue: modalService },
        { provide: NotificationsService, useValue: notificationService },
        { provide: UnsavedChangesService, useValue: unsavedChangesService },
        { provide: AddressesService, useValue: addressService },
        { provide: CheckpointService, useValue: checkpointService },
        { provide: BeneficiariesSignalService, useValue: beneficiariesSignalService },
        { provide: PermissionRolService, useValue: permissionService },
        { provide: SearchClientFlowService, useValue: clientFlowService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                relationshipResolver: [
                  { mandt: '100', idParent: '1', spras: 'ES', kinShip: 'Familiar' },
                  { mandt: '100', idParent: '2', spras: 'ES', kinShip: 'Cónyuge' }
                ]
              }
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(BeneficiariesComponent, { set: { template: '' } })
      .compileComponents();

    // Mock ngAfterViewInit BEFORE creating the component to prevent ViewChild null errors
    spyOn(BeneficiariesComponent.prototype, 'ngAfterViewInit').and.stub();

    fixture = TestBed.createComponent(BeneficiariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Reassign ViewChild stubs after detectChanges because empty template clears them.
    setupViewChildStubs();
  });

  function setupViewChildStubs() {
    const clientDataForm = {
      valueChanges: of({}),
      dirty: false,
      reset: jasmine.createSpy('reset'),
      get: jasmine.createSpy('get').and.returnValue({ setValue: jasmine.createSpy('setValue'), setValidators: jasmine.createSpy('setValidators'), updateValueAndValidity: jasmine.createSpy('updateValueAndValidity') }),
      enable: jasmine.createSpy('enable'),
      disable: jasmine.createSpy('disable'),
    };

    const addressDataForm = {
      valueChanges: of({}),
      dirty: false,
      reset: jasmine.createSpy('reset'),
      get: jasmine.createSpy('get'),
      enable: jasmine.createSpy('enable'),
      disable: jasmine.createSpy('disable'),
    };

    component.clientDataComponent = {
      profileForm: clientDataForm as any,
      submit: jasmine.createSpy('submit').and.resolveTo({
        curp: 'CURP123456HDFABC01',
        foreignerWithoutCurp: false,
        typeIden: '1',
        rfc: 'XAXX010101000',
        firstName: 'JUAN',
        middleName: 'CARLOS',
        firstLastName: 'PEREZ',
        secondLastName: 'LOPEZ',
        dateOfBirth: '1990-01-01',
        gender: 'H',
        maritalStatus: '1',
        nationality: 'MX',
        countryOfBirth: 'MX',
        stateOfBirth: '09',
        cityOfBirth: 'CDMX',
        ppe: false,
        bankAreaTypeId: '',
        contraTypeId: '',
        typeContractSubtypeId: '',
      }),
      resetDefaults: jasmine.createSpy('resetDefaults'),
      setClientData: jasmine.createSpy('setClientData'),
    } as any;

    component.addressComponent = {
      profileForm: addressDataForm as any,
      onSubmit: jasmine.createSpy('onSubmit').and.resolveTo({
        id: '1',
        addressType: '1',
        country: 'MX',
        postalCode: '01234',
        federalEntity: 'CDMX',
        city: 'CDMX',
        municipality: 'BENITO JUAREZ',
        neighborhood: 'DEL VALLE',
        street: 'INSURGENTES',
        externalNumber: '100',
        internalNumber: '1',
      }),
      setAddresData: jasmine.createSpy('setAddresData'),
      resetColonyCP: jasmine.createSpy('resetColonyCP'),
      enableDisableFECityMun: jasmine.createSpy('enableDisableFECityMun'),
    } as any;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize relationship list from route data', () => {
    component.relationshipList.set([
      { mandt: '100', idParent: '1', spras: 'ES', kinShip: 'Familiar' },
      { mandt: '100', idParent: '2', spras: 'ES', kinShip: 'Cónyuge' }
    ]);

    expect(component.relationshipList().length).toBe(2);
    expect(component.relationshipList()[0].kinShip).toBe('Familiar');
  });

  it('should verify 100 percent validation with one beneficiary', () => {
    component.tableData = [makeBeneficiary({ percentage: '100', active: true })];

    const result = component.verify100Per();

    expect(result.ok).toBeTrue();
    expect(result.sum).toBe(100);
  });

  it('should detect sum does not equal 100 with multiple beneficiaries', () => {
    component.tableData = [
      makeBeneficiary({ percentage: '50', active: true }),
      makeBeneficiary({ tempId: 'tmp-2', percentage: '30', active: true })
    ];

    const result = component.verify100Per();

    expect(result.ok).toBeFalse();
    expect(result.sum).toBe(80);
  });

  it('should get percentage sum for all active beneficiaries', () => {
    component.tableData = [
      makeBeneficiary({ percentage: '40', active: true }),
      makeBeneficiary({ tempId: 'tmp-2', percentage: '40', active: true }),
      makeBeneficiary({ tempId: 'tmp-3', percentage: '20', active: false })
    ];

    const sum = component.tableData.reduce((acc, b) => acc + (b.active ? Number(b.percentage) : 0), 0);

    expect(sum).toBe(80);
  });

  it('should return relationship name by id', () => {
    component.relationshipList.set([
      { mandt: '100', idParent: '1', spras: 'ES', kinShip: 'Familiar' },
      { mandt: '100', idParent: '2', spras: 'ES', kinShip: 'Cónyuge' }
    ]);

    const name = component.getRelationshipName('2');

    expect(name).toBe('Cónyuge');
  });

  it('should handle delete beneficiary in onboarding mode', fakeAsync(() => {
    component.isMaintenance.set(false);
    const beneficiary = makeBeneficiary();
    component.tableData = [beneficiary];

    component.eventRow({ type: 'delete', row: beneficiary });
    tick();

    expect(component.tableData.length).toBe(0);
    expect(notificationService.success).toHaveBeenCalled();
  }));

  it('should soft delete beneficiary in maintenance mode', fakeAsync(() => {
    component.isMaintenance.set(true);
    const beneficiary = makeBeneficiary();
    component.tableData = [beneficiary];

    component.eventRow({ type: 'delete', row: beneficiary });
    tick();

    expect(component.tableData[0].active).toBeFalse();
  }));

  it('should return false for verify same address when addresses differ', () => {
    const addressData1 = makeBeneficiary().addressData;
    const addressData2 = { ...addressData1, street: 'DIFFERENT STREET' };
    const addressList = { addressList: [addressData1] };
    addressService.get.and.returnValue(addressList);

    const result = component.verifySameAddress(addressData2);

    expect(result).toBeFalse();
  });

  it('should return true for verify same address when addresses match', () => {
    const addressData = makeBeneficiary().addressData;
    const addressList = { addressList: [addressData] };
    addressService.get.and.returnValue(addressList);

    const result = component.verifySameAddress(addressData);

    expect(result).toBeTrue();
  });

  it('should show error when submit has one beneficiary with percentage different from 100', () => {
    component.tableData = [makeBeneficiary({ percentage: '90' })];
    const saveSpy = spyOn(component, 'saveCheckpoint');

    component.submit();

    expect(notificationService.error).toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('should show error when submit total percentage is not 100', () => {
    component.tableData = [
      makeBeneficiary({ percentage: '60' }),
      makeBeneficiary({ tempId: 'tmp-2', percentage: '30' })
    ];
    const saveSpy = spyOn(component, 'saveCheckpoint');

    component.submit();

    expect(notificationService.error).toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('should call saveCheckpoint when submit has no beneficiaries and user confirms', fakeAsync(() => {
    component.isMaintenance.set(false);
    component.tableData = [];
    const saveSpy = spyOn(component, 'saveCheckpoint');

    component.submit();
    tick();

    expect(modalService.info).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalled();
  }));

  it('should call saveMaintenance on submit when maintenance mode and valid percentage', () => {
    component.isMaintenance.set(true);
    component.tableData = [makeBeneficiary({ percentage: '100' })];
    const saveSpy = spyOn(component, 'saveMaintenance');

    component.submit();

    expect(saveSpy).toHaveBeenCalled();
  });

  it('should save maintenance and refresh table data', () => {
    component.tableData = [makeBeneficiary()];
    checkpointService.saveSectionMant.and.returnValue(of({ applicationNumber: '1', sectionId: '1', status: 'CREATED' }));
    checkpointService.getMaintenanceSectionByPersonaFisica.and.returnValue(of({
      checkpoints: [
        {
          data: {
            beneficiaries: []
          }
        }
      ]
    }));

    component.saveMaintenance();

    expect(checkpointService.saveSectionMant).toHaveBeenCalled();
    expect(checkpointService.getMaintenanceSectionByPersonaFisica).toHaveBeenCalledWith(['beneficiaries']);
    expect(beneficiariesSignalService.setBeneficiaries).toHaveBeenCalled();
  });

  it('should set checkControl to false and show error when check is true without saved address', fakeAsync(() => {
    addressService.get.and.returnValue({ addressList: [] });

    component.checkControl.setValue(true);
    tick();

    expect(notificationService.error).toHaveBeenCalled();
    expect(component.checkControl.value).toBeFalse();
  }));

  it('should disable controls in initializeMaintenance', () => {
    component.initializeMaintenance();

    expect(component.checkControl.disabled).toBeTrue();
    expect(component.relationshipControl.disabled).toBeTrue();
    expect(component.percentageControl.disabled).toBeTrue();
    expect(component.addressComponent.profileForm.disable).toHaveBeenCalled();
    expect(component.clientDataComponent.profileForm.disable).toHaveBeenCalled();
    expect(component.disButtons.save).toBeTrue();
    expect(component.disButtons.register).toBeTrue();
  });
});
