import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { AuthorizedPersonComponent } from './authorized-person.component';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { OnboardingService } from '../../services/onboarding.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { AuthorizedPersonSignalService } from '../../services/checkpoint/authorized-persona-signal.service';
import { PermissionRolService } from '../../../core/services/rol.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { AuthorizedPerson, AuthorizedPersonPageData } from '../../models/authorized-person-page-data';
import { CurrentOnboardingInfo } from '../../models/current-onboarding';
import * as Mapper from '../../services/mappers/authorized-person.mapper';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { CoreModule } from '../../../core/core.module';
import { SharedModule } from '../../../shared/shared.module';

describe('AuthorizedPersonComponent', () => {
  let component: AuthorizedPersonComponent;
  let fixture: ComponentFixture<AuthorizedPersonComponent>;

  let dialog: jasmine.SpyObj<MatDialog>;
  let modalService: jasmine.SpyObj<NotificationModalService>;
  let notifService: jasmine.SpyObj<NotificationsService>;
  let onboardingService: jasmine.SpyObj<OnboardingService>;
  let checkpointService: jasmine.SpyObj<CheckpointService>;
  let signalService: jasmine.SpyObj<AuthorizedPersonSignalService>;
  let permissionService: jasmine.SpyObj<PermissionRolService>;
  let unsavedChangesService: jasmine.SpyObj<UnsavedChangesService>;

  const mockInfo: CurrentOnboardingInfo = {
    requestId: 'REQ-001',
    personType: 'PF',
    name: 'Cliente Test',
    contractType: '8',
    contractSubtype: '49',
    businessType: '1',
    onboardingId: 1,
    isMaintenance: false,
    isCustomer: false,
    isOnboarding: false,
    clientId: 123,
    accountId: 456,
    accountData: null,
  };

  const makeAuthorizedPerson = (overrides: Partial<AuthorizedPerson> = {}): AuthorizedPerson => ({
    id: 10,
    personId: 20,
    active: true,
    tempId: 'tmp-1',
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
    },
    contactData: {
      id: '1',
      phone: '5555555555',
      phoneType: 'CEL',
      phoneTypeId: '1',
      phoneCountry: 'MX',
      phoneCountryId: 'MX',
      phoneCodeArea: '55',
      phoneExtension: '',
      phoneNotification: false,
      active: true,
    },
    authorizedPerson: {
      signClass: 'A',
      management: 'yes',
      relationship: '1',
      authorizedPerson: '1',
      economicActivity: '1',
      occupation: '1',
      profession: 'ING',
      workCompany: 'EMPRESA',
      jobTitle: 'PUESTO',
      isPpe: 'no',
      ppeType: '',
      ppeRol: '',
      ppeExpires: '',
      ppeHasFamily: 'no',
      email: 'test@mail.com',
      faculty: '1 Firma A',
      otherFaculty: '',
    },
    ...overrides,
  });

  beforeEach(async () => {
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    modalService = jasmine.createSpyObj('NotificationModalService', ['confirm']);
    notifService = jasmine.createSpyObj('NotificationsService', ['success', 'info']);
    onboardingService = jasmine.createSpyObj('OnboardingService', ['getCurrentInfo']);
    checkpointService = jasmine.createSpyObj('CheckpointService', ['saveSection', 'saveSectionMant', 'getMaintenanceSectionByPersonaFisica']);
    signalService = jasmine.createSpyObj('AuthorizedPersonSignalService', ['getData', 'setData']);
    permissionService = jasmine.createSpyObj('PermissionRolService', ['getPermissions']);
    unsavedChangesService = jasmine.createSpyObj('UnsavedChangesService', ['setUnsavedChanges']);

    const initialData: AuthorizedPersonPageData = {
      data: [makeAuthorizedPerson()],
      table: []
    };

    onboardingService.getCurrentInfo.and.returnValue({ ...mockInfo });
    signalService.getData.and.returnValue(initialData);
    permissionService.getPermissions.and.returnValue({
      'authorized-person': {
        permission: ['add', 'edit', 'delete'],
        allDisabled: false,
      },
      'authorized-person-pm': {
        permission: ['add', 'edit', 'delete'],
        allDisabled: false,
      }
    });
    modalService.confirm.and.returnValue(Promise.resolve({ value: true }));

    await TestBed.configureTestingModule({
      declarations: [AuthorizedPersonComponent],
      imports: [
          CoreModule,
          SharedModule,
          RouterModule.forRoot([]),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                relationshipResolver: [{ relationshipId: '1' }],
                economicActivityResolver: [{ id: '1' }],
                occupationResolver: [{ id: '1' }],
                authorizedPersonResolver: [{ authorizedPersonId: '1', authorizedPerson: 'Titular' }],
                addressTypeResolver: [{ addressTypeId: '1', addressType: 'Casa' }],
              }
            }
          }
        },
        { provide: MatDialog, useValue: dialog },
        { provide: NotificationModalService, useValue: modalService },
        { provide: NotificationsService, useValue: notifService },
        { provide: OnboardingService, useValue: onboardingService },
        { provide: CheckpointService, useValue: checkpointService },
        { provide: AuthorizedPersonSignalService, useValue: signalService },
        { provide: PermissionRolService, useValue: permissionService },
        { provide: UnsavedChangesService, useValue: unsavedChangesService },
        { provide: MsalService, useValue: {} },
        { provide: MsalBroadcastService, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(AuthorizedPersonComponent, {
        set: { template: '' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(AuthorizedPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize lists and map table data on init', () => {
    expect(component.relationshipList().length).toBe(1);
    expect(component.addressTypeList().length).toBe(1);
    expect(component.authorizedPersonData().table.length).toBe(1);
    expect(component.authorizedPersonData().table[0].address).toBe('Casa');
  });

  it('should get faculty option for current contract and person type', () => {
    const option = component.getFacultyOption();
    expect(option).not.toBeNull();
    expect(option?.id).toBe('2-AS-016');
  });

  it('should add item and mark unsaved changes', () => {
    const baseLength = component.authorizedPersonData().data.length;
    const newPerson = makeAuthorizedPerson({ tempId: 'tmp-2' });

    component.addItem({
      ok: true,
      edit: false,
      data: newPerson,
      table: {
        tempId: 'tmp-2',
        clientNumber: '2',
        rfc: 'XEXX010101000',
        address: 'Casa',
        telephone: '5511223344',
        privileges: '1 Firma B',
      }
    });

    expect(component.authorizedPersonData().data.length).toBe(baseLength + 1);
    expect(unsavedChangesService.setUnsavedChanges).toHaveBeenCalledWith(true);
    expect(notifService.success).toHaveBeenCalled();
  });

  it('should edit existing row and clear editing state', () => {
    component.isEditting = true;
    const updated = makeAuthorizedPerson({ tempId: 'tmp-1', clientData: { ...makeAuthorizedPerson().clientData, rfc: 'RFCEDITADO' } });

    component.editItem({
      ok: true,
      edit: true,
      data: updated,
      table: {
        tempId: 'tmp-1',
        clientNumber: '10',
        rfc: 'RFCEDITADO',
        address: 'Casa',
        telephone: '5555555555',
        privileges: '1 Firma A',
      }
    });

    expect(component.authorizedPersonData().data[0].clientData.rfc).toBe('RFCEDITADO');
    expect(component.isEditting).toBeFalse();
    expect(unsavedChangesService.setUnsavedChanges).toHaveBeenCalledWith(true);
  });

  it('should delete row in onboarding mode', fakeAsync(() => {
    component.isMaintenance.set(false);

    component.eventRow({ type: 'delete', row: { tempId: 'tmp-1' } });
    tick();

    expect(component.authorizedPersonData().data.length).toBe(0);
    expect(notifService.info).toHaveBeenCalled();
  }));

  it('should soft delete row in maintenance mode', fakeAsync(() => {
    component.isMaintenance.set(true);

    component.eventRow({ type: 'delete', row: { tempId: 'tmp-1' } });
    tick();

    expect(component.authorizedPersonData().data[0].active).toBeFalse();
  }));

  it('should call addItem when modal closes with non edit data', () => {
    const addSpy = spyOn(component, 'addItem');
    const editSpy = spyOn(component, 'editItem');
    dialog.open.and.returnValue({
      afterClosed: () => of({ ok: true, edit: false, data: makeAuthorizedPerson({ tempId: 'tmp-3' }), table: { tempId: 'tmp-3' } })
    } as any);

    component.showModal();

    expect(dialog.open).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalled();
    expect(editSpy).not.toHaveBeenCalled();
  });

  it('should call saveCheckpoint on submit when onboarding mode', () => {
    const saveSpy = spyOn(component, 'saveCheckpoint');
    const saveMaintSpy = spyOn(component, 'saveMaintenance');
    component.isMaintenance.set(false);

    component.submit();

    expect(saveSpy).toHaveBeenCalled();
    expect(saveMaintSpy).not.toHaveBeenCalled();
  });

  it('should call saveMaintenance on submit when maintenance mode', () => {
    const saveSpy = spyOn(component, 'saveCheckpoint');
    const saveMaintSpy = spyOn(component, 'saveMaintenance');
    component.isMaintenance.set(true);

    component.submit();

    expect(saveMaintSpy).toHaveBeenCalled();
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('should save checkpoint and update signal when response is CREATED', () => {
    checkpointService.saveSection.and.returnValue(
      of({ applicationNumber: '1', sectionId: 'authorized-person', status: 'CREATED' })
    );

    component.saveCheckpoint();

    expect(checkpointService.saveSection).toHaveBeenCalledWith(
      'authorized-person',
      jasmine.objectContaining({ authorizedPerson: jasmine.any(Array) })
    );
    expect(signalService.setData).toHaveBeenCalledWith(component.authorizedPersonData());
    expect(unsavedChangesService.setUnsavedChanges).toHaveBeenCalledWith(false);
    expect(notifService.success).toHaveBeenCalled();
  });

  it('should save maintenance and remap table data after backend refresh', () => {
    checkpointService.saveSectionMant.and.returnValue(
      of({ applicationNumber: '1', sectionId: 'authorized-person', status: 'CREATED' })
    );
    checkpointService.getMaintenanceSectionByPersonaFisica.and.returnValue(
      of({
        checkpoints: [{
          data: {
            authorizedPerson: [{
              id: 1,
              personId: 2,
              active: true,
              curp: 'CURP123456HDFABC01',
              foreignWithoutCURP: false,
              rfc: 'XAXX010101000',
              nif: '',
              tin: '',
              nss: '',
              firstName: 'JUAN',
              middleName: 'CARLOS',
              lastName: 'PEREZ',
              secondLastName: 'LOPEZ',
              birthDate: '1990-01-01',
              gender: '1',
              maritalStatus: '1',
              nationality: 'MX',
              birthCountry: 'MX',
              signatureClass: 'A',
              checkbookManagementAccess: true,
              relationship: '1',
              authorizedPersonType: '1',
              economicActivity: '1',
              occupation: '1',
              profession: 'ING',
              companyName: 'EMPRESA',
              jobTitle: 'PUESTO',
              personPpe: {
                id: 1,
                isPpe: false,
                ppeType: '',
                positionHeld: '',
                positionEndDate: '',
                hasppeRelatives: false,
              },
              residenceAddress: {
                id: 1,
                addressType: '1',
                otherAddressType: '',
                country: 'MX',
                postalCode: '01234',
                neighborhood: 'DEL VALLE',
                street: 'INSURGENTES',
                externalNumber: '100',
                internalNumber: '1',
                federalEntity: '09',
                municipality: '010',
              },
              contact: {
                id: 1,
                phone: '5555555555',
                type: '1',
                country: 'MX',
                areaCode: '55',
                extension: '',
                notification: false,
                emailAddress: 'test@mail.com',
              },
              faculties: {
                id: 1,
                singnatureInstruction: '1 Firma A',
                otherSignatureInstruction: '',
              },
            }]
          }
        }]
      })
    );

    component.saveMaintenance();

    expect(checkpointService.saveSectionMant).toHaveBeenCalled();
    expect(checkpointService.getMaintenanceSectionByPersonaFisica).toHaveBeenCalledWith(['authorized-person']);
    expect(component.authorizedPersonData().data.length).toBe(1);
    expect(component.authorizedPersonData().table.length).toBe(1);
    expect(signalService.setData).toHaveBeenCalledWith(component.authorizedPersonData());
  });

  it('should initialize maintenance button state', () => {
    component.initializeMaintenance();

    expect(component.disButtons).toEqual({
      save: true,
      register: true,
      edit: false,
      cancel: true,
    });
    expect(component.tableConfig.showDeleteAction).toBeTrue();
  });

  it('should validate role on edit in maintenance', () => {
    component.permissions = { permission: ['edit'], allDisabled: false };

    component.validateRolOnEdit();

    expect(component.disButtons.register).toBeTrue();
  });
});