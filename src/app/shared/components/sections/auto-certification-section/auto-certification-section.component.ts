import { Component, DestroyRef, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

import { REGEX, STRINGS } from '../../../../onboarding/constants/constants';
import {
  ERROR_MESSAGES,
  NOTIFICATION_MESSAGES,
  SUCCESS_MESSAGES,
} from '../../../../onboarding/constants/form-messages';

import { Nationalities } from '../../../../onboarding/models/nationality';
import { Countries } from '../../../../onboarding/models/country';
import { CFDI } from '../../../../onboarding/models/cfdi';
import { FiscalRegimes } from '../../../../onboarding/models/fiscal-regime';
import {
  ClientTaxData,
  FiscalSelfDeclarationPageData,
  FiscalSelfDeclarationTableData,
  MinFiscalData,
} from '../../../../onboarding/models/fiscal-self-declaration-data';
import { FiscalSelfDeclaration } from '../../../../onboarding/models/checkpoints/fiscal-self-declaration-checkpoint';
import { Relationships } from '../../../../onboarding/models/relationships';
import { CurrentOnboardingInfo } from '../../../../onboarding/models/current-onboarding';
import { ConfigDataTable } from '../../table-results/interfaces';

import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { ModalFormService } from '../../../../shared/services/modal-form.service';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { OnboardingService } from '../../../../onboarding/services/onboarding.service';
import { PermissionRolService } from '../../../../core/services/rol.service';
import { NotificationModalService } from '../../../services/notification-modal.service';
import { ModalFiscalResidenceComponent } from '../../modals/modal-fiscal-residence/modal-fiscal-residence.component';

import { validCombobox, markInvalidControls } from '../../../../shared/utils/form';

// (Rules 001–009)
import { computePolicy } from '../../../utils/policy';
import { omit, stripTempIdDeep } from '../../../utils/auto-utils';
import { formFunctionDis, formFunctionEn } from '../../../utils/disableOrEnabled';
import { AuthService } from '../../../../core/services/auth.service';
@Component({
  selector: 'app-auto-certification-section',
  standalone: false,
  templateUrl: './auto-certification-section.component.html',
  styleUrl: './auto-certification-section.component.scss',
})
export class AutoCertificationSectionComponent {
  @Input() dataAutoCertification?: ClientTaxData | null = null;
  @Input() hideRoleSection?: boolean = false;
  @Input() hideProofOfAddressSection?: boolean = false;
  @Input() addressClient?: boolean = false;
  @Input() isCotitular?: boolean = false;
  @Input() onboardingInfo?: CurrentOnboardingInfo;
  @Input() showButtonsUI?: boolean = false;
  @Input() externalPermissions: any;
  @Input() actionsActiveMant?: {
    mant: boolean;
    active: boolean;
    buttons: {
      edit: boolean;
      delete: boolean;
      read: boolean;
      add: boolean;
    };
  } = {
    mant: false,
    active: false,
    buttons: {
      edit: true,
      delete: true,
      read: true,
      add: false,
    },
  };


  @Output() formGroupEmitter = new EventEmitter<FormGroup>();

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly catalogService = inject(CatalogsService);
  private readonly notificationService = inject(NotificationsService);
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly modalService = inject(ModalFormService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly permissionService = inject(PermissionRolService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);

  // Form
  form: FormGroup = this.fb.group({
    mexicoResident: [undefined, [Validators.required]],
    curp: [
      { value: '', disabled: true },
      [Validators.required, Validators.pattern(REGEX.CURP_VALIDATION), Validators.maxLength(18)],
    ],
    foreignerWithoutCurp: [{ value: false, disabled: false }],
    rfc: [
      { value: '', disabled: false },
      [Validators.required, Validators.pattern(REGEX.RFC_VALIDATION), Validators.maxLength(13)],
    ],
    name: [{ value: '', disabled: false }, [Validators.required, Validators.maxLength(100)]],
    fiscalRegimeId: ['', [Validators.required, Validators.maxLength(100)]],
    cfdiUse: ['', [Validators.required, Validators.maxLength(100)]],
    taxPostalCode: [
      { value: '' },
      [Validators.required, Validators.maxLength(5), Validators.pattern(REGEX.ONLY_NUMBERS)],
    ],
    nationality: [
      { value: '', disabled: true },
      [Validators.required, Validators.pattern(REGEX.STATE_VALIDATION)],
    ],
    fiscalResidences: ['', [Validators.required]],
    declarationFiscalResidence: ['', [Validators.required]],
    country: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(30)]],
    fiscalResidenceAbroad: [undefined, [Validators.required]],
    fatca: [false, [Validators.required]],
    crs: [false, [Validators.required]],
  });

  // Signals
  errors = signal<string[]>([]);
  nationalities = signal<Nationalities[]>([]);
  countries = signal<Array<Countries>>([]);
  fiscalRegime = signal<FiscalRegimes[]>([]);
  cfdi = signal<CFDI[]>([]);
  foreignerCURP = signal(false);
  foreign = signal(false);
  crs = signal('');
  fatca = signal('');
  columnsFiscalResidences: Array<any> = [];
  relationships = signal<Array<Relationships>>([]);
  isCustomer: boolean = this.onboardingService.getCurrentInfo().isCustomer;
  dataFiscalResidencesData = signal<FiscalSelfDeclarationPageData>({
    data: [],
    table: [],
  });
  userOverrides = new Set<string>();

  // variables
  tableData = signal<Array<FiscalSelfDeclarationTableData>>([]);
  checkCurpValidation = true;
  tableConfig: ConfigDataTable = {
    showPag: false,
    showViewAction: false,
    showEditAction: true,
    showDeleteAction: false,
    multipleSelection: false,
    idName: 'tempId',
    singleSelection: {
      show: true,
      title: 'Domicilio Fiscal Activo',
      propertyName: 'declarationFiscalResidence',
    },
  };

  /** Data for Maintenance */
  isMaintenance: boolean = this.onboardingService.getCurrentInfo().isMaintenance;
  permissions = this.resolvePermissions();
  disButtons = { edit: false, register: false, save: false, cancel: false };
  canRead = false;
  canEdit = false;
  canAdd = false;
  canDelete = false;
  isReadOnly = false;

  constructor() {
    document.body.classList.remove('show-validation');
  }

  private sameIdentity(a: any, b: any): boolean {
    if (!a || !b) return false;
    if (a.id && b.id) return a.id === b.id;
    return !!a.tempId && !!b.tempId && a.tempId === b.tempId;
  }

  private rebuildTableFromData(data: any[]): any[] {
    const active = (data ?? []).filter((r) => r.active !== false);
    return active.map((r, i) => ({
      tempId: r.tempId,
      registerNo: i + 1,
      personType: r.personType,
      proofOfAddressType: r.country,
      autentication: r.factaObligations?.autentication ?? '',
      proofOfAddressFiscal: r.proofOfAddressType,
      nif: r.factaObligations?.nif ?? '',
      tin: r.factaObligations?.tin ?? '',
      nss: r.factaObligations?.nss ?? '',
      declarationFiscalResidence: r.declarationFiscalResidence,
    }));
  }

  isNotEmpty(obj: any) {
    return Object.keys(obj).length > 0;
  }

  ngOnInit() {
    this.applyRolePermissions();

    if (this.isMaintenance) {
      this.initializeMaintenance();
    }
    if (this.actionsActiveMant?.mant && this.actionsActiveMant?.active) {
      this.editMaintenance();
    }

    if (!this.isMaintenance) {
      this.form.enable({ emitEvent: false });

      this.canRead = true;
      this.canEdit = true;
      this.canAdd = true;
      this.canDelete = true;

      this.tableConfig.showDeleteAction = true;

      this.disButtons = {
        edit: false,
        register: false,
        save: false,
        cancel: false,
      };

      this.lockComputedFlags();
    }

    const personType = this.onboardingService.getCurrentInfo().personType;

    this.catalogService.getCountry({ land: [] }).subscribe((c) => this.countries.set(c));
    this.catalogService.getNationalities({ land: [] }).subscribe((c) => this.nationalities.set(c));

    this.catalogService
      .getCfdi({ personType, fiscalRegimeId: '' })
      .subscribe((c) => this.cfdi.set(c));
    this.catalogService.getFiscalRegime({ personType }).subscribe((c: any) => {
      this.fiscalRegime.set(c);
    });

    this.form.patchValue({
      foreignerWithoutCurp: this.dataAutoCertification?.foreignerWithoutCurp,
    });

    if (this.form.value.foreignerWithoutCurp) {
      this.foreignerCURP.set(this.form.value.foreignerWithoutCurp);
      this.isForeigner();
    } else {
      this.isForeigner();
    }

    this.form
      .get('rfc')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: any) => this.handleRfcDynamicFields(value));

    this.form.patchValue({ rfc: this.dataAutoCertification?.rfc });
    this.form.get('rfc')?.updateValueAndValidity();

    this.form
      .get('foreignerWithoutCurp')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: any) => {
        this.foreignerCURP.set(value);
        this.userOverrides.add('foreignerWithoutCurp');
        this.isForeigner();
      });

    this.form.patchValue({
      mexicoResident: this.dataAutoCertification?.mexicoResident ? 'true' : 'false',
      fiscalResidenceAbroad: this.dataAutoCertification?.fiscalResidenceAbroad ? 'true' : 'false',
      name: this.dataAutoCertification?.name,
      taxPostalCode: this.dataAutoCertification?.taxPostalCode,
      fatca: this.dataAutoCertification?.facta,
      crs: this.dataAutoCertification?.crs,
    });

    if (this.dataAutoCertification && this.isNotEmpty(this.dataAutoCertification)) {
      this.form.patchValue({
        curp: this.dataAutoCertification.curp?.toUpperCase(),
        nationality: this.dataAutoCertification.nationality?.toUpperCase(),
        country: this.dataAutoCertification.country?.toUpperCase(),
        fiscalRegimeId: this.dataAutoCertification?.fiscalRegimeId?.toString(),
        cfdiUse: this.dataAutoCertification?.cfdiUse,
      });
    }

    this.columnsFiscalResidences = [
      { name: 'registerNo', title: 'Registro No.', show: true, type: 'string' },
      {
        name: 'personType',
        title: 'Tipo de Persona',
        show: true,
        type: 'string',
      },
      {
        name: 'proofOfAddressType',
        title: 'Residencia Fiscal',
        show: true,
        type: 'string',
      },
      {
        name: 'autentication',
        title: 'Auto-Certificación',
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

    if (
      this.dataAutoCertification?.fiscalResidences &&
      Array.isArray(this.dataAutoCertification.fiscalResidences)
    ) {
      this.dataAutoCertification.fiscalResidences = this.dataAutoCertification.fiscalResidences.map(
        (r: any) => ({
          ...r,
          declarationFiscalResidence:
            r.declarationFiscalResidence === true || r.declarationFiscalResidence === 'true',
        }),
      );
    }

    this.existFiscalResidences();
    this.tableData.set(this.dataFiscalResidencesData().table);
    this.formGroupEmitter.emit(this.form);

    console.log('MANTE');
    console.log(this.actionsActiveMant);
    if (this.actionsActiveMant?.mant) {
      if (this.actionsActiveMant?.active) {
        this.permissions = {
          hide: false,
          permission: Object.entries(this.actionsActiveMant.buttons)
            .filter(([key, value]) => value)
            .map(([key]) => key),
          allDisabled: false,
          fieldsDisabled: [],
          buttonsDisabled: [],
        };
        this.editMaintenance();
        this.isReadOnly = false;
      } else {
        this.permissions = {
          hide: false,
          permission: Object.entries(this.actionsActiveMant.buttons)
            .filter(([key, value]) => value)
            .map(([key]) => key),
          allDisabled: true,
          fieldsDisabled: [],
          buttonsDisabled: [],
        };
        this.isReadOnly = true;
      }
    }

    /* Apply policy */
    this.applyPolicy();
    this.lockComputedFlags();

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((changes) => {
        Object.keys(changes).forEach((key) => {
          const control = this.form.get(key);

          if (control?.dirty) {
            this.userOverrides.add(key);
          }
        });
      });
  }

  replaceLetter(text: string): string {
    return text.replace(/[ñÑ]/g, 'X');
  }

  //Function to convert the curp to uppercase
  toUppercaseCURP(controlName: string): void {
    const control = this.form.get(controlName);
    if (control) {
      const upperValue = control.value?.toUpperCase();
      control.setValue(this.replaceLetter(upperValue), { emitEvent: false });
    }
  }

  /** RFC < 13 shortcuts XAXX/XEXX */
  private handleRfcDynamicFields(value: string) {
    const isBaseRFC = value && value.length === 10;
    const isFullRFC = value && value.length === 13;
    const hasRegime = !!this.form.get('fiscalRegimeId')?.value;

    const name = this.form.get('name');
    const fiscalRegime = this.form.get('fiscalRegimeId');
    const useCFDI = this.form.get('cfdiUse');
    const taxPostalCode = this.form.get('taxPostalCode');

    const fields = [
      { key: 'name', control: name },
      { key: 'fiscalRegimeId', control: fiscalRegime },
      { key: 'cfdiUse', control: useCFDI },
      { key: 'taxPostalCode', control: taxPostalCode },
    ];

    if (isBaseRFC) {
      fields.forEach((f) => {
        f.control?.removeValidators(Validators.required);
        // f.control?.setValue('');
        f.control?.disable();
      });
    }

    if (isFullRFC) {
      const allowed = this.isMaintenance
        ? new Set(this.permissions?.fieldsEnabled ?? [])
        : null;

      // name, fiscal, CP
      fields.forEach((f) => {
        f.control?.enable();
        if (f.key === 'cfdiUse') return;

        if (!this.isMaintenance || allowed?.has(f.key)) {
          f.control?.addValidators(Validators.required);
        } else {
          f.control?.addValidators(Validators.required);
        }
      });
    }

    fields.forEach((f) =>
      f.control?.updateValueAndValidity({ emitEvent: false }),
    );
  }

  isRequired(name: string): boolean {
    const control = this.form.get(name);
    if (!control || !control.validator) return false;
    const validator = control.validator({} as any);
    return validator && validator['required'];
  }

  existFiscalResidences() {
    if (!this.dataAutoCertification) return;

    const fiscalResidences = this.dataAutoCertification.fiscalResidences ?? [];

    const newData = fiscalResidences.map((residence) => {
      const tempId = crypto.randomUUID();
      return {
        tempId,
        personId: (this.isCotitular ? residence?.id : residence?.personId) || null,
        active: residence.active,
        personType: residence.personType,
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
          factaId: (this.isCotitular ? residence.factaObligations?.id : residence.factaObligations?.factaId) || null,
          autentication: residence.factaObligations?.autentication ?? '',
          nif: residence.factaObligations?.nif ?? '',
          tin: residence.factaObligations?.tin ?? '',
          nss: residence.factaObligations?.nss ?? '',
        },
      };
    });

    const activeRows = newData.filter((r) => r.active !== false);

    const newTable = activeRows.map((residence, i) => ({
      tempId: residence.tempId,
      registerNo: i + 1,
      personType: residence.personType,
      proofOfAddressType: residence.country,
      autentication: residence.factaObligations.autentication,
      proofOfAddressFiscal: residence.proofOfAddressType,
      nif: residence.factaObligations.nif,
      tin: residence.factaObligations.tin,
      nss: residence.factaObligations.nss,
      declarationFiscalResidence: residence.declarationFiscalResidence,
    }));

    this.dataFiscalResidencesData.set({ data: newData, table: newTable });
    this.form.patchValue({ fiscalResidences: activeRows.length > 0 });

    if (activeRows.length > 0 && activeRows.some((r) => r.declarationFiscalResidence)) {
      if (!this.userOverrides.has('declarationFiscalResidence')) {
        this.form.patchValue({ declarationFiscalResidence: true });
      }
    }
  }

  /** EXTRANJERO SIN CURP: habilita/deshabilita curp/country/nationality */
  isForeigner() {
    const curpControl = this.form.get('curp');
    const countryControl = this.form.get('country');
    const nationalityControl = this.form.get('nationality');

    const isFull = this.permissions?.fieldsEnabled?.includes('*');
    const isEditing = !this.isReadOnly;

    if (this.foreignerCURP()) {
      if (!isFull || !isEditing) {
        curpControl?.disable();
        curpControl?.clearValidators();
      }
      curpControl?.disable();

      curpControl?.removeValidators(Validators.required);
      curpControl?.updateValueAndValidity();

      countryControl?.enable();
      nationalityControl?.enable();

      const patch: any = {};
      const currentCurp = curpControl?.value;

      if (!isFull && !this.userOverrides.has('curp') && !currentCurp) {
        patch.curp = '';
      }

      if (!this.userOverrides.has('nationality')) patch.nationality = '';
      if (!this.userOverrides.has('country')) patch.country = '';

      this.form.patchValue(patch, { emitEvent: false });
    } else {
      const patch: any = {};
      const currentCurp = curpControl?.value;
      curpControl?.enable();
      curpControl?.addValidators(Validators.required);
      curpControl?.updateValueAndValidity();

      if (!this.userOverrides.has('curp') && !currentCurp) {
        patch.curp = this.dataAutoCertification?.curp;
      }

      if (!this.userOverrides.has('rfc')) patch.rfc = this.dataAutoCertification?.rfc;
      if (!this.userOverrides.has('nationality'))
        patch.nationality = this.dataAutoCertification?.nationality;
      if (!this.userOverrides.has('country')) patch.country = this.dataAutoCertification?.country;
      if (!this.userOverrides.has('name')) patch.name = this.dataAutoCertification?.name;
      if (!this.userOverrides.has('taxPostalCode'))
        patch.taxPostalCode = this.dataAutoCertification?.taxPostalCode;

      this.form.patchValue(patch, { emitEvent: false });
    }
  }

  ngAfterViewInit() {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.unsavedChangesService.setUnsavedChanges(this.form.dirty);
      });
  }

  searchRelationshipNameById(id: string): string {
    const relationships = this.relationships();
    const relationship = relationships.find((rela) => rela.idParent === id);
    return relationship ? relationship.kinShip : '';
  }

  eventRow(event: { type: string; row: any }): void {
    if (STRINGS.DELETE === event.type) {
      if (!this.canDelete && this.isMaintenance) return;

      this.notificationModalService
        .confirm({
          title: NOTIFICATION_MESSAGES.DELETE_QUESTION_MESSAGE,
          btnAccept: 'Si, Eliminar.',
          btnDeny: 'No',
        })
        .then((res: { value: boolean; message?: string } | undefined) => {
          if (!res || !res.value) return;

          const row = event.row;
          if (!row) return;

          const current = this.dataFiscalResidencesData();
          const updatedData = [...current.data];

          const idx = updatedData.findIndex((d) => this.sameIdentity(d, row));
          if (idx < 0) return;

          if (!this.isMaintenance) {
            updatedData.splice(idx, 1);
          } else {
            const target = updatedData[idx];
            const isPersisted = !!target?.factaObligations?.factaId;
            if (isPersisted) {
              updatedData[idx] = { ...target, active: false };
            } else {
              updatedData.splice(idx, 1);
            }
          }

          const updatedTable = this.rebuildTableFromData(updatedData);

          this.dataFiscalResidencesData.set({
            data: updatedData,
            table: updatedTable,
          });
          this.tableData.set(updatedTable);

          // reset
          if (updatedTable.length === 0) {
            this.form.patchValue(
              {
                fiscalResidences: false,
                declarationFiscalResidence: false,
                fatca: false,
                crs: false,
              },
              { emitEvent: false },
            );
          } else if (
            !updatedData.some((r) => r.active !== false && r.declarationFiscalResidence === true)
          ) {
            if (!this.userOverrides.has('declarationFiscalResidence')) {
              this.form.patchValue({ declarationFiscalResidence: true });
            }
          }

          this.applyPolicy();

          this.notificationService.success(SUCCESS_MESSAGES.ITEM_DELETED);
        });
      return;
    } else if (STRINGS.EDIT === event.type) {
      const row = event.row;
      if (!row) return;

      const current = this.dataFiscalResidencesData();
      const idx = current.data.findIndex((d) => this.sameIdentity(d, row));
      if (idx < 0) return;

      const dataEdit = current.data[idx];
      const dataTableEdit = current.table.find((t) => this.sameIdentity(t, row));
      const dataModal = { edit: true, data: dataEdit, table: dataTableEdit };

      this.editItem(dataModal);
    }
  }

  addFiscalResidences() {
    if (this.isMaintenance && !this.canAdd) {
      return;
    }

    const ctx = this.buildModalContext();

    let minFiscalData: MinFiscalData | null = null;
    if (this.isCotitular) {
      const raw = this.form.getRawValue();
      if (raw.nationality && raw.country) {
        minFiscalData = { taxCountry: raw.nationality, countryBirth: raw.country };
      }
    }

    this.modalService
      .fiscalResidenceModal(
        this.dataFiscalResidencesData(),
        null,
        minFiscalData ?? {
          taxCountry: ctx.nationality,
          countryBirth: ctx.countryId,
        },
        this.isCotitular,
      )
      .subscribe((result) => {
        if (result !== null && Array.isArray(result.fiscalResidences)) {
          const actual = this.dataFiscalResidencesData();
          const activeResidence =
            result.fiscalResidences.find((res) => res.declarationFiscalResidence) ??
            result.fiscalResidences[0];

          const newTempId = crypto.randomUUID();

          const newDataItem = {
            tempId: newTempId,
            personId: activeResidence.personId,
            active: activeResidence.active ?? true,
            personType: activeResidence.personType,
            country: activeResidence.country,
            declarationFiscalResidence: activeResidence.declarationFiscalResidence,
            proofOfAddressType: activeResidence.proofOfAddressType,
            issueDate: activeResidence.issueDate,
            expirationStatus: activeResidence.expirationStatus,
            expirationDate: activeResidence.expirationDate,
            certificationDate: activeResidence.certificationDate,
            declarationYear: activeResidence.declarationYear,
            aditionalDays: activeResidence.aditionalDays,
            factaObligations: {
              factaId: activeResidence.factaObligations?.factaId ?? null,
              autentication: activeResidence.factaObligations?.autentication ?? '',
              nss: activeResidence.factaObligations?.nss ?? '',
              nif: activeResidence.factaObligations?.nif ?? '',
              tin: activeResidence.factaObligations?.tin ?? '',
            },
          };

          const nextData = [...actual.data, newDataItem];
          const nextTable = this.rebuildTableFromData(nextData);

          this.dataFiscalResidencesData.set({
            ...actual,
            data: nextData,
            table: nextTable,
          });

          this.form.patchValue({ fiscalResidences: true });
          this.tableData.set(nextTable);

          if (nextData.length === 1) {
            nextData[0].declarationFiscalResidence = true;
            nextTable[0].declarationFiscalResidence = true;

            if (!this.userOverrides.has('declarationFiscalResidence')) {
              this.form.patchValue({ declarationFiscalResidence: true }, { emitEvent: false });
            }
          }

          this.applyPolicy();

          this.notificationService.success(SUCCESS_MESSAGES.SAVE_TAX_ADDRESS);
        }
      });
  }

  editItem(modalData: any): void {
    let data = modalData;

    let minFiscalData: MinFiscalData | null = null;
    if (this.isCotitular) {
      const raw = this.form.getRawValue();
      if (raw.nationality && raw.country) {
        minFiscalData = {
          taxCountry: raw.nationality,
          countryBirth: raw.country,
        };
        data = { ...data, minFiscalData, isCotitular: this.isCotitular };
      }
    }

    const dialogRef = this.dialog.open(ModalFiscalResidenceComponent, {
      maxWidth: '99%',
      data: {
        ...data,
        edit: true,
        permissions: this.permissions,
        readOnly: this.isReadOnly,
      },
      disableClose: true,
      panelClass: 'panel-class',
    });

    dialogRef.afterClosed().subscribe((modalData: any) => {
      if (!modalData || !Array.isArray(modalData.fiscalResidences)) return;
      const editedResidence = modalData.fiscalResidences[0];
      const current = this.dataFiscalResidencesData();

      const updatedData = [...current.data];

      const key = {
        tempId: data?.data?.tempId ?? null,
      };
      const idx = updatedData.findIndex((d) => this.sameIdentity(d, key));
      if (idx < 0) return;

      const keepTempId = updatedData[idx]?.tempId ?? crypto.randomUUID();
      const keepActive =
        typeof editedResidence.active === 'boolean'
          ? editedResidence.active
          : (updatedData[idx]?.active ?? true);

      updatedData[idx] = {
        ...updatedData[idx],
        tempId: keepTempId,
        active: keepActive,
        personId: editedResidence.personId ?? updatedData[idx]?.personId ?? null,
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
          factaId:
            editedResidence.factaObligations?.factaId ??
            updatedData[idx]?.factaObligations?.factaId ??
            null,
          autentication: editedResidence.factaObligations?.autentication ?? '',
          nif: editedResidence.factaObligations?.nif ?? '',
          tin: editedResidence.factaObligations?.tin ?? '',
          nss: editedResidence.factaObligations?.nss ?? '',
        },
      };

      const updatedTable = this.rebuildTableFromData(updatedData);

      this.dataFiscalResidencesData.set({
        ...current,
        data: updatedData,
        table: updatedTable,
      });
      this.tableData.set(updatedTable);

      this.applyPolicy();
      this.notificationService.success(SUCCESS_MESSAGES.SUCCESSFUL_UPDATE);
    });
  }

  allowAlphanumericOnly(event: KeyboardEvent): void {
    const regex = /^[a-zA-Z0-9]$/;
    if (!regex.test(event.key)) event.preventDefault();
  }

  onFiscalRegimeIdChange(event: MatSelectChange) {
    const personType = this.onboardingService.getCurrentInfo().personType;
    const fiscalId = event.value;
    if (!fiscalId) return;

    const cfdiCtrl = this.form.get('cfdiUse')!;

    cfdiCtrl.setValue('');
    cfdiCtrl.disable();

    this.cfdi.set([]);

    if (fiscalId) {
      this.catalogService
        .getCfdi({ personType: personType, fiscalRegimeId: fiscalId })
        .subscribe((resp) => {
          cfdiCtrl.enable();
          cfdiCtrl.addValidators(Validators.required);
          cfdiCtrl.updateValueAndValidity();

          this.cfdi.set(resp);
        });
    }
  }

  validForm(): boolean {
    const fiscalData = this.dataFiscalResidencesData().data.filter((d) => d.active !== false);
    if (fiscalData.length === 0) {
      this.notificationService.error('Debe agregar al menos un registro de Residencia Fiscal.');
      return false;
    }
    if (!fiscalData.some((r) => r.declarationFiscalResidence === true)) {
      this.notificationService.error(ERROR_MESSAGES.AT_LEAST_ONE_FISCAL_ADDRESS);
      return false;
    }

    const invalidFields = markInvalidControls(this.form);
    if (Object.keys(invalidFields).length > 0) {
      validCombobox(['country', 'nationality', 'fiscalRegimeId', 'cfdiUse'], this.form);

      const labels: { [key: string]: string } = {
        curp: 'CURP',
        rfc: 'RFC',
        country: 'País de Nacimiento',
        nationality: 'Nacionalidad',
        mexicoResident: '¿El cliente reside en México? ',
        fiscalResidenceAbroad: '¿Residencial Fiscal en el Extranjero?',
        name: 'Nombre ante el SAT',
        fiscalRegimeId: 'Régimen Fiscal',
        cfdiUse: 'Uso de CFDI',
        taxPostalCode: 'Código Postal Fiscal',
        fiscalResidences: 'Agrega una Residencia Fiscal',
        declarationFiscalResidence: 'Domicilio Fiscal Activo',
      };

      const missingFields: string[] = [];
      const invalidFormatFields: string[] = [];

      Object.entries(invalidFields).forEach(([key, value]) => {
        const control = this.form.get(key);
        const label = `${labels[key] || key} ${value || ''}`.trim();
        const val = control?.value;
        const isEmpty =
          val === null ||
          val === undefined ||
          val === '' ||
          (typeof val === 'string' && val.trim() === '');

        if (isEmpty) {
          missingFields.push(label);
        } else {
          invalidFormatFields.push(label);
        }
      });

      if (invalidFormatFields.length > 0) {
        this.notificationService.error('Tienes Campos Capturados con Formato Incorrecto.');
      }
      if (missingFields.length > 0) {
        this.notificationService.error(
          `Faltan campos obligatorios por capturar: ${missingFields.join(', ')}`,
        );
      }
      return false;
    }
    return true;
  }

  rowRadioSelected(event: any) {
    const selected = event?.row;
    if (!selected) return;

    const selectedTempId = selected.tempId;
    if (!selectedTempId) return;

    const current = this.dataFiscalResidencesData();

    const nextData = current.data.map((item) => ({
      ...item,
      declarationFiscalResidence: item.tempId === selectedTempId,
    }));

    const nextTable = current.table.map((row) => ({
      ...row,
      declarationFiscalResidence: row.tempId === selectedTempId,
    }));

    this.dataFiscalResidencesData.set({
      data: nextData,
      table: nextTable,
    });

    this.tableData.set(nextTable);
    if (!this.userOverrides.has('declarationFiscalResidence')) {
      this.form.patchValue({ declarationFiscalResidence: true });
    }
  }

  client = (): FiscalSelfDeclaration => this.form.getRawValue() as FiscalSelfDeclaration;

  /* build Modal rules */
  private buildModalContext(): {
    countryId: string;
    nationality: string;
    taxCountry: string;
  } {
    const raw = this.form.getRawValue();
    const countryId = raw.country || this.dataAutoCertification?.country || 'MX';
    const nationality = raw.nationality || this.dataAutoCertification?.nationality || 'MX';
    const taxCountry = 'MX';

    return { countryId, nationality, taxCountry };
  }

  private applyPolicy(): void {
    const raw = this.form.getRawValue();
    const rows = this.dataFiscalResidencesData().data.filter((d) => d.active !== false);
    const res = computePolicy(
      raw.country || this.dataAutoCertification?.country,
      raw.nationality || this.dataAutoCertification?.nationality,
      rows,
    );

    const patch: any = {};

    if (!this.userOverrides.has('fatca')) {
      patch.fatca = !!res.global.fatca;
    }

    if (!this.userOverrides.has('crs')) {
      patch.crs = !!res.global.crs;
    }

    if (Object.keys(patch).length > 0) {
      this.form.patchValue(patch, { emitEvent: false });
    }

    const current = this.dataFiscalResidencesData();
    const newData = current.data.map((r) => {
      if (!r) return r;
      const tempId = r.tempId ?? '';
      const p = tempId ? res.byRow?.[tempId] : undefined;
      return p ? { ...r, policy: p } : r;
    });

    this.dataFiscalResidencesData.set({ ...current, data: newData });
  }

  async onSubmit(): Promise<any> {
    if (!this.canEdit && this.isMaintenance) {
      this.notificationService.error('No tiene permisos para guardar.');
      return;
    }

    document.body.classList.add('show-validation');
    const isValid = this.validForm();
    if (!isValid) return;

    const rows = this.dataFiscalResidencesData().data.filter((d) => d.active !== false);
    const raw = this.form.getRawValue();
    const res = computePolicy(
      raw.country || this.dataAutoCertification?.country,
      raw.nationality || this.dataAutoCertification?.nationality,
      rows,
    );

    if (res.global.requireRFC && !raw.rfc) {
      this.notificationService.error('Debe capturar RFC por tener Residencia Fiscal en México.');
      return;
    }

    if (res.global.requireNIF) {
      const hasNif = rows.some((r) => r?.factaObligations?.nif?.toString().trim());
      if (!hasNif) {
        this.notificationService.error(
          'Debe capturar NIF por tener Residencia Fiscal distinta a México/EEUU.',
        );
        return;
      }
    }

    for (const r of rows) {
      const p = r.policy as any;
      if (!p) continue;
      const tin = r?.factaObligations?.tin?.toString().trim();
      const ssn = r?.factaObligations?.nss?.toString().trim();
      if (p.requireTinOrSsn && !(tin || ssn)) {
        this.notificationService.error(
          `Debe capturar TIN o SSN para la residencia fiscal en ${r.country}.`,
        );
        return;
      }
    }

    const allResidences = this.dataFiscalResidencesData().data ?? [];

    let filtered: any[];

    if (!this.isMaintenance) {
      filtered = allResidences.filter((r) => r.active !== false);
    } else {
      filtered = allResidences.filter(
        (r) => !(r?.active === false && r?.factaObligations?.factaId == null),
      );
    }

    let cleanResidences: any[];

    if (!this.isMaintenance) {
      cleanResidences = filtered.map((r) => {
        const { active, personId, tempId, policy, ...rest } = r;
        if (rest?.factaObligations) {
          const fo = { ...rest.factaObligations };
          delete fo.factsId;
          delete (fo as any).factaId;
          rest.factaObligations = fo;
        }
        return rest;
      });
    } else {
      cleanResidences = stripTempIdDeep(filtered.map((r) => omit(r, ['tempId', 'policy'])));
    }

    const formData: FiscalSelfDeclaration = {
      ...raw,
      id: this.dataAutoCertification?.id ?? 0,
      fiscalResidences: cleanResidences,
      facta: this.userOverrides.has('fatca') ? raw.fatca : res.global.fatca,
      crs: this.userOverrides.has('crs') ? raw.crs : res.global.crs,
    };
    return formData;
  }

  private lockComputedFlags(): void {
    const allowed = new Set(this.permissions?.fieldsEnabled ?? []);

    const isFull = this.permissions?.fieldsEnabled?.includes('*');
    const isEditing = this.disButtons.edit;

    if (!isFull) {
      if (!this.isMaintenance) {
        this.form.get('curp')?.disable({ emitEvent: false });
      } else if (!allowed.has('curp')) {
        this.form.get('curp')?.disable({ emitEvent: false });
      }
    } else {
      if (this.isMaintenance && isEditing) {
        this.form.get('curp')?.enable({ emitEvent: false });
      } else {
        this.form.get('curp')?.disable({ emitEvent: false });
      }
    }
    if (!allowed.has('nationality')) {
      this.form.get('nationality')?.disable({ emitEvent: false });
    }

    if (!allowed.has('country')) {
      this.form.get('country')?.disable({ emitEvent: false });
    }

    if (!allowed.has('fatca')) {
      this.form.get('fatca')?.disable({ emitEvent: false });
    }

    if (!allowed.has('crs')) {
      this.form.get('crs')?.disable({ emitEvent: false });
    }

    if (this.isCustomer) {
      this.form.get('mexicoResident')?.disable({ emitEvent: false });
      this.form.get('fiscalResidenceAbroad')?.disable({ emitEvent: false });
      this.form.get('name')?.disable({ emitEvent: false });
      this.form.get('fiscalRegimeId')?.disable({ emitEvent: false });
    }
  }

  /** -------- MAINTENANCE -------- */
  initializeMaintenance(): any {
    this.form.disable();
    this.isReadOnly = true;
    this.tableConfig.showDeleteAction = false;
    this.disButtons = { save: true, register: true, edit: false, cancel: true };
  }

  editMaintenance(): void {
    const isFull = this.permissions?.fieldsEnabled?.includes('*');

    if (isFull) {
      this.form.enable({ emitEvent: false });

      (this.permissions?.fieldsDisabled ?? []).forEach((field: any) => {
        this.form.get(field)?.disable({ emitEvent: false });
      });

      this.canEdit = true;
      this.canAdd = true;
      this.canDelete = true;
      this.tableConfig.showDeleteAction = true;

      this.disButtons = {
        edit: true,
        save: false,
        cancel: false,
        register: true,
      };

      this.isReadOnly = false;
      this.handleRfcDynamicFields(this.form.get('rfc')?.value);
      return;
    }

    const perms = this.permissions;
    if (!perms || perms.allDisabled) return;

    this.canEdit = perms.permission?.includes('edit') ?? false;
    this.canAdd = perms.permission?.includes('add') ?? false;
    this.canDelete = perms.permission?.includes('delete') ?? false;
    this.tableConfig.showDeleteAction = this.canDelete;

    this.form.enable({ emitEvent: false });

    formFunctionDis(this.form);
    formFunctionEn(this.form, perms.fieldsEnabled);

    this.lockComputedFlags();
    this.isForeigner();
    formFunctionEn(this.form, perms.fieldsEnabled);
    this.handleRfcDynamicFields(this.form.get('rfc')?.value);

    this.disButtons = {
      edit: true,
      save: false,
      cancel: false,
      register: true,
    };

    this.isReadOnly = false;
  }

  cancelMaintenance(): void {
    if (this.dataAutoCertification) {
      this.form.reset({}, { emitEvent: false });
      this.form.patchValue(
        {
          ...this.dataAutoCertification,
          mexicoResident: this.dataAutoCertification.mexicoResident ? 'true' : 'false',
          fiscalResidenceAbroad: this.dataAutoCertification.fiscalResidenceAbroad
            ? 'true'
            : 'false',
        },
        { emitEvent: false },
      );

      this.existFiscalResidences();
      this.tableData.set(this.dataFiscalResidencesData().table);
    }

    this.applyPolicy();
    this.lockComputedFlags();

    this.form.disable({ emitEvent: false });

    this.disButtons = {
      edit: false,
      save: true,
      cancel: true,
      register: true,
    };

    this.isReadOnly = true;
  }

  private applyRolePermissions(): void {
    const roleActions: string[] = this.permissions?.permission ?? [];

    this.canRead = roleActions.includes('read');
    this.canEdit = roleActions.includes('edit');
    this.canAdd = roleActions.includes('add');
    this.canDelete = roleActions.includes('delete');

    this.tableConfig.showDeleteAction = this.canDelete;

    if (!this.canRead) {
      this.form.disable({ emitEvent: false });
      this.disButtons = {
        edit: true,
        register: true,
        save: true,
        cancel: true,
      };
      this.isReadOnly = true;
      return;
    }

    if (this.canRead && !this.canEdit) {
      this.form.disable({ emitEvent: false });
      this.disButtons = {
        edit: true,
        register: true,
        save: true,
        cancel: false,
      };
      this.isReadOnly = true;
      return;
    }

    this.form.disable({ emitEvent: false });

    this.disButtons = {
      edit: false,
      register: true,
      save: true,
      cancel: true,
    };
    this.isReadOnly = false;
  }

  private resolvePermissions() {
    const base = this.externalPermissions ?? this.permissionService.getPermissions()?.['tax-info'];
    const role = this.authService.getUserInfo()().rol;

    const rolesFullWithRestriction = ['ROL_CAT_VIDEOLLAMADAS', 'ROL_ASESOR_FIN'];
    const rolesFullNoRestriction = ['ROL_ANALISTA_DE_CONTRATOS', 'SPINE_GESTOR_SUP'];

    let result = { ...base };

    if (rolesFullWithRestriction.includes(role)) {
      result = {
        ...result,
        allDisabled: false,
        permission: ['read', 'edit', 'add', 'delete'],
        fieldsEnabled: ['*'],
        fieldsDisabled: ['foreignerWithoutCurp'],
      };
    }

    if (rolesFullNoRestriction.includes(role)) {
      result = {
        ...result,
        allDisabled: false,
        permission: ['read', 'edit', 'add', 'delete'],
        fieldsEnabled: ['*'],
        fieldsDisabled: [],
      };
    }

    if (this.externalPermissions) {
      result = {
        ...result,
        allDisabled: this.externalPermissions.allDisabled ?? result.allDisabled,

        fieldsEnabled: result.fieldsEnabled?.includes('*')
          ? ['*']
          : [
              ...new Set([
                ...(result.fieldsEnabled ?? []),
                ...(this.externalPermissions.fieldsEnabled ?? []),
              ]),
            ],

        fieldsDisabled: [
          ...new Set([
            ...(result.fieldsDisabled ?? []),
            ...(this.externalPermissions.fieldsDisabled ?? []),
          ]),
        ],

        permission: [
          ...new Set([
            ...(result.permission ?? []),
            ...(this.externalPermissions.permission ?? []),
          ]),
        ],
      };
    }

    return result;
  }

  /** -------- END MAINTENANCE -------- */
}
