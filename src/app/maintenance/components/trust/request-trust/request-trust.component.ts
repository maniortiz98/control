import { Component, inject, signal } from '@angular/core';
import { TrustService } from '../../../../shared/services/storage-services/pm/trust.service';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { GeneralInfoStorageService } from '../../../../shared/services/storage-services/general-info-storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnsDataTable, ConfigDataTable } from '../../../../shared/components/table-results/interfaces';
import { InternTrust, InternTrustRequest } from '../../../../onboarding/models/trust';
import { NOTIFICATION_MESSAGES, SUCCESS_MESSAGES } from '../../../../onboarding/constants/form-messages';
import { firstValueFrom, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ModalTrustComponent } from '../modal-trust/modal-trust.component';

@Component({
  selector: 'app-request-trust',
  standalone: false,
  templateUrl: './request-trust.component.html',
  styleUrl: './request-trust.component.scss'
})
export class RequestTrustComponent {
  private readonly trustStorage = inject(TrustService);
  private readonly notificationService = inject(NotificationsService);
  private readonly notificationModal = inject(NotificationModalService);
  private readonly storageService = inject(GeneralInfoStorageService);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);

  form: FormGroup = this.fb.group({
    trustRequestNumber: [''],
    trustNumber: [''],

    clientNumber: [''],
    asignedAsesor: [''],

    status: [''],
    creationDate: [''],
  })

  trustData = signal<InternTrustRequest[]>([]);
  trustColumns: Array<ColumnsDataTable> = [];
  trustConfigs: ConfigDataTable = { showPag: false, showViewAction: true, showEditAction: true, showDeleteAction: true, multipleSelection: false };

  ngOnInit() {
    this.trustColumns = [
      { name: 'status', title: 'Estatus', show: true, type: 'string' },
      { name: 'trustRequestId', title: 'No. Solicitud Fideicomiso', show: true, type: 'string' },
      { name: 'trustNumber', title: 'No. Fideicomiso', show: true, type: 'string' },
      { name: 'clientNumber', title: 'No. Cliente', show: true, type: 'string' },
      { name: 'creationDate', title: 'Fecha de Creación', show: true, type: 'string' },
      { name: 'asesorName', title: 'Asesor Asignado', show: true, type: 'string' },
    ]
  }

  options: any = [
    {
      id: 1,
      value: 'NUEVA',
      text: 'text 1'
    },
    {
      id: 2,
      value: 'CANCELADA',
      text: 'text 2'
    },
    {
      id: 3,
      value: 'APROBADA',
      text: 'text other'
    },
    {
      id: 3,
      value: 'EN PROCESO',
      text: 'text 3'
    }
  ]

  search() {
    const mockData: InternTrustRequest[] = [
      {
        trustRequestId: '1',
        creationDate: '12/12/2025',
        status: 'EN PROCESO',
        asesorId: '123',
        asesorName: 'Jon Doe',

        branchId: '123',
        branchName: 'Sucursal 1',

        clientNumber: '44454647',
        trustNumber: '12345678',
        contractBankAmount: '1',
        contractBrokerAmount: '2',
        trustType: 'INTERNO',

        internTrustType: 1,
        trustPersonType: 1,
        profileType: 2,
        phones: [{
          phoneType: "OFICINA",
          phoneCountry: "ALBANIA",
          phoneCodeArea: "355",
          phone: "1123123123123",
          phoneExtension: "",
          phoneNotification: false,
          id: "1f5217ee-f1b0-448b-82d2-4714c5b86969",
          phoneTypeId: "3",
          phoneCountryId: "AL",
          active: false,
        }],
        mails: [{
          id: "1f5217ee-f1b0-448b-82d2-4714c5b86969",
          mail: 'example@gmail.com ',
          mailNotification: false,
          active: false,
        }],
        recomendations: 'Lorem ipsum'
      }
    ]

    this.notificationService.info('En espera de entrega de servicio Backend')
    //this.trustData.set(mockData);
  }

  async eventRowTrust(event: any) {
    if (event.type === 'edit') {
      await this.editTrust(event);
    }
    if (event.type === 'delete') {
      await this.deleteTrust(event);
    }
    if(event.type == 'view'){
      await this.viewTrust(event);
    }
  }

  async editTrust(event: any){
    const editedItem = await firstValueFrom(this.callTrustModal(false, event.row));
  }

  async viewTrust(event: any){
    const editedItem = await firstValueFrom(this.callTrustModal(true, event.row));
  }

  async deleteTrust(event: any) {
    const result = await this.notificationModal.confirm({
      title: NOTIFICATION_MESSAGES.DELETE_CONFIRMATION_MESSAGE,
      btnAccept: 'Sí, Eliminar',
      btnDeny: 'No',
    });
    if (result?.value === true) {
      const itemToDelete = event.row
      this.trustData.update(list => list.filter(item => item.trustRequestId != itemToDelete.trustRequestId))
      this.notificationService.success(SUCCESS_MESSAGES.DELETE_COTITULAR)
    }
  }

  private callTrustModal(onlyRead: boolean, content?: InternTrustRequest):
    Observable<InternTrustRequest | undefined> {
    const dialogRef = this.dialog.open(ModalTrustComponent, {
      panelClass: ['trust-modal'],
      disableClose: true,
      data: {
        onlyRead,
        content,
      }
    });
    return dialogRef.afterClosed();
  }
}
