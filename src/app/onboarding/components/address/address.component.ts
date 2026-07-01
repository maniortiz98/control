import { Component, inject, signal, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AddressSectionComponent } from '../../../shared/components/sections/address-section/address-section.component';
import { FirstDataClientService } from '../../../shared/services/storage-services/first-data-client.service';
import { DataClient } from '../../models/client-data';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { ZipCodeService } from '../../../shared/services/zip-code.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { Address, AddressRole, AddressType, ProofOfAddressType } from '../../models/address';
import { AddressService } from '../../../shared/services/storage-services/address.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { AddressesService } from '../../../shared/services/storage-services/addresses.service';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { mapFormToCheckPointAddress } from '../../services/mappers/addres.mapper';
import { Data } from '../../models/checkpoints/initial-data-checkpoint';
import { disableFormGroupWithExceptions } from './roles';
import { OnboardingService } from '../../services/onboarding.service';
import { butonFunctionDis, buttonFunctionEn, formFunctionDis, formFunctionEnAll } from '../../../shared/utils/disableOrEnabled';
import { PermissionRolService } from '../../../core/services/rol.service';
import { ConfigDataTable } from '../../../shared/components/table-results/interfaces';
import { firstValueFrom } from 'rxjs';
import { mapToSignalAddressM } from '../../services/mappers/maintenance/respnse/address';

@Component({
  selector: 'app-address',
  standalone: false,
  templateUrl: './address.component.html',
  styleUrl: './address.component.scss'
})
export class AddressComponent {
  private _addressSectionComponent?: AddressSectionComponent;

  @ViewChild(AddressSectionComponent)
  set addressSectionComponent(component: AddressSectionComponent | undefined) {
    if (component) {
      this._addressSectionComponent = component;
      if (this.isMaintenance) {
        formFunctionDis(component.profileForm);

        if (!this.permissionRolService.getPermissions()['address'].allDisabled) {
          this.isMaintenanceE.set(false);
        }
      }
    }
  }

  get addressSectionComponent(): AddressSectionComponent {
    return this._addressSectionComponent!;
  }

