import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { PermissionRolService } from '../../../core/services/rol.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { AddressSectionComponent } from '../../../shared/components/sections/address-section/address-section.component';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { HomonymsService } from '../../../shared/services/homonyms.service';
import { ModalFormService } from '../../../shared/services/modal-form.service';
import { ModalHomonymsServiceService } from '../../../shared/services/modal-homonyms-service.service';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { SearchClientFlowService } from '../../../shared/services/search-client-flow.service';
import { WatchlistService } from '../../../shared/services/watchlist.service';
import { SpouseService } from '../../../shared/services/storage-services/spouse.service';
import { ValidCurpService } from '../../../shared/services/curp-valid/valid-curp.service';
import { STRINGS } from '../../constants/constants';
import { OnboardingService } from '../../services/onboarding.service';
import { SpouseComponent } from './spouse.component';

describe('SpouseComponent', () => {
  let component: SpouseComponent;
  let fixture: ComponentFixture<SpouseComponent>;
  let formBuilder: FormBuilder;
  let buttonsHost: HTMLDivElement;

  let currentInfo: { isMaintenance: boolean; isCustomer: boolean };
  let permissions: { spouse: { allDisabled: boolean } };
  let storedSpouseItem: any;
  let maintenanceResponse: any;

  let catalogsServiceMock: any;
  let notificationsServiceMock: any;
  let unsavedChangesServiceMock: any;
  let spouseServiceMock: any;
  let notificationModalServiceMock: any;
  let checkpointServiceMock: any;
  let permissionRolServiceMock: any;
  let onboardingServiceMock: any;
  let validCurpServiceMock: any;
  let searchClientFlowServiceMock: any;

  const buildSpouseSignalItem = (overrides?: any) => ({
    spousedata: {
      id: 1,
      personId: 2,
      curp: 'GODE561231HDFABC09',
      foreignerWithoutCurp: false,
      rfc: 'GODE561231ABC',
      nif: '',
      tin: '',
      nss: '',
      firstName: 'JUAN',
      middleName: 'CARLOS',
      dateOfBirth: '1956-12-31',
      firstLastName: 'PEREZ',
      secondLastName: 'LOPEZ',
      gender: 'H',
      ...overrides?.spousedata,
    },
    workingfields: {
      id: 3,
      occupation: 'EMPLEADO',
      businessActivity: 'SERVICIOS',
      ...overrides?.workingfields,
    },
    address: {
      id: 4,
      addressType: 'CASA',
      other: '',
      country: 'MX',
      postalCode: '01000',
      federalEntity: 'DF',
      city: '001',
      municipality: '010',
      neighborhood: 'FLORIDA',
      street: 'INSURGENTES',
      externalNumber: '100',
      internalNumber: '2',
      ...overrides?.address,
    },
  });

  const buildMaintenanceCheckpoint = (overrides?: any) => ({
    spousedata: {
      id: 1,
      personId: 2,
      curp: 'GODE561231HDFABC09',
      foreignerWithoutCurp: false,
      rfc: 'GODE561231ABC',
      nif: '',
      tin: '',
      nss: '',
      firstName: 'JUAN',
      middleName: 'CARLOS',
      firstLastName: 'PEREZ',
      secondLastName: 'LOPEZ',
      dateOfBirth: '31/12/1956',
      gender: '2',
      ...overrides?.spousedata,
    },
    workingfields: {
      id: 3,
      occupation: 'EMPLEADO',
      businessActivity: 'SERVICIOS',
      ...overrides?.workingfields,
    },
    address: {
      id: 4,
      addressType: 'CASA',
      other: '',
      country: 'MX',
      postalCode: '01000',
      federalEntity: 'DF',
      city: '001',
      municipality: '010',
      neighborhood: 'FLORIDA',
      street: 'INSURGENTES',
      externalNumber: '100',
      internalNumber: '2',
      ...overrides?.address,
    },
  });

  const buildAddressStub = (country = 'MX', submitResult: any = {
    addressType: 'CASA',
    other: '',
    country: 'MX',
    postalCode: '01000',
    federalEntity: 'DF',
    city: '001',
    municipality: '010',
    neighborhood: 'FLORIDA',
    street: 'INSURGENTES',
    externalNumber: '100',
    internalNumber: '2',
    federalEntityID: '09',
    cityID: '001',
    municipalityID: '010',
  }) => ({
    profileForm: formBuilder.group({ country: [country], street: ['INSURGENTES'] }),
    setAddresData: jasmine.createSpy('setAddresData'),
    onSubmit: jasmine.createSpy('onSubmit').and.resolveTo(submitResult),
    enableDisableFECityMun: jasmine.createSpy('enableDisableFECityMun'),
  });

  const createComponent = () => {
    fixture = TestBed.createComponent(SpouseComponent);
    component = fixture.componentInstance;
    component.addressSectionComponent = buildAddressStub() as unknown as AddressSectionComponent;
    return component;
  };

  const fillRequiredForm = () => {
    component.profileForm.patchValue({
      curp: 'GODE561231HDFABC09',
      foreignerWithoutCurp: false,
      typeIden: '1',
      rfc: 'GODE561231ABC',
      firstName: 'JUAN',
      middleName: 'CARLOS',
      dateOfBirth: '1956-12-31',
      firstLastName: 'PEREZ',
      secondLastName: 'LOPEZ',
      gender: 'H',
      occupation: 'EMPLEADO',
      economicActivity: 'SERVICIOS',
    });
  };

  beforeEach(async () => {
    formBuilder = new FormBuilder();
    currentInfo = { isMaintenance: false, isCustomer: false };
    permissions = { spouse: { allDisabled: false } };
    storedSpouseItem = null;
    maintenanceResponse = buildMaintenanceCheckpoint();

    catalogsServiceMock = {
      getEconomicActivity: jasmine.createSpy('getEconomicActivity').and.returnValue(of([{ lineBusiness: 'Servicios Financieros' }])),
      getOccupations: jasmine.createSpy('getOccupations').and.returnValue(of([{ occupation: 'Empleado' }])),
    };
    notificationsServiceMock = {
      error: jasmine.createSpy('error'),
      success: jasmine.createSpy('success'),
    };
    unsavedChangesServiceMock = {
      setUnsavedChanges: jasmine.createSpy('setUnsavedChanges'),
    };
    spouseServiceMock = {
      getItem: jasmine.createSpy('getItem').and.callFake(() => storedSpouseItem),
      setItem: jasmine.createSpy('setItem').and.callFake((item: any) => {
        storedSpouseItem = item;
      }),
    };
    notificationModalServiceMock = {
      warning: jasmine.createSpy('warning').and.resolveTo(undefined),
    };
    checkpointServiceMock = {
      saveSectionMant: jasmine.createSpy('saveSectionMant').and.returnValue(of({ status: 'CREATED' })),
      getMaintenanceSectionByPersonaFisica: jasmine.createSpy('getMaintenanceSectionByPersonaFisica').and.callFake(() => of({ checkpoints: [{ data: maintenanceResponse }] })),
    };
    permissionRolServiceMock = {
      getPermissions: jasmine.createSpy('getPermissions').and.callFake(() => permissions),
    };
    onboardingServiceMock = {
      getCurrentInfo: jasmine.createSpy('getCurrentInfo').and.callFake(() => currentInfo),
    };
    validCurpServiceMock = {
      postData: jasmine.createSpy('postData').and.returnValue(of({
        status: 200,
        messages: [],
        payload: {
          result: true,
          renapoResponse: true,
          intents: 1,
          curp: 'GODE561231HDFABC09',
          names: 'JUAN CARLOS',
          lastName: 'PEREZ',
          secondLastName: 'LOPEZ',
          gender: 'H',
          birthDate: '1956-12-31',
          birthStateCode: 'DF',
          birthState: 'CIUDAD DE MEXICO',
        },
      })),
    };
    searchClientFlowServiceMock = {
      validInWatchList: jasmine.createSpy('validInWatchList').and.resolveTo(true),
    };

    document.body.className = '';
    buttonsHost = document.createElement('div');
    buttonsHost.innerHTML = '<button id="btnEdit"></button><button id="btnSave" disabled="true"></button><button id="btnCancel" disabled="true"></button>';
    document.body.appendChild(buttonsHost);

    await TestBed.configureTestingModule({
      declarations: [SpouseComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: CatalogsService, useValue: catalogsServiceMock },
        { provide: MatDialog, useValue: {} },
        { provide: NotificationsService, useValue: notificationsServiceMock },
        { provide: UnsavedChangesService, useValue: unsavedChangesServiceMock },
        { provide: SpouseService, useValue: spouseServiceMock },
        { provide: WatchlistService, useValue: {} },
        { provide: HomonymsService, useValue: {} },
        { provide: NotificationModalService, useValue: notificationModalServiceMock },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
        { provide: ModalFormService, useValue: {} },
        { provide: CheckpointService, useValue: checkpointServiceMock },
        { provide: ModalHomonymsServiceService, useValue: {} },
        { provide: OnboardingService, useValue: onboardingServiceMock },
        { provide: PermissionRolService, useValue: permissionRolServiceMock },
        { provide: ValidCurpService, useValue: validCurpServiceMock },
        { provide: SearchClientFlowService, useValue: searchClientFlowServiceMock },
      ],
    })
      .overrideComponent(SpouseComponent, {
        set: { template: '' },
      })
      .compileComponents();
  });

  afterEach(() => {
    document.body.className = '';
    buttonsHost?.remove();
    if (fixture) {
      fixture.destroy();
    }
  });

  it('creates and filters economic activities from the search control', () => {
    createComponent();
    component.economicActivity.set([
      { lineBusiness: 'Servicios Financieros' } as any,
      { lineBusiness: 'Tecnologia' } as any,
    ]);

    component.economicActivityFilter.setValue('servicios');

    expect(component).toBeTruthy();
    expect(component.filteredEconomicActivities().length).toBe(1);
    expect(component.filteredEconomicActivities()[0].lineBusiness).toBe('Servicios Financieros');
  });

  it('falls back to an empty filter when economic activity search is cleared', () => {
    createComponent();
    component.economicActivity.set([
      { lineBusiness: 'Servicios Financieros' } as any,
      { lineBusiness: 'Tecnologia' } as any,
    ]);

    component.economicActivityFilter.setValue(null);

    expect(component.filteredEconomicActivities().length).toBe(2);
  });

  it('loads catalogs on init', () => {
    createComponent();

    component.ngOnInit();

    expect(catalogsServiceMock.getEconomicActivity).toHaveBeenCalled();
    expect(catalogsServiceMock.getOccupations).toHaveBeenCalled();
    expect(component.economicActivity().length).toBe(1);
    expect(component.ocupation().length).toBe(1);
  });

  it('hydrates the form, ids and address when spouse data exists', () => {
    storedSpouseItem = buildSpouseSignalItem();
    createComponent();

    component.ngAfterViewInit();
    component.profileForm.get('firstName')?.setValue('PEDRO');
    component.addressSectionComponent.profileForm.get('street')?.setValue('NUEVA');

    expect(component.newData).toBeFalse();
    expect(component.ids.SpouseDataId.id).toBe(1);
    expect(component.profileForm.get('firstName')?.value).toBe('PEDRO');
    expect(component.curpAux).toBe('GODE561231HDFABC09');
    expect((component.addressSectionComponent as any).setAddresData).toHaveBeenCalledWith(jasmine.objectContaining({ id: 0, street: 'INSURGENTES' }));
    expect(unsavedChangesServiceMock.setUnsavedChanges).toHaveBeenCalled();
  });

  it('disables forms in maintenance mode and tracks foreign spouse flags', () => {
    currentInfo.isMaintenance = true;
    storedSpouseItem = buildSpouseSignalItem({
      spousedata: {
        curp: 'GODE561231HNEABC09',
        foreignerWithoutCurp: true,
      },
      address: { country: 'US' },
    });
    createComponent();

    component.ngAfterViewInit();

    expect(component.foreign()).toBeTrue();
    expect(component.foreignerCURP()).toBeTrue();
    expect(component.profileForm.get('curp')?.disabled).toBeTrue();
    expect(component.profileForm.disabled).toBeTrue();
    expect(component.addressSectionComponent.profileForm.disabled).toBeTrue();
    expect(component.isMaintenanceE()).toBeFalse();
  });

  it('enables forms and button state on edit when the role can edit', () => {
    storedSpouseItem = buildSpouseSignalItem();
    createComponent();
    component.ngAfterViewInit();

    component.editt();

    expect(component.profileForm.enabled).toBeTrue();
    expect(component.addressSectionComponent.profileForm.enabled).toBeTrue();
    expect((component.addressSectionComponent as any).enableDisableFECityMun).toHaveBeenCalledWith('MX');
    expect(document.getElementById('btnEdit')?.getAttribute('disabled')).toBe('true');
    expect(document.getElementById('btnSave')?.hasAttribute('disabled')).toBeFalse();
    expect(document.getElementById('btnCancel')?.hasAttribute('disabled')).toBeFalse();
  });

  it('does not enable forms on edit when permissions are fully disabled', () => {
    permissions.spouse.allDisabled = true;
    createComponent();
    component.profileForm.disable();
    component.addressSectionComponent.profileForm.disable();

    component.editt();

    expect(component.profileForm.disabled).toBeTrue();
    expect(component.addressSectionComponent.profileForm.disabled).toBeTrue();
  });

  it('restores persisted data and pristine state on cancel', () => {
    storedSpouseItem = buildSpouseSignalItem();
    createComponent();
    component.ngAfterViewInit();
    component.profileForm.enable();
    component.addressSectionComponent.profileForm.enable();
    component.profileForm.patchValue({ firstName: 'OTRO' });
    component.addressSectionComponent.profileForm.patchValue({ street: 'OTRA' });

    component.cancel();

    expect(component.profileForm.get('firstName')?.value).toBe('JUAN');
    expect(component.profileForm.disabled).toBeTrue();
    expect(component.addressSectionComponent.profileForm.disabled).toBeTrue();
    expect(component.profileForm.pristine).toBeTrue();
    expect(document.getElementById('btnEdit')?.hasAttribute('disabled')).toBeFalse();
    expect(document.getElementById('btnSave')?.getAttribute('disabled')).toBe('true');
    expect(unsavedChangesServiceMock.setUnsavedChanges).toHaveBeenCalledWith(false);
  });

  it('normalizes curp values and rejects non alphanumeric keys', () => {
    createComponent();
    component.profileForm.get('curp')?.setValue('goñe561231hdfabc09');

    component.toUppercaseCURP('curp');

    expect(component.profileForm.get('curp')?.value).toBe('GOXE561231HDFABC09');

    const invalidEvent = { key: '-', preventDefault: jasmine.createSpy('preventDefault') } as any;
    const validEvent = { key: 'A', preventDefault: jasmine.createSpy('preventDefault') } as any;
    component.allowAlphanumericOnly(invalidEvent);
    component.allowAlphanumericOnly(validEvent);
    expect(invalidEvent.preventDefault).toHaveBeenCalled();
    expect(validEvent.preventDefault).not.toHaveBeenCalled();
  });

  it('validates birth dates and extracts RFC and date values from helper methods', () => {
    createComponent();

    expect(component.dateValidator(new FormControl('bad-date'))).toEqual({ dateInvalid: true });
    expect(component.dateValidator(new FormControl('1899-12-31'))).toEqual({ dateVeryOld: true });
    expect(component.dateValidator(new FormControl('2999-01-01'))).toEqual({ underage: true });
    expect(component.dateValidator(new FormControl('1956-12-31'))).toBeNull();
    expect(component.getRFC('GODE561231ABC', 'MART900101HDFABC09')).toBe('MART900101ABC');
    expect(component.getDateOfBirthFromCURP('GODE561231HDFABC09')?.getFullYear()).toBe(1956);
    expect(component.getDateOfBirthFromCURP('')).toBeNull();
  });

  it('detects post-2000 birth years when the homoclave letter is alphabetic', () => {
    createComponent();

    expect(component.getDateOfBirthFromCURP('ABCD000101HDFABCA1')?.getFullYear()).toBe(2000);
  });

  it('clears dependent fields and rebuilds local curp data for mexican and foreign curps', () => {
    createComponent();
    component.profileForm.patchValue({
      curp: 'GODE561231HDFABC09',
      rfc: '',
      firstName: 'X',
      middleName: 'Y',
      firstLastName: 'Z',
      secondLastName: 'W',
      gender: 'M',
      dateOfBirth: '2000-01-01',
    });

    component.clear();
    expect(component.profileForm.get('firstName')?.value).toBe('');
    expect(component.profileForm.get('rfc')?.value).toBe('');

    component.profileForm.patchValue({ curp: 'GODE561231HDFABC09', rfc: '' });
    component.loadCurpData();
    expect(component.profileForm.get('gender')?.value).toBe('H');
    expect(component.profileForm.get('typeIden')?.value).toBe('1');
    expect(component.profileForm.get('rfc')?.value).toBe('GODE561231');
    expect(component.foreign()).toBeFalse();

    component.profileForm.patchValue({ curp: 'GODE561231HNEABC09', rfc: '' });
    component.loadCurpData();
    expect(component.foreign()).toBeTrue();
  });

  it('formats and validates curp data against the birth date', () => {
    createComponent();
    component.profileForm.patchValue({ dateOfBirth: '1956-12-31', curp: 'GODE561231HDFABC09' });

    expect(component.validationDataCurp()).toBe('561231');
    expect(component.getDate('2024-05-10')).toBe('240510');
    expect(component.validationDataFormDataCURP()).toBeFalse();

    component.profileForm.patchValue({ dateOfBirth: '2000-01-01' });
    expect(component.validationDataFormDataCURP()).toBeTrue();
    expect(notificationsServiceMock.error).toHaveBeenCalledWith('La CURP y la Fecha Nacimiento no coinciden.');
  });

  it('removes extra spaces and returns watchlist type values', () => {
    createComponent();

    expect(component.removeExtraSpaces('JUAN   CARLOS')).toBe('JUAN CARLOS');
    expect(component.getListValues({ matchLists: [{ type: 'PEP' }, { type: 'SANCTION' }] } as any)).toEqual(['PEP', 'SANCTION']);
    expect(component.getListValues(undefined)).toEqual([]);
  });

  it('toggles foreigner mode and curp control state', () => {
    createComponent();
    component.profileForm.patchValue({ curp: 'GODE561231HDFABC09' });

    component.onForeignerClick({ target: { checked: true } } as any);
    expect(component.foreignerCURP()).toBeTrue();
    expect(component.profileForm.get('curp')?.disabled).toBeTrue();
    expect(component.dataAux).toBe(STRINGS.FOREIGN);

    component.onForeignerClick({ target: { checked: false } } as any);
    expect(component.foreignerCURP()).toBeFalse();
    expect(component.profileForm.get('curp')?.enabled).toBeTrue();
    expect(component.profileForm.get('typeIden')?.value).toBe('1');
  });

  it('marks invalid fields through error()', () => {
    createComponent();

    component.error();

    expect(component.profileForm.get('curp')?.touched).toBeTrue();
    expect(component.profileForm.get('typeIden')?.touched).toBeTrue();
  });

  it('returns validation errors for missing required data and invalid curp state', () => {
    createComponent();

    expect(component.validador()).toBeTrue();
    expect(notificationsServiceMock.error).toHaveBeenCalledWith('Faltan Campos Obligatorios por Capturar');

    notificationsServiceMock.error.calls.reset();
    fillRequiredForm();
    component.validCurp = false;

    expect(component.validador()).toBeTrue();
    expect(notificationsServiceMock.error).toHaveBeenCalledWith('Ingresa una CURP Válida.');
  });

  it('returns false for a valid foreign spouse form', () => {
    createComponent();
    fillRequiredForm();
    component.foreignerCURP.set(true);
    component.profileForm.get('curp')?.disable();

    expect(component.validador()).toBeFalse();
  });

  it('maps the form into a DataClient payload', () => {
    createComponent();
    fillRequiredForm();

    expect(component.getDataClient()).toEqual(jasmine.objectContaining({
      curp: 'GODE561231HDFABC09',
      foreignerWithoutCurp: false,
      typeIden: '1',
      rfc: 'GODE561231ABC',
      firstName: 'JUAN',
      firstLastName: 'PEREZ',
      secondLastName: 'LOPEZ',
    }));
  });

  it('submits the spouse when validation passes and watchlist allows it', async () => {
    createComponent();
    fillRequiredForm();
    spyOn(component, 'validador').and.returnValue(false);

    const result = await component.submit();

    expect(searchClientFlowServiceMock.validInWatchList).toHaveBeenCalled();
    expect(result).toEqual(component.client());
    expect(component.curpAux).toBe('');
  });

  it('returns null from submit when validation fails or watchlist rejects', async () => {
    createComponent();
    spyOn(component, 'validador').and.returnValue(true);

    expect(await component.submit()).toBeNull();

    (component.validador as jasmine.Spy).and.returnValue(false);
    searchClientFlowServiceMock.validInWatchList.and.resolveTo(false);
    expect(await component.submit()).toBeNull();
  });

  it('saves spouse data on submit when both sections are valid', async () => {
    createComponent();
    const spouseData = {
      curp: 'GODE561231HDFABC09',
      foreignerWithoutCurp: false,
      typeIden: '1',
      rfc: 'GODE561231ABC',
      firstName: 'JUAN',
      middleName: 'CARLOS',
      dateOfBirth: '1956-12-31',
      firstLastName: 'PEREZ',
      secondLastName: 'LOPEZ',
      gender: 'H',
      occupation: 'EMPLEADO',
      economicActivity: 'SERVICIOS',
    };
    spyOn(component, 'submit').and.resolveTo(spouseData as any);
    spyOn(component, 'update').and.resolveTo();

    await component.onSubmit();

    expect(checkpointServiceMock.saveSectionMant).toHaveBeenCalledWith('spouse-data', jasmine.any(Object));
    expect(component.update).toHaveBeenCalled();
    expect(notificationsServiceMock.success).toHaveBeenCalledWith('Guardado con éxito');
    expect(unsavedChangesServiceMock.setUnsavedChanges).toHaveBeenCalledWith(false);
  });

  it('does not save spouse data when one section returns null', async () => {
    createComponent();
    spyOn(component, 'submit').and.resolveTo(null);

    await component.onSubmit();

    expect(checkpointServiceMock.saveSectionMant).not.toHaveBeenCalled();
  });

  it('updates local spouse state from the maintenance checkpoint response', async () => {
    createComponent();

    await component.update();

    expect(checkpointServiceMock.getMaintenanceSectionByPersonaFisica).toHaveBeenCalledWith(['spouse-data']);
    expect(spouseServiceMock.setItem).toHaveBeenCalled();
    expect(component.newData).toBeFalse();
    expect(component.ids.AddressSpouseId.id).toBe(4);
    expect(component.profileForm.get('firstName')?.value).toBe('JUAN');
    expect((component.addressSectionComponent as any).setAddresData).toHaveBeenCalledWith(jasmine.objectContaining({ id: 0, street: 'INSURGENTES' }));
    expect(unsavedChangesServiceMock.setUnsavedChanges).toHaveBeenCalledWith(false);
  });

  it('loads renapo data when curp validation succeeds', async () => {
    createComponent();
    component.profileForm.patchValue({ curp: 'GODE561231HDFABC09', rfc: '' });

    await component.loadCurpDataService();

    expect(validCurpServiceMock.postData).toHaveBeenCalledWith({ curp: 'GODE561231HDFABC09' });
    expect(component.profileForm.get('firstName')?.value).toBe('JUAN');
    expect(component.profileForm.get('middleName')?.value).toBe('CARLOS');
    expect(component.profileForm.get('firstLastName')?.value).toBe('PEREZ');
    expect(component.profileForm.get('secondLastName')?.value).toBe('LOPEZ');
    expect(component.profileForm.get('gender')?.value).toBe('H');
    expect(component.profileForm.get('rfc')?.value).toBe('GODE561231');
    expect(component.profileForm.get('typeIden')?.value).toBe('1');
    expect(component.validCurp).toBeTrue();
  });

  it('maps single-name renapo responses and preserves existing RFC suffix', async () => {
    validCurpServiceMock.postData.and.returnValue(of({
      status: 200,
      messages: [],
      payload: {
        result: true,
        renapoResponse: true,
        intents: 1,
        curp: 'GODE561231HDFABC09',
        names: 'JUAN',
        lastName: 'PEREZ',
        secondLastName: 'LOPEZ',
        gender: 'H',
        birthDate: '1956-12-31',
        birthStateCode: 'DF',
        birthState: 'CIUDAD DE MEXICO',
      },
    }));
    createComponent();
    component.profileForm.patchValue({ curp: 'GODE561231HDFABC09', rfc: 'ABCD990101XYZ' });

    await component.loadCurpDataService();

    expect(component.profileForm.get('firstName')?.value).toBe('JUAN');
    expect(component.profileForm.get('middleName')?.value).toBe('');
    expect(component.profileForm.get('rfc')?.value).toBe('GODE561231XYZ');
  });

  it('maps three-part renapo names into middleName', async () => {
    validCurpServiceMock.postData.and.returnValue(of({
      status: 200,
      messages: [],
      payload: {
        result: true,
        renapoResponse: true,
        intents: 1,
        curp: 'GODE561231HDFABC09',
        names: 'JUAN CARLOS LUIS',
        lastName: 'PEREZ',
        secondLastName: 'LOPEZ',
        gender: 'H',
        birthDate: '1956-12-31',
        birthStateCode: 'DF',
        birthState: 'CIUDAD DE MEXICO',
      },
    }));
    createComponent();
    component.profileForm.patchValue({ curp: 'GODE561231HDFABC09', rfc: '' });

    await component.loadCurpDataService();

    expect(component.profileForm.get('middleName')?.value).toBe('JUAN CARLOS LUIS');
  });

  it('falls back to manual capture when renapo does not find the curp', async () => {
    validCurpServiceMock.postData.and.returnValue(of({
      status: 200,
      messages: [],
      payload: {
        result: false,
        renapoResponse: false,
        intents: 1,
        curp: 'GODE561231HDFABC09',
        names: null,
        lastName: null,
        secondLastName: null,
        gender: null,
        birthDate: null,
        birthStateCode: null,
        birthState: null,
      },
    }));
    createComponent();
    component.profileForm.patchValue({ curp: 'GODE561231HDFABC09' });
    spyOn(component, 'loadCurpData');

    await component.loadCurpDataService();

    expect(notificationModalServiceMock.warning).toHaveBeenCalled();
    expect(component.loadCurpData).toHaveBeenCalled();
    expect(component.validCurp).toBeTrue();
  });

  it('notifies manual capture when curp validation service fails and handles foreign or invalid curps', async () => {
    validCurpServiceMock.postData.and.returnValue(of({
      status: 0,
      messages: [],
      payload: {
        result: false,
        renapoResponse: false,
        intents: 0,
        curp: null,
        names: null,
        lastName: null,
        secondLastName: null,
        gender: null,
        birthDate: null,
        birthStateCode: null,
        birthState: null,
      },
    }));
    createComponent();
    component.profileForm.patchValue({ curp: 'GODE561231HDFABC09' });
    spyOn(component, 'loadCurpData');

    await component.loadCurpDataService();
    expect(notificationsServiceMock.error).toHaveBeenCalledWith('Captura la Información del Cliente Manualmente');
    expect(component.loadCurpData).toHaveBeenCalled();

    notificationsServiceMock.error.calls.reset();
    (component.loadCurpData as jasmine.Spy).calls.reset();
    component.curpAux = '';
    component.profileForm.patchValue({ curp: 'GODE561231HNEABC09' });
    await component.loadCurpDataService();
    expect(component.loadCurpData).toHaveBeenCalled();

    component.profileForm.patchValue({ curp: 'INVALID' });
    await component.loadCurpDataService();
    expect(notificationsServiceMock.error).toHaveBeenCalledWith('Ingresa una CURP Válida.');
    expect(component.validCurp).toBeFalse();
  });

  it('validates RFC format errors for type 1', () => {
    createComponent();
    fillRequiredForm();
    component.validCurp = true;
    component.profileForm.patchValue({ rfc: 'BAD', typeIden: '1' });

    expect(component.validador()).toBeTrue();
    expect(notificationsServiceMock.error).toHaveBeenCalledWith('Tienes Campos Capturados con Formato Incorrecto');
  });

  it('validates RFC month and day consistency', () => {
    createComponent();
    fillRequiredForm();
    component.validCurp = true;
    component.profileForm.patchValue({ rfc: 'ABCD001301ABC', typeIden: '1' });

    expect(component.validador()).toBeTrue();
    expect(notificationsServiceMock.error).toHaveBeenCalledWith('El Mes en el RFC es Invalido. ');

    notificationsServiceMock.error.calls.reset();
    component.profileForm.patchValue({ rfc: 'ABCD000231ABC', typeIden: '1' });

    expect(component.validador()).toBeTrue();
    expect(notificationsServiceMock.error).toHaveBeenCalledWith('El Día Indicado en el RFC es Invalido ya que no Coincide con el Mes.');
  });

  it('validates alternate identifier formats for type 2', () => {
    createComponent();
    fillRequiredForm();
    component.validCurp = true;
    component.profileForm.patchValue({ rfc: 'INVALID-TOO-LONG', typeIden: '2' });

    expect(component.validador()).toBeTrue();
    expect(notificationsServiceMock.error).toHaveBeenCalledWith('Tienes Campos Capturados con Formato Incorrecto');
  });

  it('validates first and middle name formats', () => {
    createComponent();
    fillRequiredForm();
    component.validCurp = true;
    component.profileForm.patchValue({ firstName: 'juan' });

    expect(component.validador()).toBeTrue();
    expect(notificationsServiceMock.error).toHaveBeenCalledWith('Ingresa un Nombre Válido.');

    notificationsServiceMock.error.calls.reset();
    fillRequiredForm();
    component.validCurp = true;
    component.profileForm.patchValue({ middleName: 'carlos' });

    expect(component.validador()).toBeTrue();
    expect(notificationsServiceMock.error).toHaveBeenCalledWith('Ingresa un Segundo Nombre Válido.');
  });

  it('requires at least one last name and validates each surname field', () => {
    createComponent();
    fillRequiredForm();
    component.validCurp = true;
    component.profileForm.patchValue({ firstLastName: '', secondLastName: '' });

    expect(component.validador()).toBeTrue();
    expect(notificationsServiceMock.error).toHaveBeenCalledWith('Ingresa al Menos un Apellido.');

    notificationsServiceMock.error.calls.reset();
    fillRequiredForm();
    component.validCurp = true;
    component.profileForm.patchValue({ firstLastName: 'pérez' });

    expect(component.validador()).toBeTrue();
    expect(notificationsServiceMock.error).toHaveBeenCalledWith('Ingresa Primer Apellido Válido.');

    notificationsServiceMock.error.calls.reset();
    fillRequiredForm();
    component.validCurp = true;
    component.profileForm.patchValue({ secondLastName: 'lópez' });

    expect(component.validador()).toBeTrue();
    expect(notificationsServiceMock.error).toHaveBeenCalledWith('Ingresa Segundo Apellido Válido.');
  });

  it('validates date of birth control errors and curp mismatch from validador()', () => {
    createComponent();
    fillRequiredForm();
    component.validCurp = true;
    component.profileForm.patchValue({ dateOfBirth: new Date('2999-01-01') });

    expect(component.validador()).toBeTrue();
    expect(notificationsServiceMock.error).toHaveBeenCalledWith('Fecha de Nacimiento no Válida');

    notificationsServiceMock.error.calls.reset();
    fillRequiredForm();
    component.validCurp = true;
    component.profileForm.patchValue({ dateOfBirth: '2000-01-01' });

    expect(component.validador()).toBeTrue();
    expect(notificationsServiceMock.error).toHaveBeenCalledWith('La CURP y la Fecha Nacimiento no coinciden.');
  });
});
