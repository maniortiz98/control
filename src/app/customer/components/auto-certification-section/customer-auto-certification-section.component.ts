import {
  Component,
  DestroyRef,
  effect,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerREGEX, CustomerSTRINGS } from '../../constants/customer-constants';
import { CustomerNationalities } from '../../models/customer-nationality';
import { CustomerCountries } from '../../models/customer-country';
import { CustomerCatalogsService } from '../../services/customer-catalogs.service';
import { CustomerNotificationsService } from '../../services/customer-notifications.service';
import { CustomerModalFormService } from '../../services/customer-modal-form.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { MatDialog } from '@angular/material/dialog';
import { CustomerCFDI } from '../../models/customer-cfdi';
import { CustomerFiscalRegimes } from '../../models/customer-fiscal-regime';
import { CustomerFiscalSelfDeclaration } from '../../models/checkpoints/customer-fiscal-self-declaration-checkpoint';
import {
  CustomerClientTaxData,
  CustomerFiscalSelfDeclarationPageData,
  CustomerFiscalSelfDeclarationTableData,
  CustomerMinFiscalData,
} from '../../models/customer-fiscal-self-declaration-data';
import {
  ERROR_MESSAGES,
  NOTIFICATION_MESSAGES,
  SUCCESS_MESSAGES,
} from '../../constants/customer-form-messages';
import { validCombobox, markInvalidControls } from '../../utils/customer-form';
import { CustomerFiscalSelfDeclarationDataClientService } from '../../services/storage-services/customer-fiscal-self-declaration.service';
import { CustomerRelationships } from '../../models/customer-relationships';
import { CustomerNotificationModalService } from '../../services/customer-notification-modal.service';
import { ModalFiscalResidenceComponent } from '../../../shared/components/modals/modal-fiscal-residence/modal-fiscal-residence.component';
import { CustomerOnboardingService } from '../../services/customer-onboarding.service';
import { ConfigDataTable } from '../../../shared/components/table-results/interfaces';

