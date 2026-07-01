import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ColumnsDataTable, ConfigDataTable } from '../../../../shared/components/table-results/interfaces';
import { ModalNotificationComponent } from '../../../../shared/components/modals/modal-notification/modal-notification.component';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { EmailsData, PhonesData } from '../../../models/contractApproval/contractApproval.interface';
import { TakeService } from '../../../services/take';
import { UpdateService } from '../../../services/update';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-contract-approval-modal',
  standalone: false,
  templateUrl: './contract-approval-modal.component.html',
  styleUrl: './contract-approval-modal.component.scss'
})
export class ContractApprovalModalComponent {

  private readonly notificationModalService = inject(NotificationModalService);

  private readonly takeService = inject(TakeService);
  private readonly updateService = inject(UpdateService);


  private readonly dialog = inject(MatDialog);
  readonly data: any = inject(MAT_DIALOG_DATA);
  private readonly authService = inject(AuthService);
  new = true;

  public configDataTable: ConfigDataTable = {
    showPag: false,
    showEditAction: false,
    showDeleteAction: false,
    showViewAction: false,
    multipleSelection: false,
  }

  public phoneColumns: ColumnsDataTable[] = [
    { name: 'number', title: '#', type: 'string', show: true },
    { name: 'changeType', title: 'Tipo de Cambio', type: 'html', show: true },
    { name: 'phoneType', title: 'Tipo de Teléfono', type: 'string', show: true },
    { name: 'country', title: 'País', type: 'string', show: true },
    { name: 'areaCode', title: 'Código de area', type: 'string', show: true },
    { name: 'phone', title: 'Teléfono', type: 'string', show: true },
    { name: 'phoneNotification', title: 'Teléfono de Notificación', type: 'checkbox', show: true },
  ];

  public mailColumns: ColumnsDataTable[] = [
    { name: 'number', title: '#', type: 'string', show: true },
    { name: 'changeType', title: 'Tipo de Cambio', type: 'html', show: true },
    { name: 'email', title: 'Correo Electrónico', type: 'string', show: true },
    { name: 'emailNotification', title: 'Correo Electrónico de Notificación', type: 'checkbox', show: true },
  ];

  public updatedPhones: PhonesData[] = [
    { number: '1', changeType: '<span class="change-type-label modificado">Modificado</span>', phoneType: 'CELULAR', country: 'MEXICO', areaCode: '52', phone: '1234567890', phoneNotification: 'Si' },
    { number: '2', changeType: '<span class="change-type-label modificado">Modificado</span>', phoneType: 'OFICINA', country: 'ESTADOS UNIDOS', areaCode: '01', phone: '0987654321' },
    { number: '3', changeType: '<span class="change-type-label eliminado">Eliminado</span>', phoneType: 'FAX', country: 'MEXICO', areaCode: '17', phone: '1122334455' },
  ];

  public modifiedPhones: PhonesData[] = [
    { number: '1', changeType: '<span class="change-type-label modificado">Modificado</span>', phoneType: 'CELULAR', country: 'MEXICO', areaCode: '52', phone: '1234567890', phoneNotification: 'Si' },
    { number: '2', changeType: '<span class="change-type-label modificado">Modificado</span>', phoneType: 'OFICINA', country: 'ESTADOS UNIDOS', areaCode: '01', phone: '0987654321' },
  ];

  public updatedMails: EmailsData[] = [
    { number: '1', changeType: '<span class="change-type-label agregado">Agregado</span>', email: 'vazquez.deanil@gmail.com', emailNotification: 'Si' },
    { number: '2', changeType: '<span class="change-type-label modificado">Modificar</span>', email: 'sofie@good.com' },
  ];

  public modifiedMails: EmailsData[] = [
    { number: '3', changeType: '<span class="change-type-label eliminado">Eliminar</span>', email: 'sofie@good.com', emailNotification: 'Si' },
  ];

  close(): void {
    this.dialog.closeAll();
  }

  constructor() {
    const data = this.authService.getUserInfo();
    console.log(this.data)
    this.takeService.take({ domainUser: this.authService.getUserInfo()().employeeId, workflowId: this.data.data.data.id })
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
            this.updateService.update({ workflowId: this.data.data.data.id, status: 4, reasonRejection: message || "" })
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
                    title: 'Se ha Rechazado la Solicitud con ID ' + this.data.data.data.id,
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
    this.updateService.update({ workflowId: this.data.data.data.id, status: 3 })
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
            title: 'Se ha Aprobado la Solicitud con ID ' + this.data.data.data.id,
            btnAccept: 'Terminar'
          });
          if (approveResponse?.value || JSON.stringify(approveResponse) === '{}') {
            this.dialog.closeAll();
          }
        }
      });
  }

}
