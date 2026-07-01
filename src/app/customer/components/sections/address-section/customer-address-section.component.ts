import { Component, inject, Input, signal, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerADDRESS, CustomerSTRINGS } from '../../../constants/customer-constants';
import { CustomerCountries } from '../../../models/customer-country';
import { CustomerCatalogsService } from '../../../services/customer-catalogs.service';
import { MatRadioChange } from '@angular/material/radio';
import { CustomerEntity } from '../../../models/customer-entity';
import { DataClient } from '../../../models/customer-client-data';
import { CustomerAddress, CustomerAddressRole, CustomerAddressType, CustomerProofOfAddressType } from '../../../models/customer-address';
import { CustomerNotificationsService } from '../../../services/customer-notifications.service';
import { CustomerZipCodeService } from '../../../services/customer-zip-code.service';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { CustomerSuburbItem, CustomerZipCode, CustomerZipCodeRequest } from '../../../models/customer-zip-code';
import { map } from 'rxjs';
import { Data } from '../../../models/checkpoints/customer-initial-data-checkpoint';
import { CustomerNotificationFormRegistry } from '../../../services/notifications/customer-notification-form-registry.service';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-customer-address-section',
  standalone: false,
  templateUrl: './customer-address-section.component.html',
  styleUrl: './customer-address-section.component.scss'
})
export class CustomerAddressSectionComponent {

  @Input() dataAddress?: CustomerAddress | null = null;
  @Input() hideRoleSection?: boolean = false;
  @Input() hideProofOfAddressSection?: boolean = false;
  @Input() setReadonly?: boolean = false;
  @Input() setReadonlyDomicileTypes?: boolean = false;
  @Input() dataClient: Data | null = null;
  @Input() addressClient?: boolean = false;
  @Input() hideAddresstype: boolean = false;
  @Input() mant?: boolean = false;
  @Input() filter?: boolean = false;

  @ViewChild('pickerBirthdate') pickerBirthdate!: MatDatepicker<Date>;

  private readonly fb = inject(FormBuilder);
  private readonly catalogService = inject(CustomerCatalogsService);
  private readonly zipCodeService = inject(CustomerZipCodeService);
  private readonly notificationService = inject(CustomerNotificationsService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly notificationRegistry = inject(CustomerNotificationFormRegistry);

  countries = signal<Array<CustomerCountries>>([]);
  states = signal<CustomerEntity[]>([]);
  domicileRole = signal(true);
  taxDomicile = signal(false);
  domicileType = signal(false);
  countryType = signal(false);
  timeToLiveInMexico = signal(false);

  profileForm: FormGroup = this.fb.nonNullable.group({
    addressRole: [''],
    addressType: ['', Validators.required],
    other: [''],
    country: ['', Validators.required],
    postalCode: ['', Validators.required],
    federalEntity: ['', Validators.required],
    city: ['', Validators.required],
    municipality: ['', Validators.required],
    neighborhood: ['', Validators.required],
    street: ['', Validators.required],
    externalNumber: ['', Validators.required],
    internalNumber: [''],
    confirmCp: [null, Validators.required],
    timeLiveMexico: ['', Validators.required],
    reasonsOpeningContractMexico: ['', Validators.required],
    proofOfAddressType: ['', Validators.required],
    addressProofIssueDate: ['', Validators.required],
    expirationYear: ['',],
    taxPostalCode: ['',],
    geographicalArea: ['',],
    deliveryCenter: ['',],
    federalEntityID: ['',],
    cityID: ['',],
    municipalityID: ['',],
  })


  zipCode: CustomerZipCode | null = null;
  readonly domicileRoles = signal<CustomerAddressRole[]>([]);
  readonly domicileTypes = signal<CustomerAddressType[]>([]);
  readonly domiliceProof = signal<CustomerProofOfAddressType[]>([]);
  colony = signal<CustomerSuburbItem[]>([]);

  auxpostalCode: string = '';

  constructor() {
    document.body.classList.remove('show-validation');
  }

  toggleControls(formGroup: FormGroup | FormArray, disable: boolean) {
    Object.keys(formGroup.controls).forEach(key => {
      const control: AbstractControl = formGroup.get(key)!;
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.toggleControls(control, disable);
      } else {
        disable ? control.disable() : control.enable();
      }
    });
  }

