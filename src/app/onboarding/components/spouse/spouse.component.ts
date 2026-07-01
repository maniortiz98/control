import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { HomonymsService } from '../../../shared/services/homonyms.service';
import { ModalFormService } from '../../../shared/services/modal-form.service';
import { ModalHomonymsServiceService } from '../../../shared/services/modal-homonyms-service.service';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { WatchlistService } from '../../../shared/services/watchlist.service';
import { REGEX, STRINGS } from '../../constants/constants';
import { formatDateYYYYMMDD, yearsAgo } from '../../../shared/utils/datetime';
import { EconomicActivity } from '../../models/economic-activity';
import { Occupation } from '../../models/occupation';
import { validateRFCDay, validateRFCMonth } from '../../../shared/utils/rfcValid';
import { WatchList } from '../../models/customer-watch-list';
import { AllowedValuesRfcNifTinNss, compareAndReturnIdRfcNifTinNss, compareAndReturnRfcNifTinNss, compareAndReturnValueRfcNifTinNss } from '../../../shared/utils/map-rfc-nif-tin-nss';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { HomonymsResponse } from '../../models/homonyms';
import { AddressSectionComponent } from '../../../shared/components/sections/address-section/address-section.component';
import { Spouse, SpouseData } from '../../models/spouse';
import { SpouseService } from '../../../shared/services/storage-services/spouse.service';
import { PermissionRolService } from '../../../core/services/rol.service';
import { OnboardingService } from '../../services/onboarding.service';
import { formFunctionDis, butonFunctionDis, formFunctionEnAll, buttonFunctionEn } from '../../../shared/utils/disableOrEnabled';
import { mapToCheckpointSpouse, mapToCheckpointToSignalSpouse } from '../../services/mappers/maintenance/spouse-mapper';
import { DataSpouseId } from '../../models/checkpoints/maintenance/spouse-checkpoint';
import { ValidCurpService } from '../../../shared/services/curp-valid/valid-curp.service';
import { CurpValidationResponse } from '../../models/curp-valid';
import { countSpaces, validCurp } from '../../../shared/utils/curp-valid';
import { minDateValidator, maxDateValidator } from '../../../shared/utils/validators';
import moment from 'moment';
import { SearchClientFlowService } from '../../../shared/services/search-client-flow.service';
import { DataClient } from '../../models/client-data';

@Component({
  selector: 'app-spouse',
  standalone: false,
  templateUrl: './spouse.component.html',
  styleUrl: './spouse.component.scss'
})
export class SpouseComponent implements OnInit {

  @ViewChild(AddressSectionComponent) addressSectionComponent!: AddressSectionComponent;


