import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColumnsDataTable, ConfigDataTable } from '../../../../../shared/components/table-results/interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractService } from '../../../../services/contract.service';
import { Contract } from '../../../../../maintenance/models/contracts';
import { findObjectById } from '../../../../../shared/utils/search';
import { CatalogsService } from '../../../../../shared/services/catalogs.service';
import { switchMap, tap } from 'rxjs';
import { Advisor } from '../../../../models/catalogs/advisor';
import { ContractChangeStatusHistory, UpdateStatusForm, UpdateStatusResponse } from '../../../../models/contract-change-status';
import { OnboardingService } from '../../../../services/onboarding.service';

@Component({
  selector: 'app-contract-change-status',
  standalone: false,
  templateUrl: './contract-change-status.component.html',
  styleUrl: './contract-change-status.component.scss'
})
export class ContractChangeStatusComponent implements OnInit {

  private readonly formBuilder         = inject(FormBuilder);
  private readonly contractService     = inject(ContractService);
  private readonly dialogRef           = inject(MatDialogRef<ContractChangeStatusComponent>);
  private readonly catalogsService     = inject(CatalogsService);
  private readonly onboardingService   = inject(OnboardingService);

  readonly catApplicant: {value: string; text: string;}[] = [
    {value:'01' ,text:'ADMON DE CUENTAS'},
    {value:'02' ,text:'ASESORIA'},
    {value:'03' ,text:'CALL CENTER'},
    {value:'04' ,text:'CLIENTE'},
    {value:'05' ,text:'CONTROL INTERNO'},
    {value:'06' ,text:'CUMPLIMIENTO'},
    {value:'07' ,text:'GESTION OPERATIVA'},
    {value:'08' ,text:'JURIDICO'},
    {value:'09' ,text:'PLD'},
    {value:'10' ,text:'UNIDAD ESPECIALIZADA'},
    {value:'11' ,text:'SUBGERENTE'},
    {value:'12' ,text:'MESA DE CONTROL DINN'},
  ];


  readonly availableStatus: Array<{value: number; text: string;}> = [
    { value: 2, text: 'CANCELADO' },
    { value: 3, text: 'CERRADO' },
    { value: 5, text: 'APROBADO' },
    { value: 6, text: 'BLOQUEADO' },
  ];

  readonly oldStatus: Array<{value: string; text: string;}> = [
    {value:'0001' ,text:'NUEVA SOLICITUD'},
    {value:'0002' ,text:'LIQUID./MARCADOS P.ARCHIVO'},
    {value:'0003' ,text:'LIQUIDACIÓN DIRECTA'},
    {value:'0004' ,text:'REACT.CTA.- EN LIBERACIÓN'},
    {value:'0010' ,text:'ACTIVO'},
    {value:'0012' ,text:'LIQUID.CTA.-EN LIBERACIÓN'},
    {value:'0013' ,text:'LIQUIDACIÓN CTA.PLANIFIC.'},
    {value:'0014' ,text:'LIQUID.CTA.TRATAM.POST.'},
    {value:'0020' ,text:'TRANS.CLIENTE INACT./CONT'},
    {value:'0021' ,text:'PROR.CONT.CLIENTE/SUSP.'},
    {value:'A01' ,text:'DORMIDA'},
    {value:'A02' ,text:'BLOQUEADA'},
    {value:'A03' ,text:'INVERSIÓN EN LIBERACIÓN'},
    {value:'C01' ,text:'NUEVO'},
    {value:'C02' ,text:'CANCELADO'},
    {value:'C03' ,text:'CERRADO'},
    {value:'C04' ,text:'PRE APROBADO'},
    {value:'C05' ,text:'APROBADO'},
    {value:'C06' ,text:'BLOQUEADO'},
    {value:'C07' ,text:'REGISTRADO BURSANET'},
    {value:'C08' ,text:'POR ACTIVAR BURSANET'},
    {value:'C09' ,text:'POR ACTIVAR'},
    {value:'C10' ,text:'LIBERACIÓN ADMINISTRATIVA'},
    {value:'C11' ,text:'LIBERACIÓN CONTRATOS'},
    {value:'CC01' ,text:'NUEVO'},
    {value:'CC02' ,text:'CANCELADO'},
    {value:'CC03' ,text:'CERRADO'},
    {value:'CC04' ,text:'PRE APROBADO'},
    {value:'CC05' ,text:'APROBADO'},
    {value:'CC06' ,text:'BLOQUEADO'},
    {value:'CC07' ,text:'REGISTRADO BURSANET'},
    {value:'CC08' ,text:'POR ACTIVAR BURSANET'},
    {value:'CC09' ,text:'POR ACTIVAR'},
    {value:'CC10' ,text:'LIBERACIÓN ADMINISTRATIVA'},
    {value:'CC11' ,text:'LIBERACIÓN CONTRATOS'},
    {value:'I01' ,text:'INACTIVA'},
    {value:'I02' ,text:'CERRADA'},
    {value:'I03' ,text:'CANCELADA'},
    {value:'S01' ,text:'NUEVA'},
    {value:'S02' ,text:'RECHAZADA'},
    {value:'S03' ,text:'DEVUELTA'},
    {value:'S04' ,text:'CANCELADA'},
    {value:'S05' ,text:'PROCESADA'},
  ];

