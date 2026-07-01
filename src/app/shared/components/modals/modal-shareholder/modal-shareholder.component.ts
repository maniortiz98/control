import { Component, effect, Inject, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Countries } from '../../../../onboarding/models/country';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import * as DateTimeUtils from '../../../utils/datetime';
import { Nationalities } from '../../../../onboarding/models/nationality';
import { CatalogsService } from '../../../services/catalogs.service';
import { NotificationsService } from '../../../services/notifications.service';
import { ERROR_MESSAGES } from '../../../../onboarding/constants/form-messages';
import { REGEX } from '../../../../onboarding/constants/constants';
import { StrTempId } from '../../../utils/string';
import { ShareholderTablePF } from '../../../../onboarding/models/real-owner';
import { SuburbItem } from '../../../../onboarding/models/zip-code';

type ModalData = {
  remaining: number;
  initial?: any;
  lockPersonType?: boolean;
  level?: 'parent' | 'child' | 'grandchild';
};

@Component({
  selector: 'app-modal-shareholder',
  standalone: false,
  templateUrl: './modal-shareholder.component.html',
  styleUrl: './modal-shareholder.component.scss',
})
export class ModalShareholderComponent {
  private readonly fb = inject(FormBuilder);
  private readonly catalogService = inject(CatalogsService);
  readonly dialog = inject(MatDialog);
  private readonly notifService = inject(NotificationsService);
  shareholderForm: FormGroup;
  nationalities = signal<Nationalities[]>([]);
  countries = signal<Array<Countries>>([]);
  personType = signal<string>('especial');
  colony = signal<SuburbItem[]>([]);
  typeOfCompanySelected = signal<number>(0);
  shareholder: ShareholderTablePF = {
    fullName: '',
    email: '',
    phone: 0,
    country: '',
    participation: '',
  };
  birthDates = {
    startAt: DateTimeUtils.yearsAgoLegacy(18),
    max: new Date(),
    min: DateTimeUtils.yearsAgoLegacy(150),
  };
  isEditing: boolean = false;
  constructor(
    private modalRef: MatDialogRef<ModalShareholderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.shareholderForm = this.fb.group({
      personType: ['PF', Validators.required],
      participation: [
        '',
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      curp: ['', Validators.required],
      rfc: [''],
      nif: [''],
      tin: [''],
      nss: [''],
      keyFiscalCountry: ['', Validators.required],
      nationality: ['', Validators.required],
      birthCountry: ['', Validators.required],
      birthEntity: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      secondLastName: [''],
      birthDate: ['', Validators.required],
      gender: ['', Validators.required],
      politicallyExposed: ['NO', Validators.required],
      position: [''],
      expirePositionDate: [''],
      positionDate: [''],
      countryResidence: ['', Validators.required],
      neighborhood: ['', Validators.required],
      postalCode: [''],
      state: [''],
      entity: [''],
      city: [''],
      street: [''],
      exteriorNumber: [''],
      interiorNumber: [''],
      phone: [''],
      email: ['', [Validators.required, Validators.email]],
    });

    this.isEditing = !!data?.initial;

    // Precarga/validadores dinámicos
    const max = Math.max(0.01, data?.remaining ?? 100);
    this.shareholderForm
      .get('participation')
      ?.setValidators([
        Validators.required,
        Validators.min(0.01),
        Validators.max(max),
      ]);
    this.shareholderForm
      .get('participation')
      ?.updateValueAndValidity({ emitEvent: false });

    if (this.isEditing) {
      this.shareholderForm.patchValue(data.initial);
      if (data.lockPersonType) {
        this.shareholderForm.get('personType')?.disable({ emitEvent: false });
      }
    } else {
      this.shareholderForm.patchValue({
        personType: 'PF',
        participation: data?.remaining ?? 100,
      });
    }

    // Validaciones condicionales por tipo:
    this.shareholderForm.get('personType')?.valueChanges.subscribe((pt) => {
      // Ejemplo: si PF exige CURP, si PM exige RFC
      const curpCtrl = this.shareholderForm.get('curp')!;
      const rfcCtrl = this.shareholderForm.get('rfc')!;
      const nifCtrl = this.shareholderForm.get('nif')!;
      const tinCtrl = this.shareholderForm.get('tin')!;
      const nssCtrl = this.shareholderForm.get('nss')!;
      if (pt === 'PF') {
        curpCtrl.addValidators([Validators.required]);
        rfcCtrl.clearValidators();
        rfcCtrl.addValidators([Validators.pattern(REGEX.RFC_VALIDATION)]);
        nifCtrl.clearValidators();
        nifCtrl.addValidators([Validators.pattern(REGEX.NIF_TIN_NSS_VALIDATION)]);
        tinCtrl.clearValidators();
        tinCtrl.addValidators([Validators.pattern(REGEX.NIF_TIN_NSS_VALIDATION)]);
        nssCtrl.clearValidators();
        nssCtrl.addValidators([Validators.pattern(REGEX.NIF_TIN_NSS_VALIDATION)]);
      } else {
        // PM
        rfcCtrl.addValidators([Validators.required, Validators.pattern(REGEX.RFC_PM_VALIDATION)]);
        curpCtrl.clearValidators();
      }
      curpCtrl.updateValueAndValidity({ emitEvent: false });
      rfcCtrl.updateValueAndValidity({ emitEvent: false });
      nifCtrl.updateValueAndValidity({ emitEvent: false });
      tinCtrl.updateValueAndValidity({ emitEvent: false });
      nssCtrl.updateValueAndValidity({ emitEvent: false });
    });

    effect(() => {
      /* DATOS EJEMPLO */
      /* this.shareholderForm.patchValue({
        personType: 'PF',
        participation: 75,
        curp: 'ABCD890123HDFLRS09',
        rfc: 'ABCD890123XYZ',
        nif: 'NIF123456',
        tin: 'TIN987654',
        nss: 'NSS123456789',
        keyFiscalCountry: 'MX',
        nationality: 'MEXICANA',
        birthCountry: 'MX',
        birthEntity: 'AGUASCALIENTES',
        firstName: 'JUAN',
        middleName: 'CARLOS',
        lastName: 'PÉREZ',
        secondLastName: 'GÓMEZ',
        birthDate: '1985-07-15',
        gender: 'MASCULINO',
        politicallyExposed: 'NO',
        position: '',
        expirePositionDate: '',
        positionDate: '',
        countryResidence: 'MX',
        neighborhood: 'CENTRO',
        postalCode: '20000',
        state: 'AGUASCALIENTES',
        entity: 'AGUASCALIENTES',
        city: 'AGUASCALIENTES',
        street: 'AV. PRINCIPAL',
        exteriorNumber: '123',
        interiorNumber: '4B',
        phone: '4491234567',
        email: 'juan.perez@example.com',
      });
    }); */
      this.shareholderForm.patchValue({
        personType: '',
        participation: 0,
        curp: '',
        rfc: '',
        nif: '',
        tin: '',
        nss: '',
        keyFiscalCountry: '',
        nationality: '',
        birthCountry: '',
        birthEntity: '',
        firstName: '',
        middleName: '',
        lastName: '',
        secondLastName: '',
        birthDate: '',
        gender: '',
        politicallyExposed: '',
        position: '',
        expirePositionDate: '',
        positionDate: '',
        countryResidence: '',
        neighborhood: '',
        postalCode: '',
        state: '',
        entity: '',
        city: '',
        street: '',
        exteriorNumber: '',
        interiorNumber: '',
        phone: '',
        email: '',
      });
    });
  }

  ngOnInit(): void {
    if (this.data) {
      console.log('Data: ', this.data);
      this.shareholderForm.patchValue(this.data);
      this.personType.set(this.data.personType);
      this.typeOfCompanySelected.set(
        this.data.typeOfCompanySelected == '0'
          ? '1'
          : this.data.typeOfCompanySelected
      );
    }
    this.catalogService.getCountry({ land: [] }).subscribe((c) => {
      this.countries.set(c);
    });

    this.catalogService.getNationalities({ land: [] }).subscribe((c) => {
      this.nationalities.set(c);
    });
  }

  onItemSelectNeighborhood(itemNeighborhoodName: string) {
    this.shareholderForm.patchValue({
      neighborhood: itemNeighborhoodName.toUpperCase(),
    });
  }

  allowAlphanumericOnly(event: KeyboardEvent): void {
    const regex = /^[a-zA-Z0-9]$/;
    const key = event.key;
    if (!regex.test(key)) {
      event.preventDefault();
    }
  }

  searchClient() {}

  cancel(): void {
    this.modalRef.close(null);
  }

  /**
   * Submit logic with validations and data assembly
   */
  async onSubmit(): Promise<void> {
    document.body.classList.add('show-validation');

    console.log('Form values:', this.shareholderForm.value);

    // Validate required fields
    if (this.validateRequiredFields()) {
      this.notifService.error(ERROR_MESSAGES.MISSING_INFO);
      return;
    }

    // Validate format
    if (this.invalidFormatFields()) {
      this.notifService.error(ERROR_MESSAGES.INCORRECT_FORMAT);
      return;
    }

    // Validate dropdowns
    if (this.invalidDropdowns()) {
      this.notifService.error(
        'Debe seleccionar todas las opciones requeridas.'
      );
      return;
    }

    const tempId = this.isEditing ? this.shareholder.tempId : StrTempId();

    const v = this.shareholderForm.getRawValue();
    const result = {
      ok: true,
      edit: this.isEditing,
      data: { shareholderData: v },
      table: {
        firstName: v.firstName,
        middleName: v.middleName,
        lastName: v.lastName,
        secondLastName: v.secondLastName,
        email: v.email,
        phone: v.phone,
        country: v.countryResidence,
        participation: v.participation,
      },
    };

    this.modalRef.close(result);
  }

  /**
   * Validate required fields
   */
  validateRequiredFields(): boolean {
    const oneInvalid = Object.values(this.shareholderForm.controls).some(
      (control) => control.hasError('required')
    );
    if (oneInvalid) {
      Object.keys(this.shareholderForm.controls).forEach((controlName) => {
        if (this.shareholderForm.get(controlName)?.invalid) {
          this.shareholderForm.get(controlName)?.markAsTouched();
        }
      });
    }
    return oneInvalid;
  }

  /**
   * Validate incorrect formats
   */
  invalidFormatFields(): boolean {
    let invalid = false;
    Object.values(this.shareholderForm.controls).forEach((control) => {
      if (control.invalid) {
        invalid = true;
        control.markAsTouched();
      }
    });
    return invalid;
  }

  /**
   * Validate dropdowns (selects) required
   */
  invalidDropdowns(): boolean {
    const dropdowns = [
      'nationality',
      'countryResidence',
      'gender',
      'birthCountry',
      'birthEntity',
      'politicallyExposed',
    ];
    return dropdowns.some((field) => !this.shareholderForm.value[field]);
  }
}
