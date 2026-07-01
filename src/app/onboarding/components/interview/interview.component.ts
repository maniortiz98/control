import { Component, inject, signal, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { EconomicActivity } from '../../models/economic-activity';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { Relationships } from '../../models/relationships';
import { Countries } from '../../models/country';
import { MatRadioChange } from '@angular/material/radio';
import { PersonalInterviewData } from '../../models/checkpoints/personal-interview';
import {
  APERTURA,
  COHERENCIA_ACTIVIDAD,
  DOMICILIOS,
  ADDRESS_TYPE,
  MEDIO_PAGO,
  PersonalInterviewForm,
  RESIDENCIA,
  GEOGRAPHICAL_AREA,
  ATYPICAL_SITUATION,
  CUSTOMER_KNOWLEDGE,
  TIPO_CUENTA,
} from '../../models/personal-interview-data';
import { PersonalInterviewService } from '../../../shared/services/storage-services/personal-interview.service';
import { mapFormToPersonalInterview } from '../../../shared/services/mapper-services/maper';
import { FirstDataClientService } from '../../../shared/services/storage-services/first-data-client.service';
import { SignStorageService } from '../../../shared/services/storage-services/sign-storage.service';
import { Data } from '../../models/checkpoints/initial-data-checkpoint';
import {
  AllowedValuesRfcNifTinNss,
  compareAndReturnRfcNifTinNss,
} from '../../../shared/utils/map-rfc-nif-tin-nss';
import { validCombobox, markInvalidControls } from '../../../shared/utils/form';
import { SingSection } from '../../models/sign-section';
import { CotitularInfo } from '../../models/cotitular';
import { OnboardingService } from '../../services/onboarding.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { GeneralInfoStorageService } from '../../../shared/services/storage-services/general-info-storage.service';
import { distinctUntilChanged, first, firstValueFrom, skip } from 'rxjs';
import { ModalNotificationComponent } from '../../../shared/components/modals/modal-notification/modal-notification.component';
import { Router } from '@angular/router';
import { PermissionRolService } from '../../../core/services/rol.service';
import {
  butonFunctionDis,
  buttonFunctionEn,
  formFunctionDis,
  formFunctionEnAll,
} from '../../../shared/utils/disableOrEnabled';
import { CurrentOnboardingInfo } from '../../models/current-onboarding';
import { convertDateBack } from '../../../shared/utils/datetime';
import { PropertyType } from '../../models/property-type';
import { InterviewDataId } from '../../models/checkpoints/response/maintenance/interview';
import { concatFullName } from '../../../shared/utils/string';
import { normalizeBoolean } from '../../../shared/utils/maper-helpers.autocertification';
import { mapResToPersonalInterview } from '../../services/mappers/response/personal-interview-mapper';

@Component({
  selector: 'app-interview',
  standalone: false,
  templateUrl: './interview.component.html',
  styleUrl: './interview.component.scss',
})
export class InterviewComponent {
  //Inject
  private readonly catalogService = inject(CatalogsService);
  private readonly fb = inject(FormBuilder);
  readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationsService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly personalInterviewService = inject(PersonalInterviewService);
  private readonly dataClientService = inject(FirstDataClientService);
  private readonly signService = inject(SignStorageService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly storageService = inject(GeneralInfoStorageService);
  private readonly router = inject(Router);
  private readonly permissionService = inject(PermissionRolService);
  private readonly generalInfoStorage = inject(GeneralInfoStorageService);
  // variables
  form: FormGroup = this.fb.nonNullable.group({
    interviewee: ['', Validators.required],
    opening: [{ value: 'PRESENCIAL', disabled: true }, Validators.required],
    date: ['', Validators.required],
    interviewLocation: ['', Validators.required],
    otherLocation: [''],
    questions: this.fb.nonNullable.group({
      question1: [null, Validators.required],
      question2: [null, Validators.required],
      question3: [null, Validators.required],
    }),
    atypicalSituation: [''],
    atypicalSituationOther: [''],
    residence: [{ value: '', disabled: false }, Validators.required],
    geographicalArea: ['', Validators.required],
    homeVisit: [''],
    reason: [''],
    locality: [''],
    addressType: ['', Validators.required],
    matchingAddress: ['', Validators.required],
    observationsHomeVisit: [''],
    customerKnowledge: ['', Validators.required],
    time: [''],
    clientNumber: [''],
    clientInvestmentAmount: ['', Validators.required],
    country: [''],
    moreInformationClient: ['', Validators.required],
    isPFWithBusinessActivity: ['', Validators.required],
    companyName: ['', Validators.required],
    jobTitle: ['', Validators.required],
    timeWorking: ['', Validators.required],
    initialInvestment: ['', Validators.required],
    initialInvestmentInActinver: ['', Validators.required],
    relationship: [''],
    justificationInitialInvestment: ['', Validators.required],
    productsOffered: ['', Validators.required],
    inventory: ['', Validators.required],
  });

  //Signals
  errors = signal<string[]>([]);
  opening = signal<any[]>(APERTURA);
  interviewLocation = signal<any[]>(DOMICILIOS);
  addressType = signal<PropertyType[]>([]);
  geographicalArea = signal<any[]>(GEOGRAPHICAL_AREA);
  residence = signal<any[]>(RESIDENCIA);
  customerKnowledge = signal<any[]>(CUSTOMER_KNOWLEDGE);
  clientInvestmentAmount = signal<any[]>(COHERENCIA_ACTIVIDAD);
  initialInvestment = signal<any[]>(TIPO_CUENTA);
  initialInvestmentInActinver = signal<any[]>(MEDIO_PAGO);
  atypicalSituation = signal<any[]>(ATYPICAL_SITUATION);
  atypicalSituationOther = signal(false);
  otherLocation = signal(false);
  locality = signal(false);
  homeVisit = signal(false);
  time = signal(false);
  clientNumber = signal(false);
  inventaryApply = signal(false);
  internationalTransfer = signal(false);
  relationshipsCombo = signal(false);
  countries = signal<Array<Countries>>([]);
  addresseeList = signal<
    Array<{
      id: string;
      firstName: string;
      middleName: string;
      firstLastName: string;
      secondLastName: string;
      birthDate: string;
      curp: string;
      foreignerWithoutCurp: boolean;
      rfc: string;
      nif: string;
      ssn: string;
      gender: string;
      countryOfBirth: string;
    }>
  >([]);

  public toWhomInformationProvidedOptions: { value: string; label: string }[] = [];

  // variables
  ids: InterviewDataId = {
    id: 0,
    LowRisk: {
      id: 0,
    },
    MediumRisk: {
      id: 0,
    },
    HighRisk: {
      id: 0,
    },
  };
  private loadingMaintenance = false;
  data: PersonalInterviewData | null = null;
  text: string = '';
  economicActivity = signal<EconomicActivity[]>([]);
  relationships = signal<Array<Relationships>>([]);
  typePerson = this.onboardingService.getCurrentInfo().personType;
  showLowRiskSection: boolean = true;

  /** Data for Maintenance */
  onboardingInfo: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
  isMaintenance: boolean = this.onboardingService.getCurrentInfo().isMaintenance;
  permissions = this.permissionService.getPermissions()?.['interview'];
  disButtons = { edit: false, register: false, save: false, cancel: false };
  canRead = false;
  canEdit = false;
  canAdd = false;
  canDelete = false;
  isReadOnly = false;
  /** */

  //Constructor
  constructor() {
    if ('PF' === this.onboardingService.getCurrentInfo().personType) {
      this.permissions = this.permissionService.getPermissions()?.['interview'];
    } else if ('PM' === this.onboardingService.getCurrentInfo().personType) {
      this.permissions = this.permissionService.getPermissions()?.['personal-interview-pm'];
    }
    document.body.classList.remove('show-validation');
    /* Valida si es Estudiante, Ama de Casa o Jubilado  */
    const storage = this.storageService.generalInfoItem()?.occupation ?? '';
    const allowedContracts = ['05', '01', '08'];

    if (allowedContracts.includes(storage)) {
      const productsOffered = this.form.get('productsOffered');
      const inventory = this.form.get('inventory');
      const clearCommonValidators = (...fields: (AbstractControl<any, any> | null)[]) => {
        fields.forEach((field) => field?.clearValidators());
      };
      clearCommonValidators(productsOffered, inventory);
      this.inventaryApply.set(true);
    }
  }

  isNotEmpty(obj: any) {
    return Object.keys(obj).length > 0;
  }

  ngOnInit() {
    if (!this.isMaintenance) {
      this.permissions = ['edit', 'add', 'delete', 'read'];
      this.disButtons = {
        edit: false,
        register: false,
        save: false,
        cancel: false,
      };

      this.form.enable({ emitEvent: false });
      this.applyOpeningPermission();
    }

    this.createCustomerList(this.dataClientService.getItem(), this.signService.singSectionSignal());

    if (this.onboardingService.getCurrentInfo().isMaintenance) {
      this.applyRolePermissions();
    }

    this.data = this.personalInterviewService.getItem();
    if (this.data) {
      this.hydrateFormFromData(this.data);
    }

    const questionsGroup = this.form.get('questions') as FormGroup;
    const atypicalCtrl = this.form.get('atypicalSituation');

    if (!questionsGroup || !atypicalCtrl) {
      return;
    }

    this.catalogService.getEconomicActivity({ lineBusinessId: [] }).subscribe((m) => {
      this.economicActivity.set(m);
    });

    const bbRel = {
      bool: '',
      clientId: '',
      language: '',
    };

    this.catalogService.getRelationships(bbRel).subscribe((c) => {
      this.relationships.set(c);
    });

    this.catalogService.getCountry({ land: [] }).subscribe((c) => {
      this.countries.set(c);
    });

    this.catalogService.getClientKnowledge({ clientKnowledgeCve: [] }).subscribe((c) => {
      this.customerKnowledge.set(c);
    });

    this.catalogService.getPropertyType({ propertyTypeIds: [] }).subscribe((c) => {
      this.addressType.set(c);
    });

    const atypicalOtherCtrl = this.form.get('atypicalSituationOther');

    this.form
      .get('atypicalSituation')
      ?.valueChanges.pipe(skip(1), distinctUntilChanged())
      .subscribe((value: string) => {
        if (value === 'OTRA.') {
          this.atypicalSituationOther.set(true);
          atypicalOtherCtrl?.addValidators(Validators.required);
        } else {
          this.atypicalSituationOther.set(false);
          atypicalOtherCtrl?.clearValidators();
          atypicalOtherCtrl?.setValue('');
        }

        atypicalOtherCtrl?.updateValueAndValidity({ emitEvent: false });
      });

    this.form.get('interviewLocation')?.valueChanges.subscribe((value: any) => {
      if (value === 'OTRO DOMICILIO') {
        this.otherLocation.set(true);
        this.form.get('otherLocation')?.updateValueAndValidity();
        this.form.get('otherLocation')?.addValidators(Validators.required);
      } else {
        this.otherLocation.set(false);
        this.form.get('otherLocation')?.clearValidators();
        this.form.get('otherLocation')?.updateValueAndValidity();
      }
    });

    this.form.get('geographicalArea')?.valueChanges.subscribe((value) => {
      this.applyGeographicalAreaRules(value);
    });

    this.form.get('customerKnowledge')?.valueChanges.subscribe((value) => {
      const timeCtrl = this.form.get('time');
      const clientCtrl = this.form.get('clientNumber');

      switch (value) {
        case '1':
          this.time.set(true);
          this.clientNumber.set(false);

          timeCtrl?.addValidators(Validators.required);
          clientCtrl?.clearValidators();
          clientCtrl?.setValue('');
          break;

        case '2':
          this.clientNumber.set(true);
          this.time.set(false);

          clientCtrl?.addValidators(Validators.required);
          timeCtrl?.clearValidators();
          timeCtrl?.setValue('');
          break;

        default:
          this.time.set(false);
          this.clientNumber.set(false);

          timeCtrl?.clearValidators();
          clientCtrl?.clearValidators();
          timeCtrl?.setValue('');
          clientCtrl?.setValue('');
      }

      timeCtrl?.updateValueAndValidity({ emitEvent: false });
      clientCtrl?.updateValueAndValidity({ emitEvent: false });
    });

    this.form.get('initialInvestmentInActinver')?.valueChanges.subscribe((value) => {
      if (value === 'TRANSFERENCIAS INTERNACIONALES') {
        this.internationalTransfer.set(true);
        this.form.get('country')?.addValidators(Validators.required);
      } else {
        this.internationalTransfer.set(false);
        this.form.get('country')?.clearValidators();
        this.form.get('country')?.setValue('');
      }

      this.form.get('country')?.updateValueAndValidity({ emitEvent: false });
    });

    this.form.get('initialInvestment')?.valueChanges.subscribe((value) => {
      if (value === 'CUENTAS BANCARIAS A NOMBRE DE TERCEROS') {
        this.relationshipsCombo.set(true);
        this.form.get('relationship')?.addValidators(Validators.required);
      } else {
        this.relationshipsCombo.set(false);
        this.form.get('relationship')?.clearValidators();
        this.form.get('relationship')?.setValue('');
      }

      this.form.get('relationship')?.updateValueAndValidity({ emitEvent: false });
    });

    const generalInfoSavedData = this.generalInfoStorage.generalInfoItem();

    if (generalInfoSavedData) {
      if (!this.data?.lowRisk) {
        this.form.patchValue({
          companyName: generalInfoSavedData.companyName,
          jobTitle: generalInfoSavedData.jobTitle,
        });
      }
      const excludeOcupations: string[] = ['01', '05', '08'];
      if (excludeOcupations.includes(generalInfoSavedData.occupation)) {
        this.showLowRiskSection = false;

        this.inventaryApply.set(true);

        this.form.get('companyName')?.clearValidators();
        this.form.get('jobTitle')?.clearValidators();
        this.form.get('timeWorking')?.clearValidators();

        this.form.get('companyName')?.updateValueAndValidity();
        this.form.get('jobTitle')?.updateValueAndValidity();
        this.form.get('timeWorking')?.updateValueAndValidity();
      } else {
        this.showLowRiskSection = true;

        this.inventaryApply.set(false);

        this.form.get('companyName')?.addValidators(Validators.required);
        this.form.get('jobTitle')?.addValidators(Validators.required);
        this.form.get('timeWorking')?.addValidators(Validators.required);

        this.form.get('companyName')?.updateValueAndValidity();
        this.form.get('jobTitle')?.updateValueAndValidity();
        this.form.get('timeWorking')?.updateValueAndValidity();
      }
    }

    this.form.get('homeVisit')?.valueChanges.subscribe((value: boolean) => {
      const obsCtrl = this.form.get('observationsHomeVisit');
      const reasonCtrl = this.form.get('reason');

      this.homeVisit.set(value);
      if (value === true) {
        obsCtrl?.addValidators(Validators.required);

        reasonCtrl?.clearValidators();
        reasonCtrl?.setValue('');
      } else if (value === false) {
        reasonCtrl?.addValidators(Validators.required);

        obsCtrl?.clearValidators();
        obsCtrl?.setValue('');
      } else {
        obsCtrl?.clearValidators();
        reasonCtrl?.clearValidators();

        obsCtrl?.setValue('');
        reasonCtrl?.setValue('');
      }

      obsCtrl?.updateValueAndValidity({ emitEvent: false });
      reasonCtrl?.updateValueAndValidity({ emitEvent: false });
    });
  }

  private hydrateFormFromData(data: PersonalInterviewData | null): void {
    if (!data) return;
    // Temporarily mapping address to match with the catalog
    const addressTypeValue =
      data.addressType != null ? data.addressType.toString().padStart(2, '0') : '';
    this.form.patchValue(
      {
        date: convertDateBack(data.date),
        interviewee: data.interviewee,
        opening: data.opening || 'PRESENCIAL',
        interviewLocation: data.interviewLocation,
        otherLocation: data.otherLocation === '0' ? '' : data.otherLocation,
        questions: {
          question1: normalizeBoolean(data.question1, true),
          question2: normalizeBoolean(data.question2, false),
          question3: normalizeBoolean(data.question3, true),
        },
        atypicalSituation: this.mapAtypicalSituationByDescription(data.atypicalSituation),
        atypicalSituationOther: data.atypicalSituationOther || '',
        residence: data.residence,
        geographicalArea: data.geographicalArea,
        homeVisit: data.homeVisit,
        reason: data.reason,
        locality: data.locality,
        addressType: addressTypeValue,
        matchingAddress: data.matchingAddress,
        observationsHomeVisit: data.observationsHomeVisit,
        customerKnowledge: data.customerKnowledge,
        time: data.time,
        clientNumber: data.clientNumber,
        clientInvestmentAmount: data.clientInvestmentAmount,
        country: data.country,
        moreInformationClient: data.moreInformationClient,
        isPFWithBusinessActivity: data.isPFWithBusinessActivity,
        companyName: data.lowRisk?.companyName ?? '',
        jobTitle: data.lowRisk?.jobTitle ?? '',
        timeWorking: data.lowRisk?.timeWorking ?? '',
        initialInvestment: data.initialInvestment,
        initialInvestmentInActinver: data.mediumRisk?.initialInvestmentInActinver ?? '',
        relationship: data.mediumRisk?.relationship ?? '',
        justificationInitialInvestment: data.mediumRisk?.justificationInitialInvestment ?? '',
        productsOffered: data.highRisk?.productsOffered ?? '',
        inventory: data.highRisk?.inventory ?? '',
      },
      { emitEvent: false },
    );

    this.homeVisit.set(data.homeVisit);
    this.applyGeographicalAreaRules(data.geographicalArea);

    if (data.customerKnowledge === '1') {
      this.time.set(true);
      this.clientNumber.set(false);
    } else if (data.customerKnowledge === '2') {
      this.clientNumber.set(true);
      this.time.set(false);
    }

    if (data.initialInvestment === 'CUENTAS BANCARIAS A NOMBRE DE TERCEROS') {
      this.relationshipsCombo.set(true);
    } else {
      this.relationshipsCombo.set(false);
    }

    if (this.onboardingInfo.isMaintenance) {
      this.initializeMaintenance();
    }
  }

  ngAfterViewInit() {
    this.form.valueChanges.subscribe(() => {
      this.unsavedChangesService.setUnsavedChanges(this.form.dirty);
    });
    if (this.data && this.isNotEmpty(this.data)) {
    }
  }

  private applyGeographicalAreaRules(value: string | null): void {
    const homeVisitCtrl = this.form.get('homeVisit');
    const localityCtrl = this.form.get('locality');

    if (value === 'EN OTRO ESTADO DE LA REPUBLICA') {
      this.locality.set(true);
      homeVisitCtrl?.addValidators(Validators.required);
      localityCtrl?.addValidators(Validators.required);
    } else {
      this.locality.set(false);
      homeVisitCtrl?.clearValidators();
      localityCtrl?.clearValidators();
      homeVisitCtrl?.setValue(null);
    }

    homeVisitCtrl?.updateValueAndValidity({ emitEvent: false });
    localityCtrl?.updateValueAndValidity({ emitEvent: false });
  }

  /**
   * Initializes the "titular" and "cotitular" list.
   */
  createCustomerList(titular: Data | null, cotitular: SingSection | null): void {
    this.toWhomInformationProvidedOptions = [];

    if (titular) {
      const name = concatFullName(
        titular.firstName,
        titular.middleName,
        titular.firstLastName,
        titular.secondLastName,
      );

      this.toWhomInformationProvidedOptions.push({
        value: name,
        label: name,
      });
    }

    if (cotitular?.cotitularList) {
      const dataco = cotitular.cotitularList
        .filter((item) => item.active)
        .map((item) => {
          const name = concatFullName(
            item.dataSection?.firstName,
            item.dataSection?.middleName,
            item.dataSection?.firstLastName,
            item.dataSection?.secondLastName,
          );

          return {
            value: name,
            label: name,
          };
        });

      this.toWhomInformationProvidedOptions = [...this.toWhomInformationProvidedOptions, ...dataco];
    }
  }

  validForm(): boolean {
    let isValid = true;

    this.questionsGroup.markAllAsTouched();

    const labels: { [key: string]: string } = {
      interviewee: 'Persona Entrevistada',
      opening: 'Vacante',
      date: 'Fecha',
      question1:
        'El cliente mostró su identificación durante la entrevista y la fotografía coincide con la persona',
      question2:
        'El cliente mostró contradicciones, comportamientos atípicos o conductas sospechosas durante la entrevista',
      atypicalSituation: '¿Cuál es la situación atípica identificada?',
      atypicalSituationOther: 'Indicar otra',
      question3: 'Fueron verificados los teléfonos del cliente',
      interviewLocation: 'Entrevista se llevo a cabo en',
      otherLocation: 'Indicar domicilio',
      residence: 'Residencia',
      geographicalArea: 'La ubicación geográfica del cliente o geolocalización se encuentra en',
      homeVisit: '¿Se realizó visita domiciliaria?',
      observationsHomeVisit: 'Observaciones de la visita domiciliaria',
      reason: 'Indicar motivo',
      locality: 'Localidad',
      addressType: 'El domicilio registrado por el cliente es',
      matchingAddress: 'El domicilio del cliente es congruente con el Perfil declarado',
      customerKnowledge: 'Conocimiento del Cliente',
      clientNumber: 'Indicar no. cliente',
      time: 'Indicar tiempo',
      clientInvestmentAmount: 'El monto de inversión inicial declarado por cliente es',
      initialInvestment: 'Su inversión inicial en Actinver será a través de',
      moreInformationClient:
        'Favor de proporcionar más información sobre la actividad preponderante del cliente',
      isPFWithBusinessActivity: '¿El cliente es persona física con actividad empresarial?',
      companyName: 'Empresa donde labora',
      jobTitle: 'Puesto desempeñado',
      timeWorking: '¿Hace cuando inicio operaciones la empresa? ',
      initialInvestmentInActinver: 'Su inversión inicial en Actinver proviene de',
      country: 'Indicar país',
      justificationInitialInvestment:
        '¿El prospecto manifestó contar con la información con la que sepuede justificar su inversión inicial?',
      relationship: '¿Que relación tiene?',
      productsOffered: '¿Cuáles son los principales productos y/o servicios que ofrecen?',
      inventory: '¿Cuenta con inventario?',
    };

    const invalidFields = markInvalidControls(this.form);

    if (Object.keys(invalidFields).length > 0) {
      isValid = false;
      validCombobox(
        [
          'interviewee',
          'opening',
          'interviewLocation',
          'geographicalArea',
          'locality',
          'addressType',
          'relationship',
          'atypicalSituation',
        ],
        this.form,
      );

      const message = Object.entries(invalidFields)
        .flatMap(([key, value]) => {
          if (key === 'questions' && typeof value === 'object') {
            return Object.keys(value).map((childKey) => labels[childKey] || childKey);
          }
          return labels[key] || key;
        })
        .join(', ');

      this.notificationService.error(`Faltan campos obligatorios por capturar: ${message}`);
    }

    return isValid;
  }

  rejectIdentificationPhography() {
    const dialogRef = this.dialog.open(ModalNotificationComponent, {
      width: '530px',
      disableClose: true,
      data: {
        title:
          '¿El cliente mostró su identificación durante la entrevista y la fotografía coincide con la persona entrevistada?',
        btnAccept: 'No',
        btnDeny: 'Si',
      },
      panelClass: 'custom-dialog',
    });
    dialogRef
      .afterClosed()
      .pipe(first((res) => res))
      .subscribe(async ({ value }) => {
        if (value) {
          this.unsavedChangesService.setUnsavedChanges(false);
          this.endOnboarding();
        } else {
          this.questionsGroup.get('question1')?.setValue(true, { emitEvent: false });
        }
      });
  }

  /* TODO: agregar las situaciones atipicas dentro del modal esperar MS */

  rejectNotReliable() {
    const ref = this.dialog.open(ModalNotificationComponent, {
      width: '530px',
      disableClose: true,
      data: {
        title:
          '¿Es correcto que el cliente mostró situaciones atípicas, contradicciones o conductas sospechosas?',
        btnAccept: 'No',
        btnDeny: 'Si',
      },
    });

    ref
      .afterClosed()
      .pipe(first())
      .subscribe(({ value }) => {
        const normalized = !value;

        this.setQuestion2(normalized);

        if (normalized) {
          this.applyAtypical();
        } else {
          this.clearAtypical();
        }
      });
  }

  onQuestion1Change(event: MatRadioChange) {
    if (this.loadingMaintenance) return;

    if (event.value === false) {
      this.rejectIdentificationPhography();
    }
  }

  onQuestion2Change(event: MatRadioChange) {
    if (event.value === true) {
      this.rejectNotReliable();
    } else {
      this.clearAtypical();
    }
  }

  private setQuestion2(value: boolean) {
    this.questionsGroup.get('question2')?.setValue(value, { emitEvent: false });
  }

  private applyAtypical() {
    const ctrl = this.form.get('atypicalSituation');
    ctrl?.addValidators(Validators.required);
    ctrl?.updateValueAndValidity({ emitEvent: false });
  }

  private clearAtypical() {
    const ctrl = this.form.get('atypicalSituation');
    ctrl?.clearValidators();
    ctrl?.setValue('');
    ctrl?.updateValueAndValidity({ emitEvent: false });
  }

  /* TODO: Esperar MS */

  endOnboarding() {
    const dialogRef = this.dialog.open(ModalNotificationComponent, {
      width: '530px',
      disableClose: true,
      data: {
        title: 'Se terminará el Onboarding y saldrás al Menú Principal',
        btnAccept: 'Aceptar',
      },
      panelClass: 'custom-dialog',
    });
    dialogRef
      .afterClosed()
      .pipe(first((res) => res))
      .subscribe(async ({ value }) => {
        this.router.navigate(['/']);
        this.onboardingService.restoreInitialTabs();
      });
  }

  async onSubmit() {
    const isValid = this.validForm();
    if (!isValid) {
      return;
    }

    const raw = this.form.getRawValue();

    const payload: PersonalInterviewForm = {
      ...(raw as any),
      question1: raw.questions.question1,
      question2: raw.questions.question2,
      question3: raw.questions.question3,
    };

    const interviewData = mapFormToPersonalInterview(payload, this.isMaintenance, this.ids);

    const save$ = this.isMaintenance
      ? this.checkpointService.saveSectionMant('personal-interview', interviewData)
      : this.checkpointService.saveSection('personal-interview', interviewData);

    const result = await firstValueFrom(save$);

    if (result?.status === 'CREATED') {
      await this.reloadPersonalInterview();

      this.unsavedChangesService.setUnsavedChanges(false);
      this.notificationService.success('Información de entrevista guardada correctamente');
    } else {
      this.notificationService.error('Error al Guardar Contacte al Administrador del Sistema');
    }
  }

  private async reloadPersonalInterview(): Promise<void> {
    const currentOnboarding = this.onboardingService.getCurrentInfo();

    const obs$ = currentOnboarding.isMaintenance
      ? this.checkpointService.getMaintenanceSectionByPersonaFisica(['personal-interview'])
      : this.checkpointService.getSection(['personal-interview']);

    const response = await firstValueFrom(obs$);

    const mappedData = mapResToPersonalInterview(response['checkpoints'][0]['data']);

    this.personalInterviewService.setItem(mappedData);
    this.data = mappedData;
    this.hydrateFormFromData(mappedData);
  }

  get questionsGroup(): FormGroup {
    return this.form.get('questions') as FormGroup;
  }

  get showAtypical(): boolean {
    return this.questionsGroup.get('question2')?.value === true;
  }

  get showAtypicalOther(): boolean {
    return this.form.get('atypicalSituation')?.value === 'OTRA.';
  }

  private mapAtypicalSituationByDescription(backendValue: string | null | undefined): string {
    if (!backendValue) {
      return '';
    }

    const found = this.atypicalSituation().find((item) => item.descripcion === backendValue);

    return found ? found.descripcion : '';
  }

  compareByString = (a: string, b: string): boolean => {
    return (a ?? '').trim() === (b ?? '').trim();
  };

  /** -------- MAINTENANCE -------- */
  initializeMaintenance(): any {
    this.form.disable();
    this.isReadOnly = true;
    this.disButtons = { save: true, register: true, edit: false, cancel: true };
  }

  validateRolOnEdit(): any {
    if (this.canEdit) {
      this.form.enable();
      this.applyOpeningPermission();
    } else {
      this.form.disable();
    }

    this.disButtons.register = !this.canEdit;
  }

  editMaintenance(): any {
    if (this.permissions.allDisabled && !this.canEdit) return;
    this.isReadOnly = false;
    this.form.enable();
    this.applyOpeningPermission();
    this.disButtons = {
      register: false,
      cancel: false,
      save: false,
      edit: true,
    };

    this.validateRolOnEdit();
  }

  cancelMaintenance(): any {
    const personalInterview = this.personalInterviewService.getItem();
    this.data = personalInterview;
    this.hydrateFormFromData(personalInterview);
    this.initializeMaintenance();
  }

  private applyRolePermissions(): void {
    const rolePerms = this.permissions?.permission || [];

    this.canRead = rolePerms.includes('read');
    this.canEdit = rolePerms.includes('edit');
    this.canAdd = rolePerms.includes('add');
    this.canDelete = rolePerms.includes('delete');

    if (!this.canRead) {
      this.form.disable({ emitEvent: false });
      this.disButtons = {
        edit: true,
        register: true,
        save: true,
        cancel: true,
      };
      return;
    }

    if (this.canRead && !this.canEdit) {
      this.form.disable({ emitEvent: false });
      this.disButtons = {
        edit: true,
        register: true,
        save: true,
        cancel: false,
      };
    }
  }

  private applyOpeningPermission(): void {
    const openingCtrl = this.form.get('opening');

    if (this.permissions?.fieldsEnabled?.includes('opening')) {
      openingCtrl?.enable({ emitEvent: false });
    } else {
      openingCtrl?.disable({ emitEvent: false });
    }
  }
  /** -------- END MAINTENANCE -------- */
}
