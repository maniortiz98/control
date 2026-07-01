import { Component, inject, signal } from '@angular/core';
import { HomonymsResponse, WorkflowHomonymsRequest } from '../../models/customer-homonyms';
import { AuthService } from '../../../core/services/auth.service';
import { CreateWfHomoPfService } from '../../../shared/services/create-wf-homo-pf.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfigDataTable } from '../table-results/customer-table-results-interfaces';
import { PageEvent } from '@angular/material/paginator';
import { lastValueFrom } from 'rxjs';
import { CustomerHomonymsService } from '../../services/customer-homonyms.service';
import { CustomerNotificationModalService } from '../../services/customer-notification-modal.service';
import { CustomerOnboardingService } from '../../services/customer-onboarding.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';

@Component({
  selector: 'app-customer-homonyms',
  standalone: false,
  templateUrl: './customer-homonyms.component.html',
  styleUrl: './customer-homonyms.component.scss'
})
export class CustomerHomonymsComponent {
  private readonly dataHomonymService = inject(CustomerHomonymsService);
  private readonly dataSignal = signal<HomonymsResponse[] | null>(null);
  private readonly authService = inject(AuthService);
  private readonly wfHomo = inject(CreateWfHomoPfService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notificationModalService = inject(CustomerNotificationModalService);
  private readonly onboardingService = inject(CustomerOnboardingService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly dialog = inject(MatDialog);
  columnsData: Array<any> = [];
  dataClient: Array<any> = [];
  dataClientSelected: Array<HomonymsResponse> = [];
  config: ConfigDataTable = {
    showPag: false,
    showViewAction: false,
    showEditAction: false,
    showDeleteAction: false,
    multipleSelection: false,
    isSelected: false,
    idName: 'clientNumber'
  };
  butonContinue: boolean = false;
  butonNotClient: boolean = false;
  butonUnifi: boolean = false;

  constructor(private readonly modalRef: MatDialogRef<CustomerHomonymsComponent>) {

  }

  show: boolean = false;
  showContinue: boolean = true;


  ngOnInit(): void {
    if (this.onboardingService.getCurrentInfo().isMaintenance) {
      this.showContinue = false;
      this.show = true;
      this.config = { ...this.config, multipleSelection: true, };
    }

    this.dataSignal.set(this.dataHomonymService.getData());
    this.dataClient = this.dataSignal()?.map((data: HomonymsResponse) => {
      return {
        "firstName": data.firstName,
        "secondName": data.secondName,
        "lastName": data.lastName,
        "secondLastName": data.secondLastName,
        "rfc": data.rfc,
        "curp": data.curp,
        "percentSimilarity": Math.round(data.percentSimilarity * 100).toString() + "%",
        "clientNumber": data.clientNumber
      }
    }) || [];
    console.log(this.dataClient);
    this.columnsData = [
      { name: 'percentSimilarity', title: '%', show: true, type: 'string' },
      { name: 'clientNumber', title: 'No. Cliente', show: true, type: 'string' },
      { name: 'firstName', title: 'Primer Nombre o Razón Social', show: true, type: 'string' },
      { name: 'secondName', title: 'Segundo Nombre', show: true, type: 'string' },
      { name: 'lastName', title: 'Primer Apellido', show: true, type: 'string' },
      { name: 'secondLastName', title: 'Segundo Apellido', show: true, type: 'string' },
      { name: 'rfc', title: 'RFC', show: true, type: 'string' },
      { name: 'curp', title: 'CURP', show: true, type: 'string' },
    ];
  }

  ngAfterViewInit() {
    const index = this.dataClient.findIndex(item => item.percentSimilarity === '100%');
    if (index !== -1) {
      this.butonNotClient = false;
    } else {
      this.butonNotClient = true;
    }
  }

  rowSelected(event: any): void {
  }

  eventRow(event: any): void {
  }

  eventPage(event: PageEvent): void {
  }

  multipleRows(event: any): void {
    console.log("evento ", event)
    this.dataClientSelected = event;
    if (this.dataClientSelected.length === 1) {
      this.butonContinue = true;
      this.butonUnifi = false;
    } else if (this.dataClientSelected.length > 1) {
      this.butonContinue = false;
      this.butonUnifi = true;
    } else {
      this.butonContinue = false;
      this.butonUnifi = false;
    }
  }

  onButtonClickContinueDontSelect() {
    this.modalRef.close("continue");
  }

  onButtonClickCancel() {
    this.modalRef.close("cancel");
  }

  async onButtonClickUnifi() {
    const numExis = this.dataClientSelected.some(persona => persona.clientNumber === this.onboardingService.getCurrentInfo().clientId.toString());
    if (numExis) {
      console.log('Unificar');
      const idsClient = this.dataClientSelected.map(persona => persona.clientNumber).join(', ');
      const nameString = this.dataClientSelected[0].firstName;
      const secondNameString = this.dataClientSelected[0].secondName;
      const lastNameString = this.dataClientSelected[0].lastName;
      const secondLastNameString = this.dataClientSelected[0].secondLastName;
      const resultName = [nameString, secondNameString, lastNameString, secondLastNameString].filter(Boolean).join(' ');
      const body: WorkflowHomonymsRequest = {
        workflowDescription: 'UNIFICACION DE CLIENTES ' + resultName + ' ' + idsClient,
        clientList: idsClient,
        advisor: {
          advisorId: this.authService.getUserInfo()().employeeId
        },
        unificationData: {
          personType: "1"
        }
      }
      const resp = await lastValueFrom(this.wfHomo.createWfPf(body));
      if (resp.idWorkflowDetalle) {
        await this.notificationModalService.success({
          title: '¡Se ha Generado el Siguiente Workflow !',
          infoToCopy: resp.idWorkflowDetalle.toString(),
          btnAccept: 'Aceptar',
        });
        this.unsavedChangesService.setUnsavedChanges(false);
        this.modalRef.close("unificar");
        this.closeAllDialogs(true)
        this.router.navigate(['/'], { relativeTo: this.route.parent });
      }
    } else {
      await this.notificationModalService.warning({
        title: '¡Debe Seleccionar al Cliente para poder Continuar!',
        afterMessages: [this.onboardingService.getCurrentInfo().clientId.toString()],
        btnAccept: 'Aceptar',
      });
    }
  }

  async onButtonContinueClient() {
    if (this.dataClientSelected[0].clientNumber === this.onboardingService.getCurrentInfo().clientId.toString()) {
      this.modalRef.close("");
    } else {
      await this.notificationModalService.warning({
        title: '¡No Puedes Continuar con este Cliente!',
        afterMessages: ['Se Debe Unificar si así se Requiere'],
        btnAccept: 'Aceptar',
      });
    }
  }

  private closeAllDialogs(includeKeepOnHttpError = false): void {
    this.dialog.openDialogs.forEach((dialogRef) => {
      const keepOpen =
        (dialogRef.componentInstance as any)?.data?.keepOnHttpError === true;
      if (!keepOpen || includeKeepOnHttpError) {
        dialogRef.close();
      }
    });
  }
}
