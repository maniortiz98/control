import { Maintenance, ModalFormService } from './../../../shared/services/modal-form.service';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { DataClient, DataClientDepPPE, DataClientFamilyPPE, DataClientPPE, DataClientSocAndAssoPPE } from '../../models/client-data';
import { TableResultsComponent } from '../../../shared/components/table-results/table-results.component';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { Relationships } from '../../models/relationships';
import { Occupation } from '../../models/occupation';
import { FamilyPPEService } from '../../../shared/services/storage-services/family-ppe.service';
import { DepPPEService } from '../../../shared/services/storage-services/dep-ppe.service';
import { SocAssoPPEService } from '../../../shared/services/storage-services/soc-asso-ppe.service';
import { EconomicActivity } from '../../models/economic-activity';
import { PpeService } from '../../../shared/services/storage-services/ppe.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { FirstDataClientService } from '../../../shared/services/storage-services/first-data-client.service';
import { convertDate, formatDateYYYYMMDD } from '../../../shared/utils/datetime';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { Data } from '../../models/checkpoints/initial-data-checkpoint';
import { OnboardingService } from '../../services/onboarding.service';
import { PermissionRolService } from '../../../core/services/rol.service';
import { ConfigDataTable } from '../../../shared/components/table-results/interfaces';
import { formFunctionDis, butonFunctionDis, formFunctionEnAll, buttonFunctionEn } from '../../../shared/utils/disableOrEnabled';
import { AddressType } from '../../models/address';
import { mapFormToCheckPointPpeData, mapFormToCheckPointPpeDataMant } from '../../services/mappers/ppe.mapper';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import { firstValueFrom } from 'rxjs';
import { mapToSignalPPEm } from '../../services/mappers/maintenance/respnse/ppe-mapper';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';


@Component({
  selector: 'app-ppe-info',
  standalone: false,
  templateUrl: './ppe-info.component.html',
  styleUrl: './ppe-info.component.scss'
})
export class PpeInfoComponent {

  @ViewChild(TableResultsComponent) tableResultsComponent!: TableResultsComponent;
  @ViewChild('pickerBirthdate') pickerBirthdate!: MatDatepicker<Date>;

  readonly modalService = inject(ModalFormService);
  readonly dataClientService = inject(FirstDataClientService);
  readonly familyPPEService = inject(FamilyPPEService);
  readonly depPPEService = inject(DepPPEService);
  readonly socAssoPPEService = inject(SocAssoPPEService);
  readonly ppeService = inject(PpeService);
  readonly notificationService = inject(NotificationsService);
  readonly fb = inject(FormBuilder);
  readonly unsavedChangesService = inject(UnsavedChangesService);
  readonly notificationModalService = inject(NotificationModalService)
  private readonly checkpointService = inject(CheckpointService);
  private readonly onboardingService = inject(OnboardingService);
  isMaintenance: boolean = this.onboardingService.getCurrentInfo().isMaintenance
  isMaintenanceE = signal<boolean>(true);
  isCustomer: boolean = this.onboardingService.getCurrentInfo().isCustomer
  private readonly permissionRolService = inject(PermissionRolService);
  private readonly route = inject(ActivatedRoute);

  profileForm: FormGroup = this.fb.nonNullable.group({
    ppe: ['', Validators.required],
    positionHeld: ['', Validators.required],
    expirationDate: [''],
    fppe: ['', Validators.required],
    deppe: ['', Validators.required],
    sappe: ['no', Validators.required],
  });

  ppe = signal<boolean>(false);
  addFppe = signal<boolean>(false);
  addDppe = signal<boolean>(false);
  addAppe = signal<boolean>(false);
  occupations = signal<Array<Occupation>>([]);
  relationships = signal<Array<Relationships>>([]);
  economicActivity = signal<EconomicActivity[]>([]);
  readonly domicileTypes = signal<AddressType[]>([]);

  show: boolean = false;
  addDis: boolean = false;

  dataPPE: Array<DataClientPPE> = [];

  dataClient: Data | null = null;

  columnsFamily: Array<any> = [];
  dataFamily: Array<DataClientFamilyPPE> = [];

  columnsEconomicDependents: Array<any> = [];
  dataEconomicDependents: Array<DataClientDepPPE> = [];

  columnsAssociations: Array<any> = [];
  dataAssociations: Array<DataClientSocAndAssoPPE> = [];

  manten: Maintenance = {
    all: false,
    edit: false
  };
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
  birthDates = {
    startAt: new Date(),
    min: new Date(),
  };

  constructor() {
    document.body.classList.remove('show-validation');
  }

