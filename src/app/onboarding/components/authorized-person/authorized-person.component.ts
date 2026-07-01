import { Component, inject, OnInit, signal } from '@angular/core';
import { ColumnsDataTable, ConfigDataTable } from '../../../shared/components/table-results/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { AuthorizedFormModalComponent } from './authorized-form-modal/authorized-form-modal.component';
import { STRINGS } from '../../constants/constants';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { ActivatedRoute } from '@angular/router';
import { NOTIFICATION_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
import { Relationships } from '../../models/relationships';
import { EconomicActivity } from '../../models/economic-activity';
import { Occupation } from '../../models/occupation';
import { AuthorizedPersonPageData, AuthorizedPersonTableData, AuthorizedPerson, AuthorizedPersonCatalog } from '../../models/authorized-person-page-data';
import { AuthorizedPersonSignalService } from '../../services/checkpoint/authorized-persona-signal.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { AuthorizedPersonCheckpoint, AuthorizedPersonModelSaveMaint } from '../../models/checkpoints/authorized-person-checkpoint';
import { facultiesContractOptions, FacultyContractOption } from './faculties';
import * as Mapper from '../../services/mappers/authorized-person.mapper'
import { SaveCheckpointResponse } from '../../../shared/models/checkpoint';
import { OnboardingService } from '../../services/onboarding.service';
import { AddressType } from '../../models/address';
import { CurrentOnboardingInfo } from '../../models/current-onboarding';
import { PermissionRolService } from '../../../core/services/rol.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { concatMap } from 'rxjs';

interface DataModal {
    ok: boolean;
    data: AuthorizedPerson,
    table: AuthorizedPersonTableData,
    edit: boolean
};
@Component({
  selector: 'app-authorized-person',
  standalone: false,
  templateUrl: './authorized-person.component.html',
  styleUrl: './authorized-person.component.scss'
})
export class AuthorizedPersonComponent implements OnInit {

  private readonly route             = inject(ActivatedRoute);
  private readonly modalService      = inject(NotificationModalService);
  private readonly notifService      = inject(NotificationsService);
  private readonly onboardingService = inject(OnboardingService);

  private readonly checkpointService    = inject(CheckpointService);
  private readonly checkSignalService   = inject(AuthorizedPersonSignalService);
  private readonly permissionService    = inject(PermissionRolService);
  private readonly unsavedChangeService = inject(UnsavedChangesService);

  /** This property stores the whole data on this page */
  authorizedPersonData = signal<AuthorizedPersonPageData>({
    data: [],
    table: []
  });

  facultiesList: Array<FacultyContractOption> = facultiesContractOptions;
  // TODO
    // A-AS-008
    // Estas facultades deben ser pre-marcadas, obligatoriamente ambas se cumplen para este formato.

  relationshipList         = signal<Relationships[]>([]);
  economicActivityList     = signal<EconomicActivity[]>([]);
  occupationList           = signal<Occupation[]>([]);
  authorizedPersonTypeList = signal<AuthorizedPersonCatalog[]>([]);
  addressTypeList          = signal<AddressType[]>([]);

  tableCols: ColumnsDataTable[] = [
    { name: 'clientNumber', title: 'No. de Cliente',        show: true, type: 'string'   },
    // { name: 'customerNumber', title: 'No. de Cliente',        show: true, type: 'string'   }, // TODO func. 3ro relacionado.
    { name: 'rfc',          title: 'RFC / NIF / TIN / NSS', show: true, type: 'string'   },
    { name: 'address',      title: 'Domicilio',             show: true, type: 'string'   },
    { name: 'telephone',    title: 'Teléfono',              show: true, type: 'string'   },
    { name: 'privileges',   title: 'Facultad',              show: true, type: 'checkbox' },
  ];
  tableConfig: ConfigDataTable = {
    showPag: false,
    showEditAction: true,
    showDeleteAction: true,
    showViewAction: false,
    multipleSelection: false,
    idName: 'tempId',
    saveWord: 'active',
  };

  isEditting = false;
  edittingId = '';

  onboardingInfo: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
  isMaintenance = signal<boolean>(this.onboardingService.getCurrentInfo().isMaintenance);
  permissions = this.permissionService.getPermissions()?.['authorized-person'];
  disButtons = {
    edit: false,
    register: false,
    save: false,
    cancel: false,
  };

  constructor(
    private readonly dialog: MatDialog
  ) {
    if ( 'PF' === this.onboardingService.getCurrentInfo().personType ) {
      this.permissions = this.permissionService.getPermissions()?.['authorized-person'];
    } else if ( 'PM' === this.onboardingService.getCurrentInfo().personType ) {
      this.permissions = this.permissionService.getPermissions()?.['authorized-person-pm'];
    }

    this.unsavedChangeService.setUnsavedChanges(false);
    this.authorizedPersonData.set(this.checkSignalService.getData());

  }

  ngOnInit(): void {

    this.relationshipList.set(this.route.snapshot.data['relationshipResolver']);
    this.economicActivityList.set(this.route.snapshot.data['economicActivityResolver']);
    this.occupationList.set(this.route.snapshot.data['occupationResolver']);
    this.authorizedPersonTypeList.set(this.route.snapshot.data['authorizedPersonResolver']);
    this.addressTypeList.set(this.route.snapshot.data['addressTypeResolver']);

    this.initializeTableData();

    if ( this.isMaintenance() ) {
      this.initializeMaintenance();
    }

  }

  /**
   *
   */
  getFacultyOption(): FacultyContractOption | null {
    const data = {
      contractType: this.onboardingInfo.contractType,
      contractSubtype: this.onboardingInfo.contractSubtype,
      personType: this.onboardingInfo.personType
    };
    console.log(data);

    let one = null;
    for ( let idx in this.facultiesList ) {
      for ( let id in this.facultiesList[idx].relation ) {
        if (
            this.facultiesList[idx].relation[id].contractId == +data.contractType
            && this.facultiesList[idx].relation[id].subcontractId == +data.contractSubtype
            && this.facultiesList[idx].relation[id].personType.includes(data.personType as ('PF' | 'PM'))
        ) {
          one = this.facultiesList[idx];
          break;
        }
      }
    }

    return one;
  }

  /**
   * Event emmited by table results.
   * from action buttons. edit / delete
   */
  eventRow(event: {type: string, row: any}): void {
    console.log(event);
    if ( STRINGS.DELETE === event.type ) {
      this.modalService.confirm({
        title: NOTIFICATION_MESSAGES.DELETE_QUESTION_MESSAGE,
        btnAccept: 'Si, Eliminar.',
        btnDeny: 'No'
      }).then((res: { value: boolean; message?: string } | undefined) => {
        if ( res && res.value ) {

          if ( this.isMaintenance() ) {
            this.authorizedPersonData.update((ap: AuthorizedPersonPageData) => ({
              ...ap,
              data: ap.data.map((person: AuthorizedPerson) => {
                if ( person.tempId === event.row.tempId ) {
                  person.active = false;
                }
                return person;
              }),
              table: ap.table.map((row: AuthorizedPersonTableData) => {
                if ( row.tempId === event.row.tempId ) {
                  row.active = false;
                }
                return row;
              })
            }));

          } else {
            this.authorizedPersonData.update((ap: AuthorizedPersonPageData) => ({
              ...ap,
              data: ap.data.filter((person: AuthorizedPerson) =>
                person.tempId != event.row.tempId
              ),
              table: ap.table.filter((row: AuthorizedPersonTableData) =>
                row.tempId != event.row.tempId
              )
            }));
          }

          if ( 0 === this.authorizedPersonData().table.length ) {
            this.notifService.info("Necesita Registrar una Persona Autorizada.", 'U Omitir Este Paso.');
          } else {
            this.notifService.success(SUCCESS_MESSAGES.ITEM_DELETED);
          }
        }
        console.log(this.authorizedPersonData());
      });
    } else if ( STRINGS.EDIT === event.type ) {
      this.isEditting = true;
      this.edittingId = event.row['tempId'];
      const dataEdit = this.authorizedPersonData().data.find((item) => item.tempId === this.edittingId);
      console.log(dataEdit);
      this.showModal(true, dataEdit);
    }
  }

  /**
   * Click event that opens the modal
   */
  showModal(edit: boolean = false, dataToEdit: AuthorizedPerson = {} as AuthorizedPerson): void {

    let per = ['read'];
    if ( this.disButtons.edit ) {
      per = this.permissions.permission;
    }

    const data = {
      edit,
      isMaintenance: this.isMaintenance(),
      permissions: per,
      dataToEdit,
      relationshipList: this.relationshipList,
      economicActivityList: this.economicActivityList,
      occupationList: this.occupationList,
      authorizedPersonTypeList: this.authorizedPersonTypeList,
      addressTypeList: this.addressTypeList,
      facultyOption: this.getFacultyOption(),
      allPermissions: this.permissions,
    };
    const dialogRef = this.dialog.open(AuthorizedFormModalComponent, {
      maxWidth: '99%',
      height: '90%',
      data,
      disableClose: true,
      panelClass: 'panel-class'
    });

    dialogRef.afterClosed().subscribe((modalData: DataModal) => {
      console.log(modalData);
      if ( modalData.ok ) {
        if ( modalData.edit ) {
          this.editItem(modalData);
        } else {
          this.addItem(modalData);
        }
      }
    });
  }

  /**
   * This method adds the authorized person returned by modal form,
   * to the variable where the whole data section its stored.
   */
  addItem(modalData: DataModal): void {
    console.log(modalData);
    this.authorizedPersonData.update(item => ({
      ...item,
      data: [...item.data, modalData.data],
      table: [...item.table, modalData.table]
    }));

    this.unsavedChangeService.setUnsavedChanges(true);
    this.notifService.success(SUCCESS_MESSAGES.SAVE_AUTHORIZED_PERSON, SUCCESS_MESSAGES.CUSTOMER_NUMBER_CREATED);
  }

  /**
   * This method edits the correct item returned by form modal on the whole data section.
   */
  editItem(modalData: DataModal): void {

    this.authorizedPersonData.update((ap: AuthorizedPersonPageData) => ({
      ...ap,
      data: ap.data.map((person: AuthorizedPerson) =>
        person.tempId === modalData.data.tempId ? { ...person, ...modalData.data } : person
      ),
      table: ap.table.map((row: AuthorizedPersonTableData) =>
        row.tempId === modalData.table.tempId ? { ...row, ...modalData.table } : row
      )
    }));

    this.isEditting = false;

    this.unsavedChangeService.setUnsavedChanges(true);
    this.notifService.success(SUCCESS_MESSAGES.SUCCESSFUL_UPDATE);

    console.log(this.authorizedPersonData());
  }

  /**
   * Click event - Submit -
   */
  submit(): void {
    if ( this.isMaintenance() ) {
      this.saveMaintenance();
    } else {
      this.saveCheckpoint();
    }
  }

  /**
   * Saves data in Onboarding process mode.
   */
  saveCheckpoint(): void {
    const boddy: AuthorizedPersonCheckpoint = {
      authorizedPerson: Mapper.toCheckpoint(this.authorizedPersonData().data)
    };

    this.checkpointService.saveSection<AuthorizedPersonCheckpoint>('authorized-person', boddy)
    .subscribe((resp: SaveCheckpointResponse) => {
      console.log(resp);
      if ( "CREATED" === resp.status ) {
        this.checkSignalService.setData(this.authorizedPersonData());
        this.unsavedChangeService.setUnsavedChanges(false);
        this.notifService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
      }
    });
  }

  /**
   * Saves data on Maintenance mode.
   */
  saveMaintenance(): void {
    const boddy: {authorizedPerson: AuthorizedPersonModelSaveMaint[] } = {
      authorizedPerson: Mapper.authorizedPersonMapperSaveMaint(this.authorizedPersonData().data)
    };

    this.checkpointService.saveSectionMant<{authorizedPerson: AuthorizedPersonModelSaveMaint[] }>('authorized-person', boddy)
    .pipe(
      concatMap((resp: SaveCheckpointResponse) => {
        console.log(resp);
        if ( "CREATED" === resp.status ) {
          this.checkSignalService.setData(this.authorizedPersonData());
          this.unsavedChangeService.setUnsavedChanges(false);
          this.notifService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
        }
        return this.checkpointService.getMaintenanceSectionByPersonaFisica(['authorized-person']);
      })
    )
    .subscribe((response: any) => {
      this.authorizedPersonData.set(
        Mapper.authorizedPersonMapperQueryMaint(
          response?.checkpoints?.[0]?.data?.authorizedPerson
        )
      );
      this.initializeTableData();
      this.checkSignalService.setData(this.authorizedPersonData());
      this.unsavedChangeService.setUnsavedChanges(false);
      this.notifService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
    });
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
      register: !this.permissions.permission.includes('add'),
      cancel: false,
      save: false,
      edit: true
    };

  }

  /**
   * Method for MAINTENANCE
   *
   * Initialize default maintenance mode. (all disabled)
   */
  initializeMaintenance(): any {

    // 1. deshaiblitar todo los forms
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
    this.disButtons.register = !this.permissions.permission.includes('edit') || !this.permissions.permission.includes('add');
  }

  /**
   * Method for MAINTENANCE
   *
   * este método se llamaria cuando se de click en "eliminar" de la tabla.
   */
  validateRolOnDelete(): any {

  }

  /**
   * This method called when Maintenance mode.
   * Creates the datatable to be shown on the table section.
   */
  initializeTableData(): void {
    console.log(this.authorizedPersonData());

    const dd = this.authorizedPersonData().data.map((item) => {
      console.log(item);
      return {
        id          : item.id ?? null,
        rfc         : item.clientData.rfc,
        tempId      : item.tempId,
        clientNumber: item.id?.toString() ?? '',
        address     : this.getAddressName(item.addressData.addressType),
        telephone   : item.contactData?.phone ?? '',
        privileges  : item.authorizedPerson.faculty
      };
    });

    this.authorizedPersonData.update(state => ({
      ...state,
      table: dd
    }));

  }

  /**
   *
   */
  getAddressName(id: any): string {
    const address = this.addressTypeList().find((item: AddressType) => id == item.addressTypeId);
    console.log(id, address);
    return address?.addressType ?? '';
  }

}
