import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { EntityStatusComponent } from './entity-status.component';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { EntityStatusService } from '../../../shared/services/storage-services/pm/entity-status.service';
import { OnboardingService } from '../../services/onboarding.service';
import { PermissionRolService } from '../../../core/services/rol.service';
import { RealOwnerPmService } from '../../../shared/services/storage-services/pm/real-owner-pm.service';
import { AdministratorExercisingPfControlService } from '../../../shared/services/storage-services/pm/administrator-exercising-pf-control.service';
import { ERROR_MESSAGES } from '../../constants/form-messages';
import { EntityStatusSection } from '../../models/entity-status';

describe('EntityStatusComponent', () => {
  let component: EntityStatusComponent;
  let fixture: ComponentFixture<EntityStatusComponent>;
  let notificationsService: jasmine.SpyObj<NotificationsService>;
  let catalogsService: jasmine.SpyObj<CatalogsService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let notificationModalService: jasmine.SpyObj<NotificationModalService>;
  let router: jasmine.SpyObj<Router>;
  let unsavedChangesService: jasmine.SpyObj<UnsavedChangesService>;
  let storageService: jasmine.SpyObj<EntityStatusService>;
  let onboardingService: jasmine.SpyObj<OnboardingService>;
  let roleService: jasmine.SpyObj<PermissionRolService>;
  let realOwnerPmStorage: jasmine.SpyObj<RealOwnerPmService>;
  let controlAdmonStorage: jasmine.SpyObj<AdministratorExercisingPfControlService>;

  const countriesMock = [
    { country: 'Mexico', countryId: 'MX', countryCode: '52' },
    { country: 'United States', countryId: 'US ', countryCode: '1' },
  ];

  const nationalitiesMock = [
    { nationalityId: 'MX', nationality: 'Mexicana' },
    { nationalityId: 'US', nationality: 'Estadounidense' },
  ];

  const createInitialData = (): EntityStatusSection => ({
    rfc: 'RFC123',
    nationality: 'MX',
    hasResidenceInMexico: false,
    hasOutlaterFiscalResidence: true,
    fatcaClasificationType: '11',
    fatcaClasificationText: 'Texto FATCA',
    factaClasificationGiin: 'GIIN-001',
    crsClasificationType: '2',
    crsClasificationText: 'Texto CRS',
    fiscalResidences: [
      {
        id: 'f1',
        registerNumber: 1,
        fiscalResidence: 'United States',
        fiscalResidenceId: 'US ',
        ein: 'EIN-1',
        tin: 'TIN-1',
        nss: 'NSS-1',
      },
    ],
    selectedPersons: [
      {
        id: 'p1',
        personType: 'Administrador',
        curp: 'CURP123',
        firstName: 'Ana',
        secondName: 'Maria',
        firstLastName: 'Lopez',
        secondLastName: 'Perez',
        birthday: new Date(1992, 4, 10),
        birthCountry: 'Mexico',
        birthFederativeEntity: 'Ciudad de Mexico',
        fullName: 'Ana Maria Lopez Perez',
        email: 'ana@example.com',
        phone: '5511111111',
        country: 'Mexico',
        postalCode: '01000',
        nationalityName: 'Mexicana',
        nationalityId: 'MX',
      },
    ],
  });

  let initialData: EntityStatusSection;

  beforeEach(async () => {
    initialData = createInitialData();
    notificationsService = jasmine.createSpyObj('NotificationsService', ['error', 'info']);
    catalogsService = jasmine.createSpyObj('CatalogsService', ['getCountry', 'getNationalities']);
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    notificationModalService = jasmine.createSpyObj('NotificationModalService', ['confirm']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    unsavedChangesService = jasmine.createSpyObj('UnsavedChangesService', ['setUnsavedChanges']);
    storageService = jasmine.createSpyObj('EntityStatusService', ['entityStatusPm']);
    onboardingService = jasmine.createSpyObj('OnboardingService', ['getCurrentInfo']);
    roleService = jasmine.createSpyObj('PermissionRolService', ['getPermissions']);
    realOwnerPmStorage = jasmine.createSpyObj('RealOwnerPmService', ['realOwnerPm']);
    controlAdmonStorage = jasmine.createSpyObj('AdministratorExercisingPfControlService', ['get']);

    catalogsService.getCountry.and.returnValue(of(countriesMock as any));
    catalogsService.getNationalities.and.returnValue(of(nationalitiesMock as any));
    storageService.entityStatusPm.and.returnValue(initialData);
    onboardingService.getCurrentInfo.and.returnValue({ isMaintenance: false } as any);
    roleService.getPermissions.and.returnValue({
      'entity-status': {
        allDisabled: false,
        sections: {
          'fiscal-countries': { allDisabled: false },
          facta: { allDisabled: false },
          crs: { allDisabled: false },
          'person-control': { allDisabled: false },
        },
      },
    } as any);
    realOwnerPmStorage.realOwnerPm.and.returnValue({ id: 'owner-1' } as any);
    controlAdmonStorage.get.and.returnValue({ client: [] } as any);
    notificationModalService.confirm.and.resolveTo({ value: true } as any);

    await TestBed.configureTestingModule({
      declarations: [EntityStatusComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: NotificationsService, useValue: notificationsService },
        { provide: CatalogsService, useValue: catalogsService },
        { provide: MatDialog, useValue: dialog },
        { provide: NotificationModalService, useValue: notificationModalService },
        { provide: Router, useValue: router },
        { provide: UnsavedChangesService, useValue: unsavedChangesService },
        { provide: CheckpointService, useValue: {} },
        { provide: EntityStatusService, useValue: storageService },
        { provide: OnboardingService, useValue: onboardingService },
        { provide: PermissionRolService, useValue: roleService },
        { provide: RealOwnerPmService, useValue: realOwnerPmStorage },
        { provide: AdministratorExercisingPfControlService, useValue: controlAdmonStorage },
      ],
    })
      .overrideComponent(EntityStatusComponent, {
        set: { template: '' },
      })
      .compileComponents();
  });

  afterEach(() => {
    document.body.classList.remove('show-validation');
  });

  const createComponent = (): void => {
    fixture = TestBed.createComponent(EntityStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create and initialize form, signals and columns on init', () => {
    createComponent();

    expect(component).toBeTruthy();
    expect(catalogsService.getCountry).toHaveBeenCalledWith({ land: [] });
    expect(catalogsService.getNationalities).toHaveBeenCalledWith({ land: [] });
    expect(component.countries()).toEqual(countriesMock as any);
    expect(component.nationalities()).toEqual(nationalitiesMock as any);
    expect(component.fiscalResidenceColumns.length).toBe(5);
    expect(component.personColumns.length).toBe(6);
    expect(component.form.value).toEqual(jasmine.objectContaining({
      rfc: 'RFC123',
      nationality: 'MX',
      fatcaClasificationType: '11',
      crsClasificationType: '2',
    }));
    expect(component.fiscalResidenceData()).toEqual(initialData.fiscalResidences);
    expect(component.personData()).toEqual(initialData.selectedPersons);
    expect(component.messageType).toBe('info');
    expect(component.requiredOulaterResidence).toBeTrue();
  });

  it('should persist form values into entityStatusSection on valid submit', () => {
    createComponent();
    component.form.patchValue({
      rfc: 'RFC999',
      nationality: 'US',
      hasResidenceInMexico: true,
      hasOutlaterFiscalResidence: false,
      fatcaClasificationType: '4',
      fatcaClasificationText: 'Texto ajustado',
      factaClasificationGiin: 'GIIN-999',
      crsClasificationType: '6',
      crsClasificationText: 'CRS ajustado',
    });

    component.onSubmit();

    expect(component.entityStatusSection).toEqual(jasmine.objectContaining({
      rfc: 'RFC999',
      nationality: 'US',
      hasResidenceInMexico: true,
      hasOutlaterFiscalResidence: false,
      fatcaClasificationType: '4',
      fatcaClasificationText: 'Texto ajustado',
      factaClasificationGiin: 'GIIN-999',
      crsClasificationType: '6',
      crsClasificationText: 'CRS ajustado',
    }));
    expect(notificationsService.error).not.toHaveBeenCalled();
  });

  it('should mark controls as touched and notify on invalid submit', () => {
    storageService.entityStatusPm.and.returnValue(null);
    realOwnerPmStorage.realOwnerPm.and.returnValue(null);
    createComponent();

    component.onSubmit();

    expect(component.form.controls['rfc'].touched).toBeTrue();
    expect(component.form.controls['nationality'].touched).toBeTrue();
    expect(document.body.classList.contains('show-validation')).toBeTrue();
    expect(notificationsService.error).toHaveBeenCalledWith(ERROR_MESSAGES.REQUIRED_FIELDS);
  });

  it('should add a fiscal residence row and update defaults from modal response', async () => {
    createComponent();
    const response = {
      id: 'f2',
      registerNumber: 2,
      fiscalResidence: 'United States',
      fiscalResidenceId: 'US ',
      ein: 'EIN-2',
      tin: 'TIN-2',
      nss: 'NSS-2',
    };
    dialog.open.and.returnValue({ afterClosed: () => of(response) } as any);

    await component.showFiscalResidenceModal();

    expect(dialog.open).toHaveBeenCalled();
    expect(component.fiscalResidenceData()).toContain(response as any);
    expect(component.entityStatusSection.fiscalResidences).toEqual(component.fiscalResidenceData());
    expect(component.form.value.fatcaClasificationType).toBe('1');
    expect(component.registerNumber).toBe(2);
  });

  it('should add a selected person from modal response', async () => {
    createComponent();
    const response = {
      id: 'p2',
      personType: 'Otro',
      curp: 'CURP999',
      firstName: 'Luis',
      secondName: 'Alberto',
      firstLastName: 'Ramirez',
      secondLastName: 'Diaz',
      birthday: new Date(1988, 7, 1),
      birthCountry: 'Mexico',
      birthFederativeEntity: 'Jalisco',
      fullName: 'Luis Alberto Ramirez Diaz',
      email: 'luis@example.com',
      phone: '5522222222',
      country: 'Mexico',
      postalCode: '44100',
      nationalityName: 'Mexicana',
      nationalityId: 'MX',
    };
    dialog.open.and.returnValue({ afterClosed: () => of(response) } as any);

    await component.showControlPersonModal();

    expect(component.personData()).toContain(response as any);
    expect(component.entityStatusSection.selectedPersons).toEqual(component.personData());
  });

  it('should delete selected person after confirmation', async () => {
    createComponent();

    await component.eventControlPerson({
      type: 'delete',
      row: initialData.selectedPersons[0],
    });

    expect(notificationModalService.confirm).toHaveBeenCalled();
    expect(component.personData()).toEqual([]);
    expect(component.entityStatusSection.selectedPersons).toEqual([]);
  });

  it('should redirect to administrator section when info notification is active', () => {
    createComponent();
    component.messageType = 'info';

    component.redirect();

    expect(router.navigate).toHaveBeenCalledWith(['/onboarding/new-customer/administrator-exercising-pf-control']);
    expect(notificationsService.info).toHaveBeenCalledWith('Sección en Construcción');
  });

  it('should map FATCA value into CRS default and show info notification when needed', () => {
    createComponent();

    component.setDefaultCrs({ value: '3' } as any);

    expect(component.form.value.crsClasificationType).toBe('2');
    expect(component.messageType).toBe('info');
  });
});
