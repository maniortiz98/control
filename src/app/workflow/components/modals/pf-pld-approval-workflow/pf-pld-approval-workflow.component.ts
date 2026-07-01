import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Countries } from '../../../../onboarding/models/country';
import { Nationalities } from '../../../../onboarding/models/nationality';
import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { REGEX, STRINGS } from '../../../../onboarding/constants/constants';
import { Entity } from '../../../../onboarding/models/entity';
import { ModalNotificationComponent } from '../../../../shared/components/modals/modal-notification/modal-notification.component';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { first } from 'rxjs';
import { TakeService } from '../../../services/take';
import { UpdateService } from '../../../services/update';
import { AuthService } from '../../../../core/services/auth.service';
import { compareGenderAndReturnValue } from '../../../../shared/utils/maper-gender';
import { compareAndReturnIdRfcNifTinNss, compareAndReturnValueRfcNifTinNss } from '../../../../shared/utils/map-rfc-nif-tin-nss';
import { RepeatEntry } from '../../../models/pldPf/pld-pf-detail';
import { ConfigDataTable } from '../../../../shared/components/table-results/interfaces';
import { convertDateBack } from '../../../../shared/utils/datetime';

interface DataTab {
  id: string,
  Idclient: string,
  name: string,
  secondName: string,
  firstLastName: string,
  secondLastName: string,
  status: string,
  nameList: string,
  operative: string,
}
@Component({
  selector: 'app-pf-pld-approval-workflow',
  standalone: false,
  templateUrl: './pf-pld-approval-workflow.component.html',
  styleUrl: './pf-pld-approval-workflow.component.scss'
})
export class PfPldApprovalWorkflowComponent implements OnInit {
  readonly data: any = inject(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);
  private readonly catalogService = inject(CatalogsService);
  private readonly fb = inject(FormBuilder);
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly takeService = inject(TakeService);
  private readonly updateService = inject(UpdateService);
  nationalities = signal<Nationalities[]>([]);
  countries = signal<Array<Countries>>([]);
  states = signal<Entity[]>([]);
  private readonly authService = inject(AuthService);

  profileForm: FormGroup = this.fb.nonNullable.group({
    noTaskS: [{ value: '', disabled: true }],
    typePerson: [{ value: '', disabled: true }],
    curp: [{ value: '', disabled: true }],
    rfc: [{ value: '', disabled: true }],
    typeIden: [{ value: '', disabled: true }],
    firstName: [{ value: '', disabled: true }],
    middleName: [{ value: '', disabled: true }],
    dateOfBirth: [{ value: '', disabled: true }],
    firstLastName: [{ value: '', disabled: true }],
    secondLastName: [{ value: '', disabled: true }],
    gender: [{ value: '', disabled: true }],
    maritalStatus: [{ value: '', disabled: true }],
    nationality: [{ value: '', disabled: true }],
    //countryOfBirth: [{ value: '', disabled: true }],
    stateOfBirth: [{ value: '', disabled: true }],
    rol: [{ value: '', disabled: true }],
    centerF: [{ value: '', disabled: true }],
    asesor: [{ value: '', disabled: true }],
    typeOper: [{ value: '', disabled: true }],
    bankArea: [{ value: '', disabled: true }],
    contractNum: [{ value: '', disabled: true }],
    clientNum: [{ value: '', disabled: true }],
    statusWorkflow: [{ value: '', disabled: true }],
    noTask: [{ value: '', disabled: true }],
    dateWorkflow: [{ value: '', disabled: true }],
    timeWorkflow: [{ value: '', disabled: true }],
    coment: [{ value: '', disabled: false }],
  });
  columns: Array<any> = [];
  dataTable: Array<any> = [];

  config: ConfigDataTable =
    {
      showPag: false,
      showEditAction: false,
      showDeleteAction: false,
      showViewAction: false,
      multipleSelection: false,
      isSelected: false,
      idName: "id"
    };

