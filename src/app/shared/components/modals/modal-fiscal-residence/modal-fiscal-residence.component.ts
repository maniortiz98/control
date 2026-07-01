import { Component, Inject, inject, signal, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Countries } from '../../../../onboarding/models/country';
import { CatalogsService } from '../../../services/catalogs.service';
import { NotificationsService } from '../../../services/notifications.service';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { FirstDataClientService } from '../../../services/storage-services/first-data-client.service';
import { FiscalSelfDeclaration } from '../../../../onboarding/models/checkpoints/fiscal-self-declaration-checkpoint';

import { REGEX } from '../../../../onboarding/constants/constants';

// Utils
import {
  buildCleanPayload,
  pruneEmpty,
} from '../../../utils/auto-utils';
import { norm } from '../../../utils/policy';
import { maxDateValidator, oneOfRequiredFlagged } from '../../../utils/validators';
import { convertDateBack, toDate } from '../../../utils/datetime';
import moment from 'moment';
import { OnboardingService } from '../../../../onboarding/services/onboarding.service';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';

type RowPolicy = {
  requireTinOrSsn: boolean;
  optionalTinOrSsn: boolean;
  enableFreeTextReason: boolean;
  enableLossCertificate: boolean;
  requireNIF: boolean;
};

@Component({
  selector: 'app-modal-fiscal-residence',
  standalone: false,
  templateUrl: './modal-fiscal-residence.component.html',
  styleUrl: './modal-fiscal-residence.component.scss',
})
export class ModalFiscalResidenceComponent {
  @ViewChild('pickerBirthdate') pickerBirthdate!: MatDatepicker<Date>;
  // Injections
  private readonly catalogService = inject(CatalogsService);
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationsService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly firstDataClientService = inject(FirstDataClientService);
  private readonly onboardingService = inject(OnboardingService);
  private isMaintenance: boolean =
    this.onboardingService.getCurrentInfo().isMaintenance;
  // Permisos
  canRead = false;
  canEdit = false;
  canAdd = false;
  isReadOnly = false;
  get readOnly(): boolean {
    if (this.isFullRole() && this.canEdit) return false;

    return (this.canRead && !this.canEdit && this.isMaintenance) || this.isReadOnly;
  }

  private muteEffects = false;

  form: FormGroup = this.fb.group({
    id: [''],
    countryId: ['MX', Validators.required],
    nationality: ['MX', Validators.required],
    taxCountry: [''],
    doubleTaxCountry: ['-'],
    tributaMX: [''],
    nif: ['', [Validators.pattern(REGEX.NIF_TIN_NSS_VALIDATION)]],
    tin: ['', [Validators.pattern(REGEX.NIF_TIN_NSS_VALIDATION)]],
    nss: ['', [Validators.pattern(REGEX.NIF_TIN_NSS_VALIDATION)]],
    factaId: [''],
    active: [true],
    personId: [''],
    personType: [{ value: 'TITULAR', disabled: true }],
    declarationFiscalResidence: [true],
    proofOfAddressType: ['', Validators.maxLength(50)],
    expirationStatus: [
      { value: 'VIGENTE', disabled: true },
      Validators.maxLength(20),
    ],
    certificationDate: [null],
    expirationDate: [null],
    issueDate: [null],
    declarationYear: ['', Validators.maxLength(4)],
    aditionalDays: ['', Validators.maxLength(4)],
    autentication: [''],
  });

  errors = signal<string[]>([]);
  taxCountry = signal<string>('');
  countryBirth = signal<string>('');
  country = signal<string>('');
  countries = signal<Array<Countries>>([]);
  foreignerCURP = signal(false);
  isDoubleTributation = signal(false);
  proofOfAddressType = signal<any[]>([]);
  autentication = signal<any[]>([]);
  personType = signal<any[]>([]);
  dataClient: any = null;
  hiddenPersonType = false;
  tributaMX = false;
  showNifTinNss = false;

