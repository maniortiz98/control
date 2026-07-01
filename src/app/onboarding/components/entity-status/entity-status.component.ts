import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { Countries } from '../../models/country';
import { STRINGS } from '../../constants/constants';
import { MatSelectChange } from '@angular/material/select';
import { MatRadioChange } from '@angular/material/radio';
import { Nationalities } from '../../models/nationality';
import { ColumnsDataTable, ConfigDataTable } from '../../../shared/components/table-results/interfaces';
import { CountryWithFiscalObligation } from '../../models/CountryWithFiscalObligation';
import { ERROR_MESSAGES, NOTIFICATION_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
import { FiscalResidencePmModalComponent } from './fiscal-residence-pm-modal/fiscal-residence-pm-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom, Observable } from 'rxjs';
import { HieraticLevel } from '../../models/hieratic-level';
import { EntityStatusSection } from '../../models/entity-status';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { ControlPersonModalComponent } from './control-person-modal/control-person-modal.component';
import { FullPersonControl, SelectedPerson } from '../../models/person-control';
import { FiscalResidencesData } from '../../models/checkpoints/fiscal-self-declaration-checkpoint';
import { Router } from '@angular/router';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { EntityStatusService } from '../../../shared/services/storage-services/pm/entity-status.service';
import { butonFunctionDis, buttonFunctionEn } from '../../../shared/utils/disableOrEnabled';
import { OnboardingService } from '../../services/onboarding.service';
import { PermissionRolService } from '../../../core/services/rol.service';
import { CustomerIdentificationPmService } from '../../../shared/services/storage-services/pm/customer-identification-pm.service';
import { RealOwnerPmService } from '../../../shared/services/storage-services/pm/real-owner-pm.service';
import { AdministratorExercisingPfControlService } from '../../../shared/services/storage-services/pm/administrator-exercising-pf-control.service';


@Component({
  selector: 'app-entity-status',
  standalone: false,
  templateUrl: './entity-status.component.html',
  styleUrl: './entity-status.component.scss'
})
export class EntityStatusComponent {

  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationsService);
  private readonly catalogsService = inject(CatalogsService);
  private readonly dialog = inject(MatDialog);
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly router = inject(Router);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly checkpoint = inject(CheckpointService);
  private readonly storageService = inject(EntityStatusService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly roleService = inject(PermissionRolService);
  private readonly realOwnerPmStorage = inject(RealOwnerPmService);
  private readonly controlAdmonStorage = inject(AdministratorExercisingPfControlService)


  fiscalResidenceData = signal<CountryWithFiscalObligation[]>([]);
  fiscalResidenceColumns: Array<ColumnsDataTable> = [];
  fiscalResidenceConfigs: ConfigDataTable = { showPag: false, showEditAction: true, showDeleteAction: true, showViewAction: false, multipleSelection: false };

  personData = signal<SelectedPerson[]>([]);
  personColumns: Array<ColumnsDataTable> = [];
  personConfigs: ConfigDataTable = { showPag: false, showEditAction: true, showDeleteAction: true, showViewAction: false, multipleSelection: false };

  registerNumber: number = 1
  isMaintenance: boolean = false;
  isNotEditableFC: boolean = false;
  isNotEditableCP: boolean = false;

  entityStatusSection: EntityStatusSection = {
    fiscalResidences: [],
    selectedPersons: [],
  }

  form: FormGroup = this.fb.group({

    rfc: ['', Validators.required],
    nationality: ['', Validators.required],
    hasResidenceInMexico: [''],
    hasOutlaterFiscalResidence: [''],

    fatcaClasificationType: ['', Validators.required],
    fatcaClasificationText: [''],
    factaClasificationGiin: [''],

    crsClasificationType: ['', Validators.required],
    crsClasificationText: [''],


  });

  countries = signal<Array<Countries>>([]);
  nationalities = signal<Array<Nationalities>>([]);
  messageType: string = '';

  ngOnInit() {
    this.isMaintenance = this.onboardingService.getCurrentInfo().isMaintenance;
    this.subscribeConditionalValidators();

    this.form.valueChanges.subscribe(() => {
      this.unsavedChangesService.setUnsavedChanges(this.form.dirty);
    });

    this.catalogsService.getCountry({ land: [] }).subscribe(c => {
      this.countries.set(c);
    });
    this.catalogsService.getNationalities({ land: [] }).subscribe(c => {
      this.nationalities.set(c);
    });
    this.fiscalResidenceColumns = [
      { name: 'registerNumber', title: 'Registro No.', show: true, type: 'string' },
      { name: 'fiscalResidence', title: 'Residencia Fiscal', show: true, type: 'string' },
      { name: 'ein', title: 'EIN', show: true, type: 'string' },
      { name: 'tin', title: 'TIN', show: true, type: 'string' },
      { name: 'nss', title: 'NSS', show: true, type: 'string' }
    ]

    this.personColumns = [
      { name: 'personType', title: 'Tipo de Persona', show: true, type: 'string' },
      { name: 'firstName', title: 'Primer Nombre', show: true, type: 'string' },
      { name: 'secondName', title: 'Segundo Nombre', show: true, type: 'string' },
      { name: 'firstLastName', title: 'Primer Apellido', show: true, type: 'string' },
      { name: 'secondLastName', title: 'Segundo Apellido', show: true, type: 'string' },
      { name: 'nationalityName', title: 'Nacionalidad', show: true, type: 'string' },
    ]

    const initalData = this.storageService.entityStatusPm();

    console.log(initalData)
    if (initalData != null) {
      this.chargeInitialInfo(initalData)
    }

    const realOwner = this.realOwnerPmStorage.realOwnerPm();
    if (!realOwner) {
      this.messageType = 'warning';
    } else {
      this.showInfoNotification();
      this.messageType = 'info';
    }
    this.manageMexicoResidence();
  }

  onSubmit() {

    if (this.form.valid) {
      console.log('valid');

      this.entityStatusSection.rfc = this.form.value.rfc;
      this.entityStatusSection.nationality = this.form.value.nationality;
      this.entityStatusSection.hasResidenceInMexico = this.form.value.hasResidenceInMexico;
      this.entityStatusSection.hasOutlaterFiscalResidence = this.form.value.hasOutlaterFiscalResidence;
      this.entityStatusSection.fatcaClasificationType = this.form.value.fatcaClasificationType;
      this.entityStatusSection.fatcaClasificationText = this.form.value.fatcaClasificationText;
      this.entityStatusSection.factaClasificationGiin = this.form.value.factaClasificationGiin;
      this.entityStatusSection.crsClasificationType = this.form.value.crsClasificationType;
      this.entityStatusSection.crsClasificationText = this.form.value.crsClasificationText;

      const requestCheckpoint = this.entityStatusSection;

      console.log('salvando')
      console.log(requestCheckpoint);
      // this.checkpoint.saveCheckpoint('saveCheckpoint', requestCheckpoint).subscribe({
      //   next: (i) => {
      //     this.unsavedChangesService.setUnsavedChanges(false)
      //     this.storageService.setEntityStatusPm(requestCheckpoint);
      //     this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
      //   },
      //   error: (err) => {
      //     this.notificationService.error(ERROR_MESSAGES.SAVE_CHECKPOINT_ERROR);
      //   }
      // });


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

  ngAfterViewInit() {
    if (this.isMaintenance) {
      this.form.disable();
      butonFunctionDis(['btnCancelEE', 'btnSaveEE', 'addFR', 'addCPM']);
      const allPermises = this.roleService.getPermissions();
      console.log({ allPermises })
      var cantEdit;
      cantEdit = allPermises['entity-status']['allDisabled']
      this.fiscalResidenceConfigs = { showPag: false, showEditAction: true, showDeleteAction: false, showViewAction: false, multipleSelection: false }
      this.personConfigs = { showPag: false, showEditAction: true, showDeleteAction: false, showViewAction: false, multipleSelection: false }
      if (cantEdit) {
        butonFunctionDis(['btnEditEE']);
      } else {
        buttonFunctionEn(['btnEditEE']);
      }
      this.isNotEditableFC = true;
      this.isNotEditableCP = true;
    }
  }

  onFatcaClasificationChange(event: MatRadioChange) {
    this.form.get('fatcaClasificationType')?.setValue(event.value);
  }

  onCrsClasificationChange(event: MatRadioChange) {
    this.form.get('crsClasificationType')?.setValue(event.value);
    this.showInfoNotification();
  }



  async showFiscalResidenceModal() {
    console.log('agregando')
    const responseModal = await firstValueFrom(this.callFiscalResidencePmModal(this.registerNumber, this.isNotEditableFC));
    console.log(responseModal)
    if (responseModal != undefined) {
      const newLine: CountryWithFiscalObligation = {
        id: responseModal.id,
        registerNumber: responseModal.registerNumber,
        fiscalResidence: responseModal.fiscalResidence,
        fiscalResidenceId: responseModal.fiscalResidenceId,
        ein: responseModal.ein,
        tin: responseModal.tin,
        nss: responseModal.nss,
      }
      this.fiscalResidenceData.update((list => [...list, newLine]))
      this.entityStatusSection.fiscalResidences = this.fiscalResidenceData();
      this.setDefaultFacta();
      this.registerNumber++;
    }
  }

  async showControlPersonModal() {
    console.log('agregando')
    const responseModal = await firstValueFrom(this.callControlPersonModal(this.isNotEditableCP));

    console.log(responseModal)
    console.log('agregando a la lista')
    console.log(this.personData())
    if (responseModal != undefined) {
      const newLine: SelectedPerson = responseModal;
      this.personData.update((list => [...list, newLine]))
      this.entityStatusSection.selectedPersons = this.personData();
    }
    console.log('luego de agregar')
    console.log(this.personData())
  }

  async eventControlPerson(event: any) {
    if (event.type === 'edit') {
      this.notificationService.info(NOTIFICATION_MESSAGES.NOT_EDITABLE_FIELDS,
        'Para editar la información debe dirigirse a la sección “Administrador que ejerce el control”')
    }
    if (event.type === 'delete') {
      const result = await this.notificationModalService.confirm({
        title: NOTIFICATION_MESSAGES.DELETE_CONFIRMATION_MESSAGE,
        btnAccept: 'Sí, Eliminar',
        btnDeny: 'No',
      });
      if (result?.value === true) {
        const itemToDelete = event.row
        this.personData.update(list => list.filter(item => item.id != itemToDelete.id))
        this.entityStatusSection.selectedPersons = this.personData();
      }
    }
  }




  async eventRowFiscalResidence(event: any) {
    if (event.type === 'edit') {
      await this.editFiscalResidence(event);
    }
    if (event.type === 'delete') {
      await this.deleteFiscalResidence(event);
    }
  }

  async editFiscalResidence(event: any) {
    const itemToEdit = event.row;
    const responseModal = await firstValueFrom(this.callFiscalResidencePmModal(itemToEdit.registerNumber, this.isNotEditableFC, itemToEdit));
    if (responseModal != undefined) {
      const editedItem: CountryWithFiscalObligation = {
        id: responseModal.id,
        registerNumber: responseModal.registerNumber,
        fiscalResidence: responseModal.fiscalResidence,
        fiscalResidenceId: responseModal.fiscalResidenceId,
        ein: responseModal.ein,
        tin: responseModal.tin,
        nss: responseModal.nss,
      }
      this.fiscalResidenceData.update(list =>
        list.map(item =>
          item.id === editedItem.id ? editedItem : item
        )
      );
      this.entityStatusSection.fiscalResidences = this.fiscalResidenceData();
      this.setDefaultFacta();
    }
  }

  async deleteFiscalResidence(event: any) {
    const result = await this.notificationModalService.confirm({
      title: NOTIFICATION_MESSAGES.DELETE_CONFIRMATION_MESSAGE,
      btnAccept: 'Sí, Eliminar',
      btnDeny: 'No',
    });
    if (result?.value === true) {
      const itemToDelete = event.row
      this.fiscalResidenceData.update(list => list.filter(item => item.id != itemToDelete.id))
      this.entityStatusSection.fiscalResidences = this.fiscalResidenceData();
    }
  }


  closeNotification() {
    this.messageType = '';
  }

  redirect() {
    if (this.messageType === 'info') {
      this.router.navigate(['/onboarding/new-customer/administrator-exercising-pf-control']);
      this.notificationService.info('Sección en Construcción');
    } else {
      this.router.navigate(['/onboarding/new-customer/real-owner-pm']);
      this.notificationService.info('Sección en Construcción');
    }
  }

  setDefaultFacta() {
    console.log(this.fiscalResidenceData())
    if (this.fiscalResidenceData().filter(c => c.fiscalResidenceId == 'US ').length > 0) {
      this.form.patchValue({
        fatcaClasificationType: '1'
      })
    }
  }

  setDefaultCrs(event: MatRadioChange) {
    const value = event.value;
    let crsValue = this.form.value.crsClasificationType;
    switch (value) {
      case '2':
        crsValue = '1';
        break;
      case '3':
        crsValue = '2';
        break;
      case '4':
        crsValue = '3';
        break;
      case '10':
        crsValue = '5';
        break;
    }
    this.form.patchValue({
      crsClasificationType: crsValue
    });
    this.showInfoNotification();
  }

  showInfoNotification() {
    if (this.form.value.crsClasificationType == '2') {
      this.messageType = 'info';
    } else {
      this.messageType = '';
    }
  }

  diabledAddFiscalResidence: boolean = true;
  requiredOulaterResidence: boolean = false;

  manageAddFiscalResidence() {
    if (this.form.value.hasOutlaterFiscalResidence && !this.isMaintenance) {
      this.diabledAddFiscalResidence = false
    } else {
      this.diabledAddFiscalResidence = true
    }
  }

  manageMexicoResidence() {
    if (!this.form.value.hasResidenceInMexico) {
      this.requiredOulaterResidence = true
    } else {
      this.requiredOulaterResidence = false
    }
  }



  private callFiscalResidencePmModal(registerNumber: number, isNotEditable: boolean, content?: CountryWithFiscalObligation):
    Observable<CountryWithFiscalObligation | undefined> {
    const dialogRef = this.dialog.open(FiscalResidencePmModalComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '80vw',
      height: '35vh',
      data: {
        content,
        registerNumber,
        isNotEditable: isNotEditable
      }
    });
    return dialogRef.afterClosed();
  }

  private setConditionalValidator(controlName: string, dependentControlName: string, condition: (value: any) => boolean, validators: any[]) {
    this.form.get(dependentControlName)?.setValidators(() => {
      const dependentControl = this.form.get(dependentControlName);
      const value = this.form.get(controlName)?.value;
      return condition(value) ? validators : null;
    });
    this.form.get(dependentControlName)?.updateValueAndValidity();
  }

  private subscribeConditionalValidators() {
    const watchControls = [
      { control: 'fatcaClasificationType', dependent: 'fatcaClasificationText', condition: (v: any) => v === '11', validators: [Validators.required] },
      { control: 'fatcaClasificationType', dependent: 'factaClasificationGiin', condition: (v: any) => ['4', '7', '8'].includes(v), validators: [Validators.required] },
      { control: 'crsClasificationType', dependent: 'crsClasificationText', condition: (v: any) => v === '6', validators: [Validators.required] },
      { control: 'hasResidenceInMexico', dependent: 'hasOutlaterFiscalResidence', condition: (v: any) => v === 'no', validators: [Validators.required] },
    ];

    watchControls.forEach(({ control, dependent, condition, validators }) => {
      this.form.get(control)?.valueChanges.subscribe(() => {
        const dependentControl = this.form.get(dependent);
        if (condition(this.form.get(control)?.value)) {
          dependentControl?.setValidators(validators);
        } else {
          dependentControl?.clearValidators();
          dependentControl?.setValue(''); // opcional limpiar
        }
        dependentControl?.updateValueAndValidity();
      });
    });
  }

  private callControlPersonModal(isNotEditable: boolean):
    Observable<SelectedPerson | undefined> {
    const content = this.controlAdmonStorage.get()?.client;
      console.log({content})
    const dialogRef = this.dialog.open(ControlPersonModalComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '80vw',
      height: '90vh',
      data: {
        content,
        isNotEditable: isNotEditable
      }
    });
    return dialogRef.afterClosed();
  }

  editt() {
    butonFunctionDis(['btnEditEE']);
    buttonFunctionEn(['btnSaveEE', 'btnCancelEE']);

    const allPermises = this.roleService.getPermissions();
    if (!allPermises['entity-status']['sections']['fiscal-countries']['allDisabled']) {
      this.form.get('rfc')?.enable();
      this.form.get('nationality')?.enable();
      this.form.get('hasResidenceInMexico')?.enable();
      this.form.get('hasOutlaterFiscalResidence')?.enable();
      this.isNotEditableFC = false;
      //buttonFunctionEn(['addFR']);
    }
    if (!allPermises['entity-status']['sections']['facta']['allDisabled']) {
      this.form.get('fatcaClasificationText')?.enable();
      this.form.get('factaClasificationGiin')?.enable();
      this.form.get('fatcaClasificationType')?.enable();
    }
    if (!allPermises['entity-status']['sections']['crs']['allDisabled']) {
      this.form.get('crsClasificationType')?.enable();
      this.form.get('crsClasificationText')?.enable();;
    }

    if (!allPermises['entity-status']['sections']['person-control']['allDisabled']) {
      buttonFunctionEn(['addCPM']);
      this.isNotEditableFC = false;
    }
    console.log('permises')
  }

  cancel() {
    buttonFunctionEn(['btnEditEE']);
    butonFunctionDis(['btnSaveEE', 'btnCancelEE', 'addFR', 'addCPM']);
    this.form.disable();

    const initialData = this.storageService.entityStatusPm();
    if (initialData) {
      this.chargeInitialInfo(initialData);
    } else {
      this.form.reset();

    }
  }

  chargeInitialInfo(initialData: EntityStatusSection) {
    console.log('cargando')
    console.log(initialData);
    this.entityStatusSection = initialData;
    this.fiscalResidenceData.set(initialData.fiscalResidences);
    this.personData.set(initialData.selectedPersons)
    this.form.patchValue({
      rfc: initialData.rfc,
      nationality: initialData.nationality,
      hasResidenceInMexico: initialData.hasResidenceInMexico,
      hasOutlaterFiscalResidence: initialData.hasOutlaterFiscalResidence,

      fatcaClasificationType: initialData.fatcaClasificationType,
      fatcaClasificationText: initialData.fatcaClasificationText,
      factaClasificationGiin: initialData.factaClasificationGiin,
      crsClasificationType: initialData.crsClasificationType,
      crsClasificationText: initialData.crsClasificationText,
    })
  }
}
