import { FirstDataClientService } from './../../../shared/services/storage-services/first-data-client.service';
import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ClientDataComponent } from '../../../shared/components/sections/client-data/client-data.component';
import { Client } from '../../models/client-data';
import { WatchListReturn } from '../../models/customer-watch-list';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { OnboardingService } from '../../services/onboarding.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { mapToClient, mapToCheckPointInitialData } from '../../../shared/services/mapper-services/maper';
import { PermissionRolService } from '../../../core/services/rol.service';
import { butonFunctionDis, buttonFunctionEn, formFunctionDis, formFunctionEn, formFunctionEnAll } from '../../../shared/utils/disableOrEnabled';
import { compareGenderAndReturnValue } from '../../../shared/utils/maper-gender';
import { GeneralInfoStorageService } from '../../../shared/services/storage-services/general-info-storage.service';
import { SearchClientFlowService } from '../../../shared/services/search-client-flow.service';
import { HomonymsResponseData } from '../../models/homonyms';
import { CustomerInformationService } from '../../../shared/services/customer.service';
import { mapToSignalInitialDataCustomer } from '../../services/mappers/response/initial-data-mapper';
import { PpeService } from '../../../shared/services/storage-services/ppe.service';
import { mapToSignalPPECustomer } from '../../services/mappers/response/ppe-mapper';
import { AddressesService } from '../../../shared/services/storage-services/addresses.service';
import { mapToSignalAddressCustomer } from '../../services/mappers/response/address';
import { SaveCheckpointResponse } from '../../../shared/models/checkpoint';
import { ModalFormService } from '../../../shared/services/modal-form.service';
import { FlowCurpRfcService } from '../../../shared/services/flow-curp-rfc.service';
import { existingClientToGeneralInfo } from '../../services/mappers/general-info.mapper';
import { exitentedToIdentificationAndContact } from '../../services/mappers/identification-and-contact.mapper';
import { PhoneType } from '../../models/phone-type';
import { Countries } from '../../models/country';
import { IdentificationType } from '../../models/identification-type';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { IdentificationAndContactService } from '../../../shared/services/storage-services/identification-and-contact.service';
import { lastValueFrom } from 'rxjs';
import { DEFAULT_PERSON_DATA, mapGeneralInfoInit } from './utils-mapper';
import { concatFullName } from '../../../shared/utils/string';

@Component({
  selector: 'app-first-data',
  standalone: false,
  templateUrl: './first-data.component.html',
  styleUrl: './first-data.component.scss'
})
export class FirstDataComponent implements OnInit {
  @ViewChild(ClientDataComponent) clientDataComponent!: ClientDataComponent;

  //Inject
  private readonly fb = inject(FormBuilder);
  readonly dialog = inject(MatDialog);
  private readonly checkpointService = inject(CheckpointService);
  private readonly notificationService = inject(NotificationsService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly firstDataClientService = inject(FirstDataClientService);
  private readonly permissionRolService = inject(PermissionRolService);
  private readonly searchClientFlowService = inject(SearchClientFlowService);
  private readonly generalInfoStorageService = inject(GeneralInfoStorageService);
  private readonly customerInformationService = inject(CustomerInformationService);
  private readonly flowCurpRfcService = inject(FlowCurpRfcService);
  private readonly ppeService = inject(PpeService);
  private readonly addressesService = inject(AddressesService);
  private readonly modalFormService = inject(ModalFormService);
  private readonly catalogsService = inject(CatalogsService);
  private readonly pageStorageService = inject(IdentificationAndContactService);

  // variables
  phoneTypes = signal<Array<PhoneType>>([]);
  countries = signal<Array<Countries>>([]);
  identifications = signal<Array<IdentificationType>>([]);
  data: Client | null = null;
  id: number = 0;
  listData: WatchListReturn = {
    passOnWatchlist: false,
    isOnWatchlist: false,
    step: 0,
    matchLists: []
  };
  isMaintenance: boolean = this.onboardingService.getCurrentInfo().isMaintenance
  isCustomer: boolean = this.onboardingService.getCurrentInfo().isCustomer
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
      this.data = { ...this.onboardingService.getCustomerInitialData(), gender: compareGenderAndReturnValue(Number(this.onboardingService.getCustomerInitialData().gender)) };
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
          this.clientDataComponent.setData(mapToClient({ ...data, bankAreaTypeId: this.onboardingService.getCustomerInitialData().bankAreaTypeId?.toString() ?? '', typeContractSubtypeId: this.onboardingService.getCustomerInitialData().typeContractSubtypeId?.toString() ?? '', contraTypeId: this.onboardingService.getCustomerInitialData().contractTypeId?.toString() ?? '' }));
          this.unsavedChangesService.setUnsavedChanges(false);
          this.id = data.id ?? 0;
          this.data = mapToClient({
            ...data, typeContractSubtypeId: this.onboardingService.getCustomerInitialData().typeContractSubtypeId,
            bankAreaTypeId: this.onboardingService.getCustomerInitialData().bankAreaTypeId,
            contraTypeId: this.onboardingService.getCustomerInitialData().contractTypeId
          });
        }