  ngOnInit() {
    if (this.setReadonly) {
      this.toggleControls(this.profileForm, true);
    }
    this.catalogService.getAddressRole({ idRolDomicilioCve: [] }).subscribe(c => {
      this.domicileRoles.set(c)
    });
    this.catalogService.getCountry({ land: [] }).subscribe(c => {
      this.countries.set(c);
    });

    this.catalogService.getFederalEntity({ land1s: ["MX"] }).subscribe(c => {
      this.states.set(c);
    });

    this.catalogService.getAddressType({ addressTypeIds: [] }).subscribe(c => {
      if (this.filter) {
        const filteredData = c.filter(item => item.addressTypeId === "1");
        this.domicileTypes.set(filteredData);
      } else {
        this.domicileTypes.set(c);
      }
    });

    this.catalogService.getProofOfAddress({ proofAddressIds: [] }).subscribe(c => {
      const filteredData = c.filter(item => item.personTypeId === "1");
      this.domiliceProof.set(filteredData);
    });

    if (this.dataClient) {
      if (this.dataClient?.nationality != CustomerSTRINGS.MEXICAN) {
        this.timeToLiveInMexico.set(true);
      }
    }

    if (this.dataAddress) {
      this.onItemSelectDomiciledType(this.dataAddress.addressType?.toUpperCase() ?? '');
      this.onItemSelectCountry(this.dataAddress.country?.toUpperCase() ?? '');
      this.profileForm.patchValue({ addressRole: this.dataAddress.addressRole?.toUpperCase() });
      this.profileForm.patchValue({ addressType: this.dataAddress.addressType?.toUpperCase() });
      this.profileForm.patchValue({ other: this.dataAddress.other?.toUpperCase() });
      this.profileForm.patchValue({ country: this.dataAddress.country?.toUpperCase() });
      this.profileForm.patchValue({ street: this.dataAddress.street?.toUpperCase() });
      this.profileForm.patchValue({ externalNumber: this.dataAddress.externalNumber?.toUpperCase() });
      this.profileForm.patchValue({ internalNumber: this.dataAddress.internalNumber?.toUpperCase() });
      this.profileForm.patchValue({ confirmCp: this.dataAddress.confirmCp?.toUpperCase() });
      this.profileForm.patchValue({ timeLiveMexico: this.dataAddress.timeLiveMexico?.toUpperCase() });
      this.profileForm.patchValue({ reasonsOpeningContractMexico: this.dataAddress.reasonsOpeningContractMexico?.toUpperCase() });
      this.profileForm.patchValue({ proofOfAddressType: this.dataAddress.proofOfAddressType?.toUpperCase() });
      this.profileForm.patchValue({ addressProofIssueDate: this.dataAddress.addressProofIssueDate });
      this.profileForm.patchValue({ expirationYear: this.dataAddress.expirationYear });
      this.profileForm.patchValue({ taxPostalCode: this.dataAddress.taxPostalCode?.toUpperCase() });
      this.profileForm.patchValue({ geographicalArea: this.dataAddress.geographicalArea?.toUpperCase() });
      this.profileForm.patchValue({ deliveryCenter: this.dataAddress.deliveryCenter?.toUpperCase() });

      const postalCode: CustomerZipCodeRequest = {
        zipCode: this.dataAddress.postalCode
      }
      this.auxpostalCode = this.dataAddress.postalCode;
      const hasZipCode =
        typeof this.dataAddress.postalCode === 'string' &&
        this.dataAddress.postalCode?.trim()?.length > 0;
      if (this.dataAddress.country === CustomerSTRINGS.MEXICO && hasZipCode) {
        this.zipCodeService.postData(postalCode).subscribe(zipCode => {
          this.zipCode = zipCode;
          if (this.zipCode) {
            this.colony.set(zipCode.listSuburb.item);
            this.profileForm.patchValue({ postalCode: this.dataAddress?.postalCode });
            this.profileForm.patchValue({ federalEntity: this.zipCode.federalEntity?.toUpperCase() });
            this.profileForm.patchValue({ city: this.zipCode.cityDesc?.toUpperCase() });
            this.profileForm.patchValue({ municipality: this.zipCode.townDesc?.toUpperCase() });
            this.profileForm.patchValue({ neighborhood: this.dataAddress?.neighborhood?.toUpperCase() });

            this.profileForm.patchValue({ federalEntityID: this.zipCode.federalEntityId });
            this.profileForm.patchValue({ cityID: this.zipCode.city });
            this.profileForm.patchValue({ municipalityID: this.zipCode.town });
          }
        });
      } else {
        this.profileForm.patchValue({ postalCode: this.dataAddress?.postalCode });
        this.profileForm.patchValue({ federalEntity: this.dataAddress.federalEntity });
        this.profileForm.patchValue({ city: this.dataAddress.city?.toUpperCase() });
        this.profileForm.patchValue({ municipality: this.dataAddress.municipality?.toUpperCase() });
        this.profileForm.patchValue({ neighborhood: this.dataAddress?.neighborhood?.toUpperCase() });
        this.profileForm.patchValue({ federalEntityID: '' });
        this.profileForm.patchValue({ cityID: '' });
        this.profileForm.patchValue({ municipalityID: '' });
      }

      const controlTaxPostalCode = this.profileForm.get('taxPostalCode');
      if (this.dataAddress.confirmCp?.toUpperCase() === 'YES') {
        controlTaxPostalCode?.clearValidators();
        this.taxDomicile = signal(false);
      }
      if (this.dataAddress.confirmCp?.toUpperCase() === 'NO') {
        controlTaxPostalCode?.setValidators([Validators.required]);
        this.taxDomicile = signal(true);
      }
      if (this.dataAddress.addressType?.toUpperCase() === "4") {
        this.domicileType = signal(true);
        this.profileForm.patchValue({ other: this.dataAddress.other?.toUpperCase() });
      }
    } else {
      this.profileForm.patchValue({ country: CustomerSTRINGS.MEXICO });
      this.onItemSelectCountry(CustomerSTRINGS.MEXICO);
    }
    this.notificationRegistry.registerForm(this.profileForm);
  }
  onDateInput(event: MatDatepickerInputEvent<Date>) {
    const date = event.value;
    const control = this.profileForm.get('addressProofIssueDate');

    if (date instanceof Date && control && this.pickerBirthdate) {
      this.pickerBirthdate.select(date);
    }
  }

