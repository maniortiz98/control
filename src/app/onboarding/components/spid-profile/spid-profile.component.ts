import { Component,inject, OnInit, signal } from '@angular/core';
import { SpidCounterpart, SpidProfilePageData } from '../../models/pm/spid-profile';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { ColumnsDataTable, ConfigDataTable } from '../../../shared/components/table-results/interfaces';
import { STRINGS } from '../../constants/constants';
import { ERROR_MESSAGES, NOTIFICATION_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
import { MatDialog } from '@angular/material/dialog';
import { CounterpartModalComponent } from './counterpart-modal/counterpart-modal.component';
import { EconomicActivity } from '../../models/economic-activity';
import { ActivatedRoute } from '@angular/router';
import { Bank } from '../../models/bank';
import { FormBase } from '../../../shared/utils/form-base-class';
import { SpidProfileSignalService } from '../../services/checkpoint/spid-profile-signal.service';
import { CurrentOnboardingInfo } from '../../models/current-onboarding';
import { PermissionRolService } from '../../../core/services/rol.service';
import { OnboardingService } from '../../services/onboarding.service';

interface DataModal {
    ok: boolean;
    data: SpidCounterpart,
    edit: boolean
};

@Component({
  selector: 'app-spid-profile',
  standalone: false,
  templateUrl: './spid-profile.component.html',
  styleUrl: './spid-profile.component.scss'
})
export class SpidProfileComponent extends FormBase implements OnInit {

  spidProfilePageData = signal<SpidProfilePageData>({
    data: {
      accountPurpose: '',
      fundOrigin: '',
      fundDestination: '',
      spidReceiveMonth: '',
      spidSendMonth: '',
      transactReceiveMonth: '',
      transactSendMonth: '',
      customerStock: '',
      publicEntity: '',
      creditInstitution: '',
      counterparts: []
    },
    table: []
  });
  // TODO WL y HM - no existe servicio
  private readonly NonNullformBuilder = inject(NonNullableFormBuilder);
  private readonly modalService       = inject(NotificationModalService);
  private readonly notificationService= inject(NotificationsService);
  private readonly spidProfileSignal  = inject(SpidProfileSignalService);
  private readonly unsavedService     = inject(UnsavedChangesService);
  private readonly dialog             = inject(MatDialog);
  private readonly route              = inject(ActivatedRoute);
  private readonly onboardingService  = inject(OnboardingService);
  private readonly permissionService  = inject(PermissionRolService);

  tableCols: ColumnsDataTable[] = [
    { name: 'companyName',      title: 'Denominación ó Razón Social', show: true, type: 'string' },
    { name: 'id',               title: 'RFC',                         show: true, type: 'string' },
    { name: 'relationType',     title: 'Tipo de Relación',            show: true, type: 'string' },
    { name: 'economicActivity', title: 'Actividad Económica',         show: true, type: 'string' },
    { name: 'bank',             title: 'Banco',                       show: true, type: 'string' },
    { name: 'clabe',            title: 'CLABE',                       show: true, type: 'string' },
    { name: 'frecuency',        title: 'Frecuencia de Operaciones',   show: true, type: 'string' },
  ];
  tableConfig: ConfigDataTable = {
    showPag: false,
    showViewAction: false,
    showEditAction: true,
    showDeleteAction: true,
    multipleSelection: false,
    idName: 'tempId'
  };

  override form: FormGroup = this.NonNullformBuilder.group({
    accountPurpose      : new FormControl('', {validators: [Validators.required]} ),
    fundOrigin          : new FormControl('', {validators: [Validators.required]} ),
    fundDestination     : new FormControl('', {validators: [Validators.required]} ),
    spidReceiveMonth    : new FormControl('', {validators: [Validators.required]} ),
    spidSendMonth       : new FormControl('', {validators: [Validators.required]} ),
    transactReceiveMonth: new FormControl('', {validators: [Validators.required]} ),
    transactSendMonth   : new FormControl('', {validators: [Validators.required]} ),
    customerStock       : new FormControl('', {validators: [Validators.required]} ),
    publicEntity        : new FormControl('', {validators: [Validators.required]} ),
    creditInstitution   : new FormControl('', {validators: [Validators.required]} ),
  });

  isEditting = false;
  edittingId = '';

  onboardingInfo: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
  isMaintenance = signal<boolean>(this.onboardingService.getCurrentInfo().isMaintenance);
  permissions = this.permissionService.getPermissions()?.['beneficiaries-pm'];
  disButtons = {
    edit    : false,
    register: false,
    save    : false,
    cancel  : false,
  };
  canAdd = this.permissions.permission.includes('add');
  canEdit = this.permissions.permission.includes('edit');
  canDelete = this.permissions.permission.includes('delete');

  // TODO falta definir estos catlaogos.
  /**
    * Indica el número mensual acumulado de transacciones a RECIBIR via SPID
    * Indica el número mensual acumulado de transacciones a ENVIAR via SPID
    * Indica el Monto mensual acumulado de transacciones a RECIBIR
    * Indica el Monto mensual acumulado de transacciones a ENVIAR
   */
  cat1List = signal<any[]>([{key:'1', value: 'cat1'}]);
  cat2List = signal<any[]>([{key:'1', value: 'cat2'}]);
  cat3List = signal<any[]>([{key:'1', value: 'cat3'}]);
  cat4List = signal<any[]>([{key:'1', value: 'cat4'}]);

  bankList                = signal<Bank[]>([]);
  economicActivityList    = signal<EconomicActivity[]>([]);
  relationTypeList        = signal<any[]>([]); // TODO agregar relationType model cuando se tenga el catalogo
  frecuencyOperationsList = signal<any[]>([]); // TODO agregar model cuando se tenga el catalogo

  ngOnInit(): void {
    // TODO descomentar cuando se tengan los resolvers -> catalogos
    this.bankList.set(this.route.snapshot.data['bankResolver']);
    this.economicActivityList.set(this.route.snapshot.data['economicActivityResolver']);
    // this.relationTypeList.set(this.route.snapshot.data['relationTypeResolver']);
    this.relationTypeList.set([{
      key: '1',
      value: 'Relación 1'
    },{
      key: '2',
      value: 'Relación 2'
    }]);
    // this.frecuencyOperationsList.set(this.route.snapshot.data['frecuencyOperationsResolver']);
    this.frecuencyOperationsList.set([{
      key: '1',
      value: 'Frecuencia 1'
    }, {
      key: '2',
      value: 'Frecuencia 2'
    }]);

    // this.spidProfilePageData.set(); // TODO agregar signal para guardar datos
    this.spidProfilePageData.set({
        "data": {
            "accountPurpose": "2",
            "fundOrigin": "2",
            "fundDestination": "2",
            "spidReceiveMonth": "1",
            "spidSendMonth": "1",
            "transactReceiveMonth": "1",
            "transactSendMonth": "1",
            "customerStock": "0",
            "publicEntity": "0",
            "creditInstitution": "1",
            "counterparts": [
                {
                    "tempId": "66769d2b-d39e-4ee3-8aad-2b6e340629c4",
                    "typeId": "1",
                    "id": "LEL871110777",
                    "companyName": "AASDFADSFAFDS",
                    "economicActivity": "2313021",
                    "relationType": "1",
                    "bank": "02001",
                    "clabe": "23423423434234",
                    "frecuency": "1"
                },
                {
                    "tempId": "62569a7b-194d-4581-98bd-f1bfd5ee4ea8",
                    "typeId": "1",
                    "id": "LEL871110777",
                    "companyName": "ASDFRWEREWR",
                    "economicActivity": "7412018",
                    "relationType": "2",
                    "bank": "02002",
                    "clabe": "3423322343232234",
                    "frecuency": "2"
                }
            ]
        },
        "table": [
            {
                "tempId": "66769d2b-d39e-4ee3-8aad-2b6e340629c4",
                "id": "LEL871110777",
                "companyName": "AASDFADSFAFDS",
                "economicActivity": "ACABADO DE HILOS",
                "relationType": "Relación 1",
                "bank": "Banco Patito",
                "clabe": "23423423434234",
                "frecuency": "Frecuencia 1"
            },
            {
                "tempId": "62569a7b-194d-4581-98bd-f1bfd5ee4ea8",
                "id": "LEL871110777",
                "companyName": "ASDFRWEREWR",
                "economicActivity": "AEROPUERTO CIVIL",
                "relationType": "Relación 2",
                "bank": "Otro Banco Patito",
                "clabe": "3423322343232234",
                "frecuency": "Frecuencia 2"
            }
        ]
    });

    // patch
    this.form.patchValue(this.spidProfilePageData().data);

    if ( this.isMaintenance() ) {
      console.log(this.permissions);
      this.initializeMaintenance();
    }
    console.log("can add? : %s", this.canAdd);
    console.log("can edit? : %s", this.canEdit);
  }


  /**
   * Click event that opens the modal
   */
  showModal(edit: boolean = false, dataToEdit: SpidCounterpart = {} as SpidCounterpart): void {

    let per = 'write' as 'read' | 'write';
    if ( this.isMaintenance() ) {
      per = 'read';
      if ( this.disButtons.edit && ( this.canEdit || this.canAdd) ) {
        per = 'write';
      }
    }

    const data: {
      edit: boolean;
      dataToEdit: any;
      isMaintenance: boolean;
      permissions: 'read' | 'write';
      bankList: Bank[] | any;
      economicActivityList: EconomicActivity[] | any;
      relationTypeList: any;
      frecuencyOperationsList: any;
    } = {
      edit,
      dataToEdit,
      isMaintenance: this.isMaintenance(),
      permissions: per,
      bankList: this.bankList,
      economicActivityList: this.economicActivityList,
      relationTypeList: this.relationTypeList,
      frecuencyOperationsList: this.frecuencyOperationsList
    };
    const dialogRef = this.dialog.open(CounterpartModalComponent, {
      maxWidth: '99%',
      width: '90%',
      data,
      disableClose: true,
      panelClass: 'panel-class'
    });

    // TODO asegurar setter el "unsavedchanges
    dialogRef.afterClosed().subscribe((modalData: DataModal) => {
      console.log(modalData);
      if ( modalData.ok ) {
        if ( modalData.edit ) {
          this.updateItem(modalData);
        } else {
          this.addItem(modalData);
        }
      }
      console.log(this.spidProfilePageData());
    });
  }

  /**
   * This method adds the counterpart returned by modal form,
   * to the variable where the whole data section its stored.
   */
  addItem(modalData: DataModal): void {
    const names = this.getNames(modalData.data.bank, modalData.data.economicActivity, modalData.data.frecuency, modalData.data.relationType);
    let tabDa = {
      tempId: modalData.data.tempId,
      id: modalData.data.id,
      companyName: modalData.data.companyName,
      economicActivity: names.activity,
      relationType: names.relation,
      bank: names.bank,
      clabe: modalData.data.clabe,
      frecuency: names.frecuency,
    };
    this.spidProfilePageData.update(item => ({
      ...item,
      data: {...item.data, counterparts: [...item.data.counterparts, modalData.data]},
      table: [...item.table, tabDa]
    }));

    this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
  }

  /**
   * Updates an existing row on the current page data signal object.
   */
  updateItem(modalData: DataModal): void {
    const names = this.getNames(modalData.data.bank, modalData.data.economicActivity, modalData.data.frecuency, modalData.data.relationType);
    let tabDa = {
      tempId: modalData.data.tempId,
      id: modalData.data.id,
      companyName: modalData.data.companyName,
      economicActivity: names.activity,
      relationType: names.relation,
      bank: names.bank,
      clabe: modalData.data.clabe,
      frecuency: names.frecuency,
    };

    this.spidProfilePageData.update((current: SpidProfilePageData) => ({
      ...current,
      data: {
        ...current.data,
        counterparts: current.data.counterparts.map(item =>
          item.tempId === modalData.data.tempId ? modalData.data : item
        )
      },
      table: current.table.map(item =>
        item.tempId === modalData.data.tempId ? tabDa : item
      )
    }));
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
          this.spidProfilePageData.update(current => ({
            ...current,
            data: {
              ...current.data,
              counterparts: current.data.counterparts.filter(item => item.tempId != event.row.tempId)
            },
            table: current.table.filter(item => item.tempId != event.row.tempId)
          }));
          this.notificationService.success(SUCCESS_MESSAGES.ITEM_DELETED);
        }
      });
    } else if ( STRINGS.EDIT === event.type ) {
      this.isEditting = true;
      this.edittingId = event.row.tempId;
      this.form.patchValue(event.row);
      const dataEdit = this.spidProfilePageData().data.counterparts.find((item) => item.tempId === this.edittingId);
      console.log(dataEdit);
      this.showModal(true, dataEdit);
    }
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
   * Performs the "checkpoint" saves.
   */
  onSubmit(): any {
    document.body.classList.add('show-validation');
    const formvalue = this.form.value;
    // TODO crear mapper para guardar checkpoint
    // const boddy: DirectorateCheckpoint = directorateMapToCheckpoint(this.spidProfilePageData().data);
    // console.log(boddy);

    if ( this.validateRequiredFields() ) {
      this.notificationService.error(ERROR_MESSAGES.MISSING_INFO);
      return;
    }

    if ( 0 === this.spidProfilePageData().data.counterparts.length ) {
      this.notificationService.error('Debe Registrar Contrapartes.');
      return;
    }

    this.spidProfilePageData.update((current: SpidProfilePageData) => ({
      ...current,
      data: {
        ...current.data,
        accountPurpose: formvalue.accountPurpose,
        fundOrigin: formvalue.fundOrigin,
        fundDestination: formvalue.fundDestination,
        spidReceiveMonth: formvalue.spidReceiveMonth,
        spidSendMonth: formvalue.spidSendMonth,
        transactReceiveMonth: formvalue.transactReceiveMonth,
        transactSendMonth: formvalue.transactSendMonth,
        customerStock: formvalue.customerStock,
        publicEntity: formvalue.publicEntity,
        creditInstitution: formvalue.creditInstitution,
      }
    }));

    console.log(this.spidProfilePageData());

    this.spidProfileSignal.setData(this.spidProfilePageData());

    this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
    this.unsavedService.setUnsavedChanges(false);

    // this.checkpointService.saveSection<AuthorizedPerson>('authorized-person', boddy).subscribe((resp: any) => {
    //   console.log(resp);
    //   this.checkSignalService.setData(this.authorizedPersonData());
    //   this.notifService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
    //   // this.router.navigate(['authorized-person'], {relativeTo: this.route.parent});
    // });

  }

  /**
   * return an object with name of option selected on input select
   */
  getNames(bankId: string, economicActivity: string, frecuency: string, relationType: string): {
    bank: string;
    activity: string;
    frecuency: string;
    relation: string;
  } {
    return {
      bank: this.bankList().find((bank: Bank) => bank.bankId === bankId)?.bankName ?? '',
      activity: this.economicActivityList().find((item: EconomicActivity) => item.lineBusinessId === economicActivity)?.lineBusiness ?? '',
      frecuency: this.frecuencyOperationsList().find((item: any) => item.key === frecuency)?.value ?? '',
      relation: this.relationTypeList().find((item: any) => item.key === relationType)?.value ?? '',
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
      this.disButtons.register = true;
    }

    if ( this.canAdd ) {
      this.form.enable();
      this.disButtons.register = !this.canAdd;
    }

  }

}