        console.log('Data inicial cargada', data);
        if ((this.isMaintenance || this.onboardingService.getCurrentInfo().requestId != '') && !this.firstSave) {
          console.log("ENTRA AQUI", this.onboardingService.getCurrentInfo().requestId)
          if (this.initialized) {
            return;
          } else {
            console.log('activando general info');
            this.initialized = true;
            this.onboardingService.enableTabs(['general-info']);
            const generalInfo = this.generalInfoStorageService.generalInfoItem()
            if (generalInfo) {
              console.log('Activando el resto de tabs');
              this.onboardingService.enableTabs();
              //TODO revisar y ajustar cuando ya responda el servicio de consulta de general-info
              if (!generalInfo?.operatesChanges) {
                this.onboardingService.hideTabs('operate-changes');
              } else {
                this.onboardingService.showTabs('operate-changes');
              }
              if (generalInfo?.acting) {
                this.onboardingService.hideTabs('real-owner');
              } else {
                this.onboardingService.showTabs('real-owner');
              }
              if (!generalInfo?.hasSupplier) {
                this.onboardingService.hideTabs('resource-provider');
              } else {
                this.onboardingService.showTabs('resource-provider');
              }
              if (this.isMaintenance) {
                if (generalInfo.marriageType == '2') {
                  this.onboardingService.showTabs('spouse');
                } else {
                  this.onboardingService.hideTabs('spouse');
                }
              }

            }
          }
        }

      }


    });
  }

  onFormGroupReceived(formGroup: FormGroup): void {
    this.receivedFormGroup = formGroup;
  }

  /**
   * Ng On Init
   */
  ngOnInit(): void {
    this.catalogsService.getCountry({ land: [] }).subscribe(c => {
      this.countries.set(c);
    });
    this.catalogsService.getPhoneType({ telephoneTypeIds: [] }).subscribe(c => {
      this.phoneTypes.set(c);
    });
    this.catalogsService.getIdentificationType({ types: [] }).subscribe(c => {
      this.identifications.set(c);
    });
  }

  ngAfterViewInit(): void {
    const dataClientSignal = this.firstDataClientService.getDataClientSignal();

    if (this.isMaintenance) {
      formFunctionDis(this.clientDataComponent.profileForm);
      if (!this.permissionRolService.getPermissions()['customer-info'].allDisabled) {
        this.isMaintenanceE.set(false);
      }
    } else if (this.isCustomer) {
      formFunctionDis(this.clientDataComponent.profileForm);
    }

    /* se agrega validacion para mantener bloqueado el form cuando ya existe un dato en "requestId" */
    if (0 < this.onboardingService.getCurrentInfo().requestId.trim().length) {
      this.clientDataComponent.profileForm.disable();
      butonFunctionDis(['btnSave']);
    }

    // this.onboardingService.enableTabs();

  }

  editt() {
    if (this.permissionRolService.getPermissions()['customer-info'].allDisabled) {
    } else {
      if ((this.permissionRolService.getPermissions()['customer-info'].fieldsEnabled.length ?? 0) === 0) {
        if (this.data?.foreignerWithoutCurp === true) {
          formFunctionEnAll(this.clientDataComponent.profileForm, ['curp']);
        } else {
          formFunctionEnAll(this.clientDataComponent.profileForm);
        }
      } else {
        if (this.data?.foreignerWithoutCurp === true) {
          formFunctionEn(this.clientDataComponent.profileForm, this.permissionRolService.getPermissions()['customer-info'].fieldsEnabled, ['curp']);
        } else {
          formFunctionEn(this.clientDataComponent.profileForm, this.permissionRolService.getPermissions()['customer-info'].fieldsEnabled);
        }
      }
      buttonFunctionEn(this.permissionRolService.getPermissions()['customer-info'].buttonsEnabled);
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

  async onSubmit() {
    if (!this.isMaintenance) {
      document.body.classList.add('show-validation');
      this.unsavedChangesService.setUnsavedChanges(true);
      const resultData = this.clientDataComponent.submitID();
      this.unsavedChangesService.setUnsavedChanges(true);
      if (resultData != null) {
        this.listData = await this.searchClientFlowService.getDataWatchList(resultData);
        let homo: HomonymsResponseData = {
          passOnHomonyms: true,
          numberClient: null
        };
        if (this.listData.step != 1) {
          if (!this.isCustomer) {
            homo = await this.searchClientFlowService.validInHomonyms(resultData);
          }
        } else {
          await this.searchClientFlowService.getWatchListWF(this.listData);
        }
        console.log(homo)
        if (homo?.passOnHomonyms) {
          if (this.listData.step != 1) {
            const isPpe = this.listData?.matchLists.some(elemento => elemento.type.toLocaleUpperCase() === 'PPE' || elemento.type.toLocaleUpperCase() === 'PEPINT') ?? false;
            this.checkpointService.saveSection('initial-data', mapToCheckPointInitialData({
              ...resultData, ppe: isPpe, typeContractSubtypeId: this.onboardingService.getCustomerInitialData().typeContractSubtypeId,
              bankAreaTypeId: this.onboardingService.getCustomerInitialData().bankAreaTypeId,
              contraTypeId: this.onboardingService.getCustomerInitialData().contractTypeId
            }, false, this.id)).subscribe(async (result) => {
              if (this.isCustomer &&
                result['status'] === "PENDING" &&
                Array.isArray(result.data?.contracts) &&
                (result.data?.contracts?.length ?? 0) > 0) {
                const dataRes: SaveCheckpointResponse = result;

                if (dataRes.data) {
                  const mappedContracts = dataRes.data.contracts.map(c => ({
                    number: c.number,
                    titular: c.titular,
                    rfc: c.rfc,
                    subType: c.subType,
                    type: c.type || 'Activo',
                    date: c.date
                  }));
                  this.modalFormService.bankContractLinkingModal(mappedContracts).subscribe(async (selectedContract) => {
                    if (selectedContract) {
                      this.checkpointService.saveSection('initial-data', ({
                        ...mapToCheckPointInitialData({
                          ...resultData, ppe: isPpe, typeContractSubtypeId: this.onboardingService.getCustomerInitialData().typeContractSubtypeId,
                          bankAreaTypeId: this.onboardingService.getCustomerInitialData().bankAreaTypeId,
                          contraTypeId: this.onboardingService.getCustomerInitialData().contractTypeId
                        }, false, this.id),
                        relatedContract: {
                          number: Number(selectedContract.number),
                          type: Number(selectedContract.type),
                          subType: Number(selectedContract.subType)
                        }
                      })).subscribe(async (result) => {
                        if (result['status'] === "CREATED") {
                          this.notificationService.success('¡Excelente! Continua en la Siguiente Sección', 'El ID de Solicitud ha Sido Creado: ' + result['applicationNumber']);
                          this.onboardingService.updateCurrentOnboardingInfo({
                            requestId: result['applicationNumber'],
                            name: concatFullName(
                              resultData.firstName,
                              resultData.middleName,
                              resultData.firstLastName,
                              resultData.secondLastName,
                            )
                          });
                          if (this.listData.step === 2) {
                            const general = await lastValueFrom(this.checkpointService.saveSection('general-information', mapGeneralInfoInit(this.generalInfoStorageService.generalInfoItem())));
                          }
                          await this.searchClientFlowService.getWatchListWF(this.listData);
                          this.firstDataClientService.setItem(
                            mapToCheckPointInitialData({ ...resultData, ppe: isPpe }, false, this.id)
                          );
                          this.clientDataComponent.profileForm.disable();
                          butonFunctionDis(['btnSave']);

                          this.unsavedChangesService.setUnsavedChanges(false);
                          this.firstSave = true;
                          this.data = this.onboardingService.getCustomerInitialData();
                          this.onboardingService.enableTabs(['general-info']);
                        }
                      });
                    }
                  });
                }
              } else {
                if (result['status'] === "CREATED") {
                  this.notificationService.success('¡Excelente! Continua en la Siguiente Sección', 'El ID de Solicitud ha Sido Creado: ' + result['applicationNumber']);
                  this.onboardingService.updateCurrentOnboardingInfo({
                  requestId: result['applicationNumber'],
                  name: concatFullName(
                    resultData.firstName,
                    resultData.middleName,
                    resultData.firstLastName,
                    resultData.secondLastName,
                  )
                  });
                  if (!this.isCustomer && this.listData.step === 2) {
                    const general = await lastValueFrom(this.checkpointService.saveSection('general-information', DEFAULT_PERSON_DATA));
                  }
                  if (this.isCustomer && this.listData.step === 2) {
                    const general = await lastValueFrom(this.checkpointService.saveSection('general-information', mapGeneralInfoInit(this.generalInfoStorageService.generalInfoItem())));
                  }
                  await this.searchClientFlowService.getWatchListWF(this.listData);
                  this.firstDataClientService.setItem(
                    mapToCheckPointInitialData({ ...resultData, ppe: isPpe }, false, this.id)
                  );
                  this.clientDataComponent.profileForm.disable();
                  butonFunctionDis(['btnSave']);
                  this.unsavedChangesService.setUnsavedChanges(false);
                  this.firstSave = true;
                  this.data = this.onboardingService.getCustomerInitialData();
                  this.onboardingService.enableTabs(['general-info']);
                }
              }
            });
          }
        } else if (homo?.numberClient) {
          formFunctionDis(this.clientDataComponent.profileForm);
          this.customerInformationService.getCustomerInfo(homo?.numberClient ?? 0).subscribe(async data => {
            this.isCustomer = true;
            this.onboardingService.updateCurrentOnboardingInfo({
              isCustomer: true,
              clientId: homo?.numberClient ?? 0
            });
            this.firstDataClientService.setItem(mapToSignalInitialDataCustomer(data.initialData ?? null));
            this.ppeService.set(mapToSignalPPECustomer(data.ppeInformation ?? null));
            this.addressesService.set(mapToSignalAddressCustomer(data.addresses ?? null));
            const generalInfo = existingClientToGeneralInfo(data.generalInformation ?? null);
            generalInfo ? this.generalInfoStorageService.setGeneralInfoItem(generalInfo) : console.log('No hay general info');
            const dataSig = this.firstDataClientService.getItem();
            const dataIdent = {
              manifestLetter: false,
              identifications: data.identifications,
              telephones: data.telephones,
              emails: data.emails,
            }
            const info = await exitentedToIdentificationAndContact(dataIdent, this.phoneTypes(), this.countries(), this.identifications());
            this.pageStorageService.setIdentificationAndContactInfo(info);
            if (dataSig != null) {
              this.clientDataComponent.setData({
                ...mapToClient(dataSig),
                typeContractSubtypeId: this.onboardingService.getCustomerInitialData().typeContractSubtypeId,
                bankAreaTypeId: this.onboardingService.getCustomerInitialData().bankAreaTypeId,
                contraTypeId: this.onboardingService.getCustomerInitialData().contractTypeId
              });
            }
            this.notificationService.success('Se Continua con el Cliente: ' + homo?.numberClient);
          });
        }
      }
    } else {
      document.body.classList.add('show-validation');
      this.unsavedChangesService.setUnsavedChanges(true);
      const resultData = this.clientDataComponent.submitID();
      this.unsavedChangesService.setUnsavedChanges(true);
      if (resultData != null) {
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
                typeIden: resultData.typeIden,
                rfc: resultData.rfc,
                curp: resultData.curp
              }
            }
          );
          console.log(resultFlow);
          if (resultFlow) {
            this.checkpointService.saveSectionMant('initial-data', mapToCheckPointInitialData(resultData, true, this.id)).subscribe((result) => {
              if (result['status'] === "CREATED") {
                this.firstDataClientService.setItem(mapToCheckPointInitialData(resultData, true, this.id));
                this.clientDataComponent.profileForm.disable();
                butonFunctionDis(['btnSave', 'btnCancel']);
                buttonFunctionEn(['btnEdit']);
                this.unsavedChangesService.setUnsavedChanges(false);
                this.onboardingService.updateCurrentOnboardingInfo({
                  requestId: result['applicationNumber'],
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
