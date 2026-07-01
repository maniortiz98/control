import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom, firstValueFrom } from 'rxjs';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { DataClient, DataClientFamilyPPE } from '../../models/client-data';
import { CustomerWatchListBody, WatchList } from '../../models/customer-watch-list';
import { EconomicActivity } from '../../models/economic-activity';
import { Relationships } from '../../models/relationships';
import { PpeSectionComponent } from '../../../shared/components/sections/ppe-section/ppe-section.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AddressSectionComponent } from '../../../shared/components/sections/address-section/address-section.component';
import { HomonymsService } from '../../../shared/services/homonyms.service';
import { ModalFormService } from '../../../shared/services/modal-form.service';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { WatchlistService } from '../../../shared/services/watchlist.service';
import { FormFlow, REGEX, STRINGS } from '../../constants/constants';
import { City } from '../../models/city';
import { Countries } from '../../models/country';
import { Entity } from '../../models/entity';
import { HomonymsResponse, HomonymsRequest } from '../../models/homonyms';
import { Nationalities } from '../../models/nationality';
import { MatRadioChange } from '@angular/material/radio';
import { RealOwnerData } from '../../models/real-owner';
import { ResourceProvider, ResourceProviderData } from '../../models/resource-provider';
import { ResourceProviderService } from '../../../shared/services/storage-services/resource-provider.service';
import { compareAndReturnRfcNifTinNss, AllowedValuesRfcNifTinNss, compareAndReturnValueRfcNifTinNss, compareAndReturnIdRfcNifTinNss } from '../../../shared/utils/map-rfc-nif-tin-nss';
import { convertDateBack, formatDateYYYYMMDD, yearsAgo, yearsAgoLegacy } from '../../../shared/utils/datetime';
import { validateRFCDay, validateRFCMonth } from '../../../shared/utils/rfcValid';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { mapToCheckPointResourceProvider, mapToCheckPointResourceProviderMant } from '../../services/mappers/resource-provider-maper';
import { ModalHomonymsServiceService } from '../../../shared/services/modal-homonyms-service.service';
import { OnboardingService } from '../../services/onboarding.service';
import { ModalPpeFamilyComponent } from '../../../shared/components/modals/modal-ppe-family/modal-ppe-family.component';
import { butonFunctionDis, buttonFunctionEn, formFunctionDis, formFunctionDisMatch, formFunctionEn, formFunctionEnAll } from '../../../shared/utils/disableOrEnabled';
import { Mantent } from '../../../shared/services/modal-ppe-family.service';
import { PermissionRolService } from '../../../core/services/rol.service';
import { FielValidationService } from '../../../shared/services/fiel-validation.service';
import { searchState } from '../../../shared/utils/search-state';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
import { searchPercentSimilarity } from '../../../shared/utils/homonyms-search';
import { CurpValidationResponse } from '../../models/curp-valid';
import { ValidCurpService } from '../../../shared/services/curp-valid/valid-curp.service';
import { countSpaces, validCurp } from '../../../shared/utils/curp-valid';
import { ModalSearchClientService } from '../../../shared/services/modal-search-client.service';
import { SearchClientFlowService } from '../../../shared/services/search-client-flow.service';
import { CustomerInformationService } from '../../../shared/services/customer.service';
import { CI_FamilyData, CustomerInformation } from '../../../shared/models/customer';
import { compareGenderAndReturnValue } from '../../../shared/utils/maper-gender';
import { maxDateValidator, minDateValidator } from '../../../shared/utils/validators';
import moment from 'moment';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { mapToSignalResourceProviderMant } from '../../services/mappers/maintenance/respnse/resources-provider';
import { ROLES } from '../../constants/const.role';

@Component({
  selector: 'app-resource-provider',
  standalone: false,
  templateUrl: './resource-provider.component.html',
  styleUrl: './resource-provider.component.scss'
})
export class ResourceProviderComponent {
  @ViewChild(PpeSectionComponent) ppeSectionComponent!: PpeSectionComponent;
  @ViewChild(AddressSectionComponent) addressSectionComponent!: AddressSectionComponent;
  @ViewChild(ModalPpeFamilyComponent) modalPpeFamilyComponent!: ModalPpeFamilyComponent;
  @ViewChild('pickerBirthdate') pickerBirthdate!: MatDatepicker<Date>;

