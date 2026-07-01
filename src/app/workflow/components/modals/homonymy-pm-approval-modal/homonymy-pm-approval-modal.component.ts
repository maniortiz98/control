import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { first } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { ModalNotificationComponent } from '../../../../shared/components/modals/modal-notification/modal-notification.component';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { TakeService } from '../../../services/take';
import { UpdateService } from '../../../services/update';

export interface DataHomoClient {
  id: string,
  typeOfPerson: string,
  nationality: string,
  companyName: string,
  dateOfIncorporation: string,
  rfc: string,
  nif: string,
  tin: string,
}

const ELEMENT_DATA: DataHomoClient[] = [
  // {
  //   id:"1",
  //   typeOfPerson: 'MORAL',
  //   nationality: 'ASD',
  //   companyName: 'ASD',
  //   dateOfIncorporation: '12/12/1900',
  //   rfc: 'QWE123312S',
  //   nif: 'NIF123312S',
  //   tin: 'TIN123312S'
  // },
  // {
  //   id:"2",
  //   typeOfPerson: 'MORAL',
  //   nationality: 'ASD',
  //   companyName: 'ASD',
  //   dateOfIncorporation: '12/12/1900',
  //   rfc: 'QWE123312S',
  //   nif: 'NIF123312S',
  //   tin: 'TIN123312S'
  // },
  // {
  //   id:"3",
  //   typeOfPerson: 'MORAL',
  //   nationality: 'ASD',
  //   companyName: 'ASD',
  //   dateOfIncorporation: '12/12/1900',
  //   rfc: 'QWE123312S',
  //   nif: 'NIF123312S',
  //   tin: 'TIN123312S'
  // }
];

@Component({
  selector: 'app-homonymy-pf-approval-modal',
  standalone: false,
  templateUrl: './homonymy-pm-approval-modal.component.html',
  styleUrl: './homonymy-pm-approval-modal.component.scss'
})
export class HomonymyPmApprovalModalComponent {
  readonly data: any = inject(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly notificationService = inject(NotificationsService);
  private readonly takeService = inject(TakeService);
  private readonly updateService = inject(UpdateService);
  private readonly authService = inject(AuthService);

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
            this.updateService.update({ workflowId: this.data.data.id, status: 4, reasonRejection: message || "" })
              .subscribe({
                next: async (response) => {
                },
                error: (error) => {
                },
                complete: async () => {
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
    this.updateService.update({ workflowId: this.data.data.id, status: 3 })
      .subscribe({
        next: (response) => {
        },
        error: (error) => {
        },
        complete: async () => {
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


  displayedColumns: string[] = ['typeOfPerson',
    'nationality',
    'companyName',
    'dateOfIncorporation',
    'rfc',
    'nif',
    'tin',];
  dataSource = new MatTableDataSource<DataHomoClient>(ELEMENT_DATA);

  selectedCells = new Map<string, { id: string, value: string }>();
  toggleCell(element: any, column: string): void {
    const key = column;
    const id = element.id;
    const value = element[column]; // Obtiene el valor del dato

    if (this.selectedCells.get(key)?.id === id) {
      this.selectedCells.delete(key);
      console.log(`Deselected: ${column} - ID: ${id}, Value: ${value}`);
    } else {
      this.selectedCells.set(key, { id, value });
      console.log(`Selected: ${column} - ID: ${id}, Value: ${value}`);
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
    } else {
      this.selectedCell = { id: element.id, column }; // Seleccionar la nueva celda
    }
    // Mostrar el valor seleccionado
    if (this.selectedCell) {
      const value = element[column];
      console.log(`Selected value: ${value}, Column: ${column}`);
    }
  }

  isCellActive(element: any, column: string): boolean | null {
    return this.selectedCell && this.selectedCell.id === element.id && this.selectedCell.column === column;
  }
}