  searchIdByName(name: string): string {
    const domicileTypes = this.domicileTypes();
    const dat = domicileTypes.find(dat => dat.addressType === name);
    return dat ? dat.addressTypeId : '';
  }

  onSelectionChangeConfirmCp(event: MatRadioChange<any>) {
    const controlTaxPostalCode = this.profileForm.get('taxPostalCode');
    if (event.value === 'YES') {
      controlTaxPostalCode?.clearValidators();
      this.taxDomicile = signal(false);
    }
    if (event.value === 'NO') {
      controlTaxPostalCode?.setValidators([Validators.required]);
      this.taxDomicile = signal(true);
    }
  }

  onItemSelectDomiciledType(item: string) {
    if (item != CustomerADDRESS.DOMICILE_TYPE) {
      this.profileForm.patchValue({ other: '' });
      this.domicileType = signal(false);
    } else {
      this.domicileType = signal(true);
    }
  }

  onItemSelectCountry(item: string) {
    this.auxpostalCode = "";
    const state = this.profileForm.get('federalEntity');
    const city = this.profileForm.get('city');
    const delegation = this.profileForm.get('municipality');
    if (item != CustomerSTRINGS.MEXICO) {
      this.countryType.set(true);
      state?.enable();
      city?.enable();
      delegation?.enable();
      this.profileForm.patchValue({ federalEntity: '' });
      this.profileForm.patchValue({ city: '' });
      this.profileForm.patchValue({ municipality: '' });
      this.profileForm.patchValue({ postalCode: '' });
      this.profileForm.patchValue({ neighborhood: '' });
      this.profileForm.patchValue({ federalEntityID: '' });
      this.profileForm.patchValue({ cityID: '' });
      this.profileForm.patchValue({ municipalityID: '' });
      this.colony = signal<CustomerSuburbItem[]>([]);
    } else {
      this.countryType.set(false);
      state?.disable();
      city?.disable();
      delegation?.disable();
      this.profileForm.patchValue({ federalEntity: '' });
      this.profileForm.patchValue({ city: '' });
      this.profileForm.patchValue({ municipality: '' });
      this.profileForm.patchValue({ postalCode: '' });
      this.profileForm.patchValue({ neighborhood: '' });
      this.profileForm.patchValue({ federalEntityID: '' });
      this.profileForm.patchValue({ cityID: '' });
      this.profileForm.patchValue({ municipalityID: '' });
      this.colony = signal<CustomerSuburbItem[]>([]);
    }
  }

