import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { REGEX } from '../../constants/constants';
import { first, merge, map, lastValueFrom } from 'rxjs';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { AllowedValuesRfcNifTinNss, compareAndReturnIdRfcNifTinNss, compareAndReturnRfcNifTinNss, compareAndReturnValueRfcNifTinNss } from '../../../shared/utils/map-rfc-nif-tin-nss';
import { PldQuizService } from '../../../shared/services/pld-quiz.service';
import { Countries } from '../../models/country';
import { EconomicActivity } from '../../models/economic-activity';
import { ERROR_MESSAGES } from '../../constants/form-messages';
import { checkpointToPldQuiz, pldQuizToCheckpoint } from '../../services/mappers/pld-quiz-mapper';
import { OnboardingService } from '../../services/onboarding.service';
import { PermissionRolService } from '../../../core/services/rol.service';
import { environment } from '../../../../environments/environment';
import { HomonymsRequest, HomonymsResponse } from '../../models/homonyms';
import { HomonymsService } from '../../../shared/services/homonyms.service';
import { CustomerWatchListBody, WatchList } from '../../models/customer-watch-list';
import { ModalHomonymsServiceService } from '../../../shared/services/modal-homonyms-service.service';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { ModalFormService } from '../../../shared/services/modal-form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { WatchlistService } from '../../../shared/services/watchlist.service';
import { searchPercentSimilarity } from '../../../shared/utils/homonyms-search';
import { FirstDataClientService } from '../../../shared/services/storage-services/first-data-client.service';
import { SignStorageService } from '../../../shared/services/storage-services/sign-storage.service';
import { Data } from '../../models/checkpoints/initial-data-checkpoint';
import { SingSection } from '../../models/sign-section';
import { CotitularInfo } from '../../models/cotitular';
import { concatFullName } from '../../../shared/utils/string';

@Component({
  selector: 'app-pld-quiz',
  standalone: false,
  templateUrl: './pld-quiz.component.html',
  styleUrl: './pld-quiz.component.scss'
})
export class PldQuizComponent {
  private readonly onboardingService = inject(OnboardingService);
  private readonly permissionRolService = inject(PermissionRolService);
  public readonly isMaintenance = computed(() => this.onboardingService.getCurrentInfo().isMaintenance);
  public readonly isEditable = computed(() => !this.permissionRolService.getPermissions()['pld-quiz'].allDisabled);

  private readonly notificationService         = inject(NotificationsService);
  private readonly notificationModalService    = inject(NotificationModalService);
  private readonly unsavedChangesService       = inject(UnsavedChangesService);
  private readonly checkpoint                  = inject(CheckpointService);
  private readonly dataHomonymService          = inject(HomonymsService);
  private readonly modalHomonymsServiceService = inject(ModalHomonymsServiceService);
  private readonly modalService                = inject(ModalFormService);
  private readonly modalFormService            = inject(ModalFormService);
  private readonly router                      = inject(Router);
  private readonly route                       = inject(ActivatedRoute);
  private readonly dataWatchlistService        = inject(WatchlistService);
  private readonly dataClientService           = inject(FirstDataClientService);
  private readonly signService                 = inject(SignStorageService);

  protected validators = Validators;

  private readonly fb: FormBuilder = new FormBuilder;

  public readonly pldQuizService = inject(PldQuizService);
  public readonly catalogsService = inject(CatalogsService);
  public readonly form: FormGroup;
  public editMode = signal<boolean>(false);

  // #region catalogs
  public readonly professionActivityOptions: {value: boolean; label: string}[] = [
    {
      value: false,
      label: "Sin Actividad Económica",
    },
    {
      value: true,
      label: "Con Actividad Económica ",
    },
  ];

  public readonly roleOptions: {value: string; label: string}[] = [
    {
      value: 'managerOfficerEmployee',
      label: "Directivo, Funcionario o Empleado",
    },
    {
      value: 'independentProfessional',
      label: "Profesionista Independiente",
    },
    {
      value: 'individualBusinessActivity',
      label: "Persona Física con Actividad Empresarial",
    },
  ];

  public toWhomInformationProvidedOptions: {value: string; label: string}[] = [];

  public personTypeOptions: {value: string; label: string}[] = [
    {
      value: "1",
      label: "Física",
    },
    {
      value: "2",
      label: "Moral",
    },
  ];

  countries = signal<Array<Countries>>([]);
  economicActivities = signal<Array<EconomicActivity>>([]);

  filteredEconomicActivities = signal<EconomicActivity[]>([]);
  economicActivityFilter = new FormControl('');

  filteredEconomicActivities2 = signal<EconomicActivity[]>([]);
  economicActivityFilter2 = new FormControl('');

  filteredEconomicActivities3 = signal<EconomicActivity[]>([]);
  economicActivityFilter3 = new FormControl('');

  // #endregion catalogs


  listData: WatchList | undefined;
  listHomonyms: HomonymsResponse[] | undefined;

  initialData: Data | null = null;

