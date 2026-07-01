import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

import { CustomerREGEX, CustomerSTRINGS } from '../../../constants/customer-constants';
import {
  ERROR_MESSAGES,
  NOTIFICATION_MESSAGES,
  SUCCESS_MESSAGES,
} from '../../../constants/customer-form-messages';

import { CustomerNationalities } from '../../../models/customer-nationality';
import { CustomerCountries } from '../../../models/customer-country';
import { CustomerCFDI } from '../../../models/customer-cfdi';
import { CustomerFiscalRegimes } from '../../../models/customer-fiscal-regime';
import {
  CustomerClientTaxData,
  CustomerFiscalSelfDeclarationPageData,
  CustomerFiscalSelfDeclarationTableData,
  CustomerMinFiscalData,
} from '../../../models/customer-fiscal-self-declaration-data';
import { CustomerFiscalSelfDeclaration } from '../../../models/checkpoints/customer-fiscal-self-declaration-checkpoint';
import { CustomerRelationships } from '../../../models/customer-relationships';
import { CustomerCurrentOnboardingInfo } from '../../../models/customer-current-onboarding';
import { ConfigDataTable } from '../../../models/customer-table-interfaces';

import { CustomerCatalogsService } from '../../../services/customer-catalogs.service';
import { CustomerNotificationsService } from '../../../services/customer-notifications.service';
import { CustomerModalFormService } from '../../../services/customer-modal-form.service';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { CustomerOnboardingService } from '../../../services/customer-onboarding.service';
import { PermissionRolService } from '../../../../core/services/rol.service';
import { CustomerNotificationModalService } from '../../../services/customer-notification-modal.service';
import { ModalFiscalResidenceComponent } from '../../modals/modal-fiscal-residence/customer-modal-fiscal-residence.component';

import {
  validCombobox,
  markInvalidControls,
} from '../../../utils/customer-form';

// (Rules 001–009)
import { computePolicy } from '../../../utils/customer-policy';
import { omit, stripTempIdDeep } from '../../../utils/customer-auto-utils';
@Component({
  selector: 'app-customer-auto-certification-section',
  standalone: false,
  templateUrl: './customer-auto-certification-section.component.html',
  styleUrl: './customer-auto-certification-section.component.scss',
})
export class CustomerAutoCertificationSectionComponent {
  @Input() dataAutoCertification?: CustomerClientTaxData | null = null;
  @Input() hideRoleSection?: boolean = false;
  @Input() hideProofOfAddressSection?: boolean = false;
  @Input() addressClient?: boolean = false;
  @Input() isCotitular?: boolean = false;
  @Input() onboardingInfo?: CustomerCurrentOnboardingInfo;
  @Input() showButtonsUI?: boolean = false;

  @Output() formGroupEmitter = new EventEmitter<FormGroup>();

