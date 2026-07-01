import { concatFullName } from '../../../shared/utils/string';
import {
  Component,
  EventEmitter,
  inject,
  Output,
  ViewChild,
  DestroyRef,
  effect,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerNotificationsService } from '../../services/customer-notifications.service';
import { CustomerFirstDataClientService } from '../../services/storage-services/customer-first-data-client.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { CustomerAddress } from '../../models/customer-address';
import { CustomerCheckpointService } from '../../services/customer-customer-checkpoint-core.service';
import { mapToCheckPointFiscalSelfDeclarationData } from '../../services/mappers/checkpoint/customer-mapper.customer';
import { mapToCheckPointFiscalSelfDeclarationDataM } from '../../services/mappers/maintenance/respnse/customer-fiscal-self-declaration-mapper';
import { CustomerAutoCertificationSectionComponent } from '../auto-certification-section/customer-auto-certification-section.component';
import { CustomerFiscalSelfDeclarationDataClientService } from '../../services/storage-services/customer-fiscal-self-declaration.service';
import { CustomerClientTaxData } from '../../models/customer-fiscal-self-declaration-data';
import { Data } from '../../models/checkpoints/customer-initial-data-checkpoint';
import { CustomerOnboardingService } from '../../services/customer-onboarding.service';
import { CustomerAddressService } from '../../services/storage-services/customer-address.service';
import { Router, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SUCCESS_MESSAGES } from '../../constants/customer-form-messages';
import { butonFunctionDis, buttonFunctionEn } from '../../utils/customer-disable-or-enabled';
import { PermissionRolService } from '../../../core/services/rol.service';

@Component({
  selector: 'app-customer-tax-info',
  standalone: false,
  templateUrl: './customer-tax-info.component.html',
  styleUrl: './customer-tax-info.component.scss',
})
export class CustomerTaxInfoComponent {
  @ViewChild(CustomerAutoCertificationSectionComponent)
  autoCertificationDataComponent!: CustomerAutoCertificationSectionComponent;

  @Output() formGroupEmitter = new EventEmitter<FormGroup>();

