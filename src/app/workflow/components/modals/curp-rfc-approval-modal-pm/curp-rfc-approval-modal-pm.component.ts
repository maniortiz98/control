import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { ModalNotificationComponent } from '../../../../shared/components/modals/modal-notification/modal-notification.component';
import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { TakeService } from '../../../services/take';
import { UpdateService } from '../../../services/update';

@Component({
  selector: 'app-curp-rfc-approval-modal-pm',
  standalone: false,
  templateUrl: './curp-rfc-approval-modal-pm.component.html',
  styleUrl: './curp-rfc-approval-modal-pm.component.scss'
})
export class CurpRfcApprovalModalPmComponent {
  readonly data: any = inject(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);
  private readonly catalogService = inject(CatalogsService);
  private readonly fb = inject(FormBuilder);
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly takeService = inject(TakeService);
  private readonly updateService = inject(UpdateService);
  private readonly authService = inject(AuthService);

  profileForm: FormGroup = this.fb.nonNullable.group({
    taskNumber: [{ value: '', disabled: true }],
    bankingArea: [{ value: '', disabled: true }],
    contractNumber: [{ value: '', disabled: true }],
    clientNumber: [{ value: '', disabled: true }],
    typeOfPerson: [{ value: '', disabled: true }],
    rol: [{ value: '', disabled: true }],
    financialCenter: [{ value: '', disabled: true }],
    advisor: [{ value: '', disabled: true }],
    statusRequestWorkflow: [{ value: '', disabled: true }],
    requestDateWorkflow: [{ value: '', disabled: true }],
    requestTimeWorkflow: [{ value: '', disabled: true }],
    name: [{ value: '', disabled: true }],
    dateOfBirth: [{ value: '', disabled: true }],
    previousRFC: [{ value: '', disabled: true }],
    newRFC: [{ value: '', disabled: true }],
    comment: [{ value: '', disabled: false }],
  });

  ngOnInit() {
    this.profileForm.patchValue({
      taskNumber: '',
      bankingArea: '',
      contractNumber: '',
      clientNumber: '',
      typeOfPerson: '',
      rol: '',
      financialCenter: '',
      advisor: '',
      statusRequestWorkflow: '',
      requestDateWorkflow: '',
      requestTimeWorkflow: '',
      name: '',
      dateOfBirth: '',
      previousRFC: '',
      newRFC: '',
    });
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
    this.updateService.update({ workflowId: this.data.data.id, status: 3, reasonRejection: this.profileForm.getRawValue().comment ?? '' })
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
}