  catChangeStatus: Array<{value: number; text: string;}> = [];

  readonly catCauseOfChange: Array<{value: string; text: string;}> =[
    {value: "01", text: "LIQUIDACIÓN ANTICIPADA" },
    { value: "02", text: "ALTO RIESGO" },
    { value: "03", text: "ASÍ MIGRADO" },
    { value: "04", text: "AUTORIDAD" },
    { value: "05", text: "BAJOS RENDIMIENTOS" },
    { value: "06", text: "CAMBIO DE RAZÓN SOCIAL" },
    { value: "07", text: "DOCUMENTADO" },
    { value: "08", text: "ERROR ADMINISTRATIVO" },
    { value: "09", text: "FALLECIMIENTO" },
    { value: "10", text: "INDOCUMENTADO" },
    { value: "11", text: "MAL SERVICIO" },
    { value: "12", text: "NECESITA UTILIZAR EL DINERO" },
    { value: "13", text: "NON GRATO" },
    { value: "14", text: "OTROS" },
    { value: "15", text: "POSIBLE FRAUDE" },
    { value: "16", text: "PROYECTO COMERCIAL FALLIDO" },
    { value: "17", text: "QUIERE UN NUEVO CONTRATO" },
    { value: "18", text: "ROBO/EXTRAVÍO DE DOCUMENTACIÓN" },
    { value: "19", text: "APERTURA RÁPIDA" },
    { value: "20", text: "CTOS PRECARGADOS" },
    { value: "21", text: "ARTÍCULO 10 DE LA LPAB" },
    { value: "22", text: "EMBARGO POR INSTRUCCIÓN DE AUTORIDAD" },
    { value: "23", text: "ARTICULO 61" },
    { value: "24", text: "FIRMA DIGITAL" },
    { value: "25", text: "RIESGOS ADICIONALES" },
    { value: "26", text: "ILOCALIZABLE" }
  ];

  advisorCatalog: Advisor[] = [];

  // Simulación de datos para la tabla
  tableData: Array<any> = [];

  columns: ColumnsDataTable[] = [
    { name: 'timeUpdate', title: 'Fecha de Modif.', show: true, type: 'string' },
    { name: 'statusUpd',  title: 'Estatus',         show: true, type: 'string' },
    { name: 'userId',     title: 'Usuario',         show: true, type: 'string' },
    { name: 'requestId',  title: 'Solicitante',     show: true, type: 'string' },
    { name: 'cause',      title: 'Causa de cambio', show: true, type: 'string' },
  ];

  config: ConfigDataTable = {
    showPag          : false,
    showViewAction   : false,
    showEditAction   : false,
    showDeleteAction : false,
    multipleSelection: false,
    idName           : 'tr_tempid',
    singleSelection  : { show: false, title: '', propertyName: '' },
  };

