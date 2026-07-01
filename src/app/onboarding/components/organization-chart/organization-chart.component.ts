import { Component, inject, OnInit, signal } from '@angular/core';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnsDataTable, ConfigDataTable } from '../../../shared/components/table-results/interfaces';
import { HieraticLevel, OrganizationChartSection } from '../../models/hieratic-level';
import { firstValueFrom, Observable } from 'rxjs';
import { OrganizationChartModalComponent } from './organization-chart-modal/organization-chart-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ERROR_MESSAGES, NOTIFICATION_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { OrganizationChartService } from '../../../shared/services/storage-services/pm/organization-chart.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { butonFunctionDis, buttonFunctionEn } from '../../../shared/utils/disableOrEnabled';
import { PermissionRolService } from '../../../core/services/rol.service';
import { OnboardingService } from '../../services/onboarding.service';

@Component({
  selector: 'app-organization-chart',
  standalone: false,
  templateUrl: './organization-chart.component.html',
  styleUrl: './organization-chart.component.scss'
})
export class OrganizationChartComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationsService)
  private readonly notificationModalService = inject(NotificationModalService)
  private readonly dialog = inject(MatDialog);
  private readonly checkpoint = inject(CheckpointService);
  private readonly storageService = inject(OrganizationChartService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly roleService = inject(PermissionRolService);
  isMaintenance: boolean = false;

  form: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    secondName: [''],
    firstLastName: [''],
    secondLastName: [''],
  });

  organizationChartSection: OrganizationChartSection = {
    firstName: '',
    secondName: '',
    firstLastName: '',
    secondLastName: '',
    hieraticLevelTable: [],
  };

  hieraticLevelData = signal<HieraticLevel[]>([]);
  hieraticLevelColumns: Array<ColumnsDataTable> = [];
  hieraticLevelConfigs: ConfigDataTable = { showPag: false, showEditAction: true, showDeleteAction: true, showViewAction: false, multipleSelection: false };

  ngOnInit() {

    this.isMaintenance = this.onboardingService.getCurrentInfo().isMaintenance;
    this.hieraticLevelColumns = [
      { name: 'firstName', title: 'Primer Nombre', show: true, type: 'string' },
      { name: 'secondName', title: 'Segundo Nombre', show: true, type: 'string' },
      { name: 'firstLastName', title: 'Primer Apellido', show: true, type: 'string' },
      { name: 'secondLastName', title: 'Segundo Apellido', show: true, type: 'string' },
      { name: 'charge', title: 'Cargo', show: true, type: 'string' },
    ]

    const infoStorage = this.storageService.organizationChartSection();
    console.log('loading')
    console.log(infoStorage)
    if (infoStorage) {
      this.chargeInitialData(infoStorage);
    }
  }

  ngAfterViewInit() {
    if (this.isMaintenance) {
      this.form.disable();
      butonFunctionDis(['btnCancelOrg', 'btnSaveOrg', 'btnAddOrg']);
      const allPermises = this.roleService.getPermissions();
      console.log({ allPermises })
      var cantEdit;
      cantEdit = allPermises['organization-chart']['allDisabled']

      this.hieraticLevelConfigs = { showPag: false, showEditAction: false, showDeleteAction: false, showViewAction: false, multipleSelection: false }
      if (cantEdit) {
        butonFunctionDis(['btnEditOrg']);
      } else {
        buttonFunctionEn(['btnEditOrg']);
      }
    }
  }

  onSubmit() {
    document.body.classList.add('show-validation');

    const requiredControls = ['firstName'];
    let hasRequiredError = false;
    requiredControls.forEach(name => {
      const control = this.form.get(name);
      if (!control?.value) {
        control?.markAsTouched();
        hasRequiredError = true;
      }
    });
    if (hasRequiredError) {
      this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS);
      return;
    }

    const firstLastName = this.form.get('firstLastName');
    const secondLastName = this.form.get('secondLastName');

    if (!firstLastName?.value && !secondLastName?.value) {
      firstLastName?.setErrors({ required: true });
      secondLastName?.setErrors({ required: true });
      firstLastName?.markAsTouched();
      secondLastName?.markAsTouched();

      this.notificationService.error(ERROR_MESSAGES.AT_LEAST_ONE_LAST_NAME);
      return;
    }

    this.organizationChartSection.firstName = this.form.value.firstName;
    this.organizationChartSection.secondName = this.form.value.secondName;
    this.organizationChartSection.firstLastName = this.form.value.firstLastName;
    this.organizationChartSection.secondLastName = this.form.value.secondLastName;


    console.log(this.organizationChartSection);

    // this.checkpoint.saveCheckpoint('saveCheckpoint', this.organizationChartSection).subscribe({
    //   next: (i) => {
    //     console.log(i);
    //     this.unsavedChangesService.setUnsavedChanges(false)
    //     this.storageService.setOrganizationChartSection(this.organizationChartSection);
    //     this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
    //   },
    //   error: (err) => {
    //     console.error(err);
    //     this.notificationService.error(ERROR_MESSAGES.SAVE_CHECKPOINT_ERROR);
    //   }
    // });
  }


  async hieraticLevelEventHandeler(event: any) {
    console.log(event)
    if (event.type === 'edit') {
      await this.editHieraticLevel(event);
    }
    if (event.type === 'delete') {
      await this.deleteHieraticLevel(event);
    }
  }


  async showHieraticLevelModal() {
    console.log('agregando')
    const responseModal = await firstValueFrom(this.callHieraticLevelModal());
    if (responseModal != undefined) {
      const newLine: HieraticLevel = {
        id: responseModal.id,
        firstName: responseModal.firstName,
        secondName: responseModal.secondName,
        firstLastName: responseModal.firstLastName,
        secondLastName: responseModal.secondLastName,
        charge: responseModal.charge,
      }
      this.hieraticLevelData.update((list => [...list, newLine]))
      this.organizationChartSection.hieraticLevelTable = this.hieraticLevelData();
      this.notificationService.success(SUCCESS_MESSAGES.SAVE_ORGANIZATION_CHART_MAIN_MESSAGE, SUCCESS_MESSAGES.SAVE_ORGANIZATION_CHART_SECONDARY_MESSAGE);
    }
  }

  async editHieraticLevel(event: any) {
    const itemToEdit = event.row;
    const responseModal = await firstValueFrom(this.callHieraticLevelModal(itemToEdit));
    if (responseModal != undefined) {
      const editedItem: HieraticLevel = {
        id: responseModal.id,
        firstName: responseModal.firstName,
        secondName: responseModal.secondName,
        firstLastName: responseModal.firstLastName,
        secondLastName: responseModal.secondLastName,
        charge: responseModal.charge,
      }
      this.hieraticLevelData.update(list =>
        list.map(item =>
          item.id === editedItem.id ? editedItem : item
        )
      );
      this.organizationChartSection.hieraticLevelTable = this.hieraticLevelData();
      this.notificationService.success(SUCCESS_MESSAGES.SAVE_ORGANIZATION_CHART_MAIN_MESSAGE, SUCCESS_MESSAGES.SAVE_ORGANIZATION_CHART_SECONDARY_MESSAGE);
    }
  }

  async deleteHieraticLevel(event: any) {
    const result = await this.notificationModalService.confirm({
      title: NOTIFICATION_MESSAGES.DELETE_CONFIRMATION_MESSAGE,
      btnAccept: 'Sí, Eliminar',
      btnDeny: 'No',
    });
    if (result?.value === true) {
      const itemToDelete = event.row

      this.hieraticLevelData.update(list => list.filter(item => item.id != itemToDelete.id))

      this.organizationChartSection.hieraticLevelTable = this.hieraticLevelData();

      this.notificationService.success(
        SUCCESS_MESSAGES.DELETE_ORGANIZATION_CHART_MAIN_MESSAGE,
        SUCCESS_MESSAGES.DELETE_ORGANIZATION_CHART_SECONDARY_MESSAGE)
    }
  }

  private callHieraticLevelModal(content?: HieraticLevel):
    Observable<HieraticLevel | undefined> {
    const dialogRef = this.dialog.open(OrganizationChartModalComponent, {
      panelClass: ['hieratic-level-modal'],
      disableClose: true,
      data: {
        content,
      }
    });
    return dialogRef.afterClosed();
  }

  editt() {
    butonFunctionDis(['btnEditOrg']);
    buttonFunctionEn(['btnSaveOrg', 'btnCancelOrg']);

    const allPermises = this.roleService.getPermissions();
    if (!allPermises['organization-chart']['allDisabled']) {
      this.form.enable();
    }
    console.log('permises')
  }

  cancel() {
    buttonFunctionEn(['btnEditOrg']);
    butonFunctionDis(['btnSaveOrg', 'btnCancelOrg', 'btnAddOrg']);
    this.form.disable();

    const initialData = this.storageService.organizationChartSection();
    if (initialData) {
      this.chargeInitialData(initialData);
    } else {
      this.form.reset();
      this.hieraticLevelData.set([]);
    }
  }

  chargeInitialData(infoStorage: OrganizationChartSection) {
    this.organizationChartSection.firstName = infoStorage.firstName;
    this.organizationChartSection.secondName = infoStorage.secondName;
    this.organizationChartSection.firstLastName = infoStorage.firstLastName;
    this.organizationChartSection.secondLastName = infoStorage.secondLastName;

    this.organizationChartSection.hieraticLevelTable = [...infoStorage.hieraticLevelTable];
    this.hieraticLevelData.set(this.organizationChartSection.hieraticLevelTable);

    this.form.patchValue({
      firstName: this.organizationChartSection.firstName,
      secondName: this.organizationChartSection.secondName,
      firstLastName: this.organizationChartSection.firstLastName,
      secondLastName: this.organizationChartSection.secondLastName,
    })
  }
}