  onItemSelectNeighborhood(item: string, itemNeighborhoodName: string) {
    this.profileForm.patchValue({ deliveryCenter: item.toUpperCase() });
    this.profileForm.patchValue({ neighborhoodName: itemNeighborhoodName.toUpperCase() });
  }

  onBlur() {
    if (this.profileForm.get("postalCode")?.value != '') {
      if (this.profileForm.get('country')?.valid) {
        if (this.profileForm.get('country')?.value === CustomerSTRINGS.MEXICO) {
          if (this.profileForm.get("postalCode")?.valid) {
            if (this.profileForm.get("postalCode")?.value != this.auxpostalCode) {
              this.auxpostalCode = this.profileForm.get("postalCode")?.value;
              const code: CustomerZipCodeRequest = {
                zipCode: this.profileForm.get("postalCode")?.value
              }
              this.enableDisableFECityMun(this.profileForm.get('country')?.value);
              this.zipCodeService.postData(code).subscribe(zipCode => {
                this.zipCode = zipCode;
                if (this.zipCode.federalEntity != '') {
                  this.profileForm.patchValue({ federalEntity: this.zipCode.federalEntity?.toUpperCase() });
                  this.profileForm.patchValue({ city: this.zipCode.cityDesc?.toUpperCase() });
                  this.profileForm.patchValue({ municipality: this.zipCode.townDesc?.toUpperCase() });
                  this.profileForm.patchValue({ geographicalArea: this.zipCode.zoneGeo.toUpperCase() });
                  this.profileForm.patchValue({ federalEntityID: this.zipCode.federalEntityId });
                  this.profileForm.patchValue({ cityID: this.zipCode.city });
                  this.profileForm.patchValue({ municipalityID: this.zipCode.town });
                  this.profileForm.patchValue({ neighborhood: null });
                  this.colony.set(this.zipCode.listSuburb.item);
                } else {
                  this.profileForm.patchValue({ federalEntity: null });
                  this.profileForm.patchValue({ city: null });
                  this.profileForm.patchValue({ municipality: null });
                  this.profileForm.patchValue({ neighborhood: null });
                  this.profileForm.patchValue({ geographicalArea: null });
                  this.profileForm.patchValue({ deliveryCenter: null });
                  this.profileForm.patchValue({ federalEntityID: '' });
                  this.profileForm.patchValue({ cityID: '' });
                  this.profileForm.patchValue({ municipalityID: '' });
                  this.colony = signal<CustomerSuburbItem[]>([]);
                  this.notificationService.error('Ingresa un C.P. válido.');
                }
              });
            }
          } else {
            this.colony = signal<CustomerSuburbItem[]>([]);

            this.profileForm.patchValue({ federalEntity: null });
            this.profileForm.patchValue({ city: null });
            this.profileForm.patchValue({ municipality: null });
            this.profileForm.patchValue({ neighborhood: null });
            this.profileForm.patchValue({ geographicalArea: null });
            this.profileForm.patchValue({ deliveryCenter: null });
            this.profileForm.patchValue({ federalEntityID: '' });
            this.profileForm.patchValue({ cityID: '' });
            this.profileForm.patchValue({ municipalityID: '' });
            this.notificationService.error('Ingresa un C.P. Válido.');
          }
        }
      } else {
        this.colony = signal<CustomerSuburbItem[]>([]);
        this.profileForm.patchValue({ federalEntity: null });
        this.profileForm.patchValue({ city: null });
        this.profileForm.patchValue({ municipality: null });
        this.profileForm.patchValue({ neighborhood: null });
        this.profileForm.patchValue({ geographicalArea: null });
        this.profileForm.patchValue({ deliveryCenter: null });
        this.profileForm.patchValue({ federalEntityID: '' });
        this.profileForm.patchValue({ cityID: '' });
        this.profileForm.patchValue({ municipalityID: '' });
        this.notificationService.error('Ingresa un País.');
      }
    }
  }