@Component({
  selector: 'app-customer-auto-certification-section-customer',
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

  //Output
  @Output() formGroupEmitter = new EventEmitter<FormGroup>();

  //Inject
  private readonly fb = inject(FormBuilder);
  private readonly catalogService = inject(CustomerCatalogsService);
  private readonly notificationService = inject(CustomerNotificationsService);
  private readonly notificationModalService = inject(CustomerNotificationModalService);
  private readonly modalService = inject(CustomerModalFormService);
  private readonly onboardingService = inject(CustomerOnboardingService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly fiscalSelfService = inject(
    CustomerFiscalSelfDeclarationDataClientService,
  );
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  // Form
  form: FormGroup = this.fb.group({
    mexicoResident: ['true', [Validators.required]],
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
    fiscalRegimeId: [''],
    cfdiUse: [''],
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
    fiscalResidences: [''],
    declarationFiscalResidence: ['', [Validators.required]],
    country: [
      { value: '', disabled: true },
      [Validators.required, Validators.maxLength(30)],
    ],
    fiscalResidenceAbroad: [undefined, [Validators.required]],
    fatca: [
      { value: false, disabled: true },
      [Validators.required, Validators.maxLength(4)],
    ],
    crs: [
      { value: false, disabled: true },
      [Validators.required, Validators.maxLength(4)],
    ],
    nss: [{ value: '' }],
    tin: [{ value: '' }],
  });

  //Signals
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
  dataFiscalResidencesData = signal<CustomerFiscalSelfDeclarationPageData>({
    data: [],
    table: [],
  });
  // variables
  tableData = signal<Array<CustomerFiscalSelfDeclarationTableData>>([]);
  isEditting = false;
  edittingId = 0;
  checkCurpValidation = true;
  tableConfig: ConfigDataTable = {
    showPag: false,
    showViewAction: false,
    showEditAction: true,
    showDeleteAction: true,
    multipleSelection: false,
    idName: 'tempId',
    singleSelection: {
      show: true,
      title: 'Domicilio Fiscal Activo',
      propertyName: 'declarationFiscalResidence',
    },
  };

  //Constructor
  constructor() {
    document.body.classList.remove('show-validation');
    effect(() => {});
  }

  isNotEmpty(obj: any) {
    return Object.keys(obj).length > 0;
  }

  //ngOnInit Initializes the catalogs and assigns data if it has any.
  ngOnInit() {
    const personType = (this.onboardingService as any).getCurrentInfo().personType;

    this.catalogService.getCountry({ land: [] }).subscribe((c) => {
      this.countries.set(c);
    });

    this.catalogService.getNationalities({ land: [] }).subscribe((c) => {
      this.nationalities.set(c);
    });

    this.catalogService
      .getFiscalRegime({ personType: personType })
      .subscribe((c: any) => {
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
      .subscribe((value: any) => {
        const satNameControl = this.form.get('name');
        const taxPostalCode = this.form.get('taxPostalCode');

        if (value?.length < 13) {
          satNameControl?.disable();
          taxPostalCode?.disable();
          satNameControl?.clearValidators();
          taxPostalCode?.clearValidators();
          satNameControl?.updateValueAndValidity();
          taxPostalCode?.updateValueAndValidity();
        } else {
          satNameControl?.enable();
          taxPostalCode?.enable();
          satNameControl?.addValidators(Validators.required);
          taxPostalCode?.addValidators(Validators.required);
          satNameControl?.updateValueAndValidity();
          taxPostalCode?.updateValueAndValidity();
        }
        if (value === 'XAXX010101000' || value === 'XEXX010101000') {
          this.form.patchValue({
            name: 'PÚBLICO EN GENERAL',
          });
          this.form.patchValue({
            fiscalRegimeId: {
              cfdiUsageId: 'SIN OBLIGACIONES FISCALES',
              value: 'SIN OBLIGACIONES FISCALES',
            },
          });
          this.form.patchValue({
            cfdiUse: {
              cfdiUsageId: 'SIN OBLIGACIONES FISCALES',
              value: 'SIN OBLIGACIONES FISCALES',
            },
          });
          this.form.patchValue({
            taxPostalCode: '11000',
          });
          if (value === 'XEXX010101000') {
            this.form.patchValue({
              name: '',
            });
          }
        }
      });
    this.form.patchValue({
      rfc: this.dataAutoCertification?.rfc,
    });
    this.form.get('rfc')?.updateValueAndValidity();
    this.form
      .get('foreignerWithoutCurp')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: any) => {
        this.foreignerCURP.set(value);
        this.isForeigner();
      });

    this.form.patchValue({
      mexicoResident: 'true',
    });

    this.form.patchValue({
      fiscalResidenceAbroad: this.dataAutoCertification?.fiscalResidenceAbroad
        ? 'true'
        : 'false',
    });

    this.form.patchValue({
      name: this.dataAutoCertification?.name,
    });

    this.form.patchValue({
      taxPostalCode: this.dataAutoCertification?.taxPostalCode,
    });

    this.form.patchValue({
      fatca: this.dataAutoCertification?.facta,
    });

    this.form.patchValue({
      crs: this.dataAutoCertification?.crs,
    });

    if (
      this.dataAutoCertification &&
      this.isNotEmpty(this.dataAutoCertification)
    ) {
      this.form.patchValue({
        curp: this.dataAutoCertification.curp?.toUpperCase(),
      });
      this.form.patchValue({
        nationality: this.dataAutoCertification.nationality?.toUpperCase(),
      });
      this.form.patchValue({
        country: this.dataAutoCertification.country?.toUpperCase(),
      });

      this.form.patchValue({
        cfdiUse: this.dataAutoCertification?.cfdiUse,
      });
    } else {
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
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataAutoCertification']?.currentValue) {
      this.loadFromInput(changes['dataAutoCertification'].currentValue);
    }
  }

  private loadFromInput(data: CustomerClientTaxData): void {
    if (!data) return;
    this.form.patchValue(
      {
        ...data,
        mexicoResident: data.mexicoResident ? 'true' : 'false',
        fiscalResidenceAbroad: data.fiscalResidenceAbroad ? 'true' : 'false',
      },
      { emitEvent: false }
    );

    const mapped = (data.fiscalResidences || []).map((r: any) => ({
      tempId: crypto.randomUUID(),
      personId: r.personId,
      active: r.active ?? true,
      personType: r.personType,
      country: r.country,
      declarationFiscalResidence:
        r.declarationFiscalResidence === true ||
        r.declarationFiscalResidence === 'true',
      proofOfAddressType: r.proofOfAddressType,
      issueDate: r.issueDate,
      expirationStatus: r.expirationStatus,
      expirationDate: r.expirationDate,
      certificationDate: r.certificationDate,
      declarationYear: r.declarationYear,
      aditionalDays: r.aditionalDays,
      factaObligations: {
        factaId: r.factaObligations?.factaId ?? null,
        autentication: r.factaObligations?.autentication ?? '',
        nif: r.factaObligations?.nif ?? '',
        tin: r.factaObligations?.tin ?? '',
        nss: r.factaObligations?.nss ?? '',
      },
    }));

    const table = this.rebuildTableFromData(mapped);

    this.dataFiscalResidencesData.set({
      data: mapped,
      table,
    });

    this.tableData.set(table);

    this.form.patchValue({
      fiscalResidences: mapped.length > 0,
      declarationFiscalResidence: mapped.some(
        (r) => r.declarationFiscalResidence === true
      ),
    });
  }

  isRequired(name: string): boolean {
    const control = this.form.get(name);
    if (!control || !control.validator) return false;

    const validator = control.validator({} as any);
    return validator && validator['required'];
  }

  validarCoincidencia() {
    const rfc = this.form.get('rfc')?.value?.toUpperCase();
    const curp = this.form.get('curp')?.value?.toUpperCase();

    if (!rfc || !curp) {
      return;
    }

    if (!CustomerREGEX.RFC_VALIDATION.test(rfc)) {
      this.notificationService.error('Formato de RFC inválido');
      return;
    }

    if (!CustomerREGEX.CURP_VALIDATION.test(curp)) {
      this.notificationService.error('Formato de CURP inválido');

      return;
    }

    const fechaRFC = rfc.substring(4, 10);
    const fechaCURP = curp.substring(4, 10);
    const inicialesRFC = rfc.substring(0, 4);
    const inicialesCURP = curp.substring(0, 4);

    if (fechaRFC === fechaCURP && inicialesRFC === inicialesCURP) {
    } else {
      this.notificationService.error(
        'El RFC y la CURP no coinciden en fecha e iniciales',
      );
    }
  }

  existFiscalResidences() {
    if (!this.dataAutoCertification) return;

    const data = (this.dataAutoCertification.fiscalResidences || []).map((r) => ({
      tempId: crypto.randomUUID(),
      personId: r.personId,
      active: r.active ?? true,
      personType: r.personType,
      country: r.country,
      declarationFiscalResidence: r.declarationFiscalResidence,
      proofOfAddressType: r.proofOfAddressType,
      issueDate: r.issueDate,
      expirationStatus: r.expirationStatus,
      expirationDate: r.expirationDate,
      certificationDate: r.certificationDate,
      declarationYear: r.declarationYear,
      aditionalDays: r.aditionalDays,
      factaObligations: {
        factaId: r.factaObligations?.factaId ?? null,
        autentication: r.factaObligations?.autentication ?? '',
        nif: r.factaObligations?.nif ?? '',
        tin: r.factaObligations?.tin ?? '',
        nss: r.factaObligations?.nss ?? '',
      },
    }));

    const table = this.rebuildTableFromData(data);

    this.dataFiscalResidencesData.set({ data, table });
    this.tableData.set(table);

    this.form.patchValue({
      fiscalResidences: data.length > 0,
      declarationFiscalResidence: data.some((d) => d.declarationFiscalResidence),
    });
  }

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
      this.form.patchValue({ curp: '' });
      this.form.patchValue({ nationality: '' });
      this.form.patchValue({ country: '' });
    } else {
      this.form.patchValue({
        curp: this.dataAutoCertification?.curp,
      });
      this.form.patchValue({ rfc: this.dataAutoCertification?.rfc });
      this.form.patchValue({
        nationality: this.dataAutoCertification?.nationality,
      });
      this.form.patchValue({
        country: this.dataAutoCertification?.country,
      });
      this.form.patchValue({
        name: this.dataAutoCertification?.name,
      });
      this.form.patchValue({
        taxPostalCode: this.dataAutoCertification?.taxPostalCode,
      });
      countryControl?.disable();
      nationalityControl?.disable();
    }
  }

  validRFCyCURP(): boolean {
    const rfc = this.form.get('rfc')?.value?.toUpperCase();
    const curp = this.form.get('curp')?.value?.toUpperCase();

    if (!rfc || !curp) {
      return false;
    }

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

    if (fechaRFC === fechaCURP && inicialesRFC === inicialesCURP) {
      return true;
    } else {
      this.notificationService.error('El RFC y la CURP no coinciden');
      return false;
    }
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
    if (event.type === CustomerSTRINGS.DELETE) {
      this.notificationModalService
        .confirm({
          title: NOTIFICATION_MESSAGES.DELETE_QUESTION_MESSAGE,
          btnAccept: 'Si, Eliminar.',
          btnDeny: 'No',
        })
        .then((res) => {
          if (!res?.value) return;

          const current = this.dataFiscalResidencesData();

          const updatedData = current.data.map((item) => {
          if (item.tempId === event.row.tempId) {
              return {
                ...item,
                active: false,
                declarationFiscalResidence: false,
              };
            }
            return item;
          });

          const visible = updatedData.filter(item => item.active !== false)

          const updatedTable = this.rebuildTableFromData(visible);

          this.dataFiscalResidencesData.set({
            data: updatedData,
            table: updatedTable,
          });

          this.tableData.set(updatedTable);

          this.notificationService.success(SUCCESS_MESSAGES.ITEM_DELETED);
        });
    }

    if (event.type === CustomerSTRINGS.EDIT) {
      const dataEdit = this.dataFiscalResidencesData().data.find(
        (d) => d.tempId === event.row.tempId,
      );

      this.editItem({
        edit: true,
        data: dataEdit,
        table: {
          ...event.row,
          personId: dataEdit?.personId,
          factaId: dataEdit?.factaObligations?.factaId,
          active: dataEdit?.active,
        },
      });
    }
  }

  /**
   * This method adds the authorized person returned by modal form,
   * to the variable where the whole data section its stored.
   */

addFiscalResidences() {
  let data: CustomerMinFiscalData | null = null;

  const raw = this.form.getRawValue();
  if (raw.nationality && raw.country) {
    data = {
      taxCountry: raw.nationality,
      countryBirth: raw.country,
    };
  }

  this.modalService
    .fiscalResidenceModal(this.dataFiscalResidencesData(), null, data)
    .subscribe((result) => {
      if (!result || !Array.isArray(result.fiscalResidences)) return;

      const activeResidence =
        result.fiscalResidences.find(r => r.declarationFiscalResidence) ??
        result.fiscalResidences[0];

      const newItem = {
        tempId: crypto.randomUUID(),
        active: true,
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

      const current = this.dataFiscalResidencesData();
      const nextData = [...current.data, newItem];
      const nextTable = this.rebuildTableFromData(nextData);

      this.dataFiscalResidencesData.set({
        data: nextData,
        table: nextTable,
      });

      this.tableData.set(nextTable);

      this.form.patchValue({
        fiscalResidences: true,
        declarationFiscalResidence: true,
      });

      this.notificationService.success(SUCCESS_MESSAGES.SAVE_TAX_ADDRESS);
    });
}


  checkboxFatcaCrs(fatca: boolean, crs: boolean) {}

  editItem(modalData: any): void {
    const dialogRef = this.dialog.open(ModalFiscalResidenceComponent, {
      maxWidth: '99%',
      height: '90%',
      data: modalData,
      disableClose: true,
      panelClass: 'panel-class',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result || !Array.isArray(result.fiscalResidences)) return;

      const edited = result.fiscalResidences[0];
      const current = this.dataFiscalResidencesData();

      const updatedData = current.data.map((item) => {
        if (item.tempId !== modalData.data.tempId) return item;

        return {
          ...item,
          personId: edited.personId ?? item.personId,
          personType: edited.personType,
          country: edited.country,
          declarationFiscalResidence: edited.declarationFiscalResidence,
          proofOfAddressType: edited.proofOfAddressType,
          issueDate: edited.issueDate,
          expirationStatus: edited.expirationStatus,
          expirationDate: edited.expirationDate,
          certificationDate: edited.certificationDate,
          declarationYear: edited.declarationYear,
          aditionalDays: edited.aditionalDays,
          factaObligations: {
            factaId: edited.factaObligations?.factaId ?? item.factaObligations?.factaId ?? null,
            autentication: edited.factaObligations?.autentication ?? '',
            nif: edited.factaObligations?.nif ?? '',
            tin: edited.factaObligations?.tin ?? '',
            nss: edited.factaObligations?.nss ?? '',
          },
        };
      });

      const visible = updatedData.filter(item => item.active !== false);
      const updatedTable = this.rebuildTableFromData(visible);

      this.dataFiscalResidencesData.set({
        data: updatedData,
        table: updatedTable,
      });

      this.tableData.set(updatedTable);

      this.notificationService.success(SUCCESS_MESSAGES.SUCCESSFUL_UPDATE);
    });
  }

  allowAlphanumericOnly(event: KeyboardEvent): void {
    const regex = /^[a-zA-Z0-9]$/;
    const key = event.key;
    if (!regex.test(key)) {
      event.preventDefault();
    }
  }

  private rebuildTableFromData(data: any[]): any[] {
    return data.map((r, i) => ({
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

  validForm(): boolean {
    let isValid = true;

    const fiscalData = this.dataFiscalResidencesData().data;
    if (fiscalData.length === 0) {
      this.notificationService.error(
        'Debe agregar al menos un registro de Residencia Fiscal.',
      );
      return false;
    }

    if (!fiscalData.some(r =>
      r.declarationFiscalResidence === true && r.active !== false
    )) {
      this.notificationService.error(
        'Debe seleccionar al menos un Domicilio Fiscal Activo.'
      );
      return false;
    }

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
      declarationFiscalResidence: 'Agrega una Residencia Fiscal',
    };

    const invalidFields = markInvalidControls(this.form);

    if (Object.keys(invalidFields).length > 0) {
      isValid = false;
      validCombobox(
        ['country', 'nationality', 'fiscalRegimeId', 'cfdiUse'],
        this.form,
      );

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
    }

    return isValid;
  }

  private toBool(v: any): boolean {
    if (typeof v === 'boolean') return v;
    if (typeof v === 'string') return v.toLowerCase() === 'true';
    return false;
  }

  validador(): boolean {
    let isValid = true;

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
    };

    const invalidFields = markInvalidControls(this.form);

    if (Object.keys(invalidFields).length > 0) {
      isValid = false;
      validCombobox(
        ['country', 'nationality', 'fiscalRegimeId', 'cfdiUse'],
        this.form,
      );

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
    }

    return isValid;
  }

  rowRadioSelected(event: any) {
    const selectedTempId = event.row.tempId;
    const current = this.dataFiscalResidencesData();

    const updatedData = current.data.map(item => {
      if (item.active === false) return item; 

      return {
        ...item,
        declarationFiscalResidence: item.tempId === selectedTempId,
      };
    });

    const visible = updatedData.filter(item => item.active !== false);

    const updatedTable = this.rebuildTableFromData(visible);

    this.dataFiscalResidencesData.set({
      data: updatedData,
      table: updatedTable,
    });

    this.tableData.set(updatedTable);

    this.form.patchValue({
      declarationFiscalResidence: true,
    });
  }

  
  client = (): CustomerFiscalSelfDeclaration =>
    this.form.getRawValue() as CustomerFiscalSelfDeclaration;

  async onSubmit(): Promise<any> {
    if (!this.validForm()) {
      document.body.classList.add('show-validation');

      Object.values(this.form.controls).forEach(c => {
        if (c.invalid) c.markAsTouched();
      });

      this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS);
      return null;
    }
    
    return {
      ...this.form.getRawValue(),
      fiscalResidences: this.dataFiscalResidencesData().data.map((r) => ({
        ...r,
        personId: r.personId ?? null, 
        factaObligations: {
          ...r.factaObligations,
          factaId: r.factaObligations?.factaId ?? null, 
        },
      })),
    };
  }
}