  constructor() {
    this.economicActivityFilter.valueChanges.subscribe(value => {
      const filterValue = value?.toLowerCase() || '';

      this.filteredEconomicActivities.set(
        this.economicActivities().filter(item =>
          item.lineBusiness.toLowerCase().includes(filterValue)
        )
      );
    });
    this.economicActivityFilter2.valueChanges.subscribe(value => {
      const filterValue = value?.toLowerCase() || '';

      this.filteredEconomicActivities2.set(
        this.economicActivities().filter(item =>
          item.lineBusiness.toLowerCase().includes(filterValue)
        )
      );
    });
    this.economicActivityFilter3.valueChanges.subscribe(value => {
      const filterValue = value?.toLowerCase() || '';

      this.filteredEconomicActivities3.set(
        this.economicActivities().filter(item =>
          item.lineBusiness.toLowerCase().includes(filterValue)
        )
      );
    });
    // #region getting catalogs from services
    this.economicActivities.set(this.route.snapshot.data['economiActity']);
    this.filteredEconomicActivities.set(this.route.snapshot.data['economiActity']);
    this.countries.set(this.route.snapshot.data['countries']);
    // #endregion getting catalogs from services

    const data = checkpointToPldQuiz(this.pldQuizService.pldQuizData());
    console.log(data);

    this.initialData = this.dataClientService.getItem();
    console.log(this.initialData);

    this.form = this.fb.group({
      // natural person
      professionActivity: [data.professionActivity, [Validators.required]],
      activity          : [data.activity || ''],
      role              : [data.role || ''],
      providedInfo      : [data.providedInfo || '', Validators.required],
      product           : [{value: data.product || '', disabled: true}, [Validators.required]],
      studiesDegree     : [data.studiesDegree || '', [Validators.required]],
      isActinverEntity  : [data.isActinverEntity || false],
      actinverEntity    : [{value: data.actinverEntity || '', disabled: true}],
      isFinancialEntity : [data.isFinancialEntity || false],
      financialEntity   : [{value: data.financialEntity || '', disabled: true}],
      isGafi            : [data.isGafi || false],
      gafi              : [{value: data.gafi || '', disabled: true}],
      place             : [data.place || '', Validators.required],
      quizDate          : [data.quizDate || '', Validators.required],
      fax               : [data.fax || '', Validators.required],
      onlyPhoneReason   : [data.onlyPhoneReason || '', Validators.required],

      // INCOME SOURCE - current Employment
      jobName    : [data.jobName || '', Validators.required],
      jobActivity: [data.jobActivity || '', Validators.required],
      jobAddress : [data.jobAddress || '', Validators.required],
      jobPhone   : [data.jobPhone || '', Validators.required],
      jobRole    : [data.jobRole || '', Validators.required],
      jobMonths  : [data.jobMonths || null, Validators.required],
      jobSalary  : [data.jobSalary || '', Validators.required],

      // INCOME SOURCE - previous Employment
      previousJobName    : [data.previousJobName || ''],
      previousJobActivity: [data.previousJobActivity || ''],
      previousJobAddress : [data.previousJobAddress || ''],
      previousJobPhone   : [data.previousJobPhone || ''],
      previousJobRole    : [data.previousJobRole || ''],
      previousJobMonths  : [data.previousJobMonths || null],
      previousJobSalary  : [data.previousJobSalary || ''],

      // INCOME SOURCE -
      extraSalary                   : [data.extraSalary || '', Validators.required],
      hasFinancialCompanyDisposition: [data.hasFinancialCompanyDisposition || false],
      financialCompanyDisposition   : [{value: data.financialCompanyDisposition || '', disabled: true}],
      isGovernmentCompany           : [data.isGovernmentCompany || false],
      governmentCompany             : [{value: data.governmentCompany || '', disabled: true}],
      isGafiCompany                 : [data.isGafiCompany || false],
      gafiCompany                   : [{value: data.gafiCompany || '', disabled: true}],

      // INCOME SOURCE - OWN BUSINESS
      businessActivity               : [data.businessActivity || '', Validators.required],
      businessCurp                   : [data.businessCurp, [Validators.pattern(REGEX.CURP_VALIDATION)]],
      businessTypeId                 : [data.businessTypeId || '', Validators.required],
      businessId                     : [data.businessId || '', Validators.required],
      businessName                   : [data.businessName || '', Validators.required],
      businessAddress                : [data.businessAddress || '', Validators.required],
      businessPhone                  : [data.businessPhone || '', Validators.required],
      businessFax                    : [data.businessFax || '', Validators.required],
      businessWebPage                : [data.businessWebPage || '', Validators.required],
      businessRole                   : [data.businessRole || '', Validators.required],
      businessTime                   : [data.businessTime || '', Validators.required],
      businessEmployees              : [data.businessEmployees || '', Validators.required],
      businessAnnualSalary           : [data.businessAnnualSalary || '', Validators.required],
      businessGeographyZones         : [data.businessGeographyZones || '', Validators.required],
      hasFinancialBusinessDisposition: [data.hasFinancialBusinessDisposition || false],
      financialBusinessDisposition   : [{value: data.financialBusinessDisposition, disabled: true}],
      isBusinessGafiZones            : [data.isBusinessGafiZones || false],
      businessGafiZones              : [{value: data.businessGafiZones || '', disabled: true}],
      isBusinessActinver             : [data.isBusinessActinver || false],
      businessActinver               : [{value: data.businessActinver, disabled: true}],
      isBusinessGafi                 : [data.isBusinessGafi || false],
      businessGafi                   : [{value: data.businessGafi, disabled: true}],

      // INCOME SOURCE - shareholderOrAssociate ( 27 )
      isMarketSociety       : [data.isMarketSociety || false],
      isSocietyOrAssociation: [data.isSocietyOrAssociation || false],
      societyOrAssociation  : [{value: data.societyOrAssociation || '', disabled: true}],
      companyName           : [data.companyName || '', Validators.required],
      corporatePurpose      : [data.corporatePurpose || '', Validators.required],
      constitutionCountry   : [data.constitutionCountry || '', Validators.required],

      societyAddress: [data.societyAddress || '', Validators.required],
      societyPhone  : [data.societyPhone || '', Validators.required],
      societyFax    : [data.societyFax || '', Validators.required],
      societyWebPage: [data.societyWebPage || '', Validators.required],
      societyRole   : [data.societyRole || '', Validators.required],
      societyTime   : [data.societyTime || '', Validators.required],

      stockList            : [data.stockList || false],
      ownSocietyRole       : [data.ownSocietyRole, Validators.required],
      ownSocietyTime       : [data.ownSocietyTime, Validators.required],

      ownSocietyPercentage : [data.ownSocietyPercentage || '', Validators.required],
      societyAnnualSalary  : [data.societyAnnualSalary || '', Validators.required],
      societyGeographyZones: [data.societyGeographyZones || '', Validators.required],

      isGafiGeographyZonesSociety: [data.isGafiGeographyZonesSociety || false],
      gafiGeographyZonesSociety  : [{value: data.gafiGeographyZonesSociety, disabled: true}],
      isActinverSociety          : [data.isActinverSociety || false],
      actinverSociety            : [{value: data.actinverSociety, disabled: true}],

      isGafiSociety: [data.isGafiSociety || false],

      hasSocietyExtraSalary: [data.hasSocietyExtraSalary || false],
      societyExtraSalary   : [{value: data.societyExtraSalary || '', disabled: true}],
      isGovernmentSociety  : [data.isGovernmentSociety || false],
      governmentSociety    : [{value: data.governmentSociety || '', disabled: true}],

      // PPE section
      isPoliticalExposedPerson        : [data.isPoliticalExposedPerson || false],
      politicalExposedPerson          : [{value: data.politicalExposedPerson || '', disabled: true}],
      isRelativePoliticalExposedPerson: [data.isRelativePoliticalExposedPerson],
      // relatedPpePersons section
      relativePpeCurp          : [{value: data.relativePpeCurp || '', disabled: true}],
      relativeTypeId           : [{value: data.relativeTypeId || '', disabled: true}],
      relativePpeId            : [{value: data.relativePpeId || '', disabled: true}],
      ppeBirthDate             : [{value: data.ppeBirthDate || '', disabled: true}],
      relativePpeFirstName     : [{value: data.relativePpeFirstName || '', disabled: true}],
      relativePpeSecondName    : [{value: data.relativePpeSecondName || '', disabled: true}],
      relativePpeFirstLastName : [{value: data.relativePpeFirstLastName || '', disabled: true}],
      relativePpeSecondLastName: [{value: data.relativePpeSecondLastName || '', disabled: true}],
      relativePpe              : [{value: data.relativePpe || '', disabled: true}],
      foreignerWithoutCurp     : [{value: data.foreignerWithoutCurp || false, disabled: true}],

      // realOwner section
      accountReason          : [data.accountReason || '', Validators.required],
      clientRelationship     : [data.clientRelationship || '', Validators.required],
      clientResourcesReason  : [data.clientResourcesReason || '', Validators.required],
      isOnlyOnePayment       : [data.isOnlyOnePayment || false],
      onlyOnePayment         : [{value: data.onlyOnePayment || '', disabled: true}],
      isCurrentPayment       : [data.isCurrentPayment || false],
      currentPayment         : [{value: data.currentPayment || '', disabled: true}],
      currentPaymentFrequency: [{value: data.currentPaymentFrequency || '', disabled: true}],

      // transactionProfileUpdate section
      accountPurpose: [data.accountPurpose || '', Validators.required],
      monthPayment  : [data.monthPayment || '', Validators.required],
      inputsNumber              : [data.inputsNumber || '', Validators.required],
      outputsNumber             : [data.outputsNumber || '', Validators.required],
      nationalInputsNumber      : [data.nationalInputsNumber || '', Validators.required],
      nationalOutputsNumber     : [data.nationalOutputsNumber || '', Validators.required],
      internationalInputsNumber : [data.internationalInputsNumber || '', Validators.required],
      internationalOutputsNumber: [data.internationalOutputsNumber || '', Validators.required],
      otherMovements            : [data.otherMovements || '', Validators.required],
      countriesMovements        : [data.countriesMovements || '', Validators.required],
      gafiCountriesMovements    : [data.gafiCountriesMovements || '', Validators.required],
      countriesMovementsReason  : [data.countriesMovementsReason || '', Validators.required],

      isForMovementsAccount      : [data.isForMovementsAccount || false],
      forMovementsAccount        : [{value: data.forMovementsAccount || '', disabled: true}],
      isForOthersMovementsAccount: [data.isForOthersMovementsAccount || false],
      forOthersMovementsAccount  : [{value: data.forOthersMovementsAccount || '', disabled: true}],


      // actinver interna use section
      hasClientReference: [data.hasClientReference || false, Validators.required],
      clientReference   : [{value: data.clientReference || '', disabled: true}],
      isMovementSimilar : [data.isMovementSimilar || false],
      movementSimilar   : [{value: data.movementSimilar || '', disabled: true}],
      isActinverHighRisk: [data.isActinverHighRisk || false],
      actinverHighRisk  : [{value: data.actinverHighRisk || '', disabled: true}],
      clientDisposition : [data.clientDisposition || '', Validators.required],
      clientVisitDate   : [data.clientVisitDate || '', Validators.required],
      adviserName       : [data.adviserName || '', Validators.required],
      adviserRole       : [data.adviserRole || '', Validators.required],
      financialManager  : [data.financialManager || '', Validators.required],
      financialDirector : [data.financialDirector || '', Validators.required],
    });

    if(this.isMaintenance()){
      this.disableForm();
    }

  }