  ngOnInit() {
    this.catalogService.getCountry({ land: [] }).subscribe(c => {
      this.countries.set(c);
    });

    this.catalogService.getNationalities({ land: [] }).subscribe(c => {
      this.nationalities.set(c);
    });

    this.catalogService.getFederalEntity({ land1s: ["MX"] }).subscribe(c => {
      this.states.set(c);
    });

    this.columns = [
      { name: 'id', title: 'Id en lista', show: true, type: 'string' },
      { name: 'Idclient', title: 'Número Cliente', show: true, type: 'string' },
      { name: 'name', title: 'Nombre', show: true, type: 'string' },
      { name: 'secondName', title: 'Segundo nombre', show: true, type: 'string' },
      { name: 'firstLastName', title: 'Primer apellido', show: true, type: 'string' },
      { name: 'secondLastName', title: 'Segundo apellido', show: true, type: 'string' },
      { name: 'status', title: 'Estatus', show: true, type: 'string' },
      { name: 'nameList', title: 'Nombre de la Lista', show: true, type: 'string' },
      { name: 'operative', title: 'Flujo Operativo', show: true, type: 'string' },
    ];

    this.profileForm.patchValue({
      noTaskS: this.data.data.id,
      typePerson: this.data.data.client.typePerson === 1 || this.data.data.client.typePerson === '1' ? 'FISICA' : this.data.data.client.typePerson === 2 || this.data.data.client.typePerson === '2' ? 'MORAL' : '',
      curp: this.data.data.curp,
      rfc: compareAndReturnValueRfcNifTinNss(this.data.data.identification.rfc || '',
        this.data.data.identification.nif || '',
        this.data.data.identification.tin || '',
        this.data.data.identification.nss || '',
      ),
      typeIden: compareAndReturnIdRfcNifTinNss(this.data.data.identification.rfc || '',
        this.data.data.identification.nif || '',
        this.data.data.identification.tin || '',
        this.data.data.identification.nss || '',
      ),
      firstName: this.data.data.client.firstName,
      middleName: this.data.data.client.middleName,
      dateOfBirth: convertDateBack(this.data.data.client.birthdate),
      firstLastName: this.data.data.client.lastName,
      secondLastName: this.data.data.client.secondLastName,
      gender: compareGenderAndReturnValue(Number(this.data.data.client.genre)),
      nationality: this.data.data.client.nacionality,
      stateOfBirth: this.data.data.curp?.substring(11, 13) ?? '',
      rol: this.data.data.client.rol,
      centerF: this.data.data.financialCenter,
      asesor: this.data.data.advisor,
      typeOper: this.data.data.typeOperation,
      bankArea: !this.data.data.contract.bankingArea ? ''
        : this.data.data.contract.bankingArea === 999 || this.data.data.contract.bankingArea === '999' ? 'BANCO'
          : this.data.data.contract.bankingArea === 998 || this.data.data.contract.bankingArea === '998' ? 'CASA DE BOLSA' : '',
      contractNum: this.data.data.contract.contractNumber,
      clientNum: this.data.data.client.clientNumber,
      statusWorkflow: this.data.data.statusId,
      noTask: this.data.data.workFlowAssignmentId,
      dateWorkflow: this.data.data.createdDate,
      timeWorkflow: this.data.data.createdHour
    });

    const data: DataTab[] = this.data.data.repeat?.map((list: RepeatEntry) => {
      return {
        id: list.id ?? '',
        Idclient: list.clientNumber ?? '',
        name: list.firstName ?? '',
        secondName: list.middleName ?? '',
        firstLastName: list.lastName ?? '',
        secondLastName: list.secondLastName ?? '',
        status: list.status ?? '',
        nameList: list.listName ?? '',
        operative: list.stream ?? '',
      }
    }) || []
    this.dataTable = data;
  }
  close(): void {
    this.dialog.closeAll();
  }

  constructor() {
    const data = this.authService.getUserInfo();
    this.takeService.take({ domainUser: this.authService.getUserInfo()().employeeId, workflowId: this.data.data.id })
      .subscribe({
        next: (response) => {
        },
        error: (error) => {
        },
        complete: () => {
        }
      });
  }

  reject() {
    const dialogRef = this.dialog.open(ModalNotificationComponent, {
      width: '530px',
      disableClose: true,
      data: {
        title: '¿Rechazar solicitud?',
        btnAccept: 'Si',
        btnDeny: 'No',
      },
      panelClass: 'custom-dialog',
    });
    dialogRef.afterClosed().pipe(first(res => res)).subscribe(async ({ value }) => {
      if (value) {
        const dialogRef = this.dialog.open(ModalNotificationComponent, {
          width: '530px',
          disableClose: true,
          data: {
            title: '¿Rechazar solicitud?',
            btnSend: 'Enviar',
            inputMessage: 'Motivo del rechazo:',
          },
          panelClass: 'custom-dialog',
        });
        dialogRef.afterClosed().pipe(first(res => res)).subscribe(async ({ value, message }) => {
          if (value) {
            let hasResponse = false;
            this.updateService.update({ workflowId: this.data.data.id, status: 4, reasonRejection: message || "" })
              .subscribe({
                next: async (response) => {
                  hasResponse = true;
                },
                error: (error) => {
                },
                complete: async () => {
                  if (!hasResponse) {
                    return;
                  }
                  const errResponse = await this.notificationModalService.error({
                    title: 'Se ha Rechazado la Solicitud con ID ' + this.data.data.id,
                    btnAccept: 'Terminar',
                  });
                  if (errResponse?.value || JSON.stringify(errResponse) === '{}') {
                    this.dialog.closeAll();
                  }
                }
              });
          }
        });
      }
    });
  }

  async approve() {
    let hasResponse = false;
    this.updateService.update({ workflowId: this.data.data.id, status: 3, reasonRejection: this.profileForm.getRawValue().coment ?? '' })
      .subscribe({
        next: (response) => {
          hasResponse = true;
        },
        error: (error) => {
        },
        complete: async () => {
          if (!hasResponse) {
            return;
          }
          const approveResponse = await this.notificationModalService.success({
            title: 'Se ha Aprobado la Solicitud con ID' + this.data.data.id,
            btnAccept: 'Terminar'
          });
          if (approveResponse?.value || JSON.stringify(approveResponse) === '{}') {
            this.dialog.closeAll();
          }
        }
      });
  }
}
