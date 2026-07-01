import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog } from '@angular/material/dialog';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { InterviewComponent } from './interview.component';

import { CatalogsService } from '../../../shared/services/catalogs.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { PersonalInterviewService } from '../../../shared/services/storage-services/personal-interview.service';
import { FirstDataClientService } from '../../../shared/services/storage-services/first-data-client.service';
import { SignStorageService } from '../../../shared/services/storage-services/sign-storage.service';
import { OnboardingService } from '../../services/onboarding.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { GeneralInfoStorageService } from '../../../shared/services/storage-services/general-info-storage.service';
import { PermissionRolService } from '../../../core/services/rol.service';

describe('InterviewComponent', () => {
  let fixture: ComponentFixture<InterviewComponent>;
  let component: InterviewComponent;
  let router: Router;
  let currentInfo: any;
  let permissions: any;
  let personalInterviewData: any;
  let generalInfoData: any;
  let dialogResult: any;
  let firstDataClient: any;
  let signSection: any;
  let generalInfoSignal: any;
  let signSectionSignal: any;

  let catalogsSvc: jasmine.SpyObj<CatalogsService>;
  let notifSvc: jasmine.SpyObj<NotificationsService>;
  let unsavedSvc: jasmine.SpyObj<UnsavedChangesService>;
  let personalInterviewSvc: jasmine.SpyObj<PersonalInterviewService>;
  let firstDataClientSvc: jasmine.SpyObj<FirstDataClientService>;
  let signStorageSvc: SignStorageService;
  let onboardingSvc: jasmine.SpyObj<OnboardingService>;
  let checkpointSvc: jasmine.SpyObj<CheckpointService>;
  let generalInfoSvc: GeneralInfoStorageService;
  let permissionSvc: jasmine.SpyObj<PermissionRolService>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    currentInfo = {
      personType: 'PF',
      isMaintenance: false,
    };
    permissions = {
      interview: {
        allDisabled: false,
        permission: ['read', 'edit'],
        fieldsEnabled: ['opening'],
      },
    };
    personalInterviewData = null;
    generalInfoData = { occupation: '04' };
    dialogResult = { value: false };
    firstDataClient = null;
    signSection = null;
    generalInfoSignal = signal(generalInfoData as any);
    signSectionSignal = signal(signSection as any);

    catalogsSvc = jasmine.createSpyObj('CatalogsService', [
      'getEconomicActivity',
      'getRelationships',
      'getCountry',
      'getClientKnowledge',
      'getPropertyType',
    ]);
    catalogsSvc.getEconomicActivity.and.returnValue(of([]));
    catalogsSvc.getRelationships.and.returnValue(of([]));
    catalogsSvc.getCountry.and.returnValue(of([]));
    catalogsSvc.getClientKnowledge.and.returnValue(of([]));
    catalogsSvc.getPropertyType.and.returnValue(
      of([
        { propertyTypeId: '01', propertyType: 'PROPIO' } as any,
        { propertyTypeId: '02', propertyType: 'RENTADO' } as any,
      ]),
    );

    notifSvc = jasmine.createSpyObj('NotificationsService', ['success', 'error']);
    unsavedSvc = jasmine.createSpyObj('UnsavedChangesService', ['setUnsavedChanges']);
    personalInterviewSvc = jasmine.createSpyObj('PersonalInterviewService', ['getItem', 'setItem']);
    firstDataClientSvc = jasmine.createSpyObj('FirstDataClientService', ['getItem']);
    signStorageSvc = {
      singSectionSignal: signSectionSignal,
    } as any;
    onboardingSvc = jasmine.createSpyObj('OnboardingService', [
      'getCurrentInfo',
      'restoreInitialTabs',
    ]);
    checkpointSvc = jasmine.createSpyObj('CheckpointService', [
      'saveSection',
      'saveSectionMant',
      'getSection',
      'getMaintenanceSectionByPersonaFisica',
    ]);
    generalInfoSvc = {
      generalInfoItem: generalInfoSignal,
    } as any;
    permissionSvc = jasmine.createSpyObj('PermissionRolService', ['getPermissions']);
    dialog = jasmine.createSpyObj('MatDialog', ['open']);

    onboardingSvc.getCurrentInfo.and.callFake(() => currentInfo);

    checkpointSvc.saveSection.and.returnValue(of({ status: 'CREATED' } as any));
    checkpointSvc.saveSectionMant.and.returnValue(of({ status: 'CREATED' } as any));
    checkpointSvc.getSection.and.returnValue(of({ checkpoints: [{ data: {} }] } as any));
    checkpointSvc.getMaintenanceSectionByPersonaFisica.and.returnValue(
      of({ checkpoints: [{ data: {} }] } as any),
    );

    permissionSvc.getPermissions.and.callFake(() => permissions as any);
    personalInterviewSvc.getItem.and.callFake(() => personalInterviewData);
    firstDataClientSvc.getItem.and.callFake(() => firstDataClient);

    dialog.open.and.returnValue({
      afterClosed: () => of(dialogResult),
    } as any);

    await TestBed.configureTestingModule({
      declarations: [InterviewComponent],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        MatInputModule,
        MatSelectModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CatalogsService, useValue: catalogsSvc },
        { provide: NotificationsService, useValue: notifSvc },
        { provide: UnsavedChangesService, useValue: unsavedSvc },
        { provide: PersonalInterviewService, useValue: personalInterviewSvc },
        { provide: FirstDataClientService, useValue: firstDataClientSvc },
        { provide: SignStorageService, useValue: signStorageSvc },
        { provide: OnboardingService, useValue: onboardingSvc },
        { provide: CheckpointService, useValue: checkpointSvc },
        { provide: GeneralInfoStorageService, useValue: generalInfoSvc },
        { provide: PermissionRolService, useValue: permissionSvc },
        { provide: MatDialog, useValue: dialog },
        { provide: ActivatedRoute, useValue: { parent: {} } },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  function createComponent(): void {
    generalInfoSignal.set(generalInfoData as any);
    signSectionSignal.set(signSection as any);
    (generalInfoSvc as any).generalInfoItem = generalInfoSignal;
    (signStorageSvc as any).singSectionSignal = signSectionSignal;
    fixture = TestBed.createComponent(InterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create component', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('removes inventory validators for excluded occupations in constructor', () => {
    generalInfoData = { occupation: '01' };

    createComponent();

    component.form.get('productsOffered')?.updateValueAndValidity();
    component.form.get('inventory')?.updateValueAndValidity();

    expect(component.inventaryApply()).toBeTrue();
    expect(component.form.get('productsOffered')?.hasError('required')).toBeFalse();
    expect(component.form.get('inventory')?.hasError('required')).toBeFalse();
  });

  it('sets locality when geographicalArea is EN OTRO ESTADO DE LA REPUBLICA', () => {
    createComponent();
    component.form.get('geographicalArea')!.setValue('EN OTRO ESTADO DE LA REPUBLICA');
    fixture.detectChanges();
    expect(component.locality()).toBeTrue();
  });

  it('clears locality when geographicalArea changes to other value', () => {
    createComponent();
    component.form.get('geographicalArea')!.setValue('CDMX');
    fixture.detectChanges();
    expect(component.locality()).toBeFalse();
  });

  it('requires observations when homeVisit is true', () => {
    createComponent();
    component.form.get('homeVisit')!.setValue(true);
    fixture.detectChanges();
    expect(component.form.get('observationsHomeVisit')!.hasError('required')).toBeTrue();
  });

  it('requires reason when homeVisit is false', () => {
    createComponent();
    component.form.get('homeVisit')!.setValue(false);
    fixture.detectChanges();
    expect(component.form.get('reason')!.hasError('required')).toBeTrue();
  });

  it('clears home-visit conditional validators when value is null', () => {
    createComponent();
    component.form.get('homeVisit')!.setValue(null);

    expect(component.form.get('observationsHomeVisit')!.hasError('required')).toBeFalse();
    expect(component.form.get('reason')!.hasError('required')).toBeFalse();
  });

  it('shows clientNumber when customerKnowledge is 2', () => {
    createComponent();
    component.form.get('customerKnowledge')!.setValue('2');
    fixture.detectChanges();
    expect(component.clientNumber()).toBeTrue();
    expect(component.time()).toBeFalse();
  });

  it('shows time when customerKnowledge is 1', () => {
    createComponent();
    component.form.get('customerKnowledge')!.setValue('1');
    fixture.detectChanges();
    expect(component.time()).toBeTrue();
    expect(component.clientNumber()).toBeFalse();
  });

  it('clears customer knowledge conditional controls for other values', () => {
    createComponent();
    component.form.get('time')!.setValue('3 meses');
    component.form.get('clientNumber')!.setValue('12345');
    component.form.get('customerKnowledge')!.setValue('3');

    expect(component.time()).toBeFalse();
    expect(component.clientNumber()).toBeFalse();
    expect(component.form.get('time')!.value).toBe('');
    expect(component.form.get('clientNumber')!.value).toBe('');
  });

  it('shows relationship combobox when initialInvestment requires it', () => {
    createComponent();
    component.form.get('initialInvestment')!.setValue('CUENTAS BANCARIAS A NOMBRE DE TERCEROS');
    fixture.detectChanges();
    expect(component.relationshipsCombo()).toBeTrue();
  });

  it('handles conditional validators for location, atypical situation and transfers', () => {
    createComponent();

    component.form.get('interviewLocation')!.setValue('OTRO DOMICILIO');
    component.form.get('otherLocation')!.updateValueAndValidity();
    expect(component.otherLocation()).toBeTrue();
    expect(component.form.get('otherLocation')!.hasError('required')).toBeTrue();

    component.form.get('interviewLocation')!.setValue('SUCURSAL');
    expect(component.otherLocation()).toBeFalse();

    component.form.get('atypicalSituation')!.setValue('NINGUNA');
    component.form.get('atypicalSituation')!.setValue('OTRA.');
    expect(component.atypicalSituationOther()).toBeTrue();
    expect(component.form.get('atypicalSituationOther')!.hasError('required')).toBeTrue();

    component.form.get('atypicalSituation')!.setValue('ALGO MAS');
    expect(component.atypicalSituationOther()).toBeFalse();
    expect(component.form.get('atypicalSituationOther')!.value).toBe('');

    component.form.get('initialInvestmentInActinver')!.setValue('TRANSFERENCIAS INTERNACIONALES');
    expect(component.internationalTransfer()).toBeTrue();
    expect(component.form.get('country')!.hasError('required')).toBeTrue();

    component.form.get('initialInvestmentInActinver')!.setValue('RECURSOS PROPIOS');
    expect(component.internationalTransfer()).toBeFalse();
    expect(component.form.get('country')!.value).toBe('');

    component.form.get('initialInvestment')!.setValue('OTRA');
    expect(component.relationshipsCombo()).toBeFalse();
    expect(component.form.get('relationship')!.value).toBe('');
  });

  it('builds addressee options from titular and active cotitular', () => {
    createComponent();

    component.createCustomerList(
      {
        firstName: 'JUAN',
        middleName: 'CARLOS',
        firstLastName: 'PEREZ',
        secondLastName: 'LOPEZ',
      } as any,
      {
        cotitularList: [
          {
            active: true,
            dataSection: {
              firstName: 'ANA',
              middleName: '',
              firstLastName: 'RUIZ',
              secondLastName: 'DIAZ',
            },
          },
          {
            active: false,
            dataSection: {
              firstName: 'IGNORAR',
            },
          },
        ],
      } as any,
    );

    expect(component.toWhomInformationProvidedOptions).toEqual([
      { value: 'JUAN CARLOS PEREZ LOPEZ', label: 'JUAN CARLOS PEREZ LOPEZ' },
      { value: 'ANA RUIZ DIAZ', label: 'ANA RUIZ DIAZ' },
    ]);
  });

  it('returns false and shows labeled error message when form is invalid', () => {
    createComponent();

    const isValid = component.validForm();

    expect(isValid).toBeFalse();
    expect(notifSvc.error).toHaveBeenCalled();
  });

  it('normalizes dialog answer when rejecting atypical behavior', () => {
    createComponent();
    dialog.open.and.returnValue({ afterClosed: () => of({ value: false }) } as any);

    component.rejectNotReliable();

    expect(component.questionsGroup.get('question2')!.value).toBeTrue();
    component.form.get('atypicalSituation')!.updateValueAndValidity();
    expect(component.form.get('atypicalSituation')!.hasError('required')).toBeTrue();

    dialog.open.and.returnValue({ afterClosed: () => of({ value: true }) } as any);
    component.form.get('atypicalSituation')!.setValue('VALOR');

    component.rejectNotReliable();

    expect(component.questionsGroup.get('question2')!.value).toBeFalse();
    expect(component.form.get('atypicalSituation')!.value).toBe('');
  });

  it('navigates to menu when onboarding is terminated', async () => {
    createComponent();
    dialog.open.and.returnValue({ afterClosed: () => of({ value: true }) } as any);

    component.endOnboarding();
    await fixture.whenStable();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(onboardingSvc.restoreInitialTabs).toHaveBeenCalled();
  });

  it('delegates question change actions and respects maintenance loading flag', () => {
    createComponent();
    const rejectIdentificationSpy = spyOn(component, 'rejectIdentificationPhography');
    const rejectNotReliableSpy = spyOn(component, 'rejectNotReliable');

    component.onQuestion1Change({ value: false } as any);
    expect(rejectIdentificationSpy).toHaveBeenCalled();

    (component as any).loadingMaintenance = true;
    component.onQuestion1Change({ value: false } as any);
    expect(rejectIdentificationSpy).toHaveBeenCalledTimes(1);

    component.onQuestion2Change({ value: true } as any);
    expect(rejectNotReliableSpy).toHaveBeenCalled();

    component.form.get('atypicalSituation')!.setValue('VALOR');
    component.onQuestion2Change({ value: false } as any);
    expect(component.form.get('atypicalSituation')!.value).toBe('');
  });

  it('does not save when submit validation fails', async () => {
    createComponent();
    spyOn(component, 'validForm').and.returnValue(false);

    await component.onSubmit();

    expect(checkpointSvc.saveSection).not.toHaveBeenCalled();
    expect(checkpointSvc.saveSectionMant).not.toHaveBeenCalled();
  });

  it('saves normal onboarding interview successfully', async () => {
    createComponent();
    spyOn(component, 'validForm').and.returnValue(true);
    spyOn<any>(component, 'reloadPersonalInterview').and.resolveTo();

    await component.onSubmit();

    expect(checkpointSvc.saveSection).toHaveBeenCalled();
    expect(unsavedSvc.setUnsavedChanges).toHaveBeenCalledWith(false);
    expect(notifSvc.success).toHaveBeenCalledWith('Información de entrevista guardada correctamente');
  });

  it('saves maintenance onboarding interview with maintenance endpoint', async () => {
    createComponent();
    component.isMaintenance = true;
    spyOn(component, 'validForm').and.returnValue(true);
    spyOn<any>(component, 'reloadPersonalInterview').and.resolveTo();

    await component.onSubmit();

    expect(checkpointSvc.saveSectionMant).toHaveBeenCalled();
  });

  it('shows error notification when save response is not created', async () => {
    createComponent();
    checkpointSvc.saveSection.and.returnValue(of({ status: 'ERROR' } as any));
    spyOn(component, 'validForm').and.returnValue(true);

    await component.onSubmit();

    expect(notifSvc.error).toHaveBeenCalledWith(
      'Error al Guardar Contacte al Administrador del Sistema',
    );
  });

  it('applies maintenance permissions and edit workflow', () => {
    createComponent();
    component.permissions = {
      allDisabled: false,
      permission: ['read'],
      fieldsEnabled: [],
    } as any;

    (component as any).applyRolePermissions();

    expect(component.canRead).toBeTrue();
    expect(component.canEdit).toBeFalse();
    expect(component.form.disabled).toBeTrue();
    expect(component.disButtons.cancel).toBeFalse();

    component.permissions = {
      allDisabled: false,
      permission: ['read', 'edit'],
      fieldsEnabled: ['opening'],
    } as any;
    component.canEdit = true;

    component.validateRolOnEdit();
    expect(component.form.enabled).toBeTrue();
    expect(component.form.get('opening')!.enabled).toBeTrue();

    component.editMaintenance();
    expect(component.isReadOnly).toBeFalse();
    expect(component.disButtons.edit).toBeTrue();
  });

  it('restores maintenance snapshot on cancel', () => {
    personalInterviewData = {
      date: '2024-01-01',
      interviewee: 'JUAN',
      opening: 'PRESENCIAL',
      interviewLocation: 'SUCURSAL',
      otherLocation: '0',
      question1: true,
      question2: false,
      question3: true,
      atypicalSituation: '',
      atypicalSituationOther: '',
      residence: 'MEXICANA',
      geographicalArea: 'CDMX',
      homeVisit: false,
      reason: 'NO APLICA',
      locality: '',
      addressType: 1,
      matchingAddress: 'SI',
      observationsHomeVisit: '',
      customerKnowledge: '1',
      time: '1 AÑO',
      clientNumber: '',
      clientInvestmentAmount: 'ALTO',
      country: '',
      moreInformationClient: 'INFO',
      isPFWithBusinessActivity: 'NO',
      lowRisk: { companyName: 'EMPRESA', jobTitle: 'PUESTO', timeWorking: '2 AÑOS' },
      mediumRisk: {
        initialInvestmentInActinver: 'RECURSOS PROPIOS',
        relationship: '',
        justificationInitialInvestment: 'SI',
      },
      highRisk: { productsOffered: 'PROD', inventory: 'NO' },
      initialInvestment: 'OTRA',
    };
    createComponent();

    component.cancelMaintenance();

    expect(component.data).toEqual(personalInterviewData as any);
    expect(component.isReadOnly).toBeTrue();
    expect(component.disButtons.save).toBeTrue();
  });

  it('exposes helpers and computed getters', () => {
    createComponent();
    component.questionsGroup.get('question2')!.setValue(true);
    component.form.get('atypicalSituation')!.setValue('OTRA.');

    expect(component.isNotEmpty({ a: 1 })).toBeTrue();
    expect(component.isNotEmpty({})).toBeFalse();
    expect(component.showAtypical).toBeTrue();
    expect(component.showAtypicalOther).toBeTrue();
    expect(component.compareByString(' ABC ', 'ABC')).toBeTrue();
  });

  it('hydrates PM maintenance data with fallback branches and disables edition', () => {
    currentInfo = {
      personType: 'PM',
      isMaintenance: true,
    };
    permissions = {
      'personal-interview-pm': {
        allDisabled: false,
        permission: ['read', 'edit'],
        fieldsEnabled: ['opening'],
      },
    };
    generalInfoData = null;
    personalInterviewData = {
      date: '2024-01-01',
      interviewee: 'ANA',
      opening: '',
      interviewLocation: 'SUCURSAL',
      otherLocation: 'CALLE 1',
      question1: true,
      question2: false,
      question3: true,
      atypicalSituation: '',
      atypicalSituationOther: '',
      residence: 'MX',
      geographicalArea: 'CDMX',
      matchingAddress: true,
      homeVisit: false,
      reason: '',
      locality: '',
      addressType: null,
      observationsHomeVisit: '',
      customerKnowledge: '2',
      time: '',
      clientNumber: 123,
      clientInvestmentAmount: 'ALTO',
      initialInvestment: 'CUENTAS BANCARIAS A NOMBRE DE TERCEROS',
      country: '',
      moreInformationClient: 'INFO',
      isPFWithBusinessActivity: true,
      lowRisk: null,
      mediumRisk: null,
      highRisk: null,
    };

    createComponent();

    expect(component.permissions).toEqual(permissions['personal-interview-pm']);
    expect(component.form.get('opening')!.value).toBe('PRESENCIAL');
    expect(component.form.get('otherLocation')!.value).toBe('CALLE 1');
    expect(component.form.get('addressType')!.value).toBe('');
    expect(component.clientNumber()).toBeTrue();
    expect(component.relationshipsCombo()).toBeTrue();
    expect(component.isReadOnly).toBeTrue();
  });

  it('covers nullish compare values and hydrate early return', () => {
    createComponent();
    component.form.get('interviewee')!.setValue('ORIGINAL');

    expect(() => (component as any).hydrateFormFromData(null)).not.toThrow();
    expect(component.form.get('interviewee')!.value).toBe('ORIGINAL');
    expect(component.compareByString(null as any, undefined as any)).toBeTrue();
  });

  it('returns early from edit maintenance when all fields are disabled and user cannot edit', () => {
    createComponent();
    component.permissions = {
      allDisabled: true,
      permission: ['read'],
      fieldsEnabled: [],
    } as any;
    component.canEdit = false;
    component.isReadOnly = true;

    component.editMaintenance();

    expect(component.isReadOnly).toBeTrue();
    expect(component.disButtons.edit).toBeFalse();
  });

  it('disables the form when validateRolOnEdit runs without edit permission', () => {
    createComponent();
    component.canEdit = false;
    component.form.enable();

    component.validateRolOnEdit();

    expect(component.disButtons.register).toBeTrue();
    expect(component.canEdit).toBeFalse();
  });

  it('applies fallback role permissions when there is no readable permission', () => {
    createComponent();
    component.permissions = undefined as any;

    (component as any).applyRolePermissions();

    expect(component.canRead).toBeFalse();
    expect(component.form.disabled).toBeTrue();
    expect(component.disButtons.edit).toBeTrue();
  });
});
