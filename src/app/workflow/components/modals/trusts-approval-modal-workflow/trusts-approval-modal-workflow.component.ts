import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ModalNotificationComponent } from '../../../../shared/components/modals/modal-notification/modal-notification.component';
import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { TakeService } from '../../../services/take';
import { UpdateService } from '../../../services/update';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-trusts-approval-modal-workflow',
  standalone: false,
  templateUrl: './trusts-approval-modal-workflow.component.html',
  styleUrl: './trusts-approval-modal-workflow.component.scss'
})
export class TrustsApprovalModalWorkflowComponent {

  readonly data: any = inject(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly takeService = inject(TakeService);
  private readonly updateService = inject(UpdateService);
  private readonly authService = inject(AuthService);


  profileForm: FormGroup = this.fb.nonNullable.group({
    taskNumber: [{ value: '', disabled: true }],
    bankingArea: [{ value: '', disabled: true }],
    trustApplicationNumber: [{ value: '', disabled: true }],
    trustApplicationStatus: [{ value: '', disabled: true }],
    trustNumber: [{ value: '', disabled: true }],
    clientNumber: [{ value: '', disabled: true }],
    financialCenterName: [{ value: '', disabled: true }],
    assignedAdvisor: [{ value: '', disabled: true }],
    workflowApplicationStatus: [{ value: '', disabled: true }],
    workflowApplicationDate: [{ value: '', disabled: true }],
    workflowApplicationTime: [{ value: '', disabled: true }],
    comment: [{ value: '', disabled: false }],
  });

  patchValue = {
    taskNumber: '',
    bankingArea: '',
    trustApplicationNumber: '',
    trustApplicationStatus: '',
    trustNumber: '',
    clientNumber: '',
    financialCenterName: '',
    assignedAdvisor: '',
    workflowApplicationStatus: '',
    workflowApplicationDate: '',
    workflowApplicationTime: '',
    comment: '',
  };

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
    this.updateService.update({ workflowId: this.data.data.id, status: 3, reasonRejection: this.profileForm.getRawValue().comment ?? '' })
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
