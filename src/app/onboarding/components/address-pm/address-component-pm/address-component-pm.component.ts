import { Component, inject, Input, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { ZipCodeService } from '../../../../shared/services/zip-code.service';
import { STRINGS, ADDRESS } from '../../../constants/constants';
import { Address, AddressRole, AddressType, ProofOfAddressType } from '../../../models/address';
import { Countries } from '../../../models/country';
import { Entity } from '../../../models/entity';
import { map } from 'rxjs';
import { ZipCode, SuburbItem, ZipCodeRequest } from '../../../models/zip-code';

@Component({
  selector: 'app-address-component-pm',
  standalone: false,
  templateUrl: './address-component-pm.component.html',
  styleUrl: './address-component-pm.component.scss'
})
export class AddressComponentPmComponent {
  @Input() dataAddress?: Address | null = null;
  @Input() hideRoleSection?: boolean = false;
  @Input() hideProofOfAddressSection?: boolean = false;
  @Input() addressClient?: boolean = false;

  private readonly fb = inject(FormBuilder);
  private readonly catalogService = inject(CatalogsService);
  private readonly zipCodeService = inject(ZipCodeService);
  private readonly notificationService = inject(NotificationsService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);

  countries = signal<Array<Countries>>([]);
  states = signal<Entity[]>([]);
  domicileRole = signal(false);
  domicileType = signal(false);
  countryType = signal(false);
  timeToLiveInMexico = signal(false);

  profileForm: FormGroup = this.fb.nonNullable.group({
    addressRole: ['', Validators.required],
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
    timeLiveMexico: ['', Validators.required],
    reasonsOpeningContractMexico: ['', Validators.required],
    proofOfAddressType: ['', Validators.required],
    addressProofIssueDate: ['', Validators.required],
    expirationYear: ['',],
    geographicalArea: ['',],
    deliveryCenter: ['',],
    neighborhoodName: ['',],
    asesor: ['',],
  })


  zipCode: ZipCode | null = null;
  readonly domicileRoles = signal<AddressRole[]>([]);
  readonly domicileTypes = signal<AddressType[]>([]);
  readonly domiliceProof = signal<ProofOfAddressType[]>([]);
  colony = signal<SuburbItem[]>([]);
  wantedIds = ["1", "3"];

  constructor() {
    document.body.classList.remove('show-validation');
  }

  ngOnInit() {
    // TODO servicio no desplegado
     this.catalogService.getAddressRole({ idRolDomicilioCve: [] }).subscribe(c => {
       this.domicileRoles.set(c)
     });

    this.catalogService.getCountry({ land: [] }).subscribe(c => {
      this.countries.set(c);
    });

    this.catalogService.getFederalEntity({ land1s: ["MX"] }).subscribe(c => {
      this.states.set(c);
    });

    this.catalogService.getAddressType({ addressTypeIds: [] })
      .pipe(
        map((items: AddressType[]) =>
          items.filter(item => !this.wantedIds.includes(item.addressTypeId))
        )
      )
      .subscribe(filtered => {
        this.domicileTypes.set(filtered);
      });

    this.catalogService.getProofOfAddress({ proofAddressIds: [] }).subscribe(c => {
      const filteredData = c.filter(item => item.personTypeId === "2");
      this.domiliceProof.set(filteredData);
    });

    this.profileForm.controls['addressProofIssueDate'].valueChanges.subscribe((value: any) => {
      if ( value == null ) {
        this.profileForm.controls['addressProofIssueDate'].setValue("");
      }
    });

    if (this.dataAddress) {
      this.onItemSelectDomicileRoles(this.dataAddress.addressRole?.toUpperCase() ?? '');
      this.onItemSelectDomiciledType(this.dataAddress.addressType);
      this.onItemSelectCountry(this.dataAddress.country.toUpperCase());
      this.profileForm.patchValue({ addressRole: this.dataAddress.addressRole?.toUpperCase() });
      this.profileForm.patchValue({ addressType: this.dataAddress.addressType.toUpperCase() });
      this.profileForm.patchValue({ other: this.dataAddress.other?.toUpperCase() });
      this.profileForm.patchValue({ country: this.dataAddress.country.toUpperCase() });
      this.profileForm.patchValue({ federalEntity: this.dataAddress.federalEntity });
      this.profileForm.patchValue({ city: this.dataAddress.city.toUpperCase() });
      this.profileForm.patchValue({ municipality: this.dataAddress.municipality.toUpperCase() });
      this.profileForm.patchValue({ neighborhood: this.dataAddress.neighborhood.toUpperCase() });
      this.profileForm.patchValue({ neighborhoodName: this.dataAddress.neighborhoodName?.toUpperCase() });
      this.profileForm.patchValue({ street: this.dataAddress.street.toUpperCase() });
      this.profileForm.patchValue({ externalNumber: this.dataAddress.externalNumber.toUpperCase() });
      this.profileForm.patchValue({ internalNumber: this.dataAddress.internalNumber?.toUpperCase() });
      this.profileForm.patchValue({ timeLiveMexico: this.dataAddress.timeLiveMexico?.toUpperCase() });
      this.profileForm.patchValue({ reasonsOpeningContractMexico: this.dataAddress.reasonsOpeningContractMexico?.toUpperCase() });
      this.profileForm.patchValue({ proofOfAddressType: this.dataAddress.proofOfAddressType?.toUpperCase() });
      this.profileForm.patchValue({ addressProofIssueDate: this.dataAddress.addressProofIssueDate?.toUpperCase() });
      this.profileForm.patchValue({ expirationYear: this.dataAddress.expirationYear });
      this.profileForm.patchValue({ geographicalArea: this.dataAddress.geographicalArea?.toUpperCase() });
      this.profileForm.patchValue({ deliveryCenter: this.dataAddress.deliveryCenter?.toUpperCase() });

      if (this.dataAddress.addressType.toUpperCase() === "4") {
        this.domicileType = signal(true);
        this.profileForm.patchValue({ other: this.dataAddress.other?.toUpperCase() });
      }

      const postalCode: ZipCodeRequest = {
        zipCode: this.dataAddress.postalCode
      }
      if (this.dataAddress.country === STRINGS.MEXICO) {
        this.zipCodeService.postData(postalCode).subscribe(zipCode => {
          this.zipCode = zipCode;
          if (this.zipCode) {
            this.colony.set(zipCode.listSuburb.item);
            this.profileForm.patchValue({ postalCode: this.dataAddress?.postalCode });
          }
        });
      } else {
        this.profileForm.patchValue({ postalCode: this.dataAddress?.postalCode });
      }
    } else {
      this.profileForm.patchValue({ addressRole: 'FISCAL' });
      this.profileForm.patchValue({ addressType: '2' });
      this.profileForm.patchValue({ country: STRINGS.MEXICO });
    }

    const state = this.profileForm.get('federalEntity');
    const city = this.profileForm.get('city');
    const delegation = this.profileForm.get('municipality');
    state?.disable();
    city?.disable();
    delegation?.disable();
    this.profileForm.valueChanges.subscribe(() => {
      this.unsavedChangesService.setUnsavedChanges(this.profileForm.dirty);
    });
  }

  onItemSelectDomicileRoles(item: string) {
    if (item != ADDRESS.DOMICILE_ROLE_ONE_PM && item != ADDRESS.DOMICILE_ROLE_TWO_PM) {
      this.domicileRole = signal(false);
      this.profileForm.patchValue({ addressType: '' });
      this.catalogService.getAddressType({ addressTypeIds: [] })
        .subscribe(item => {
          this.domicileTypes.set(item);
        });
    } else if (this.profileForm.get('addressRole')?.value?.toString() === ADDRESS.DOMICILE_ROLE_ONE_PM || this.profileForm.get('addressRole')?.value?.toString() === ADDRESS.DOMICILE_ROLE_TWO_PM) {
      this.domicileRole = signal(true);
      this.catalogService.getAddressType({ addressTypeIds: [] })
        .pipe(
          map((items: AddressType[]) =>
            items.filter(item => !this.wantedIds.includes(item.addressTypeId))
          )
        )
        .subscribe(filtered => {
          this.domicileTypes.set(filtered);
        });
      this.profileForm.patchValue({ addressType: '2' });
    }
  }

  onItemSelectDomiciledType(item: string) {
    if (item != ADDRESS.DOMICILE_TYPE) {
      this.profileForm.patchValue({ other: '' });
      this.domicileType = signal(false);
    } else {
      this.domicileType = signal(true);
    }
  }

  onItemSelectCountry(item: string) {
    const state = this.profileForm.get('federalEntity');
    const city = this.profileForm.get('city');
    const delegation = this.profileForm.get('municipality');
    if (item != STRINGS.MEXICO) {
      this.countryType.set(true);
      state?.enable();
      city?.enable();
      delegation?.enable();
      this.profileForm.patchValue({ federalEntity: '' });
      this.profileForm.patchValue({ city: '' });
      this.profileForm.patchValue({ municipality: '' });
      this.profileForm.patchValue({ postalCode: '' });
      this.profileForm.patchValue({ neighborhood: '' });
      this.profileForm.patchValue({ neighborhoodName: '' });
      this.colony = signal<SuburbItem[]>([]);
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
      this.profileForm.patchValue({ neighborhoodName: '' });
      this.colony = signal<SuburbItem[]>([]);
    }
  }

  onItemSelectNeighborhood(item: string, itemNeighborhoodName: string) {
    this.profileForm.patchValue({ deliveryCenter: item.toUpperCase() });
    this.profileForm.patchValue({ neighborhoodName: itemNeighborhoodName.toUpperCase() });
  }

  onBlur() {
    if (this.profileForm.get('country')?.valid) {
      if (this.profileForm.get('country')?.value === STRINGS.MEXICO) {
        if (this.profileForm.get("postalCode")?.valid) {
          const code: ZipCodeRequest = {
            zipCode: this.profileForm.get("postalCode")?.value
          }
          this.zipCodeService.postData(code).subscribe(zipCode => {
            this.zipCode = zipCode;
            console.log(this.zipCode)
            if (this.zipCode.federalEntity != '') {
              this.profileForm.patchValue({ federalEntity: this.zipCode.federalEntity.toUpperCase() });
              this.profileForm.patchValue({ city: this.zipCode.cityDesc.toUpperCase() });
              this.profileForm.patchValue({ municipality: this.zipCode.townDesc.toUpperCase() });
              this.profileForm.patchValue({ geographicalArea: this.zipCode.zoneGeo.toUpperCase() });
              this.colony.set(this.zipCode.listSuburb.item);
            } else {
              this.colony = signal<SuburbItem[]>([]);
              this.profileForm.patchValue({ federalEntity: null });
              this.profileForm.patchValue({ city: null });
              this.profileForm.patchValue({ municipality: null });
              this.profileForm.patchValue({ neighborhood: null });
              this.profileForm.patchValue({ neighborhoodName: null });
              this.profileForm.patchValue({ geographicalArea: null });
              this.profileForm.patchValue({ deliveryCenter: null });
              this.notificationService.error('Captura un Código Postal Válido');
            }
          });
        } else {
          this.colony = signal<SuburbItem[]>([]);
          this.profileForm.patchValue({ federalEntity: null });
          this.profileForm.patchValue({ city: null });
          this.profileForm.patchValue({ municipality: null });
          this.profileForm.patchValue({ neighborhood: null });
          this.profileForm.patchValue({ neighborhoodName: null });
          this.profileForm.patchValue({ geographicalArea: null });
          this.profileForm.patchValue({ deliveryCenter: null });
          this.notificationService.error('Captura un Código Postal Válido');
        }
      }
    } else {
      this.colony = signal<SuburbItem[]>([]);
      this.profileForm.patchValue({ federalEntity: null });
      this.profileForm.patchValue({ city: null });
      this.profileForm.patchValue({ municipality: null });
      this.profileForm.patchValue({ neighborhood: null });
      this.profileForm.patchValue({ neighborhoodName: null });
      this.profileForm.patchValue({ geographicalArea: null });
      this.profileForm.patchValue({ deliveryCenter: null });
      this.notificationService.error('Ingresa un País.');
    }
  }

  async onSubmit(): Promise<Address | null> {
    document.body.classList.add('show-validation');
    const addressRole = this.profileForm.get('addressRole');
    const timeToLiveInMexico = this.profileForm.get('timeLiveMexico');
    const reasons = this.profileForm.get('reasonsOpeningContractMexico');
    const domiliceProofType = this.profileForm.get('proofOfAddressType');
    const domiliceProofExpeditioDate = this.profileForm.get('addressProofIssueDate');

    if (this.hideRoleSection && !this.hideProofOfAddressSection) {
      addressRole?.clearValidators();
      timeToLiveInMexico?.clearValidators();
      reasons?.clearValidators();
      this.update();
      return this.valid();
    } else if (this.hideProofOfAddressSection && this.hideRoleSection) {
      addressRole?.clearValidators();
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

  address = (): Address => this.profileForm.getRawValue() as Address;

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

  valid(): Address | null {
    const city = this.profileForm.get('city');
    const delegation = this.profileForm.get('municipality');

    const clearCommonValidators = (...fields: (AbstractControl<any, any> | null)[]) => {
      fields.forEach(field => field?.clearValidators());
    };

    if (!this.countryType()) {
      clearCommonValidators(city, delegation);
    }

    this.update();

    if (this.profileForm.valid) {
      this.colony = signal<SuburbItem[]>([]);
      return this.address();
    }

    this.error();
    this.notificationService.error('Captura los Campos Faltantes');
    return null;
  }

  validComplet(): Address | null {
    const city = this.profileForm.get('city');
    const delegation = this.profileForm.get('municipality');
    const reasons = this.profileForm.get('reasonsOpeningContractMexico');
    const timeToLiveInMexico = this.profileForm.get('timeLiveMexico');
    reasons?.setValidators([Validators.required]);

    const clearCommonValidators = (...fields: (AbstractControl<any, any> | null)[]) => {
      fields.forEach(field => field?.clearValidators());
    };

    if (!this.timeToLiveInMexico() && !this.countryType()) {
      clearCommonValidators(reasons, timeToLiveInMexico);
    } else if (!this.timeToLiveInMexico() && this.countryType()) {
      clearCommonValidators(timeToLiveInMexico);
    } else if (this.timeToLiveInMexico() && !this.countryType()) {
      //clearCommonValidators(city, delegation, timeToLiveInMexico);
    }

    this.update();

    if (this.profileForm.valid) {
      if (!this.hideProofOfAddressSection) {
        if (this.profileForm.getRawValue().addressProofIssueDate >= this.dateThreeMonthsAgo() && this.profileForm.getRawValue().addressProofIssueDate <= this.getCurrentDate()) {
          return this.address();
        } else {
          this.notificationService.error(' Comprobante de Domicilio no Válido por Vencimiento de Vigencia');
          return null;
        }
      } else {
        return this.address();
      }

    }

    this.error();
    this.notificationService.error('Captura los Campos Faltantes');
    return null;
  }

  resetColonyCP(){
     this.colony = signal<SuburbItem[]>([]);
  }

  dateThreeMonthsAgo(): Date {
    const currentDate = new Date();
    const dateThreeMonthsAgo = new Date(currentDate);
    dateThreeMonthsAgo.setDate(dateThreeMonthsAgo.getDate() - 90);
    console.log(dateThreeMonthsAgo);
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

  setAddresData(dataAddress: Address | null) {
    if (dataAddress) {
      this.onItemSelectDomicileRoles(dataAddress.addressRole?.toUpperCase() ?? '');
      this.onItemSelectDomiciledType(dataAddress.addressType.toUpperCase());
      this.onItemSelectCountry(dataAddress.country.toUpperCase());
      this.profileForm.patchValue({ addressRole: dataAddress.addressRole?.toUpperCase() });
      this.profileForm.patchValue({ addressType: dataAddress.addressType.toUpperCase() });
      this.profileForm.patchValue({ other: dataAddress.other?.toUpperCase() });
      this.profileForm.patchValue({ country: dataAddress.country.toUpperCase() });
      this.profileForm.patchValue({ federalEntity: dataAddress.federalEntity.toUpperCase() });
      this.profileForm.patchValue({ city: dataAddress.city.toUpperCase() });
      this.profileForm.patchValue({ municipality: dataAddress.municipality.toUpperCase() });
      this.profileForm.patchValue({ neighborhood: dataAddress.neighborhood.toUpperCase() });
      this.profileForm.patchValue({ neighborhoodName: dataAddress.neighborhoodName?.toUpperCase() });
      this.profileForm.patchValue({ street: dataAddress.street.toUpperCase() });
      this.profileForm.patchValue({ externalNumber: dataAddress.externalNumber.toUpperCase() });
      this.profileForm.patchValue({ internalNumber: dataAddress.internalNumber?.toUpperCase() });
      this.profileForm.patchValue({ timeLiveMexico: dataAddress.timeLiveMexico?.toUpperCase() });
      this.profileForm.patchValue({ reasonsOpeningContractMexico: dataAddress.reasonsOpeningContractMexico?.toUpperCase() });
      this.profileForm.patchValue({ proofOfAddressType: dataAddress.proofOfAddressType?.toUpperCase() });
      this.profileForm.patchValue({ addressProofIssueDate: dataAddress.addressProofIssueDate });
      this.profileForm.patchValue({ expirationYear: dataAddress.expirationYear });
      this.profileForm.patchValue({ geographicalArea: dataAddress.geographicalArea?.toUpperCase() });
      this.profileForm.patchValue({ deliveryCenter: dataAddress.deliveryCenter?.toUpperCase() });
      const postalCode: ZipCodeRequest = {
        zipCode: dataAddress.postalCode
      }
      if (dataAddress.country === STRINGS.MEXICO) {
        this.zipCodeService.postData(postalCode).subscribe(zipCode => {
          this.zipCode = zipCode;
          if (this.zipCode) {
            this.colony.set(zipCode.listSuburb.item);
            this.profileForm.patchValue({ postalCode: dataAddress?.postalCode });
          }
        });
      } else {
        this.profileForm.patchValue({ postalCode: dataAddress?.postalCode });
      }

      if (dataAddress.addressType.toUpperCase() === "4") {
        this.domicileType = signal(true);
        this.profileForm.patchValue({ other: dataAddress.other?.toUpperCase() });
      }
    }
  }
}
