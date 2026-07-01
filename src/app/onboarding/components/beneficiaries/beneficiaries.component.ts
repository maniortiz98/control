import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { OnboardingService } from '../../services/onboarding.service';
import { FormControl, Validators } from '@angular/forms';
import { REGEX, STRINGS } from '../../constants/constants';
import { ConfigDataTable, ColumnsDataTable } from '../../../shared/components/table-results/interfaces';
import { ClientDataComponent } from '../../../shared/components/sections/client-data/client-data.component';
import { Relationships } from '../../models/relationships';
import { AddressSectionComponent } from '../../../shared/components/sections/address-section/address-section.component';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { ERROR_MESSAGES, NOTIFICATION_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
import { ActivatedRoute } from '@angular/router';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { AddressesService } from '../../../shared/services/storage-services/addresses.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { Beneficiaries, BeneficiariesCurrentTableData } from '../../models/checkpoints/beneficiaries';
import * as BeneficiariesMapper from '../../services/mappers/beneficiaries.mapper';
import { BeneficiariesSignalService } from '../../services/checkpoint/beneficiaries-signal.service';
import { CurrentOnboardingInfo } from '../../models/current-onboarding';
import { PermissionRolService } from '../../../core/services/rol.service';
import { concatMap } from 'rxjs';
import { SearchClientFlowService } from '../../../shared/services/search-client-flow.service';

@Component({
  selector: 'app-beneficiaries',
  standalone: false,
  templateUrl: './beneficiaries.component.html',
  styleUrl: './beneficiaries.component.scss'
})
export class BeneficiariesComponent implements OnInit, AfterViewInit {

  @ViewChild(ClientDataComponent) clientDataComponent!: ClientDataComponent;
  @ViewChild(AddressSectionComponent) addressComponent!: AddressSectionComponent;

  private readonly route              = inject(ActivatedRoute);
  private readonly onboardingService  = inject(OnboardingService);
  private readonly modalService       = inject(NotificationModalService);
  private readonly notificationServ   = inject(NotificationsService);
  private readonly unsavedChangesServ = inject(UnsavedChangesService);
  private readonly addressService     = inject(AddressesService);
  private readonly checkpointService  = inject(CheckpointService);
  private readonly checkSignalService = inject(BeneficiariesSignalService);
  private readonly permissionService  = inject(PermissionRolService);
  private readonly clientFlowService  = inject(SearchClientFlowService);

  checkControl        = new FormControl(false, []);
  relationshipControl = new FormControl('', [Validators.required]);
  percentageControl   = new FormControl('', [
    Validators.required,
    Validators.max(100),
    Validators.min(1),
    Validators.pattern(REGEX.ONLY_NUMBERS)
  ]);

  relationshipList = signal<Relationships[]>([]);

  /**
   * Inputs for Result Table Component
   */
  tableConfig: ConfigDataTable = {
    showPag          : false,
    showEditAction   : true,
    showDeleteAction : true,
    showViewAction: false,
    multipleSelection: false,
    idName           : 'tempId',
    saveWord         : 'active',
  };
  tableCols: ColumnsDataTable[] = [
    { name: 'firstName',        title: 'Primer Nombre',               show: true, type: 'string' },
    { name: 'lastName',         title: 'Primer Apellido',             show: true, type: 'string' },
    { name: 'relationShipName', title: 'Parentesco',                  show: true, type: 'string' },
    { name: 'percentage',       title: 'Porcentaje Beneficiario',     show: true, type: 'string' },
    { name: 'sameAddress',      title: 'Domicilio igual al anterior', show: true, type: 'checkbox' }
  ];
  tableData: Array<BeneficiariesCurrentTableData> = [];

  isEditting = false;
  edittingId = '';
  edittingIdAddress = '';

  onboardingInfo: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
  isMaintenance = signal<boolean>(this.onboardingService.getCurrentInfo().isMaintenance);
  permissions = this.permissionService.getPermissions()?.['beneficiaries'];
  disButtons = {
    edit    : false,
    register: false,
    save    : false,
    cancel  : false,
  };

  constructor() {
    document.body.classList.remove('show-validation');

    this.tableData = this.checkSignalService.getBeneficiaries();
    console.log(this.tableData);
  }

  /**
   * On Init
   */
  ngOnInit(): void {
    console.log(this.onboardingService.getCustomerInitialData());
    this.onChanges();

    this.relationshipList.set(this.route.snapshot.data['relationshipResolver']);

    this.checkControl.valueChanges.subscribe(() => {
      this.unsavedChangesServ.setUnsavedChanges(this.checkControl.dirty);
    });
    this.relationshipControl.valueChanges.subscribe(() => {
      this.unsavedChangesServ.setUnsavedChanges(this.relationshipControl.dirty);
    });
    this.percentageControl.valueChanges.subscribe(() => {
      this.unsavedChangesServ.setUnsavedChanges(this.percentageControl.dirty);
    });
  }

  /**
   * After View Initialization
   */
  ngAfterViewInit(): void {
    this.curpNotRequired();
    this.clientDataComponent.profileForm.valueChanges.subscribe(() => {
      this.unsavedChangesServ.setUnsavedChanges(this.clientDataComponent.profileForm.dirty);
    });

    this.addressComponent.profileForm.valueChanges.subscribe(() => {
      this.unsavedChangesServ.setUnsavedChanges(this.addressComponent.profileForm.dirty);
    });

    if ( this.onboardingInfo.isMaintenance ) {
      console.log(this.permissions);
      this.initializeMaintenance();
      this.initializeTableData();
    } else if ( this.onboardingInfo.isOnboarding ) {
      this.initializeTableData();
    }

    // TODO improve
    // if ( this.onboardingInfo.isMaintenance ) {
    //   this.initializeMaintenance();
    // }
    // this.initializeTableData();
    // ### improve
  }

  /**
   * form control Value changes
   */
  onChanges(): void {
    this.checkControl.valueChanges.subscribe((check: boolean | null) => {
      console.log(check);
      if ( check ) {
        const addressList = this.addressService.get();
        if (addressList && 'undefined' != typeof addressList.addressList && 1 <= addressList.addressList.length) {
          this.addressComponent.setAddresData(addressList.addressList[0]);
        } else {
          this.notificationServ.error(ERROR_MESSAGES.NO_ADDRESS_REGISTERED);
          this.checkControl.setValue(false, {emitEvent: false});
        }
      } else {
        if(!this.isMaintenance() && !this.permissions.allDisabled){
          this.addressComponent?.profileForm.enable();
          this.addressComponent?.profileForm.reset();
        }
      }
    });
  }

  /**
   *
   */
  curpNotRequired(): void {
    this.clientDataComponent.resetDefaults();
    const curpControl = this.clientDataComponent.profileForm.get('curp');
    curpControl?.setValue('');
    curpControl?.setValidators([
      Validators.required,
      Validators.pattern(REGEX.CURP_VALIDATION)
    ]);
    curpControl?.updateValueAndValidity();
  }

  /**
   * Register.
   * Adds the current form information, to list of beneficiaries.
   */
  async register(): Promise<any> {
    document.body.classList.add('show-validation');

    this.relationshipControl.markAsTouched();
    this.percentageControl.markAsTouched();

    const clientData = await this.clientDataComponent.submit();
    const addressData = await this.addressComponent.onSubmit();

    if (clientData == null || addressData == null) {
      return;
    }

    if (this.relationshipControl.hasError('required') || this.percentageControl.hasError('required')) {
      this.notificationServ.error(ERROR_MESSAGES.MISSING_INFO);
      return;
    }

    if (
      this.percentageControl.hasError('pattern') ||
      this.percentageControl.hasError('min') ||
      this.percentageControl.hasError('max')
    ) {
      this.notificationServ.error(ERROR_MESSAGES.INCORRECT_FORMAT);
      return;
    }

    // After basic validations, performs WatchList.
    await this.clientFlowService.validInWatchList(clientData);

    if (this.isEditting) {
      const newArr = this.tableData.map((item: BeneficiariesCurrentTableData) => {
        if (this.edittingId === item.tempId) {
          item.beneficiaryId = item.beneficiaryId;
          item.clientData = clientData;
          item.addressData = addressData;
          if(this.isMaintenance()){
            item.addressData = {...item.addressData, addressId: Number(this.edittingIdAddress)}
          }
          item.firstName = clientData.firstName;
          item.lastName = clientData.firstLastName;
          item.relationShip = this.relationshipControl.value;
          item.percentage = this.percentageControl.value;
          item.sameAddress = this.checkControl.value;
        }
        item.relationShipName = this.getRelationshipName(this.relationshipControl.value);
        return item;
      });
      this.isEditting = false;
      this.edittingId = '';
      this.edittingIdAddress = '';
      this.tableData = newArr;
    } else {
      let temp: BeneficiariesCurrentTableData = {
        beneficiaryId: null,
        personId: null,
        accountRoleId: null,
        active: true,
        clientData,
        addressData,
        firstName: clientData.firstName,
        lastName: clientData.firstLastName,
        relationShip: this.relationshipControl.value,
        relationShipName: this.getRelationshipName(this.relationshipControl.value),
        percentage: this.percentageControl.value,
        sameAddress: this.checkControl.value,
        tempId: crypto.randomUUID()
      };
      this.tableData = [...this.tableData, temp];
    }


    console.log(this.tableData);
    this.resetForms();
    this.unsavedChangesServ.setUnsavedChanges(true);
  }

  /**
   * Submit calls to save Checkpoint.
   */
  submit(): void {

    // si no se agrega ningun benef
    if (0 === this.tableData.length) {
      this.modalService.info({
        title: '¿Deseas Continuar Sin Agregar Beneficiario?',
        btnAccept: 'Continuar sin Beneficiarios',
        btnDeny: '+ Agregar Beneficiario',
      }).then((modal: any) => {
        if (modal.value) {
          // this.router.navigate(['authorized-person'], {relativeTo: this.route.parent});
          if ( this.isMaintenance() ) {
            this.saveMaintenance();
          } else {
            this.saveCheckpoint();
          }
        }
      });
    }

    // solo 1 benef, debe tener el 100%
    else if (this.tableData.length === 1 && this.tableData[0].percentage != '100') {
      this.notificationServ.error(ERROR_MESSAGES.ONE_BENEFICIARIE);
      return;
    }

    // mas benef
    else if (!this.verify100Per().ok) {
      console.log('suma')
      console.log(this.verify100Per().sum)
      this.notificationServ.error(ERROR_MESSAGES.PERCENTAGE_100);
      return;
    }

    if ( this.isMaintenance() ) {
      this.saveMaintenance();
    } else {
      this.saveCheckpoint();
    }

  }

  /**
   * Performs the checkpoint save.
   */
  saveCheckpoint(): void {
    const boddy: Beneficiaries = {
      beneficiaries: BeneficiariesMapper.toCheckpoint(this.tableData)
    };
    console.log(boddy);

    this.checkpointService.saveSection<Beneficiaries>('beneficiaries', boddy).subscribe({
      next: (result) => {
        console.log(result);
        if ("CREATED" === result['status']) {
          this.checkSignalService.setBeneficiaries(this.tableData);
          this.unsavedChangesServ.setUnsavedChanges(false);
          this.notificationServ.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
        }
      }
    });
  }

  /**
   * Performs the checkpoint save.
   */
  saveMaintenance(): void {
    const boddy: Beneficiaries = {
      beneficiaries: BeneficiariesMapper.beneficiariesMapperSaveMaint(this.tableData)
    };
    console.log(boddy);

    this.checkpointService.saveSectionMant<Beneficiaries>('beneficiaries', boddy)
    .pipe(
      concatMap((result) => {
        console.log(result);
        if ("CREATED" === result['status']) {
          this.checkSignalService.setBeneficiaries(this.tableData);
          this.unsavedChangesServ.setUnsavedChanges(false);
          this.notificationServ.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
        }
        return this.checkpointService.getMaintenanceSectionByPersonaFisica(['beneficiaries']);
      })
    ).subscribe((response: any) => {
      this.tableData = BeneficiariesMapper.beneficiariesMapperQueryMaint(
        response?.checkpoints?.[0]?.data?.beneficiaries
      );
      this.initializeTableData();
      this.checkSignalService.setBeneficiaries(this.tableData);
      this.unsavedChangesServ.setUnsavedChanges(false);
        this.notificationServ.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
    });
  }


  /**
   * Event triggered when user selects 'edit' or 'delete'
   * a row from beneficiearies table.
   */
  eventRow(event: any): void {
    console.log(event.type, event.row);

    if (STRINGS.EDIT === event.type) {
      this.isEditting = true;
      if ( this.isMaintenance() ) {
        this.edittingIdAddress = event.row.addressData.addressId;
      }
      this.checkControl.setValue(this.verifySameAddress(event.row.addressData));
      this.clientDataComponent.setClientData(event.row.clientData);
      this.addressComponent.setAddresData(event.row.addressData);
      this.relationshipControl.setValue(event.row.relationShip);
      this.percentageControl.setValue(event.row.percentage);
      this.edittingId = event.row.tempId;

      // if ( this.isMaintenance() ) {
      //   this.validateRolOnEdit();
      // }
    } else if (STRINGS.DELETE === event.type) {
      this.modalService.confirm({
        title: NOTIFICATION_MESSAGES.DELETE_QUESTION_MESSAGE,
        btnAccept: 'Si, Eliminar.',
        btnDeny: 'No'
      }).then((res: { value: boolean; message?: string } | undefined) => {
        if (res && res.value) {

          let newArr: any[] = [];

          if ( this.isMaintenance() ) {
            newArr = this.tableData.map((item: BeneficiariesCurrentTableData) => {
              if ( item.tempId === event.row.tempId ) {
                item.active = false;
              }
              return item;
            });

          } else {

            newArr = this.tableData.filter((item: any) => {
              if (
                item.firstName != event.row.firstName ||
                item.lastName != event.row.lastName ||
                item.relationShip != event.row.relationShip ||
                item.percentage != event.row.percentage ||
                item.sameAddress != event.row.sameAddress
              ) {
                return item;
              }
          });
          }

          this.tableData = newArr;
          this.notificationServ.success(SUCCESS_MESSAGES.ITEM_DELETED, SUCCESS_MESSAGES.BENEFICIARIE_DELETED);
          if (0 === this.tableData.length) {
            this.modalService.info({
              title: '¿Deseas Continuar Sin Agregar Beneficiario?',
              btnAccept: 'Continuar sin Beneficiarios',
              btnDeny: '+ Agregar Beneficiario',
            }).then((modal: any) => {
              if (modal.value) {
                // this.router.navigate(['authorized-person'], {relativeTo: this.route.parent});
              }
            });
          } else {
            const sum = this.verify100Per().sum;
            if (sum < 100) {
              const msg1 = `Falta ${100 - sum}% Para Completar el 100%`;
              this.notificationServ.info(msg1);
            }
          }
        }
      });

    }
  }

  /**
   *
   */
  verify100Per(): { ok: boolean; sum: number; } {
    const sum = this.tableData.reduce((accumulator: any, currentValue: any) => {
      console.log(accumulator, currentValue);
      if ( currentValue.active ) {
        return accumulator + +currentValue.percentage;
      }
      return accumulator;
    }, 0);
    return {
      ok: sum === 100 || sum === 0,
      sum
    };
  }

  /**
   * used to reset all forms in this interface
   */
  resetForms(): void {
    this.clientDataComponent.profileForm.reset();
    this.addressComponent.profileForm.reset();
    this.addressComponent.resetColonyCP();
    this.checkControl.setValue(false);
    this.relationshipControl.setValue('');
    this.percentageControl.setValue('');

    this.relationshipControl.markAsUntouched();
    this.relationshipControl.markAsPristine();
    this.percentageControl.markAsUntouched();
    this.percentageControl.markAsPristine();

    this.curpNotRequired();
  }

  /**
   * Gets the name of the option selected, to show in table results,
   * instead of show the ID value.
   */
  getRelationshipName(id: any): string {
    let name = '';
    const relation = this.relationshipList().find((item: any) => id == item.idParent);
    name = relation?.kinShip ?? '';
    return name;
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
    this.edittingIdAddress = '';
    this.resetForms();
    this.clientDataComponent.profileForm.enable();
    this.addressComponent.profileForm.enable();
    const country =  this.addressComponent.profileForm.get('country')?.value;
    this.addressComponent.enableDisableFECityMun(country);
    this.checkControl.enable();
    this.relationshipControl.enable();
    this.percentageControl.enable();

    this.disButtons = {
      register: this.permissions.permission.includes('add') ? false : true,
      cancel: false,
      save: false,
      edit: true
    };

    this.tableConfig.showDeleteAction = this.permissions.permission.includes('delete');

  }

  /**
   * Method for MAINTENANCE
   *
   * Initialize default maintenance mode. (all disabled)
   */
  initializeMaintenance(): any {
    this.tableConfig = {
      showPag          : false,
      showEditAction   : true,
      showDeleteAction : false,
      showViewAction: false,
      multipleSelection: false,
      idName           : 'tempId',
      saveWord         : 'active',
    };

    // 1. deshaiblitar todo los forms
    this.checkControl.disable({emitEvent: false});
    this.relationshipControl.disable();
    this.percentageControl.disable();
    this.addressComponent.profileForm.disable();
    this.clientDataComponent.profileForm.disable();

    // 2. deshabilitar todos los botones (configurarlos)
    this.disButtons = {
      save: true,
      register: true,
      edit: this.permissions.allDisabled,
      cancel: true,
    };

  }

  /**
   * Method for MAINTENANCE
   *
   * es como regresar al estado inicial de mantenimiento.
   */
  cancelMaintenance(): any {
    this.tableConfig = {
      showPag          : false,
      showEditAction   : false,
      showDeleteAction : false,
      showViewAction: false,
      multipleSelection: false,
      idName           : 'tempId',
      saveWord         : 'active',
    };
    this.edittingIdAddress = '';
    this.tableData = this.checkSignalService.getBeneficiaries();
    this.initializeTableData();
    this.initializeMaintenance();
    this.resetForms();
  }

  /**
   * Method for MAINTENANCE
   *
   * este método se va a llamar cuando el usuario de click en "editar" de la tabla.
   */
  validateRolOnEdit(): any {
    this.disButtons.register = !this.permissions.permission.includes('edit') || !this.permissions.permission.includes('add');
    const canEdit = this.permissions.permission.includes('edit');
    const canAdd = this.permissions.permission.includes('add');

    if ( !canEdit || !canAdd ) {
      this.addressComponent.profileForm.disable();
      this.checkControl.disable({emitEvent: false});
      this.relationshipControl.disable();
      this.percentageControl.disable();
      this.clientDataComponent.profileForm.disable();
    }
  }

  /**
   * Method for MAINTENANCE
   *
   * este método se llamaria cuando se de click en "eliminar" de la tabla.
   */
  validateRolOnDelete(): any {

  }

  /**
   * Settea los valores para ser mostrados en la tabla de los registros en la sección.
   */
  initializeTableData(): void {
    console.log(this.tableData);
    const dd = this.tableData.map((item: BeneficiariesCurrentTableData) => {
      console.log(item);
      item.relationShipName = this.getRelationshipName(item.relationShip);
      item.sameAddress      = this.verifySameAddress(item.addressData);
      return item;
    });

    this.tableData = dd;
  }

  /**
   * Verifies if address passed is the same as registered
   * in Address section.
   */
  verifySameAddress(address: any): boolean {
    console.log(address);
    const addList = this.addressService.get();
    let res = false;
    console.log(addList);
    if ( addList?.addressList[0] ) {
      console.log(address, addList.addressList[0]);
      res = (
        address['addressType']     === addList.addressList[0]['addressType'] &&
        address['country']         === addList.addressList[0]['country'] &&
        address['postalCode']      === addList.addressList[0]['postalCode'] &&
        address['neighborhood']    === addList.addressList[0]['neighborhood'] &&
        address['street']          === addList.addressList[0]['street'] &&
        address['externalNumber']  === addList.addressList[0]['externalNumber'] &&
        address['internalNumber']  === addList.addressList[0]['internalNumber'] &&
        address['federalEntity'] === addList.addressList[0]['federalEntity']
      );
    }
    return res;
  }

}
