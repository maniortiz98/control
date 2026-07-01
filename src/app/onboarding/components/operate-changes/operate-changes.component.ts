import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { Countries, CountryRequest } from '../../models/country';
import { STRINGS } from '../../constants/constants';
import { CatalogsAllowed } from '../../../shared/types/catalogs.type';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { OperateChangesSection } from '../../models/operate-changes';
import { OperateChangesStorageService } from '../../../shared/services/storage-services/operate-changes-storage.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
import { AmountMonthlyDeposit, MonthlyDeposit } from '../../models/monthly-deposit';
import { operateChangeSectionToCheckpoint } from '../../services/mappers/operate-changes.mappers';
import { OnboardingService } from '../../services/onboarding.service';
import { butonFunctionDis, buttonFunctionEn } from '../../../shared/utils/disableOrEnabled';
import { PermissionRolService } from '../../../core/services/rol.service';
import { operateChangeSectionToCheckpointMant, checkpointToOperateChangeSectionMant } from '../../services/mappers/maintenance/operate-changes-mant-mapper';
import { tap, catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-operate-changes',
  standalone: false,
  templateUrl: './operate-changes.component.html',
  styleUrl: './operate-changes.component.scss'
})
export class OperateChangesComponent {
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationsService)
  private readonly catalogsService = inject(CatalogsService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly storageService = inject(OperateChangesStorageService);
  private readonly checkpoint = inject(CheckpointService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly roleService = inject(PermissionRolService);
  isMaintenance: boolean = false;
  personType: string = '';

  form: FormGroup = this.fb.group({

    metalChangeInversion: [false],
    currencySellAndBuy: [false],

    //importExport
    importAndExport: [false],
    countrySender: [''],
    countryReciber: [''],

    //personalFundsReceipt
    resourceReception: [false],
    resourceCountrySender: [''],
    resourceCounteyReciber: [''],

    //settlementToSuppliersAbroad
    liquidationSupplier: [false],
    liquidationSupplierCountryDestiny: [''],

    //receiptOrSendingDonations
    donation: [false],
    donationCountrySender: [''],
    donationCountryReciber: [''],

    //forInvestment
    inversion: [false],
    inversionCountrySender: [''],
    inversionCountryReciber: [''],

    //settlementOfFinancialOperations
    liquidationOperation: [false],
    liquidationOperationCountryReciber: [''],

    clientPayment: [false],
    clientPaymentCountrySender: [''],
    //
    cash: [false],
    cashOperationNumber: [''],
    cashOperationAmount: [''],

    transfer: [false],
    transferOperationNumber: [''],
    transferOperationAmount: [''],

    document: [false],
    documentOperationNumber: [''],
    documentOperationAmount: [''],

    travelerCheck: [false],
    travelerCheckOperationNumber: [''],
    travelerCheckOperationAmount: [''],

    gold: [false],
    goldOperationNumber: [''],
    goldOperationAmount: [''],

    silver: [false],
    silverOperationNumber: [''],
    silverOperationAmount: [''],

    other: [false],
    otherType: [''],
    otherOperationNumber: [''],
    otherOperationAmount: [''],
  });

  countries = signal<Array<Countries>>([]);
  otherTypeSelected = signal<string>('______');

  operationNumber = signal<Array<MonthlyDeposit>>([]);
  operationAmount = signal<Array<AmountMonthlyDeposit>>([]);

  ngOnInit() {

    this.isMaintenance = this.onboardingService.getCurrentInfo().isMaintenance;

    this.catalogsService.getCountry({ land: [] }).subscribe(c => {
      this.countries.set(c);
    });

    this.catalogsService.getMonthlyDeposit({}).subscribe(i => {
      console.log(i)
      this.operationNumber.set(i);
    })

    this.catalogsService.getMonthlyDepositAvg({}).subscribe(i => {
      console.log(i)
      this.operationAmount.set(i)
    })

    this.form.valueChanges.subscribe(() => {
      this.unsavedChangesService.setUnsavedChanges(this.form.dirty);
    });

    this.applyDynamicValidations([
      { trigger: 'importAndExport', targets: ['countrySender', 'countryReciber'] },
      { trigger: 'resourceReception', targets: ['resourceCountrySender'] },

      { trigger: 'liquidationSupplier', targets: ['liquidationSupplierCountryDestiny'] },
      { trigger: 'donation', targets: ['donationCountrySender', 'donationCountryReciber'] },
      { trigger: 'inversion', targets: ['inversionCountrySender', 'inversionCountryReciber'] },
      { trigger: 'importAndExportOperation', targets: ['importAndExportOperationCountrySender', 'importAndExportOperationCountryReciber'] },
      { trigger: 'liquidationOperation', targets: ['liquidationOperationCountryReciber'] },
      { trigger: 'clientPayment', targets: ['clientPaymentCountrySender'] },

      { trigger: 'cash', targets: ['cashOperationNumber', 'cashOperationAmount'] },
      { trigger: 'transfer', targets: ['transferOperationNumber', 'transferOperationAmount'] },
      { trigger: 'document', targets: ['documentOperationNumber', 'documentOperationAmount'] },
      { trigger: 'travelerCheck', targets: ['travelerCheckOperationNumber', 'travelerCheckOperationAmount'] },
      { trigger: 'gold', targets: ['goldOperationNumber', 'goldOperationAmount'] },
      { trigger: 'silver', targets: ['silverOperationNumber', 'silverOperationAmount'] },
      { trigger: 'other', targets: ['otherType', 'otherOperationNumber', 'otherOperationAmount'] },
    ]);

    const initialData = this.storageService.operateChanges();
    if (initialData) {
      console.log(initialData)
      this.chargeInitialValues(initialData);
    }
    this.personType = this.onboardingService.currentInfo().personType;
  }


  ngAfterViewInit() {
    if (this.isMaintenance) {
      this.form.disable();
      butonFunctionDis(['btnCancelOC', 'btnSaveOC']);
      const allPermises = this.roleService.getPermissions();
      console.log({ allPermises })
      var cantEdit;
      if (this.personType === 'PF') {
        cantEdit = allPermises['operate-changes']['allDisabled']
      } else {
        cantEdit = allPermises['operate-changes-pm']['allDisabled']
      }
      if (cantEdit) {
        butonFunctionDis(['btnEditOC']);
      } else {
        buttonFunctionEn(['btnEditOC']);
      }
    }
  }

  onSubmit() {
    const rules = this.validateRules();
    if (rules[0] != '') {
      this.notificationService.error(rules[0], rules[1]);
      return
    }

    if (this.form.valid) {
      const result: OperateChangesSection = this.responseDataSection();
      console.log({result});
      if(!this.isMaintenance){
        this.checkpoint.saveSection('exchange-operation', operateChangeSectionToCheckpoint(result)).subscribe({
          next: (i) => {
            if (i.status === "FAILED") {
              console.log(i.status)
            } else {
              this.unsavedChangesService.setUnsavedChanges(false)
              this.form.markAsPristine();
              this.storageService.setoperateChanges(result);
              this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
              document.body.classList.remove('show-validation');
            }
          },
          error: (err) => {
            console.log(err)
          }
        });
      }else {
        this.checkpoint.saveSectionMant('exchange-operation', operateChangeSectionToCheckpointMant(result)).subscribe({
          next: (i) => {
            if (i.status === "FAILED") {
              console.log(i.status)
            } else {
              this.unsavedChangesService.setUnsavedChanges(false)
              this.form.markAsPristine();
              this.storageService.setoperateChanges(result);
              this.rechargePage();
              this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
              document.body.classList.remove('show-validation');
            }
          },
          error: (err) => {
            console.log(err)
          }
        });
      }

    } else {
      console.log('false');
      document.body.classList.add('show-validation');

      Object.entries(this.form.controls).forEach(([name, control]) => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });

      this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS);
    }
  }

  validateRules(): string[] {
    if (!(this.form.value.metalChangeInversion || this.form.value.currencySellAndBuy
      || this.form.value.importAndExport || this.form.value.resourceReception)) {
      return ['Es Obligatorio Seleccionar dentro de la Sección “Razón o Motivo para Realizar Operaciones de Cambios”', 'Por favor Seleccione una Opción']
    }

    if (!(this.form.value.cash || this.form.value.transfer
      || this.form.value.document || this.form.value.travelerCheck)) {
      return ['Es Obligatorio Seleccionar dentro de la Sección “Tipo de transacción a realizar” ', 'Por favor Seleccione una Opción']
    }
    return ['']
  }

  setOtherType() {
    this.otherTypeSelected.set(this.form.value.otherType);
  }

  responseDataSection(): OperateChangesSection{
    return {
      fxOperationReasonsId: this.storageService.operateChanges()?.fxOperationReasonsId ?? null,
      fxOperationsDetailsId: this.storageService.operateChanges()?.fxOperationsDetailsId ?? null,
      metalChangeInversion: this.form.value.metalChangeInversion,
      currencySellAndBuy: this.form.value.currencySellAndBuy,

      importAndExport: this.form.value.importAndExport,
      countrySender: this.form.value.countrySender,
      countryReciber: this.form.value.countryReciber,

      resourceReception: this.form.value.resourceReception,
      resourceCountrySender: this.form.value.resourceCountrySender,
      resourceCounteyReciber: this.form.value.resourceCounteyReciber,

      //settlementToSuppliersAbroad
      liquidationSupplier: this.form.value.liquidationSupplier,
      liquidationSupplierCountryDestiny: this.form.value.liquidationSupplierCountryDestiny,

      //receiptOrSendingDonations
      donation: this.form.value.donation,
      donationCountrySender: this.form.value.donationCountrySender,
      donationCountryReciber: this.form.value.donationCountryReciber,

      //forInvestment
      inversion: this.form.value.inversion,
      inversionCountrySender: this.form.value.inversionCountrySender,
      inversionCountryReciber: this.form.value.inversionCountryReciber,

      //settlementOfFinancialOperations
      liquidationOperation: this.form.value.liquidationOperation,
      liquidationOperationCountryReciber: this.form.value.liquidationOperationCountryReciber,

      clientPayment: this.form.value.clientPayment,
      clientPaymentCountrySender: this.form.value.clientPaymentCountrySender,

      cash: this.form.value.cash,
      cashOperationNumber: this.form.value.cashOperationNumber,
      cashOperationAmount: this.form.value.cashOperationAmount,

      transfer: this.form.value.transfer,
      transferOperationNumber: this.form.value.transferOperationNumber,
      transferOperationAmount: this.form.value.transferOperationAmount,

      document: this.form.value.document,
      documentOperationNumber: this.form.value.documentOperationNumber,
      documentOperationAmount: this.form.value.documentOperationAmount,

      travelerCheck: this.form.value.travelerCheck,
      travelerCheckOperationNumber: this.form.value.travelerCheckOperationNumber,
      travelerCheckOperationAmount: this.form.value.travelerCheckOperationAmount,

      gold: this.form.value.gold,
      goldOperationNumber: this.form.value.goldOperationNumber,
      goldOperationAmount: this.form.value.goldOperationAmount,

      silver: this.form.value.silver,
      silverOperationNumber: this.form.value.silverOperationNumber,
      silverOperationAmount: this.form.value.silverOperationAmount,

      other: this.form.value.other,
      otherType: this.form.value.otherType,
      otherOperationNumber: this.form.value.otherOperationNumber,
      otherOperationAmount: this.form.value.otherOperationAmount,
    }
  }
  private applyDynamicValidations(configs: Array<{ trigger: string, targets: string[] }>) {
    configs.forEach(({ trigger, targets }) => {
      this.form.get(trigger)?.valueChanges.subscribe(value => {
        targets.forEach(field => {
          const control = this.form.get(field);
          if (!control) return;

          if (value === true) {
            control.setValidators([Validators.required]);
          } else {
            control.clearValidators();
            control.setValue('');
          }
          control.updateValueAndValidity();
        });
      });
    });
  }

  editt() {
    butonFunctionDis(['btnEditOC']);
    buttonFunctionEn(['btnSaveOC', 'btnCancelOC']);

    const allPermises = this.roleService.getPermissions();
    if (!allPermises['operate-changes']['allDisabled']) {
      this.form.enable();
    }
    console.log('permises')
  }

  cancel() {
    buttonFunctionEn(['btnEditOC']);
    butonFunctionDis(['btnSaveOC', 'btnCancelOC']);
    this.form.disable();

    const initialData = this.storageService.operateChanges();
    if (initialData) {
      this.chargeInitialValues(initialData);
    } else {
      this.form.reset();
    }
    this.form.markAsPristine();
    this.unsavedChangesService.setUnsavedChanges(false);
  }



  chargeInitialValues(content: OperateChangesSection) {
    this.form.patchValue({
      metalChangeInversion: content.metalChangeInversion,
      currencySellAndBuy: content.currencySellAndBuy,

      // importExport
      importAndExport: content.importAndExport,
      countrySender: content.countrySender,
      countryReciber: content.countryReciber,

      // personalFundsReceipt
      resourceReception: content.resourceReception,
      resourceCountrySender: content.resourceCountrySender,
      resourceCounteyReciber: content.resourceCounteyReciber,

      // settlementToSuppliersAbroad
      liquidationSupplier: content.liquidationSupplier,
      liquidationSupplierCountryDestiny: content.liquidationSupplierCountryDestiny,

      // receiptOrSendingDonations
      donation: content.donation,
      donationCountrySender: content.donationCountrySender,
      donationCountryReciber: content.donationCountryReciber,

      // forInvestment
      inversion: content.inversion,
      inversionCountrySender: content.inversionCountrySender,
      inversionCountryReciber: content.inversionCountryReciber,

      // settlementOfFinancialOperations
      liquidationOperation: content.liquidationOperation,
      liquidationOperationCountryReciber: content.liquidationOperationCountryReciber,

      clientPayment: content.clientPayment,
      clientPaymentCountrySender: content.clientPaymentCountrySender,

      // cash
      cash: content.cash,
      cashOperationNumber: content.cashOperationNumber,
      cashOperationAmount: content.cashOperationAmount,

      // transfer
      transfer: content.transfer,
      transferOperationNumber: content.transferOperationNumber,
      transferOperationAmount: content.transferOperationAmount,

      // document
      document: content.document,
      documentOperationNumber: content.documentOperationNumber,
      documentOperationAmount: content.documentOperationAmount,

      // travelerCheck
      travelerCheck: content.travelerCheck,
      travelerCheckOperationNumber: content.travelerCheckOperationNumber,
      travelerCheckOperationAmount: content.travelerCheckOperationAmount,

      // gold
      gold: content.gold,
      goldOperationNumber: content.goldOperationNumber,
      goldOperationAmount: content.goldOperationAmount,

      // silver
      silver: content.silver,
      silverOperationNumber: content.silverOperationNumber,
      silverOperationAmount: content.silverOperationAmount,

      // other
      other: content.other,
      otherType: content.otherType,
      otherOperationNumber: content.otherOperationNumber,
      otherOperationAmount: content.otherOperationAmount,
    });
  }
  

  rechargePage() {
    console.log('operation rechargePage');
    if (!this.isMaintenance) {
      return;
    }
    this.checkpoint
      .getMaintenanceSectionByPersonaFisica(['exchange-operation'])
      .subscribe({
        next: (response: any) => {
          if (response?.checkpoints?.[0]?.data) {
            try {
              const info = checkpointToOperateChangeSectionMant(
                response.checkpoints[0].data
              );
              if (info) {
                this.storageService.setoperateChanges(info);
              }
            } catch (error) {
              console.error('Error en el mapeo de rechargePage:', error);
            }
          } else {
            console.log('No hay info capturada previamente para opera-cambios');
          }
          this.cancel();
        },
        error: (err) => {
          console.error('Error en la peticion de rechargePage:', err);
          this.cancel();
        }
      });
  }
}
