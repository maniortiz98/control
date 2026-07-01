import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { FirstDataComponent } from './first-data.component';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { OnboardingService } from '../../services/onboarding.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { FirstDataClientService } from '../../../shared/services/storage-services/first-data-client.service';
import { PermissionRolService } from '../../../core/services/rol.service';
import { SearchClientFlowService } from '../../../shared/services/search-client-flow.service';
import { GeneralInfoStorageService } from '../../../shared/services/storage-services/general-info-storage.service';
import { CustomerInformationService } from '../../../shared/services/customer.service';
import { FlowCurpRfcService } from '../../../shared/services/flow-curp-rfc.service';
import { PpeService } from '../../../shared/services/storage-services/ppe.service';
import { AddressesService } from '../../../shared/services/storage-services/addresses.service';
import { ModalFormService } from '../../../shared/services/modal-form.service';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { IdentificationAndContactService } from '../../../shared/services/storage-services/identification-and-contact.service';
import { Data } from '../../models/checkpoints/initial-data-checkpoint';

describe('FirstDataComponent', () => {
  let component: FirstDataComponent;
  let fixture: ComponentFixture<FirstDataComponent>;
  let onboardingServiceMock: jasmine.SpyObj<OnboardingService>;
  let firstDataClientServiceMock: jasmine.SpyObj<FirstDataClientService>;
  let unsavedChangesServiceMock: jasmine.SpyObj<UnsavedChangesService>;
  let permissionRolServiceMock: jasmine.SpyObj<PermissionRolService>;
  let searchClientFlowServiceMock: jasmine.SpyObj<SearchClientFlowService>;
  let catalogsServiceMock: jasmine.SpyObj<CatalogsService>;

  const currentInfoBase = {
    requestId: '',
    personType: 'PF' as const,
    name: '',
    contractType: '1',
    contractSubtype: '2',
    businessType: '',
    onboardingId: 0,
    isMaintenance: false,
    isCustomer: false,
    isOnboarding: false,
    clientId: 0,
    accountId: 0,
    accountData: null,
  };

  const customerInitialDataBase: any = {
    firstName: 'Juan',
    middleName: 'Carlos',
    firstLastName: 'Perez',
    secondLastName: 'Lopez',
    gender: '1',
    contractTypeId: 10,
    typeContractSubtypeId: 20,
    bankAreaTypeId: 30,
  };

  const permissionsBase = {
    'customer-info': {
      allDisabled: false,
      fieldsEnabled: [],
      buttonsEnabled: ['btnSave', 'btnCancel'],
    },
  };

  const setupDomButtons = () => {
    ['btnSave', 'btnCancel', 'btnEdit'].forEach(id => {
      if (!document.getElementById(id)) {
        const button = document.createElement('button');
        button.id = id;
        document.body.appendChild(button);
      }
    });
  };

  const createClientDataStub = () => {
    const profileForm = new FormGroup({
      firstName: new FormControl('Juan'),
      curp: new FormControl('CURP123'),
      rfc: new FormControl('RFC123'),
    });

    return {
      profileForm,
      setData: jasmine.createSpy('setData'),
      submitID: jasmine.createSpy('submitID').and.returnValue(null),
    };
  };

  const createComponent = () => {
    fixture = TestBed.createComponent(FirstDataComponent);
    component = fixture.componentInstance;
    return component;
  };

  beforeEach(async () => {
    onboardingServiceMock = jasmine.createSpyObj('OnboardingService', [
      'getCurrentInfo',
      'getCustomerInitialData',
      'enableTabs',
      'hideTabs',
      'showTabs',
      'updateCurrentOnboardingInfo',
    ]);
    firstDataClientServiceMock = jasmine.createSpyObj('FirstDataClientService', [
      'getItem',
      'getDataClientSignal',
      'setItem',
    ]);
    unsavedChangesServiceMock = jasmine.createSpyObj('UnsavedChangesService', ['setUnsavedChanges']);
    permissionRolServiceMock = jasmine.createSpyObj('PermissionRolService', ['getPermissions']);
    searchClientFlowServiceMock = jasmine.createSpyObj('SearchClientFlowService', [
      'getDataWatchList',
      'validInHomonyms',
      'getWatchListWF',
    ]);
    catalogsServiceMock = jasmine.createSpyObj('CatalogsService', [
      'getCountry',
      'getPhoneType',
      'getIdentificationType',
    ]);

    onboardingServiceMock.getCurrentInfo.and.returnValue({ ...currentInfoBase });
    onboardingServiceMock.getCustomerInitialData.and.returnValue({ ...customerInitialDataBase });
    firstDataClientServiceMock.getItem.and.returnValue(null);
    firstDataClientServiceMock.getDataClientSignal.and.returnValue(signal(null));
    permissionRolServiceMock.getPermissions.and.returnValue(permissionsBase as any);
    searchClientFlowServiceMock.getDataWatchList.and.resolveTo({
      passOnWatchlist: false,
      isOnWatchlist: false,
      step: 0,
      matchLists: [],
    });
    searchClientFlowServiceMock.validInHomonyms.and.resolveTo({
      passOnHomonyms: true,
      numberClient: null,
    });
    searchClientFlowServiceMock.getWatchListWF.and.resolveTo(false);
    catalogsServiceMock.getCountry.and.returnValue(of([{ id: 'MX', name: 'Mexico' }] as any));
    catalogsServiceMock.getPhoneType.and.returnValue(of([{ id: '1', description: 'Celular' }] as any));
    catalogsServiceMock.getIdentificationType.and.returnValue(of([{ id: 'INE', description: 'INE' }] as any));

    await TestBed.configureTestingModule({
      declarations: [FirstDataComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: MatDialog, useValue: jasmine.createSpyObj('MatDialog', ['open', 'closeAll']) },
        { provide: CheckpointService, useValue: jasmine.createSpyObj('CheckpointService', ['saveSection', 'saveSectionMant']) },
        { provide: NotificationsService, useValue: jasmine.createSpyObj('NotificationsService', ['success', 'error']) },
        { provide: OnboardingService, useValue: onboardingServiceMock },
        { provide: UnsavedChangesService, useValue: unsavedChangesServiceMock },
        { provide: FirstDataClientService, useValue: firstDataClientServiceMock },
        { provide: PermissionRolService, useValue: permissionRolServiceMock },
        { provide: SearchClientFlowService, useValue: searchClientFlowServiceMock },
        { provide: GeneralInfoStorageService, useValue: jasmine.createSpyObj('GeneralInfoStorageService', ['generalInfoItem', 'setGeneralInfoItem']) },
        { provide: CustomerInformationService, useValue: jasmine.createSpyObj('CustomerInformationService', ['getCustomerInfo']) },
        { provide: FlowCurpRfcService, useValue: jasmine.createSpyObj('FlowCurpRfcService', ['validChangesInCURPandRFC']) },
        { provide: PpeService, useValue: jasmine.createSpyObj('PpeService', ['set']) },
        { provide: AddressesService, useValue: jasmine.createSpyObj('AddressesService', ['set']) },
        { provide: ModalFormService, useValue: jasmine.createSpyObj('ModalFormService', ['bankContractLinkingModal']) },
        { provide: CatalogsService, useValue: catalogsServiceMock },
        { provide: IdentificationAndContactService, useValue: jasmine.createSpyObj('IdentificationAndContactService', ['setIdentificationAndContactInfo']) },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  afterEach(() => {
    ['btnSave', 'btnCancel', 'btnEdit'].forEach(id => {
      document.getElementById(id)?.remove();
    });
  });

  it('should create and initialize data from onboarding when storage is empty', () => {
    createComponent();

    expect(component).toBeTruthy();
    expect(component.data?.firstName).toBe('Juan');
    expect(component.data?.gender).toBe('M');
  });

  it('should load catalogs on init', () => {
    createComponent();

    component.ngOnInit();

    expect(catalogsServiceMock.getCountry).toHaveBeenCalled();
    expect(catalogsServiceMock.getPhoneType).toHaveBeenCalled();
    expect(catalogsServiceMock.getIdentificationType).toHaveBeenCalled();
    expect(component.countries().length).toBe(1);
    expect(component.phoneTypes().length).toBe(1);
    expect(component.identifications().length).toBe(1);
  });

  it('should store received form group', () => {
    createComponent();
    const formGroup = new FormGroup({ field: new FormControl('value') });

    component.onFormGroupReceived(formGroup);

    expect((component as any).receivedFormGroup).toBe(formGroup);
  });

  it('should disable client form and enable maintenance edit mode when allowed', () => {
    setupDomButtons();
    onboardingServiceMock.getCurrentInfo.and.returnValue({
      ...currentInfoBase,
      isMaintenance: true,
    });
    createComponent();
    const clientDataStub = createClientDataStub();
    component.clientDataComponent = clientDataStub as any;

    component.ngAfterViewInit();

    expect(clientDataStub.profileForm.disabled).toBeTrue();
    expect(component.isMaintenanceE()).toBeFalse();
  });

  it('should disable form and save button when requestId already exists', () => {
    setupDomButtons();
    onboardingServiceMock.getCurrentInfo.and.returnValue({
      ...currentInfoBase,
      requestId: 'REQ-123',
    });
    createComponent();
    const clientDataStub = createClientDataStub();
    component.clientDataComponent = clientDataStub as any;

    component.ngAfterViewInit();

    expect(clientDataStub.profileForm.disabled).toBeTrue();
    expect(document.getElementById('btnSave')?.getAttribute('disabled')).toBe('true');
  });

  it('should enable all editable fields and buttons on editt', () => {
    setupDomButtons();
    createComponent();
    const clientDataStub = createClientDataStub();
    clientDataStub.profileForm.disable();
    component.clientDataComponent = clientDataStub as any;

    component.editt();

    expect(clientDataStub.profileForm.enabled).toBeTrue();
    expect(document.getElementById('btnEdit')?.getAttribute('disabled')).toBe('true');
  });

  it('should restore stored data and disable form on cancel', () => {
    setupDomButtons();
    const storedData = {
      id: 9,
      curp: 'ABCD010101HDFLLL01',
      rfc: 'ABCD010101AAA',
      nif: '',
      tin: '',
      nss: '',
      firstName: 'Ana',
      middleName: 'Maria',
      firstLastName: 'Lopez',
      secondLastName: 'Diaz',
      dateOfBirth: '1990-01-01',
      gender: '1',
      nationality: 'MX',
      countryOfBirth: 'MX',
      stateOfBirth: 'CMX',
      cityOfBirth: 'CMX',
      ppe: false,
      foreignerWithoutCurp: false,
      bankAreaTypeId: '30',
      contraTypeId: 10,
      contractTypeId: '10',
      typeContractSubtypeId: '20',
    };
    firstDataClientServiceMock.getItem.and.returnValue(storedData as any);
    firstDataClientServiceMock.getDataClientSignal.and.returnValue(signal(null));
    createComponent();
    const clientDataStub = createClientDataStub();
    component.clientDataComponent = clientDataStub as any;
    clientDataStub.profileForm.enable();

    component.cancel();

    expect(clientDataStub.setData).toHaveBeenCalled();
    expect(clientDataStub.profileForm.disabled).toBeTrue();
    expect(document.getElementById('btnSave')?.getAttribute('disabled')).toBe('true');
    expect(document.getElementById('btnCancel')?.getAttribute('disabled')).toBe('true');
  });

  it('should mark unsaved changes and stop short submit flow when child submit returns null', async () => {
    createComponent();
    const clientDataStub = createClientDataStub();
    clientDataStub.submitID.and.returnValue(null);
    component.clientDataComponent = clientDataStub as any;

    await component.onSubmit();

    expect(clientDataStub.submitID).toHaveBeenCalled();
    expect(unsavedChangesServiceMock.setUnsavedChanges).toHaveBeenCalledWith(true);
    expect(searchClientFlowServiceMock.getDataWatchList).not.toHaveBeenCalled();
  });

});
