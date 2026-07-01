import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { mapFormToAdditionalInfo } from '../../../shared/services/mapper-services/maper';

import { OnboardingService } from '../../services/onboarding.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AdditionalInfoData,
  AdditionalInfoPageData,
  AdditionalInfoTableData,
  ADDRESS_TYPE_OPTIONS,
  DOCUMENT_DELIVERY_OPTIONS,
} from '../../models/additional-info';
import { AdditionalInfoService } from '../../../shared/services/storage-services/additional-info.service';
import { MatDialog } from '@angular/material/dialog';
import { W8BENModalComponent } from '../../../shared/components/modals/modal-w8-ben/modal-w8-ben.component';
import { PermissionRolService } from '../../../core/services/rol.service';
import { CurrentOnboardingInfo } from '../../models/current-onboarding';
import { additionalInfoCheckpointToSection, additionalInfoSectionToCheckpoint } from '../../services/mappers/maintenance/additional-info-mapper';
import { ERROR_MESSAGES, NOTIFICATION_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { ConfigDataTable } from '../../../shared/components/table-results/interfaces';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AddressesService } from '../../../shared/services/storage-services/addresses.service';
import { ZipCodeService } from '../../../shared/services/zip-code.service';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { SuburbItem } from '../../models/zip-code';