  private readonly authBase = [
    {
      desAutenticationType: 'ID Fiscal Extranjero (NIF / TIN / NSS)',
      autenticationTypeId: 'US01',
    },
  ];
  private readonly authLoss = {
    desAutenticationType: 'Certificado de Pérdida de Nacionalidad',
    autenticationTypeId: 'US02',
  };
  private readonly authFree = {
    desAutenticationType: 'Escrito Libre sin NSS',
    autenticationTypeId: 'US03',
  };

  private requireTinOrSsnFlag = false;

  constructor(
    private readonly modalRef: MatDialogRef<ModalFiscalResidenceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (data?.isCotitular) {
      this.form.patchValue(
        { personType: 'COTITULAR' },
        { emitEvent: false },
      );
    }
    const p = data?.permissions?.permission as string[] | undefined;
    this.canRead = !!(data?.canRead ?? p?.includes('read'));
    this.canEdit = !!(data?.canEdit ?? p?.includes('edit'));
    this.canAdd = !!(data?.canAdd ?? p?.includes('add'));
    this.isReadOnly = !!data?.readOnly;

    this.dataClient = this.firstDataClientService.getItem();

    const defaultCountryId =
      this.data?.minFiscalData?.countryBirth ??
      this.dataClient?.countryOfBirth ??
      'MX';

    const defaultNationality =
      this.data?.minFiscalData?.taxCountry ??
      this.dataClient?.nationality ??
      'MX';

    const isEdit = !!data?.edit;

    if (!isEdit) {
      const hasPreset = !!(
        data?.data?.countryId ||
        data?.data?.nationality ||
        data?.data?.country
      );
      if (!hasPreset) {
        this.muteEffects = true;
        this.form.patchValue(
          {
            countryId: defaultCountryId,
            nationality: defaultNationality,
            taxCountry: defaultCountryId,
            doubleTaxCountry: '-',
          },
          { emitEvent: false },
        );
        this.muteEffects = false;
      }
    }

    if (isEdit) {
      this.fillEditForm(data);
    }

    this.personType.set([
      { desPersonType: 'TITULAR', personTypeId: '1' },
      { desPersonType: 'COTITULAR', personTypeId: '2' },
    ]);
    this.proofOfAddressType.set([
      {
        desProffOfAddressType: 'CONSTANCIA DE RESIDENCIA FISCAL',
        proffOfAddressTypeId: 'XX03',
      },
      {
        desProffOfAddressType: 'ID FISCAL EXTRANJERO',
        proffOfAddressTypeId: 'XX01',
      },
    ]);

    this.autentication.set([...this.authBase, this.authLoss, this.authFree]);

    this.form.setValidators([
      oneOfRequiredFlagged(
        () => this.requireTinOrSsnFlag,
        'tin',
        'nss',
        'tinOrSsnRequired',
      ),
    ]);

    if (this.readOnly) this.form.disable({ emitEvent: false });

    document.body.classList.remove('show-validation');
  }

  get showNonMXSection(): boolean {
    const birth = norm(this.form.get('countryId')?.value);
    const tax = norm(this.form.get('taxCountry')?.value);
    return birth !== 'MX' || tax !== 'MX';
  }

  get showMXSection(): boolean {
    const birth = norm(this.form.get('countryId')?.value);
    const tax = norm(this.form.get('taxCountry')?.value);
    return birth === 'MX' && tax === 'MX';
  }

  close() {
    this.modalRef.close(null);
  }