  async ngOnInit(): Promise<void> {
    this.profileForm.valueChanges.subscribe(() => {
      this.unsavedChangesService.setUnsavedChanges(this.profileForm.dirty);
    });

    this.domicileTypes.set(this.route.snapshot.data['addressTypeResolver']);
    this.occupations.set(this.route.snapshot.data['occupationResolver']);
    this.relationships.set(this.route.snapshot.data['relationshipResolver']);
    this.economicActivity.set(this.route.snapshot.data['economicActivityResolver']);

    const dataPpe = this.ppeService.get();

    this.dataClient = this.dataClientService.getItem();
    if (!this.isMaintenance) {
      if (this.dataClient) {
        this.ppe.set(this.dataClient.ppe);
        if (this.dataClient.nationality === 'MX') {
          this.profileForm.patchValue({ ppe: 'NACIONAL' });
        } else {
          this.profileForm.patchValue({ ppe: 'EXTRANJERO' });
        }
      }
    } else {
      if (dataPpe) {
        this.ppe.set(dataPpe.ppe);
      }
    }

    this.familyPPEService.clear();
    this.depPPEService.clear();
    this.socAssoPPEService.clear();

    if (dataPpe) {
      console.log(dataPpe);
      this.profileForm.patchValue({ fppe: dataPpe.fppe });
      this.profileForm.patchValue({ deppe: dataPpe.dppe });
      this.profileForm.patchValue({ sappe: 'no' });
      console.log(dataPpe.typePPE);
      this.profileForm.patchValue({ ppe: dataPpe.typePPE });
      this.profileForm.patchValue({ positionHeld: dataPpe.positionHeld });
      this.profileForm.patchValue({ expirationDate: dataPpe.expirationDate });
      if (dataPpe.dataClientFamilyPPE) {
        const dataFamily = dataPpe.dataClientFamilyPPE;
        this.familyPPEService.addList(dataFamily);
        this.dataFamily = dataFamily.map(item => ({
          ...item,
          relationship: this.searchRelationshipNameById(item.relationship ?? ''),
          chargeDueDate: "" + convertDate(item.chargeDueDate),
          // dateOfBirth: formatDateYYYYMMDD(item.dateOfBirth),
          gender: item.curp?.charAt(10),   //VALIDAR CON FELIX MEJOR OPCION.
          stateOfBirth: item.stateOfBirth != '' ? item.stateOfBirth || '' : item.cityOfBirth || '', //VALIDAR CON FELIX
        }));
      }
      if (dataPpe.dataClientDepPPE) {
        const dataDep = dataPpe.dataClientDepPPE;
        this.depPPEService.addList(dataDep);
        this.dataEconomicDependents = dataDep.map(item => ({
          ...item,
          dateOfBirth: formatDateYYYYMMDD(item.dateOfBirth),
          stateOfBirth: item.stateOfBirth != '' ? item.stateOfBirth || '' : item.cityOfBirth || '', //VALIDAR CON FELIX
        }));
      }
      if (dataPpe.dataClientSocAndAssoPPE) {
        const dataSocAso = dataPpe.dataClientSocAndAssoPPE;
        this.socAssoPPEService.addList(dataSocAso);
        this.dataAssociations = dataSocAso.map(item => ({
          ...item,
          addressType: this.searchAddressTypeNameById(item.addressType),
          economicActivity: this.searchEconomicActivityNameById(item.economicActivity)
        }));
      }
    }

    this.columnsFamily = [
      { name: 'rfc', title: 'RFC', show: true, type: 'string' },
      { name: 'curp', title: 'CURP', show: true, type: 'string' },
      { name: 'firstName', title: 'Primer Nombre', show: true, type: 'string' },
      { name: 'firstLastName', title: 'Primer Apellido', show: true, type: 'string' },
      { name: 'relationship', title: 'Parentesco', show: true, type: 'string' },
      { name: 'positionHeld', title: 'Cargo Desempeñado', show: true, type: 'string' },
      { name: 'chargeDueDate', title: 'Fecha de Vencimiento del Cargo', show: true, type: 'string' },
    ];


    this.columnsEconomicDependents = [
      { name: 'rfc', title: 'RFC', show: true, type: 'string' },
      { name: 'curp', title: 'CURP', show: true, type: 'string' },
      { name: 'firstName', title: 'Primer Nombre', show: true, type: 'string' },
      { name: 'firstLastName', title: 'Primer Apellido', show: true, type: 'string' },
      { name: 'secondLastName', title: 'Apellido', show: true, type: 'string' },
    ];


    this.columnsAssociations = [
      { name: 'rfc', title: 'RFC', show: true, type: 'string' },
      { name: 'companyName', title: 'Razón Social', show: true, type: 'string' },
      { name: 'commercialBusiness', title: 'Giro Mercantil', show: true, type: 'string' },
      { name: 'administratorManagerAttorney', title: 'Administrador / Gerente / Apoderado', show: true, type: 'string' },
      { name: 'economicActivity', title: 'Actividad Económica', show: true, type: 'string' },
      { name: 'addressType', title: 'Tipo de Domicilio', show: true, type: 'string' },
    ];

    if (this.dataFamily.length > 0) {
      this.addFppe.set(true);
    }
    if (this.dataEconomicDependents.length > 0) {
      this.addDppe.set(true);
    }
    if (this.dataAssociations.length > 0) {
      this.addAppe.set(true);
    }
    if (this.isMaintenance) {
      this.config = {
        showPag: false,
        showEditAction: true,
        showDeleteAction: false,
        showViewAction: false,
        multipleSelection: false,
        idName: 'tr_tempid',
        isSelected: false,
        singleSelection: { show: false, title: '', propertyName: 'customProperty' },
      };
      this.addDis = true;
    }
  }

  ngAfterViewInit() {
    if (this.isMaintenance) {
      formFunctionDis(this.profileForm);
      this.manten = {
        all: true,
        edit: false
      };
      if (!this.permissionRolService.getPermissions()['ppe-info'].allDisabled) {
        this.isMaintenanceE.set(false);
      }
    } else if (this.isCustomer) {
      // formFunctionDis(this.profileForm);
    }
  }

  editt() {
    if (this.permissionRolService.getPermissions()['ppe-info'].allDisabled) {
    } else {
      if (this.permissionRolService.getPermissions()['ppe-info'].edit) {
        formFunctionEnAll(this.profileForm);
        butonFunctionDis(['btnEdit']);
        buttonFunctionEn(['btnPpetData', 'btnCancel']);
        this.manten = {
          all: false,
          edit: true
        };
        this.config = { ...this.config, showEditAction: true }
      }
      if (this.permissionRolService.getPermissions()['ppe-info'].add) {
        buttonFunctionEn(['btnPpetF', 'btnPpetD']);
        this.addDis = false;
      }
      if (this.permissionRolService.getPermissions()['ppe-info'].delete) {
        this.config = { ...this.config, showDeleteAction: false }
      }
    }
  }

