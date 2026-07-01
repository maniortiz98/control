import { concatFullName } from '../../../shared/utils/string';
import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { FirstDataClientService } from '../../../shared/services/storage-services/first-data-client.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { Address } from '../../models/address';
import { MatDialog } from '@angular/material/dialog';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { mapToCheckPointFiscalSelfDeclarationData } from '../../../shared/services/mapper-services/maper';
import { AutoCertificationSectionComponent } from '../../../shared/components/sections/auto-certification-section/auto-certification-section.component';
import { FiscalSelfDeclarationDataClientService } from '../../../shared/services/storage-services/fiscal-self-declaration.service';
import { ClientTaxData } from '../../models/fiscal-self-declaration-data';
import { Data } from '../../models/checkpoints/initial-data-checkpoint';
import { OnboardingService } from '../../services/onboarding.service';
import { AddressService } from '../../../shared/services/storage-services/address.service';
import { CurrentOnboardingInfo } from '../../models/current-onboarding';
import { firstValueFrom } from 'rxjs';
import { mapResToSignalFiscalSelfDeclarationM } from '../../services/mappers/maintenance/respnse/fiscal-self-declaration-mapper';
import { mapResToSignalFiscalSelfDeclaration } from '../../services/mappers/response/fiscal-self-declaration-mapper';
@Component({
  selector: 'app-tax-info',
  standalone: false,
  templateUrl: './tax-info.component.html',
  styleUrl: './tax-info.component.scss',
})
export class TaxInfoComponent {
  @ViewChild(AutoCertificationSectionComponent)
  autoCertificationDataComponent!: AutoCertificationSectionComponent;

  //Output
  @Output() formGroupEmitter = new EventEmitter<FormGroup>();