  ngOnInit() {
    this.catalogService
      .getCountry({ land: [] })
      .subscribe((c) => this.countries.set(c));

    const recompute = () => {
      if (this.muteEffects) return;

      const hasTax = !!(this.form.get('taxCountry')?.value || '').trim();
      if (!hasTax) {
        this.clearDependentControls();
        return;
      }

      const p = this.computeRowPolicy();
      this.applyRowPolicy(p);

      const birth = norm(this.form.get('countryId')?.value);
      const tax = norm(this.form.get('taxCountry')?.value);
      const isMX = birth === 'MX' && tax === 'MX';

      if (isMX) {
        this.applyMexicoMinimalRequiredAndClean();
      } else {
        this.seedDefaultsIfMissing();

        if (this.isConstanciaSelected())
          this.setProofValidatorsMode('constancia');
        else if (this.isIdFiscalSelected())
          this.setProofValidatorsMode('idExtranjero');

        this.trimByProofTypeNow();

        this.applyAuthRequiredsBySelection();
      }
    };

    this.form.get('countryId')?.valueChanges.subscribe(() => {
      if (!this.muteEffects) recompute();
    });
    this.form.get('nationality')?.valueChanges.subscribe(() => {
      if (!this.muteEffects) recompute();
    });
    this.form.get('taxCountry')?.valueChanges.subscribe(() => {
      if (!this.muteEffects) recompute();
    });


    this.form
      .get('expirationDate')
      ?.valueChanges.subscribe((value) => {
        if (!value) return;

        const today = moment().startOf('day');
        const expiration = moment(value).startOf('day');

        const status =
          expiration.isBefore(today) ? 'VENCIDA' : 'VIGENTE';

        this.form.get('expirationStatus')?.setValue(status, {
          emitEvent: false,
        });
      });


    this.form.get('proofOfAddressType')?.valueChanges.subscribe(() => {
      if (this.muteEffects) return;

      const isMX =
        norm(this.form.get('countryId')?.value) === 'MX' &&
        norm(this.form.get('taxCountry')?.value) === 'MX';

      if (isMX) {
        this.applyMexicoMinimalRequiredAndClean();
      } else {
        if (this.isConstanciaSelected())
          this.setProofValidatorsMode('constancia');
        else if (this.isIdFiscalSelected())
          this.setProofValidatorsMode('idExtranjero');

        this.trimByProofTypeNow();
        this.seedDefaultsIfMissing();
        this.applyAuthRequiredsBySelection();
      }
    });

    this.form.get('autentication')?.valueChanges.subscribe(() => {
      if (this.muteEffects) return;

      this.applyAuthRequiredsBySelection();

      const p = this.computeRowPolicy();
      this.applyRowPolicy(p);
    });

    const tc = this.form.get('taxCountry')?.value;
    if (tc) {
      const p = this.computeRowPolicy();
      this.applyRowPolicy(p);
    }

    this.form.valueChanges.subscribe(() => {
      this.unsavedChangesService.setUnsavedChanges(this.form.dirty);
    });
    
    setTimeout(() => {
      if (this.readOnly) {
        this.form.disable({ emitEvent: false });
      } else {
        this.form.enable({ emitEvent: false });
      }
    });
  }

  private normLabel(v: any): string {
    return (v ?? '').toString().trim().toUpperCase();
  }

  isConstanciaSelected(): boolean {
    const cur = this.normLabel(this.form.get('proofOfAddressType')?.value);
    return cur === 'CONSTANCIA DE RESIDENCIA FISCAL';
  }

  isIdFiscalSelected(): boolean {
    const cur = this.normLabel(this.form.get('proofOfAddressType')?.value);
    return cur === 'ID FISCAL EXTRANJERO';
  }

  private isAuthUS01ByLabel(): boolean {
    const cur = this.normLabel(this.form.get('autentication')?.value);
    return cur.includes('ID FISCAL EXTRANJERO');
  }

  private computeRowPolicy(): RowPolicy {
    const birth = norm(this.form.get('countryId')?.value);
    const nat = norm(this.form.get('nationality')?.value);
    const tax = norm(this.form.get('taxCountry')?.value);

    const requireTinOrSsn = tax === 'US'; // (001)
    const optionalTinOrSsn =
      !requireTinOrSsn && (birth === 'US' || nat === 'US'); // (002)
    const enableFreeTextReason = optionalTinOrSsn; // (003)
    const enableLossCertificate =
      birth === 'US' && nat !== 'US' && tax !== 'US'; // (004)
    const requireNIF = tax === 'OTRO'; // (009)

    return {
      requireTinOrSsn,
      optionalTinOrSsn,
      enableFreeTextReason,
      enableLossCertificate,
      requireNIF,
    };
  }