  cancel() {
    formFunctionDis(this.profileForm);
    buttonFunctionEn(['btnEdit']);
    butonFunctionDis(['btnPpetData', 'btnCancel', 'btnPpetF', 'btnPpetD', 'btnPpets']);
    this.addDis = true;
    this.manten = {
      all: true,
      edit: false
    };

    const dataPpe = this.ppeService.get();

    this.familyPPEService.clear();
    this.depPPEService.clear();
    this.socAssoPPEService.clear();

    this.addFppe.set(false);
    this.addDppe.set(false);
    this.addAppe.set(false);

    if (dataPpe) {
      this.ppe.set(dataPpe.ppe);
      this.profileForm.patchValue({ fppe: dataPpe.fppe });
      this.profileForm.patchValue({ deppe: dataPpe.dppe });
      this.profileForm.patchValue({ sappe: 'no' });
      this.profileForm.patchValue({ typePPE: dataPpe.typePPE });
      this.profileForm.patchValue({ positionHeld: dataPpe.positionHeld });
      this.profileForm.patchValue({ expirationDate: dataPpe.expirationDate });
      if (dataPpe.dataClientFamilyPPE) {
        const dataFamily = dataPpe.dataClientFamilyPPE;
        this.familyPPEService.addList(dataFamily);
        this.dataFamily = dataFamily.map(item => ({
          ...item,
          relationship: this.searchRelationshipNameById(item.relationship ?? ''),
          chargeDueDate: "" + convertDate(item.chargeDueDate),
          // dateOfBirth: formatDateYYYYMMDD(item.dateOfBirth),
          gender: item.curp?.charAt(10),   //VALIDAR CON FELIX MEJOR OPCION.
          stateOfBirth: item.stateOfBirth != '' ? item.stateOfBirth || '' : item.cityOfBirth || '', //VALIDAR CON FELIX
        }));
      }
      if (dataPpe.dataClientDepPPE) {
        const dataDep = dataPpe.dataClientDepPPE;
        this.depPPEService.addList(dataDep);
        this.dataEconomicDependents = dataDep.map(item => ({
          ...item,
          // dateOfBirth: formatDateYYYYMMDD(item.dateOfBirth),
          stateOfBirth: item.stateOfBirth != '' ? item.stateOfBirth || '' : item.cityOfBirth || '', //VALIDAR CON FELIX
        }));
      }
      if (dataPpe.dataClientSocAndAssoPPE) {
        const dataSocAso = dataPpe.dataClientSocAndAssoPPE;
        this.socAssoPPEService.addList(dataSocAso);
        this.dataAssociations = dataSocAso.map(item => ({
          ...item,
          addressType: this.searchAddressTypeNameById(item.addressType),
          economicActivity: this.searchEconomicActivityNameById(item.economicActivity)
        }));
      }
    }
    if (this.dataFamily.length > 0) {
      this.addFppe.set(true);
    }

    if (this.dataEconomicDependents.length > 0) {
      this.addDppe.set(true);
    }

    if (this.dataAssociations.length > 0) {
      this.addAppe.set(true);
    }
  }

  rowSelectedFppe(event: any): void {
  }

  async eventRowFppe(event: any): Promise<void> {
    if (event.type === 'edit') {
      if (this.isCustomer && event.row.isView === true) {
        this.modalService.formModalDataPPE({ all: true, edit: false }, { ...event.row, relationship: this.searchRelationshipIdByName(event.row.relationship), chargeDueDate: convertDate(event.row.chargeDueDate) }).subscribe((result) => {
          if (result != null) {
            if (this.familyPPEService.update(event.row.rfc, result)) {
              const dataFamily = this.familyPPEService.getAll();
              this.dataFamily = dataFamily.map(item => ({
                ...item,
                relationship: this.searchRelationshipNameById(item.relationship ?? ''),
                chargeDueDate: "" + convertDate(item.chargeDueDate),
                // dateOfBirth: formatDateYYYYMMDD(item.dateOfBirth),
                gender: item.curp?.charAt(10),   //VALIDAR CON FELIX MEJOR OPCION.
                stateOfBirth: item.stateOfBirth != '' ? item.stateOfBirth || '' : item.cityOfBirth || '', //VALIDAR CON FELIX
              }));
              this.unsavedChangesService.setUnsavedChanges(true);
            } else {
              this.notificationService.error('Error')
            }
          }
        });
      } else {
        this.modalService.formModalDataPPE(this.manten, { ...event.row, relationship: this.searchRelationshipIdByName(event.row.relationship), chargeDueDate: convertDate(event.row.chargeDueDate) }).subscribe((result) => {
          if (this.isMaintenance) {
            console.log(event.row);
            if (result != null) {
              if (this.familyPPEService.update(event.row.rfc, {
                ...result,
                idS: event.row.idS,
                id: event.row.id,
                personId: event.row.personId,
                accountRole: event.row.accountRole,
                isActive: event.row.isActive ?? true,
                addressId: event.row.addressId,
              })) {
                const dataFamily = this.familyPPEService.getAll();
                this.dataFamily = dataFamily.map(item => ({
                  ...item,
                  relationship: this.searchRelationshipNameById(item.relationship ?? ''),
                  chargeDueDate: "" + convertDate(item.chargeDueDate),
                  // dateOfBirth: formatDateYYYYMMDD(item.dateOfBirth),
                  gender: item.curp?.charAt(10),   //VALIDAR CON FELIX MEJOR OPCION.
                  stateOfBirth: item.stateOfBirth != '' ? item.stateOfBirth || '' : item.cityOfBirth || '', //VALIDAR CON FELIX
                }));
                this.unsavedChangesService.setUnsavedChanges(true);
              } else {
                this.notificationService.error('Error')
              }
            }
          } else {
            console.log(event.row);
            if (result != null) {
              if (this.familyPPEService.update(event.row.rfc, result)) {
                const dataFamily = this.familyPPEService.getAll();
                this.dataFamily = dataFamily.map(item => ({
                  ...item,
                  relationship: this.searchRelationshipNameById(item.relationship ?? ''),
                  chargeDueDate: "" + convertDate(item.chargeDueDate),
                  // dateOfBirth: formatDateYYYYMMDD(item.dateOfBirth),
                  gender: item.curp?.charAt(10),   //VALIDAR CON FELIX MEJOR OPCION.
                  stateOfBirth: item.stateOfBirth != '' ? item.stateOfBirth || '' : item.cityOfBirth || '', //VALIDAR CON FELIX
                }));
                this.unsavedChangesService.setUnsavedChanges(true);
              } else {
                this.notificationService.error('Error')
              }
            }
          }
        });
      }
    }
    if (event.type === 'delete') {
      // if (this.dataFamily.length > 1) {
      const result = await this.notificationModalService.confirm({
        title: 'Confirmar eliminar el registro',
        btnAccept: 'Sí, eliminar',
        btnDeny: 'No',
      });
      if (result?.value === true) {
        if (this.familyPPEService.delete(event.row.rfc)) {
          this.notificationService.success('Borrado con éxito');
          const dataFamily = this.familyPPEService.getAll();
          this.dataFamily = dataFamily.map(item => ({
            ...item,
            relationship: this.searchRelationshipNameById(item.relationship ?? '')
          }));
          this.unsavedChangesService.setUnsavedChanges(true);
        }
      }
      // } else {
      //   this.notificationService.error('Error no se pueden borrar todos los familiares PPE');
      // }
    }
  }

