import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { Countries } from '../../../../onboarding/models/country';
import { Entity } from '../../../../onboarding/models/entity';
import { Nationalities } from '../../../../onboarding/models/nationality';
import { ModalNotificationComponent } from '../../../../shared/components/modals/modal-notification/modal-notification.component';
import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { AuthService } from '../../../../core/services/auth.service';
import { TakeService } from '../../../services/take';
import { UpdateService } from '../../../services/update';

@Component({
  selector: 'app-pm-pld-approval-workflow',
  standalone: false,
  templateUrl: './pm-pld-approval-workflow.component.html',
  styleUrl: './pm-pld-approval-workflow.component.scss'
})
export class PmPldApprovalWorkflowComponent implements OnInit {

  readonly data: any = inject(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);
  private readonly catalogService = inject(CatalogsService);
  private readonly fb = inject(FormBuilder);
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly takeService = inject(TakeService);
  private readonly updateService = inject(UpdateService);
  private readonly authService = inject(AuthService);
  nationalities = signal<Nationalities[]>([]);
  countries = signal<Array<Countries>>([]);
  states = signal<Entity[]>([]);

  profileForm: FormGroup = this.fb.nonNullable.group({
    noTaskS: [{ value: '', disabled: true }],
    typePerson: [{ value: '', disabled: true }],
    raesonSocial: [{ value: '', disabled: true }],
    typeIden: [{ value: '', disabled: true }],
    rfc: [{ value: '', disabled: true }],
    dateOfBirth: [{ value: '', disabled: true }],
    nationality: [{ value: '', disabled: true }],
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

  patchValue = {
    noTaskS: '',
    typePerson: '',
    raesonSocial: '',
    typeIden: '',
    rfc: '',
    dateOfBirth: '',
    nationality: '',
    rol: '',
    centerF: '',
    asesor: '',
    typeOper: '',
    bankArea: '',
    contractNum: '',
    clientNum: '',
    statusWorkflow: '',
    noTask: '',
    dateWorkflow: '',
    timeWorkflow: ''
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
      { name: 'name', title: 'Razón social', show: true, type: 'string' },
      { name: 'idFiscal', title: 'RFC/NIF//EIN', show: true, type: 'string' },
      { name: 'date', title: 'Fecha de Constitución ', show: true, type: 'string' },
      { name: 'status', title: 'Estatus', show: true, type: 'string' },
      { name: 'nameList', title: 'Nombre de la Lista', show: true, type: 'string' },
      { name: 'operative', title: 'Flujo Operativo', show: true, type: 'string' },
    ];
  }
  close(): void {
    this.dialog.closeAll();
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
    this.updateService.update({ workflowId: this.data.data.id, status: 3, reasonRejection: this.profileForm.getRawValue().coment ?? '' })
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