  private applyRowPolicy(p: RowPolicy) {
    const isUS01 = this.isAuthUS01ByLabel();

    this.requireTinOrSsnFlag = p.requireTinOrSsn && isUS01;

    const nif = this.form.get('nif');
    if (p.requireNIF && isUS01) {
      nif?.setValidators([Validators.required]);
    } else {
      nif?.clearValidators();
    }
    nif?.updateValueAndValidity({ emitEvent: false });

    this.autentication.set([...this.authBase, this.authLoss, this.authFree]);

    this.form.updateValueAndValidity({ emitEvent: false });
  }
  birthDates = {
    max: new Date()
  };

  onDateInput(event: MatDatepickerInputEvent<Date>) {
    const date = event.value;
    const control = this.form.get('issueDate');
  
    if (date instanceof Date && control && this.pickerBirthdate) {
      this.pickerBirthdate.select(date); 
    }
  }

  private setProofValidatorsMode(mode: 'constancia' | 'idExtranjero') {
    const issue = this.form.get('issueDate');
    const expSt = this.form.get('expirationStatus');
    const expDt = this.form.get('expirationDate');
    const cert = this.form.get('certificationDate');
    const year = this.form.get('declarationYear');

    if (this.isFullRole()) {
      if (mode === 'constancia') {
        issue?.setValidators([Validators.required]);
        expDt?.setValidators([Validators.required]);

        cert?.clearValidators();
        year?.clearValidators();
        expSt?.clearValidators();

        expSt?.enable({ emitEvent: false });
      } else {
        cert?.setValidators([Validators.required]);
        year?.setValidators([Validators.required]);

        issue?.clearValidators();
        expDt?.clearValidators();
        expSt?.clearValidators();
        expSt?.enable({ emitEvent: false });
      }
    } else {
      if (mode === 'constancia') {
        issue?.enable({ emitEvent: false });
        expDt?.enable({ emitEvent: false });

        issue?.setValidators([Validators.required]);
        expDt?.setValidators([Validators.required]);

        expSt?.disable({ emitEvent: false });
        cert?.disable({ emitEvent: false });
        year?.disable({ emitEvent: false });

        cert?.clearValidators();
        year?.clearValidators();
      } else {
        cert?.enable({ emitEvent: false });
        year?.enable({ emitEvent: false });

        cert?.setValidators([Validators.required]);
        year?.setValidators([Validators.required]);

        issue?.disable({ emitEvent: false });
        expDt?.disable({ emitEvent: false });
        expSt?.disable({ emitEvent: false });

        issue?.clearValidators();
        expDt?.clearValidators();
      }
    }

    [issue, expSt, expDt, cert, year].forEach((c) =>
      c?.updateValueAndValidity({ emitEvent: false }),
    );
  }

  private clearDependentControls(): void {
    const toClearAlways = ['autentication', 'nif', 'tin', 'nss'];
    toClearAlways.forEach((n) => {
      const c = this.form.get(n);
      if (!c) return;
      c.clearValidators();
      c.setValue(null, { emitEvent: false });
      c.updateValueAndValidity({ emitEvent: false });
    });
    this.trimByProofTypeNow();
  }

  private trimByProofTypeNow() {
    if (this.isConstanciaSelected()) {
      this.form.get('certificationDate')?.setValue(null, { emitEvent: false });
      this.form.get('declarationYear')?.setValue('', { emitEvent: false });
    } else if (this.isIdFiscalSelected()) {
      this.form.get('issueDate')?.setValue(null, { emitEvent: false });
      this.form.get('expirationStatus')?.setValue('', { emitEvent: false });
      this.form.get('expirationDate')?.setValue(null, { emitEvent: false });
    } else {
      [
        'issueDate',
        'expirationStatus',
        'expirationDate',
        'certificationDate',
        'declarationYear',
      ].forEach((n) =>
        this.form
          .get(n)
          ?.setValue(n.endsWith('Date') ? null : '', { emitEvent: false }),
      );
    }
  }