  eventPageDppe(event: PageEvent): void {
  }

  rowSelectedDppe(event: any): void {
  }

  async eventRowDppe(event: any): Promise<void> {
    if (event.type === 'edit') {
      if (this.isCustomer && event.row.isView === true) {
        this.modalService.formModalDataDepPPE({ all: true, edit: false }, { ...event.row }).subscribe((result) => {
          if (result != null) {
            if (this.depPPEService.update(event.row.rfc, result)) {
              const dataEconomicDependents = this.depPPEService.getAll();
              this.dataEconomicDependents = dataEconomicDependents.map(item => ({
                ...item,
                // dateOfBirth: formatDateYYYYMMDD(item.dateOfBirth),
                stateOfBirth: item.stateOfBirth != '' ? item.stateOfBirth || '' : item.cityOfBirth || '', //VALIDAR CON FELIX
              }));
              this.unsavedChangesService.setUnsavedChanges(true);
            } else {
              this.notificationService.error('Error')
            }
          }
        });
      } else {
        this.modalService.formModalDataDepPPE(this.manten, { ...event.row }).subscribe((result) => {
          if (this.isMaintenance) {
            console.log(event.row);
            if (result != null) {
              if (this.depPPEService.update(event.row.rfc, {
                ...result,
                idS: event.row.idS,
                idDep: event.row.idDep,
                personId: event.row.personId,
                phoneId: event.row.phoneId,
                accountRoleId: event.row.accountRoleId,
                isActive: event.row.isActive,
                addressId: event.row.addressId,
                clientIdNum: event.row.clientIdNum
              })) {
                const dataEconomicDependents = this.depPPEService.getAll();
                this.dataEconomicDependents = dataEconomicDependents.map(item => ({
                  ...item,
                  // dateOfBirth: formatDateYYYYMMDD(item.dateOfBirth),
                  stateOfBirth: item.stateOfBirth != '' ? item.stateOfBirth || '' : item.cityOfBirth || '', //VALIDAR CON FELIX
                }));
                this.unsavedChangesService.setUnsavedChanges(true);
              } else {
                this.notificationService.error('Error')
              }
            }
          } else {
            console.log(event.row);
            if (result != null) {
              if (this.depPPEService.update(event.row.rfc, result)) {
                const dataEconomicDependents = this.depPPEService.getAll();
                this.dataEconomicDependents = dataEconomicDependents.map(item => ({
                  ...item,
                  // dateOfBirth: formatDateYYYYMMDD(item.dateOfBirth),
                  stateOfBirth: item.stateOfBirth != '' ? item.stateOfBirth || '' : item.cityOfBirth || '', //VALIDAR CON FELIX
                }));
                this.unsavedChangesService.setUnsavedChanges(true);
              } else {
                this.notificationService.error('Error')
              }
            }
          }
        });
      }
    }
    if (event.type === 'delete') {
      // if (this.dataEconomicDependents.length > 1) {
      const result = await this.notificationModalService.confirm({
        title: 'Confirmar eliminar el registro',
        btnAccept: 'Sí, eliminar',
        btnDeny: 'No',
      });
      if (result?.value === true) {
        if (this.depPPEService.delete(event.row.rfc)) {
          this.notificationService.success('Borrado con éxito');
          const dataEconomicDependents = this.depPPEService.getAll();
          this.dataEconomicDependents = dataEconomicDependents.map(item => ({
            ...item
          }));
          this.unsavedChangesService.setUnsavedChanges(true);
        }
      }
      // } else {
      //   this.notificationService.error('Error no se pueden borrar todos los dependientes PPE');
      // }
    }
  }

  eventPageFppe(event: PageEvent): void {
  }

  rowSelectedAppe(event: any): void {
  }

