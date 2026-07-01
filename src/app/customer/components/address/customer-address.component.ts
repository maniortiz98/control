import { Component, inject, signal, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CustomerAddressSectionComponent } from '../sections/address-section/customer-address-section.component';
import { CustomerFirstDataClientService } from '../../services/storage-services/customer-first-data-client.service';
import { DataClient } from '../../models/customer-client-data';
import { CustomerCatalogsService } from '../../services/customer-catalogs.service';
import { CustomerZipCodeService } from '../../services/customer-zip-code.service';
import { CustomerNotificationsService } from '../../services/customer-notifications.service';
import { CustomerAddress, CustomerAddressRole, CustomerAddressType, CustomerProofOfAddressType } from '../../models/customer-address';
import { CustomerAddressService } from '../../services/storage-services/customer-address.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { CustomerAddressesService } from '../../services/storage-services/customer-addresses.service';
import { CustomerNotificationModalService } from '../../services/customer-notification-modal.service';
import { CustomerCheckpointService } from '../../services/customer-customer-checkpoint-core.service';
import { mapFormToCheckPointAddress } from '../../services/mappers/customer-address.mapper';
import { Data } from '../../models/checkpoints/customer-initial-data-checkpoint';
// @ts-ignore
import { disableFormGroupWithExceptions } from '../../../shared/constants/roles';
import { CustomerOnboardingService } from '../../services/customer-onboarding.service';
import { ConfigDataTable } from '../../../shared/components/table-results/interfaces';
import { PermissionRolService } from '../../../core/services/rol.service';
import { butonFunctionDis, buttonFunctionEn, formFunctionDis, formFunctionEnAll } from '../../utils/customer-disable-or-enabled';
import { firstValueFrom } from 'rxjs';
import { mapToSignalAddressCustomer } from '../../services/mappers/mappers-get-client/address';

@Component({
  selector: 'app-customer-address',
  standalone: false,
  templateUrl: './customer-address.component.html',
  styleUrl: './customer-address.component.scss'
})
export class CustomerAddressComponent {
  private _addressSectionComponent?: CustomerAddressSectionComponent;

  @ViewChild(CustomerAddressSectionComponent)
  set addressSectionComponent(component: CustomerAddressSectionComponent | undefined) {
    if (component) {
      this._addressSectionComponent = component;
      if (this.isMaintenance) {
        formFunctionDis(component.profileForm);

        if (!this.permissionRolService.getPermissions()['address'].allDisabled) {
          this.isMaintenanceEdit.set(false);
        }
      }
    }
  }

  get addressSectionComponent(): CustomerAddressSectionComponent {
    return this._addressSectionComponent!;
  }
  readonly firstDataClientService = inject(CustomerFirstDataClientService);
  readonly catalogService = inject(CustomerCatalogsService);
  readonly addressService = inject(CustomerAddressService);
  readonly addressesService = inject(CustomerAddressesService);
  readonly notificationService = inject(CustomerNotificationsService);
  readonly unsavedChangesService = inject(UnsavedChangesService);
  readonly notificationModalService = inject(CustomerNotificationModalService);
  private readonly checkpointService = inject(CustomerCheckpointService);
  private readonly onboardingService = inject(CustomerOnboardingService);
  isMaintenance: boolean = this.onboardingService.getCurrentInfo().isMaintenance
  auxMant: boolean = false;
  private readonly permissionRolService = inject(PermissionRolService);
  isMaintenanceEdit = signal<boolean>(true);