  async onSubmit(): Promise<CustomerAddress | null> {
    document.body.classList.add('show-validation');
    const addressRole = this.profileForm.get('addressRole');
    const addresType = this.profileForm.get('addressType')
    const confirmCp = this.profileForm.get('confirmCp');
    const taxPostalCode = this.profileForm.get('taxPostalCode');
    const municipality = this.profileForm.get('municipality');
    const timeToLiveInMexico = this.profileForm.get('timeLiveMexico');
    const reasons = this.profileForm.get('reasonsOpeningContractMexico');
    const domiliceProofType = this.profileForm.get('proofOfAddressType');
    const domiliceProofExpeditioDate = this.profileForm.get('addressProofIssueDate');

    if(this.hideProofOfAddressSection && this.hideRoleSection && this.hideAddresstype){
      addressRole?.clearValidators();
      addresType?.clearValidators();
      confirmCp?.clearValidators();
      taxPostalCode?.clearValidators();
      timeToLiveInMexico?.clearValidators();
      reasons?.clearValidators();
      domiliceProofType?.clearValidators();
      domiliceProofExpeditioDate?.clearValidators();
      this.update();
      return this.valid();
    } else if(this.hideRoleSection && !this.hideProofOfAddressSection) {
      addressRole?.clearValidators();
      confirmCp?.clearValidators();
      taxPostalCode?.clearValidators();
      timeToLiveInMexico?.clearValidators();
      reasons?.clearValidators();
      this.update();
      return this.valid();
    } else if (this.hideProofOfAddressSection && this.hideRoleSection) {
      addressRole?.clearValidators();
      confirmCp?.clearValidators();
      taxPostalCode?.clearValidators();
      timeToLiveInMexico?.clearValidators();
      reasons?.clearValidators();
      domiliceProofType?.clearValidators();
      domiliceProofExpeditioDate?.clearValidators();
      this.update();
      return this.valid();
    } else if (this.hideProofOfAddressSection && !this.hideRoleSection) {
      timeToLiveInMexico?.clearValidators();
      reasons?.clearValidators();
      domiliceProofType?.clearValidators();
      domiliceProofExpeditioDate?.clearValidators();
      this.update();
      return this.valid();
    } else {
      return this.validComplet();
    }
  }

  address = (): CustomerAddress => this.profileForm.getRawValue() as CustomerAddress;

  allowAlphanumericOnly(event: KeyboardEvent): void {
    const regex = /^[a-zA-Z0-9]$/;
    const key = event.key;
    if (!regex.test(key)) {
      event.preventDefault();
    }
  }

