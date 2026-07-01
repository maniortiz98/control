import { Component, effect, Inject, inject, Input, signal, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { CustomerREGEX, CustomerSTRINGS } from '../../../constants/customer-constants';
import { CustomerEconomicActivity } from '../../../models/customer-economic-activity';
import { CustomerRelationships } from '../../../models/customer-relationships';
import { CustomerCity } from '../../../models/customer-city';
import { CustomerCountries } from '../../../models/customer-country';
import { CustomerEntity } from '../../../models/customer-entity';
import { CustomerMaritalStatus } from '../../../models/customer-marital-status';
import { CustomerNationalities } from '../../../models/customer-nationality';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { CustomerCatalogsService } from '../../../services/customer-catalogs.service';
import { CustomerNotificationModalService } from '../../../services/customer-notification-modal.service';
import { CustomerNotificationsService } from '../../../services/customer-notifications.service';
import { CustomerPositionHeldComponent } from '../../sections/position-held/customer-position-held.component';
import { DataRealOwnerClientFamilyPPE } from '../../../models/customer-real-owner';
import { MatRadioChange } from '@angular/material/radio';
import { CustomerAllowedValuesRfcNifTinNss } from '../../../utils/customer-map-rfc-nif-tin-nss';
import { formatDateYYYYMMDD, yearsAgo, yearsAgoLegacy } from '../../../utils/customer-datetime';
import { butonFunctionDis, buttonFunctionEn, formFunctionDis, formFunctionEnAll } from '../../../utils/customer-disable-or-enabled';
import { CustomerCurpValidationResponse } from '../../../models/customer-curp-valid';
import { CustomerValidCurpService } from '../../../services/curp-valid/customer-valid-curp.service';
import { countSpaces, validCurp } from '../../../utils/customer-curp-valid';
import { CustomerSearchClientFlowService } from '../../../services/customer-search-client-flow.service';
import { DataClient } from '../../../models/customer-client-data';
import { minDateValidator, maxDateValidator } from '../../../utils/customer-validators';
import moment from 'moment';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';


@Component({
  selector: 'app-customer-modal-ppe-family',
  standalone: false,
  templateUrl: './customer-modal-ppe-family.component.html',
  styleUrl: './customer-modal-ppe-family.component.scss'
})
export class CustomerModalPpeFamilyComponent {

  @ViewChild(CustomerPositionHeldComponent) positionHeldComponent!: CustomerPositionHeldComponent;
  @ViewChild('pickerBirthdate') pickerBirthdate!: MatDatepicker<Date>;

  birthDates = {
    startAt: yearsAgo(18),
    max: new Date(),
    min: yearsAgo(150),
  };
  //Inject
  private readonly catalogService = inject(CustomerCatalogsService);
  private readonly fb = inject(FormBuilder);
  readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(CustomerNotificationsService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly notificationModalService = inject(CustomerNotificationModalService);
  private readonly validCurpService = inject(CustomerValidCurpService);
  private readonly searchClientFlowService = inject(CustomerSearchClientFlowService);

  profileForm: FormGroup = this.fb.group({

    curp: [{ value: '', disabled: false }, [Validators.required, Validators.pattern(CustomerREGEX.CURP_VALIDATION)]],
    foreignerWithoutCurp: [false],
    rfc: ['', [Validators.required]],
    firstName: ['', [Validators.required, Validators.pattern(CustomerREGEX.FIRST_NAME_VALIDATION)]],
    middleName: ['', [Validators.pattern(CustomerREGEX.FIRST_NAME_VALIDATION)]],
    dateOfBirth: ['', [Validators.required, minDateValidator(this.birthDates.min), maxDateValidator(this.birthDates.max)]],
    firstLastName: ['', [Validators.pattern(CustomerREGEX.LAST_NAME_VALIDATION)]],
    secondLastName: ['', [Validators.pattern(CustomerREGEX.LAST_NAME_VALIDATION)]],
    nationality: ['', [Validators.required, Validators.pattern(CustomerREGEX.STATE_VALIDATION)]],
    countryOfBirth: ['', Validators.required],
    countryTaxCodeAbroad: [''],
    typeIden: ['', [Validators.required]],
  });

  //Signals
  errors = signal<string[]>([]);
  nationalities = signal<CustomerNationalities[]>([]);
  countries = signal<Array<CustomerCountries>>([]);
  cities = signal<CustomerCity[]>([]);
  foreignCities: CustomerCity[] = [];
  foreignerCURP = signal(false);
  foreign = signal(false);
  states = signal<CustomerEntity[]>([]);
  maritalStatus = signal<CustomerMaritalStatus[]>([]);
  typeIden = signal(false);
  showcountry = signal(false);

  economicActivity = signal<CustomerEconomicActivity[]>([]);
  relationships = signal<Array<CustomerRelationships>>([]);

  curpAux = '';

  constructor(private readonly modalRef: MatDialogRef<CustomerModalPpeFamilyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) {
    console.log(this.data)
    document.body.classList.remove('show-validation');
  }

  close() {
    this.modalRef.close(null);
  }

  isNotEmpty(obj: any) {
    return Object.keys(obj).length > 0;
  }

  ngOnInit() {
    this.showcountry.set(this.data.showCountry);
    console.log(this.showcountry());
    this.catalogService.getEconomicActivity({ lineBusinessId: [] }).subscribe(m => {
      this.economicActivity.set(m);
    });
    const bbRel = {
      bool: '',
      clientId: '',
      language: '',
    };
    this.catalogService.getRelationships(bbRel).subscribe(c => {
      this.relationships.set(c);
    });

    this.catalogService.getCountry({ land: [] }).subscribe(c => {
      this.countries.set(c);
    });

    this.catalogService.getNationalities({ land: [] }).subscribe(c => {
      this.nationalities.set(c);
    });

    this.catalogService.getFederalEntity({ land1s: ["MX"] }).subscribe(c => {
      this.states.set(c);
    });

    console.log(this.data.dataClient)
    if (this.data.dataClient && this.isNotEmpty(this.data.dataClient)) {
      this.validCurp = validCurp(this.data.dataClient.curp || '', this.data.dataClient.foreignerWithoutCurp || false);
      this.curpAux = this.data.dataClient.curp ?? '';
      this.profileForm.patchValue({ curp: this.data.dataClient.curp?.toUpperCase() });
      console.log('primer if')
      if (this.data.curp?.toUpperCase().substring(11, 13) === CustomerSTRINGS.FOREIGN) {
        this.foreign.set(true);
      }
      if (this.data.dataClient.foreignerWithoutCurp === true) {
        this.foreignerCURP.set(true);
        const curpControl = this.profileForm.get('curp');

        curpControl?.disable();
        console.log('segundo if')
      }
      this.profileForm.patchValue({ foreignerWithoutCurp: this.data.dataClient.foreignerWithoutCurp });
      this.profileForm.patchValue({ rfc: this.data.dataClient.rfc?.toUpperCase() });
      this.profileForm.patchValue({ firstName: this.data.dataClient.firstName?.toUpperCase() });
      this.profileForm.patchValue({ middleName: this.data.dataClient.middleName?.toUpperCase() });
      this.profileForm.patchValue({ dateOfBirth: this.data.dataClient.dateOfBirth });
      this.profileForm.patchValue({ firstLastName: this.data.dataClient.firstLastName?.toUpperCase() });
      this.profileForm.patchValue({ secondLastName: this.data.dataClient.secondLastName?.toUpperCase() });
      this.profileForm.patchValue({ nationality: this.data.dataClient.nationality?.toUpperCase() });
      if (this.showcountry() === true) {
        this.profileForm.patchValue({ countryOfBirth: this.data.dataClient.countryOfBirth?.toUpperCase() });
      }
      this.profileForm.patchValue({ countryTaxCodeAbroad: this.data.dataClient.countryTaxCodeAbroad?.toUpperCase() });
      if (this.data.dataClient.countryTaxCodeAbroad) {
        this.typeIden.set(true);
      }
      this.profileForm.patchValue({ typeIden: this.data.dataClient.typeIden?.toUpperCase() });
    } else {
      this.profileForm.patchValue({ nationality: CustomerSTRINGS.MEXICAN });
      if (this.showcountry() === true) {
        this.profileForm.patchValue({ countryOfBirth: CustomerSTRINGS.MEXICO });
      }
      this.profileForm.patchValue({ typeIden: CustomerAllowedValuesRfcNifTinNss.RFC });
    }
  }

  ngAfterViewInit() {
    this.profileForm.valueChanges.subscribe(() => {
      this.unsavedChangesService.setUnsavedChanges(this.profileForm.dirty);
    });
    if (this.data.mant.isMainten === true) {
      if (this.data.mant.allDisabled === true) {
        formFunctionDis(this.profileForm);
        formFunctionDis(this.positionHeldComponent.profileForm);
        butonFunctionDis(this.data.mant.butonsDisabled);
        butonFunctionDis(['btnAddFamModal']);
      } else {
        formFunctionDis(this.profileForm);
        if (this.data.dataClient?.foreignerWithoutCurp === true) {
          formFunctionEnAll(this.profileForm, ['curp']);
        } else {
          formFunctionEnAll(this.profileForm);
        }
        formFunctionEnAll(this.positionHeldComponent.profileForm);
        buttonFunctionEn(['btnAddFamModal']);
      }
    } else {
      if (this.data.dataClient.isView === true && this.data.dataClient.isSaved === true) {
        formFunctionDis(this.profileForm);
        formFunctionDis(this.positionHeldComponent.profileForm);
        butonFunctionDis(['btnAddFamModal']);
      }
    }
  }
  onForeignerClick(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.foreignerCURP.set(checked);
    const isExtranjero = this.foreignerCURP();
    const curpControl = this.profileForm.get('curp');
    if (isExtranjero) {
      this.profileForm.patchValue({ curp: '' });
      this.profileForm.patchValue({ dateOfBirth: '' });
      curpControl?.disable();
      this.profileForm.patchValue({ stateOfBirth: '' });
      this.profileForm.patchValue({ nationality: '' });
      this.profileForm.patchValue({ countryOfBirth: '' });
      this.profileForm.patchValue({ dateOfBirth: '' });
    } else {
      this.profileForm.patchValue({ typeIden: CustomerAllowedValuesRfcNifTinNss.RFC });
      this.profileForm.patchValue({ gender: '' });
      this.profileForm.patchValue({ nationality: CustomerSTRINGS.MEXICAN });
      this.profileForm.patchValue({ countryOfBirth: CustomerSTRINGS.MEXICO });
      this.profileForm.patchValue({ stateOfBirth: '' });
      curpControl?.enable();
    }
  }

  onSelectionChangeTypeIden(event: MatRadioChange<any>) {
    const countryTaxCodeAbroad = this.profileForm.get('countryTaxCodeAbroad');
    console.log(event.value)
    if (event.value === "2" || event.value === "3" || event.value === "4") {
      if (this.showcountry() === true) {
        this.typeIden.set(true);
      }

      this.profileForm.patchValue({ countryTaxCodeAbroad: '' });
      countryTaxCodeAbroad?.setValidators(Validators.required);
    }
    if (event.value === "1") {
      if (this.showcountry() === true) {
        this.typeIden.set(false);
      }
      this.profileForm.patchValue({ countryTaxCodeAbroad: '' });
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

  //Function to obtain the RFC
  getRFC(rfc: string, curp: string): string {
    return curp.substring(0, 10) + rfc.substring(10, 13)
  }

  validCurp = false;
  async loadCurpDataService(): Promise<void> {
    if (CustomerREGEX.CURP_VALIDATION.test(this.profileForm.getRawValue().curp) && this.profileForm.getRawValue()?.curp?.substring(11, 13) != CustomerSTRINGS.FOREIGN) {
      let dataCurp: CustomerCurpValidationResponse = {
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
          })) as CustomerCurpValidationResponse;
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
          if (CustomerREGEX.RFC_VALIDATION.test(this.profileForm.getRawValue().rfc)) {
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
    } else if (CustomerREGEX.CURP_VALIDATION.test(this.profileForm.getRawValue().curp) && this.profileForm.getRawValue()?.curp?.substring(11, 13) === CustomerSTRINGS.FOREIGN) {
      this.loadCurpData();
      this.validCurp = true;
    } else {
      this.clear();
      this.notificationService.error('Ingresa una CURP Válida.');
      this.validCurp = false;
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
    if (CustomerREGEX.CURP_VALIDATION.test(this.profileForm.getRawValue().curp)) {
      let dCurp: string = this.profileForm.getRawValue().curp;
      this.profileForm.patchValue({ gender: dCurp.charAt(10) });
      this.profileForm.patchValue({ dateOfBirth: this.getDateOfBirthFromCURP(dCurp) });
      if (CustomerREGEX.RFC_VALIDATION.test(this.profileForm.getRawValue().rfc)) {
        this.profileForm.patchValue({ rfc: this.getRFC(this.profileForm.getRawValue().rfc, dCurp) });
      } else {
        this.profileForm.patchValue({ rfc: dCurp.substring(0, 10) });
      }

      if (dCurp.substring(11, 13) != CustomerSTRINGS.FOREIGN) {
        this.foreign.set(false);
        this.profileForm.patchValue({ nationality: CustomerSTRINGS.MEXICAN });
        if (this.showcountry() === true) {
          this.profileForm.patchValue({ countryOfBirth: CustomerSTRINGS.MEXICO });
        }
      }
      else {
        this.foreign.set(true);
        this.profileForm.patchValue({ nationality: '' });
        if (this.showcountry() === true) {
          this.profileForm.patchValue({ countryOfBirth: CustomerSTRINGS.MEXICO });
        }
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
    console.log(this.validationDataCurp());
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

    Object.entries(this.profileForm.controls).forEach(([key, control]) => {
      if (control.invalid) {
        control.markAsTouched();
        console.warn(`Campo inválido (raíz): ${key}`, control.errors);
      }
    });

  }

  validador(): boolean {
    const rfc = this.profileForm.get('rfc');
    const dateOfBirth = this.profileForm.get('dateOfBirth');
    const timeToLiveInMexico = this.profileForm.get('timeLiveMexico');
    const reasons = this.profileForm.get('reasonsOpeningContractMexico');
    const isExtranjero = this.foreignerCURP();

    document.body.classList.add('show-validation');

    //rfc?.clearValidators();
    //dateOfBirth?.clearValidators();
    Object.keys(this.profileForm.controls).forEach(controlName => {
      const control = this.profileForm.get(controlName);
      control?.updateValueAndValidity();
    });

    if (
      this.profileForm.getRawValue().firstName?.trim() === ''
      || this.profileForm.getRawValue().nationality?.trim() === ''
      || (this.profileForm.getRawValue().countryOfBirth?.trim() === '' && this.showcountry() === true)
    ) {
      this.error();
      this.notificationService.error('Faltan Campos Obligatorios por Capturar');
      return true;
    }
    console.log(this.profileForm.getRawValue().typeIden)
    if (this.profileForm.getRawValue().rfc?.trim() != '') {
      if (this.profileForm.getRawValue().typeIden != "1" &&
        this.profileForm.getRawValue().typeIden != "2" &&
        this.profileForm.getRawValue().typeIden != "3" &&
        this.profileForm.getRawValue().typeIden != "4") {
        const controlTypeIden = this.profileForm.get('typeIden');
        controlTypeIden?.setErrors({ invalidFormat: true });
        controlTypeIden?.markAsTouched();
        this.error();
        this.notificationService.error('Faltan Campos Obligatorios por Capturar');
        return true;
      }
    }
    if (
      this.profileForm.getRawValue().curp?.trim() === ''
      && this.profileForm.getRawValue().rfc?.trim() === ''
      && (this.profileForm.getRawValue().dateOfBirth?.value === '' || this.profileForm.getRawValue().dateOfBirth === null || this.profileForm.getRawValue().dateOfBirth === undefined)
    ) {
      const controlCurp = this.profileForm.get('curp');
      controlCurp?.setErrors({ invalidFormat: true });
      controlCurp?.markAsTouched();

      const controlRfc = this.profileForm.get('rfc');
      controlRfc?.setErrors({ invalidFormat: true });
      controlRfc?.markAsTouched();
      this.error();

      const controlDateOfBirth = this.profileForm.get('dateOfBirth');
      controlDateOfBirth?.setErrors({ invalidFormat: true });
      controlDateOfBirth?.markAsTouched();
      this.error();
      this.notificationService.error('Un Campos es Obligatorio Por lo Menos');
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
      if (!CustomerREGEX.RFC_VALIDATION.test(this.profileForm.get('rfc')?.value) && this.profileForm.getRawValue().typeIden === "1" && !this.profileForm.get('curp')?.disabled) {
        const controlRfc = this.profileForm.get('rfc');
        controlRfc?.setErrors({ invalidFormat: true });
        controlRfc?.markAsTouched();
        this.error();
        this.notificationService.error('Tienes Campos Capturados con Formato Incorrecto')
        return true;
      } else if ((!CustomerREGEX.NIF_TIN_NSS_VALIDATION.test(this.profileForm.get('rfc')?.value) && (this.profileForm.getRawValue().typeIden === "2" ||
        this.profileForm.getRawValue().typeIden === "3" ||
        this.profileForm.getRawValue().typeIden === "4") && !this.profileForm.get('curp')?.disabled)) {
        const controlRfc = this.profileForm.get('rfc');
        controlRfc?.setErrors({ invalidFormat: true });
        controlRfc?.markAsTouched();
        this.error();
        this.notificationService.error('Tienes Campos Capturados con Formato Incorrecto')
        return true;
      }
    }
    if (this.profileForm.getRawValue().dateOfBirth != '') {
      if (!this.profileForm.get('dateOfBirth')?.valid && !this.profileForm.get('curp')?.disabled) {
        this.error();
        this.notificationService.error('Fecha de Nacimiento no Válida')
        return true;
      }
    }
    if (!this.profileForm.get('firstName')?.valid && !this.profileForm.get('curp')?.disabled) {
      this.error();
      this.notificationService.error('Ingresa un Nombre Válido.')
      return true;
    }
    if (!this.profileForm.get('middleName')?.valid && !this.profileForm.get('curp')?.disabled) {
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
    if (!this.profileForm.get('firstLastName')?.valid && !this.profileForm.get('curp')?.disabled) {
      const controlPApellido = this.profileForm.get('firstLastName');
      controlPApellido?.setErrors({ invalidFormat: true });
      controlPApellido?.markAsTouched();
      this.notificationService.error('Ingresa Primer Apellido Válido.');
      return true;
    }
    if (!this.profileForm.get('secondLastName')?.valid && !this.profileForm.get('curp')?.disabled) {
      const controlPApellido = this.profileForm.get('secondLastName');
      controlPApellido?.setErrors({ invalidFormat: true });
      controlPApellido?.markAsTouched();
      this.notificationService.error('Ingresa Segundo Apellido Válido.');
      return true;
    }

    if (this.profileForm.getRawValue().dateOfBirth?.value != '' && this.profileForm.getRawValue().dateOfBirth != null) {
      if (this.validationDataCurp() != undefined && !this.foreignerCURP()) {
        return this.validationDataFormDataCURP();
      }
    }
    if (isExtranjero) {
      console.log({ isExtranjero })
      const countryOfBirth = this.profileForm.get('countryOfBirth');
      const countryTaxCodeAbroad = this.profileForm.get('countryTaxCodeAbroad');
      countryOfBirth?.clearValidators()
      countryTaxCodeAbroad?.clearValidators()
      countryOfBirth?.updateValueAndValidity()
      countryTaxCodeAbroad?.updateValueAndValidity()
      if (this.profileForm.valid) {
        return false;
      }
      this.error();
      this.notificationService.error('Faltan Campos Obligatorios por Capturar');
      return true;
    }
    return true;
  }


  async submit(): Promise<DataRealOwnerClientFamilyPPE | null> {
    console.log('respuesta del validador')
    console.log(this.validador())
    if (!this.validador()) {
      const data: DataRealOwnerClientFamilyPPE = this.client();
      this.curpAux = '';
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
      const result = await this.searchClientFlowService.validInWatchList(dataBody);
      if(result){
        return this.client();
      }
      return null
    } else {
      return null;
    }
  }

  removeExtraSpaces(text: string) {
    return text.replace(CustomerREGEX.MULTIPLE_SPACES, ' ');
  }

  //function to map to DataClient
  client = (): DataRealOwnerClientFamilyPPE => this.profileForm.getRawValue() as DataRealOwnerClientFamilyPPE;

  // changeDateFormat(date: string) {
  //   const parts = date.split('-');
  //   const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  //   return formattedDate;
  // }

  setClientData(data: DataRealOwnerClientFamilyPPE) {
    if (data) {
      this.validCurp = validCurp(data.curp || '', data.foreignerWithoutCurp || false);
      this.curpAux = data.curp ?? '';
      this.profileForm.patchValue({ curp: data.curp?.toUpperCase() });
      if (data.curp?.toUpperCase().substring(11, 13) === CustomerSTRINGS.FOREIGN) {
        this.foreign.set(true);
        const curpControl = this.profileForm.get('curp');
        curpControl?.disable();
      }
      if (data.foreignerWithoutCurp === true) {
        this.foreignerCURP.set(true);
        const curpControl = this.profileForm.get('curp');
        curpControl?.disable();
      }
      this.profileForm.patchValue({ foreignerWithoutCurp: data.foreignerWithoutCurp });
      this.profileForm.patchValue({ rfc: data.rfc?.toUpperCase() });
      this.profileForm.patchValue({ firstName: data.firstName?.toUpperCase() });
      this.profileForm.patchValue({ middleName: data.middleName?.toUpperCase() });
      this.profileForm.patchValue({ dateOfBirth: data.dateOfBirth });
      this.profileForm.patchValue({ firstLastName: data.firstLastName?.toUpperCase() });
      this.profileForm.patchValue({ secondLastName: data.secondLastName?.toUpperCase() });
      this.profileForm.patchValue({ nationality: data.nationality?.toUpperCase() });
      if (this.showcountry() === true) {
        this.profileForm.patchValue({ countryOfBirth: data.countryOfBirth?.toUpperCase() });
      }
      this.profileForm.patchValue({ countryTaxCodeAbroad: data.countryTaxCodeAbroad?.toUpperCase() });
      if (data.countryTaxCodeAbroad) {
        this.typeIden.set(true);
      }
      this.profileForm.patchValue({ typeIden: data.typeIden?.toUpperCase() });
    } else {
      this.profileForm.patchValue({ nationality: CustomerSTRINGS.MEXICAN });
      this.profileForm.patchValue({ countryOfBirth: CustomerSTRINGS.MEXICO });
    }
  }

  async saveFppe() {
    document.body.classList.add('show-validation');
    const resultData = await this.submit();
    const resultDataPositionHeld = await this.positionHeldComponent.sendInformation();
    if (resultData !== null && resultDataPositionHeld !== null) {
      const data: DataRealOwnerClientFamilyPPE = {
        ...resultData,
        ...resultDataPositionHeld
      }
      this.modalRef.close(data);
    }
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
}