  readonly domicileRoles = signal<CustomerAddressRole[]>([]);
  readonly domicileTypes = signal<CustomerAddressType[]>([]);
  readonly domiliceProof = signal<CustomerProofOfAddressType[]>([]);
  columns: Array<any> = [];
  dataAddres: Array<CustomerAddress> = [];
  address: CustomerAddress | null = null;
  dataClient: Data | null = null;
  config: ConfigDataTable = {
    showPag: true,
    showEditAction: true,
    showDeleteAction: true,
    showViewAction: false,
    multipleSelection: false,

    idName: 'tr_tempid',
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
      dataAddresses.addressList.forEach(item => this.addressService.add(item));
      this.dataAddres = this.addressService.getAll()?.map(item => ({
        ...item,
        addressRole: this.searchAddressRoleNameById(item.addressRole || ''),
        addressType: this.searchAddressTypeNameById(item.addressType),
        proofOfAddressType: this.searchProofOfAddressTypeNameById(item.proofOfAddressType ?? "")
      }));
    }
    this.columns = [
      { name: 'addressRole', title: 'Rol de Domicilio', show: false, type: '' },
      { name: 'addressType', title: 'Tipo de Domicilio', show: true, type: '' },
      { name: 'postalCode', title: 'C.P.', show: true, type: '' },
      { name: 'proofOfAddressType', title: 'Comprobante de Domicilio', show: true, type: '' }
    ];
  }

  ngAfterViewInit() {
    if (this.isMaintenance) {
      if (!this.permissionRolService.getPermissionsCustomer()['address'].allDisabled) {
        this.isMaintenanceEdit.set(false);
        this.config = {
          showPag: true,
          showEditAction: true,
          showDeleteAction: false,
          showViewAction: false,
          isSelected: false,
          multipleSelection: false,
          idName: 'tr_tempid',
          singleSelection: { show: false, title: '', propertyName: 'customProperty' },
        };
      }
    }
  }

  editt() {
    this.address = null;
    this.addressSectionComponent.profileForm.reset();
    this.addressSectionComponent.resetColonyCP()
    if (this.permissionRolService.getPermissionsCustomer()['address'].allDisabled) {
    } else {

      this.config = {
        showPag: true,
        showEditAction: this.permissionRolService.getPermissionsCustomer()['address']['permission'].includes('edit'),
        showDeleteAction: this.permissionRolService.getPermissionsCustomer()['address']['permission'].includes('delete'),
        showViewAction: false,
        isSelected: false,
        multipleSelection: false,
        idName: 'tr_tempid',
        singleSelection: { show: false, title: '', propertyName: 'customProperty' },
      };

      if (this.permissionRolService.getPermissionsCustomer()['address']['permission'].includes('add')) {
        formFunctionEnAll(this.addressSectionComponent.profileForm);
        const country = this.addressSectionComponent.profileForm.get('country')?.value;
        this.addressSectionComponent.enableDisableFECityMun(country);
        buttonFunctionEn(['btnAddAddress', 'btnCancel', 'btnSaveAddress']);
        butonFunctionDis(['btnEdit']);
      }
      if (this.permissionRolService.getPermissionsCustomer()['address']['permission'].includes('edit')) {
        if (!this.permissionRolService.getPermissionsCustomer()['address']['permission'].includes('add')) {
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
      this.dataAddres = this.addressService.getAll()?.map(item => ({
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
      showPag: true,
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
          if (this.addressService.update(this.address.idFront ?? '', {
            ...dataAddress, addressId: this.address.addressId,
            addressAccountId: this.address.addressAccountId,
            id: this.address.id,
            active: this.address.active,
            idFront: this.address.idFront
          })) {
            if (this.isMaintenance && this.auxMant) {
              if (this.permissionRolService.getPermissionsCustomer()['address']['permission'].includes('edit')) {
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
              if (this.permissionRolService.getPermissionsCustomer()['address']['permission'].includes('edit')) {
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
    const dataSave = this.addressService.getAll();
    if (dataSave.length >= 1) {
      if (!this.isMaintenance) {
        this.checkpointService.saveSection('address', mapFormToCheckPointAddress(dataSave, this.isMaintenance)).subscribe((result) => {
          if (result['status'] === "CREATED") {
            this.addressesService.set({ addressList: dataSave });
            this.unsavedChangesService.setUnsavedChanges(false);
            this.notificationService.success('Guardado con éxito');
          }
        });
      } else if (this.isMaintenance) {
        this.checkpointService.saveSectionNonContract('address', mapFormToCheckPointAddress(dataSave, this.isMaintenance, this.addressesService.getCopy())).subscribe(async (result) => {
          if (result['status'] === "UPDATED") {
            await this.update()
            this.unsavedChangesService.setUnsavedChanges(false);
            this.notificationService.success('Guardado con éxito');
            formFunctionDis(this.addressSectionComponent.profileForm);
            buttonFunctionEn(['btnEdit']);
            butonFunctionDis(['btnAddAddress', 'btnCancel', 'btnSaveAddress']);
            this.auxMant = false;
            this.config = {
              showPag: true,
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
      }
    } else {
      this.notificationService.error('Debe haber al menos un domicilio registrado.');
    }
  }

  async update() {
    this.addressService.clear();
    this.checkpointService.getSectionsByCustomer()
      .subscribe({
        next: async (response: any) => {
          await this.onboardingService.getCustomerInfo(response);
          const dataAddresses = this.addressesService.get();
          if (dataAddresses) {
            if (this.isMaintenance === true) {
              const activeList = dataAddresses.addressList.filter(item => item.active !== false);
              activeList.forEach(item => this.addressService.add(item));
              this.dataAddres = this.addressService.getAll()?.map(item => ({
                ...item,
                addressRole: this.searchAddressRoleNameById(item.addressRole || ''),
                addressType: this.searchAddressTypeNameById(item.addressType),
                proofOfAddressType: this.searchProofOfAddressTypeNameById(item.proofOfAddressType ?? ""),
              }));
            }
          }
        },
        error: (err) => {
        },
        complete: () => {
        }
      });
  }


  rowSelected(event: any): void {
  }

  async eventRow(event: any): Promise<void> {
    if (event.type === 'edit') {
      this.unsavedChangesService.setUnsavedChanges(true);
      if (this.isMaintenance) {
        if (event.row.addressAccountId) {
          const result = await this.notificationModalService.confirm({
            title: 'Este es un domicilio registrado en una o varias cuentas. ¿Desea continuar?',
            btnAccept: 'Sí',
            btnDeny: 'No',
          });
          if (result?.value != true) {
            return;
          }
        }
        this.address = {
          ...event.row,
          addressId: event.row.addressId,
          addressAccountId: event.row.addressAccountId,
          addressRole: this.searchAddressRoleNameByName(event.row.addressRole),
          addressType: this.searchIdByAddressTypeName(event.row.addressType),
          proofOfAddressType: this.searchIdByProofOfAddressTypeName(event.row.proofOfAddressType ?? "")
        };
      } else {
        this.address = {
          ...event.row,
          addressRole: this.searchAddressRoleNameByName(event.row.addressRole),
          addressType: this.searchIdByAddressTypeName(event.row.addressType),
          proofOfAddressType: this.searchIdByProofOfAddressTypeName(event.row.proofOfAddressType ?? "")
        };
      }
      this.addressSectionComponent.setAddresData(this.address);
      if (this.isMaintenance && this.auxMant) {
        if (this.permissionRolService.getPermissionsCustomer()['address']['permission'].includes('edit')) {
          formFunctionEnAll(this.addressSectionComponent.profileForm);
          buttonFunctionEn(['btnAddAddress']);
        }
      }
    }
    if (event.type === 'delete') {
      this.unsavedChangesService.setUnsavedChanges(true);
      if (this.dataAddres.length > 1) {
        if (this.isMaintenance) {
          if (event.row.addressAccountId) {
            const result = await this.notificationModalService.confirm({
              title: 'Este es un domicilio registrado en una o varias cuentas. ¿Desea continuar?',
              btnAccept: 'Sí',
              btnDeny: 'No',
            });
            if (result?.value != true) {
              return;
            }
          }
        }
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






