  private readonly fb = inject(FormBuilder);
  private readonly checkpointService = inject(CustomerCheckpointService);
  private readonly notificationService = inject(CustomerNotificationsService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly firstDataClientService = inject(CustomerFirstDataClientService);
  private readonly fiscalSelfDeclarationDataService = inject(
    CustomerFiscalSelfDeclarationDataClientService,
  );
  private readonly roleService = inject(PermissionRolService);
  private readonly onboardingService = inject(CustomerOnboardingService);
  readonly addressService = inject(CustomerAddressService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly configDisabled: any = {
    identification: {
      allDisabled: true,
      fieldsDisabled: [],
      buttonsDisabled: [],
    },
    phone: {
      allDisabled: true,
      fieldsDisabled: [],
      buttonsDisabled: [],
    },
    mail: {
      allDisabled: true,
      fieldsDisabled: [],
      buttonsDisabled: [],
    },
  };

  rolePermises: any = {};
  isMaintenance = this.onboardingService.getCurrentInfo().isMaintenance;
  dataClient: Data | null = null;
  dataAutoCertification: CustomerClientTaxData | null = null;
  dataAddress: CustomerAddress[] | null = null;

  profileForm: FormGroup = this.fb.group({});
  private receivedFormGroup: FormGroup | undefined;
  private skipDisableOnValueChange = false;

  disabled = false;

  constructor() {
    const destroyRef = inject(DestroyRef);

    destroyRef.onDestroy(() => {
      (this.onboardingService as any).btnConfirmData.set(false);
    });

    effect(() => {
      (this.onboardingService as any).btnConfirmData.set(true);
    });

    this.dataAddress = this.addressService.getAll();

    let cpf = '';
    if (this.dataAddress?.[0]?.taxPostalCode) {
      cpf = this.dataAddress[0].taxPostalCode;
    }

    document.body.classList.remove('show-validation');

    this.dataClient = this.firstDataClientService.getItem();
    if (!this.dataClient) return;

    const savedData = this.fiscalSelfDeclarationDataService.getItem() ?? this.dataClient;
    if (savedData) {
      this.dataAutoCertification = this.buildAutoCertification(savedData);
    }
  }

  editt() {
    butonFunctionDis(['btnEditCI']);
    buttonFunctionEn(['btnSaveCI', 'btnCancelCI']);
    const allPermises = this.roleService.getPermissions();
    const cantEdit = allPermises['tax-info']['allDisabled'];
    if (cantEdit) {
      butonFunctionDis(['btnEditCI']);
    } else {
      buttonFunctionEn(['btnEditCI']);
    }
  }

  cancel() {
    this.rolePermises = this.configDisabled;
    buttonFunctionEn(['btnEditCI']);
    butonFunctionDis(['btnSaveCI', 'btnCancelCI']);
  }

  ngOnInit() {
    const onboardingRegister = this.onboardingService.getOnboardingRegister();

    if (onboardingRegister && Object.keys(onboardingRegister).length > 0) {
      this.router.navigate(['../../finalization'], {
        relativeTo: this.route,
      });
    }

    if (this.onboardingService.getCurrentInfo().isMaintenance) {
      this.disabled = true;
    }
  }

  ngAfterViewInit() {
    if (this.isMaintenance) {
      this.rolePermises = this.configDisabled;
      butonFunctionDis(['btnCancelCI', 'btnSaveCI']);
      const allPermises = this.roleService.getPermissionsCustomer();
      const cantEdit = allPermises['contact-info']['allDisabled'];
      if (cantEdit) {
        butonFunctionDis(['btnEditCI']);
      } else {
        buttonFunctionEn(['btnEditCI']);
      }
    }
  }

  onFormGroupReceived(formGroup: FormGroup): void {
    this.receivedFormGroup = formGroup;
    this.receivedFormGroup.valueChanges.subscribe(() => {
      if (!this.skipDisableOnValueChange) {
        (this.onboardingService as any).btnConfirmDataDisabled.set(true);
      }
    });
  }

  async onSubmit() {
    document.body.classList.add('show-validation');

    const resultData = await this.autoCertificationDataComponent.onSubmit();
    if (!resultData) return;

    this.unsavedChangesService.setUnsavedChanges(false);

    const isMaintenance = this.onboardingService.getCurrentInfo().isMaintenance;

    if (isMaintenance) {
      const requestCheckpoint = mapToCheckPointFiscalSelfDeclarationDataM(resultData);

      this.checkpointService
        .saveSectionNonContract('fiscal-self-declaration', requestCheckpoint)
        .subscribe({
          next: (resp: any) => {
            if (resp?.status !== 'UPDATED') {
              this.notificationService.error(
                'Error al Guardar Contacte al Administrador del Sistema',
              );
              return;
            }

            this.skipDisableOnValueChange = true;

            this.unsavedChangesService.setUnsavedChanges(false);
            (this.onboardingService as any).btnConfirmDataDisabled.set(false);

            this.update(); 

            setTimeout(() => {
              this.skipDisableOnValueChange = false;
            }, 0);
          },
          error: (err: any) => {
            console.log(err);
          },
        });
    } else {
      const mappedData = mapToCheckPointFiscalSelfDeclarationData(resultData);

      this.checkpointService
        .saveSection('fiscal-self-declaration', mappedData)
        .subscribe((result) => {
          if (result?.status === 'CREATED') {
            this.fiscalSelfDeclarationDataService.setItem(resultData);

            this.dataAutoCertification = {
              ...this.dataAutoCertification!,
              mexicoResident: resultData.mexicoResident,
              fiscalResidenceAbroad: resultData.fiscalResidenceAbroad,
              facta: resultData.facta,
              crs: resultData.crs as any,
              fiscalResidences: resultData.fiscalResidences as any[],
              name: resultData.name,
              fiscalRegimeId: resultData.fiscalRegimeId,
              cfdiUse: resultData.cfdiUse,
              taxPostalCode: resultData.taxPostalCode,
            };

            this.unsavedChangesService.setUnsavedChanges(false);
            (this.onboardingService as any).btnConfirmDataDisabled.set(false);

            this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
          } else {
            this.notificationService.error(
              'Error al Guardar Contacte al Administrador del Sistema',
            );
          }
        });
    }
  }

  private buildAutoCertification(savedData: any): CustomerClientTaxData {
    return {
      mexicoResident: savedData.mexicoResident ?? false,
      curp: this.dataClient?.curp ?? '',
      foreignerWithoutCurp: savedData.foreignerWithoutCurp ?? this.dataClient?.foreignerWithoutCurp,
      rfc: this.dataClient?.rfc ?? '',
      name:
        savedData.name ??
        concatFullName(
          this.dataClient?.firstName,
          this.dataClient?.middleName,
          this.dataClient?.firstLastName,
          this.dataClient?.secondLastName,
        ),
      fiscalRegimeId: savedData.fiscalRegimeId ?? 0,
      cfdiUsageId: savedData.cfdiUse ?? '',
      cfdiUse: savedData.cfdiUse ?? '',
      taxPostalCode: savedData.taxPostalCode ?? '',
      nationality: savedData.nationality ?? this.dataClient?.nationality,
      country: savedData.country ?? this.dataClient?.countryOfBirth,
      fiscalResidenceAbroad: savedData.fiscalResidenceAbroad ?? false,
      facta: savedData.facta ?? false,
      crs: savedData.crs ?? false,
      fiscalResidences: savedData.fiscalResidences ?? [],
    };
  }

  async update() {
    this.checkpointService.getSectionsByCustomer().subscribe({
      next: async (response: any) => {
        await this.onboardingService.getCustomerInfo(response);

        const savedData = this.fiscalSelfDeclarationDataService.getItem();

        if (savedData) {
          this.dataAutoCertification = this.buildAutoCertification(savedData);
        }

        this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);

        this.rolePermises = this.configDisabled;
        buttonFunctionEn(['btnEditCI']);
        butonFunctionDis(['btnSaveCI', 'btnCancelCI']);
      },
      error: () => {},
    });
  }
}
