import { Component, inject, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { HomonymsService } from '../../../shared/services/homonyms.service';
import { HomonymsResponse, WorkflowHomonymsRequest } from '../../models/homonyms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfigDataTable } from '../../../shared/components/table-results/interfaces';
import { AuthService } from '../../../core/services/auth.service';
import { CreateWfHomoPfService } from '../../../shared/services/create-wf-homo-pf.service';
import { lastValueFrom } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';

@Component({
  selector: 'app-homonimias',
  standalone: false,
  templateUrl: './homonimias.component.html',
  styleUrl: './homonimias.component.scss'
})
export class HomonimiasComponent {
  private readonly dataHomonymService = inject(HomonymsService);
  private readonly dataSignal = signal<HomonymsResponse[] | null>(null);
  private readonly authService = inject(AuthService);
  private readonly wfHomo = inject(CreateWfHomoPfService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly dialog = inject(MatDialog);
  columnsData: Array<any> = [];
  dataClient: Array<any> = [];
  dataClientSelected: Array<HomonymsResponse> = [];
  config: ConfigDataTable = {
    showPag: false,
    showViewAction: false,
    showEditAction: false,
    showDeleteAction: false,
    multipleSelection: true,
    isSelected: false,
    idName: 'clientNumber'
  };
  butonContinue: boolean = false;
  butonNotClient: boolean = false;
  butonUnifi: boolean = false;

  constructor(private readonly modalRef: MatDialogRef<HomonimiasComponent>) {

  }


  ngOnInit(): void {

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

  ngAfterViewInit(){
    const index = this.dataClient.findIndex(item => item.percentSimilarity === '100%');
    if (index !== -1) {
      this.butonNotClient = false;
    }else{
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

  async onButtonClickUnifi() {
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
      this.modalRef.close("");
      this.closeAllDialogs(true)
      this.router.navigate(['/'], { relativeTo: this.route.parent });
    }
  }

  onButtonContinueClient() {
    console.log('Continuar con Cliente', this.dataClientSelected[0].clientNumber);
    this.modalRef.close(this.dataClientSelected[0].clientNumber);
    //TODO Aquí puedes agregar la lógica que desees ejecutar si solo se selecciona uno
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

