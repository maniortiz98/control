import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { first } from 'rxjs';
import { ModalNotificationComponent } from '../../../../shared/components/modals/modal-notification/modal-notification.component';
import { TakeService } from '../../../services/take';
import { UpdateService } from '../../../services/update';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-investment-profile-restructuring',
  standalone: false,
  templateUrl: './investment-profile-restructuring.component.html',
  styleUrl: './investment-profile-restructuring.component.scss'
})
export class InvestmentProfileRestructuringComponent {
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
    financialCenter: [{ value: '', disabled: true }],
    advisor: [{ value: '', disabled: true }],
    statusRequestWorkflow: [{ value: '', disabled: true }],
    requestDateWorkflow: [{ value: '', disabled: true }],
    requestTimeWorkflow: [{ value: '', disabled: true }],
    previousProfile: [{ value: '', disabled: true }],
    newProfile: [{ value: '', disabled: true }],
    comment: [{ value: '', disabled: false }],
  });

  ngOnInit() {
    this.profileForm.patchValue({
      taskNumber: this.data.data.id,
      bankingArea: !this.data.data.contract.bankingArea ? ''
        : this.data.data.contract.bankingArea === 999 || this.data.data.contract.bankingArea === '999' ? 'BANCO'
          : this.data.data.contract.bankingArea === 998 || this.data.data.contract.bankingArea === '998' ? 'CASA DE BOLSA' : '',
      contractNumber: this.data.data.contract.contractNumber,
      clientNumber: this.data.data.client.clientNumber,
      typeOfPerson: !this.data.data.client.typePerson ? ''
        : this.data.data.client.typePerson === 1 || this.data.data.client.typePerson === '1' ? 'FISICA'
          : this.data.data.client.typePerson === 2 || this.data.data.client.typePerson === '2' ? 'MORAL' : '',
      financialCenter: this.data.data.financialCenter,
      advisor: this.data.data.advisor,
      statusRequestWorkflow: this.data.data.statusId === 1 ? 'LISTO'
        : this.data.data.statusId === 2 ? 'EN TRATAMIENTO'
          : this.data.data.statusId === 3 ? 'FINALIZADO'
            : this.data.data.statusId === 4 ? 'RECHAZADO' : this.data.data.statusId,
      requestDateWorkflow: this.data.data.createdDate,
      requestTimeWorkflow: this.data.data.createdHour,
      previousProfile: this.data.data.data.profile,
      newProfile: this.data.data.data.profileUpd,
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