  // Inject
  private readonly fb = inject(FormBuilder);
  private readonly catalogService = inject(CustomerCatalogsService);
  private readonly notificationService = inject(CustomerNotificationsService);
  private readonly notificationModalService = inject(CustomerNotificationModalService);
  private readonly modalService = inject(CustomerModalFormService);
  private readonly onboardingService = inject(CustomerOnboardingService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly permissionService = inject(PermissionRolService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  // Form
  form: FormGroup = this.fb.group({
    mexicoResident: [undefined, [Validators.required]],
    curp: [
      { value: '', disabled: true },
      [
        Validators.required,
        Validators.pattern(CustomerREGEX.CURP_VALIDATION),
        Validators.maxLength(18),
      ],
    ],
    foreignerWithoutCurp: [{ value: false, disabled: false }],
    rfc: [
      { value: '', disabled: false },
      [
        Validators.required,
        Validators.pattern(CustomerREGEX.RFC_VALIDATION),
        Validators.maxLength(13),
      ],
    ],
    name: [
      { value: '', disabled: false },
      [Validators.required, Validators.maxLength(100)],
    ],
    fiscalRegimeId: ['', [Validators.required, Validators.maxLength(100)]],
    cfdiUse: ['', [Validators.required, Validators.maxLength(100)]],
    taxPostalCode: [
      { value: '' },
      [
        Validators.required,
        Validators.maxLength(5),
        Validators.pattern(CustomerREGEX.ONLY_NUMBERS),
      ],
    ],
    nationality: [
      { value: '', disabled: true },
      [Validators.required, Validators.pattern(CustomerREGEX.STATE_VALIDATION)],
    ],
    fiscalResidences: ['', [Validators.required]],
    declarationFiscalResidence: ['', [Validators.required]],
    country: [
      { value: '', disabled: true },
      [Validators.required, Validators.maxLength(30)],
    ],
    fiscalResidenceAbroad: [undefined, [Validators.required]],
    fatca: [false, [Validators.required]],
    crs: [false, [Validators.required]],
  });

  // Signals
  errors = signal<string[]>([]);
  nationalities = signal<CustomerNationalities[]>([]);
  countries = signal<Array<CustomerCountries>>([]);
  fiscalRegime = signal<CustomerFiscalRegimes[]>([]);
  cfdi = signal<CustomerCFDI[]>([]);
  foreignerCURP = signal(false);
  foreign = signal(false);
  crs = signal('');
  fatca = signal('');
  columnsFiscalResidences: Array<any> = [];
  relationships = signal<Array<CustomerRelationships>>([]);
  isCustomer: boolean = (this.onboardingService as any).getCurrentInfo().isCustomer
  dataFiscalResidencesData = signal<CustomerFiscalSelfDeclarationPageData>({
    data: [],
    table: [],
  });

  // variables
  tableData = signal<Array<CustomerFiscalSelfDeclarationTableData>>([]);
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

  /** Data for CustomerMaintenance */
  isMaintenance: boolean =
    (this.onboardingService as any).getCurrentInfo().isMaintenance;
  permissions = this.permissionService.getPermissions()?.['tax-info'];
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

    if (!this.isMaintenance) {
      this.permissions = ['edit', 'add', 'delete', 'read'];
      this.disButtons = {
        edit: false,
        register: false,
        save: false,
        cancel: false,
      };
      this.tableConfig.showDeleteAction = true;

      this.form.enable({ emitEvent: false });
      this.lockComputedFlags();
    }

    const personType = (this.onboardingService as any).getCurrentInfo().personType;

    this.catalogService
      .getCountry({ land: [] })
      .subscribe((c) => this.countries.set(c));
    this.catalogService
      .getNationalities({ land: [] })
      .subscribe((c) => this.nationalities.set(c));

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
        this.isForeigner();
      });

    this.form.patchValue({
      mexicoResident: this.dataAutoCertification?.mexicoResident
        ? 'true'
        : 'false',
      fiscalResidenceAbroad: this.dataAutoCertification?.fiscalResidenceAbroad
        ? 'true'
        : 'false',
      name: this.dataAutoCertification?.name,
      taxPostalCode: this.dataAutoCertification?.taxPostalCode,
      fatca: this.dataAutoCertification?.facta,
      crs: this.dataAutoCertification?.crs,
    });

    if (
      this.dataAutoCertification &&
      this.isNotEmpty(this.dataAutoCertification)
    ) {
      this.form.patchValue({
        curp: this.dataAutoCertification.curp?.toUpperCase(),
        nationality: this.dataAutoCertification.nationality?.toUpperCase(),
        country: this.dataAutoCertification.country?.toUpperCase(),
        fiscalRegimeId: this.dataAutoCertification?.fiscalRegimeId?.toString(),
        cfdiUse: this.dataAutoCertification?.cfdiUse,
      });
    }

    this.columnsFiscalResidences = [
      { name: 'registerNo', title: 'Registro No.', show: true, type: '' },
      {
        name: 'personType',
        title: 'Tipo de Persona',
        show: true,
        type: '',
      },
      {
        name: 'proofOfAddressType',
        title: 'Residencia Fiscal',
        show: true,
        type: '',
      },
      {
        name: 'autentication',
        title: 'Auto-Certificación',
        show: true,
        type: '',
      },
      {
        name: 'proofOfAddressFiscal',
        title: 'Comprobante de Residencia Fiscal',
        show: true,
        type: '',
      },
      { name: 'nif', title: 'NIF', type: 'number', show: true },
      { name: 'tin', title: 'TIN', type: '', show: true },
      { name: 'nss', title: 'NSS', type: '', show: true },
    ];