  //Inject
  private readonly fb = inject(FormBuilder);
  readonly dialog = inject(MatDialog);
  private readonly checkpointService = inject(CheckpointService);
  private readonly notificationService = inject(NotificationsService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly firstDataClientService = inject(FirstDataClientService);
  private readonly fiscalSelfDeclarationDataService = inject(
    FiscalSelfDeclarationDataClientService,
  );
  private readonly onboardingService = inject(OnboardingService);
  readonly addressService = inject(AddressService);

  // variables

  dataClient: Data | null = null;
  dataAutoCertification: ClientTaxData | null = null;
  dataAddress: Address[] | null = null;
  profileForm: FormGroup = this.fb.group({});
  private receivedFormGroup: FormGroup | undefined;

  /** Data for Maintenance */
  onboardingInfo: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
  isMaintenance: boolean = this.onboardingService.getCurrentInfo().isMaintenance;
  /** */

  //Constructor
  constructor() {
    this.dataAddress = this.addressService.getAll();
    let cpf = '';
    if (this.dataAddress && this.dataAddress[0] && this.dataAddress[0].taxPostalCode) {
      cpf = this.dataAddress[0].taxPostalCode;
    }
    document.body.classList.remove('show-validation');
    if (this.isMaintenance) {
      this.dataAutoCertification =
        this.fiscalSelfDeclarationDataService.getItem() as unknown as ClientTaxData;
    } else {
      this.dataClient = this.firstDataClientService.getItem();
    }
    if (!this.dataClient) {
      return;
    }
    console.log(this.dataClient);
    // EJEMPLO DE CARGA DE DATA
    const savedData = this.fiscalSelfDeclarationDataService.getItem();
    if (savedData) {
      this.dataAutoCertification = {
        mexicoResident: savedData.mexicoResident ?? false,
        curp: this.dataClient.curp,
        foreignerWithoutCurp:
          savedData.foreignerWithoutCurp ?? this.dataClient.foreignerWithoutCurp,
        rfc: this.dataClient?.rfc,
        name: savedData.name ?? concatFullName(this.dataClient?.firstName, this.dataClient?.middleName, this.dataClient?.firstLastName, this.dataClient?.secondLastName),
        fiscalRegimeId: savedData.fiscalRegimeId ?? 0,
        cfdiUsageId: savedData.cfdiUse ?? '',
        cfdiUse: savedData.cfdiUse ?? '',
        taxPostalCode: savedData.taxPostalCode ?? cpf,
        nationality: savedData.nationality ?? this.dataClient?.nationality,
        country: savedData.country ?? this.dataClient.countryOfBirth,
        fiscalResidenceAbroad: savedData.fiscalResidenceAbroad ?? false,
        facta: savedData.facta ?? false,
        crs: savedData.crs ?? false,
        fiscalResidences: (savedData.fiscalResidences as any[]) ?? [],
      };
    } else {
      this.dataAutoCertification = {
        mexicoResident: false,
        curp: this.dataClient.curp,
        foreignerWithoutCurp: this.dataClient.foreignerWithoutCurp,
        rfc: this.dataClient?.rfc,
        name: concatFullName(this.dataClient?.firstName, this.dataClient?.middleName, this.dataClient?.firstLastName, this.dataClient?.secondLastName),
        fiscalRegimeId: 0,
        cfdiUsageId: '',
        taxPostalCode: cpf,
        nationality: this.dataClient?.nationality,
        country: this.dataClient.countryOfBirth,
        fiscalResidenceAbroad: false,
        facta: false,
        crs: false,
        fiscalResidences: [
          /* {
          personType: 'TITULAR',
          country: 'US',
          declarationFiscalResidence: true,
          proofOfAddressType: 'Luz',
          issueDate: 'N/A',
          expirationStatus: 'VIGENTE',
          expirationDate: 'N/A',
          certificationDate: '2025-10-09T06:00:00.000Z',
          declarationYear: 2323,
          aditionalDays: '25',
          factaObligations: {
            autentication: 'ID Fiscal Extranjero (NIF / TIN / NSS)',
            nss: '1231231231231',
            tin: '836293750',
          },
          activeFiscalDomicilie: false,
        },
        {
          personType: 1,
          country: 'MX',
          declarationFiscalResidence: true,
          proofOfAddressType: '',
          issueDate: '',
          expirationStatus: '',
          expirationDate: '',
          certificationDate: '',
          declarationYear: 2323,
          aditionalDays: '',
          factaObligations: {
            autentication: '',
            nss: '0',
            tin: '',
          },
          activeFiscalDomicilie: true,
        },
        */
        ],
      };
    }
  }

  isNotEmpty(obj: any) {
    return Object.keys(obj).length > 0;
  }

  isEmptyObject(obj: any): boolean {
    return obj && typeof obj === 'object' && Object.keys(obj).length === 0;
  }

  async onSubmit() {
    document.body.classList.add('show-validation');

    const resultData = await this.autoCertificationDataComponent.onSubmit();
    if (resultData == null) {
      return;
    }

    this.unsavedChangesService.setUnsavedChanges(false);

    const mappedData = mapToCheckPointFiscalSelfDeclarationData(resultData);

    const save$ = this.isMaintenance
      ? this.checkpointService.saveSectionMant('fiscal-self-declaration', mappedData)
      : this.checkpointService.saveSection('fiscal-self-declaration', mappedData);

    const result = await firstValueFrom(save$);

    if (result?.status === 'CREATED') {
      await this.reloadFiscalSelfDeclaration();

      this.unsavedChangesService.setUnsavedChanges(false);
      this.notificationService.success('Guardado con éxito');
    }
  }

  private async reloadFiscalSelfDeclaration(): Promise<void> {
    const currentOnboarding = this.onboardingService.getCurrentInfo();

    const obs$ = currentOnboarding.isMaintenance
      ? this.checkpointService.getMaintenanceSectionByPersonaFisica(['fiscal-self-declaration'])
      : this.checkpointService.getSection(['fiscal-self-declaration']);

    const response = await firstValueFrom(obs$);

    const mappedData = currentOnboarding.isMaintenance
      ? mapResToSignalFiscalSelfDeclarationM(response['checkpoints'][0]['data'])
      : mapResToSignalFiscalSelfDeclaration(response['checkpoints'][0]['data']);

    this.fiscalSelfDeclarationDataService.setItem(mappedData);
    this.dataAutoCertification = mappedData as any;
  }
}