  private applyMexicoMinimalRequiredAndClean(): void {
    const birth = norm(this.form.get('countryId')?.value);
    const tax = norm(this.form.get('taxCountry')?.value);
    const isMX = birth === 'MX' && tax === 'MX';
    if (!isMX) return;

    const personTypeCtrl = this.form.get('personType');
    const taxCountryCtrl = this.form.get('taxCountry');
    const expSt = this.form.get('expirationStatus');

    if (!personTypeCtrl?.value) {
      personTypeCtrl?.setValue('TITULAR', { emitEvent: false });
    }

    if (!taxCountryCtrl?.value) {
      taxCountryCtrl?.setValue('MX', { emitEvent: false });
    }

    if (this.isFullRole()) {
      personTypeCtrl?.setValidators([Validators.required]);
      taxCountryCtrl?.setValidators([Validators.required]);

      personTypeCtrl?.enable({ emitEvent: false });
      expSt?.enable({ emitEvent: false });
    } else {
      personTypeCtrl?.disable({ emitEvent: false });
      expSt?.disable({ emitEvent: false });
    }

    personTypeCtrl?.updateValueAndValidity({ emitEvent: false });
    taxCountryCtrl?.updateValueAndValidity({ emitEvent: false });
  }

  private applyAuthRequiredsBySelection(): void {
    const isUS01 = this.isAuthUS01ByLabel();
    const tax = norm(this.form.get('taxCountry')?.value);

    const nif = this.form.get('nif');
    const tin = this.form.get('tin');
    const nss = this.form.get('nss');

    if (isUS01) {
      this.showNifTinNss = true;
      this.requireTinOrSsnFlag = tax === 'US';

      if (tax === 'OTRO') nif?.setValidators([Validators.required]);
      else nif?.clearValidators();

      nif?.updateValueAndValidity({ emitEvent: false });
      tin?.updateValueAndValidity({ emitEvent: false });
      nss?.updateValueAndValidity({ emitEvent: false });
    } else {
      this.showNifTinNss = false;
      this.requireTinOrSsnFlag = false;
      nif?.clearValidators();
      tin?.clearValidators();
      nss?.clearValidators();
      nif?.updateValueAndValidity({ emitEvent: false });
      tin?.updateValueAndValidity({ emitEvent: false });
      nss?.updateValueAndValidity({ emitEvent: false });
    }

    this.form.updateValueAndValidity({ emitEvent: false });
  }
  updateValid(){
    Object.keys(this.form.controls).forEach(controlName => {
      const control = this.form.get(controlName);
      control?.updateValueAndValidity();
    });
  }

  isRequired(controlName: string): boolean {
    const control = this.form.get(controlName);
    if (!control) return false;
    const test = control.validator?.({} as AbstractControl);
    return !!test?.['required'];
  }

  allowAlphanumericOnly(event: KeyboardEvent): void {
    const regex = /^[a-zA-Z0-9]$/;
    if (!regex.test(event.key)) event.preventDefault();
  }

  allowNumericOnly(event: KeyboardEvent): void {
    const regex = /^[0-9]$/;
    if (!regex.test(event.key)) event.preventDefault();
  }

  error(): void {
    Object.values(this.form.controls).forEach((c) => {
      if (c.invalid) c.markAsTouched();
    });
  }

  getCamposInvalidos(): string[] {
    const camposInvalidos: string[] = [];
    Object.keys(this.form.controls).forEach((n) => {
      const c = this.form.get(n);
      if (c && c.invalid) camposInvalidos.push(n);
    });
    return camposInvalidos;
  }

  validador(): boolean {
    document.body.classList.add('show-validation');
    const issue = this.form.get('issueDate');
    this.updateValid();
    const invalidos = this.getCamposInvalidos();
    if (invalidos.length > 0) {
      this.notificationService.error('Faltan Campos Obligatorios por Capturar');
      this.error();
      return true;
    }
    if(issue?.hasValidator(Validators.required) && this.form.get('issueDate')?.value > this.birthDates.max && !this.form.get('issueDate')?.disabled){
      issue?.setErrors({ invalidFormat: true });
      issue?.markAsTouched();
      this.notificationService.error('Fecha de Emisión no Válida');
      return true;
    }

    return false;
  }