  //Inject
  private readonly catalogService = inject(CatalogsService);
  private readonly fb = inject(FormBuilder);
  readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationsService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly resourceProviderService = inject(ResourceProviderService);
  private readonly dataWatchlistService = inject(WatchlistService);
  private readonly dataHomonymService = inject(HomonymsService);
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly modalService = inject(ModalFormService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly modalHomonymsServiceService = inject(ModalHomonymsServiceService);
  private readonly permissionRolService = inject(PermissionRolService);
  private readonly onboardingService = inject(OnboardingService);
  isMaintenance: boolean = this.onboardingService.getCurrentInfo().isMaintenance;
  isMaintenanceE = signal<boolean>(true);
  private readonly fielValidationService = inject(FielValidationService);
  private readonly validCurpService = inject(ValidCurpService);
  private readonly searchClientFlowService = inject(SearchClientFlowService);
  private readonly customerInformationService = inject(CustomerInformationService);

  readonly tp: any[] = [{ name: 'PERSONA FISICA', id: '1' }];

  birthDates = {
    startAt: yearsAgo(18),
    max: new Date(),
    min: yearsAgo(150),
  };

  // variables
  thirdRelated: boolean = true;
  profileForm: FormGroup = this.fb.nonNullable.group({
    economicActivity: ['', Validators.required],
    relationship: ['', Validators.required],
    field: ['',],
    phone: ['', Validators.required],
    mail: ['', Validators.required],
    expirationDateField: [{ value: '', disabled: true }],

    curp: [{ value: '', disabled: false }, [Validators.required, Validators.pattern(REGEX.CURP_VALIDATION)]],
    foreignerWithoutCurp: [false],
    rfc: ['', [Validators.required, Validators.pattern(REGEX.RFC_VALIDATION)]],
    firstName: ['', [Validators.required, Validators.pattern(REGEX.FIRST_NAME_VALIDATION)]],
    middleName: ['', [Validators.pattern(REGEX.FIRST_NAME_VALIDATION)]],
    dateOfBirth: ['', [Validators.required, minDateValidator(this.birthDates.min), maxDateValidator(this.birthDates.max)]],
    firstLastName: ['', [Validators.pattern(REGEX.LAST_NAME_VALIDATION)]],
    secondLastName: ['', [Validators.pattern(REGEX.LAST_NAME_VALIDATION)]],
    gender: [{ value: '' }, Validators.required],
    maritalStatus: ['', Validators.required],
    nationality: ['', [Validators.required, Validators.pattern(REGEX.STATE_VALIDATION)]],
    countryOfBirth: ['', Validators.required],
    stateOfBirth: ['', Validators.required],
    countryTaxCodeAbroad: [''],
    typeIden: ['', Validators.required],
    typePerson: ['', Validators.required],
  });

  //Signals
  errors = signal<string[]>([]);
  nationalities = signal<Nationalities[]>([]);
  countries = signal<Array<Countries>>([]);
  cities = signal<City[]>([]);
  foreignerCURP = signal(false);
  foreign = signal(false);
  typeIden = signal(false);
  field = signal(false);
  states = signal<Entity[]>([]);

  // variables
  isOnboarding: boolean = false;
  listData: WatchList | undefined;
  listHomonyms: HomonymsResponse[] | undefined;
  data: RealOwnerData | null = null;
  dataAux: any;
  mant: Mantent = {
    isMainten: false,
    allDisabled: false,
    config: {
      showPag: false,
      showEditAction: true,
      showDeleteAction: false,
      showViewAction: false,
      multipleSelection: false,
      isSelected: false,
      idName: 'tr_tempid',
      singleSelection: { show: false, title: '', propertyName: 'customProperty' }
    },
    fieldsDisabled: [],
    fieldsEnabled: [],
    butonsDisabled: []
  };
  curpAux = '';

  economicActivity = signal<EconomicActivity[]>([]);
  relationships = signal<Array<Relationships>>([]);

  columnsFamily: Array<any> = [];
  dataFamily: Array<DataClientFamilyPPE> = [];

  filteredEconomicActivities = signal<EconomicActivity[]>([]);
  economicActivityFilter = new FormControl('');

  //Constructor
  constructor() {
    document.body.classList.remove('show-validation');
    this.economicActivityFilter.valueChanges.subscribe(value => {
      const filterValue = value?.toLowerCase() || '';

      this.filteredEconomicActivities.set(
        this.economicActivity().filter(item =>
          item.lineBusiness.toLowerCase().includes(filterValue)
        )
      );
    });
  }

  isNotEmpty(obj: any) {
    return Object.keys(obj).length > 0;
  }

  ngOnInit() {
    this.data = this.resourceProviderService.getItem();
    this.catalogService.getEconomicActivity({ lineBusinessId: [] }).subscribe(m => {
      this.economicActivity.set(m);
      this.filteredEconomicActivities.set(m);
    });
    const bbRel = {
      bool: '',
      clientId: '',
      language: '',
    };
    this.catalogService.getRelationships(bbRel).subscribe(c => {
      this.relationships.set(c);
    });

    this.columnsFamily = [
      { name: 'rfc', title: 'RFC' },
      { name: 'curp', title: 'CURP' },
      { name: 'firstName', title: 'Primer Nombre' },
      { name: 'firstLastName', title: 'Primer Apellido' },
      { name: 'relationship', title: 'Parentesco' },
      { name: 'positionHeld', title: 'Cargo Desempeñado' },
      { name: 'chargeDueDate', title: 'Fecha de Vencimiento del Cargo' },
    ];


    this.catalogService.getCountry({ land: [] }).subscribe(c => {
      this.countries.set(c);
    });

    this.catalogService.getNationalities({ land: [] }).subscribe(c => {
      this.nationalities.set(c);
    });

    this.catalogService.getFederalEntity({ land1s: ["MX"] }).subscribe(c => {
      this.states.set(c);
    });
    this.profileForm.get('field')?.valueChanges.subscribe(value => {
      if (value) {
        this.field.set(true);
      } else {
        this.field.set(false);
      }
    });
    // this.profileForm.controls['dateOfBirth'].valueChanges.subscribe((value: any) => {
    //   if (value == null) {
    //     this.profileForm.controls['dateOfBirth'].setValue("");
    //   }
    // });
    if (this.data && this.isNotEmpty(this.data)) {
      this.validCurp = validCurp(this.data.generalData.curp || '', this.data.generalData.foreignerWithoutCurp || false);
      this.curpAux = this.data.generalData.curp ?? '';
      this.dataAux = this.data.generalData.curp.toUpperCase().substring(11, 13);
      const countryTaxCodeAbroad = this.profileForm.get('countryTaxCodeAbroad');
      this.profileForm.patchValue({ curp: this.data.generalData.curp.toUpperCase() });
      if (this.data.generalData.curp?.toUpperCase().substring(11, 13) === STRINGS.FOREIGN) {
        this.foreign.set(true);
        this.dataAux = 'NE'
      }
      if (this.data.generalData.foreignerWithoutCurp === true) {
        this.foreignerCURP.set(true);
        this.dataAux = 'NE'
        const curpControl = this.profileForm.get('curp');
        curpControl?.disable();
      }
      if (this.data.generalData.typeIden?.toUpperCase() === "2"
        || this.data.generalData.typeIden?.toUpperCase() === "3"
        || this.data.generalData.typeIden?.toUpperCase() === "4") {
        this.typeIden.set(true);
        countryTaxCodeAbroad?.setValidators(Validators.required);
      }
      this.profileForm.patchValue({
        foreignerWithoutCurp: this.data.generalData.foreignerWithoutCurp,
        rfc: this.data.generalData.rfc?.toUpperCase(),
        firstName: this.data.generalData.firstName?.toUpperCase(),
        middleName: this.data.generalData.middleName?.toUpperCase(),
        dateOfBirth: this.data.generalData.dateOfBirth,
        firstLastName: this.data.generalData.firstLastName?.toUpperCase(),
        secondLastName: this.data.generalData.secondLastName?.toUpperCase(),
        gender: this.data.generalData.gender,
        nationality: this.data.generalData.nationality?.toUpperCase(),
        countryOfBirth: this.data.generalData.countryOfBirth?.toUpperCase(),
        stateOfBirth: this.data.generalData.stateOfBirth?.toUpperCase(),
        curp: this.data.generalData.curp?.toUpperCase(),
        countryTaxCodeAbroad: this.data.generalData.countryTaxCodeAbroad?.toUpperCase(),
        typeIden: this.data.generalData.typeIden?.toUpperCase(),
        typePerson: this.data.generalData.typePerson?.toUpperCase(),
        relationship: this.data.generalData.relationship?.toUpperCase(),
        field: this.data.generalData.field?.toUpperCase(),
        phone: this.data.generalData.phone,
        mail: this.data.generalData.mail?.toUpperCase(),
        economicActivity: this.data.generalData.economicActivity?.toUpperCase(),
        expirationDateField: this.data.generalData.expirationDateField
      });
      if (!this.data.generalData.nationality) {
        this.profileForm.patchValue({ gender: '' });
        this.profileForm.patchValue({ nationality: STRINGS.MEXICAN });
        this.profileForm.patchValue({ countryOfBirth: STRINGS.MEXICO });
        this.profileForm.patchValue({ typeIden: AllowedValuesRfcNifTinNss.RFC });
      }
    } else {
      this.profileForm.patchValue({ gender: '', nationality: STRINGS.MEXICAN, countryOfBirth: STRINGS.MEXICO });
      this.profileForm.patchValue({ typeIden: AllowedValuesRfcNifTinNss.RFC });
      this.profileForm.patchValue({ typePerson: '1' });
    }
    this.mant = {
      isMainten: this.isMaintenance,
      allDisabled: true,
      config: {
        showPag: false,
        showEditAction: true,
        showDeleteAction: false,
        showViewAction: false,
        multipleSelection: false,
        isSelected: false,
        idName: 'tr_tempid',
        singleSelection: { show: false, title: '', propertyName: 'customProperty' }
      },
      fieldsDisabled: [],
      fieldsEnabled: [],
      butonsDisabled: this.permissionRolService.getPermissions()['resource-provider'].buttonsDisabled
    }
  }
  ngAfterViewInit() {

    this.profileForm.valueChanges.subscribe(() => {
      this.unsavedChangesService.setUnsavedChanges(this.profileForm.dirty);
    });

    if (this.data && this.isNotEmpty(this.data)) {
      console.log(this.data.adrres)
      this.addressSectionComponent.setAddresData(this.data.adrres);
      console.log(this.data.ppe)
      this.ppeSectionComponent.setDataResourceProviderPPE(this.data.ppe);
    }

    if (this.isMaintenance) {
      console.log('entra rp')
      formFunctionDis(this.profileForm);
      formFunctionDis(this.addressSectionComponent.profileForm);
      formFunctionDis(this.ppeSectionComponent.profileForm);
      if (!this.permissionRolService.getPermissions()['resource-provider'].allDisabled) {
        this.isMaintenanceE.set(false);
      }
    } else {
      this.searchForActions('initialFlow');
    }
  }

  editt() {
    console.log(this.permissionRolService.getPermissions()['resource-provider'].allDisabled)
    if (this.permissionRolService.getPermissions()['resource-provider'].allDisabled) {
    } else {
      if( this.data?.generalData.field === '' && (ROLES.ROL_ANALISTA_DE_CONTRATOS || ROLES.SPINE_GESTOR_SUP)) {
        formFunctionEnAll(this.profileForm, []);
      }else{
        formFunctionEnAll(this.profileForm, ['expirationDateField']);
      }
      
      formFunctionDisMatch(this.profileForm, ['relationship', 'economicActivity', 'field', 'mail', 'phone', 'expirationDateField']);
      butonFunctionDis(this.permissionRolService.getPermissions()['resource-provider'].buttonsDisabled);
      this.mant = {
        isMainten: this.isMaintenance,
        allDisabled: false,
        config: {
          showPag: false,
          showEditAction: true,
          showDeleteAction: false,
          showViewAction: false,
          multipleSelection: false,
          isSelected: false,
          idName: 'tr_tempid',
          singleSelection: { show: false, title: '', propertyName: 'customProperty' }
        },
        fieldsDisabled: [],
        fieldsEnabled: [],
        butonsDisabled: this.permissionRolService.getPermissions()['resource-provider'].buttonsDisabled
      }
      buttonFunctionEn(this.permissionRolService.getPermissions()['resource-provider'].buttonsEnabled);
      butonFunctionDis(['btnEdit']);
      buttonFunctionEn(['cancelClear', 'btnValid', 'search']);
    }
  }

  edittMant() {
    console.log(this.permissionRolService.getPermissions()['resource-provider'].allDisabled)
    if (this.permissionRolService.getPermissions()['resource-provider'].allDisabled) {
    } else {
      if( this.data?.generalData.field === '' && (ROLES.ROL_ANALISTA_DE_CONTRATOS || ROLES.SPINE_GESTOR_SUP)) {
        formFunctionEnAll(this.profileForm, []);
      }else{
        formFunctionEnAll(this.profileForm, ['expirationDateField']);
      }
      formFunctionDis(this.profileForm, ['relationship', 'economicActivity', 'field', 'mail', 'phone', 'expirationDateField']);
      formFunctionEnAll(this.addressSectionComponent.profileForm);
      const country =  this.addressSectionComponent.profileForm.get('country')?.value;
      this.addressSectionComponent.enableDisableFECityMun(country);
      formFunctionEnAll(this.ppeSectionComponent.profileForm);
      butonFunctionDis(this.permissionRolService.getPermissions()['resource-provider'].buttonsDisabled);
      this.mant = {
        isMainten: this.isMaintenance,
        allDisabled: false,
        config: {
          showPag: false,
          showEditAction: true,
          showDeleteAction: false,
          showViewAction: false,
          multipleSelection: false,
          isSelected: false,
          idName: 'tr_tempid',
          singleSelection: { show: false, title: '', propertyName: 'customProperty' }
        },
        fieldsDisabled: [],
        fieldsEnabled: [],
        butonsDisabled: this.permissionRolService.getPermissions()['resource-provider'].buttonsDisabled
      }
      buttonFunctionEn(this.permissionRolService.getPermissions()['resource-provider'].buttonsEnabled);
      butonFunctionDis(['btnEdit', 'btnValid', 'search']);
      buttonFunctionEn(['cancelClear', 'btnSave']);
    }
  }

  cancel() {
    if (this.data) {
      this.setClientData(this.data);
    }
    formFunctionDis(this.profileForm);
    formFunctionDis(this.addressSectionComponent.profileForm);
    formFunctionDis(this.ppeSectionComponent.profileForm);
    this.mant = {
      isMainten: this.isMaintenance,
      allDisabled: true,
      config: {
        showPag: false,
        showEditAction: true,
        showDeleteAction: false,
        showViewAction: false,
        multipleSelection: false,
        isSelected: false,
        idName: 'tr_tempid',
        singleSelection: { show: false, title: '', propertyName: 'customProperty' }
      },
      fieldsDisabled: [],
      fieldsEnabled: [],
      butonsDisabled: this.permissionRolService.getPermissions()['resource-provider'].buttonsDisabled
    }
    buttonFunctionEn(['btnEdit']);
    butonFunctionDis(['btnSave', 'btnCancel', 'cancelClear', 'btnValid', 'search']);
  }

  onForeignerClick(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.foreignerCURP.set(checked);
    const isExtranjero = this.foreignerCURP();
    const curpControl = this.profileForm.get('curp');
    this.curpAux = '';
    if (isExtranjero) {
      this.profileForm.patchValue({ curp: '' });
      this.profileForm.patchValue({ dateOfBirth: '' });
      curpControl?.disable();
      this.dataAux = 'NE'
      this.profileForm.patchValue({ stateOfBirth: '' });
      this.profileForm.patchValue({ nationality: '' });
      this.profileForm.patchValue({ countryOfBirth: '' });
      this.profileForm.patchValue({ dateOfBirth: '' });
    } else {
      this.profileForm.patchValue({ typeIden: AllowedValuesRfcNifTinNss.RFC });
      this.profileForm.patchValue({ gender: '' });
      this.profileForm.patchValue({ nationality: STRINGS.MEXICAN });
      this.profileForm.patchValue({ countryOfBirth: STRINGS.MEXICO });
      this.profileForm.patchValue({ stateOfBirth: '' });
      this.dataAux = ''
      curpControl?.enable();
    }
  }

  async onSubmit() {

    const ppeSection = this.ppeSectionComponent.onSubmit();
    console.log(ppeSection);
    const generalData = this.client();
    const addresData = await this.addressSectionComponent.onSubmit();
    if (ppeSection != null && generalData != null && addresData != null && !this.validadorForm()) {
      if (generalData.field && generalData.field !== '') {
        try {
          const fielValue = generalData.field;
          console.log("Validando FIEL...");

          const isValid = await firstValueFrom(
            this.fielValidationService.validateFiel('fielValidation', {
              certificateNumber: fielValue
            })
          );

          if (isValid.certificateStatus == SUCCESS_MESSAGES.VALID_FIEL) {
            console.log('fiel válida')
            console.log('colocando fecha')
            console.log(isValid.maturityDate)
            this.profileForm.patchValue({
              expirationDateField: convertDateBack(isValid.maturityDate)
            })
          } else {
            this.notificationService.error(ERROR_MESSAGES.INVALID_FIEL);
            return;
          }
          console.log('FIEL OK');
        } catch (err) {
          console.log("Error validando FIEL", err);
          return;
        }
      }
      document.body.classList.remove('show-validation');
      const data: ResourceProviderData = {
        generalData: generalData,
        ppe: ppeSection,
        adrres: addresData
      }
      if (!this.isMaintenance) {
        this.checkpointService.saveSection('resources-provider', mapToCheckPointResourceProvider(data)).subscribe((result) => {
          if (result['status'] === "CREATED") {
            this.resourceProviderService.setItem(data);
            this.unsavedChangesService.setUnsavedChanges(false);
            this.notificationService.success('Guardado con éxito');
          } else {

          }
        });
      } else {
        this.checkpointService.saveSectionMant('resources-provider', mapToCheckPointResourceProviderMant(data, this.resourceProviderService.getItemCopy())).subscribe(async (result) => {
          if (result['status'] === "CREATED") {
            await this.update();
            this.unsavedChangesService.setUnsavedChanges(false);
            this.notificationService.success('Guardado con éxito');
          }
        });
      }
    }
  }


  onSelectionChangeTypeIden(event: MatRadioChange<any>) {
    const countryTaxCodeAbroad = this.profileForm.get('countryTaxCodeAbroad');
    if (event.value === "2" || event.value === "3" || event.value === "4") {
      this.typeIden.set(true);
      countryTaxCodeAbroad?.setValidators(Validators.required);
    }
    if (event.value === "1") {
      this.typeIden.set(false);
      countryTaxCodeAbroad?.clearValidators();
    }
  }

  //Function to customize the validation of the date of birth
  dateValidator(control: AbstractControl): ValidationErrors | null {
    const date = new Date(control.value);
    const today = new Date();
    const dateMini = new Date('1900-01-01');
    const ageMini = 18;
    if (isNaN(date.getTime())) {
      return { dateInvalid: true };
    }
    if (date < dateMini) {
      return { dateVeryOld: true };
    }
    const age = today.getFullYear() - date.getFullYear();
    const birthdayThisYear = new Date(today.getFullYear(), date.getMonth(), date.getDate()) <= today;
    // if (age < ageMini || (age === ageMini && !birthdayThisYear)) {
    //   return { underage: true };
    // }
    if (date > today) {
      return { underage: true };
    }
    return null;
  }

  //Function to convert the curp to uppercase
  toUppercaseCURP(controlName: string): void {
    const control = this.profileForm.get(controlName);
    if (control) {
      const upperValue = control.value?.toUpperCase();
      control.setValue(this.replaceLetter(upperValue), { emitEvent: false });
    }
  }

  //Function to convert the data to uppercase
  toUppercase(controlName: string): void {
    const control = this.profileForm.get(controlName);
    if (control) {
      const upperValue = control.value?.toUpperCase();
      control.setValue(this.replaceVowels(upperValue), { emitEvent: false });
    }
  }


  allowAlphanumericOnly(event: KeyboardEvent): void {
    const regex = /^[a-zA-Z0-9]$/;
    const key = event.key;
    if (!regex.test(key)) {
      event.preventDefault();
    }
  }

  allowNumericOnly(event: KeyboardEvent): void {
    const regex = /^[0-9]$/;
    const key = event.key;
    if (!regex.test(key)) {
      event.preventDefault();
    }
  }

  //Function to obtain the RFC
  getRFC(rfc: string, curp: string): string {
    return curp.substring(0, 10) + rfc.substring(10, 13)
  }

  validCurp = false;
  async loadCurpDataService(): Promise<void> {
    if (REGEX.CURP_VALIDATION.test(this.profileForm.getRawValue().curp) && this.profileForm.getRawValue()?.curp?.substring(11, 13) != STRINGS.FOREIGN) {
      let dataCurp: CurpValidationResponse = {
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
          birthState: null
        }
      };
      if (this.profileForm.getRawValue().curp != this.curpAux) {
        try {
          dataCurp = await lastValueFrom(this.validCurpService.postData({
            curp: this.profileForm.getRawValue().curp
          }))
        } catch (error) {
          dataCurp = {
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
              birthState: null
            }
          }
        }
        this.curpAux = this.profileForm.getRawValue().curp;
        this.foreign.set(false);
        this.profileForm.patchValue({ nationality: STRINGS.MEXICAN });
        this.profileForm.patchValue({ countryOfBirth: STRINGS.MEXICO });
        if (dataCurp.status === 200 && dataCurp.payload.result) {
          this.profileForm.patchValue({ dateOfBirth: formatDateYYYYMMDD(dataCurp.payload.birthDate ?? '') });
          this.profileForm.patchValue({ firstLastName: dataCurp.payload.lastName });
          this.profileForm.patchValue({ secondLastName: dataCurp.payload.secondLastName });
          this.profileForm.patchValue({ gender: dataCurp.payload.gender });
          this.profileForm.patchValue({ stateOfBirth: dataCurp.payload.birthStateCode });
          const result = countSpaces(dataCurp.payload.names?.trim() || '');
          let names = dataCurp.payload.names?.trim().split(' ') ?? [];
          switch (result) {
            case 1:
              this.profileForm.patchValue({ firstName: names[0] });
              break;
            case 2:
              this.profileForm.patchValue({ firstName: names[0] });
              this.profileForm.patchValue({ middleName: names[1] });
              break;
            case 3:
              this.profileForm.patchValue({ middleName: dataCurp.payload.names?.trim() });
              break;
            default:
          }
          if (REGEX.RFC_VALIDATION.test(this.profileForm.getRawValue().rfc)) {
            this.profileForm.patchValue({ rfc: this.getRFC(this.profileForm.getRawValue().rfc, dataCurp.payload.curp ?? '') });
          } else {
            this.profileForm.patchValue({ rfc: dataCurp.payload.curp?.substring(0, 10) });
          }
          this.validCurp = true;
        } else if (dataCurp.status === 200 && !dataCurp.payload.result) {
          await this.notificationModalService.warning({
            title: 'CURP No Localizado',
            afterMessages: ['Captura la Información Manualmente'],
            btnAccept: "Aceptar"
          });
          this.loadCurpData();
          this.validCurp = true;
        } else if (dataCurp.status != 200 && dataCurp.status === 0) {
          this.notificationService.error('Captura la Información del Cliente Manualmente');
          this.loadCurpData();
          this.validCurp = true;
        }
      }
    } else if (REGEX.CURP_VALIDATION.test(this.profileForm.getRawValue().curp) && this.profileForm.getRawValue()?.curp?.substring(11, 13) === STRINGS.FOREIGN && this.profileForm.getRawValue().curp != this.curpAux) {
      this.loadCurpData();
      this.validCurp = true;
      this.curpAux = this.profileForm.getRawValue().curp;
    } else if (!REGEX.CURP_VALIDATION.test(this.profileForm.getRawValue().curp)) {
      this.clear();
      this.notificationService.error('Ingresa una CURP Válida.');
      this.validCurp = false;
      this.curpAux = this.profileForm.getRawValue().curp;
    }
  }

  clear(): void {
    this.profileForm.patchValue({ dateOfBirth: '' });
    this.profileForm.patchValue({ firstLastName: '' });
    this.profileForm.patchValue({ secondLastName: '' });
    this.profileForm.patchValue({ gender: '' });
    this.profileForm.patchValue({ stateOfBirth: '' });
    this.profileForm.patchValue({ firstName: '' });
    this.profileForm.patchValue({ middleName: '' });
    this.profileForm.patchValue({ rfc: '' });
  }

  //Function to fill fields through the CURP
  loadCurpData(): void {
    this.clear();
    if (REGEX.CURP_VALIDATION.test(this.profileForm.getRawValue().curp)) {
      let dCurp: string = this.profileForm.getRawValue().curp;
      this.profileForm.patchValue({ gender: dCurp.charAt(10) });
      this.profileForm.patchValue({ dateOfBirth: this.getDateOfBirthFromCURP(dCurp) });
      if (REGEX.RFC_VALIDATION.test(this.profileForm.getRawValue().rfc)) {
        this.profileForm.patchValue({ rfc: this.getRFC(this.profileForm.getRawValue().rfc, dCurp) });
      } else {
        this.profileForm.patchValue({ rfc: dCurp.substring(0, 10) });
      }
      this.dataAux = dCurp.substring(11, 13)
      if (dCurp.substring(11, 13) != STRINGS.FOREIGN) {
        if (searchState(dCurp.substring(11, 13), this.states()) != '') {
          this.profileForm.patchValue({ stateOfBirth: dCurp.substring(11, 13) });
          this.foreign.set(false);
          this.profileForm.patchValue({ nationality: STRINGS.MEXICAN });
          this.profileForm.patchValue({ countryOfBirth: STRINGS.MEXICO });
        } else {
          this.profileForm.patchValue({ stateOfBirth: '' });
        }
      }
      else {
        this.foreign.set(true);
        this.profileForm.patchValue({ nationality: '' });
        this.profileForm.patchValue({ countryOfBirth: '' });
        this.profileForm.patchValue({ stateOfBirth: '' });
      }
    }
  }

  //function to obtain date of birth
 getDateOfBirthFromCURP(curp: string): Date | null {
    if (!curp || curp.length < 18) {
      return null;
    }

    const yearPart = curp.substring(4, 6);
    const monthPart = curp.substring(6, 8);
    const dayPart = curp.substring(8, 10);

    const year = Number(yearPart);
    const month = Number(monthPart);
    const day = Number(dayPart);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      return null;
    }

    const leter = /^[aA-zZ]$/.test(curp.substring(16,17));
    const fullYear = leter
      ? 2000 + year
      : 1900 + year;

    return new Date(fullYear, month - 1, day);
  }


  //function to validate information and CURP
  validationDataFormDataCURP(): boolean {
    if (this.validationDataCurp().substring(0, 6) !== this.profileForm.get('curp')?.value.toString().substring(4, 10)) {
      const controlDate = this.profileForm.get('dateOfBirth');
      controlDate?.setErrors({ invalidFormat: true });
      controlDate?.markAsTouched();
      this.notificationService.error('La CURP y la Fecha Nacimiento no coinciden.')
      return true;
    }
    if (this.validationDataCurp().substring(7, 9) !== this.profileForm.get('curp')?.value.toString().substring(11, 13) && !this.foreign()) {
      const controlfederative = this.profileForm.get('stateOfBirth');
      controlfederative?.setErrors({ invalidFormat: true });
      controlfederative?.markAsTouched();
      this.notificationService.error('La CURP y la Entidad Federativa de Nacimiento no coinciden.');
      return true;
    }
    else {
      return false;
    }
  }

  //function to generate CURP from the information
  validationDataCurp(): string {
      const dobValue = this.profileForm.get('dateOfBirth')?.value;
      const gender = this.profileForm.get('gender')?.value;
      const state = this.profileForm.get('stateOfBirth')?.value;
  
      if (!dobValue || !gender) {
        return '';
      }
  
      const dob = moment(dobValue);
  
      if (!dob.isValid()) {
        return '';
      }
  
      const year = dob.format('YY');
      const month = dob.format('MM');
      const day = dob.format('DD');
  
      const curpDate = `${year}${month}${day}`;
      return curpDate + gender + state;
    }

  //function to replace accented vowels
  replaceVowels(text: string): string {
    return text.replace(/[áÁ]/g, "A")
      .replace(/[éÉ]/g, "E")
      .replace(/[íÍ]/g, "I")
      .replace(/[óÓ]/g, "O")
      .replace(/[úÚ]/g, "U");
  }

  //function to replace the letter ñ with x in the curp
  replaceLetter(text: string): string {
    return text.replace(/[ñÑ]/g, "X");
  }

  //function to separate the date
  getDate(text: string): string {
    return text.substring(2, 4)
      + text.substring(5, 7)
      + text.substring(8, 10);
  }

  //function to search for the letter in surnames
  lettersCURP(letter: string, text: string): string {
    if (text.includes(letter)) {
      return letter;
    }
    return letter === 'X' ? 'X' : ' ';
  }

  //function to search for the letter in the name
  lettersNameCURP(letter: string, text: string, name: string): string {
    if (text.includes(letter) || name.includes(letter)) {
      return letter;
    }
    return ' ';
  }

  //function to detonate error
  error(): void {
    Object.values(this.profileForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsTouched();
      }
    });
  }

  validador(): boolean {
    const isExtranjero = this.foreignerCURP();

    const state = this.profileForm.get('stateOfBirth');

    const { curp, foreignerWithoutCurp } = this.profileForm.getRawValue();
    const isCurpValid =
      curp?.length === 18 &&
      curp.substring(11, 13) !== STRINGS.FOREIGN;

    const validP1 = isCurpValid;

    const validP2 =
      foreignerWithoutCurp === false &&
      isCurpValid;
    if (validP1 && validP2) {
      state?.setValidators([Validators.required]);
    } else {
      state?.clearValidators();
    }

    document.body.classList.add('show-validation');
    Object.keys(this.profileForm.controls).forEach(controlName => {
      const control = this.profileForm.get(controlName);
      control?.updateValueAndValidity();
    });
    if (
      this.profileForm.getRawValue().rfc?.trim() === ''
      || this.profileForm.getRawValue().gender?.trim() === '' || this.profileForm.getRawValue().gender === null
      || this.profileForm.getRawValue().firstName?.trim() === ''
      || (this.profileForm.getRawValue().dateOfBirth?.value === '' || this.profileForm.getRawValue().dateOfBirth === null || this.profileForm.getRawValue().dateOfBirth === undefined)
      || ((this.profileForm.getRawValue().stateOfBirth?.trim() ?? '') === '' && (validP1 && validP2))
      || this.profileForm.getRawValue().nationality?.trim() === ''
      || this.profileForm.getRawValue().countryOfBirth?.trim() === ''
      || this.profileForm.getRawValue().typeIden?.trim() === ''
    ) {
      this.error();
      this.notificationService.error('Faltan Campos Obligatorios por Capturar');
      return true;
    }
    if (this.typeIden() === true && this.profileForm.getRawValue().countryTaxCodeAbroad?.trim() === '') {
      this.error();
      this.notificationService.error('Faltan Campos Obligatorios por Capturar');
      return true;
    }
    if (!isExtranjero) {
      if ((!this.profileForm.get('curp')?.valid || !this.validCurp) && !this.profileForm.get('curp')?.disabled) {
        const controlCurp = this.profileForm.get('curp');
        controlCurp?.setErrors({ invalidFormat: true });
        controlCurp?.markAsTouched();
        this.error();
        this.notificationService.error('Ingresa una CURP Válida.');
        return true;
      }
    }
    if (this.profileForm.getRawValue().rfc?.trim() != '') {
      if (!REGEX.RFC_VALIDATION.test(this.profileForm.get('rfc')?.value) && this.profileForm.getRawValue().typeIden === "1" && !this.profileForm.get('rfc')?.disabled) {
        const controlRfc = this.profileForm.get('rfc');
        controlRfc?.setErrors({ invalidFormat: true });
        controlRfc?.markAsTouched();
        this.error();
        this.notificationService.error('Tienes Campos Capturados con Formato Incorrecto')
        return true;
      } else if (this.profileForm.getRawValue().typeIden === "1" && !validateRFCMonth(this.profileForm.get('rfc')?.value)) {
        console.log(this.profileForm.get('rfc')?.value)
        const controlRfc = this.profileForm.get('rfc');
        controlRfc?.setErrors({ invalidFormat: true });
        controlRfc?.markAsTouched();
        this.error();
        this.notificationService.error('El Mes en el RFC es Invalido. ')
        return true;
      } else if (this.profileForm.getRawValue().typeIden === "1" && !validateRFCDay(this.profileForm.get('rfc')?.value)) {
        console.log(this.profileForm.get('rfc')?.value)
        const controlRfc = this.profileForm.get('rfc');
        controlRfc?.setErrors({ invalidFormat: true });
        controlRfc?.markAsTouched();
        this.error();
        this.notificationService.error('El Día Indicado en el RFC es Invalido ya que no Coincide con el Mes.')
        return true;
      } else if ((!REGEX.NIF_TIN_NSS_VALIDATION.test(this.profileForm.get('rfc')?.value) && (this.profileForm.getRawValue().typeIden === "2" ||
        this.profileForm.getRawValue().typeIden === "3" ||
        this.profileForm.getRawValue().typeIden === "4") && !this.profileForm.get('rfc')?.disabled)) {
        const controlRfc = this.profileForm.get('rfc');
        controlRfc?.setErrors({ invalidFormat: true });
        controlRfc?.markAsTouched();
        this.error();
        this.notificationService.error('Tienes Campos Capturados con Formato Incorrecto')
        return true;
      }
    }
    if (!this.profileForm.get('firstName')?.valid && !this.profileForm.get('firstName')?.disabled) {
      this.error();
      this.notificationService.error('Ingresa un Nombre Válido.')
      return true;
    }
    if (!this.profileForm.get('middleName')?.valid && !this.profileForm.get('middleName')?.disabled) {
      this.error();
      this.notificationService.error('Ingresa un Segundo Nombre Válido.');
      return true;
    }
    const firstLastName = this.profileForm.getRawValue().firstLastName;
    const firstLastNameValue = firstLastName?.trim();
    const secondLastName = this.profileForm.getRawValue().secondLastName;
    const secondLastNameValue = secondLastName?.trim();
    if ((firstLastNameValue == null || firstLastNameValue === '')
      &&
      (secondLastNameValue == null || secondLastNameValue === '')) {
      const controlSApellido = this.profileForm.get('secondLastName');
      controlSApellido?.setErrors({ invalidFormat: true });
      controlSApellido?.markAsTouched();
      const controlPApellido = this.profileForm.get('firstLastName');
      controlPApellido?.setErrors({ invalidFormat: true });
      controlPApellido?.markAsTouched();
      this.notificationService.error('Ingresa al Menos un Apellido.');
      return true;
    }
    if (!this.profileForm.get('firstLastName')?.valid && !this.profileForm.get('firstLastName')?.disabled) {
      const controlPApellido = this.profileForm.get('firstLastName');
      controlPApellido?.setErrors({ invalidFormat: true });
      controlPApellido?.markAsTouched();
      this.notificationService.error('Ingresa Primer Apellido Válido.');
      return true;
    }
    if (!this.profileForm.get('secondLastName')?.valid && !this.profileForm.get('secondLastName')?.disabled) {
      const controlPApellido = this.profileForm.get('secondLastName');
      controlPApellido?.setErrors({ invalidFormat: true });
      controlPApellido?.markAsTouched();
      this.notificationService.error('Ingresa Segundo Apellido Válido.');
      return true;
    }
    if (!this.profileForm.get('dateOfBirth')?.valid && !this.profileForm.get('dateOfBirth')?.disabled) {
      this.error();
      this.notificationService.error('Fecha de Nacimiento no Válida')
      return true;
    }
    if (this.validationDataCurp() != undefined && !this.foreignerCURP()) {
      return this.validationDataFormDataCURP();
    }
    if (isExtranjero) {
      return false;
    }
    return true;
  }

  validadorForm(): boolean {
    document.body.classList.add('show-validation');
    Object.keys(this.profileForm.controls).forEach(controlName => {
      const control = this.profileForm.get(controlName);
      control?.updateValueAndValidity();
    });
    if (
      this.profileForm.getRawValue().economicActivity?.trim() === ''
      || this.profileForm.getRawValue().relationship?.trim() === ''
      || this.profileForm.getRawValue().phone?.trim() === ''
      || this.profileForm.getRawValue().mail?.trim() === ''
    ) {
      this.error();
      this.notificationService.error('Faltan Campos Obligatorios por Capturar');
      return true;
    }
    if (!REGEX.PHONE_VALIDATION.test(this.profileForm.get('phone')?.value)) {
      const controlPhone = this.profileForm.get('phone');
      controlPhone?.setErrors({ invalidFormat: true });
      controlPhone?.markAsTouched();
      this.error();
      this.notificationService.error('Tienes Campos Capturados con Formato Incorrecto')
      return true;
    }
    if (!REGEX.MAIL_VALIDATION.test(this.profileForm.get('mail')?.value)) {
      const controlMail = this.profileForm.get('mail');
      controlMail?.setErrors({ invalidFormat: true });
      controlMail?.markAsTouched();
      this.error();
      this.notificationService.error('Tienes Campos Capturados con Formato Incorrecto')
      return true;
    }
    return false;
  }

  getDataClient(): DataClient {
    const data: ResourceProvider = this.client();
    const dataBody: DataClient = {
      ppe: false,
      bankAreaTypeId: '',
      contraTypeId: '',
      typeContractSubtypeId: '',
      curp: data.curp,
      foreignerWithoutCurp: data.foreignerWithoutCurp,
      typeIden: data.typeIden,
      rfc: data.rfc,
      dateOfBirth: data.dateOfBirth,
      nationality: data.nationality,
      countryOfBirth: data.countryOfBirth,
      stateOfBirth: '',
      firstName: data.firstName,
      middleName: data.middleName,
      firstLastName: data.firstLastName,
      secondLastName: data.secondLastName
    };
    return dataBody;
  }

  async submit(): Promise<void> {
    if (!this.validador()) {
      document.body.classList.remove('show-validation');
      this.curpAux = '';
      let respHom = await this.searchClientFlowService.validInHomonyms(this.getDataClient(), this.thirdRelated);
      if (respHom.passOnHomonyms) {
        if(this.isMaintenance){
          return ;
        }else{
          this.searchForActions('normalFlow');
          this.searchClientFlowService.validInWatchList(this.getDataClient());
        }
      } else if (respHom.numberClient) {
        this.customerInformationService.getCustomerInfo(respHom.numberClient ?? 0).subscribe(async data => {
          this.setClientData(this.mapToResourceProvider(data));
          const resp = await this.searchClientFlowService.validInWatchList(this.getDataClient(), respHom?.numberClient?.toString());
          if (resp) {
            this.notificationService.success('Se Continua con el Cliente: ' + respHom?.numberClient);
            this.searchForActions('homonymy');
            this.unsavedChangesService.setUnsavedChanges(true);
          }
        });
        buttonFunctionEn(['btnSave']);
      }
    }
  }

  clearForm() {
    this.searchForActions('clear');
  }

  removeExtraSpaces(text: string) {
    return text.replace(REGEX.MULTIPLE_SPACES, ' ');
  }

  findValueIn = (list: WatchList): boolean => {
    return list.matchLists.some((item: { type: string; }) => item.type.toLocaleUpperCase() === 'PPE');
  }


  getListValues = (list?: WatchList) => list?.matchLists?.map(item => item.type) || [];

  setClientData(data: ResourceProviderData) {
    const countryTaxCodeAbroad = this.profileForm.get('countryTaxCodeAbroad');
    if (data) {
      this.validCurp = validCurp(data.generalData.curp || '', data.generalData.foreignerWithoutCurp || false);
      this.curpAux = data.generalData.curp ?? '';
      this.dataAux = data.generalData.curp?.toUpperCase().substring(11, 13);
      this.profileForm.patchValue({ curp: data.generalData.curp.toUpperCase() });
      if (data.generalData.curp?.toUpperCase().substring(11, 13) === STRINGS.FOREIGN) {
        this.foreign.set(true);
        this.dataAux = 'NE'
        const curpControl = this.profileForm.get('curp');
        curpControl?.disable();
      }
      if (data.generalData.foreignerWithoutCurp === true) {
        this.foreignerCURP.set(true);
        this.dataAux = 'NE'
        const curpControl = this.profileForm.get('curp');
        curpControl?.disable();
      }
      if (data.generalData.typeIden?.toUpperCase() === "2"
        || data.generalData.typeIden?.toUpperCase() === "3"
        || data.generalData.typeIden?.toUpperCase() === "4") {
        this.typeIden.set(true);
        countryTaxCodeAbroad?.setValidators(Validators.required);
      } else {
        this.typeIden.set(false);
        countryTaxCodeAbroad?.clearValidators();
      }
      this.profileForm.patchValue({
        foreignerWithoutCurp: data.generalData.foreignerWithoutCurp,
        rfc: data.generalData.rfc?.toUpperCase(),
        firstName: data.generalData.firstName?.toUpperCase(),
        middleName: data.generalData.middleName?.toUpperCase(),
        dateOfBirth: data.generalData.dateOfBirth,
        firstLastName: data.generalData.firstLastName?.toUpperCase(),
        secondLastName: data.generalData.secondLastName?.toUpperCase(),
        gender: data.generalData.gender,
        nationality: data.generalData.nationality?.toUpperCase(),
        countryOfBirth: data.generalData.countryOfBirth?.toUpperCase(),
        stateOfBirth: data.generalData.stateOfBirth?.toUpperCase(),
        curp: data.generalData.curp?.toUpperCase(),
        countryTaxCodeAbroad: data.generalData.countryTaxCodeAbroad?.toUpperCase(),
        typeIden: data.generalData.typeIden?.toUpperCase(),
        typePerson: data.generalData.typePerson?.toUpperCase(),
        relationship: data.generalData.relationship?.toUpperCase(),
        field: data.generalData.field?.toUpperCase(),
        phone: data.generalData.phone,
        mail: data.generalData.mail?.toUpperCase(),
        economicActivity: data.generalData.economicActivity?.toUpperCase(),
        expirationDateField: data.generalData.expirationDateField
      });
      this.addressSectionComponent.setAddresData(data.adrres);
      this.ppeSectionComponent.setDataRealOwnerPPE(data.ppe);
    } else {
      this.profileForm.patchValue({ gender: '', nationality: STRINGS.MEXICAN, countryOfBirth: STRINGS.MEXICO });
    }
  }


  mapToResourceProvider(data: CustomerInformation): ResourceProviderData {
    return {
      generalData: {
        curp: data.initialData?.curp ?? '',
        foreignerWithoutCurp: data.initialData?.foreignerWithoutCurp ?? false,
        typeIden: compareAndReturnIdRfcNifTinNss(data.initialData?.rfc ?? '', data.initialData?.nif ?? '', data.initialData?.tin ?? '', data.initialData?.nss ?? ''),
        rfc: compareAndReturnValueRfcNifTinNss(data.initialData?.rfc ?? '', data.initialData?.nif ?? '', data.initialData?.tin ?? '', data.initialData?.nss ?? ''),
        firstName: data.initialData?.firstName ?? '',
        middleName: data.initialData?.middleName ?? '',
        dateOfBirth: formatDateYYYYMMDD(data.initialData?.dateOfBirth ?? ''),
        firstLastName: data.initialData?.firstLastName ?? '',
        secondLastName: data.initialData?.secondLastName ?? '',
        gender: compareGenderAndReturnValue(Number(data.initialData?.gender) ?? 0),
        nationality: data.initialData?.nationality ?? '',
        countryOfBirth: data.initialData?.countryOfBirth ?? '',
        stateOfBirth: data.initialData?.stateOfBirth ?? '',
        countryTaxCodeAbroad: '',
        typePerson: '1',
        relationship: '',
        field: data.generalInformation?.fiel ?? '',
        phone: ((data?.telephones?.length ?? 0) > 0) ? data?.telephones?.[0]?.phone?.toString() ?? '' : '',
        mail: ((data?.emails?.length ?? 0) > 0) ? data?.emails?.[0]?.emailAddress?.toString() ?? '' : '',
        economicActivity: data.generalInformation?.economicActivity ?? '',
        expirationDateField: data.generalInformation?.fielExpirationDate ?? '',
      },
      ppe: {
        ppe: data.ppeInformation?.ppe || false,
        tppe: data.ppeInformation?.ppeType || '',
        positionHeld: data.ppeInformation?.positionHeld || '',
        expirationDate: data.ppeInformation?.expirationDate || '',
        fppe: data.ppeInformation?.hasFamilyPpe || false,
        dataFamily: data.ppeInformation?.familyData?.map((fam: CI_FamilyData) => {
          return {
            curp: fam.curp || '',
            foreignerWithoutCurp: fam.foreignerWithoutCurp || false,
            typeIden: compareAndReturnIdRfcNifTinNss(fam.rfc || '', fam.nif || '', fam.tin || '', fam.nss || ''),
            rfc: compareAndReturnValueRfcNifTinNss(fam.rfc || '', fam.nif || '', fam.tin || '', fam.nss || ''),
            firstName: fam.firstName || '',
            middleName: fam.middleName || '',
            dateOfBirth: formatDateYYYYMMDD(fam.dateOfBirth || ''),
            firstLastName: fam.firstLastName || '',
            secondLastName: fam.secondLastName || '',
            nationality: fam.nationality || '',
            countryOfBirth: fam.countryOfBirth || '',
            countryTaxCodeAbroad: '',
            chargeDueDate: fam.positionHeldEndDate || '',
            relationship: fam.relationship?.toString() || '',
            positionHeld: fam.positionHeld || '',
            isView: true,
            isSaved: true,
          }
        }) || []
      },
      adrres: {
        addressType: data.addresses?.[0]?.addressType || '',
        other: data.addresses?.[0]?.other || '',
        country: data.addresses?.[0]?.country || '',
        postalCode: data.addresses?.[0]?.postalCode?.toString() || '',
        federalEntity: data.addresses?.[0]?.federalEntity || '',
        city: data.addresses?.[0]?.city || '',
        municipality: data.addresses?.[0]?.municipality || '',
        neighborhood: data.addresses?.[0]?.neighborhood?.toString() || '',
        street: data.addresses?.[0]?.street || '',
        externalNumber: data.addresses?.[0]?.externalNumber?.toString() || '',
        internalNumber: data.addresses?.[0]?.internalNumber?.toString() || ''
      }
    }
  }

  searchForActions(input: FormFlow) {
    const country =  this.addressSectionComponent.profileForm.get('country')?.value;
    switch (input) {
      case "initialFlow":
        formFunctionDisMatch(this.profileForm, ['relationship', 'economicActivity', 'field', 'mail', 'phone', 'expirationDateField']);
        formFunctionDis(this.addressSectionComponent.profileForm);
        formFunctionDis(this.ppeSectionComponent.profileForm);
        this.isOnboarding = true;
        break;
      case "normalFlow":
        formFunctionEnAll(this.profileForm);
        formFunctionDis(this.profileForm, ['relationship', 'economicActivity', 'field', 'mail', 'phone']);
        formFunctionEnAll(this.addressSectionComponent.profileForm, ['federalEntity', 'city', 'municipality']);
        this.addressSectionComponent.enableDisableFECityMun(country);
        formFunctionEnAll(this.ppeSectionComponent.profileForm);
        butonFunctionDis(['btnValid', 'search']);
        this.isOnboarding = false;
        this.unsavedChangesService.setUnsavedChanges(true);
        break;
      case "searchOfRequest":
        if(this.isMaintenance ){
          this.edittMant();
        } else {
          formFunctionEnAll(this.profileForm);
          formFunctionDisMatch(this.profileForm, ['relationship', 'economicActivity', 'field', 'mail', 'phone', 'expirationDateField']);
          formFunctionDis(this.addressSectionComponent.profileForm);
          formFunctionDis(this.ppeSectionComponent.profileForm);
          butonFunctionDis(['btnValid', 'search']);
        }
        this.isOnboarding = false;
        this.unsavedChangesService.setUnsavedChanges(true);
        break;
      case "homonymy":
        if(this.isMaintenance ){
          this.edittMant();
        } else {
          formFunctionEnAll(this.profileForm);
          formFunctionDisMatch(this.profileForm, ['relationship', 'economicActivity', 'field', 'mail', 'phone', 'expirationDateField']);
          formFunctionDis(this.addressSectionComponent.profileForm);
          formFunctionDis(this.ppeSectionComponent.profileForm);
          butonFunctionDis(['btnValid', 'search']);
        }
        this.isOnboarding = false;
        this.unsavedChangesService.setUnsavedChanges(true);
        break;
      case "clear":
        if (this.profileForm.getRawValue().foreignerWithoutCurp === true || this.profileForm.getRawValue().curp?.toUpperCase().substring(11, 13) === STRINGS.FOREIGN) {
          formFunctionEnAll(this.profileForm, ['curp']);
        } else {
          formFunctionEnAll(this.profileForm);
        }
        formFunctionDisMatch(this.profileForm, ['relationship', 'economicActivity', 'field', 'mail', 'phone', 'expirationDateField']);
        formFunctionDis(this.addressSectionComponent.profileForm);
        formFunctionDis(this.ppeSectionComponent.profileForm);
        this.profileForm.patchValue({ typeIden: AllowedValuesRfcNifTinNss.RFC });
        this.isOnboarding = true;
        buttonFunctionEn(['btnValid', 'search']);
        butonFunctionDis(['btnSave']);
        this.profileForm.patchValue({
          typePerson: '1'
        });
        document.body.classList.remove('show-validation');
        break;
      default:
        break;
    }
  }

  //function to map to DataClient
  client = (): ResourceProvider => this.profileForm.getRawValue() as ResourceProvider;

  private readonly searchClientService = inject(ModalSearchClientService);
  async searchClient() {
    const result = await this.searchClientService.searchClient();
    if (result != null) {
      this.customerInformationService.getCustomerInfo(result.clientNumber ?? 0).subscribe(async data => {
        this.setClientData(this.mapToResourceProvider(data));
        const resp = await this.searchClientFlowService.validInWatchList(this.getDataClient(), result?.clientNumber?.toString());
        if (resp) {
          this.notificationService.success('Se Continua con el Cliente: ' + result?.clientNumber);
          this.searchForActions('searchOfRequest');
          this.unsavedChangesService.setUnsavedChanges(true);
        }
      });
    } else {
      this.searchForActions('initialFlow');
    }

    console.log(result);
  }
  onDateInput(event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
    const date = event.value;
    console.log(date);
    const control = this.profileForm.get('dateOfBirth');

    if (date instanceof Date && control && this.pickerBirthdate) {
      this.pickerBirthdate.select(date); 
    }
  }

  async update(){
    const response = await firstValueFrom(this.checkpointService.getMaintenanceSectionByPersonaFisica(['real-owner']));
    const resInfo = mapToSignalResourceProviderMant(response['checkpoints'][0]['data']);
    this.resourceProviderService.setItem(resInfo);
    this.resourceProviderService.setItemCopy(resInfo);
    this.data = this.resourceProviderService.getItem();
    if(this.data){
      this.setClientData(this.data);
    }
  }
}