  /**
   * Ng On Init
   */
  ngOnInit(): void {
    this.createCustomerList(this.initialData, this.signService.singSectionSignal());

    this.defaultValues();

    this.onChanges();
  }

  /**
   * Form Value Changes
   */
  onChanges(): void {

    // checks if form has changed
    this.form.valueChanges.subscribe(() => {
      if (this.editMode() || !this.isMaintenance()) {
        this.unsavedChangesService.setUnsavedChanges(this.form.dirty);
      }
    });

    //
    this.form.controls['professionActivity'].valueChanges.subscribe((value: any) => {
      this.validateProfessionActivityControls(value);
    });

    //
    this.form.controls['foreignerWithoutCurp'].valueChanges.subscribe(value => {
      this.validateForeignerWithoutCurp(value);
    });

    /**
     * enable or disable previous job info , based on jobMonts > 1 year o less
     */
    this.form.controls['jobMonths'].valueChanges.subscribe((value: number) => {
      this.validateJobMonths(value);
    });

    /**
     *
     */
    merge(
      this.form.controls['quizDate'].valueChanges.pipe(map(value => ({ control: 'quizDate', value}))),
      this.form.controls['ppeBirthDate'].valueChanges.pipe(map(value => ({ control: 'ppeBirthDate', value}))),
      this.form.controls['clientVisitDate'].valueChanges.pipe(map(value => ({ control: 'clientVisitDate', value}))),
    ).subscribe(({control, value}: {control: string, value: any}) => {
      this.validateFieldsNull(control, value);
    });

    /**
     *
     */
    this.form.controls['isCurrentPayment'].valueChanges.subscribe((value: boolean) => {
      this.validateIsCurrentPayment(value);
    });


    /**
     *
     */
    merge(
      this.form.controls['businessTypeId'].valueChanges.pipe(map(value => ({ control: 'businessId', value}))),
      this.form.controls['relativeTypeId'].valueChanges.pipe(map(value => ({ control: 'relativePpeId', value}))),
    ).subscribe(({control, value}) => {
      this.typeIdFields(control, value);
    });

    merge(
      this.form.controls['isActinverEntity'].valueChanges.pipe(map(value => ({ control: 'actinverEntity', value }))),
      this.form.controls['isFinancialEntity'].valueChanges.pipe(map(value => ({ control: 'financialEntity', value }))),
      this.form.controls['isGafi'].valueChanges.pipe(map(value => ({ control: 'gafi', value }))),
      this.form.controls['hasFinancialCompanyDisposition'].valueChanges.pipe(map(value => ({ control: 'financialCompanyDisposition', value }))),
      this.form.controls['isGovernmentCompany'].valueChanges.pipe(map(value => ({ control: 'governmentCompany', value }))),
      this.form.controls['isGafiCompany'].valueChanges.pipe(map(value => ({ control: 'gafiCompany', value }))),
      this.form.controls['hasFinancialBusinessDisposition'].valueChanges.pipe(map(value => ({ control: 'financialBusinessDisposition', value }))),
      this.form.controls['isBusinessGafiZones'].valueChanges.pipe(map(value => ({ control: 'businessGafiZones', value }))),
      this.form.controls['isBusinessActinver'].valueChanges.pipe(map(value => ({ control: 'businessActinver', value }))),
      this.form.controls['isBusinessGafi'].valueChanges.pipe(map(value => ({ control: 'businessGafi', value }))),
      this.form.controls['isSocietyOrAssociation'].valueChanges.pipe(map(value => ({ control: 'societyOrAssociation', value }))),
      this.form.controls['isGafiGeographyZonesSociety'].valueChanges.pipe(map(value => ({ control: 'gafiGeographyZonesSociety', value }))),
      this.form.controls['isActinverSociety'].valueChanges.pipe(map(value => ({ control: 'actinverSociety', value }))),
      this.form.controls['hasSocietyExtraSalary'].valueChanges.pipe(map(value => ({ control: 'societyExtraSalary', value }))),
      this.form.controls['isGovernmentSociety'].valueChanges.pipe(map(value => ({ control: 'governmentSociety', value }))),
      this.form.controls['isOnlyOnePayment'].valueChanges.pipe(map(value => ({ control: 'onlyOnePayment', value }))),
      this.form.controls['isForMovementsAccount'].valueChanges.pipe(map(value => ({ control: 'forMovementsAccount', value }))),
      this.form.controls['isForOthersMovementsAccount'].valueChanges.pipe(map(value => ({ control: 'forOthersMovementsAccount', value }))),
      this.form.controls['hasClientReference'].valueChanges.pipe(map(value => ({ control: 'clientReference', value }))),
      this.form.controls['isMovementSimilar'].valueChanges.pipe(map(value => ({ control: 'movementSimilar', value }))),
      this.form.controls['isActinverHighRisk'].valueChanges.pipe(map(value => ({ control: 'actinverHighRisk', value }))),
    ).subscribe(
      ({control, value}) => {
        this.validateCheckInputPair(control, value);
      }
    );

    /**
     * isPoliticalExposedPerson
     */
    this.form.controls['isPoliticalExposedPerson'].valueChanges.subscribe((value: boolean) => {
      this.validateIsPpe(value);
    });

  }

