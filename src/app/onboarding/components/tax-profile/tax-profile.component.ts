import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModelCatalog } from './model';
import { butonFunctionDis, buttonFunctionEn, formFunctionDis, formFunctionEn } from '../../../shared/utils/disableOrEnabled';
import { OnboardingService } from '../../services/onboarding.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { PermissionRolService } from '../../../core/services/rol.service';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { FiscalPersonType } from '../../models/fiscal-person-type';
import { FiscalPersonSubType } from '../../models/fiscal-person-subtype';
import { TaxProfileService } from '../../../shared/services/storage-services/tax-profile.service';
import { TaxProfile } from '../../models/checkpoints/maintenance/fiscal-profile';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { TaxProfileSignal } from '../../models/fiscal-profile';
import { mapToCheckpointToSignalTaxProfile, mapToSignalToCheckpointTaxProfileBank, mapToSignalToCheckpointTaxProfileHouse } from '../../services/mappers/maintenance/fiscal-profile-mapper';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-tax-profile',
  standalone: false,
  templateUrl: './tax-profile.component.html',
  styleUrl: './tax-profile.component.scss'
})
export class TaxProfileComponent implements OnInit, AfterViewInit {

  private readonly fb = inject(FormBuilder);
  private readonly onboardingService = inject(OnboardingService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly permissionRolService = inject(PermissionRolService);
  readonly catalogService = inject(CatalogsService);
  private readonly taxProfileService = inject(TaxProfileService);
  private readonly checkpointService = inject(CheckpointService);
  readonly notificationService = inject(NotificationsService);
  isMaintenance: boolean = this.onboardingService.getCurrentInfo().isMaintenance;
  isMaintenanceE = signal<boolean>(true);

  profileForm: FormGroup = this.fb.nonNullable.group({
    id: [''],
    typePerson: [''], // Conectar contrato de este campo, "no es persona fisica y moral"
    personSubclassification: [''], // Clasificacion de persona
    collectTaxes: [''],
    trust: [''],
    taxProfileCode: [''], // Datos de perfil fiscal
    taxProfileDescription: [''], // Datos de perfil fiscal
  });

  typePersonCat = signal<FiscalPersonType[]>([]);
  personSubclassificationCat = signal<FiscalPersonSubType[]>([]);
  data: TaxProfile | null = null;

  trustCat = signal<ModelCatalog[]>([{
    value: false,
    description: 'NO',
    id: 0
  }, {
    value: true,
    description: 'SI',
    id: 1
  }]);
  collectTaxesCat = signal<ModelCatalog[]>([{
    value: false,
    description: 'NO',
    id: 0
  }, {
    value: true,
    description: 'SI',
    id: 1
  }]);

  ngOnInit() {

    this.catalogService.getFiscalPersonType({
      land: []
    }).subscribe(c => {
      this.typePersonCat.set(c);
    });
    this.catalogService.getFiscalPersonSubType({
      land: []
    }).subscribe(c => {
      this.personSubclassificationCat.set(c);
    });

    this.data = this.taxProfileService.getItem();

    if (this.type === this.bank) {
      this.profileForm.patchValue({
        id: this.data?.id,
        typePerson: Number(this.data?.personTypeCve),
        collectTaxes: this.data?.collectTaxes,
        taxProfileCode: this.data?.taxProfile || '',
        taxProfileDescription: this.data?.taxProfileDescription || '',
      });
    } else if (this.type === this.brokerageHouse) {
      this.profileForm.patchValue({
        id: this.data?.id,
        typePerson: Number(this.data?.personTypeCve),
        personSubclassification: (this.data?.subPersonTypeCve),
        collectTaxes: this.data?.collectTaxes,
        trust: this.data?.trust,
      });
    }

    this.profileForm.valueChanges.subscribe(() => {
      this.unsavedChangesService.setUnsavedChanges(this.profileForm.dirty);
    });
  }

  ngAfterViewInit(): void {
    formFunctionDis(this.profileForm);
    if (!this.permissionRolService.getPermissions()['tax-profile'].allDisabled) {
      this.isMaintenanceE.set(false);
    }
  }

  bank: number = 999;
  brokerageHouse: number = 998;
  type: number = this.onboardingService.getCustomerInitialData().bankAreaTypeId;

  onSubmit() {

    let data: TaxProfileSignal = {
      id: this.profileForm.getRawValue().id,
      personTypeCve: this.profileForm.getRawValue().typePerson,
      collectTaxes: this.profileForm.getRawValue().collectTaxes,
      trust: this.profileForm.getRawValue().trust,
      subPersonTypeCve: this.profileForm.getRawValue().personSubclassification,
      taxProfile: this.profileForm.getRawValue().taxProfileCode,
      taxProfileDescription: this.profileForm.getRawValue().taxProfileDescription,
    }
    if (this.type === this.bank) {
      console.log(mapToSignalToCheckpointTaxProfileBank(data));
      console.log(mapToSignalToCheckpointTaxProfileHouse(data));
      this.checkpointService.saveSectionMant('tax-profile', mapToSignalToCheckpointTaxProfileBank(data)).subscribe(async (result) => {
        if (result['status'] === "CREATED") {
          this.unsavedChangesService.setUnsavedChanges(false);
          butonFunctionDis(['btnCancel', 'btnSave']);
          buttonFunctionEn(['btnEdit']);
          await this.update();
          this.notificationService.success('Guardado con éxito');
        }
      });
    } else if (this.type === this.brokerageHouse) {
      this.checkpointService.saveSectionMant('tax-profile', mapToSignalToCheckpointTaxProfileHouse(data)).subscribe(async (result) => {
        if (result['status'] === "CREATED") {
          this.unsavedChangesService.setUnsavedChanges(false);
          butonFunctionDis(['btnCancel', 'btnSave']);
          buttonFunctionEn(['btnEdit']);
          await this.update();
          this.notificationService.success('Guardado con éxito');
        }
      });
    }
  }

  async update(){
    const response = await firstValueFrom(this.checkpointService.getMaintenanceSectionByPersonaFisica(['tax-profile']));
    this.taxProfileService.setItem(mapToCheckpointToSignalTaxProfile(response['checkpoints'][0]['data']));        
    this.data = this.taxProfileService.getItem();

    if (this.type === this.bank) {
      this.profileForm.patchValue({
        id: this.data?.id,
        typePerson: Number(this.data?.personTypeCve),
        collectTaxes: this.data?.collectTaxes,
        taxProfileCode: this.data?.taxProfile || '',
        taxProfileDescription: this.data?.taxProfileDescription || '',
      });
    } else if (this.type === this.brokerageHouse) {
      this.profileForm.patchValue({
        id: this.data?.id,
        typePerson: Number(this.data?.personTypeCve),
        personSubclassification: (this.data?.subPersonTypeCve),
        collectTaxes: this.data?.collectTaxes,
        trust: this.data?.trust,
      });
    }
  }

  editt() {
    if (!this.permissionRolService.getPermissions()['tax-profile'].allDisabled) {
      formFunctionEn(this.profileForm, ['collectTaxes']);
      butonFunctionDis(['btnEdit']);
      buttonFunctionEn(['btnCancel', 'btnSave']);
    }
  }
  cancel() {
    this.data = this.taxProfileService.getItem();
    this.unsavedChangesService.setUnsavedChanges(false);
    if (this.type === this.bank) {
      this.profileForm.patchValue({
        id: this.data?.id,
        typePerson: Number(this.data?.personTypeCve),
        collectTaxes: this.data?.collectTaxes,
        taxProfileCode: this.data?.taxProfile || '',
        taxProfileDescription: this.data?.taxProfileDescription || '',
      });
    } else if (this.type === this.brokerageHouse) {
      this.profileForm.patchValue({
        id: this.data?.id,
        typePerson: Number(this.data?.personTypeCve),
        personSubclassification: Number(this.data?.subPersonTypeCve),
        collectTaxes: this.data?.collectTaxes,
        trust: this.data?.trust,
      });
    }
    formFunctionDis(this.profileForm);
    butonFunctionDis(['btnCancel', 'btnSave']);
    buttonFunctionEn(['btnEdit']);
  }
}