  async submit() {
    if (!this.validador()) {
      this.unsavedChangesService.setUnsavedChanges(false);
      return this.form.getRawValue();
    } else {
      return null;
    }
  }

  async saveFiscalResidenceAddress() {
    if (this.readOnly) return;

    document.body.classList.add('show-validation');

    const form = await this.submit();
    if (form === null) return;

    const withDates = {
      ...form,
      issueDate: this.toStrDate(form.issueDate),
      expirationDate: this.toStrDate(form.expirationDate),
      certificationDate: this.toStrDate(form.certificationDate),
    };

    const isMX =
      norm(form.countryId) === 'MX' && norm(form.taxCountry) === 'MX';
    if (isMX) {
      withDates.personType =
        withDates.personType ||
        this.personType()?.[0]?.desPersonType?.toString?.() ||
        'TITULAR';
      withDates.taxCountry = withDates.taxCountry || 'MX';
      Object.assign(withDates, {
        proofOfAddressType: '',
        issueDate: '',
        expirationDate: '',
        certificationDate: '',
        declarationYear: '',
        expirationStatus: '',
        nif: '',
        tin: '',
        nss: '',
        autentication: '',
        aditionalDays: '',
      });
    }

    const cleaned = buildCleanPayload(withDates);
    const payload = pruneEmpty(cleaned);

    const existingId = form.fiscalResidenceId || form.id || null;
    const existingPerson = form.personId || null;
    const existingActive =
      typeof form.active === 'boolean' ? form.active : true;
    const existingFactaId =
      form.factaId ?? form?.factaObligations?.factaId ?? null;

    const keepTempId =
      this.data?.data?.tempId ||
      this.data?.table?.tempId ||
      crypto.randomUUID();

    const data: FiscalSelfDeclaration = {
      mexicoResident: true,
      curp: '',
      foreignerWithoutCurp: true,
      rfc: '',
      name: '',
      fiscalRegimeId: 0,
      cfdiUse: '',
      taxPostalCode: '',
      nationality: payload['nationality'] ?? '',
      country: payload['countryId'] ?? '',
      fiscalResidenceAbroad: true,
      facta: false,
      crs: false,
      fiscalResidences: [
        {
          id: existingId,
          tempId: keepTempId,
          personId: existingPerson,
          active: existingActive,
          personType: payload['personType'] ?? '',
          country: payload['taxCountry'] ?? '',
          declarationFiscalResidence:
            payload['declarationFiscalResidence'] ?? false,
          proofOfAddressType: payload['proofOfAddressType'] ?? '',
          issueDate: payload['issueDate'] ?? '',
          expirationStatus: payload['expirationStatus'] ?? '',
          expirationDate: payload['expirationDate'] ?? '',
          certificationDate: payload['certificationDate'] ?? '',
          declarationYear: payload['declarationYear'] ?? '',
          aditionalDays: payload['aditionalDays'] ?? '',
          factaObligations: pruneEmpty({
            factaId: existingFactaId,
            autentication: payload['autentication'] ?? '',
            nif: payload['nif'] ?? '',
            tin: payload['tin'] ?? '',
            nss: payload['nss'] ?? '',
          }) as any,
        },
      ],
    };

    this.modalRef.close(data);
  }

