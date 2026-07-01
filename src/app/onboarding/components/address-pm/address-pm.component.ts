import { Component, inject, signal, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { mapFormToCheckPointAddress } from '../../services/mappers/addres.mapper';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { AddressService } from '../../../shared/services/storage-services/address.service';
import { FirstDataClientService } from '../../../shared/services/storage-services/first-data-client.service';
import { AddressType, ProofOfAddressType, Address } from '../../models/address';
import { AddressComponentPmComponent } from './address-component-pm/address-component-pm.component';
import { AddressesService } from '../../../shared/services/storage-services/pm/addresses.service';
import { Data } from '../../models/checkpoints/initial-data-checkpoint';
import { ConfigDataTable } from '../../../shared/components/table-results/interfaces';
import { OnboardingService } from '../../services/onboarding.service';
import { PermissionRolService } from '../../../core/services/rol.service';
import { butonFunctionDis, buttonFunctionEn, formFunctionDis, formFunctionEnAll } from '../../../shared/utils/disableOrEnabled';

@Component({
  selector: 'app-address-pm',
  standalone: false,
  templateUrl: './address-pm.component.html',
  styleUrl: './address-pm.component.scss'
})
export class AddressPmComponent {
  @ViewChild(AddressComponentPmComponent) addressSectionComponent!: AddressComponentPmComponent;
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
  private readonly permissionRolService = inject(PermissionRolService);

  readonly domicileRoles: string[] = ['FISCAL', 'POSTAL', 'SUCURSAL'];
  readonly domicileTypes = signal<AddressType[]>([]);
  readonly domiliceProof = signal<ProofOfAddressType[]>([]);
  columns: Array<any> = [];
  dataAddres: Array<Address> = [];
  address: Address | null = null;
  dataClient: Data | null = null;
  auxMant: boolean = false;
  config: ConfigDataTable = {
    showPag: false,
    showViewAction: false,
    showEditAction: true,
    showDeleteAction: true,
    multipleSelection: false,
    idName: 'tr_tempid',
    singleSelection: { show: false, title: '', propertyName: 'customProperty' },
  };

  ngOnInit(): void {

    this.catalogService.getAddressType({ addressTypeIds: [] }).subscribe(c => {
      this.domicileTypes.set(c);
    });

    this.catalogService.getProofOfAddress({ proofAddressIds: [] }).subscribe(c => {
      this.domiliceProof.set(c);
    });

    this.addressService.clear();
    const data = this.firstDataClientService.getItem();
    if (data) {
      this.dataClient = data;
    }
    const dataAddresses = this.addressesService.get();

    if (dataAddresses) {
      dataAddresses.addressList.forEach(item => (
        this.addressService.addPm(item)));
      this.dataAddres = dataAddresses.addressList.map(item => ({
        ...item,
        addressConcatenation: this.addressConcatenation(item.federalEntity, item.city, item.municipality, item.neighborhoodName || '', item.street, item.externalNumber, item.internalNumber || ''),
        addressType: this.searchAddressTypeNameById(item.addressType),
        proofOfAddressType: this.searchProofOfAddressTypeNameById(item.proofOfAddressType ?? "")
      }));
    }
    this.columns = [
      { name: 'addressRole', title: 'Rol de Domicilio', show: true, type: 'string' },
      { name: 'addressType', title: 'Tipo de Domicilio', show: true, type: 'string' },
      { name: 'addressConcatenation', title: 'Dirección', show: true, type: 'string' },
      { name: 'proofOfAddressType', title: 'Comprobante de Domicilio', show: true, type: 'string' }
    ];
    if (this.isMaintenance) {
      this.config = {
        showPag: false,
        showEditAction: true,
        showDeleteAction: false,
        showViewAction: false,
        multipleSelection: false,
        idName: 'tr_tempid',
        singleSelection: { show: false, title: '', propertyName: 'customProperty' },
      };
    }
  }

  ngAfterViewInit() {
    if (this.isMaintenance) {
      formFunctionDis(this.addressSectionComponent.profileForm);
      if (!this.permissionRolService.getPermissions()['address-pm'].allDisabled) {
        this.isMaintenanceE.set(false);
      }
    }
  }

  editt() {
    this.address = null;
    this.addressSectionComponent.profileForm.reset();
    this.addressSectionComponent.resetColonyCP()
    if (this.permissionRolService.getPermissions()['address-pm'].allDisabled) {
    } else {
      if (this.permissionRolService.getPermissions()['address-pm'].add) {
        formFunctionEnAll(this.addressSectionComponent.profileForm);
        buttonFunctionEn(['btnAddAddress', 'btnCancel', 'btnSaveAddress']);
        butonFunctionDis(['btnEdit']);
        this.config = {
          showPag: false,
          showEditAction: true,
          showDeleteAction: true,
          multipleSelection: false,
          idName: 'tr_tempid',
          singleSelection: { show: false, title: '', propertyName: 'customProperty' },
          showViewAction: false
        };
      } else {
        formFunctionEnAll(this.addressSectionComponent.profileForm);
        buttonFunctionEn(['btnCancel', 'btnSaveAddress']);
        butonFunctionDis(['btnEdit']);
      }
      if (this.permissionRolService.getPermissions()['address-pm'].edit) {
        this.auxMant = true;
        buttonFunctionEn(['btnCancel']);
        butonFunctionDis(['btnEdit']);
        this.config = {
          showPag: false,
          showEditAction: true,
          showDeleteAction: false,
          multipleSelection: false,
          idName: 'tr_tempid',
          singleSelection: { show: false, title: '', propertyName: 'customProperty' },
          showViewAction: false
        };
      } else {
        formFunctionEnAll(this.addressSectionComponent.profileForm);
        buttonFunctionEn(['btnCancel', 'btnSaveAddress']);
        butonFunctionDis(['btnEdit']);
      }
      if (this.permissionRolService.getPermissions()['address-pm'].delete) {
        formFunctionEnAll(this.addressSectionComponent.profileForm);
        buttonFunctionEn(['btnCancel', 'btnSaveAddress']);
        butonFunctionDis(['btnEdit']);
        this.config = {
          showPag: false,
          showEditAction: true,
          showDeleteAction: true,
          multipleSelection: false,
          idName: 'tr_tempid',
          singleSelection: { show: false, title: '', propertyName: 'customProperty' },
          showViewAction: false
        };
      } else {
        formFunctionEnAll(this.addressSectionComponent.profileForm);
        buttonFunctionEn(['btnCancel', 'btnSaveAddress']);
        butonFunctionDis(['btnEdit']);
      }
    }
  }

  cancel() {
    const dataAddresses = this.addressesService.get();
    this.addressSectionComponent.profileForm.reset();
    this.addressSectionComponent.resetColonyCP()
    if (dataAddresses) {
      dataAddresses.addressList.forEach(item => (
        this.addressService.addPm(item)));
      this.dataAddres = dataAddresses.addressList.map(item => ({
        ...item,
        addressConcatenation: this.addressConcatenation(item.federalEntity, item.city, item.municipality, item.neighborhoodName || '', item.street, item.externalNumber, item.internalNumber || ''),
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
      multipleSelection: false,
      idName: 'tr_tempid',
      singleSelection: { show: false, title: '', propertyName: 'customProperty' },
      showViewAction: false
    };
  }

  async addAddress() {
    const dataAddress = await this.addressSectionComponent.onSubmit();
    if (dataAddress != null) {
      if (this.address === null) {
        if (this.addressService.addPm(dataAddress)) {
          const dataAddresses = this.addressService.getAll();
          this.dataAddres = dataAddresses.map(item => ({
            ...item,
            addressConcatenation: this.addressConcatenation(item.federalEntity, item.city, item.municipality, item.neighborhoodName || '', item.street, item.externalNumber, item.internalNumber || ''),
            addressType: this.searchAddressTypeNameById(item.addressType),
            proofOfAddressType: this.searchProofOfAddressTypeNameById(item.proofOfAddressType ?? "")
          }));
          this.addressSectionComponent.profileForm.reset();
          this.addressSectionComponent.resetColonyCP();
          this.notificationService.success('¡Registro de domicilio exitoso!', 'Se ha agregado correctamente');
          this.unsavedChangesService.setUnsavedChanges(true);
          document.body.classList.remove('show-validation');
        } else {
          this.notificationService.error('Debe Proporcionarse un Domicilio Distinto al Registro Previo');
        }
      } else {
        if (this.addressService.updatePm(this.address.addressRole ?? '', dataAddress)) {
          if (this.isMaintenance && this.auxMant) {
            if (this.permissionRolService.getPermissions()['address'].edit) {
              formFunctionDis(this.addressSectionComponent.profileForm);
              butonFunctionDis(['btnAddAddress']);
            }
          }
          const dataAddresses = this.addressService.getAll();
          this.dataAddres = dataAddresses.map(item => ({
            ...item,
            addressConcatenation: this.addressConcatenation(item.federalEntity, item.city, item.municipality, item.neighborhoodName || '', item.street, item.externalNumber, item.internalNumber || ''),
            addressType: this.searchAddressTypeNameById(item.addressType),
            proofOfAddressType: this.searchProofOfAddressTypeNameById(item.proofOfAddressType ?? "")
          }));
          this.addressSectionComponent.profileForm.reset();
          this.addressSectionComponent.resetColonyCP();
          this.address = null;
          this.notificationService.success('¡Registro de domicilio exitoso!', 'Se ha agregado correctamente');
          this.unsavedChangesService.setUnsavedChanges(true);
          document.body.classList.remove('show-validation');
        } else {
          this.notificationService.error('Debe Proporcionarse un Domicilio Distinto al Registro Previo');
        }
      }
    }
  }

  save() {
    const dataSave = this.addressService.getAll();
    if (dataSave.length >= 1) {
      const exists = dataSave.some(item => (
        (item.addressRole || '') === ("FISCAL") &&
        (item.addressType || '') === ("2")
      ));
      if (exists) {
        this.addressesService.set({ addressList: dataSave });
        const dataAddress = this.addressesService.get();
        if (dataAddress) {
          this.notificationService.success('¡Registro de domicilios exitoso!', 'Se han agregado correctamente');
          this.unsavedChangesService.setUnsavedChanges(false);
          document.body.classList.remove('show-validation');
        }
      } else {
        this.notificationService.error('El registro de un Domicilio Fiscal-OFICINA esobligatoria para continuar elproceso.');
      }
    } else {
      this.notificationService.error('Debe haber al menos un domicilio registrado.');
    }
  }


  rowSelected(event: any): void {
  }

  async eventRow(event: any): Promise<void> {
    if (event.type === 'edit') {
      this.unsavedChangesService.setUnsavedChanges(true);
      console.log(event.row);
      this.address = {
        ...event.row,
        addressType: this.searchIdByAddressTypeName(event.row.addressType),
        proofOfAddressType: this.searchIdByProofOfAddressTypeName(event.row.proofOfAddressType ?? "")
      };
      this.addressSectionComponent.setAddresData(this.address);
      if (this.isMaintenance) {
        formFunctionDis(this.addressSectionComponent.profileForm);
      }
      if (this.isMaintenance && this.auxMant) {
        if (this.permissionRolService.getPermissions()['address'].edit) {
          formFunctionEnAll(this.addressSectionComponent.profileForm);
          buttonFunctionEn(['btnAddAddress']);
        }
      }
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
            addressType: this.searchIdByAddressTypeName(event.row.addressType),
            proofOfAddressType: this.searchIdByProofOfAddressTypeName(event.row.proofOfAddressType ?? "")
          };
          this.addressService.delete(this.address?.addressRole ?? "");
          const dataAddresses = this.addressService.getAll();
          this.dataAddres = dataAddresses.map(item => ({
            ...item,
            addressConcatenation: this.addressConcatenation(item.federalEntity, item.city, item.municipality, item.neighborhoodName || '', item.street, item.externalNumber, item.internalNumber || ''),
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

  addressConcatenation(federalEntity: string,
    city: string,
    municipality: string,
    neighborhood: string,
    street: string,
    externalNumber: string,
    internalNumber: string): string {
    return federalEntity + ' ' +
      city + ' ' +
      municipality + ' ' +
      neighborhood + ' ' +
      street + ' ' +
      externalNumber + ' ' +
      internalNumber
  }
}