  async eventRowAppe(event: any): Promise<void> {
    if (event.type === 'edit') {
      if (this.isCustomer && event.row.isView === true) {
        this.modalService.formModalDataAsoPPE({ all: true, edit: false }, { ...event.row, economicActivity: this.searchEconomicActivityIdByName(event.row.economicActivity), addressType: this.searchIdByAddressTypeName(event.row.addressType), }).subscribe((result) => {
          if (result != null) {
            if (this.socAssoPPEService.update(event.row.rfc, result)) {
              const dataAssociations = this.socAssoPPEService.getAll();
              this.dataAssociations = dataAssociations.map(item => ({
                ...item,
                addressType: this.searchAddressTypeNameById(item.addressType),
                economicActivity: this.searchEconomicActivityNameById(item.economicActivity)
              }));
              this.unsavedChangesService.setUnsavedChanges(true);
            } else {
              this.notificationService.error('Error')
            }
          }
        });
      } else {
        this.modalService.formModalDataAsoPPE(this.manten, { ...event.row, economicActivity: this.searchEconomicActivityIdByName(event.row.economicActivity), addressType: this.searchIdByAddressTypeName(event.row.addressType), }).subscribe((result) => {
          if (this.isMaintenance) {
            console.log(event.row);
            if (result != null) {
              if (this.socAssoPPEService.update(event.row.rfc, {
                ...result,
                idS: event.row.idS,
                idAso: event.row.idAso,
                personId: event.row.personId,
                phoneId: event.row.phoneId,
                isActive: event.row.isActive,
                addressId: event.row.addressId,
                clientIdNum: event.row.clientIdNum
              })) {
                const dataAssociations = this.socAssoPPEService.getAll();
                this.dataAssociations = dataAssociations.map(item => ({
                  ...item,
                  addressType: this.searchAddressTypeNameById(item.addressType),
                  economicActivity: this.searchEconomicActivityNameById(item.economicActivity)
                }));
                this.unsavedChangesService.setUnsavedChanges(true);
              } else {
                this.notificationService.error('Error')
              }
            }
          } else {
            console.log(event.row);
            if (result != null) {
              if (this.socAssoPPEService.update(event.row.rfc, result)) {
                const dataAssociations = this.socAssoPPEService.getAll();
                this.dataAssociations = dataAssociations.map(item => ({
                  ...item,
                  addressType: this.searchAddressTypeNameById(item.addressType),
                  economicActivity: this.searchEconomicActivityNameById(item.economicActivity)
                }));
                this.unsavedChangesService.setUnsavedChanges(true);
              } else {
                this.notificationService.error('Error')
              }
            }
          }
        });
      }
    }
    if (event.type === 'delete') {
      // if (this.dataAssociations.length > 1) {
      const result = await this.notificationModalService.confirm({
        title: 'Confirmar eliminar el registro',
        btnAccept: 'Sí, eliminar',
        btnDeny: 'No',
      });
      if (result?.value === true) {
        if (this.socAssoPPEService.delete(event.row.rfc)) {
          this.notificationService.success('Borrado con éxito');
          const dataAssociations = this.socAssoPPEService.getAll();
          this.dataAssociations = dataAssociations.map(item => ({
            ...item,
            addressType: this.searchAddressTypeNameById(item.addressType),
            economicActivity: this.searchEconomicActivityNameById(item.economicActivity)
          }));
          this.unsavedChangesService.setUnsavedChanges(true);
        }
      }
      // } else {
      //   this.notificationService.error('Error no se pueden borrar todas las sociedades y asosiaciones PPE');
      // }
    }
  }

  eventPageAppe(event: PageEvent): void {
  }

  onSelectionChangeFppe(event: MatRadioChange<any>) {
    const control = this.profileForm.get('fppe')!;
    if (event.value === 'yes') {
      this.addFppe.set(true);
    }
    if (event.value === 'no') {
      if (this.dataFamily.length > 0) {
        setTimeout(() => control.setValue('yes', { emitEvent: false }), 0);
      } else {
        this.addFppe.set(false);
      }
    }
  }

  onSelectionChangeDppe(event: MatRadioChange<any>) {
    const control = this.profileForm.get('deppe')!;
    if (event.value === 'yes') {
      this.addDppe.set(true);
    }
    if (event.value === 'no') {
      if (this.dataEconomicDependents.length > 0) {
        setTimeout(() => control.setValue('yes', { emitEvent: false }), 0);
      } else {
        this.addDppe.set(false);
      }
    }
  }

  onSelectionChangeAppe(event: MatRadioChange<any>) {
    const control = this.profileForm.get('sappe')!;
    if (event.value === 'yes') {
      this.addAppe.set(true);
    }
    if (event.value === 'no') {
      if (this.dataAssociations.length > 0) {
        setTimeout(() => control.setValue('yes', { emitEvent: false }), 0);
      } else {
        this.addAppe.set(false);
      }
    }
  }

  fppe() {
    this.modalService.formModalDataPPE(this.manten).subscribe((result) => {
      if (result != null) {
        if (this.familyPPEService.add(result)) {
          const dataFamily = this.familyPPEService.getAll();
          this.dataFamily = dataFamily.map(item => ({
            ...item,
            relationship: this.searchRelationshipNameById(item.relationship ?? ''),
            chargeDueDate: "" + convertDate(item.chargeDueDate)
          }));
          this.unsavedChangesService.setUnsavedChanges(true);
        } else {
          this.notificationService.error('Ya se encuentra una persona registrada con esa información')
        }
      }
    });
  }

  dppe() {
    this.modalService.formModalDataDepPPE(this.manten).subscribe((result) => {
      if (result != null) {
        if (this.depPPEService.add(result)) {
          const dataDep = this.depPPEService.getAll();
          this.dataEconomicDependents = dataDep.map(item => ({
            ...item
          }));
          this.unsavedChangesService.setUnsavedChanges(true);
        } else {
          this.notificationService.error('Ya se encuentra una persona registrada con esa información')
        }
      }
    });
  }

  appe() {
    this.modalService.formModalDataAsoPPE(this.manten).subscribe((result) => {
      if (result != null) {
        if (this.socAssoPPEService.add(result)) {
          const dataSocAso = this.socAssoPPEService.getAll();
          this.dataAssociations = dataSocAso.map(item => ({
            ...item,
            economicActivity: this.searchEconomicActivityNameById(item.economicActivity),
            addressType: this.searchAddressTypeNameById(item.addressType)
          }));
          this.unsavedChangesService.setUnsavedChanges(true);
        } else {
          this.notificationService.error('Ya se encuentra una persona registrada con esa información')
        }
      }
    });
  }