@Component({
  selector: 'app-additional-info',
  standalone: false,
  templateUrl: './additional-info.component.html',
  styleUrl: './additional-info.component.scss',
})
export class AdditionalInfoComponent implements OnInit {
  @ViewChild('pickerBirthdate') pickerBirthdate!: MatDatepicker<Date>;
  private readonly onboardingService = inject(OnboardingService);
  private readonly notificationService = inject(NotificationsService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly additionalInfoService = inject(AdditionalInfoService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly dialog = inject(MatDialog);
  private readonly permissionService = inject(PermissionRolService);
  private readonly notificationModalService = inject(NotificationModalService);
  readonly addressesService = inject(AddressesService);
  private readonly zipCodeService = inject(ZipCodeService);

  form: FormGroup;
  keyAddressesOptions = ADDRESS_TYPE_OPTIONS;
  sendDocumentsOptions = DOCUMENT_DELIVERY_OPTIONS;
  mockLocal = [
    {
      id: 1,
      loc: 'CDMX',
    },
    {
      id: 2,
      loc: 'LOS ANGELES',
    },
    {
      id: 3,
      loc: 'MADRID',
    },
  ]
  colony = signal<SuburbItem[]>([]);

  tableData = signal<AdditionalInfoTableData[]>([]);
  tableConfig: ConfigDataTable = {
    showPag: false,
    showViewAction: false,
    showEditAction: true,
    showDeleteAction: false,
    multipleSelection: false,
    idName: 'tempId',
  };
  enabled: boolean = false;
  columnsAdditionalInfo: Array<any> = [];
  initialData: AdditionalInfoPageData | null = null;
  isBankArea = signal(false);
  w8benForm = signal(false);
  // dataAdditionalInfoData = signal<AdditionalInfoPageData>({
  //   data: ,
  //   table: [],
  // });
  questions = [
    {
      text: '¿Le gustaría realizar Operaciones en Cambios, como es: compraventa de transferencias, documentos, cheques de viajero y efectivo?',
      control: 'currencyOperations',
      required: true,
    },
    {
      text: '¿Le gustaría invertir en Sociedades de Inversión de terceros?',
      control: 'thirdPartyCompanies',
      required: true,
    },
    {
      text: '¿Le gustaría invertir en Sociedades de Inversión propias?',
      control: 'ownCompanies',
      required: true,
    },
    {
      text: '¿Le gustaría invertir en Acciones nacionales y/o extranjeras cotizadas en SIC?',
      control: 'sicShares',
      required: true,
    },
    {
      text: '¿Le gustaría invertir en Instrumentos derivados y productos estructurados como SWAPS, opciones, futuros, MEXDER?',
      control: 'derivativeInstruments',
      required: true,
    },
    {
      text: '¿Le gustaría invertir en Instrumentos de deuda como CETES, bonos, pagarés y certificados bursátiles?',
      control: 'debtInstruments',
      required: true,
    },
    {
      text: '¿Le gustaría invertir en Planes de Ahorro con estímulo Fiscal?',
      control: 'savingsPlans',
      required: true,
    },
  ];

  constructor(private fb: FormBuilder) {
    this.onboardingService.getCustomerInitialData()?.bankAreaTypeId ===
      999
      ? this.isBankArea.set(true)
      : this.isBankArea.set(false);
    this.form = this.fb.group({
      addressKey: ['', Validators.required],
      sendDocuments: ['', Validators.required],
      isrExempt: [false],
      expirationDate: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      w8benForm: [false],
      startDateW8: [''],
      endDateW8: [''],
      locations: [''],
      currencyOperations: ['', Validators.required],
      thirdPartyCompanies: ['', Validators.required],
      ownCompanies: ['', Validators.required],
      sicShares: ['', Validators.required],
      derivativeInstruments: ['', Validators.required],
      debtInstruments: ['', Validators.required],
      savingsPlans: ['', Validators.required],
    });
  }

  /** Data for Maintenance */
  onboardingInfo: CurrentOnboardingInfo =
    this.onboardingService.getCurrentInfo();
  isMaintenance: boolean =
    this.onboardingService.getCurrentInfo().isMaintenance;
  permissions = this.permissionService.getPermissions()?.['additional-info'];
  disButtons = { edit: false, register: false, save: false, cancel: false };
  canRead = false;
  canEdit = false;
  canAdd = false;
  canDelete = false;
  isReadOnly = false;
  /** */


  async ngOnInit() {
    const dataAddresses = this.addressesService.get();
    if (dataAddresses) {
      if (dataAddresses.addressList?.length > 0) {
        const data = await lastValueFrom(this.zipCodeService.postData({ zipCode: dataAddresses.addressList[0].postalCode }));
        console.log(data);
        this.colony.set(data.listSuburb.item);
      }
    }
    this.applyRolePermissions();
    this.columnsAdditionalInfo = [
      {
        name: 'startDateW8',
        title: 'Fecha Inicio',
        show: true,
        type: 'string',
      },
      {
        name: 'endDateW8',
        title: 'Fecha Fin',
        show: true,
        type: 'string',
      },
    ];
    this.initialData = this.additionalInfoService.getItem();
    console.log(this.initialData)
    this.hydrateFormData(this.initialData);

    this.form.get('w8benForm')?.valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.w8benForm.set(true);
      } else {
        this.w8benForm.set(false);
      }
    });
    const allPermises = this.permissionService.getPermissions();
    const cantEdit = allPermises['contact-info']['allDisabled']
    if (this.onboardingInfo.isMaintenance) {
      console.log(this.permissions);
      console.log(allPermises)
      this.initializeMaintenance();
    }
  }
  onDateInput(event: MatDatepickerInputEvent<Date>, name: string) {
    const date = event.value;
    const control = this.form.get(name);

    if (date instanceof Date && control && this.pickerBirthdate) {
      this.pickerBirthdate.select(date);
    }
  }

  eventRow(event: { type: string; row: any }): void {
    if (event.type === 'edit') {
      this.openEditModal(event.row);
    } else if (event.type === 'delete') {
      this.deleteRow(event.row.tempId);
    }
  }

  openEditModal(row: any): void {
    const dialogRef = this.dialog.open(W8BENModalComponent, {
      width: '600px',
      data: {
        ...row,
        enabled: this.enabled,
        existingData: this.tableData(), // Pasamos la señal desenvuelta
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateEditedRow(row.tempId, result);
      }
    });
  }

  updateEditedRow(id: string, editedData: any): void {

    this.tableData.update((current) => {
      const index = current.findIndex((item) => item.tempId === id);
      if (index === -1) return current;

      const updated = [...current];
      updated[index] = {
        ...updated[index],
        startDateW8: editedData.startDateW8,
        endDateW8: editedData.endDateW8,
      };

      return updated;
    });
  }

  addRegister(): void {
    const newStart = new Date(this.form.value.startDateW8);
    const newEnd = new Date(this.form.value.endDateW8);
    const validFlag = this.w8DateValidator(newStart, newEnd)
    if (!validFlag) {
      return;
    }
    const overlap = this.tableData().some((item) => {
      const start = this.parseDMY(item.startDateW8);
      const end = this.parseDMY(item.endDateW8);
      return newStart <= end && newEnd >= start && item.active;
    });

    if (overlap) {
      this.notificationService.error(
        'Ya Existe un Registro en el Mismo Período.'
      );
      return;
    }
    const newRecord = {
      tempId: crypto.randomUUID(),
      startDateW8: this.formatDate(this.form.value.startDateW8),
      endDateW8: this.formatDate(this.form.value.endDateW8),
      active: true,
    };

    this.tableData.update((current) => [...current, newRecord]);
  }

  w8DateValidator(newStart: Date, newEnd: Date): boolean {

    const startCtrl = this.form.get('startDateW8');
    const endCtrl = this.form.get('endDateW8');


    if (isNaN(newStart.getTime())) {
      startCtrl?.setErrors({ invalidDate: true });
      startCtrl?.markAsTouched();
    }

    if (isNaN(newEnd.getTime())) {
      endCtrl?.setErrors({ invalidDate: true });
      endCtrl?.markAsTouched();
    }

    if (isNaN(+newStart) || isNaN(+newEnd)) {
      this.notificationService.error(
        ERROR_MESSAGES.MISSING_FIELDS
      );
      return false;
    }
    if (newStart >= newEnd) {
      this.notificationService.error(
        'La Fecha Inicial debe ser Menor que la Fecha Final'
      );
      return false;
    }


    const maxEnd = new Date(newStart);
    maxEnd.setFullYear(maxEnd.getFullYear() + 3);

    if (newEnd > maxEnd) {
      this.notificationService.error(
        'El Período de Vigencia Seleccionado no Puede Exceder los 3 Años'
      );
      return false
    }
    return true;
  }


  async deleteRow(id: string) {

    const result = await this.notificationModalService.confirm({
      title: NOTIFICATION_MESSAGES.DELETE_CONFIRMATION_MESSAGE,
      btnAccept: 'Sí, Eliminar',
      btnDeny: 'No',
    });
    if (result?.value === true) {
      this.tableData.update(list =>
        list.map(item =>
          item.tempId === id
            ? { ...item, active: false }
            : item
        )
      );
    }
  }


  isNotEmpty(obj: any) {
    return Object.keys(obj).length > 0;
  }


  parseDMY(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  validador(): boolean {
    let isValid = true;

    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);

      if (control && control.invalid) {
        control.markAsTouched();
        isValid = false;
      }
    });

    this.validarCombobox(['keyAddressesOptions', 'sendDocumentsOptions']);

    const invalidos = this.getCamposInvalidos();
    console.log('Campos inválidos:', invalidos);

    if (!isValid) {
      console.log(this.form);
      this.notificationService.error(
        'Tienes Campos Capturados con Formato Incorrecto'
      );
    }

    return isValid;
  }

  private validarCombobox(fields: string[]): void {
    fields.forEach((field) => {
      const control = this.form.get(field);
      if (control && !control.value) {
        control.markAsTouched();
      }
    });
  }

  getCamposInvalidos(): string[] {
    const camposInvalidos: string[] = [];
    Object.keys(this.form.controls).forEach((controlName) => {
      const control = this.form.get(controlName);
      if (control && control.invalid) {
        camposInvalidos.push(controlName);
      }
    });

    return camposInvalidos;
  }

  error(): void {
    Object.values(this.form.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsTouched();
      }
    });
  }

  async onSubmit() {
    const isValid = this.validador();
    if (!isValid) {
      document.body.classList.add('show-validation');
      return;
    }

    const additionalInfoData: AdditionalInfoPageData =
      mapFormToAdditionalInfo(this.client(), this.tableData());

    this.unsavedChangesService.setUnsavedChanges(false);
    console.log({ additionalInfoData })
    this.additionalInfoService.setItem(additionalInfoData);

    let infoToCheckp = additionalInfoData
    infoToCheckp.data.expirationDate = this.formatDate(this.form.value.expirationDate);
    this.checkpointService.saveSectionMant('additional-information', additionalInfoSectionToCheckpoint(infoToCheckp))
      .subscribe({
        next: (i) => {
          console.log(i);
          if (i.status === "FAILED") {
            this.notificationService.error(ERROR_MESSAGES.SAVE_CHECKPOINT_ERROR);
          } else {

            this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
            this.unsavedChangesService.setUnsavedChanges(false);

            this.reloadAditionalInfo();
            this.initializeMaintenance();
          }
        },
        error: (err) => {
          console.error(err);
          this.notificationService.error(ERROR_MESSAGES.SAVE_CHECKPOINT_ERROR);
        }
      });
  }

  async reloadAditionalInfo() {
    const obs$ = this.checkpointService.getMaintenanceSectionByPersonaFisica(['additional-information'])

    const response = await firstValueFrom(obs$);


    const data = additionalInfoCheckpointToSection(response?.checkpoints?.[0]?.data);

    this.additionalInfoService.setItem(data);
    this.initialData = data;
    this.hydrateFormData(data);
  }


  hydrateFormData(formData: AdditionalInfoPageData | null) {
    if (formData && this.isNotEmpty(formData)) {
      const { data, table } = formData;

      const expirationDate = data.expirationDate
        ? this.parseDate(data.expirationDate)
        : null;

      this.form.patchValue({
        addressKey: data.addressKey ?? '',
        sendDocuments: data.sendDocuments ?? '',
        isrExempt: data.isrExempt ?? '',
        expirationDate: expirationDate,
        startDate: data.startDate ?? null,
        endDate: data.endDate ?? null,
        w8benForm: data.w8benForm ?? '',
        locations: data.locations ?? '',
        currencyOperations: data.currencyOperations ?? '',
        thirdPartyCompanies: data.thirdPartyCompanies ?? '',
        ownCompanies: data.ownCompanies ?? '',
        sicShares: data.sicShares ?? '',
        derivativeInstruments: data.derivativeInstruments ?? '',
        debtInstruments: data.debtInstruments ?? '',
        savingsPlans: data.savingsPlans ?? '',
      });

      this.tableData.set(table);
    }
  }

  parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/');
    return new Date(+year, +month - 1, +day);
  }

  /** -------- MAINTENANCE -------- */
  initializeMaintenance(): any {
    this.form.disable();
    this.isReadOnly = true;
    this.tableConfig.showDeleteAction = false;
    this.enabled = false;
    this.disButtons = { save: true, register: true, edit: this.permissions.allDisabled, cancel: true };
  }

  validateRolOnEdit(): any {
    if (this.canEdit) {
      this.form.enable();
      this.enabled = true
    } else {
      this.form.disable();
    }

    // this.disButtons.register = !this.canEdit;
  }

  validateFieldsDisabled(): any {
    this.permissions?.fieldsDisabled?.forEach((field: any) => {
      this.form.get(field)?.disable();
    });
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
    this.validateFieldsDisabled();
  }

  cancelMaintenance(): any {
    this.initialData = this.additionalInfoService.getItem();
    this.hydrateFormData(this.initialData);
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

  //function to map to DataClient
  client = (): AdditionalInfoData =>
    this.form.getRawValue() as AdditionalInfoData;

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