  private readonly catalogService = inject(CatalogsService);
  private readonly fb = inject(FormBuilder);
  readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationsService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly spouseService = inject(SpouseService);
  private readonly dataWatchlistService = inject(WatchlistService);
  private readonly dataHomonymService = inject(HomonymsService);
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly modalService = inject(ModalFormService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly modalHomonymsServiceService = inject(ModalHomonymsServiceService);
  private readonly onboardingService = inject(OnboardingService);
  isMaintenance: boolean = this.onboardingService.getCurrentInfo().isMaintenance
  isMaintenanceE = signal<boolean>(true);
  isCustomer: boolean = this.onboardingService.getCurrentInfo().isCustomer
  private readonly permissionRolService = inject(PermissionRolService);
  private readonly validCurpService = inject(ValidCurpService);
  private readonly searchClientFlowService = inject(SearchClientFlowService);

  birthDates = {
    startAt: yearsAgo(18),
    max: new Date(),
    min: yearsAgo(150),
  };

  profileForm: FormGroup = this.fb.nonNullable.group({
    curp: [{ value: '', disabled: false }, [Validators.required, Validators.pattern(REGEX.CURP_VALIDATION)]],
    foreignerWithoutCurp: [false],
    typeIden: ['', Validators.required],
    rfc: ['', [Validators.required, Validators.pattern(REGEX.RFC_VALIDATION)]],
    firstName: ['', [Validators.required, Validators.pattern(REGEX.FIRST_NAME_VALIDATION)]],
    middleName: ['', [Validators.pattern(REGEX.FIRST_NAME_VALIDATION)]],
    dateOfBirth: ['', [Validators.required, minDateValidator(this.birthDates.min), maxDateValidator(this.birthDates.max)]],
    firstLastName: ['', [Validators.pattern(REGEX.LAST_NAME_VALIDATION)]],
    secondLastName: ['', [Validators.pattern(REGEX.LAST_NAME_VALIDATION)]],
    gender: ['', Validators.required],
    occupation: ['', Validators.required],
    economicActivity: ['', Validators.required],
  });

  foreignerCURP = signal(false);
  foreign = signal(false);
  economicActivity = signal<EconomicActivity[]>([]);
  ocupation = signal<Occupation[]>([]);
  data: any | null = null;
  listData: WatchList | undefined;
  listHomonyms: HomonymsResponse[] | undefined;
  curpAux = '';

  newData: boolean = true;
  ids: DataSpouseId = {
    SpouseDataId: {
      id: 0,
      personId: 0
    },
    WorkingFieldsSpouseId: {
      id: 0
    },
    AddressSpouseId: {
      id: 0
    }
  };

  dataAux: any;
  filteredEconomicActivities = signal<EconomicActivity[]>([]);
  economicActivityFilter = new FormControl('');
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
  ngOnInit(): void {

    this.catalogService.getEconomicActivity({ lineBusinessId: [""] }).subscribe(result => {
      this.economicActivity.set(result);
      this.filteredEconomicActivities.set(result);
    });
    this.catalogService.getOccupations({ ocupationIds: [""] }).subscribe(result => {
      this.ocupation.set(result);
    });
  }

  ngAfterViewInit() {
    const data = this.spouseService.getItem();
    if (data) {
      this.newData = false;
      this.ids = {
        SpouseDataId: {
          id: data?.spousedata.id,
          personId: data?.spousedata.personId,
        },
        WorkingFieldsSpouseId: {
          id: data?.workingfields.id,
        },
        AddressSpouseId: {
          id: data?.address.id,
        }
      };
      if (data?.spousedata.curp.toUpperCase().substring(11, 13) === STRINGS.FOREIGN) {
        this.foreign.set(true);
      }
      if (data?.spousedata.foreignerWithoutCurp === true) {
        this.foreignerCURP.set(true);
        const curpControl = this.profileForm.get('curp');
        curpControl?.disable();
      }
      this.validCurp = validCurp(data.spousedata.curp || '', data.spousedata.foreignerWithoutCurp || false);
      this.curpAux = data.spousedata.curp ?? '';
      this.profileForm.patchValue({
        curp: data?.spousedata.curp,
        foreignerWithoutCurp: data?.spousedata.foreignerWithoutCurp,
        typeIden: compareAndReturnIdRfcNifTinNss(data?.spousedata.rfc || '', data?.spousedata.nif || '', data?.spousedata.tin || '', data?.spousedata.nss || ''),
        rfc: compareAndReturnValueRfcNifTinNss(data?.spousedata.rfc || '', data?.spousedata.nif || '', data?.spousedata.tin || '', data?.spousedata.nss || ''),
        firstName: data?.spousedata.firstName,
        middleName: data?.spousedata.middleName,
        dateOfBirth: data?.spousedata.dateOfBirth,
        firstLastName: data?.spousedata.firstLastName,
        secondLastName: data?.spousedata.secondLastName,
        gender: data?.spousedata.gender,
        occupation: data?.workingfields.occupation,
        economicActivity: data?.workingfields.businessActivity,
      });
      this.addressSectionComponent.setAddresData({...data.address, id: 0});
    }
    this.profileForm.valueChanges.subscribe(() => {
      this.unsavedChangesService.setUnsavedChanges(
        this.profileForm.dirty || this.addressSectionComponent.profileForm.dirty
      );
    });
    this.addressSectionComponent.profileForm.valueChanges.subscribe(() => {
      this.unsavedChangesService.setUnsavedChanges(
        this.profileForm.dirty || this.addressSectionComponent.profileForm.dirty
      );
    });
    if (this.isMaintenance) {
      formFunctionDis(this.profileForm);
      formFunctionDis(this.addressSectionComponent.profileForm);
      if (!this.permissionRolService.getPermissions()['spouse'].allDisabled) {
        this.isMaintenanceE.set(false);
      }
    }
  }

  editt() {
    if (this.permissionRolService.getPermissions()['spouse'].allDisabled) {
    } else {
      formFunctionEnAll(this.profileForm);
      formFunctionEnAll(this.addressSectionComponent.profileForm);
      const country = this.addressSectionComponent.profileForm.get('country')?.value;
      this.addressSectionComponent.enableDisableFECityMun(country);
      butonFunctionDis(['btnEdit']);
      buttonFunctionEn(['btnSave', 'btnCancel']);
    }
  }

  cancel() {
    const data = this.spouseService.getItem();
    if (data) {
      this.profileForm.patchValue({
        curp: data?.spousedata.curp,
        foreignerWithoutCurp: data?.spousedata.foreignerWithoutCurp,
        typeIden: compareAndReturnIdRfcNifTinNss(data?.spousedata.rfc || '', data?.spousedata.nif || '', data?.spousedata.tin || '', data?.spousedata.nss || ''),
        rfc: compareAndReturnValueRfcNifTinNss(data?.spousedata.rfc || '', data?.spousedata.nif || '', data?.spousedata.tin || '', data?.spousedata.nss || ''),
        firstName: data?.spousedata.firstName,
        middleName: data?.spousedata.middleName,
        dateOfBirth: data?.spousedata.dateOfBirth,
        firstLastName: data?.spousedata.firstLastName,
        secondLastName: data?.spousedata.secondLastName,
        gender: data?.spousedata.gender,
        occupation: data?.workingfields.occupation,
        economicActivity: data?.workingfields.businessActivity,
      });
      this.addressSectionComponent.setAddresData({...data.address, id: 0});
    }
    formFunctionDis(this.profileForm);
    formFunctionDis(this.addressSectionComponent.profileForm);
    buttonFunctionEn(['btnEdit']);
    butonFunctionDis(['btnSave', 'btnCancel']);
    this.profileForm.markAsPristine();
    this.addressSectionComponent.profileForm.markAsPristine();
    this.unsavedChangesService.setUnsavedChanges(false);
  }

  replaceLetter(text: string): string {
    return text.replace(/[ñÑ]/g, "X");
  }

  //Function to convert the curp to uppercase
  toUppercaseCURP(controlName: string): void {
    const control = this.profileForm.get(controlName);
    if (control) {
      const upperValue = control.value?.toUpperCase();
      control.setValue(this.replaceLetter(upperValue), { emitEvent: false });
    }
  }

  allowAlphanumericOnly(event: KeyboardEvent): void {
    const regex = /^[a-zA-Z0-9]$/;
    const key = event.key;
    if (!regex.test(key)) {
      event.preventDefault();
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

  getRFC(rfc: string, curp: string): string {
    return curp.substring(0, 10) + rfc.substring(10, 13)
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

    const leter = /^[aA-zZ]$/.test(curp.substring(16, 17));
    const fullYear = leter
      ? 2000 + year
      : 1900 + year;

    return new Date(fullYear, month - 1, day);
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
          if (this.profileForm.getRawValue().rfc) {
            this.profileForm.patchValue({ typeIden: '1' });
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
      if (this.profileForm.getRawValue().rfc) {
        this.profileForm.patchValue({ typeIden: '1' });
      }

      if (dCurp.substring(11, 13) != STRINGS.FOREIGN) {
        this.profileForm.patchValue({ stateOfBirth: dCurp.substring(11, 13) });
        this.foreign.set(false);
      }
      else {
        this.foreign.set(true);
      }
    }
  }

  //function to detonate error
  error(): void {
    Object.values(this.profileForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsTouched();
      }
    });
  }

  //function to generate CURP from the information
  validationDataCurp(): string {
    const dobValue = this.profileForm.get('dateOfBirth')?.value;

    if (!dobValue) {
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
    return curpDate;
  }

  //function to separate the date
  getDate(text: string): string {
    return text.substring(2, 4)
      + text.substring(5, 7)
      + text.substring(8, 10);
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
    else {
      return false;
    }
  }

  removeExtraSpaces(text: string) {
    return text.replace(REGEX.MULTIPLE_SPACES, ' ');
  }

  getListValues = (list?: WatchList) => list?.matchLists?.map(item => item.type) || [];

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
      || this.profileForm.getRawValue().typeIden?.trim() === ''
      || this.profileForm.getRawValue().gender?.trim() === ''
      || this.profileForm.getRawValue().economicActivity?.trim() === ''
      || this.profileForm.getRawValue().occupation?.trim() === ''
    ) {
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
      } else if (this.profileForm.getRawValue().typeIden === "1" && !validateRFCMonth(this.profileForm.get('rfc')?.value) && !this.profileForm.get('rfc')?.disabled) {
        console.log(this.profileForm.get('rfc')?.value)
        const controlRfc = this.profileForm.get('rfc');
        controlRfc?.setErrors({ invalidFormat: true });
        controlRfc?.markAsTouched();
        this.error();
        this.notificationService.error('El Mes en el RFC es Invalido. ')
        return true;
      } else if (this.profileForm.getRawValue().typeIden === "1" && !validateRFCDay(this.profileForm.get('rfc')?.value) && !this.profileForm.get('rfc')?.disabled) {
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

  getDataClient(): DataClient {
    const data: Spouse = this.client();
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
      nationality: '',
      countryOfBirth: '',
      stateOfBirth: '',
      firstName: data.firstName,
      middleName: data.middleName,
      firstLastName: data.firstLastName,
      secondLastName: data.secondLastName
    };
    return dataBody;
  }


  async submit(): Promise<Spouse | null> {
    if (!this.validador()) {
      const data: Spouse = this.client();
      const res = await this.searchClientFlowService.validInWatchList(this.getDataClient());
      if (res) {
        this.curpAux = '';
        return this.client();
      } else {
        return null;
      }
    }
    return null;
  }

  //function to map to DataClient
  client = (): Spouse => this.profileForm.getRawValue() as Spouse;

  async onSubmit() {
    const dataClient = await this.submit();
    const dataAddressSection = await this.addressSectionComponent.onSubmit();
    if (dataClient != null && dataAddressSection != null) {
      const spouseData: SpouseData = {
        generalData: dataClient,
        adrres: dataAddressSection
      }
      console.log(mapToCheckpointSpouse(spouseData, this.newData, this.ids))
      this.checkpointService.saveSectionMant('spouse-data', mapToCheckpointSpouse(spouseData, this.newData, this.ids)).subscribe(async (result) => {
        if (result['status'] === "CREATED") {
          this.profileForm.markAsPristine();
          this.addressSectionComponent.profileForm.markAsPristine();
          this.unsavedChangesService.setUnsavedChanges(false);
          await this.update();
          this.notificationService.success('Guardado con éxito');
        }
      });
    }
  }

  async update() {
    const response = await firstValueFrom(this.checkpointService.getMaintenanceSectionByPersonaFisica(['spouse-data']));
    this.spouseService.setItem(mapToCheckpointToSignalSpouse(response['checkpoints'][0]['data']));
    const data = this.spouseService.getItem();
    if (data) {
      this.newData = false;
      this.ids = {
        SpouseDataId: {
          id: data?.spousedata.id,
          personId: data?.spousedata.personId,
        },
        WorkingFieldsSpouseId: {
          id: data?.workingfields.id,
        },
        AddressSpouseId: {
          id: data?.address.id,
        }
      };
      if (data?.spousedata.curp.toUpperCase().substring(11, 13) === STRINGS.FOREIGN) {
        this.foreign.set(true);
      }
      if (data?.spousedata.foreignerWithoutCurp === true) {
        this.foreignerCURP.set(true);
        const curpControl = this.profileForm.get('curp');
        curpControl?.disable();
      }
      this.validCurp = validCurp(data.spousedata.curp || '', data.spousedata.foreignerWithoutCurp || false);
      this.curpAux = data.spousedata.curp ?? '';
      this.profileForm.patchValue({
        curp: data?.spousedata.curp,
        foreignerWithoutCurp: data?.spousedata.foreignerWithoutCurp,
        typeIden: compareAndReturnIdRfcNifTinNss(data?.spousedata.rfc || '', data?.spousedata.nif || '', data?.spousedata.tin || '', data?.spousedata.nss || ''),
        rfc: compareAndReturnValueRfcNifTinNss(data?.spousedata.rfc || '', data?.spousedata.nif || '', data?.spousedata.tin || '', data?.spousedata.nss || ''),
        firstName: data?.spousedata.firstName,
        middleName: data?.spousedata.middleName,
        dateOfBirth: data?.spousedata.dateOfBirth,
        firstLastName: data?.spousedata.firstLastName,
        secondLastName: data?.spousedata.secondLastName,
        gender: data?.spousedata.gender,
        occupation: data?.workingfields.occupation,
        economicActivity: data?.workingfields.businessActivity,
      });
      this.addressSectionComponent.setAddresData({...data.address, id: 0});
      this.profileForm.markAsPristine();
      this.addressSectionComponent.profileForm.markAsPristine();
      this.unsavedChangesService.setUnsavedChanges(false);
    }
  }
}