  onSubmit() {
    if (!this.isMaintenance) {
      this.saveCheckpoint();
    } else {
      this.saveCheckpointMain();
    }
  }

  saveCheckpoint() {
    document.body.classList.add('show-validation');
    Object.keys(this.profileForm.controls).forEach(controlName => {
      const control = this.profileForm.get(controlName);
      control?.updateValueAndValidity();
    });
    this.unsavedChangesService.setUnsavedChanges(false);
    const dataFamily = this.familyPPEService.getAll();
    const dataDep = this.depPPEService.getAll();
    const dataSocAso = this.socAssoPPEService.getAll();

    const ppe = this.profileForm.get('ppe');
    const positionHeld = this.profileForm.get('positionHeld');
    const expirationDate = this.profileForm.get('expirationDate');

    if (this.ppe()) {
      if (this.profileForm.valid || this.profileForm.disabled) {
        if (this.profileForm.get('fppe')?.value === 'yes' && dataFamily.length === 0) {
          this.notificationService.error('Tiene algún familiar que sea Persona Políticamente Expuesta está marcado en SI pero no tiene registro.')
          this.error();
        } else if (this.profileForm.get('deppe')?.value === 'yes' && dataDep.length === 0) {
          this.notificationService.error('¿Dependientes económicos asociados a una Persona Políticamente Expuesta? está marcado en SI pero no tiene registro.')
          this.error();
        } else if (this.profileForm.get('sappe')?.value === 'yes' && dataSocAso.length === 0) {
          this.notificationService.error('¿Sociedades y Asociaciones asociadas a una Persona Políticamente Expuesta? está marcado en SI pero no tiene registro.')
          this.error();
        } else {
          const dataPPE: DataClientPPE = {
            ppe: this.ppe(),
            typePPE: this.profileForm.get('ppe')?.value,
            positionHeld: this.profileForm.get('positionHeld')?.value,
            expirationDate: this.profileForm.get('expirationDate')?.value,
            dataClientFamilyPPE: dataFamily,
            dataClientDepPPE: dataDep,
            dataClientSocAndAssoPPE: dataSocAso,
            fppe: this.profileForm.get('fppe')?.value,
            dppe: this.profileForm.get('deppe')?.value,
            sappe: this.profileForm.get('sappe')?.value,
          }
          console.log(this.profileForm.get('expirationDate')?.value)
          if (dataPPE) {
            this.checkpointService.saveSection('ppe-information', mapFormToCheckPointPpeData(dataPPE)).subscribe((result) => {
              if (result['status'] === "CREATED") {
                this.notificationService.success('Guardado con éxito');
                this.ppeService.set(dataPPE);
                this.unsavedChangesService.setUnsavedChanges(false);
              } else {
                this.notificationService.error('Error al Guardar Contacte al Administrador del Sistema');
                this.unsavedChangesService.setUnsavedChanges(true);
              }
            });
          }
        }
      } else {
        if (this.profileForm.getRawValue().ppe?.trim() === ''
          || this.profileForm.getRawValue().positionHeld?.trim() === '') {
          this.notificationService.error('Faltan campos obligatorios por capturar')
          this.unsavedChangesService.setUnsavedChanges(true);
          this.error();
          return;
        }
        if (this.profileForm.getRawValue().expirationDate) {
          const dobValue = this.profileForm.getRawValue().expirationDate
          const dob = moment(dobValue);
          const today = moment().startOf('day');
          if (dob.isBefore(today, 'day')) {
            this.error();
            this.notificationService.error('Fecha de Vencimiento de Cargo no Válida');
            return;
          }
        }
      }
    } else {
      ppe?.clearValidators();
      positionHeld?.clearValidators();
      expirationDate?.clearValidators();
      Object.keys(this.profileForm.controls).forEach(controlName => {
        const control = this.profileForm.get(controlName);
        control?.updateValueAndValidity();
      });
      if (this.profileForm.valid || this.profileForm.disabled) {
        if (this.profileForm.get('fppe')?.value === 'yes' && dataFamily.length === 0) {
          this.notificationService.error('Tiene algún familiar que sea Persona Políticamente Expuesta está marcado en SI pero no tiene registro.')
          this.error();
        } else if (this.profileForm.get('deppe')?.value === 'yes' && dataDep.length === 0) {
          this.notificationService.error('¿Dependientes económicos asociados a una Persona Políticamente Expuesta? está marcado en SI pero no tiene registro.')
          this.error();
        } else if (this.profileForm.get('sappe')?.value === 'yes' && dataSocAso.length === 0) {
          this.notificationService.error('¿Sociedades y Asociaciones asociadas a una Persona Políticamente Expuesta? está marcado en SI pero no tiene registro.')
          this.error();
        } else {
          const dataPPE: DataClientPPE = {
            ppe: this.ppe(),
            dataClientFamilyPPE: dataFamily,
            dataClientDepPPE: dataDep,
            dataClientSocAndAssoPPE: dataSocAso,
            fppe: this.profileForm.get('fppe')?.value,
            dppe: this.profileForm.get('deppe')?.value,
            sappe: this.profileForm.get('sappe')?.value,
          }
          if (dataPPE) {
            this.checkpointService.saveSection('ppe-information', mapFormToCheckPointPpeData(dataPPE)).subscribe((result) => {
              if (result['status'] === "CREATED") {
                this.notificationService.success('Guardado con éxito');
                this.ppeService.set(dataPPE);
                this.unsavedChangesService.setUnsavedChanges(false);
              } else {
                this.notificationService.error('Error al Guardar Contacte al Administrador del Sistema');
                this.unsavedChangesService.setUnsavedChanges(true);
              }
            });
          }
        }
      } else {
        this.notificationService.error('Faltan campos obligatorios por capturar')
        this.unsavedChangesService.setUnsavedChanges(true);
        this.error();
      }
    }
  }

