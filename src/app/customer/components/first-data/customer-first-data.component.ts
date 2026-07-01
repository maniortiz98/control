import { CustomerFirstDataClientService } from '../../services/storage-services/customer-first-data-client.service';
import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CustomerClientDataComponent } from '../sections/client-data/customer-client-data.component';
import { CustomerClient, DataClient } from '../../models/customer-client-data';
import { WatchListBody, WatchListResponse } from '../../models/customer-watch-list';
import { CustomerNotificationsService } from '../../services/customer-notifications.service';
import { CustomerOnboardingService } from '../../services/customer-onboarding.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { CustomerCheckpointService } from '../../services/customer-customer-checkpoint-core.service';
import { mapToClient, mapToCheckPointInitialData } from '../../services/mappers/checkpoint/customer-mapper.customer';
import { Data } from '../../models/checkpoints/customer-initial-data-checkpoint';
import { butonFunctionDis, buttonFunctionEn, formFunctionDis, formFunctionEn, formFunctionEnAll } from '../../utils/customer-disable-or-enabled';
import { FlowCurpRfcService } from '../../../shared/services/flow-curp-rfc.service';
import { PermissionRolService } from '../../../core/services/rol.service';
import { compareGenderAndReturnValue } from '../../utils/customer-maper-gender';
import { INITIAL_DATA_DEFAULTS, CustomerREGEX } from '../../constants/customer-constants';
import { lastValueFrom } from 'rxjs';
import { CustomerCatalogsService } from '../../services/customer-catalogs.service';
import { CustomerModalFormService } from '../../services/customer-modal-form.service';
import { CustomerNotificationModalService } from '../../services/customer-notification-modal.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerGeneralInfoStorageService } from '../../services/storage-services/customer-general-info-storage.service';
import { CustomerSearchClientFlowService } from '../../services/customer-search-client-flow.service';
import { DEFAULT_PERSON_DATA } from './utils-mapper';
import { concatFullName } from '../../../shared/utils/string';


@Component({
  selector: 'app-customer-first-data',
  standalone: false,
  templateUrl: './customer-first-data.component.html',
  styleUrl: './customer-first-data.component.scss'
})
export class CustomerFirstDataComponent {
  @ViewChild(CustomerClientDataComponent) clientDataComponent!: CustomerClientDataComponent;