    if (
      this.dataAutoCertification?.fiscalResidences &&
      Array.isArray(this.dataAutoCertification.fiscalResidences)
    ) {
      this.dataAutoCertification.fiscalResidences =
        this.dataAutoCertification.fiscalResidences.map((r: any) => ({
          ...r,
          declarationFiscalResidence:
            r.declarationFiscalResidence === true ||
            r.declarationFiscalResidence === 'true',
        }));
    }

    this.existFiscalResidences();
    this.tableData.set(this.dataFiscalResidencesData().table);
    this.formGroupEmitter.emit(this.form);

    if (this.isMaintenance) {
      this.initializeMaintenance();
    }

    /* Apply policy */
    this.applyPolicy();
    this.lockComputedFlags();
  }

  /** RFC < 13 shortcuts XAXX/XEXX */
  private handleRfcDynamicFields(value: string) {
    const satName = this.form.get('name');
    const fiscalRegime = this.form.get('fiscalRegimeId');
    const useCFDI = this.form.get('cfdiUse');
    const taxPostalCode = this.form.get('taxPostalCode');

    const validRFC = value && value.length === 13;
    const controls = [useCFDI, satName, taxPostalCode, fiscalRegime];

    // --- RFC válido ---
    if (validRFC) {
      if (this.isCustomer) {
        taxPostalCode?.enable();
        taxPostalCode?.setValidators(Validators.required);
        useCFDI?.enable();
        useCFDI?.setValidators(Validators.required);
      } else {
        // Proveedor
        controls.forEach(c => {
          c?.enable();
          c?.setValidators(Validators.required);
          c?.markAsTouched();
          c?.markAsDirty();
        });
      }
    }

    // --- RFC inválido ---
    else {
      if (this.isCustomer) {
        useCFDI?.disable();
        useCFDI?.clearValidators();
        useCFDI?.setValue('');
      } else {
        controls.forEach(c => {
          c?.disable();
          c?.clearValidators();
          c?.setValue('');
        });
      }
    }
    if (!this.isCustomer) {
      useCFDI?.disable();
      useCFDI?.clearValidators();
    }

    [...controls, useCFDI].forEach(c =>
      c?.updateValueAndValidity({ emitEvent: false })
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
        personId: residence.personId,
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
          factaId: residence.factaObligations?.factaId ?? null,
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

    if (
      activeRows.length > 0 &&
      activeRows.some((r) => r.declarationFiscalResidence)
    ) {
      this.form.patchValue({ declarationFiscalResidence: true });
    }
  }

  /** EXTRANJERO SIN CURP: habilita/deshabilita curp/country/nationality */
  isForeigner() {
    const curpControl = this.form.get('curp');
    const countryControl = this.form.get('country');
    const nationalityControl = this.form.get('nationality');

    if (this.foreignerCURP()) {
      curpControl?.disable();
      curpControl?.clearValidators();
      curpControl?.updateValueAndValidity();
      countryControl?.enable();
      nationalityControl?.enable();
      this.form.patchValue({ curp: '', nationality: '', country: '' });
    } else {
      this.form.patchValue({
        curp: this.dataAutoCertification?.curp,
        rfc: this.dataAutoCertification?.rfc,
        nationality: this.dataAutoCertification?.nationality,
        country: this.dataAutoCertification?.country,
        name: this.dataAutoCertification?.name,
        taxPostalCode: this.dataAutoCertification?.taxPostalCode,
      });
      countryControl?.disable();
      nationalityControl?.disable();
    }
  }

  validRFCCURP(): boolean {
    const rfc = this.form.get('rfc')?.value?.toUpperCase();
    const curp = this.form.get('curp')?.value?.toUpperCase();
    if (!rfc || !curp) return false;

    if (!CustomerREGEX.RFC_VALIDATION.test(rfc)) {
      this.notificationService.error('Formato de RFC inválido');
      return false;
    }
    if (!CustomerREGEX.CURP_VALIDATION.test(curp)) {
      this.notificationService.error('Formato de CURP inválido');
      return false;
    }

    const fechaRFC = rfc.substring(4, 10);
    const fechaCURP = curp.substring(4, 10);
    const inicialesRFC = rfc.substring(0, 4);
    const inicialesCURP = curp.substring(0, 4);

    if (fechaRFC === fechaCURP && inicialesRFC === inicialesCURP) return true;

    this.notificationService.error('El RFC y la CURP no coinciden');
    return false;
  }

  ngAfterViewInit() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.unsavedChangesService.setUnsavedChanges(this.form.dirty);
      });
  }

  searchRelationshipNameById(id: string): string {
    const relationships = this.relationships();
    const relationship = relationships.find((rela) => rela.idParent === id);
    return relationship ? relationship.kinShip : '';
  }

  eventRow(event: { type: string; row: any }): void {
    if (CustomerSTRINGS.DELETE === event.type) {
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
            !updatedData.some(
              (r) =>
                r.active !== false && r.declarationFiscalResidence === true,
            )
          ) {
            this.form.patchValue(
              { declarationFiscalResidence: false },
              { emitEvent: false },
            );
          }

          this.applyPolicy();

          this.notificationService.success(SUCCESS_MESSAGES.ITEM_DELETED);
        });
      return;
    } else if (CustomerSTRINGS.EDIT === event.type) {
      const row = event.row;
      if (!row) return;

      const current = this.dataFiscalResidencesData();
      const idx = current.data.findIndex((d) => this.sameIdentity(d, row));
      if (idx < 0) return;

      const dataEdit = current.data[idx];
      const dataTableEdit = current.table.find((t) =>
        this.sameIdentity(t, row),
      );
      const dataModal = { edit: true, data: dataEdit, table: dataTableEdit };

      this.editItem(dataModal);
    }
  }

  addFiscalResidences() {
    if (!this.canAdd && !this.canEdit && this.isMaintenance) {
      return;
    }

    const ctx = this.buildModalContext();

    let minFiscalData: CustomerMinFiscalData | null = null;
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
        this.isCotitular
      )
      .subscribe((result) => {
        if (result !== null && Array.isArray(result.fiscalResidences)) {
          const actual = this.dataFiscalResidencesData();
          const activeResidence =
            result.fiscalResidences.find(
              (res) => res.declarationFiscalResidence,
            ) ?? result.fiscalResidences[0];

          const newTempId = crypto.randomUUID();

          const newDataItem = {
            tempId: newTempId,
            personId: activeResidence.personId,
            active: activeResidence.active ?? true,
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
              factaId: activeResidence.factaObligations?.factaId ?? null,
              autentication:
                activeResidence.factaObligations?.autentication ?? '',
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

            this.form.patchValue(
              { declarationFiscalResidence: true },
              { emitEvent: false },
            );
          }

          this.applyPolicy();

          this.notificationService.success(SUCCESS_MESSAGES.SAVE_TAX_ADDRESS);
        }
      });
  }

  editItem(modalData: any): void {
    let data = modalData;

    let minFiscalData: CustomerMinFiscalData | null = null;
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
        personId:
          editedResidence.personId ?? updatedData[idx]?.personId ?? null,
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
    const personType = (this.onboardingService as any).getCurrentInfo().personType;
    const fiscalId = event.value;
    if (!fiscalId) return;

    const cfdiCtrl = this.form.get('cfdiUse')!;

    cfdiCtrl.setValue('');
    cfdiCtrl.disable();

    this.cfdi.set([]);

    if (fiscalId) {
      this.catalogService
        .getCfdi({ personType: personType, fiscalRegimeId: fiscalId })
        .subscribe((resp: any) => {
          cfdiCtrl.enable();
          cfdiCtrl.addValidators(Validators.required);
          cfdiCtrl.updateValueAndValidity();

          this.cfdi.set(resp);
        });
    }
  }

  validForm(): boolean {
    const fiscalData = this.dataFiscalResidencesData().data.filter(
      (d) => d.active !== false,
    );
    if (fiscalData.length === 0) {
      this.notificationService.error(
        'Debe agregar al menos un registro de Residencia Fiscal.',
      );
      return false;
    }
    if (!fiscalData.some((r) => r.declarationFiscalResidence === true)) {
      this.notificationService.error(
        ERROR_MESSAGES.AT_LEAST_ONE_FISCAL_ADDRESS,
      );
      return false;
    }

    const invalidFields = markInvalidControls(this.form);
    if (Object.keys(invalidFields).length > 0) {
      validCombobox(
        ['country', 'nationality', 'fiscalRegimeId', 'cfdiUse'],
        this.form,
      );

      const labels: { [key: string]: string } = {
        curp: 'CURP',
        rfc: 'RFC',
        country: 'País de Nacimiento',
        nationality: 'Nacionalidad',
        mexicoResident: '¿El cliente reside en México? ',
        fiscalResidenceAbroad: '¿Residencial Fiscal en el Extranjero?',
        name: 'Nombre ante el SAT',
        fiscalRegimeId: 'Régimen Fiscal',
        cfdiUse: 'Uso de CustomerCFDI',
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
        const isEmpty = val === null || val === undefined || val === '' || (typeof val === 'string' && val.trim() === '');
        
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
    this.form.patchValue(
      { declarationFiscalResidence: true },
      { emitEvent: false },
    );
  }

  client = (): CustomerFiscalSelfDeclaration =>
    this.form.getRawValue() as CustomerFiscalSelfDeclaration;

  /* build Modal rules */
  private buildModalContext(): {
    countryId: string;
    nationality: string;
    taxCountry: string;
  } {
    const raw = this.form.getRawValue();
    const countryId =
      raw.country || this.dataAutoCertification?.country || 'MX';
    const nationality =
      raw.nationality || this.dataAutoCertification?.nationality || 'MX';
    const taxCountry = 'MX';

    return { countryId, nationality, taxCountry };
  }

  private applyPolicy(): void {
    const raw = this.form.getRawValue();
    const rows = this.dataFiscalResidencesData().data.filter(
      (d) => d.active !== false,
    );
    const res = computePolicy(
      raw.country || this.dataAutoCertification?.country,
      raw.nationality || this.dataAutoCertification?.nationality,
      rows,
    );

    this.form.patchValue(
      { fatca: !!res.global.fatca, crs: !!res.global.crs },
      { emitEvent: false },
    );

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

    if (!this.validRFCCURP() && !this.foreignerCURP()) return;

    const rows = this.dataFiscalResidencesData().data.filter(
      (d) => d.active !== false,
    );
    const raw = this.form.getRawValue();
    const res = computePolicy(
      raw.country || this.dataAutoCertification?.country,
      raw.nationality || this.dataAutoCertification?.nationality,
      rows,
    );

    if (res.global.requireRFC && !raw.rfc) {
      this.notificationService.error(
        'Debe capturar RFC por tener Residencia Fiscal en México.',
      );
      return;
    }

    if (res.global.requireNIF) {
      const hasNif = rows.some((r) =>
        r?.factaObligations?.nif?.toString().trim(),
      );
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
          `Debe capturar TIN o SSN para la Residencia Fiscal en ${r.country}.`,
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
      cleanResidences = stripTempIdDeep(
        filtered.map((r) => omit(r, ['tempId', 'customer-policy'])),
      );
    }

    const formData: CustomerFiscalSelfDeclaration = {
      ...this.form.getRawValue(),
      id: this.dataAutoCertification?.id ?? 0,
      fiscalResidences: cleanResidences,
      facta: res.global.fatca,
      crs: res.global.crs,
    };
    return formData;
  }

  private lockComputedFlags(): void {
    this.form.get('fatca')?.disable({ emitEvent: false });
    this.form.get('crs')?.disable({ emitEvent: false });
    this.form.get('nationality')?.disable({ emitEvent: false });
    this.form.get('country')?.disable({ emitEvent: false });
    this.form.get('curp')?.disable({ emitEvent: false });
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

  validateRolOnEdit(): any {
    if (this.canEdit) {
      this.form.enable();
      this.lockComputedFlags();
    } else {
      this.form.disable();
    }

    this.disButtons.register = !this.canEdit;
  }

  editMaintenance(): any {
    if (this.permissions.allDisabled && !this.canEdit) return;
    this.isReadOnly = false;
    this.form.enable();
    this.disButtons = {
      register: false,
      cancel: false,
      save: false,
      edit: true,
    };

    this.tableConfig.showDeleteAction = this.canDelete;

    this.validateRolOnEdit();
  }

  cancelMaintenance(): any {
    this.initializeMaintenance();
  }

  private applyRolePermissions(): void {
    const rolePerms = this.permissions?.permission || [];

    this.canRead = rolePerms.includes('read');
    this.canEdit = rolePerms.includes('edit');
    this.canAdd = rolePerms.includes('add');
    this.canDelete = rolePerms.includes('delete');

    if (!this.canRead) {
      this.form.disable({ emitEvent: false });
      this.disButtons = {
        edit: true,
        register: true,
        save: true,
        cancel: true,
      };
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
    }
  }
  /** -------- END MAINTENANCE -------- */
}

























