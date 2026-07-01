import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from "@angular/forms";
import { first } from "rxjs";
import { ModalNotificationComponent } from "../../../../shared/components/modals/modal-notification/modal-notification.component";
import { CatalogsService } from "../../../../shared/services/catalogs.service";
import { NotificationModalService } from "../../../../shared/services/notification-modal.service";
import { TakeService } from "../../../services/take";
import { UpdateService } from "../../../services/update";
import { AuthService } from "../../../../core/services/auth.service";

@Component({
  selector: 'app-curp-rfc-approval-modal',
  standalone: false,
  templateUrl: './curp-rfc-approval-modal.component.html',
  styleUrl: './curp-rfc-approval-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurpRfcApprovalComponent {
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
    secondName: [{ value: '', disabled: true }],
    firstLastName: [{ value: '', disabled: true }],
    secondLastName: [{ value: '', disabled: true }],
    previousCurp: [{ value: '', disabled: true }],
    newcurp: [{ value: '', disabled: true }],
    previousRFC: [{ value: '', disabled: true }],
    newRFC: [{ value: '', disabled: true }],
    comment: [{ value: '', disabled: false }],
  });

  ngOnInit() {
    console.log(this.data.data.taskNumber)
    this.profileForm.patchValue({
      taskNumber: this.data.data.taskNumber,
      bankingArea: !this.data.data.bankingArea ? ''
        : this.data.data.bankingArea === 999 || this.data.data.bankingArea === '999' ? 'BANCO'
          : this.data.data.bankingArea === 998 || this.data.data.bankingArea === '998' ? 'CASA DE BOLSA' : '',
      contractNumber: this.data.data.taskNumber,
      clientNumber: this.data.data.clientNumber,
      typeOfPerson: !this.data.data.personType ? ''
        : this.data.data.personType === '1' || this.data.data.personType === 1 ? 'PERSONA FISICA'
          : this.data.data.personType === '2' || this.data.data.personType === 2 ? 'PERSONA MORAL' : '',
      rol: this.data.data.role,
      financialCenter: this.data.data.financialCenter,
      advisor: this.data.data.advisor,
      statusRequestWorkflow: this.data.data.workflowRequestStatus,
      requestDateWorkflow: this.data.data.workflowRequestDate,
      requestTimeWorkflow: this.data.data.workflowRequestTime,
      name: this.data.data.firstName,
      secondName: this.data.data.secondName,
      firstLastName: this.data.data.lastName,
      secondLastName: this.data.data.secondLastName,
      previousCurp: this.data.data.curp,
      newcurp: this.data.data.updatedCurp,
      previousRFC: this.data.data.rfc,
      newRFC: this.data.data.updatedRfc,
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
