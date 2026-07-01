import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EconomicActivityAccredited } from '../../onboarding/models/economic-activity';
import { OnboardingService } from '../../onboarding/services/onboarding.service';
import { CheckpointService } from '../../shared/services/checkpoint.service';
import { CreditDataService } from '../../shared/services/storage-services/credit-data.service';
import { PermissionRolService } from '../../core/services/rol.service';
import { transformCreditDataForService } from '../../onboarding/services/mappers/maintenance/credit-data.mapper';
import { UnsavedChangesService } from '../../core/services/unsaved-changes.service';
import { NotificationsService } from '../../shared/services/notifications.service';
import { RiskGroup } from '../../onboarding/models/risk-group';
import { EconomicSector } from '../../onboarding/models/economic-sector';
import { PaymentPeriod } from '../../onboarding/models/payment-period';
import { CurrencyType } from '../../onboarding/models/currency-type';
import { markInvalidControls, validCombobox } from '../../shared/utils/form';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-credit-data',
  standalone: false,
  templateUrl: './credit-data.component.html',
  styleUrl: './credit-data.component.scss',
})
export class CreditDataComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly onboardingService = inject(OnboardingService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly creditDataService = inject(CreditDataService);
  private readonly permissionService = inject(PermissionRolService);
  private readonly notificationService = inject(NotificationsService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);

  economicActivityAccredited = signal<EconomicActivityAccredited[]>([]);
  riskGroup = signal<RiskGroup[]>([]);
  economicSector = signal<EconomicSector[]>([]);
  paymentPeriod = signal<PaymentPeriod[]>([]);
  currencyTypeList = signal<CurrencyType[]>([]);
  dataCreditData: any | null = null;

  form: FormGroup = this.fb.nonNullable.group({
    economicActivity: ['', Validators.required],
    economicSector: ['', Validators.required],
    accountType: ['', Validators.required],
    operationYears: ['', [Validators.min(0), Validators.max(99), Validators.maxLength(2)]],
    riskGroup: ['', Validators.required],
    dependents: ['', [Validators.maxLength(60), Validators.required]],
    salaried: ['', Validators.required],
    hiringDate: ['', Validators.required],
    salary: ['', [Validators.maxLength(14), Validators.required]],
    paymentPeriod: ['', Validators.required],
    paymentCurrencyType: ['', Validators.required],
    employeeNumber: ['', [Validators.maxLength(10), Validators.required]],
    socialSecurityNumber: ['', [Validators.maxLength(11), Validators.required]],
  });

  onboardingInfo = this.onboardingService.getCurrentInfo();
  isMaintenance: boolean =
    this.onboardingService.getCurrentInfo().isMaintenance;
  permissions = this.permissionService.getPermissions()?.['credit-data'];
  disButtons = {
    edit: false,
    register: true,
    save: false,
    cancel: false,
  };

  filteredEconomicActivities = signal<EconomicActivityAccredited[]>([]);
  economicActivityFilter = new FormControl('');

  constructor() {
    this.economicActivityFilter.valueChanges.subscribe(value => {
      const filterValue = value?.toLowerCase() || '';

      this.filteredEconomicActivities.set(
        this.economicActivityAccredited().filter(item =>
          item.lineBussiness.toLowerCase().includes(filterValue)
        )
      );
    });
  }

  ngOnInit() {
    this.dataCreditData = this.creditDataService.getItem();

    this.economicActivityAccredited.set(
      this.route.snapshot.data['economicActivityAccreditedResolver'] ?? [],
    );
    this.filteredEconomicActivities.set(this.route.snapshot.data['economicActivityAccreditedResolver'] ?? [],);
    this.riskGroup.set(this.route.snapshot.data['riskGroupResolver'] ?? []);
    this.economicSector.set(
      this.route.snapshot.data['economicSectorResolver'] ?? [],
    );
    this.paymentPeriod.set(
      this.route.snapshot.data['paymentPeriodResolver'] ?? [],
    );
    this.currencyTypeList.set(
      this.route.snapshot.data['currencyTypeResolver'] ?? [],
    );
    if (this.dataCreditData && this.isNotEmpty(this.dataCreditData)) {
      this.hydrateFormData(this.dataCreditData);
    }
    if (this.isMaintenance) {
      this.initializeMaintenance();
    }
  }

  hydrateFormData(data: any): void {
    const { generalData = {}, employmentData = {} } = data;

    this.form.patchValue(
      {
        economicActivity: Number(generalData.economicActivity) ?? '',
        economicSector: generalData.economicSector ?? '',
        accountType: generalData.accountType ?? '',
        operationYears: generalData.yearsOfOperation ?? '',
        riskGroup: generalData.riskGroup ?? '',
        dependents: generalData.numberOfEconomicDependents ?? '',
        salaried: employmentData.salaried ?? '',
        hiringDate: employmentData.hiringDate ?? '',
        salary: employmentData.salary ?? '',
        paymentPeriod: employmentData.paymentPeriod ?? '',
        paymentCurrencyType: employmentData.paymentCurrencyType ?? '',
        employeeNumber: employmentData.employeeNumber ?? '',
        socialSecurityNumber: employmentData.socialSecurityNumber ?? '',
      },
      { emitEvent: false },
    );
  }

  isNotEmpty(obj: any) {
    return Object.keys(obj).length > 0;
  }

  async onSubmit() {
    const isValid = this.validForm();
    if (!isValid) {
      return;
    }

    const current = {
      generalData: {
        economicActivity: this.form.value.economicActivity,
        economicSector: this.form.value.economicSector,
        accountType: this.form.value.accountType,
        yearsOfOperation: this.form.value.operationYears,
        riskGroup: this.form.value.riskGroup,
        numberOfEconomicDependents: this.form.value.dependents,
      },
      employmentData: {
        hiringDate: this.form.value.hiringDate,
        salaried: this.form.value.salaried,
        salary: this.form.value.salary,
        paymentPeriod: this.form.value.paymentPeriod,
        paymentCurrencyType: this.form.value.paymentCurrencyType,
        employeeNumber: this.form.value.employeeNumber ?? '',
        socialSecurityNumber: this.form.value.socialSecurityNumber ?? '',
      },
    };

    const payload = transformCreditDataForService(current);

    const response = await firstValueFrom(
      this.checkpointService.saveSectionMant('credit-information', payload)
    );

    if (response?.status === 'CREATED') {
      await this.reloadCreditData();

      this.unsavedChangesService.setUnsavedChanges(false);
      this.notificationService.success(
        'Información de datos crediticios guardada correctamente',
      );
    }
  }

  private async reloadCreditData(): Promise<void> {
    const obs$ = this.checkpointService.getMaintenanceSectionByPersonaFisica(['credit-information'])

    const response = await firstValueFrom(obs$);

    const data = response?.checkpoints?.[0]?.data;

    this.creditDataService.setItem(data);
    this.dataCreditData = data;
    this.hydrateFormData(data);
  }

  allowNumericDecimalOnly(
    event: KeyboardEvent,
    control: HTMLInputElement,
  ): void {
    const key = event.key;

    if (
      [
        'Backspace',
        'Delete',
        'Tab',
        'ArrowLeft',
        'ArrowRight',
        'Home',
        'End',
        'Escape',
        'Enter',
      ].includes(key)
    )
      return;

    if (event.ctrlKey || event.metaKey) {
      const k = key.toLowerCase();
      if (['a', 'c', 'v', 'x', 'z', 'y'].includes(k)) return;
    }

    if (/^[0-9]$/.test(key)) return;

    if (key === '.') {
      const value = control.value;
      const selectionStart = control.selectionStart ?? value.length;
      if (!value || value.includes('.') || selectionStart === 0) {
        event.preventDefault();
        return;
      }
      return;
    }

    event.preventDefault();
  }

  validForm(): boolean {
    let isValid = true;

    const invalidFields = markInvalidControls(this.form);

    if (Object.keys(invalidFields).length > 0) {
      isValid = false;
      validCombobox(
        [
          'economicActivity',
          'economicSector',
          'riskGroup',
          'paymentPeriod',
          'paymentCurrencyType',
        ],
        this.form,
      );

      this.notificationService.error(`Faltan campos obligatorios por capturar`);
    }

    return isValid;
  }

  initializeMaintenance(): void {
    this.form.disable({ emitEvent: false });
    this.disButtons = {
      save: true,
      register: true,
      edit: this.permissions.allDisabled,
      cancel: true,
    };
  }

  editMaintenance(): void {
    if (this.permissions?.allDisabled) return;
    this.form.enable({ emitEvent: false });
    this.disButtons = {
      register: true,
      cancel: false,
      save: false,
      edit: true,
    };
  }

  cancelMaintenance(): void {
    this.initializeMaintenance();
    this.dataCreditData = this.creditDataService.getItem();
    if (this.dataCreditData && this.isNotEmpty(this.dataCreditData)) {
      this.hydrateFormData(this.dataCreditData);
    }
  }
}