  saveCheckpointMain() {
    document.body.classList.add('show-validation');
    Object.keys(this.profileForm.controls).forEach(controlName => {
      const control = this.profileForm.get(controlName);
      control?.updateValueAndValidity();
    });
    this.unsavedChangesService.setUnsavedChanges(false);
    const dataFamily = this.familyPPEService.getAll();
    const dataDep = this.depPPEService.getAll();
    const dataSocAso = this.socAssoPPEService.getAll();

    const ppe = this.profileForm.get('ppe');
    const positionHeld = this.profileForm.get('positionHeld');
    const expirationDate = this.profileForm.get('expirationDate');

    if (this.ppe()) {
      if (this.profileForm.valid || this.profileForm.disabled) {
        if (this.profileForm.get('fppe')?.value === 'yes' && dataFamily.length === 0) {
          this.notificationService.error('Tiene algún familiar que sea Persona Políticamente Expuesta está marcado en SI pero no tiene registro.')
          this.error();
        } else if (this.profileForm.get('deppe')?.value === 'yes' && dataDep.length === 0) {
          this.notificationService.error('¿Dependientes económicos asociados a una Persona Políticamente Expuesta? está marcado en SI pero no tiene registro.')
          this.error();
        } else if (this.profileForm.get('sappe')?.value === 'yes' && dataSocAso.length === 0) {
          this.notificationService.error('¿Sociedades y Asociaciones asociadas a una Persona Políticamente Expuesta? está marcado en SI pero no tiene registro.')
          this.error();
        } else {
          const dataPPE: DataClientPPE = {
            ppe: this.ppe(),
            id: this.ppeService.getCopy()?.id,
            typePPE: this.profileForm.get('ppe')?.value,
            positionHeld: this.profileForm.get('positionHeld')?.value,
            expirationDate: this.profileForm.get('expirationDate')?.value,
            dataClientFamilyPPE: dataFamily,
            dataClientDepPPE: dataDep,
            dataClientSocAndAssoPPE: dataSocAso,
            fppe: this.profileForm.get('fppe')?.value,
            dppe: this.profileForm.get('deppe')?.value,
            sappe: this.profileForm.get('sappe')?.value,
          }
          if (dataPPE) {
            this.checkpointService.saveSectionMant('ppe-information', mapFormToCheckPointPpeDataMant(dataPPE, this.ppeService.getCopy())).subscribe(async (result) => {
              if (result['status'] === "CREATED") {
                await this.update();
                this.notificationService.success('Guardado con éxito');
                this.unsavedChangesService.setUnsavedChanges(false);
              }
            });
          }
        }
      } else {
        if (this.profileForm.getRawValue().ppe?.trim() === ''
          || this.profileForm.getRawValue().positionHeld?.trim() === '') {
          this.notificationService.error('Faltan campos obligatorios por capturar')
          this.unsavedChangesService.setUnsavedChanges(true);
          this.error();
          return;
        }
        if (this.profileForm.getRawValue().expirationDate) {
          const dobValue = this.profileForm.getRawValue().expirationDate
          const dob = moment(dobValue);
          const today = moment().startOf('day');
          if (dob.isBefore(today, 'day')) {
            this.error();
            this.notificationService.error('Fecha de Vencimiento de Cargo no Válida')
            return;
          }
        }
      }
    } else {
      ppe?.clearValidators();
      positionHeld?.clearValidators();
      expirationDate?.clearValidators();
      Object.keys(this.profileForm.controls).forEach(controlName => {
        const control = this.profileForm.get(controlName);
        control?.updateValueAndValidity();
      });
      if (this.profileForm.valid || this.profileForm.disabled) {
        if (this.profileForm.get('fppe')?.value === 'yes' && dataFamily.length === 0) {
          this.notificationService.error('Tiene algún familiar que sea Persona Políticamente Expuesta está marcado en SI pero no tiene registro.')
          this.error();
        } else if (this.profileForm.get('deppe')?.value === 'yes' && dataDep.length === 0) {
          this.notificationService.error('¿Dependientes económicos asociados a una Persona Políticamente Expuesta? está marcado en SI pero no tiene registro.')
          this.error();
        } else if (this.profileForm.get('sappe')?.value === 'yes' && dataSocAso.length === 0) {
          this.notificationService.error('¿Sociedades y Asociaciones asociadas a una Persona Políticamente Expuesta? está marcado en SI pero no tiene registro.')
          this.error();
        } else {
          const dataPPE: DataClientPPE = {
            ppe: this.ppe(),
            id: this.ppeService.getCopy()?.id,
            dataClientFamilyPPE: dataFamily,
            dataClientDepPPE: dataDep,
            dataClientSocAndAssoPPE: dataSocAso,
            fppe: this.profileForm.get('fppe')?.value,
            dppe: this.profileForm.get('deppe')?.value,
            sappe: this.profileForm.get('sappe')?.value,
          }
          if (dataPPE) {
            this.checkpointService.saveSectionMant('ppe-information', mapFormToCheckPointPpeDataMant(dataPPE, this.ppeService.getCopy())).subscribe(async (result) => {
              if (result['status'] === "CREATED") {
                await this.update();
                this.notificationService.success('Guardado con éxito');
                this.unsavedChangesService.setUnsavedChanges(false);
              }
            });
          }
        }
      } else {
        this.notificationService.error('Faltan campos obligatorios por capturar')
        this.unsavedChangesService.setUnsavedChanges(true);
        this.error();
      }
    }
  }

