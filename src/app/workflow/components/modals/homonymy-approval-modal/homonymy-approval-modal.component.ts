import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { ModalNotificationComponent } from '../../../../shared/components/modals/modal-notification/modal-notification.component';
import { first } from 'rxjs';
import { TakeService } from '../../../services/take';
import { UpdateService } from '../../../services/update';
import { AuthService } from '../../../../core/services/auth.service';
import { ApprovalHomoPfService } from '../../../services/approval-homo-pf';
import { Person, WorkFlowAssignmentHomo } from '../../../models/homoPf/appproval-homo-pf';
import { WorkFlowClientHomoDet } from '../../../models/homoPf/detail-homo-pf';

export interface DataHomoClient {
  typeOfPerson: string;
  firstName: string;
  middleName: string;
  firstSurname: string;
  secondSurname: string;
  curp: string;
  rfc: string;
  nif: string;
  tin: string;
  nss: string;
  id: string;
}

@Component({
  selector: 'app-homonymy-approval-modal',
  standalone: false,
  templateUrl: './homonymy-approval-modal.component.html',
  styleUrl: './homonymy-approval-modal.component.scss'
})
export class HomonymyApprovalModalComponent {
  readonly data: any = inject(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly notificationService = inject(NotificationsService);
  private readonly takeService = inject(TakeService);
  private readonly updateService = inject(UpdateService);
  private readonly updateHomoService = inject(ApprovalHomoPfService);
  private readonly authService = inject(AuthService);

  dataBody: WorkFlowAssignmentHomo = {
    workFlowAssignmentId: 0,
    person: {
      typePerson: 1,
      firstName: '',
      middleName: '',
      lastName: '',
      secondLastName: '',
      curp: '',
      rfc: '',
      nif: '',
      tin: '',
      nss: '',
    },
    advisor: {
      id: 0
    }
  };

  dataPerson: Person = {
    typePerson: 1,
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    curp: '',
    rfc: '',
    nif: '',
    tin: '',
    nss: '',
  };
  displayedColumns: string[] = [];
  dataSource: any;
  dataTable: DataHomoClient[] = [];

  close(): void {
    this.dialog.closeAll();
  }

  constructor() {
    this.takeService.take({ domainUser: this.authService.getUserInfo()().employeeId, workflowId: this.data.id })
      .subscribe({
        next: (response) => {
        },
        error: (error) => {
        },
        complete: () => {
        }
      });
  }
  ngOnInit() {
    console.log(this.data.data)
    this.dataTable = this.mapClients(this.data.data);
    console.log(this.dataTable)
    this.displayedColumns = ['client', 'typeOfPerson', 'firstName', 'middleName', 'firstSurname', 'secondSurname', 'curp', 'rfc', 'nif', 'tin', 'nss'];
    this.dataSource = new MatTableDataSource<DataHomoClient>(this.dataTable);
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
            this.updateService.update({ workflowId: this.data.id, status: 4, reasonRejection: message || "" })
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
                    title: 'Se ha Rechazado la Solicitud con ID ' + this.data.id,
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
    console.log(this.dataPerson);
    if (this.dataPerson.firstName != '' && this.dataPerson.lastName != '') {
      let hasResponse = false;
      this.dataBody = { ...this.dataBody, workFlowAssignmentId: this.data.id, person: this.dataPerson, advisor: { id: Number(this.authService.getUserInfo()().employeeId) } }
      this.updateHomoService.update(this.dataBody)
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
              title: 'Se ha Aprobado la Solicitud con ID' + this.data.id,
              btnAccept: 'Terminar'
            });
            if (approveResponse?.value || JSON.stringify(approveResponse) === '{}') {
              this.dialog.closeAll();
            }
          }
        });
    } else {
      this.notificationService.error("Primer Nombre y Primer Apellido son Obligatorios");
    }
  }

  selectedCells = new Map<string, { id: string, value: string }>();
  toggleCell(element: any, column: string): void {
    const key = column;
    const id = element.id;
    const value = element[column]; // Obtiene el valor del dato

    if (this.selectedCells.get(key)?.id === id) {
      this.selectedCells.delete(key);
      if (column === "firstName") {
        this.dataPerson = { ...this.dataPerson, firstName: '' }
      } else if (column === "middleName") {
        this.dataPerson = { ...this.dataPerson, middleName: '' }
      }
      else if (column === "firstSurname") {
        this.dataPerson = { ...this.dataPerson, lastName: '' }
      }
      else if (column === "secondSurname") {
        this.dataPerson = { ...this.dataPerson, secondLastName: '' }
      }
      else if (column === "curp") {
        this.dataPerson = { ...this.dataPerson, curp: '' }
      }
    } else {
      this.selectedCells.set(key, { id, value });
      if (column === "firstName") {
        this.dataPerson = { ...this.dataPerson, firstName: value }
      } else if (column === "middleName") {
        this.dataPerson = { ...this.dataPerson, middleName: value }
      }
      else if (column === "firstSurname") {
        this.dataPerson = { ...this.dataPerson, lastName: value }
      }
      else if (column === "secondSurname") {
        this.dataPerson = { ...this.dataPerson, secondLastName: value }
      }
      else if (column === "curp") {
        this.dataPerson = { ...this.dataPerson, curp: value }
      }
    }
  }

  isCellSelected(element: any, column: string): boolean {
    const id = element.id;
    return this.selectedCells.get(column)?.id === id;
  }

  selectedCell: { id: string, column: string } | null = null;

  updateSelection(element: any, column: string): void {
    if (this.selectedCell && this.selectedCell.id === element.id && this.selectedCell.column === column) {
      this.selectedCell = null; // Deseleccionar si ya está seleccionado
      if (column === "rfc") {
        this.dataPerson = { ...this.dataPerson, rfc: '' }
      } else if (column === "nif") {
        this.dataPerson = { ...this.dataPerson, nif: '' }
      }
      else if (column === "tin") {
        this.dataPerson = { ...this.dataPerson, tin: '' }
      }
      else if (column === "nss") {
        this.dataPerson = { ...this.dataPerson, nss: '' }
      }
    } else {
      this.selectedCell = { id: element.id, column }; // Seleccionar la nueva celda
    }
    // Mostrar el valor seleccionado
    if (this.selectedCell) {
      const value = element[column];
      if (column === "rfc") {
        this.dataPerson = { ...this.dataPerson, rfc: value }
        this.dataPerson = { ...this.dataPerson, nif: '' }
        this.dataPerson = { ...this.dataPerson, tin: '' }
        this.dataPerson = { ...this.dataPerson, nss: '' }
      } else if (column === "nif") {
        this.dataPerson = { ...this.dataPerson, nif: value }
        this.dataPerson = { ...this.dataPerson, rfc: '' }
        this.dataPerson = { ...this.dataPerson, tin: '' }
        this.dataPerson = { ...this.dataPerson, nss: '' }
      }
      else if (column === "tin") {
        this.dataPerson = { ...this.dataPerson, tin: value }
        this.dataPerson = { ...this.dataPerson, rfc: '' }
        this.dataPerson = { ...this.dataPerson, nif: '' }
        this.dataPerson = { ...this.dataPerson, nss: '' }
      }
      else if (column === "nss") {
        this.dataPerson = { ...this.dataPerson, nss: value }
        this.dataPerson = { ...this.dataPerson, rfc: '' }
        this.dataPerson = { ...this.dataPerson, nif: '' }
        this.dataPerson = { ...this.dataPerson, tin: '' }
      }
    }
  }

  isCellActive(element: any, column: string): boolean | null {
    return this.selectedCell && this.selectedCell.id === element.id && this.selectedCell.column === column;
  }

  mapClients(input: WorkFlowClientHomoDet[]): DataHomoClient[] {
    console.log(input)
    return input.map((c) => (
      {
        id: c.clientNumber ?? '', // aseguramos string
        typeOfPerson: c.typePerson === 1 ? 'FISICA' : c.typePerson === 2 ? 'MORAL' : '',
        firstName: c.firstName ?? '',
        middleName: c.middleName ?? '',
        firstSurname: c.lastName ?? '',
        secondSurname: c.secondLastName ?? '',
        curp: c.curp ?? '',
        rfc: c.rfc ?? '',
        nif: c.nif ?? '',
        tin: c.tin ?? '',
        nss: c.nss ?? '',
      }));
  }
}
