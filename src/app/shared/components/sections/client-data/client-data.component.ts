import { Component, EventEmitter, inject, Input, Output, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { REGEX, STRINGS } from '../../../../onboarding/constants/constants';
import { Entity } from '../../../../onboarding/models/entity';
import { Nationalities } from '../../../../onboarding/models/nationality';
import { Countries } from '../../../../onboarding/models/country';
import { Client, DataClient } from '../../../../onboarding/models/client-data';
import { CatalogsService } from '../../../services/catalogs.service';
import { NotificationsService } from '../../../services/notifications.service';
import { NotificationModalService } from '../../../services/notification-modal.service';
import { MaritalStatus } from '../../../../onboarding/models/marital-status';
import { lastValueFrom } from 'rxjs';
import * as DateTimeUtils from '../../../utils/datetime';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { mapFormToInitialData } from '../../../services/mapper-services/maper';
import { AllowedValuesRfcNifTinNss } from '../../../utils/map-rfc-nif-tin-nss';
import { searchState } from '../../../utils/search-state';
import { ValidCurpService } from '../../../services/curp-valid/valid-curp.service';
import { CurpValidationResponse } from '../../../../onboarding/models/curp-valid';
import { countSpaces, validCurp } from '../../../utils/curp-valid';
import moment from 'moment';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { maxDateValidator, minDateValidator } from '../../../utils/validators';
import { formFunctionEnAll } from '../../../utils/disableOrEnabled';

@Component({
  selector: 'app-client-data',
  standalone: false,
  templateUrl: './client-data.component.html',
  styleUrl: './client-data.component.css'
})

export class ClientDataComponent {


  //Input
  @Input() data?: Client | null = null;
  @Input() gender?: boolean = false;
  @Input() genderMaritalStatus?: boolean = false;
  @Input() countryTaxCodeAbroad?: boolean = false;
  @Input() rfc?: boolean = true;
  @Input() underage?: boolean = false;

  //Output
  @Output() formGroupEmitter = new EventEmitter<FormGroup>();
  @ViewChild('pickerBirthdate') pickerBirthdate!: MatDatepicker<Date>;

  private readonly fb = inject(FormBuilder);
  private readonly catalogService = inject(CatalogsService);
  private readonly notificationService = inject(NotificationsService);
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly validCurpService = inject(ValidCurpService);

  birthDates = {
    startAt: DateTimeUtils.yearsAgo(18),
    max: new Date(),
    min: DateTimeUtils.yearsAgo(150),
  };

  // Form
  profileForm: FormGroup = this.fb.group({
    curp: [{ value: '', disabled: false }, [Validators.required, Validators.pattern(REGEX.CURP_VALIDATION)]],
    foreignerWithoutCurp: [false],
    rfc: ['', [Validators.required]],
    firstName: ['', [Validators.required, Validators.pattern(REGEX.FIRST_NAME_VALIDATION)]],
    middleName: ['', [Validators.pattern(REGEX.FIRST_NAME_VALIDATION)]],
    dateOfBirth: [null, { validators: [Validators.required, minDateValidator(this.birthDates.min), maxDateValidator(this.birthDates.max)] }],
    firstLastName: ['', [Validators.pattern(REGEX.LAST_NAME_VALIDATION)]],
    secondLastName: ['', [Validators.pattern(REGEX.LAST_NAME_VALIDATION)]],
    gender: [{ value: '' }, Validators.required],
    maritalStatus: ['', Validators.required],
    nationality: ['', [Validators.required, Validators.pattern(REGEX.STATE_VALIDATION)]],
    countryOfBirth: ['', Validators.required],
    stateOfBirth: ['', Validators.required],
    countryTaxCodeAbroad: ['', Validators.required],
    typeIden: ['', Validators.required],
  });

  //Signals
  errors = signal<string[]>([]);
  nationalities = signal<Nationalities[]>([]);
  countries = signal<Array<Countries>>([]);
  foreignerCURP = signal(false);
  foreign = signal(false);
  states = signal<Entity[]>([]);
  maritalStatus = signal<MaritalStatus[]>([]);
  dataAux: any;
  curpAux = '';

  /**
   * Felix, es para que no haga la validacion del curp.
   * En mi caso, en mi form ese campo no es obligatorio.
   * Desde mi componente le quito "required".
   */
  checkCurpValidation = true;

  validCurp = false;

  //Constructor
  constructor() {
    document.body.classList.remove('show-validation');
  }

  isNotEmpty(obj: any) {
    return Object.keys(obj).length > 0;
  }

  isEmptyObject(obj: any): boolean {
    return obj && typeof obj === 'object' && Object.keys(obj).length === 0;
  }


  //ngOnInit Initializes the catalogs and assigns data if it has any.
  ngOnInit() {
    this.catalogService.getCountry({ land: [] }).subscribe(c => {
      this.countries.set(c);
    });

    this.catalogService.getNationalities({ land: [] }).subscribe(c => {
      this.nationalities.set(c);
    });

    this.catalogService.getFederalEntity({ land1s: ["MX"] }).subscribe(c => {
      this.states.set(c);
    });

    if (this.gender || this.genderMaritalStatus) {
      this.catalogService.getMaritalStatus({ maritalStatusIds: [] }).subscribe(m => {
        this.maritalStatus.set(m);
      });
    }

    console.log(this.data);
    if (this.data && this.isNotEmpty(this.data)) {
      this.validCurp = validCurp(this.data.curp || '', this.data.foreignerWithoutCurp || false);
      this.curpAux = this.data.curp ?? '';
      this.dataAux = this.data.curp?.toUpperCase().substring(11, 13);
      this.profileForm.patchValue({ curp: this.data.curp?.toUpperCase() });
      if (this.data.curp?.toUpperCase().substring(11, 13) === STRINGS.FOREIGN) {
        this.foreign.set(true);
        this.dataAux = 'NE'
      }
      if (this.data.foreignerWithoutCurp === true) {
        this.foreignerCURP.set(true);
        this.dataAux = 'NE'
        const curpControl = this.profileForm.get('curp');
        curpControl?.disable();
      }
      this.profileForm.patchValue({ foreignerWithoutCurp: this.data.foreignerWithoutCurp });
      this.profileForm.patchValue({ rfc: this.data.rfc?.toUpperCase() });
      this.profileForm.patchValue({ typeIden: this.data.typeIden?.toUpperCase() });
      this.profileForm.patchValue({ firstName: this.data.firstName?.toUpperCase() });
      this.profileForm.patchValue({ middleName: this.data.middleName?.toUpperCase() });
      this.profileForm.patchValue({ dateOfBirth: DateTimeUtils.toDate(this.data.dateOfBirth ?? null) });
      this.profileForm.patchValue({ firstLastName: this.data.firstLastName?.toUpperCase() });
      this.profileForm.patchValue({ secondLastName: this.data.secondLastName?.toUpperCase() });
      this.profileForm.patchValue({ gender: this.data.gender });
      this.profileForm.patchValue({ maritalStatus: this.data.maritalStatus });
      this.profileForm.patchValue({ nationality: this.data.nationality?.toUpperCase() });
      this.profileForm.patchValue({ countryOfBirth: this.data.countryOfBirth?.toUpperCase() });
      this.profileForm.patchValue({ stateOfBirth: this.data.stateOfBirth?.toUpperCase() });
      if (!this.data.nationality) {
        this.profileForm.patchValue({ gender: '' });
        this.profileForm.patchValue({ nationality: STRINGS.MEXICAN });
        this.profileForm.patchValue({ countryOfBirth: STRINGS.MEXICO });
        this.profileForm.patchValue({ typeIden: AllowedValuesRfcNifTinNss.RFC });
      }
      this.profileForm.patchValue({ gender: this.data.gender });
    } else {
      this.profileForm.patchValue({ gender: '' });
      this.profileForm.patchValue({ nationality: STRINGS.MEXICAN });
      this.profileForm.patchValue({ countryOfBirth: STRINGS.MEXICO });
      this.profileForm.patchValue({ typeIden: AllowedValuesRfcNifTinNss.RFC });
    }
    this.formGroupEmitter.emit(this.profileForm);
  }

  ngAfterViewInit() {
    this.profileForm.valueChanges.subscribe(() => {
      this.unsavedChangesService.setUnsavedChanges(this.profileForm.dirty);
    });
    this.unsavedChangesService.setUnsavedChanges(false);
  }

  onDateInput(event: MatDatepickerInputEvent<Date>) {
    const date = event.value;
    const control = this.profileForm.get('dateOfBirth');

    if (date instanceof Date && control && this.pickerBirthdate) {
      this.pickerBirthdate.select(date);
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
      this.profileForm.patchValue({ dateOfBirth: null });
      curpControl?.disable();
      this.dataAux = 'NE'
      this.profileForm.patchValue({ stateOfBirth: '' });
      this.profileForm.patchValue({ nationality: '' });
      this.profileForm.patchValue({ countryOfBirth: '' });
      this.profileForm.patchValue({ dateOfBirth: null });
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
          this.profileForm.patchValue({ dateOfBirth: DateTimeUtils.toDate(dataCurp.payload.birthDate ?? null) });
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
    this.profileForm.patchValue({
      dateOfBirth: null,
      firstLastName: '',
      secondLastName: '',
      gender: '',
      stateOfBirth: '',
      firstName: '',
      middleName: '',
      rfc: '',
    });
  }

  //Function to fill fields through the CURP
  loadCurpData(): void {
    this.clear();
    if (REGEX.CURP_VALIDATION.test(this.profileForm.getRawValue().curp)) {
      let dCurp: string = this.profileForm.getRawValue().curp;
      this.profileForm.patchValue({ gender: dCurp.charAt(10) });
      const dob = this.getDateOfBirthFromCURP(dCurp);
      this.profileForm.patchValue(
        { dateOfBirth: dob },
        { emitEvent: false }
      );
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

    const leter = /^[aA-zZ]$/.test(curp.substring(16, 17));
    const fullYear = leter
      ? 2000 + year
      : 1900 + year;

    return new Date(fullYear, month - 1, day);
  }


  //function to validate the information
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
      control?.updateValueAndValidity({ emitEvent: false });
    });
    console.log(this.profileForm.getRawValue().dateOfBirth);
    if (
      this.profileForm.getRawValue().rfc?.trim() === ''
      || this.profileForm.getRawValue().firstName?.trim() === ''
      || this.profileForm.getRawValue().gender?.trim() === '' || this.profileForm.getRawValue().gender === null
      || (this.profileForm.getRawValue().dateOfBirth === '' || this.profileForm.getRawValue().dateOfBirth === null || this.profileForm.getRawValue().dateOfBirth === undefined)
      || ((this.profileForm.getRawValue().stateOfBirth?.trim() ?? '') === '' && (validP1 && validP2))
      || this.profileForm.getRawValue().countryOfBirth?.trim() === ''
      || this.profileForm.getRawValue().nationality?.trim() === ''
      || this.profileForm.getRawValue().typeIden === undefined
      || this.profileForm.getRawValue().typeIden === '') {
      this.error();
      this.notificationService.error('Faltan Campos Obligatorios por Capturar');
      return true;
    }
    if (this.countryTaxCodeAbroad && this.profileForm.getRawValue().countryTaxCodeAbroad?.trim() === '') {
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
      } else if (!REGEX.NIF_TIN_NSS_VALIDATION.test(this.profileForm.get('rfc')?.value) && (this.profileForm.getRawValue().typeIden === "2" ||
        this.profileForm.getRawValue().typeIden === "3" ||
        this.profileForm.getRawValue().typeIden === "4") && !this.profileForm.get('rfc')?.disabled) {
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
    if (this.checkCurpValidation) {
      if (this.validationDataCurp() != undefined && !this.foreignerCURP()) {
        return this.validationDataFormDataCURP();
      }
    } else {
      return false;
    }
    if (isExtranjero) {
      return false;
    }
    return true;
  }

  //function to validate the information PPE
  validadorPPE(): boolean {
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
      control?.updateValueAndValidity({ emitEvent: false });
    });
    console.log(this.profileForm.getRawValue().dateOfBirth?.value)
    if (
      this.profileForm.getRawValue().rfc?.trim() === ''
      || this.profileForm.getRawValue().firstName?.trim() === ''
      || (this.profileForm.getRawValue().dateOfBirth === '' || this.profileForm.getRawValue().dateOfBirth === null || this.profileForm.getRawValue().dateOfBirth === undefined)
      || ((this.profileForm.getRawValue().stateOfBirth?.trim() ?? '') === '' && (validP1 && validP2))
      || this.profileForm.getRawValue().countryOfBirth?.trim() === ''
      || this.profileForm.getRawValue().nationality?.trim() === ''
      || this.profileForm.getRawValue().typeIden?.trim() === undefined
      || this.profileForm.getRawValue().typeIden?.trim() === '') {
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
      } else if (!REGEX.NIF_TIN_NSS_VALIDATION.test(this.profileForm.get('rfc')?.value) && (this.profileForm.getRawValue().typeIden === "2" ||
        this.profileForm.getRawValue().typeIden === "3" ||
        this.profileForm.getRawValue().typeIden === "4") && !this.profileForm.get('rfc')?.disabled) {
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
    if (!this.profileForm.get('maritalStatus')?.valid && !this.profileForm.get('maritalStatus')?.disabled) {
      this.error();
      this.notificationService.error('Faltan Campos Obligatorios por Capturar');
      const controlMaritalStatus = this.profileForm.get('maritalStatus');
      controlMaritalStatus?.setErrors({ invalidFormat: true });
      controlMaritalStatus?.markAsTouched();
      return true;
    }
    if (this.checkCurpValidation) {
      if (this.validationDataCurp() != undefined && !this.foreignerCURP()) {
        return this.validationDataFormDataCURP();
      }
    } else {
      return false;
    }

    if (isExtranjero) {
      return false;
    }
    return true;
  }

  //function to validate the information PPE
  validadorFormComplet(): boolean {
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
      control?.updateValueAndValidity({ emitEvent: false });
    });
    console.log(this.profileForm.getRawValue().dateOfBirth === '');
    if (
      this.profileForm.getRawValue().rfc?.trim() === ''
      || this.profileForm.getRawValue().firstName?.trim() === ''
      || this.profileForm.getRawValue().gender?.trim() === '' || this.profileForm.getRawValue().gender === null
      || (this.profileForm.getRawValue().dateOfBirth === '' || this.profileForm.getRawValue().dateOfBirth === null || this.profileForm.getRawValue().dateOfBirth === undefined)
      || ((this.profileForm.getRawValue().stateOfBirth?.trim() ?? '') === '' && (validP1 && validP2))
      || this.profileForm.getRawValue().countryOfBirth?.trim() === ''
      || this.profileForm.getRawValue().nationality?.trim() === ''
      || this.profileForm.getRawValue().typeIden?.trim() === undefined
      || this.profileForm.getRawValue().typeIden?.trim() === '') {
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
      } else if (!REGEX.NIF_TIN_NSS_VALIDATION.test(this.profileForm.get('rfc')?.value) && (this.profileForm.getRawValue().typeIden === "2" ||
        this.profileForm.getRawValue().typeIden === "3" ||
        this.profileForm.getRawValue().typeIden === "4") && !this.profileForm.get('rfc')?.disabled) {
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
    if (!this.profileForm.get('gender')?.valid && !this.profileForm.get('gender')?.disabled) {
      this.error();
      this.notificationService.error('Faltan Campos Obligatorios por Capturar');
      const controlGender = this.profileForm.get('gender');
      controlGender?.setErrors({ invalidFormat: true });
      controlGender?.markAsTouched();
      return true;
    }
    if (!this.profileForm.get('maritalStatus')?.valid && !this.profileForm.get('maritalStatus')?.disabled) {
      this.error();
      this.notificationService.error('Faltan Campos Obligatorios por Capturar');
      const controlMaritalStatus = this.profileForm.get('maritalStatus');
      controlMaritalStatus?.setErrors({ invalidFormat: true });
      controlMaritalStatus?.markAsTouched();
      return true;
    }
    if (this.checkCurpValidation) {
      if (this.validationDataCurp() != undefined && !this.foreignerCURP()) {
        return this.validationDataFormDataCURP();
      }
    } else {
      return false;
    }
    if (isExtranjero) {
      return false;
    }
    return true;
  }

  //function to validate information and CURP
  validationDataFormDataCURP(): boolean {
    console.log(this.validationDataCurp())
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


  submitID(): DataClient | null {
    if (!this.validador()) {
      const data: DataClient = this.client();
      return mapFormToInitialData(data, false, this.data?.bankAreaTypeId?.toString() ?? '', this.data?.contractTypeId?.toString() ?? '', this.data?.typeContractSubtypeId?.toString() ?? '');
    }
    return null;
  }

  async submit(): Promise<DataClient | null> {
    if (!this.validador()) {
      this.curpAux = '';
      return this.client();
    }
    return null;
  }

  async submitPPE(): Promise<DataClient | null> {
    if (!this.validadorPPE()) {
      this.curpAux = '';
      return this.client();
    }
    return null;
  }

  async submitComplet(): Promise<DataClient | null> {
    if (!this.validadorFormComplet()) {
      this.curpAux = '';
      return this.client();
    }
    return null;
  }

  removeExtraSpaces(text: string): string {
    return text.replace(REGEX.MULTIPLE_SPACES, ' ');
  }

  //function to map to DataClient
  client = (): DataClient => this.profileForm.getRawValue() as DataClient;

  resetDefaults(): void {
    this.profileForm.reset();
    this.foreignerCURP.set(false);
    this.foreign.set(false);
    this.profileForm.patchValue({
      gender: '',
      nationality: STRINGS.MEXICAN,
      countryOfBirth: STRINGS.MEXICO,
      typeIden: AllowedValuesRfcNifTinNss.RFC
    });
    this.profileForm.get('curp')?.enable();
  }

  setClientData(data: DataClient): void {
    if (data) {
      this.validCurp = validCurp(data.curp || '', data.foreignerWithoutCurp || false);
      this.curpAux = data.curp ?? '';
      this.dataAux = data.curp?.toUpperCase().substring(11, 13);
      this.profileForm.patchValue({ curp: data.curp?.toUpperCase() });
      if (data.curp?.toUpperCase().substring(11, 13) === STRINGS.FOREIGN) {
        this.foreign.set(true);
        this.dataAux = 'NE'
        const curpControl = this.profileForm.get('curp');
        curpControl?.disable();
      }
      if (data.foreignerWithoutCurp === true) {
        this.foreignerCURP.set(true);
        this.dataAux = 'NE'
        const curpControl = this.profileForm.get('curp');
        curpControl?.disable();
      }
      this.profileForm.patchValue({ foreignerWithoutCurp: data.foreignerWithoutCurp });
      this.profileForm.patchValue({ rfc: data.rfc?.toUpperCase() });
      this.profileForm.patchValue({ typeIden: data.typeIden.toUpperCase() });
      this.profileForm.patchValue({ firstName: data.firstName?.toUpperCase() });
      this.profileForm.patchValue({ middleName: data.middleName?.toUpperCase() });
      this.profileForm.patchValue({ dateOfBirth: DateTimeUtils.toDate(data.dateOfBirth) });
      this.profileForm.patchValue({ firstLastName: data.firstLastName?.toUpperCase() });
      this.profileForm.patchValue({ secondLastName: data.secondLastName?.toUpperCase() });
      this.profileForm.patchValue({ gender: data.gender });
      this.profileForm.patchValue({ maritalStatus: data.maritalStatus });
      this.profileForm.patchValue({ nationality: data.nationality?.toUpperCase() });
      this.profileForm.patchValue({ countryOfBirth: data.countryOfBirth?.toUpperCase() });
      this.profileForm.patchValue({ stateOfBirth: data.stateOfBirth?.toUpperCase() });
    } else {
      this.profileForm.patchValue({ gender: '' });
      this.profileForm.patchValue({ nationality: STRINGS.MEXICAN });
      this.profileForm.patchValue({ countryOfBirth: STRINGS.MEXICO });
    }
  }

  setData(data: Client | null): void {
    if (data) {
      this.validCurp = validCurp(data.curp || '', data.foreignerWithoutCurp || false);
      this.curpAux = data.curp ?? '';
      this.dataAux = data.curp?.toUpperCase().substring(11, 13);
      this.profileForm.patchValue({ curp: data.curp?.toUpperCase() });
      if (data.curp?.toUpperCase().substring(11, 13) === STRINGS.FOREIGN) {
        this.foreign.set(true);
        this.dataAux = 'NE'
        const curpControl = this.profileForm.get('curp');
        curpControl?.disable();
      }
      if (data.foreignerWithoutCurp === true) {
        this.foreignerCURP.set(true);
        this.dataAux = 'NE'
        const curpControl = this.profileForm.get('curp');
        curpControl?.disable();
      }
      this.profileForm.patchValue({ foreignerWithoutCurp: data.foreignerWithoutCurp });
      this.profileForm.patchValue({ rfc: data.rfc?.toUpperCase() });
      this.profileForm.patchValue({ typeIden: data.typeIden?.toUpperCase() });
      this.profileForm.patchValue({ firstName: data.firstName?.toUpperCase() });
      this.profileForm.patchValue({ middleName: data.middleName?.toUpperCase() });
      this.profileForm.patchValue({ dateOfBirth: DateTimeUtils.toDate(data.dateOfBirth ?? null) });
      this.profileForm.patchValue({ firstLastName: data.firstLastName?.toUpperCase() });
      this.profileForm.patchValue({ secondLastName: data.secondLastName?.toUpperCase() });
      this.profileForm.patchValue({ gender: data.gender });
      this.profileForm.patchValue({ maritalStatus: data.maritalStatus });
      this.profileForm.patchValue({ nationality: data.nationality?.toUpperCase() });
      this.profileForm.patchValue({ countryOfBirth: data.countryOfBirth?.toUpperCase() });
      this.profileForm.patchValue({ stateOfBirth: data.stateOfBirth?.toUpperCase() });
    } else {
      this.profileForm.patchValue({ gender: '' });
      this.profileForm.patchValue({ nationality: STRINGS.MEXICAN });
      this.profileForm.patchValue({ countryOfBirth: STRINGS.MEXICO });
    }
  }

  /**
   * Custom "Enable Form" with proper validations.
   * Ex: Validates if Foreigner is True.
   */
  enableForm(): void {

    if ( this.profileForm.getRawValue().foreignerWithoutCurp === true
      || this.profileForm.getRawValue().curp?.toUpperCase().substring(11, 13) === STRINGS.FOREIGN
    ) {
      formFunctionEnAll(this.profileForm, ['curp']);
    } else {
      formFunctionEnAll(this.profileForm);
    }

  }
}