  async update() {
    const response = await firstValueFrom(this.checkpointService.getMaintenanceSectionByPersonaFisica(['ppe-information']));
    this.ppeService.set(mapToSignalPPEm(response['checkpoints'][0]['data']));
    this.ppeService.setCopy(this.ppeService.get() ?? {
      ppe: false,
      fppe: 'no',
      dppe: 'no',
      sappe: 'no',
      dataClientFamilyPPE: [],
      dataClientDepPPE: [],
      dataClientSocAndAssoPPE: []
    });

    const dataPpe = this.ppeService.get();

    this.dataClient = this.dataClientService.getItem();
    if (!this.isMaintenance) {
      if (this.dataClient) {
        this.ppe.set(this.dataClient.ppe);
        if (this.dataClient.nationality === 'MX') {
          this.profileForm.patchValue({ ppe: 'NACIONAL' });
        } else {
          this.profileForm.patchValue({ ppe: 'EXTRANJERO' });
        }
      }
    } else {
      if (dataPpe) {
        this.ppe.set(dataPpe.ppe);
      }
    }

    this.familyPPEService.clear();
    this.depPPEService.clear();
    this.socAssoPPEService.clear();
    this.addFppe.set(false);
    this.addDppe.set(false);
    this.addAppe.set(false);

    if (dataPpe) {
      console.log(dataPpe);
      this.profileForm.patchValue({ fppe: dataPpe.fppe });
      this.profileForm.patchValue({ deppe: dataPpe.dppe });
      this.profileForm.patchValue({ sappe: 'no' });
      console.log(dataPpe.typePPE);
      this.profileForm.patchValue({ ppe: dataPpe.typePPE });
      this.profileForm.patchValue({ positionHeld: dataPpe.positionHeld });
      this.profileForm.patchValue({ expirationDate: dataPpe.expirationDate });
      if (dataPpe.dataClientFamilyPPE) {
        const dataFamily = dataPpe.dataClientFamilyPPE;
        this.familyPPEService.addList(dataFamily);
        this.dataFamily = dataFamily.map(item => ({
          ...item,
          relationship: this.searchRelationshipNameById(item.relationship ?? ''),
          chargeDueDate: "" + convertDate(item.chargeDueDate),
          // dateOfBirth: formatDateYYYYMMDD(item.dateOfBirth),
          gender: item.curp?.charAt(10),   //VALIDAR CON FELIX MEJOR OPCION.
          stateOfBirth: item.stateOfBirth != '' ? item.stateOfBirth || '' : item.cityOfBirth || '', //VALIDAR CON FELIX
        }));
      }
      if (dataPpe.dataClientDepPPE) {
        const dataDep = dataPpe.dataClientDepPPE;
        this.depPPEService.addList(dataDep);
        this.dataEconomicDependents = dataDep.map(item => ({
          ...item,
          dateOfBirth: formatDateYYYYMMDD(item.dateOfBirth),
          stateOfBirth: item.stateOfBirth != '' ? item.stateOfBirth || '' : item.cityOfBirth || '', //VALIDAR CON FELIX
        }));
      }
      if (dataPpe.dataClientSocAndAssoPPE) {
        const dataSocAso = dataPpe.dataClientSocAndAssoPPE;
        this.socAssoPPEService.addList(dataSocAso);
        this.dataAssociations = dataSocAso.map(item => ({
          ...item,
          addressType: this.searchAddressTypeNameById(item.addressType),
          economicActivity: this.searchEconomicActivityNameById(item.economicActivity)
        }));
      }
    }
    if (this.dataFamily.length > 0) {
      this.addFppe.set(true);
    }

    if (this.dataEconomicDependents.length > 0) {
      this.addDppe.set(true);
    }

    if (this.dataAssociations.length > 0) {
      this.addAppe.set(true);
    }
  }


  searchNameById(id: string): string {
    const ocupations = this.occupations();
    const ocupation = ocupations.find(ocup => ocup.occupationId === id);
    return ocupation ? ocupation.occupation : '';
  }

  searchRelationshipNameById(id: string): string {
    const relationships = this.relationships();
    const relationship = relationships.find(rela => rela.idParent === id);
    return relationship ? relationship.kinShip : '';
  }

  searchEconomicActivityNameById(id: string): string {
    const economicActivity = this.economicActivity();
    const economic = economicActivity.find(act => act.lineBusinessId === id);
    return economic ? economic.lineBusiness : '';
  }

  searchIdByName(name: string): string {
    const ocupations = this.occupations();
    const ocupation = ocupations.find(ocup => ocup.occupation === name);
    return ocupation ? ocupation.occupationId : '';
  }

  searchRelationshipIdByName(name: string): string {
    const relationships = this.relationships();
    const relationship = relationships.find(rela => rela.kinShip === name);
    return relationship ? relationship.idParent : '';
  }

  searchEconomicActivityIdByName(name: string): string {
    const economicActivity = this.economicActivity();
    const economic = economicActivity.find(act => act.lineBusiness === name);
    return economic ? economic.lineBusinessId : '';
  }
  searchAddressTypeNameById(id: string): string {
    const domicileTypes = this.domicileTypes();
    const data = domicileTypes.find(dat => dat.addressTypeId === id);
    return data ? data.addressType : '';
  }

  searchIdByAddressTypeName(name: string): string {
    const domicileTypes = this.domicileTypes();
    const data = domicileTypes.find(dat => dat.addressType === name);
    return data ? data.addressTypeId : '';
  }

  //function to detonate error
  error(): void {
    Object.values(this.profileForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsTouched();
      }
    });
  }
  onDateInput(event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
    const date = event.value;
    console.log(date);
    const control = this.profileForm.get('expirationDate');

    if (date instanceof Date && control && this.pickerBirthdate) {
      this.pickerBirthdate.select(date);
    }
  }
}