  /**
   *
   */
  defaultValues(): void {
    if ( '' === this.form.controls['product'].value ) {
      this.form.controls['product'].setValue(
        this.onboardingService.getCustomerInitialData().contractType
      );
    }

    if ( '' === this.form.controls['quizDate'].value ) {
      this.form.controls['quizDate'].setValue(new Date());
    }

    if ( '' === this.form.controls['businessCurp'].value ) {
      this.form.controls['businessCurp'].setValue(this.initialData?.curp);
    }

    if ( '' === this.form.controls['businessTypeId'].value ) {
      this.form.controls['businessTypeId'].setValue(
        compareAndReturnIdRfcNifTinNss(
          this.initialData?.rfc || '',
          this.initialData?.nif || '',
          this.initialData?.tin || '',
          this.initialData?.nss || '',
        )
      );
    }

    if ( '' === this.form.controls['businessId'].value ) {
      this.form.controls['businessId'].setValue(
        compareAndReturnValueRfcNifTinNss(
          this.initialData?.rfc || '',
          this.initialData?.nif || '',
          this.initialData?.tin || '',
          this.initialData?.nss || '',
        )
      );
    }

    if ( '' === this.form.controls['constitutionCountry'].value ) {
      this.form.controls['constitutionCountry'].setValue('MX');
    }
  }