  error(): void {
    Object.values(this.profileForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsTouched();
      }
    });
  }

  update() {
    Object.keys(this.profileForm.controls).forEach(controlName => {
      const control = this.profileForm.get(controlName);
      control?.updateValueAndValidity();
    });
  }

  valid(): CustomerAddress | null {
    const city = this.profileForm.get('city');
    const delegation = this.profileForm.get('municipality');
    const confirmCp = this.profileForm.get('confirmCp');

    const clearCommonValidators = (...fields: (AbstractControl<any, any> | null)[]) => {
      fields.forEach(field => field?.clearValidators());
    };

    if (!this.domicileRole() || !this.addressClient) {
      clearCommonValidators(confirmCp);
    }

    if ((this.profileForm.valid && (this.profileForm.get('addressType')?.value != '' || this.hideAddresstype)) || this.profileForm.disabled) {
      this.auxpostalCode = "";

      const addr = this.address();
      addr.id = this.dataAddress?.id;

      return addr;
    }
    this.logInvalidControls(this.profileForm)
    this.error();
    this.notificationService.error('Faltan Campos Obligatorios por Capturar');
    return null;
  }

  private logInvalidControls(form: FormGroup) {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.invalid) {
        console.log(`❌ Campo inválido: ${key}`, control.errors);
      }
    });
  }

  validComplet(): CustomerAddress | null {
    const city = this.profileForm.get('city');
    const delegation = this.profileForm.get('municipality');
    const reasons = this.profileForm.get('reasonsOpeningContractMexico');
    const timeToLiveInMexico = this.profileForm.get('timeLiveMexico');
    const confirmCp = this.profileForm.get('confirmCp');
    const taxPostalCode = this.profileForm.get('taxPostalCode');

    reasons?.setValidators([Validators.required]);
    timeToLiveInMexico?.setValidators([Validators.required]);
    confirmCp?.setValidators([Validators.required]);
    const clearCommonValidators = (...fields: (AbstractControl<any, any> | null)[]) => {
      fields.forEach(field => field?.clearValidators());
    };

    if (this.domicileRole() === false) {
      clearCommonValidators(confirmCp, taxPostalCode);
    }

    if (this.timeToLiveInMexico() === false && this.countryType() === false) {
      clearCommonValidators(reasons, timeToLiveInMexico);
    } else if (this.timeToLiveInMexico() === false && this.countryType() === true) {
      clearCommonValidators(timeToLiveInMexico);
    } else if (this.timeToLiveInMexico() === true && this.countryType() === false) {
      clearCommonValidators(reasons);
    }

    this.update();

    if (this.profileForm.valid
      && this.profileForm.getRawValue().federalEntity?.trim() != ''
      && this.profileForm.getRawValue().city?.trim() != ''
      && this.profileForm.getRawValue().municipality?.trim() != '') {
      if (!this.hideProofOfAddressSection) {
        if ((this.profileForm.getRawValue().proofOfAddressType != CustomerADDRESS.PREDIAL && this.profileForm.getRawValue().proofOfAddressType != CustomerADDRESS.INE)) {
          if ((new Date(this.profileForm.getRawValue().addressProofIssueDate) >= new Date(this.dateThreeMonthsAgo()) && new Date(this.profileForm.getRawValue().addressProofIssueDate) <= new Date(this.getCurrentDate()))) {
            this.auxpostalCode = "";
            return this.address();
          } else {
            const addressProofIssueDate = this.profileForm.get('addressProofIssueDate');
            addressProofIssueDate?.setErrors({ invalidFormat: true });
            addressProofIssueDate?.markAsTouched();
            this.notificationService.error('Comprobante de Domicilio no Válido por Vencimiento de Vigencia');
            return null;
          }
        } else if (this.profileForm.getRawValue().proofOfAddressType === CustomerADDRESS.PREDIAL) {
          if ((new Date(this.profileForm.getRawValue().addressProofIssueDate) >= this.dateTwoYearsAgo())) {
            this.auxpostalCode = "";
            return this.address();
          } else {
            const addressProofIssueDate = this.profileForm.get('addressProofIssueDate');
            addressProofIssueDate?.setErrors({ invalidFormat: true });
            addressProofIssueDate?.markAsTouched();
            this.notificationService.error('Comprobante de Domicilio no Válido por Vencimiento de Vigencia');
            return null;
          }
        } else if (this.profileForm.getRawValue().proofOfAddressType === CustomerADDRESS.INE) {
          // if (new Date(this.profileForm.getRawValue().addressProofIssueDate) <= new Date(this.getCurrentDate())) {
          if (this.profileForm.getRawValue().expirationYear?.trim() != '') {
            if (Number(this.profileForm.getRawValue().expirationYear) >= this.getCurrentDate().getFullYear()) {
              this.auxpostalCode = "";
              return this.address();
            } else {
              const expirationYear = this.profileForm.get('expirationYear');
              expirationYear?.setErrors({ invalidFormat: true });
              expirationYear?.markAsTouched();
              this.notificationService.error('Comprobante de Domicilio no Válido por Vencimiento de Vigencia');
              return null;
            }
          } else {
            this.auxpostalCode = "";
            return this.address();
          }
          // }else{
          //   const addressProofIssueDate = this.profileForm.get('addressProofIssueDate');
          //   addressProofIssueDate?.setErrors({ invalidFormat: true });
          //   addressProofIssueDate?.markAsTouched();
          //   this.notificationService.error('Comprobante de Domicilio no Válido por Fecha de Emisión');
          //   return null;
          // }
        }

      } else {
        this.auxpostalCode = "";
        return this.address();
      }

    }

    this.error();
    this.notificationService.error('Faltan Campos Obligatorios por Capturar');
    return null;
  }

  resetColonyCP() {
    this.colony = signal<CustomerSuburbItem[]>([]);
  }

  dateThreeMonthsAgo(): Date {
    const currentDate = new Date();
    const dateThreeMonthsAgo = new Date(currentDate);
    dateThreeMonthsAgo.setMonth(dateThreeMonthsAgo.getMonth() - 3);
    return dateThreeMonthsAgo;
  }

  dateTwoYearsAgo(): Date {
    const currentDate = new Date();
    const dateThreeMonthsAgo = new Date(currentDate);
    dateThreeMonthsAgo.setFullYear(dateThreeMonthsAgo.getFullYear() - 2);
    return dateThreeMonthsAgo;
  }

  getCurrentDate(): Date {
    return new Date()
    // return this.formatDate(new Date());
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${day}-${month}-${year}`;
  }

  onInput(event: any) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (value.length > 4) {
      input.value = value.slice(0, 4);
    }
    this.profileForm.get('expirationYear')?.setValue(input.value);
  }

  setAddresData(dataAddress: CustomerAddress | null) {
    if (dataAddress) {
      this.onItemSelectDomiciledType(dataAddress.addressType?.toUpperCase() ?? '');
      this.onItemSelectCountry(dataAddress.country?.toUpperCase() ?? '');
      this.profileForm.patchValue({ addressRole: dataAddress.addressRole?.toUpperCase() });
      this.profileForm.patchValue({ addressType: dataAddress.addressType?.toUpperCase() });
      this.profileForm.patchValue({ other: dataAddress.other?.toUpperCase() });
      this.profileForm.patchValue({ country: dataAddress.country?.toUpperCase() });
      this.profileForm.patchValue({ street: dataAddress.street?.toUpperCase() });
      this.profileForm.patchValue({ externalNumber: dataAddress.externalNumber?.toUpperCase() });
      this.profileForm.patchValue({ internalNumber: dataAddress.internalNumber?.toUpperCase() });
      this.profileForm.patchValue({ confirmCp: dataAddress.confirmCp?.toUpperCase() });
      this.profileForm.patchValue({ timeLiveMexico: dataAddress.timeLiveMexico?.toUpperCase() });
      this.profileForm.patchValue({ reasonsOpeningContractMexico: dataAddress.reasonsOpeningContractMexico?.toUpperCase() });
      this.profileForm.patchValue({ proofOfAddressType: dataAddress.proofOfAddressType?.toUpperCase() });
      this.profileForm.patchValue({ addressProofIssueDate: dataAddress.addressProofIssueDate });
      this.profileForm.patchValue({ expirationYear: dataAddress.expirationYear });
      this.profileForm.patchValue({ taxPostalCode: dataAddress.taxPostalCode?.toUpperCase() });
      this.profileForm.patchValue({ geographicalArea: dataAddress.geographicalArea?.toUpperCase() });
      this.profileForm.patchValue({ deliveryCenter: dataAddress.deliveryCenter?.toUpperCase() });

      const postalCode: CustomerZipCodeRequest = {
        zipCode: dataAddress.postalCode
      }
      this.auxpostalCode = dataAddress.postalCode;
      const hasZipCode =
        typeof dataAddress.postalCode === 'string' &&
        dataAddress.postalCode?.trim()?.length > 0;
      if (dataAddress.country === CustomerSTRINGS.MEXICO && hasZipCode) {
        this.zipCodeService.postData(postalCode).subscribe(zipCode => {
          this.zipCode = zipCode;
          if (this.zipCode) {
            this.colony.set(zipCode.listSuburb.item);
            this.profileForm.patchValue({ postalCode: dataAddress?.postalCode });
            this.profileForm.patchValue({ federalEntity: this.zipCode.federalEntity?.toUpperCase() });
            this.profileForm.patchValue({ city: this.zipCode.cityDesc?.toUpperCase() });
            this.profileForm.patchValue({ municipality: this.zipCode.townDesc?.toUpperCase() });
            this.profileForm.patchValue({ neighborhood: dataAddress?.neighborhood?.toUpperCase() });
            this.profileForm.patchValue({ federalEntityID: this.zipCode.federalEntityId });
            this.profileForm.patchValue({ cityID: this.zipCode.city });
            this.profileForm.patchValue({ municipalityID: this.zipCode.town });
          }
        });
      } else {
        this.profileForm.patchValue({ postalCode: dataAddress?.postalCode });
        this.profileForm.patchValue({ federalEntity: dataAddress.federalEntity });
        this.profileForm.patchValue({ city: dataAddress.city?.toUpperCase() });
        this.profileForm.patchValue({ municipality: dataAddress.municipality?.toUpperCase() });
        this.profileForm.patchValue({ neighborhood: dataAddress?.neighborhood?.toUpperCase() });
        this.profileForm.patchValue({ federalEntityID: '' });
        this.profileForm.patchValue({ cityID: '' });
        this.profileForm.patchValue({ municipalityID: '' });
      }
      const controlTaxPostalCode = this.profileForm.get('taxPostalCode');
      if (dataAddress.confirmCp?.toUpperCase() === 'YES') {
        controlTaxPostalCode?.clearValidators();
        this.taxDomicile = signal(false);
      }
      if (dataAddress.confirmCp?.toUpperCase() === 'NO') {
        controlTaxPostalCode?.setValidators([Validators.required]);
        this.taxDomicile = signal(true);
      }

      if (dataAddress.addressType?.toUpperCase() === "4") {
        this.domicileType = signal(true);
        this.profileForm.patchValue({ other: dataAddress.other?.toUpperCase() });
      }

    } else {
      this.profileForm.patchValue({ country: CustomerSTRINGS.MEXICO });
      this.onItemSelectCountry(CustomerSTRINGS.MEXICO);
    }
  }

  enableDisableFECityMun(item: string){
    const state = this.profileForm.get('federalEntity');
    const city = this.profileForm.get('city');
    const delegation = this.profileForm.get('municipality');
    if (item?.toUpperCase() == CustomerSTRINGS.MEXICO) {
      this.countryType.set(false);
      state?.disable();
      city?.disable();
      delegation?.disable();
    }else{
      this.countryType.set(true);
      state?.enable();
      city?.enable();
      delegation?.enable();
    }
  }

}