  fillEditForm(fiscalAddress: any) {
    this.muteEffects = true;

    const data = fiscalAddress?.data ?? {};
    const table = fiscalAddress?.table ?? {};

    const birth = data.countryId || this.form.value.countryId || 'MX';
    const nationality = data.nationality || this.form.value.nationality || 'MX';
    const taxCountry = data.country || this.form.value.taxCountry || birth;
    const proof =
      data.proofOfAddressType || this.form.value.proofOfAddressType || '';

    this.form.patchValue(
      {
        id: data.id ?? this.form.value.id ?? '',
        personId: table.personId ?? data.personId ?? '',
        active: table.active ?? data.active ?? true,
        countryId: birth,
        nationality: nationality,
        taxCountry: taxCountry,
        doubleTaxCountry: this.form.value.doubleTaxCountry,
        tributaMX: this.tributaMX,
        proofOfAddressType: proof,
        expirationStatus: data.expirationStatus ?? '',
        certificationDate: toDate(data.certificationDate) ?? null,
        expirationDate: toDate(data.expirationDate) ?? null,
        issueDate: toDate(data.issueDate) ?? null,
        declarationYear: data.declarationYear ?? '',
        aditionalDays: data.aditionalDays ?? '',
        personType: data.personType ?? '',
        declarationFiscalResidence: data.declarationFiscalResidence ?? false,
        autentication: data?.factaObligations?.autentication || '',
        nif: table.nif ?? data?.factaObligations?.nif ?? '',
        tin: table.tin ?? data?.factaObligations?.tin ?? '',
        nss: data?.factaObligations?.nss ?? '',
        factaId: data?.factaObligations?.factaId ?? null,
      },
      { emitEvent: false },
    );

    if (this.isConstanciaSelected()) this.setProofValidatorsMode('constancia');
    else if (this.isIdFiscalSelected())
      this.setProofValidatorsMode('idExtranjero');

    const b = norm(this.form.get('countryId')?.value);
    const t = norm(this.form.get('taxCountry')?.value);
    if (b === 'MX' && t === 'MX') this.applyMexicoMinimalRequiredAndClean();
    else this.seedDefaultsIfMissing();

    this.muteEffects = false;

    setTimeout(() => {
      if (this.readOnly) {
        this.form.disable({ emitEvent: false });
      } else {
        this.form.enable({ emitEvent: false });
      }
    });

    this.form.get('nif')?.updateValueAndValidity();
  }

  private seedDefaultsIfMissing(): void {
    const isMX =
      norm(this.form.get('countryId')?.value) === 'MX' &&
      norm(this.form.get('taxCountry')?.value) === 'MX';
    if (isMX) return;

    const proofs = this.proofOfAddressType();
    const auths = this.autentication();

    const proofCtrl = this.form.get('proofOfAddressType');
    const authCtrl = this.form.get('autentication');

    if (!this.normLabel(proofCtrl?.value)) {
      const firstProof =
        proofs?.[0]?.desProffOfAddressType || 'CONSTANCIA DE RESIDENCIA FISCAL';
      proofCtrl?.setValue(firstProof, { emitEvent: false });

      if (this.normLabel(firstProof) === 'CONSTANCIA DE RESIDENCIA FISCAL') {
        this.setProofValidatorsMode('constancia');
      } else {
        this.setProofValidatorsMode('idExtranjero');
      }
    } else {
      if (this.isConstanciaSelected())
        this.setProofValidatorsMode('constancia');
      else if (this.isIdFiscalSelected())
        this.setProofValidatorsMode('idExtranjero');
    }

    if (!this.normLabel(authCtrl?.value)) {
      const firstAuth =
        auths?.[0]?.desAutenticationType ||
        'ID Fiscal Extranjero (NIF / TIN / NSS)';
      authCtrl?.setValue(firstAuth, { emitEvent: false });
    }

    this.trimByProofTypeNow();
    this.applyAuthRequiredsBySelection();
  }

  private toStrDate(value: unknown): string {
    if (typeof value === 'string') return value.trim();

    const result = convertDateBack(value as any);
    if (result === '') return '';

    if (moment.isMoment(result)) return result.format('DD/MM/YYYY');
    if (result instanceof Date) {
      const dd = String(result.getDate()).padStart(2, '0');
      const mm = String(result.getMonth() + 1).padStart(2, '0');
      const yyyy = result.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    }
    return String(result);
  }

  private isFullRole(): boolean {
    return this.data?.permissions?.fieldsEnabled?.includes('*');
  }
}