  form: FormGroup<UpdateStatusForm> = this.formBuilder.group({
    currentStatus: [{ value: '', disabled: true }],
    newStatus: [null as any as number, [Validators.required]],
    requestor: ['', [Validators.required]],
    changeCause: ['', [Validators.required]],
    observations: [''],
  }) as FormGroup<UpdateStatusForm>;

  /**
   * Constructor
   */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Contract | null
  ) {
    this.form.patchValue({ currentStatus: data?.accountStatus });
  }

  /**
   * On Init
   */
  ngOnInit(): void {
    this.catalogsService.getAdvisor().pipe(
      tap((advisorCatalog: Advisor[]) => {
        this.advisorCatalog = advisorCatalog;
      }),
      switchMap(() => this.contractService.changeStatusHistory())
    ).subscribe((history: ContractChangeStatusHistory[]) => {
      this.tableData = history.map((item: ContractChangeStatusHistory) => {
        const req  = findObjectById(item.requestId, this.catApplicant, 'value');
        const upd  = findObjectById(item.statusUpd, this.oldStatus, 'value');
        const caus = findObjectById(item.cause, this.catCauseOfChange, 'value');
        const user = findObjectById(item.userId, this.advisorCatalog, 'advisorCode');
        const name = user ? user.email.split('@')[0] : item.userId;

        item.requestId = req  ? req['text']  : item.requestId;
        item.statusUpd = upd  ? upd['text']  : item.statusUpd;
        item.cause     = caus ? caus['text'] : item.cause;
        item.userId    = name;

        return item;
      });
    });

    this.setStatusCatalog();
  }

  /**
   *
   */
  onSubmit(): void {
    document.body.classList.add('show-validation');
    this.form.markAllAsTouched();

    if ( !this.form.valid ) {
      return;
    }

    this.contractService.updateStatus(this.form.getRawValue()).subscribe({
      next: (response: UpdateStatusResponse) => {
        console.log(response);

        this.upadateStatusSignal(response);

        // ACTIVA FUNCIONALIDAD DE NOTIFICACION EN CAMBIO STATUS "CANCELADO"
         if ( 2 === this.form.getRawValue().newStatus || 'C02' === response.newStatus ) {
          this.contractService.sendContractStatusChangeNotification().subscribe();
        }

        this.dialogRef.close({
          ok: true
        });
      },
      error: (err: any) => {
        console.log(err);
        this.dialogRef.close({
          ok: false,
          error: err
        });
      }
    });
  }

  /**
   * Updates the signal "_currentInfo" in OnboardingService
   */
  upadateStatusSignal(response: UpdateStatusResponse): void {
    let data = this.onboardingService.getCurrentInfo();
    console.log(data.accountData);
    if ( data.accountData ) {
      console.log(response);
      console.log(this.oldStatus);
      console.log(this.availableStatus);
      let upd = findObjectById(response.newStatus, this.oldStatus, 'value');
      console.log(upd);
      data.accountData.accountStatus = upd?.text ?? '';
      data.accountData.accountStatusId = this.form.getRawValue().newStatus.toString();
      this.onboardingService.updateCurrentOnboardingInfo({accountData: data.accountData});
    }
  }

  /**
   * Set Status Catalog
   */
  setStatusCatalog(): void {

    const status = this.data?.accountStatus.toUpperCase();

    if ( status && 'APROBADO' === status ) {
      this.catChangeStatus = [
        { value: 6, text: 'BLOQUEADO' },
        { value: 2, text: 'CANCELADO' },
      ];
    } else if ( status && 'NUEVO' === status ) {
      this.catChangeStatus = [
        { value: 5, text: 'APROBADO' },
        { value: 2, text: 'CANCELADO' },
      ];
    } else if ( status && 'BLOQUEADO' === status ) {
      this.catChangeStatus = [
        { value: 5, text: 'APROBADO' },
      ];
    }
  }

  /**
   *
   */
  close(): void {
    this.dialogRef.close();
  }
}
