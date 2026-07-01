import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { Router, ActivatedRoute } from '@angular/router';
import { startWith, map, lastValueFrom } from 'rxjs';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { AddressSectionComponent } from '../../../shared/components/sections/address-section/address-section.component';
import { PpeSectionComponent } from '../../../shared/components/sections/ppe-section/ppe-section.component';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { HomonymsService } from '../../../shared/services/homonyms.service';
import { ModalFormService } from '../../../shared/services/modal-form.service';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { RealOwnerService } from '../../../shared/services/storage-services/real-owner.service';
import { WatchlistService } from '../../../shared/services/watchlist.service';
import { formatDateYYYYMMDD, yearsAgo, yearsAgoLegacy } from '../../../shared/utils/datetime';
import { compareAndReturnRfcNifTinNss, AllowedValuesRfcNifTinNss } from '../../../shared/utils/map-rfc-nif-tin-nss';
import { REGEX, STRINGS } from '../../constants/constants';
import { Countries } from '../../models/country';
import { CustomerWatchListResponse, CustomerWatchListBody, WatchList } from '../../models/customer-watch-list';
import { Entity } from '../../models/entity';
import { HomonymsResponse, HomonymsRequest } from '../../models/homonyms';
import { Nationalities } from '../../models/nationality';
import { RealOwnerData, RealOwner } from '../../models/real-owner';
import { PageEvent } from '@angular/material/paginator';
import { NOTIFICATION_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
import { FiscalSelfDeclarationForm, FiscalSelfDeclarationPageData } from '../../models/fiscal-self-declaration-data';
import { ModalFiscalResidenceComponent } from '../../../shared/components/modals/modal-fiscal-residence/modal-fiscal-residence.component';
import { AdministratorExercisingPfControl, AdministratorExercisingPfControlData, AdministratorExercisingPfControlSaveData, AdministratorExercisingPfControlTable, AdministratorExercisingPfControlTableData, FiscalResidenceAdministratorExercisingPfControl } from '../../models/pm/administrator-exercising-pf-control';
import { mapAdministratorExercisingPfControlData, mapAdministratorExercisingPfControlDataSaveToTable, mapAdministratorExercisingPfControlSave, mapAdministratorExercisingPfControlTable, mapAdministratorExercisingPfControlTableData } from '../../services/mappers/administrator-exercising-pf-control-mapper';
import { AdministratorExercisingPfControlService } from '../../../shared/services/storage-services/pm/administrator-exercising-pf-control.service';
import { configFiscalResidenceModalAdministratorExercisingPfControlComponent } from './config-modal';
import { ModalHomonymsServiceService } from '../../../shared/services/modal-homonyms-service.service';
import { OnboardingService } from '../../services/onboarding.service';
import { PermissionRolService } from '../../../core/services/rol.service';
import { butonFunctionDis, buttonFunctionEn, formFunctionDis, formFunctionDisMatch, formFunctionEn, formFunctionEnAll } from '../../../shared/utils/disableOrEnabled';
import { ConfigDataTable } from '../../../shared/components/table-results/interfaces';
import { searchState } from '../../../shared/utils/search-state';
import { searchPercentSimilarity } from '../../../shared/utils/homonyms-search';
import { CurpValidationResponse } from '../../models/curp-valid';
import { ValidCurpService } from '../../../shared/services/curp-valid/valid-curp.service';
import { countSpaces, validCurp } from '../../../shared/utils/curp-valid';
import { maxDateValidator, minDateValidator } from '../../../shared/utils/validators';
import moment from 'moment';

@Component({
  selector: 'app-administrator-exercising-pf-control',
  standalone: false,
  templateUrl: './administrator-exercising-pf-control.component.html',
  styleUrl: './administrator-exercising-pf-control.component.scss'
})
export class AdministratorExercisingPfControlComponent {

  @ViewChild(AddressSectionComponent) addressSectionComponent!: AddressSectionComponent;
  @ViewChild(ModalFiscalResidenceComponent) modalFiscalResidenceComponent!: ModalFiscalResidenceComponent;

  //Inject
  private readonly catalogService = inject(CatalogsService);
  private readonly fb = inject(FormBuilder);
  readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationsService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly administratorExercisingPfControlService = inject(AdministratorExercisingPfControlService);
  private readonly dataWatchlistService = inject(WatchlistService);
  private readonly dataHomonymService = inject(HomonymsService);
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly modalService = inject(ModalFormService);
  private readonly modalHomonymsServiceService = inject(ModalHomonymsServiceService);
  private readonly onboardingService = inject(OnboardingService);
  isMaintenance: boolean = this.onboardingService.getCurrentInfo().isMaintenance
  isMaintenanceE = signal<boolean>(true);
  private readonly permissionRolService = inject(PermissionRolService);
  private readonly validCurpService = inject(ValidCurpService);

  birthDates = {
      startAt: yearsAgo(18),
      max: new Date(),
      min: yearsAgo(150),
    };
  // variables
  profileForm: FormGroup = this.fb.nonNullable.group({
    curp: [{ value: '', disabled: false }, [Validators.required, Validators.pattern(REGEX.CURP_VALIDATION)]],
    foreignerWithoutCurp: [false],
    rfc: ['', [Validators.required, Validators.pattern(REGEX.RFC_VALIDATION)]],
    firstName: ['', [Validators.required, Validators.pattern(REGEX.FIRST_NAME_VALIDATION)]],
    middleName: ['', [Validators.pattern(REGEX.FIRST_NAME_VALIDATION)]],
    dateOfBirth: ['', [Validators.required, minDateValidator(this.birthDates.min), maxDateValidator(this.birthDates.max)]],
    firstLastName: ['', [Validators.pattern(REGEX.LAST_NAME_VALIDATION)]],
    secondLastName: ['', [Validators.pattern(REGEX.LAST_NAME_VALIDATION)]],
    gender: [{ value: '' }, Validators.required],
    countryOfBirth: ['', Validators.required],
    stateOfBirth: ['', Validators.required],
    phone: ['', Validators.required],
    mail: ['', Validators.required],
    nationality: ['', [Validators.required, Validators.pattern(REGEX.STATE_VALIDATION)]],
    nationalityTwo: ['', [Validators.required, Validators.pattern(REGEX.STATE_VALIDATION)]],
    mexicoResident: [{ value: '' }],
    fiscalResidenceAbroad: [{ value: '' }],
    fatca: [{ value: false, disabled: true }, [Validators.required, Validators.maxLength(4)],],
    crs: [{ value: false, disabled: true }, [Validators.required, Validators.maxLength(4)],]
  });

  //Signals
  nationalities = signal<Nationalities[]>([]);
  countries = signal<Array<Countries>>([]);
  foreignerCURP = signal(false);
  foreign = signal(false);
  states = signal<Entity[]>([]);
  dataFiscalResidencesData = signal<FiscalSelfDeclarationPageData>({
    data: [
    ],
    table: [
    ],
  });

  // variables
  listData: WatchList | undefined;
  listHomonyms: HomonymsResponse[] | undefined;
  data: AdministratorExercisingPfControlData | null = null;
  columns: Array<any> = [];
  dataProfiles: Array<AdministratorExercisingPfControlTable> = [];
  isEditting = false;
  activeEditting = false;
  edittingId = 0;
  idEdit = "";
  dataSave: Array<AdministratorExercisingPfControlSaveData> = [];
  curpAux = '';

  dataAux: any;
  tableData: Array<any> = [];
  columnsFiscalResidences: Array<any> = [];
  configAuto: ConfigDataTable = {
    showPag: false,
    showEditAction: true,
    showDeleteAction: true,
    multipleSelection: false,
    idName: 'tr_tempid',
    singleSelection: { show: false, title: '', propertyName: 'customProperty' },
    showViewAction: false
  };
  configData: ConfigDataTable = {
    showPag: false,
    showEditAction: true,
    showDeleteAction: true,
    multipleSelection: false,
    idName: 'tr_tempid',
    singleSelection: { show: false, title: '', propertyName: 'customProperty' },
    showViewAction: false
  };
  //Constructor
  constructor() {
    document.body.classList.remove('show-validation');
  }

  isNotEmpty(obj: any) {
    return Object.keys(obj).length > 0;
  }

  ngOnInit() {

    const data = this.administratorExercisingPfControlService.get();
    if (data) {
      data.client.forEach((clentData) => {
        this.dataProfiles = [...this.dataProfiles, mapAdministratorExercisingPfControlDataSaveToTable(clentData)];
      });
    }

    this.columnsFiscalResidences = [
      { name: 'registerNo', title: 'Registro No.', show: true, type: 'string' },
      {
        name: 'proofOfAddressType',
        title: 'Residencial Fiscal',
        show: true,
        type: 'string',
      },
      {
        name: 'autentication',
        title: 'Auto-Certifcación',
        show: true,
        type: 'string',
      },
      {
        name: 'proofOfAddressFiscal',
        title: 'Comprobante de Residencia Fiscal',
        show: true,
        type: 'string',
      },
      { name: 'nif', title: 'NIF', type: 'number', show: true },
      { name: 'tin', title: 'TIN', type: 'string', show: true },
      { name: 'nss', title: 'NSS', type: 'string', show: true },
    ];

    this.columns = [
      { name: 'firstName', title: 'Primer Nombre', show: true, type: 'string' },
      { name: 'middleName', title: 'Segundo Nombre', show: true, type: 'string' },
      { name: 'firstLastName', title: 'Primer Apellido', show: true, type: 'string' },
      { name: 'secondLastName', title: 'Segundo Apellido', show: true, type: 'string' },
      { name: 'nationality', title: 'Nacionalidad', show: true, type: 'string' },
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
    this.profileForm.controls['dateOfBirth'].valueChanges.subscribe((value: any) => {
      if (value == null) {
        this.profileForm.controls['dateOfBirth'].setValue("");
      }
    });
    if (this.data && this.isNotEmpty(this.data)) {
      this.validCurp = validCurp(this.data.generalData.curp || '', this.data.generalData.foreignerWithoutCurp || false);
      this.curpAux = this.data.generalData.curp ?? '';
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
        phone: this.data.generalData.phone,
        mail: this.data.generalData.mail?.toUpperCase(),
        nationalityTwo: this.data.generalData.nationalityTwo.toUpperCase(),
        mexicoResident: this.data.generalData.mexicoResident,
        fiscalResidenceAbroad: this.data.generalData.fiscalResidenceAbroad,
        fatca: this.data.generalData.fatca,
        crs: this.data.generalData.crs,
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
    }

    if (this.isMaintenance) {
      this.configAuto = {
        showPag: false,
        showEditAction: true,
        showDeleteAction: false,
        multipleSelection: false,
        idName: 'tr_tempid',
        singleSelection: { show: false, title: '', propertyName: 'customProperty' },
        showViewAction: false
      };
      this.configData = {
        showPag: false,
        showEditAction: true,
        showDeleteAction: false,
        multipleSelection: false,
        idName: 'tr_tempid',
        singleSelection: { show: false, title: '', propertyName: 'customProperty' },
        showViewAction: false
      };
    }
  }
  ngAfterViewInit() {

    this.profileForm.valueChanges.subscribe(() => {
      this.unsavedChangesService.setUnsavedChanges(this.profileForm.dirty);
    });
    if (this.data && this.isNotEmpty(this.data)) {
      this.addressSectionComponent.setAddresData(this.data.adrres);
    }

    if (this.isMaintenance) {
      formFunctionDis(this.profileForm);
      formFunctionDis(this.addressSectionComponent.profileForm);
      if (!this.permissionRolService.getPermissions()['administrator-exercising-pf-control'].allDisabled) {
        this.isMaintenanceE.set(false);
      }
    }
  }

  tableAdministratorMaintenance(edit: boolean, delet: boolean, add: boolean) {
    this.configData = {
      showPag: false,
      showEditAction: edit,
      showDeleteAction: delet,
      multipleSelection: false,
      idName: 'tr_tempid',
      singleSelection: { show: false, title: '', propertyName: 'customProperty' },
      showViewAction: false
    };
    if (add) {
      buttonFunctionEn(['btnAdd', 'btnSaveRes']);
    }
  }

  tableRecidenceAdministratorMaintenance(edit: boolean, delet: boolean, add: boolean) {
    this.configAuto = {
      showPag: false,
      showEditAction: edit,
      showDeleteAction: delet,
      multipleSelection: false,
      idName: 'tr_tempid',
      singleSelection: { show: false, title: '', propertyName: 'customProperty' },
      showViewAction: false
    };
    if (add) {
      buttonFunctionEn(['btnSaveRes']);
    }
  }

  editt() {
    if (this.permissionRolService.getPermissions()['administrator-exercising-pf-control'].allDisabled) {
    } else {
      this.activeEditting = true;
      const permissions = this.permissionRolService.getPermissions()['administrator-exercising-pf-control'].sections.table;
      this.tableAdministratorMaintenance(permissions.edit, permissions.delet, permissions.add);
      buttonFunctionEn(['btnCancel', 'btnSave']);
      butonFunctionDis(['btnEdit']);
    }
  }

  setPermissionsMaintenance() {
    const permissions = this.permissionRolService.getPermissions()['administrator-exercising-pf-control'];
    const s = permissions.sections;

    this.tableRecidenceAdministratorMaintenance(s['general-data'].table.edit, s['general-data'].table.delete, s['general-data'].table.add);

    if (!this.permissionRolService.getPermissions()['administrator-exercising-pf-control'].allDisabled) {
      if (s['table'].edit) {
        buttonFunctionEn(['btnAdd']);
      }

      if (!s['general-data'].allDisabled) {
        if (s['general-data'].fieldsDisabled.length  > 0) {
          formFunctionEnAll(this.profileForm, s['general-data'].fieldsDisabled);
        } else {
          formFunctionEn(this.profileForm, s['general-data'].fieldsEnabled);
        }
      }

      if (!s['address'].allDisabled) {
        formFunctionEnAll(this.addressSectionComponent.profileForm);
        const country =  this.addressSectionComponent.profileForm.get('country')?.value;
        this.addressSectionComponent.enableDisableFECityMun(country);
      }
    }

  }

  cancel() {
    this.activeEditting = false;
    this.isMaintenanceE.set(false);
    this.configAuto = {
      showPag: false,
      showEditAction: false,
      showDeleteAction: false,
      multipleSelection: false,
      idName: 'tr_tempid',
      singleSelection: { show: false, title: '', propertyName: 'customProperty' },
      showViewAction: false
    };
    this.configData = {
      showPag: false,
      showEditAction: true,
      showDeleteAction: false,
      multipleSelection: false,
      idName: 'tr_tempid',
      singleSelection: { show: false, title: '', propertyName: 'customProperty' },
      showViewAction: false
    };
    formFunctionDis(this.profileForm);
    formFunctionDis(this.addressSectionComponent.profileForm);
    const data = this.administratorExercisingPfControlService.get();
    this.dataProfiles = [];
    butonFunctionDis(['btnCancel', 'btnSave', 'btnSaveRes', 'btnAdd']);
    buttonFunctionEn(['btnEdit']);
    if (data) {
      data.client.forEach((clentData) => {
        this.dataProfiles = [mapAdministratorExercisingPfControlDataSaveToTable(clentData)];
      });
    }
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

  clear() {
    const permissions = this.permissionRolService.getPermissions()['administrator-exercising-pf-control'];
    const s = permissions.sections;
    if (this.isMaintenance && !s['general-data'].table.add) {
      butonFunctionDis(['btnAdd']);
    }
    this.profileForm.reset();
    this.addressSectionComponent.profileForm.reset();
    this.addressSectionComponent.resetColonyCP();
    this.addressSectionComponent.ngOnInit();
    this.profileForm.patchValue({ gender: '', nationality: STRINGS.MEXICAN, countryOfBirth: STRINGS.MEXICO });
    this.unsavedChangesService.setUnsavedChanges(true);
    this.dataFiscalResidencesData.set({
      data: [
      ],
      table: [
      ],
    });
    this.tableData = [];
    document.body.classList.remove('show-validation');
  }

  clearFormAdd() {
    this.profileForm.reset();
    this.idEdit = '';
    this.addressSectionComponent.profileForm.reset();
    this.addressSectionComponent.resetColonyCP();
    this.addressSectionComponent.ngOnInit();
    this.profileForm.patchValue({ gender: '', nationality: STRINGS.MEXICAN, countryOfBirth: STRINGS.MEXICO });
    this.dataFiscalResidencesData.set({
      data: [
      ],
      table: [
      ],
    });
    this.tableData = [];
    document.body.classList.remove('show-validation');
  }

  async save() {
    document.body.classList.add('show-validation');
    this.unsavedChangesService.setUnsavedChanges(true);
    const generalData: AdministratorExercisingPfControl | null = await this.submit();
    const addresData = await this.addressSectionComponent.onSubmit();
    const residence = this.dataFiscalResidencesData().data as FiscalResidenceAdministratorExercisingPfControl[];

    let data: AdministratorExercisingPfControlData;
    if (this.idEdit != "") {
      const index = this.dataProfiles.findIndex(id => id.id === this.idEdit);
      console.log(index, this.idEdit);
      if (generalData != null && addresData != null) {
        data = {
          id: this.idEdit,
          generalData: generalData,
          adrres: addresData,
          fiscalAddress: residence
        };
        this.dataProfiles.splice(index, 1, mapAdministratorExercisingPfControlTable(data));
        this.dataProfiles = [... this.dataProfiles]
        this.clearFormAdd();
      }
    } else if (this.idEdit === "") {
      if (generalData != null && addresData != null) {
        data = {
          id: '',
          generalData: generalData,
          adrres: addresData,
          fiscalAddress: residence
        };
        this.dataProfiles = [...this.dataProfiles, mapAdministratorExercisingPfControlTable(data)];
        this.clearFormAdd();
      }
    }

  }


  mapFiscalSelfDeclarationToFiscalResidence(
    forms: FiscalSelfDeclarationForm[]
  ): FiscalResidenceAdministratorExercisingPfControl[] {
    return forms.map(item => ({
      country: item.country ?? '',
      declarationFiscalResidence: item.declarationFiscalResidence ?? false,
      proofOfAddressType: item.proofOfAddressType ?? '',
      issueDate: item.issueDate ?? '',
      expirationStatus: item.expirationStatus ?? '',
      expirationDate: item.expirationDate ?? '',
      certificationDate: item.certificationDate ?? '',
      declarationYear: item.declarationYear ?? '',
      aditionalDays: item.aditionalDays ?? '',
      factaObligations: {
        autentication: item.factaObligations?.autentication ?? '',
        nif: item.factaObligations?.nif ?? '',
        tin: item.factaObligations?.tin ?? '',
        nss: item.factaObligations?.nss ?? ''
      }
    }));
  }


  async onSubmit() {
    this.dataSave = [];
    this.dataProfiles.forEach(item => this.dataSave.push(mapAdministratorExercisingPfControlSave(item)));
    if (this.dataSave.length >= 1) {
      this.administratorExercisingPfControlService.set({ client: this.dataSave });
      console.log(this.administratorExercisingPfControlService.get());
      this.notificationService.success('La Información ha Sido Guardada con Éxito.')
      this.unsavedChangesService.setUnsavedChanges(false);
    } else {
      this.notificationService.error('Al menos Debe Existir un Registro de Administrador que Ejerce el Control Completo.')
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
        this.curpAux = this.profileForm.getRawValue().curp
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
    } else if (REGEX.CURP_VALIDATION.test(this.profileForm.getRawValue().curp) && this.profileForm.getRawValue()?.curp?.substring(11, 13) === STRINGS.FOREIGN && this.profileForm.getRawValue().curp != this.curpAux ) {
      this.loadCurpData();
      this.validCurp = true;
      this.curpAux = this.profileForm.getRawValue().curp;
    } else if (!REGEX.CURP_VALIDATION.test(this.profileForm.getRawValue().curp)) {
      this.clearCurp();
      this.notificationService.error('Ingresa una CURP Válida.');
      this.validCurp = false;
      this.curpAux = this.profileForm.getRawValue().curp;
    }
  }

  clearCurp(): void {
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
    this.clearCurp();
    if (REGEX.CURP_VALIDATION.test(this.profileForm.getRawValue().curp)) {
      let dCurp: string = this.profileForm.getRawValue().curp;
      this.profileForm.patchValue({ gender: dCurp.charAt(10) });
      this.profileForm.patchValue({ dateOfBirth: this.getDateOfBirthFromCURP(dCurp) });
      if (REGEX.RFC_VALIDATION.test(this.profileForm.getRawValue().rfc)) {
        this.profileForm.patchValue({ rfc: this.getRFC(this.profileForm.getRawValue().rfc, dCurp) });
      } else {
        this.profileForm.patchValue({ rfc: dCurp.substring(0, 10) });
      }

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

      if (!dobValue || !gender || !state) {
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
      || this.profileForm.getRawValue().stateOfBirth?.trim() === ''
      || this.profileForm.getRawValue().nationality?.trim() === ''
      || this.profileForm.getRawValue().countryOfBirth?.trim() === ''
      || this.profileForm.getRawValue().phone?.trim() === ''
      || this.profileForm.getRawValue().mail?.trim() === ''
      || this.profileForm.getRawValue().nationalityTwo?.trim() === ''
    ) {
      this.error();
      this.notificationService.error('Se detectó información sin capturar');
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
      if (!REGEX.RFC_VALIDATION.test(this.profileForm.get('rfc')?.value && !this.profileForm.get('rfc')?.disabled)) {
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
    if (this.profileForm.getRawValue().mexicoResident != undefined) {
      if (this.profileForm.getRawValue().mexicoResident === true) {
        if (this.dataFiscalResidencesData().data.length < 1) {
          this.notificationService.error('Es Obligatorio Capturar una Residencia Fiscal Adicional');
          return true;
        }
      } else if (this.profileForm.getRawValue().mexicoResident === false) {

        if (this.dataFiscalResidencesData().data.length < 2) {
          this.notificationService.error('Es Obligatorio Capturar una Residencia Fiscal Adicional');
          return true;
        }
      } else if (this.dataFiscalResidencesData().data.length < 1) {
        this.notificationService.error('Es Obligatorio Capturar una Residencia Fiscal Adicional');
        return true;
      }
    }
    if (this.validationDataCurp() != undefined && !this.foreignerCURP()) {
      return this.validationDataFormDataCURP();
    }
    if (isExtranjero) {
      return false;
    }
    return true;
  }


  async submit(): Promise<AdministratorExercisingPfControl | null> {
    if (!this.validador()) {
      const data: AdministratorExercisingPfControl = this.client();
      const name = data.firstName;
      const middleName = data.middleName || ''
      const firstLastName = data.firstLastName || ''
      const secondLastName = data.secondLastName || ''
      const dataWatchList: CustomerWatchListBody = {
        personalInfo: {
          fullName: '',
          birthDate: data.dateOfBirth,
          curp: data.curp || '',
          clientNumber: '',
          rfc: data.rfc,
          nif: '',
          ssn: '',
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
            await this.notificationModalService.error({
              title: 'El solicitante se encuentra en la lista ',
              beforeMessages: watchListData,
              afterMessages: ['Consultar con el área de PLD'],
              btnAccept: 'Terminar',
            });
            this.router.navigate(['/'], { relativeTo: this.route.parent });
            return null;
          } else if (watchListData.length === 0) {
            this.unsavedChangesService.setUnsavedChanges(false);
            await this.notificationModalService.error({
              title: 'El solicitante se encuentra en la lista ',
              afterMessages: ['Consultar con el área de PLD'],
              btnAccept: 'Terminar',
            });
            this.router.navigate(['/'], { relativeTo: this.route.parent });
            return null;
          } else {
            this.unsavedChangesService.setUnsavedChanges(false);
            await this.notificationModalService.error({
              title: 'El solicitante se encuentra en la lista ' + watchListData[0],
              afterMessages: ['Consultar con el área de PLD'],
              btnAccept: 'Terminar',
            });
            this.router.navigate(['/'], { relativeTo: this.route.parent });
          }
          return null;
        }
        if (this.listData?.step === 2) {
          await this.notificationModalService.warning({
            title: '¡Atención!',
            afterMessages: ['El Cliente en cuestión ha sido remitido al Área de PLD para su revisión.'],
          });
          return null;
        }
      } catch (error) {
        this.notificationService.error('Fallo al Validar en Listas de Restricción');
        return null;
      }
      const dataHomonymsList: HomonymsRequest = {
        channelId: "SPINE",
        applicationId: "0001",
        personType: 1,
        name: data.firstName,
        middleName: data.middleName,
        lastName: data.firstLastName,
        secondLastName: data.secondLastName,
        // federalEntity: data.stateOfBirth,
        // gender: data.gender,
        // TODO fix, el objeto data (AdministratorExercisingPfControl) no tiene "typeIden"
        rfc: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.RFC, '1'),
        nif: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.NIF, '1'),
        tin: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.NIF, '1'),
        nss: compareAndReturnRfcNifTinNss(data.rfc, AllowedValuesRfcNifTinNss.SSN, '1'),
        birthPlace: data.countryOfBirth,
        birthDate: data.dateOfBirth,
        curp: data.curp || '',
      }
      try {
        this.listHomonyms = await lastValueFrom(this.dataHomonymService.postHomonyms(dataHomonymsList));
        let homo = searchPercentSimilarity(this.listHomonyms);
        if (this.listHomonyms) {
          if (homo.code === 2 || homo.code === 3) {
            this.dataHomonymService.setData(this.listHomonyms);
            await this.notificationModalService.success({
              title: '¡Se ha encontrado coincidencias!',
              afterMessages: ['Se ha encontrado homonimias del Cliente. '],
              btnAccept: 'Revisión',
            });
            const result = await this.modalHomonymsServiceService.formModalHomonyms()

            if (result === "continue") {
              this.client();
            } else {
              return null;
            }
          }
          if (homo.code === 1) {
            this.dataHomonymService.setData(this.listHomonyms);
            await this.notificationModalService.success({
              title: '¡Se ha encontrado una coincidencia!',
              afterMessages: ['Se ha encontrado una coincidencia exacta con', 'Número de Cliente', this.listHomonyms[0].clientNumber],
              btnAccept: 'Revisión',
            });
            this.modalService.homonimiaModal([this.listHomonyms[homo.indices[0]]]).subscribe((result) => {
              if (result === null) {

              }
            });
            this.unsavedChangesService.setUnsavedChanges(false);
            return null;
          }
        }
        this.curpAux = '';
        return this.client();
      } catch (error) {
        this.notificationService.error('Fallo al Validar en Búsqueda de Homónimos');
        return null;
      }
    } else {
      return null;
    }
  }

  removeExtraSpaces(text: string) {
    return text.replace(REGEX.MULTIPLE_SPACES, ' ');
  }

  findValueIn = (list: WatchList): boolean => {
    return list.matchLists.some((item: { type: string; }) => item.type.toLocaleUpperCase() === 'PPE');
  }

  getListValues = (list?: WatchList) => list?.matchLists?.map(item => item.type) || [];

  setClientData(data: AdministratorExercisingPfControlData) {
    if (data) {
      this.profileForm.patchValue({ curp: data.generalData.curp.toUpperCase() });
      this.validCurp = validCurp(data.generalData.curp || '', data.generalData.foreignerWithoutCurp || false);
      this.curpAux = data.generalData.curp ?? '';
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
      this.profileForm.patchValue({
        curp: data.generalData.curp?.toUpperCase(),
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
        phone: data.generalData.phone,
        mail: data.generalData.mail?.toUpperCase(),
        nationalityTwo: data.generalData.nationalityTwo?.toUpperCase(),
        mexicoResident: data.generalData.mexicoResident,
        fiscalResidenceAbroad: data.generalData.fiscalResidenceAbroad,
        fatca: data.generalData.fatca,
        crs: data.generalData.crs,
      });
      this.addressSectionComponent.setAddresData(data.adrres);
      this.existFiscalResidences(data.fiscalAddress);
    } else {
      this.profileForm.patchValue({ gender: '', nationality: STRINGS.MEXICAN, countryOfBirth: STRINGS.MEXICO });
    }
    this.unsavedChangesService.setUnsavedChanges(true);
  }

  //function to map to DataClient
  client = (): AdministratorExercisingPfControl => this.profileForm.getRawValue() as AdministratorExercisingPfControl;


  addFiscalResidences() {
    const dataConfig: configFiscalResidenceModalAdministratorExercisingPfControlComponent = {
      dataCountry: this.profileForm.getRawValue().countryOfBirth,
      taxCountry: this.profileForm.getRawValue().nationality,
      hiddenPersonType: true
    }
    this.modalService.fiscalResidenceModal(null, dataConfig).subscribe((result) => {
      if (result !== null && Array.isArray(result.fiscalResidences)) {
        const actual = this.dataFiscalResidencesData();

        const activeResidence =
          result.fiscalResidences.find((res) => res.declarationFiscalResidence) ??
          result.fiscalResidences[0];

        this.profileForm.patchValue({
          fiscalResidences: true,
        });

        this.dataFiscalResidencesData.set({
          ...actual,
          data: [
            ...actual.data,
            {
              tempId: crypto.randomUUID(),
              personType: activeResidence.personType,
              country: activeResidence.country,
              declarationFiscalResidence:
                activeResidence.declarationFiscalResidence,
              proofOfAddressType: activeResidence.proofOfAddressType,
              issueDate: activeResidence.issueDate,
              expirationStatus: activeResidence.expirationStatus,
              expirationDate: activeResidence.expirationDate,
              certificationDate: activeResidence.certificationDate,
              declarationYear: activeResidence.declarationYear,
              aditionalDays: activeResidence.aditionalDays,
              factaObligations: {
                autentication:
                  activeResidence.factaObligations?.autentication ?? '',
                nif: activeResidence.factaObligations?.nif ?? '',
                tin: activeResidence.factaObligations?.tin ?? '',
                nss: activeResidence.factaObligations?.nss ?? '',
              }
            },
          ],
          table: [
            ...actual.table,
            {
              tempId: crypto.randomUUID(),
              registerNo: actual.table.length + 1,
              personType: activeResidence.personType,
              proofOfAddressType: activeResidence.country,
              autentication:
                activeResidence.factaObligations?.autentication ?? '',
              proofOfAddressFiscal: activeResidence.proofOfAddressType,
              nif: activeResidence.factaObligations?.nif ?? '',
              tin: activeResidence.factaObligations.tin ?? ''
            },
          ],
        });

        this.tableData = this.dataFiscalResidencesData().table;
        this.notificationService.success(SUCCESS_MESSAGES.SAVE_TAX_ADDRESS);
        this.checkboxFatcaCrs(result.facta, result.crs);
      }
    });
  }
  checkboxFatcaCrs(fatca: boolean, crs: boolean) {
    this.profileForm.get('fatca')?.setValue(fatca);
    this.profileForm.get('crs')?.setValue(crs);
  }



  eventRowFiscal(event: { type: string; row: any }): void {
    if (STRINGS.DELETE === event.type) {
      this.notificationModalService
        .confirm({
          title: NOTIFICATION_MESSAGES.DELETE_QUESTION_MESSAGE,
          btnAccept: 'Si, Eliminar.',
          btnDeny: 'No',
        })
        .then((res: { value: boolean; message?: string } | undefined) => {
          if (res && res.value) {
            const newArr = this.tableData.filter(
              (item: any) => item.registerNo !== event.row.registerNo
            );
            const newData = this.dataFiscalResidencesData().data.filter(
              (_, index) => index !== event.row.registerNo - 1
            );
            const updatedTable = newArr.map((row, index) => ({
              ...row,
              registerNo: index + 1,
            }));

            this.dataFiscalResidencesData.set({
              data: newData,
              table: updatedTable,
            });

            this.tableData = updatedTable;

            this.notificationService.success(SUCCESS_MESSAGES.ITEM_DELETED);
          }
        });
    } else if (STRINGS.EDIT === event.type) {
      const dataConfig: configFiscalResidenceModalAdministratorExercisingPfControlComponent = {
        dataCountry: this.profileForm.getRawValue().countryOfBirth,
        taxCountry: this.profileForm.getRawValue().nationality,
        hiddenPersonType: true
      }
      this.isEditting = true;
      this.edittingId = event.row['registerNo'] - 1;
      const dataEdit = this.dataFiscalResidencesData().data[this.edittingId];
      const dataTableEdit =
        this.dataFiscalResidencesData().table[this.edittingId];
      const dataModal = {
        edit: true,
        data: dataEdit,
        table: dataTableEdit,
      };
      this.editItem(dataModal, dataConfig);
    }
  }

  editItem(modalData: any, config: configFiscalResidenceModalAdministratorExercisingPfControlComponent): void {
    const data = { modalData, config };
    const dialogRef = this.dialog.open(ModalFiscalResidenceComponent, {
      maxWidth: '99%',
      height: '90%',
      data,
      disableClose: true,
      panelClass: 'panel-class',
    });
    dialogRef.afterClosed().subscribe((modalData: any) => {
      if (!modalData || !Array.isArray(modalData.fiscalResidences)) return;
      const editedResidence = modalData.fiscalResidences[0]; // o buscar por tempId si es necesario
      const index = this.edittingId;
      const current = this.dataFiscalResidencesData();


      const updatedData = [...current.data];
      const updatedTable = [...current.table];

      // Actualizar solo el item editado en data
      updatedData[index] = {
        ...updatedData[index],
        tempId: editedResidence.tempId,
        personType: editedResidence.personType,
        country: editedResidence.country,
        declarationFiscalResidence: editedResidence.declarationFiscalResidence,
        proofOfAddressType: editedResidence.proofOfAddressType,
        issueDate: editedResidence.issueDate,
        expirationStatus: editedResidence.expirationStatus,
        expirationDate: editedResidence.expirationDate,
        certificationDate: editedResidence.certificationDate,
        declarationYear: editedResidence.declarationYear,
        aditionalDays: editedResidence.aditionalDays,
        factaObligations: {
          autentication: editedResidence.factaObligations?.autentication ?? '',
          nss: editedResidence.factaObligations?.nss ?? '',
        }
      };

      // Actualizar solo el item editado en table
      updatedTable[index] = {
        ...updatedTable[index],
        tempId: editedResidence.tempId,
        personType: editedResidence.personType,
        proofOfAddressType: editedResidence.country,
        autentication: editedResidence.factaObligations?.autentication ?? '',
        proofOfAddressFiscal: editedResidence.proofOfAddressType,
        tin: editedResidence.factaObligations?.tin ?? '',
        nif: editedResidence.factaObligations?.nif ?? ''
      };

      this.dataFiscalResidencesData.set({
        ...current,
        data: updatedData,
        table: updatedTable,
      });

      this.tableData = updatedTable;
      this.notificationService.success(SUCCESS_MESSAGES.SUCCESSFUL_UPDATE);
    });
  }

  rowSelected(event: any): void {
  }

  async eventRow(event: any) {
    if (event.type === 'edit') {
      if (this.isMaintenance) {
        this.setPermissionsMaintenance();
      }
      console.log(event.row)
      this.unsavedChangesService.setUnsavedChanges(true);
      let data: AdministratorExercisingPfControlData = mapAdministratorExercisingPfControlData(event.row);
      this.idEdit = data.id;
      this.setClientData(data);
    }
    if (event.type === 'delete') {
      this.unsavedChangesService.setUnsavedChanges(true);
      const result = await this.notificationModalService.confirm({
        title: 'Confirmar eliminar el registro',
        btnAccept: 'Sí, eliminar',
        btnDeny: 'No',
      });
      if (result?.value === true) {
        let data: AdministratorExercisingPfControlData = mapAdministratorExercisingPfControlData(event.row);
        this.idEdit = data.id;
        const index = this.dataProfiles.findIndex(i => i.id === this.idEdit);
        this.dataProfiles.splice(index, 1);
        this.dataProfiles = [... this.dataProfiles];
        this.unsavedChangesService.setUnsavedChanges(true);
        this.idEdit = '';
      }
    }
  }

  eventPage(event: PageEvent): void {
  }

  existFiscalResidences(fiscalResidences: Array<FiscalResidenceAdministratorExercisingPfControl>) {
    console.log(fiscalResidences)
    const newData = fiscalResidences.map((residence, index) => ({
      tempId: crypto.randomUUID(),
      personType: 0,
      country: residence.country,
      declarationFiscalResidence: residence.declarationFiscalResidence,
      proofOfAddressType: residence.proofOfAddressType,
      issueDate: residence.issueDate,
      expirationStatus: residence.expirationStatus,
      expirationDate: residence.expirationDate,
      certificationDate: residence.certificationDate,
      declarationYear: residence.declarationYear,
      aditionalDays: residence.aditionalDays,
      factaObligations: {
        autentication: residence.factaObligations?.autentication ?? '',
        nss: residence.factaObligations.nss,
      }
    }));

    const newTable = fiscalResidences.map((residence, index) => ({
      tempId: crypto.randomUUID(),
      registerNo: index + 1,
      personType: 0,
      proofOfAddressType: residence.country,
      autentication: residence.factaObligations?.autentication ?? '',
      proofOfAddressFiscal: residence.proofOfAddressType,
      tin: residence.factaObligations?.tin ?? '',
      nif: residence.factaObligations?.nif ?? ''
    }));

    this.dataFiscalResidencesData.set({
      data: newData,
      table: newTable,
    });
    this.tableData = newTable;
  }
}