  /**
   * Initializes the "titular" and "cotitular" list.
   */
  createCustomerList(titular: Data | null, cotitular: SingSection | null): void {
    console.log(titular, cotitular);

    if ( titular ) {
      let name = concatFullName(titular.firstName, titular.middleName, titular.firstLastName, titular.secondLastName);
      this.toWhomInformationProvidedOptions.push(
        {
          value: name,
          label: name,
        }
      );
    }

    if ( cotitular && cotitular.cotitularList ) {
      let dataco = [];
      dataco = cotitular.cotitularList.filter((item: CotitularInfo) => item.active)
        .map((item2: CotitularInfo) => {
          let name = concatFullName(item2.dataSection?.firstName, item2.dataSection?.middleName, item2.dataSection?.firstLastName, item2.dataSection?.secondLastName);
          return {
            value: name,
            label: name
          };
        });
      this.toWhomInformationProvidedOptions = [...this.toWhomInformationProvidedOptions, ...dataco];
    }
  }

  /**
   *
   */
  private getMissingRequiredFields(): string[] {
    const missingFields: string[] = [];
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);

      if (control?.invalid && control?.hasError('required')) {
        const labelElement = document.getElementById(`${key}Label`);
        const labelText = labelElement?.textContent?.replace('*', '').trim() || key;
        missingFields.push(labelText);
      }
    });
    return missingFields;
  }

  /**
   *
   */
  private getInvalidFieldsExcludingRequired(): string[] {
    const invalidFields: string[] = [];
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);

      if (control?.invalid && control?.errors) {
        const errors = control.errors;
        const nonRequiredErrors = Object.keys(errors).filter(errorKey => errorKey !== 'required');

        if (nonRequiredErrors.length > 0) {
          const labelElement = document.getElementById(`${key}Label`);
          const labelText = labelElement?.textContent?.replace('*', '').trim() || key;
          invalidFields.push(labelText);
        }
      }
    });
    return invalidFields;
  }

  /**
   *
   */
  removeExtraSpaces(text: string) {
    return text.replace(REGEX.MULTIPLE_SPACES, ' ');
  }

  getListValues = (list?: WatchList) => list?.matchLists?.map(item => item.type) || [];


  /**
   * Verifies HM and WL
   */
  async checkHomonymsWatchlist(): Promise<boolean>{
     const data = {
       firstName: this.form.get('relativePpeFirstName')?.value || '',
       middleName: this.form.get('relativePpeSecondName')?.value || '',
       firstLastName: this.form.get('relativePpeFirstLastName')?.value || '',
       secondLastName: this.form.get('relativePpeSecondLastName')?.value || '',
       rfc: this.form.get('relativePpeId')?.value  || '',
       curp: this.form.get('relativePpeCurp')?.value  || '',
       typeIden: this.form.get('relativeTypeId')?.value  || '',
       gender: "",
       countryOfBirth: "",
       dateOfBirth: "",
       stateOfBirth: "",
     }

      const name = data.firstName;
      const middleName = data.middleName || ''
      const firstLastName = data.firstLastName || ''
      const secondLastName = data.secondLastName || ''
      const dataWatchList: CustomerWatchListBody = {
        personalInfo: {
          fullName: '',
          birthDate: data.dateOfBirth,
          rfc: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.RFC, data.typeIden),
          curp: data.curp || '',
          nif: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.NIF, data.typeIden),
          clientNumber: this.onboardingService.getCurrentInfo()?.clientId?.toString() || '',
          ssn: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.SSN, data.typeIden),
          personType: '1',
          name: data.firstName,
          middleName: data.middleName || '',
          lastName: data.firstLastName || '',
          secondLastName: data.secondLastName || '',
          gender: data.gender || '',
          countryOfBirth: data.countryOfBirth,
          federalEntity: data.stateOfBirth,
        }
      }
      try {
        this.listData = await lastValueFrom(this.dataWatchlistService.postData(dataWatchList));
        const watchListData = this.getListValues(this.listData);
        document.body.classList.remove('show-validation');
        if (this.listData?.step === 1) {
          if (watchListData.length > 1) {
            this.unsavedChangesService.setUnsavedChanges(false);
            this.modalFormService.closeModal();
            await this.notificationModalService.error({
              title: 'El solicitante se encuentra en la lista ',
              beforeMessages: watchListData,
              afterMessages: ['Consultar con el área de PLD'],
              btnAccept: 'Terminar',
            });
            return false;
          }
          else if (watchListData.length === 0) {
            this.unsavedChangesService.setUnsavedChanges(false);
            this.modalFormService.closeModal();
            await this.notificationModalService.error({
              title: 'El solicitante se encuentra en la lista ',
              afterMessages: ['Consultar con el área de PLD'],
              btnAccept: 'Terminar',
            });
            return false;
          }
          else {
            this.unsavedChangesService.setUnsavedChanges(false);
            this.modalFormService.closeModal();
            await this.notificationModalService.error({
              title: 'El solicitante se encuentra en la lista ' + watchListData[0],
              afterMessages: ['Consultar con el área de PLD'],
              btnAccept: 'Terminar',
            });
            return false;
          }
        }
        if (this.listData?.step === 2) {
          this.modalFormService.closeModal();
          this.unsavedChangesService.setUnsavedChanges(false);
          await this.notificationModalService.warning({
            title: '¡Atención!',
            afterMessages: ['El Cliente en cuestión ha sido remitido al Área de PLD para su revisión.'],
          });
          return false;
        }
      }
      catch (error) {
        this.notificationService.error('Fallo al Validar en Listas de Restricción');
        return false;
      }
      const dataHomonymsList: HomonymsRequest = {
        channelId: "SPINE",
        applicationId: "0001",
        personType: 1,
        name: data.firstName,
        middleName: data.middleName || '',
        lastName: data.firstLastName || '',
        secondLastName: data.secondLastName || '',
        // federalEntity: data.stateOfBirth,
        // gender: data.gender,
        rfc: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.RFC, data.typeIden),
        nif: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.NIF, data.typeIden),
        tin: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.NIF, data.typeIden),
        nss: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.SSN, data.typeIden),
        birthPlace: data.countryOfBirth,
        birthDate: data.dateOfBirth,
        curp: data.curp || '',
      }

      try {
        this.listHomonyms = await lastValueFrom(this.dataHomonymService.postHomonyms(dataHomonymsList));
        let homo = searchPercentSimilarity(this.listHomonyms);

        if (this.listHomonyms) {
          if (homo.code === 2 || homo.code === 3) {
            this.unsavedChangesService.setUnsavedChanges(false);
            this.dataHomonymService.setData(this.listHomonyms);
            await this.notificationModalService.success({
              title: '¡Se ha encontrado coincidencias!',
              afterMessages: ['Se ha encontrado homonimias del Cliente. '],
              btnAccept: 'Revisión',
            });
            const result = await this.modalHomonymsServiceService.formModalHomonyms();
            if (result === "continue") {
              //TODO: test once coincidence is ready
            }
            return false;
          }
          if (homo.code === 1) {
            this.unsavedChangesService.setUnsavedChanges(false);
            this.dataHomonymService.setData(this.listHomonyms);
            await this.notificationModalService.success({
              title: '¡Se ha encontrado una coincidencia!',
              afterMessages: ['Se ha encontrado una coincidencia exacta con', 'Número de Cliente', this.listHomonyms[0].clientNumber],
              btnAccept: 'Revisión',
            });
            const result = await lastValueFrom(this.modalService.homonimiaModal([this.listHomonyms[homo.indices[0]]]));
            return result ? true : false;
          }
          else {
            return true;
          }
        }
        else {
          return true;
        }
      }
      catch (error) {
        this.notificationService.error('Fallo al Validar en Búsqueda de Homónimos');
        return false;
      }
   }

  async save() {
    console.log(this.form.value);
    console.log(this.form.getRawValue());
    console.log(pldQuizToCheckpoint(this.form));

    if ( this.form.valid ) {
      let res: any = '';
      if ( this.form.controls['isPoliticalExposedPerson'].value ) {
        res = await this.checkHomonymsWatchlist();
      } else {
        res = true;
      }

      if ( !res ) {
        this.router.navigate(['/'], { relativeTo: this.route.parent });
        return;
      }

      this.unsavedChangesService.setUnsavedChanges(false);

      const saveFn = this.isMaintenance() ? 'saveSectionMant' : 'saveSection';

      // const bodyData = this.isMaintenance() ? pldQuizToCheckpointMaint(this.form) : pldQuizToCheckpoint(this.form);

      this.checkpoint[saveFn]('questionnairePld', pldQuizToCheckpoint(this.form))
      .pipe(first())
      .subscribe(
        {
          next: (res) => {
            this.notificationService.success('Guardado con éxito');
            this.pldQuizService.set(pldQuizToCheckpoint(this.form));
            if ( this.isMaintenance() ) {
              this.disableForm();
            }
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => {
          }
        },
      );
    } else {
      const missingRequiredFields = this.getMissingRequiredFields();
      console.log(missingRequiredFields);

      document.body.classList.add('show-validation');

      for (const [, control] of Object.entries(this.form.controls)) {
        if (control.invalid) {
          control.markAsTouched();
        }
      }

      if ( missingRequiredFields.length > 0 ) {
        this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS);
        return;
      }

      const invalidFormat = this.invalidFormatFields();
      if ( invalidFormat ) {
        this.notificationService.error(ERROR_MESSAGES.INCORRECT_FORMAT);
        return;
      }

    }
  }

  /**
   * Checks if some control has error.
   */
  protected invalidFormatFields(): any {
    let invalid = false;
    Object.values(this.form.controls).map((control) => {
      if ( control.invalid ) {
        invalid = true;
        control.markAsTouched();
      }
    });
    return invalid;
  }

  edit(): void {
    this.enableForm();
  }

  /**
   *
   */
  cancel(): void {
    console.log(this.pldQuizService.initialPldQuizData);
    console.log(checkpointToPldQuiz(this.pldQuizService.pldQuizData()));
    this.form.reset(checkpointToPldQuiz(this.pldQuizService.pldQuizData()));
    this.disableForm();
    this.unsavedChangesService.setUnsavedChanges(false);
  }

  /**
   *
   */
  enableForm(): void {
    this.form.enable({ emitEvent: false });
    this.applyConditionalRules();
    this.editMode.set(true);
  }

  /**
   *
   */
  disableForm(): void {
    this.form.disable({ emitEvent: false });
    this.editMode.set(false);
  }

  /**
   *
   */
  private applyConditionalRules(): void {

    this.validateProfessionActivityControls(this.form.controls['professionActivity'].value);

    this.validateForeignerWithoutCurp(this.form.controls['foreignerWithoutCurp'].value);

    this.validateJobMonths(this.form.controls['jobMonths'].value);

    this.validateIsCurrentPayment(this.form.controls['isCurrentPayment'].value);

    const fields = [
      { source: 'isActinverEntity'               , target: 'actinverEntity'},
      { source: 'isFinancialEntity'              , target: 'financialEntity'},
      { source: 'isGafi'                         , target: 'gafi'},
      { source: 'hasFinancialCompanyDisposition' , target: 'financialCompanyDisposition'},
      { source: 'isGovernmentCompany'            , target: 'governmentCompany'},
      { source: 'isGafiCompany'                  , target: 'gafiCompany'},
      { source: 'hasFinancialBusinessDisposition', target: 'financialBusinessDisposition'},
      { source: 'isBusinessGafiZones'            , target: 'businessGafiZones'},
      { source: 'isBusinessActinver'             , target: 'businessActinver'},
      { source: 'isBusinessGafi'                 , target: 'businessGafi'},
      { source: 'isSocietyOrAssociation'         , target: 'societyOrAssociation'},
      { source: 'isGafiGeographyZonesSociety'    , target: 'gafiGeographyZonesSociety'},
      { source: 'isActinverSociety'              , target: 'actinverSociety'},
      { source: 'hasSocietyExtraSalary'          , target: 'societyExtraSalary'},
      { source: 'isGovernmentSociety'            , target: 'governmentSociety'},
      { source: 'isOnlyOnePayment'               , target: 'onlyOnePayment'},
      { source: 'isForMovementsAccount'          , target: 'forMovementsAccount'},
      { source: 'isForOthersMovementsAccount'    , target: 'forOthersMovementsAccount'},
      { source: 'hasClientReference'             , target: 'clientReference'},
      { source: 'isMovementSimilar'              , target: 'movementSimilar'},
      { source: 'isActinverHighRisk'             , target: 'actinverHighRisk'},
    ];
    for (let control of fields ) {
      const value = this.form.controls[control.source].value;
      this.validateCheckInputPair(control.target, value);
    }

    const fieldsTypeId = [
      { source: 'businessTypeId', target: 'businessId' },
      { source: 'relativeTypeId', target: 'relativePpeId' },
    ];
    for (let control of fieldsTypeId ) {
      this.typeIdFields(control.target, this.form.controls[control.source].value);
    }

    const fieldsNull = [
      {source: 'quizDate', target: 'quizDate'},
      {source: 'ppeBirthDate', target: 'ppeBirthDate'},
      {source: 'clientVisitDate', target: 'clientVisitDate'},
    ];
    for (let control of fieldsNull ) {
      this.validateFieldsNull(control.target, this.form.controls[control.source].value)
    }

    this.validateIsPpe(this.form.controls['isPoliticalExposedPerson'].value);
  }

  /**
   *
   */
  private validateProfessionActivityControls(value: boolean): void {
    if ( value ) {
      this.form.controls['activity'].setValidators(Validators.required);
      this.form.controls['activity'].enable({ emitEvent: false });

      this.form.controls['role'].setValidators(Validators.required);
      this.form.controls['role'].enable({ emitEvent: false });
    } else {
      this.form.controls['activity'].clearValidators();
      this.form.controls['activity'].setValue('', { emitEvent: false });
      this.form.controls['activity'].disable({ emitEvent: false });
      this.form.controls['role'].clearValidators();
      this.form.controls['role'].setValue('', { emitEvent: false });
      this.form.controls['role'].disable({ emitEvent: false });
    }
    this.form.controls['activity'].updateValueAndValidity({ emitEvent: false });
    this.form.controls['role'].updateValueAndValidity({ emitEvent: false });
  }

  /**
   *
   */
  private validateForeignerWithoutCurp(value: boolean): void {
    if ( value ) {
      console.log("true ppe curp");
      this.form.controls['relativePpeCurp'].clearValidators();
      this.form.controls['relativePpeCurp'].updateValueAndValidity();
      this.form.controls['relativePpeCurp'].setValue('');
      this.form.controls['relativePpeCurp'].disable();
    } else {
      console.log("false ppe curp");
      this.form.controls['relativePpeCurp'].enable();
      this.form.controls['relativePpeCurp'].setValidators(Validators.required);
      this.form.controls['relativePpeCurp'].updateValueAndValidity();

    }
  }

  /**
   *
   */
  private validateJobMonths(value: number): void {
    const previousJob: Array<string> = [
      'previousJobName',
      'previousJobActivity',
      'previousJobAddress',
      'previousJobPhone',
      'previousJobRole',
      'previousJobMonths',
      'previousJobSalary',
    ];
    if ( value < 12 ) {
      for ( let field of previousJob ) {
        this.form.controls[field].setValidators(Validators.required);
      }
    } else {
      for ( let field of previousJob ) {
        this.form.controls[field].clearValidators();
        this.form.controls[field].setValue('');
      }
    }
    for ( let field of previousJob ) {
      this.form.controls[field].updateValueAndValidity();
    }
  }

  /**
   *
   */
  private validateIsCurrentPayment(value: boolean): void {
    if ( value ) {
      this.form.controls['currentPayment'].enable();
      this.form.controls['currentPaymentFrequency'].enable();
      this.form.controls['currentPayment'].setValidators(Validators.required);
      this.form.controls['currentPaymentFrequency'].setValidators(Validators.required);
    }
    else{
      this.form.controls['currentPayment'].clearValidators();
      this.form.controls['currentPaymentFrequency'].clearValidators();
      this.form.controls['currentPayment'].setValue('');
      this.form.controls['currentPaymentFrequency'].setValue('');
      this.form.controls['currentPayment'].disable();
      this.form.controls['currentPaymentFrequency'].disable();
    }
    this.form.controls['currentPayment'].updateValueAndValidity();
    this.form.controls['currentPaymentFrequency'].updateValueAndValidity();
  }

  /**
   *
   */
  private validateCheckInputPair(control: string, value: any): void {
    if ( value ) {
      this.form.controls[control].enable();
      this.form.controls[control].setValidators(Validators.required);
      this.form.controls[control].updateValueAndValidity();
    }
    else{
      this.form.controls[control].clearValidators();
      this.form.controls[control].updateValueAndValidity();
      this.form.controls[control].setValue('');
      this.form.controls[control].disable();
    }
  }

  /**
   *
   */
  private typeIdFields(control: string, value: any): void {
    if ( value === 1 ) {
      this.form.controls[control].setValidators([
        Validators.required,
        Validators.pattern(REGEX.RFC_VALIDATION),
        Validators.maxLength(13),
      ]);
    } else {
      this.form.controls[control].setValidators([
        Validators.required,
        Validators.pattern(REGEX.NIF_TIN_NSS_VALIDATION),
        Validators.maxLength(13),
      ]);
    }
    this.form.controls[control].updateValueAndValidity();
  }

  /**
   *
   */
  private validateFieldsNull(control: string, value: any): void {
      if (value == null) {
        this.form.controls[control].setValue("");
      }
  }

  /**
   *
   */
  private validateIsPpe(value: boolean): void {
    const ff = [
      'politicalExposedPerson',
      'relativePpeCurp',
      'relativeTypeId',
      'relativePpeId',
      'ppeBirthDate',
      'relativePpeFirstName',
      'relativePpe',

      'isRelativePoliticalExposedPerson',
      'foreignerWithoutCurp',
      'relativePpeSecondName',
      'relativePpeFirstLastName',
      'relativePpeSecondLastName',
    ];
    const justEnable = [
      'isRelativePoliticalExposedPerson',
      'foreignerWithoutCurp',
      'relativePpeSecondName',
      'relativePpeFirstLastName',
      'relativePpeSecondLastName',
    ];
    if ( value ) {
      for(let field of ff) {
        this.form.controls[field].enable({ emitEvent: false });
        if ( !justEnable.includes(field) ) {
          this.form.controls[field].setValidators(Validators.required);
        }
        this.form.controls[field].updateValueAndValidity({ emitEvent: false });
      }
    } else {
      for(let item of ff) {
        this.form.controls[item].setValue('', { emitEvent: false });
        this.form.controls[item].clearValidators();
        this.form.controls[item].disable({ emitEvent: false });
        this.form.controls[item].updateValueAndValidity({ emitEvent: false });
      }
    }
  }

  /**
   *
   */
  preventNegative(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === 'Subtract') {
      event.preventDefault();
    }
  }
}
