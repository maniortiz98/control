import { Component, inject, signal } from '@angular/core';
import { ColumnsDataTable, ConfigDataTable } from '../../../shared/components/table-results/interfaces';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { emptyField } from '../../../shared/utils/form';
import { ERROR_MESSAGES, NOTIFICATION_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
import { Directorate, DirectoratePageData } from '../../models/directorate';
import { StrTempId } from '../../../shared/utils/string';
import { STRINGS } from '../../constants/constants';
import { DirectorateCheckpoint } from '../../models/checkpoints/directorate-checkpoint';
import { directorateMapToCheckpoint } from '../../services/mappers/directorate-mapper';
import { DirectorateSignalService } from '../../services/checkpoint/directorate-signal.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { OnboardingService } from '../../services/onboarding.service';
import { PermissionRolService } from '../../../core/services/rol.service';
import { CurrentOnboardingInfo } from '../../models/current-onboarding';

@Component({
  selector: 'app-directorate',
  standalone: false,
  templateUrl: './directorate.component.html',
  styleUrl: './directorate.component.scss'
})
export class DirectorateComponent {

  directoratePageData = signal<DirectoratePageData>({
    data: [],
    table: []
  });

  // TODO validar al inicio, si hay registros guardado, validar si puede agregar o no, dependiendo del tipo.

  private readonly formBuilder              = inject(FormBuilder);
  private readonly modalService             = inject(NotificationModalService);
  private readonly notifService             = inject(NotificationsService);
  private readonly directorateSignalService = inject(DirectorateSignalService);
  private readonly unsavedService           = inject(UnsavedChangesService);
  private readonly onboardingService        = inject(OnboardingService);
  private readonly permissionService      = inject(PermissionRolService);

  tableCols: ColumnsDataTable[] = [
    { name: 'adminType',       title: 'Tipo de Administrador', show: true, type: 'string' },
    { name: 'firstName',       title: 'Primer Nombre',         show: true, type: 'string' },
    { name: 'secondFirstName', title: 'Segundo Nombre',        show: true, type: 'string' },
    { name: 'lastName',        title: 'Primer Apellido',       show: true, type: 'string' },
    { name: 'secondLastName',  title: 'Segundo Apellido',      show: true, type: 'string' },
    { name: 'position',        title: 'Cargo',                 show: true, type: 'string' },
  ];
  tableConfig: ConfigDataTable = {
    showPag: false,
    showViewAction: false,
    showEditAction: true,
    showDeleteAction: true,
    multipleSelection: false,
    idName: 'tempId'
  };

  form: FormGroup = this.formBuilder.nonNullable.group({
    adminType      : new FormControl('', {validators: [Validators.required]} ),
    firstName      : new FormControl('', {validators: [Validators.required]} ),
    secondFirstName: new FormControl('', {} ),
    lastName       : new FormControl('', {} ),
    secondLastName : new FormControl('', {} ),
    position       : new FormControl('', {validators: [Validators.required]} ),
  });

  disableUnique = false;
  disableCouncil = false;
  disableSave = false;

  isEditting = false;
  edittingId = '';

  onboardingInfo: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
  isMaintenance = signal<boolean>(this.onboardingService.getCurrentInfo().isMaintenance);
  permissions = this.permissionService.getPermissions()?.['directorate'];
  disButtons = {
    edit    : false,
    register: false,
    save    : false,
    cancel  : false,
  };
  canAdd    = this.permissions.permission.includes('add');
  canEdit   = this.permissions.permission.includes('edit');
  canDelete = this.permissions.permission.includes('delete');

  constructor() {
    document.body.classList.remove('show-validation');
  }

  /**
   * On Init
   */
  ngOnInit(): void {
    this.notifService.info('Registra a los Integrantes del Consejo de Administración.');
    this.directoratePageData.set(this.directorateSignalService.getData());
    /*
    this.directoratePageData.set({
        "data": [
            {
                "adminType": "2",
                "firstName": "AAA",
                "secondFirstName": "SSSS",
                "lastName": "SSSS",
                "secondLastName": "AAAA",
                "position": "ASDFASDFASDF",
                "tempId": "4a21b778-42a5-4006-bf8d-ee4ba767da5d"
            },
            {
                "adminType": "2",
                "firstName": "WERWER",
                "secondFirstName": "SDFSDF",
                "lastName": "WERWER",
                "secondLastName": "QWER",
                "position": "DSFAFSD",
                "tempId": "1b838f78-bf3e-420f-82d0-dc6251892785"
            }
        ],
        "table": [
            {
                "adminType": "2",
                "firstName": "AAA",
                "secondFirstName": "SSSS",
                "lastName": "SSSS",
                "secondLastName": "AAAA",
                "position": "ASDFASDFASDF",
                "tempId": "4a21b778-42a5-4006-bf8d-ee4ba767da5d"
            },
            {
                "adminType": "2",
                "firstName": "WERWER",
                "secondFirstName": "SDFSDF",
                "lastName": "WERWER",
                "secondLastName": "QWER",
                "position": "DSFAFSD",
                "tempId": "1b838f78-bf3e-420f-82d0-dc6251892785"
            }
        ]
    });
    */

    this.form.valueChanges.subscribe((values: any) => {
      this.unsavedService.setUnsavedChanges(true);
    });

    this.validateAdminType();

    if ( this.isMaintenance() ) {
      console.log(this.permissions);
      this.initializeMaintenance();
    }
    console.log("can add? : %s", this.canAdd);
    console.log("can edit? : %s", this.canEdit);
  }

  /**
   * Event triggered from Table Results actions.
   */
  eventRow(event: {type: string, row: any}): void {
    if ( STRINGS.DELETE === event.type ) {
      this.modalService.confirm({
        title: NOTIFICATION_MESSAGES.DELETE_QUESTION_MESSAGE,
        btnAccept: 'Si, Eliminar.',
        btnDeny: 'No'
      }).then((res: { value: boolean; message?: string } | undefined) => {
        if ( res && res.value ) {
          this.unsavedService.setUnsavedChanges(true);
          this.directoratePageData.update(current => ({
            ...current,
            data: current.data.filter(item => item.tempId != event.row.tempId),
            table: current.table.filter(item => item.tempId != event.row.tempId)
          }));
          this.notifService.success(SUCCESS_MESSAGES.ITEM_DELETED);
          this.validateAdminType();
        }
      });
    } else {
      this.isEditting = true;
      this.edittingId = event.row.tempId;
      this.form.patchValue(event.row);
    }
  }

  /**
   * Event when adding new item. Saves or Edits
   */
  register(): any {
    document.body.classList.add('show-validation');

    if ( emptyField(this.form) ) {
      this.notifService.error(ERROR_MESSAGES.REQUIRED_FIELDS);
      return;
    }

    if ( this.invalidAtLeastOneLastName() ) {
      this.notifService.error(ERROR_MESSAGES.REQUIRED_FIELDS);
      return;
    }

    if ( this.isEditting ) {
      this.updateItem(this.form.value);
    } else {
      this.saveItem(this.form.value);
    }

    this.unsavedService.setUnsavedChanges(true);
    this.validateAdminType();
    this.form.reset();
  }

  /**
   * Event to cancel editting.
   */
  cancel(): void {
    this.isEditting = false;
    this.edittingId = '';
    this.form.reset();
  }

  /**
   * Updates an existing row on the current page data signal object.
   */
  updateItem(data: Directorate): void {
    const tableData = { ...data };
    tableData.adminType = tableData.adminType === '1' ? 'Administrador Único' : 'Consejo de Administración';

    this.directoratePageData.update((direc: DirectoratePageData) => ({
      ...direc,
      data: direc.data.map((person: Directorate) =>
        person.tempId === this.edittingId ? { ...person, ...data } : person
      ),

      table: direc.table.map((row: Directorate) =>
        row.tempId === this.edittingId ? { ...row, ...tableData} : row
      )
    }));

    this.cancel();
  }

  /**
   * Method to save new item on current page data signal objetc.
   */
  saveItem(data: Directorate): void {
    const tempId = {
      tempId: StrTempId()
    };

    const newdata = {...data, ...tempId};
    const tableData = { ...data, ...tempId };
    tableData.adminType = tableData.adminType === '1' ? 'Administrador Único' : 'Consejo de Administración';

    this.directoratePageData.update(item => ({
      ...item,
      data: [...item.data, newdata],
      table: [...item.table, tableData]
    }));
  }

  /**
   * validates at least one last name fulfilled.
   */
  invalidAtLeastOneLastName(): boolean {
    let invalid = false;
    const values = this.form.value;
    if ( '' === values.lastName && '' === values.secondLastName ) {
      invalid = true;
    }
    return invalid;
  }

  /**
   * Performs the "checkpoint" saves.
   */
  onSubmit(): any {
    console.log(this.directoratePageData());
    // TODO crear mapper para guardar checkpoint
    const boddy: DirectorateCheckpoint = directorateMapToCheckpoint(this.directoratePageData().data);
    console.log(boddy);

    this.directorateSignalService.setData(this.directoratePageData());

    this.notifService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
    this.unsavedService.setUnsavedChanges(false);

    // this.checkpointService.saveSection<AuthorizedPerson>('authorized-person', boddy).subscribe((resp: any) => {
    //   console.log(resp);
    //   this.checkSignalService.setData(this.authorizedPersonData());
    //   this.notifService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
    //   // this.router.navigate(['authorized-person'], {relativeTo: this.route.parent});
    // });

  }

  /**
   * Validates if allow more register more items
   */
  validateAdminType(): void {
    if ( 0 === this.directoratePageData().data.length ) {
      this.disableSave = false;
      this.disableUnique = false;
      this.disableCouncil = false;
    } else if ( '1' === this.directoratePageData().data[0].adminType) {
      this.disableSave = true;
      this.disableUnique = true;
      this.disableCouncil = true;
    } else if ( '2' === this.directoratePageData().data[0].adminType) {
      this.disableSave = false;
      this.disableUnique = true;
      this.disableCouncil = false;
    }

  }


  /**
   * Method for MAINTENANCE
   *
   * Initialize default maintenance mode. (all disabled)
   */
  initializeMaintenance(): any {

    // 1. deshaiblitar todo los forms
    this.form.disable();
    // this.addressComponent.profileForm.disable();

    // 2. deshabilitar todos los botones (configurarlos)
    this.disButtons = {
      save: true,
      register: true,
      edit: false,
      cancel: true,
    };


    this.tableConfig.showDeleteAction = this.permissions.permission.includes('delete');

  }

  /**
   * Method for MAINTENANCE
   *
   * es como regresar al estado inicial de mantenimiento.
   */
  cancelMaintenance(): any {
    this.initializeMaintenance();
  }

  /**
   * Method for MAINTENANCE
   *
   * este método se va a llamar cuando el usuario de click en "editar" de la tabla.
   */
  validateRolOnEdit(): any {
    if ( this.canEdit ) {
      this.form.enable();
    } else {
      this.form.disable();
    }
    this.disButtons.register = !this.canEdit;
  }

  /**
   * Method for MAINTENANCE
   *
   * evento al dar click en boton "editar" que aparece solamente
   * en modo Mantenimiento.
   */
  editMaintenance(): any {
    /*
    si todo está deshabilitado, se entiende que solo es modo lectura.
    y no hace nada mas.
     */
    if ( this.permissions.allDisabled ) {
      return;
    }

    this.disButtons = {
      register: false,
      cancel: false,
      save: false,
      edit: true
    };

    if ( this.canEdit ) {
      this.form.enable();
      this.disButtons.register = false;
    }

    if ( this.canAdd ) {
      this.form.enable();
      this.disButtons.register = !this.canAdd;
    }

  }

}