  //Inject
  private readonly fb = inject(FormBuilder);
  readonly dialog = inject(MatDialog);
  private readonly checkpointService = inject(CustomerCheckpointService);
  private readonly notificationService = inject(CustomerNotificationsService);
  private readonly onboardingService = inject(CustomerOnboardingService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly firstDataClientService = inject(CustomerFirstDataClientService);
  private readonly permissionRolService = inject(PermissionRolService);
  private readonly searchClientFlowService = inject(CustomerSearchClientFlowService);
  private readonly flowCurpRfcService = inject(FlowCurpRfcService);
  private readonly generalInfoStorageService = inject(CustomerGeneralInfoStorageService);

  // variables
  data: CustomerClient | null = null;
  id: number = 0;
  listData: any = {
    passOnWatchlist: false,
    isOnWatchlist: false,
    step: 0,
    matchLists: []
  };
  isMaintenance: boolean = this.onboardingService.getCurrentInfo().isMaintenance
  isCustomer: boolean = (this.onboardingService as any).getCurrentInfo().isCustomer
  isMaintenanceE = signal<boolean>(true);
  initialized: boolean = false;
  firstSave: boolean = false;
  profileForm: FormGroup = this.fb.group({
  });
  private receivedFormGroup: FormGroup | undefined;
  //constructor
  constructor() {
    document.body.classList.remove('show-validation');
    const data = this.firstDataClientService.getItem();
    if (data === null) {
      this.data = (this.onboardingService as any).getCustomerInitialData();
    } else {
      this.data = mapToClient({
        ...data, typeContractSubtypeId: this.onboardingService.getCustomerInitialData().typeContractSubtypeId,
        bankAreaTypeId: this.onboardingService.getCustomerInitialData().bankAreaTypeId,
        contraTypeId: this.onboardingService.getCustomerInitialData().contractTypeId
      });
      this.id = data.id ?? 0;
    }
    effect(() => {
      const dataClientSignal = this.firstDataClientService.getDataClientSignal();
      const data = dataClientSignal();
      if (data === null) {
        this.data = { ...this.onboardingService.getCustomerInitialData(), gender: compareGenderAndReturnValue(Number(this.onboardingService.getCustomerInitialData().gender)) };
        this.unsavedChangesService.setUnsavedChanges(false);
      } else {
        if (this.clientDataComponent && typeof this.clientDataComponent.setData === 'function') {
          this.clientDataComponent.setData(mapToClient({
            ...data, typeContractSubtypeId: this.onboardingService.getCustomerInitialData().typeContractSubtypeId,
            bankAreaTypeId: this.onboardingService.getCustomerInitialData().bankAreaTypeId,
            contraTypeId: this.onboardingService.getCustomerInitialData().contractTypeId
          }));
          this.unsavedChangesService.setUnsavedChanges(false);
          this.id = data.id ?? 0;
        }


        console.log('Data inicial cargada', data);
        if (this.initialized) {
          return;
        } else {
          console.log('activando general info');
          this.initialized = true;
          (this.onboardingService as any).enableTabs(['general-info']);
          const generalInfo = this.generalInfoStorageService.generalInfoItem()
          if (generalInfo) {
            console.log('Activando el resto de tabs');
            (this.onboardingService as any).enableTabs();
            (this.onboardingService as any).hideTabs('customer-operate-changes');
            // BEAT: Always hide real-owner tab in customer flow
            (this.onboardingService as any).hideTabs('customer-real-owner');
            if (!generalInfo?.hasSupplier) {
              (this.onboardingService as any).hideTabs('customer-resource-provider');
            } else {
              (this.onboardingService as any).showTabs('customer-resource-provider');
            }
          }
        }

      }


    });
  }

  onFormGroupReceived(formGroup: FormGroup): void {
    this.receivedFormGroup = formGroup;
  }

  ngOnInit() {
    butonFunctionDis(['btnEdit']);
  }

  editt() {
    if (this.permissionRolService.getPermissionsCustomer()['customer-info'].allDisabled) {
    } else {
      if ((this.permissionRolService.getPermissionsCustomer()['customer-info'].fieldsEnabled.length ?? 0) === 0) {
        if (this.firstDataClientService.getItem()?.foreignerWithoutCurp === true) {
          formFunctionEnAll(this.clientDataComponent.profileForm, ['curp']);
        } else {
          formFunctionEnAll(this.clientDataComponent.profileForm);
        }
      } else {
        if (this.firstDataClientService.getItem()?.foreignerWithoutCurp === true) {
          formFunctionEn(this.clientDataComponent.profileForm, this.permissionRolService.getPermissionsCustomer()['customer-info'].fieldsEnabled, ['curp']);
        } else {
          formFunctionEn(this.clientDataComponent.profileForm, this.permissionRolService.getPermissionsCustomer()['customer-info'].fieldsEnabled);
        }
      }
      buttonFunctionEn(this.permissionRolService.getPermissionsCustomer()['customer-info'].buttonsEnabled);
      butonFunctionDis(['btnEdit']);
    }
  }

  cancel() {
    const data = this.firstDataClientService.getItem();
    if (data != null) {
      this.clientDataComponent.setData(mapToClient(data));
    }
    formFunctionDis(this.clientDataComponent.profileForm);
    buttonFunctionEn(['btnEdit']);
    butonFunctionDis(['btnSave', 'btnCancel']);
  }

  ngAfterViewInit(): void {
    if (this.isMaintenance) {
      formFunctionDis(this.clientDataComponent.profileForm);
      if (!this.permissionRolService.getPermissionsCustomer()['customer-info'].allDisabled) {
        this.isMaintenanceE.set(false);
      }
    } else if (this.isCustomer) {
      formFunctionDis(this.clientDataComponent.profileForm);
      butonFunctionDis(['btnSave']);
      (this.onboardingService as any).enableTabs();
    }

    /* se agrega validacion para mantener bloqueado el form cuando ya existe un dato en "requestId" */
    if (0 < (this.onboardingService as any).getCurrentInfo().requestId.trim().length) {
      this.profileForm.disable();
      butonFunctionDis(['btnSave']);
    }

    // (this.onboardingService as any).enableTabs();

  }

  async onSubmit() {
    if (!this.isMaintenance) {
      document.body.classList.add('show-validation');
      this.unsavedChangesService.setUnsavedChanges(true);
      const resultData = this.clientDataComponent.submitID();
      this.unsavedChangesService.setUnsavedChanges(true);
      if (resultData != null) {
        // Valores default para campos de contrato en sectionId "initial-data"
        const beatResultData = {
          ...resultData,
          bankAreaTypeId: resultData.bankAreaTypeId || INITIAL_DATA_DEFAULTS.BAMK_AREA_TYPE_ID,
          contraTypeId: String(resultData.contraTypeId || INITIAL_DATA_DEFAULTS.CONTRACT_TYPE_ID),
          typeContractSubtypeId: String(resultData.typeContractSubtypeId || INITIAL_DATA_DEFAULTS.CONTRACT_SUBTYPE_ID),
        };
        this.listData = await this.searchClientFlowService.getDataWatchList(resultData);
        const homo = await this.searchClientFlowService.validInHomonyms(resultData);
        if (homo.passOnHomonyms) {
          const isPpe = this.listData?.matchLists.some((elemento: { type: string }) => elemento.type.toLocaleUpperCase() === 'PPE') ?? false;
          // if (this.listData?.matchLists.some((elemento: { type: string }) => elemento.type.toLocaleUpperCase() === 'OFAC' || elemento.type.toLocaleUpperCase() === 'ONU' || elemento.type.toLocaleUpperCase() === '69B')) {
          //   this.notificationService.error('Cliente bloqueado por lista negra');
          //   return;
          // }
          this.checkpointService.saveSection('initial-data', mapToCheckPointInitialData({ ...beatResultData, ppe: isPpe }, false, this.id)).subscribe(async (result: any) => {
            if (result['status'] === "CREATED") {

              this.onboardingService.updateCurrentOnboardingInfo({
                requestId: result['applicationNumber'],
                name: this.getFullname(this.firstDataClientService.getItem())
              });
              if (this.listData.step === 2) {
                //TODO Envia el body que defina ms
                const general = await lastValueFrom(this.checkpointService.saveSection('general-information', DEFAULT_PERSON_DATA));
              }

              await this.searchClientFlowService.getWatchListWF(this.listData);


              this.firstDataClientService.setItem(
                mapToCheckPointInitialData({ ...beatResultData, ppe: isPpe }, false, this.id)
              );
              /* deshabilita el formulario y boton para no volver a guardar */
              this.profileForm.disable();
              butonFunctionDis(['btnSave']);

              this.unsavedChangesService.setUnsavedChanges(false);
              (this.onboardingService as any).updateCurrentOnboardingInfo({
                requestId: result['applicationNumber'],
                name: this.getFullname(this.firstDataClientService.getItem())
              });
              this.data = (this.onboardingService as any).getCustomerInitialData();
              (this.onboardingService as any).enableTabs(['general-info']);
              this.notificationService.success('¡Excelente! Continua en la Siguiente Sección', 'El id de Solicitud ha Sido Creado: ' + result['applicationNumber']);

            } else if (result['status'] === "FAILED" || result['status'] === "400") {
              this.notificationService.error('Error al Guardar Contacte al Administrador del Sistema');
            }
          });
        } else {
          if(homo.numberClient != undefined){
            this.notificationService.success('El Cliente ya Existe');
          }
        }
      }
    } else {
      document.body.classList.add('show-validation');
      this.unsavedChangesService.setUnsavedChanges(true);
      const resultData = this.clientDataComponent.submitID();
      this.unsavedChangesService.setUnsavedChanges(true);
      if (resultData != null) {
        const homo = await this.searchClientFlowService.validInHomonyms(resultData);
        if (homo.passOnHomonyms) {
          this.listData = await this.searchClientFlowService.getDataWatchList(resultData);
          const result = await this.searchClientFlowService.getWatchListWF(this.listData);
          if (result === true) {
            const dataClientSignal = this.firstDataClientService.getDataClientSignal();
            const data = dataClientSignal()
            const resultFlow = await this.flowCurpRfcService.validChangesInCURPandRFC(
              {
                old: {
                  rfc: data?.rfc ?? '',
                  curp: data?.curp ?? ''
                },
                new: {
                  clientNumber: this.onboardingService.getCurrentInfo().clientId,
                  firstName: data?.firstName ?? '',
                  lastName: data?.firstLastName ?? '',
                  secondLastName: data?.secondLastName ?? '',
                  secondName: data?.middleName ?? '',
                  gender: data?.gender?.toString() ?? '',
                  birthDate: data?.dateOfBirth ?? '',
                  birthState: data?.stateOfBirth ?? '',
                  typeIden: "1",
                  rfc: resultData.rfc,
                  curp: resultData.curp
                }
              }
            );
            console.log(resultFlow);
            if (resultFlow) {
              this.checkpointService.saveSectionNonContract('initial-data', mapToCheckPointInitialData(resultData, true, this.id)).subscribe((result) => {
                if (result['status'] === "UPDATED") {
                  this.firstDataClientService.setItem(mapToCheckPointInitialData(resultData, true, this.id));
                  this.clientDataComponent.profileForm.disable();
                  butonFunctionDis(['btnSave', 'btnCancel']);
                  buttonFunctionEn(['btnEdit']);
                  this.unsavedChangesService.setUnsavedChanges(false);
                  this.onboardingService.updateCurrentOnboardingInfo({
                    requestId: '',
                    name: concatFullName(
                      this.firstDataClientService.getItem()?.firstName,
                      this.firstDataClientService.getItem()?.middleName,
                      this.firstDataClientService.getItem()?.firstLastName,
                      this.firstDataClientService.getItem()?.secondLastName,
                    )
                  });
                  this.data = this.onboardingService.getCustomerInitialData();
                  this.notificationService.success('Guardado con Éxito');
                }
              });
            }
          }
        }
      }
    }
  }

  getFullname(data: Data | null): string {
    let name = '';
    if (data) {
      name = data.firstName + ' '
        + data.middleName + ' '
        + data.firstLastName + ' '
        + data.secondLastName;
    }

    return name;
  }

  removeExtraSpaces(text: string) {
    return text.replace(CustomerREGEX.MULTIPLE_SPACES, ' ');
  }

  getListValues = (list?: any) => list?.matchLists?.map((item: any) => item.type) || [];
}





