  readonly firstDataClientService = inject(FirstDataClientService);
  readonly catalogService = inject(CatalogsService);
  readonly addressService = inject(AddressService);
  readonly addressesService = inject(AddressesService);
  readonly notificationService = inject(NotificationsService);
  readonly unsavedChangesService = inject(UnsavedChangesService);
  readonly notificationModalService = inject(NotificationModalService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly onboardingService = inject(OnboardingService);
  isMaintenance: boolean = this.onboardingService.getCurrentInfo().isMaintenance
  isMaintenanceE = signal<boolean>(true);
  isCustomer: boolean = this.onboardingService.getCurrentInfo().isCustomer
  private readonly permissionRolService = inject(PermissionRolService);



  readonly domicileRoles = signal<AddressRole[]>([]);
  readonly domicileTypes = signal<AddressType[]>([]);
  readonly domiliceProof = signal<ProofOfAddressType[]>([]);
  columns: Array<any> = [];
  dataAddres: Array<Address> = [];
  address: Address | null = null;
  dataClient: Data | null = null;
  auxMant: boolean = false;
  config: ConfigDataTable = {
    showPag: false,
    showEditAction: true,
    showDeleteAction: true,
    showViewAction: false,
    multipleSelection: false,
    idName: 'tr_tempid',
    isSelected: false,
    singleSelection: { show: false, title: '', propertyName: 'customProperty' },
  };
  cargando = true;


  async ngOnInit(): Promise<void> {
    const [roles, types, proof] = await Promise.all([
      firstValueFrom(this.catalogService.getAddressRole({ idRolDomicilioCve: [] })),
      firstValueFrom(this.catalogService.getAddressType({ addressTypeIds: [] })),
      firstValueFrom(this.catalogService.getProofOfAddress({ proofAddressIds: [] }))
    ]);

    this.domicileRoles.set(roles);
    this.domicileTypes.set(types);
    this.domiliceProof.set(proof);

    this.addressService.clear();
    const data = this.firstDataClientService.getItem();
    if (data) {
      this.dataClient = data;
      this.cargando = false;
    }else{
      this.cargando = false;
    }

    const dataAddresses = this.addressesService.get();
    if (dataAddresses) {
      if (this.isMaintenance === true) {
        const activeList = dataAddresses.addressList.filter(item => item.active !== false);
        activeList.forEach(item => this.addressService.add(item));
        this.dataAddres = this.addressService.getAll().map(item => ({
          ...item,
          addressRole: this.searchAddressRoleNameById(item.addressRole || ''),
          addressType: this.searchAddressTypeNameById(item.addressType),
          proofOfAddressType: this.searchProofOfAddressTypeNameById(item.proofOfAddressType ?? ""),
        }));
      } else {
        dataAddresses.addressList.forEach(item => this.addressService.add(item));
        this.dataAddres = this.addressService.getAll().map(item => ({
          ...item,
          addressRole: this.searchAddressRoleNameById(item.addressRole || ''),
          addressType: this.searchAddressTypeNameById(item.addressType),
          proofOfAddressType: this.searchProofOfAddressTypeNameById(item.proofOfAddressType ?? "")
        }));
      }
    }
    this.columns = [
      { name: 'addressRole', title: 'Rol de Domicilio', show: true, type: 'string' },
      { name: 'addressType', title: 'Tipo de Domicilio', show: true, type: 'string' },
      { name: 'postalCode', title: 'C.P.', show: true, type: 'string' },
      { name: 'proofOfAddressType', title: 'Comprobante de Domicilio', show: true, type: 'string' }
    ];
    if (this.isMaintenance) {
      this.config = {
        showPag: false,
        showEditAction: true,
        showDeleteAction: false,
        showViewAction: false,
        multipleSelection: false,
        isSelected: false,
        idName: 'tr_tempid',
        singleSelection: { show: false, title: '', propertyName: 'customProperty' },
      };
    }
  }

  // ngAfterViewInit() {
  //   if (this.isMaintenance) {
  //     formFunctionDis(this.addressSectionComponent.profileForm);
  //     if (!this.permissionRolService.getPermissions()['address'].allDisabled) {
  //       this.isMaintenanceE.set(false);
  //     }
  //   } else if (this.isCustomer) {

  //   }
  // }

  async update(){
    this.addressService.clear();
    const response = await firstValueFrom(this.checkpointService.getMaintenanceSectionByPersonaFisica(['address']));
    this.addressesService.set(mapToSignalAddressM(response['checkpoints'][0]['data']));
    this.addressesService.setCopy(this.addressesService.get() ?? { addressList: [] });
    const dataAddresses = this.addressesService.get();
    if (dataAddresses) {
      if (this.isMaintenance === true) {
        const activeList = dataAddresses.addressList.filter(item => item.active !== false);
        activeList.forEach(item => this.addressService.add(item));
        this.dataAddres = this.addressService.getAll().map(item => ({
          ...item,
          addressRole: this.searchAddressRoleNameById(item.addressRole || ''),
          addressType: this.searchAddressTypeNameById(item.addressType),
          proofOfAddressType: this.searchProofOfAddressTypeNameById(item.proofOfAddressType ?? ""),
        }));
      } else {
        dataAddresses.addressList.forEach(item => this.addressService.add(item));
        this.dataAddres = this.addressService.getAll().map(item => ({
          ...item,
          addressRole: this.searchAddressRoleNameById(item.addressRole || ''),
          addressType: this.searchAddressTypeNameById(item.addressType),
          proofOfAddressType: this.searchProofOfAddressTypeNameById(item.proofOfAddressType ?? "")
        }));
      }
    }
  }

  editt() {
    this.address = null;
    this.addressSectionComponent.profileForm.reset();
    this.addressSectionComponent.resetColonyCP()
    if (this.permissionRolService.getPermissions()['address'].allDisabled) {
    } else {

      this.config = {
        showPag: false,
        showEditAction: this.permissionRolService.getPermissions()['address'].edit,
        showDeleteAction: this.permissionRolService.getPermissions()['address'].delete,
        showViewAction: false,
        isSelected: false,
        multipleSelection: false,
        idName: 'tr_tempid',
        singleSelection: { show: false, title: '', propertyName: 'customProperty' },
      };

      if (this.permissionRolService.getPermissions()['address'].add) {
        formFunctionEnAll(this.addressSectionComponent.profileForm);
        const country = this.addressSectionComponent.profileForm.get('country')?.value;
        this.addressSectionComponent.enableDisableFECityMun(country);
        buttonFunctionEn(['btnAddAddress', 'btnCancel', 'btnSaveAddress']);
        butonFunctionDis(['btnEdit']);
      }
      if (this.permissionRolService.getPermissions()['address'].edit) {
        if (!this.permissionRolService.getPermissions()['address'].add) {
          this.auxMant = true;
          buttonFunctionEn(['btnCancel', 'btnSaveAddress']);
          butonFunctionDis(['btnEdit']);
        }
      }
    }
  }

  cancel() {
    const dataAddresses = this.addressesService.get();
    this.addressSectionComponent.profileForm.reset();
    this.addressSectionComponent.resetColonyCP()
    if (dataAddresses) {
      dataAddresses.addressList.forEach(item => (
        this.addressService.add(item)));
      this.dataAddres = this.addressService.getAll().map(item => ({
        ...item,
        addressRole: this.searchAddressRoleNameById(item.addressRole || ''),
        addressType: this.searchAddressTypeNameById(item.addressType),
        proofOfAddressType: this.searchProofOfAddressTypeNameById(item.proofOfAddressType ?? "")
      }));
    }
    formFunctionDis(this.addressSectionComponent.profileForm);
    buttonFunctionEn(['btnEdit']);
    butonFunctionDis(['btnAddAddress', 'btnCancel', 'btnSaveAddress']);
    this.auxMant = false;
    this.config = {
      showPag: false,
      showEditAction: true,
      showDeleteAction: false,
      showViewAction: false,
      isSelected: false,
      multipleSelection: false,
      idName: 'tr_tempid',
      singleSelection: { show: false, title: '', propertyName: 'customProperty' },
    };

  }

  async addAddress() {
    const dataAddress = await this.addressSectionComponent.onSubmit();
    if (dataAddress != null) {
      if (this.address === null) {
        if (this.addressService.add(dataAddress)) {
          const dataAddresses = this.addressService.getAll();
          this.dataAddres = dataAddresses.map(item => ({
            ...item,
            addressRole: this.searchAddressRoleNameById(item.addressRole || ''),
            addressType: this.searchAddressTypeNameById(item.addressType),
            proofOfAddressType: this.searchProofOfAddressTypeNameById(item.proofOfAddressType ?? "")
          }));
          this.addressSectionComponent.profileForm.reset();
          this.addressSectionComponent.resetColonyCP();
          this.notificationService.success('¡Registro de domicilio exitoso!', 'Se ha agregado correctamente');
          this.unsavedChangesService.setUnsavedChanges(true);
        } else {
          this.notificationService.error('Debe Proporcionarse un Domicilio Distinto al Registro Previo');
        }
      } else {
        if (this.isMaintenance) {
          console.log(this.address);
          if (this.addressService.update(this.address.idFront ?? '', {
            ...dataAddress, addressId: this.address.addressId,
            addressAccountId: this.address.addressAccountId,
            id: this.address.id,
            active: this.address.active,
            idFront: this.address.idFront
          })) {
            if (this.isMaintenance && this.auxMant) {
              if (this.permissionRolService.getPermissions()['address'].edit) {
                formFunctionDis(this.addressSectionComponent.profileForm);
                butonFunctionDis(['btnAddAddress']);
              }
            }
            const dataAddresses = this.addressService.getAll();
            this.dataAddres = dataAddresses.map(item => ({
              ...item,
              addressRole: this.searchAddressRoleNameById(item.addressRole || ''),
              addressType: this.searchAddressTypeNameById(item.addressType),
              proofOfAddressType: this.searchProofOfAddressTypeNameById(item.proofOfAddressType ?? "")
            }));
            this.addressSectionComponent.profileForm.reset();
            this.addressSectionComponent.resetColonyCP();
            this.address = null;
            this.notificationService.success('¡Registro de domicilio exitoso!', 'Se ha agregado correctamente');
            this.unsavedChangesService.setUnsavedChanges(true);
          } else {
            this.notificationService.error('Debe Proporcionarse un Domicilio Distinto al Registro Previo');
          }
        } else {
          if (this.addressService.update(this.address.idFront ?? '', { ...dataAddress, idFront: this.address.idFront })) {
            if (this.isMaintenance && this.auxMant) {
              if (this.permissionRolService.getPermissions()['address'].edit) {
                formFunctionDis(this.addressSectionComponent.profileForm);
                butonFunctionDis(['btnAddAddress']);
              }
            }
            const dataAddresses = this.addressService.getAll();
            this.dataAddres = dataAddresses.map(item => ({
              ...item,
              addressRole: this.searchAddressRoleNameById(item.addressRole || ''),
              addressType: this.searchAddressTypeNameById(item.addressType),
              proofOfAddressType: this.searchProofOfAddressTypeNameById(item.proofOfAddressType ?? "")
            }));
            this.addressSectionComponent.profileForm.reset();
            this.addressSectionComponent.resetColonyCP();
            this.address = null;
            this.notificationService.success('¡Registro de domicilio exitoso!', 'Se ha agregado correctamente');
            this.unsavedChangesService.setUnsavedChanges(true);
          } else {
            this.notificationService.error('Debe Proporcionarse un Domicilio Distinto al Registro Previo');
          }
        }
      }
    }
  }

  save() {
    if (!this.isMaintenance) {
      const dataSave = this.addressService.getAll();
      if (dataSave.length >= 1) {
        const filteredData = dataSave.filter(item => item.addressRole === "5");
        if (filteredData.length > 0) {
          this.checkpointService.saveSection('address', mapFormToCheckPointAddress(dataSave, false)).subscribe((result) => {
            if (result['status'] === "CREATED") {
              this.addressesService.set({ addressList: dataSave });
              this.unsavedChangesService.setUnsavedChanges(false);
              this.notificationService.success('Guardado con éxito');
            }
          });
        } else {
          this.notificationService.error('El Registro de un Domicilio de Residencia es Obligatorio para Continuar el Proceso.');
        }
      } else {
        this.notificationService.error('Debe haber al menos un domicilio registrado.');
      }
    } else {
      const dataSave = this.addressService.getAll();
      if (dataSave.length >= 1) {
        const filteredData = dataSave.filter(item => item.addressRole === "5");
        if (filteredData.length > 0) {
          this.checkpointService.saveSectionMant('address', mapFormToCheckPointAddress(dataSave, true, this.addressesService.getCopy())).subscribe(async (result) => {
            if (result['status'] === "CREATED") {
              await this.update()
              this.unsavedChangesService.setUnsavedChanges(false);
              this.notificationService.success('Guardado con éxito');
              formFunctionDis(this.addressSectionComponent.profileForm);
              buttonFunctionEn(['btnEdit']);
              butonFunctionDis(['btnAddAddress', 'btnCancel', 'btnSaveAddress']);
              this.auxMant = false;
              this.config = {
                showPag: false,
                showEditAction: true,
                showDeleteAction: false,
                showViewAction: false,
                isSelected: false,
                multipleSelection: false,
                idName: 'tr_tempid',
                singleSelection: { show: false, title: '', propertyName: 'customProperty' },
              };
            }
          });
        } else {
          this.notificationService.error('El Registro de un Domicilio de Residencia es Obligatorio para Continuar el Proceso.');
        }
      } else {
        this.notificationService.error('Debe haber al menos un domicilio registrado.');
      }
    }
  }


  rowSelected(event: any): void {
  }

  async eventRow(event: any): Promise<void> {
    if (event.type === 'edit') {
      this.unsavedChangesService.setUnsavedChanges(true);
      if (this.isMaintenance) {
        this.address = {
          ...event.row,
          addressId: event.row.addressId,
          addressAccountId: event.row.addressAccountId,
          addressRole: this.searchAddressRoleNameByName(event.row.addressRole),
          addressType: this.searchIdByAddressTypeName(event.row.addressType),
          proofOfAddressType: this.searchIdByProofOfAddressTypeName(event.row.proofOfAddressType ?? "")
        };
      } else if (this.isCustomer) {
        this.address = {
          ...event.row,
          addressRole: this.searchAddressRoleNameByName(event.row.addressRole),
          addressType: this.searchIdByAddressTypeName(event.row.addressType),
          proofOfAddressType: this.searchIdByProofOfAddressTypeName(event.row.proofOfAddressType ?? "")
        };
        console.log(event.row.isSaved, event.row.isView)
        if (event.row.isSaved && event.row.isView) {
          formFunctionDis(this.addressSectionComponent.profileForm);
          const country = this.addressSectionComponent.profileForm.get('country')?.value;
          this.addressSectionComponent.enableDisableFECityMun(country);
          butonFunctionDis(['btnAddAddress']);
        } else {
          formFunctionEnAll(this.addressSectionComponent.profileForm);
          buttonFunctionEn(['btnAddAddress']);
        }

      } else {
        this.address = {
          ...event.row,
          addressRole: this.searchAddressRoleNameByName(event.row.addressRole),
          addressType: this.searchIdByAddressTypeName(event.row.addressType),
          proofOfAddressType: this.searchIdByProofOfAddressTypeName(event.row.proofOfAddressType ?? "")
        };
      }
      this.addressSectionComponent.setAddresData(this.address);
      // if (this.isMaintenance && this.auxMant) {
      //   formFunctionDis(this.addressSectionComponent.profileForm);
      // }
      if (this.isMaintenance && this.auxMant) {
        if (this.permissionRolService.getPermissions()['address'].edit) {
          formFunctionEnAll(this.addressSectionComponent.profileForm);
          buttonFunctionEn(['btnAddAddress']);
        }
      }

      // if (event.row.isSaved) {
      //   butonFunctionDis(['btnAddAddress']);
      // } else {
      //   buttonFunctionEn(['btnAddAddress']);
      // }
    }
    if (event.type === 'delete') {
      this.unsavedChangesService.setUnsavedChanges(true);
      if (this.dataAddres.length > 1) {
        const result = await this.notificationModalService.confirm({
          title: 'Confirmar eliminar el registro',
          btnAccept: 'Sí, eliminar',
          btnDeny: 'No',
        });
        if (result?.value === true) {
          this.address = {
            ...event.row,
            addressRole: this.searchAddressRoleNameByName(event.row.addressRole),
            addressType: this.searchIdByAddressTypeName(event.row.addressType),
            proofOfAddressType: this.searchIdByProofOfAddressTypeName(event.row.proofOfAddressType ?? "")
          };
          this.addressService.delete(this.address?.idFront ?? "");
          const dataAddresses = this.addressService.getAll();
          this.dataAddres = dataAddresses.map(item => ({
            ...item,
            addressRole: this.searchAddressRoleNameById(item.addressRole || ''),
            addressType: this.searchAddressTypeNameById(item.addressType),
            proofOfAddressType: this.searchProofOfAddressTypeNameById(item.proofOfAddressType ?? "")
          }));
          this.unsavedChangesService.setUnsavedChanges(true);
          this.notificationService.success('¡Domicilio Eliminado con Éxito!', 'Se eliminó el registro de domicilio.');
          this.address = null;
        }

      } else {
        this.notificationService.error('Debe Haber al Menos un Domicilio Registrado.');
      }
    }
  }

  eventPage(event: PageEvent): void {
  }

  searchAddressTypeNameById(id: string): string {
    const domicileTypes = this.domicileTypes();
    const data = domicileTypes.find(dat => dat.addressTypeId === id);
    return data ? data.addressType : '';
  }

  searchProofOfAddressTypeNameById(id: string): string {
    const domiliceProof = this.domiliceProof();
    const dat = domiliceProof.find(dat => dat.proofAddressId === id);
    return dat ? dat.proofAddress : '';
  }

  searchIdByAddressTypeName(name: string): string {
    const domicileTypes = this.domicileTypes();
    const data = domicileTypes.find(dat => dat.addressType === name);
    return data ? data.addressTypeId : '';
  }

  searchIdByProofOfAddressTypeName(name: string): string {
    const domiliceProof = this.domiliceProof();
    const dat = domiliceProof.find(dat => dat.proofAddress === name);
    return dat ? dat.proofAddressId : '';
  }

  searchAddressRoleNameById(id: string): string {
    const domicileRoles = this.domicileRoles();
    const data = domicileRoles.find(dat => dat.idRolDomicilioCve === id);
    return data ? data.rolDomicilio : '';
  }

  searchAddressRoleNameByName(name: string): string {
    const domicileRoles = this.domicileRoles();
    const dat = domicileRoles.find(dat => dat.rolDomicilio === name);
    return dat ? dat.idRolDomicilioCve : '';
  }
}
