import { Component, inject, ViewChild, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CustomerIdentificationPmComponent } from '../../../shared/components/sections/customer-identification-pm/customer-identification-pm.component';
import { CustomerIdentificationPmService } from '../../../shared/services/storage-services/pm/customer-identification-pm.service';
import { CustomerIdentificationPm } from '../../models/pm/customer-identification-pm';
import { CustomerWatchList } from '../../models/customer-watch-list';
import { AllowedValuesRfcNifTinNss, compareAndReturnRfcNifTinNss } from '../../../shared/utils/map-rfc-nif-tin-nss';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { OnboardingService } from '../../services/onboarding.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { butonFunctionDis, buttonFunctionEn, formFunctionDis, formFunctionEnAll } from '../../../shared/utils/disableOrEnabled';
import { PermissionRolService } from '../../../core/services/rol.service';

@Component({
  selector: 'app-first-data-pm',
  standalone: false,
  templateUrl: './first-data-pm.component.html',
  styleUrl: './first-data-pm.component.scss'
})
export class FirstDataPmComponent implements OnInit {
  @ViewChild(CustomerIdentificationPmComponent) customerIdentificationPmComponent!: CustomerIdentificationPmComponent;
  //Inject
  private readonly fb = inject(FormBuilder);
  private readonly customerIdentificationPmService = inject(CustomerIdentificationPmService);
  readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationsService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly permissionRolService = inject(PermissionRolService);

  isMaintenance: boolean = this.onboardingService.getCurrentInfo().isMaintenance
  isMaintenanceE = signal<boolean>(true);
  data: CustomerIdentificationPm | null = null;

  profileForm: FormGroup = this.fb.group({
  });

  ngOnInit() {
    this.data = this.customerIdentificationPmService.getItem();
  }

  ngAfterViewInit() {
    if (this.isMaintenance) {
      formFunctionDis(this.customerIdentificationPmComponent.profileForm);
      if (!this.permissionRolService.getPermissions()['customer-info-pm'].allDisabled) {
        this.isMaintenanceE.set(false);
      }
    }
  }

  editt() {
    if (this.permissionRolService.getPermissions()['customer-info-pm'].allDisabled) {
    } else {
      formFunctionEnAll(this.customerIdentificationPmComponent.profileForm);
      buttonFunctionEn(['btnCancel', 'btnSave']);
      butonFunctionDis(['btnEdit']);
    }
  }

  cancel() {
    formFunctionDis(this.customerIdentificationPmComponent.profileForm);
    this.data = this.customerIdentificationPmService.getItem();
    butonFunctionDis(['btnCancel', 'btnSave']);
    buttonFunctionEn(['btnEdit']);
  }

  onSubmit() {
    const data = this.customerIdentificationPmComponent.onSubmit();
    if (data != null) {
      data.then(result => {
        if (result !== null) {
          console.log(result);
          this.unsavedChangesService.setUnsavedChanges(false);
          this.customerIdentificationPmService.setItem(result);
          this.onboardingService.updateCurrentOnboardingInfo({
            requestId: '623DGS234'
          });
          this.onboardingService.enableTabs();
          this.notificationService.success('¡Excelente! Luis Saldivar Continua en la Siguiente Sección', 'El ID de Prospecto ha Sido Creado: 623DGS234');
        }
      });
    }
  }
}
