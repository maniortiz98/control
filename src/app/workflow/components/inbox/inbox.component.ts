import { Component, inject, signal } from '@angular/core';
import { InboxService } from '../../services/inbox.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { ERROR_MESSAGES } from '../../../onboarding/constants/form-messages';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CurpRfcApprovalComponent } from '../modals/curp-rfc-approval-modal/curp-rfc-approval-modal.component';
import { ContractApprovalModalComponent } from '../modals/contract-approval-modal/contract-approval-modal.component';
import { HomonymyApprovalModalComponent } from '../modals/homonymy-approval-modal/homonymy-approval-modal.component';
import { PfPldApprovalWorkflowComponent } from '../modals/pf-pld-approval-workflow/pf-pld-approval-workflow.component';
import { PmPldApprovalWorkflowComponent } from '../modals/pm-pld-approval-workflow/pm-pld-approval-workflow.component';
import { InvestmentProfileRestructuringComponent } from '../modals/investment-profile-restructuring/investment-profile-restructuring.component';
import { AssignmentDetail } from '../../models/inbox/inboxData';
import { AuthService } from '../../../core/services/auth.service';
import { UserInfo } from '../../../core/models/user-info';
import { DetailService } from '../../services/detail-contract-approval';
import { WorkflowAssignmentDetail } from '../../models/contractApproval/detail';
import { HomonymyPmApprovalModalComponent } from '../modals/homonymy-pm-approval-modal/homonymy-pm-approval-modal.component';
import { TrustsApprovalModalWorkflowComponent } from '../modals/trusts-approval-modal-workflow/trusts-approval-modal-workflow.component';
import { ColumnsDataTable, ConfigDataTable } from '../../../shared/components/table-results/interfaces';
import { DetailServicePldPf } from '../../services/pld-detail-pf';
import { ApplicationData } from '../../models/pldPf/pld-pf-detail';
import { WorkFlowClientHomoDet } from '../../models/homoPf/detail-homo-pf';
import { DetailServiceHomoPf } from '../../services/detail-homo-pf';
import { CurpRfcApprovalModalPmComponent } from '../modals/curp-rfc-approval-modal-pm/curp-rfc-approval-modal-pm.component';
import { RfcCurpData } from '../../models/curpAndRfc/rfcCurpData.interface';
import { CurpRfcPfService } from '../../services/curp-rfc-pf.service';



@Component({
  selector: 'app-inbox',
  standalone: false,
  templateUrl: './inbox.component.html',
  styleUrl: './inbox.component.scss'
})
export class InboxComponent {
  private readonly notificationService = inject(NotificationsService);
  private readonly authService = inject(AuthService);
  readonly userInfo = signal<UserInfo>({
    name: '',
    username: '',
    employeeId: '',
    localAccountId: '',
    homeAccountId: '',
    idToken: '',
    roles: [],
    rol: ''
  });

  config: ConfigDataTable =
    {
      showPag: true,
      showEditAction: false,
      showDeleteAction: false,
      showViewAction: false,
      multipleSelection: false,
      isSelected: true,
      idName: "id",
      sort: true,
    };
  private inboxService = inject(InboxService);
  private detailService = inject(DetailService);
  private detailServicePldPf = inject(DetailServicePldPf);
  private detailServiceHomoPf = inject(DetailServiceHomoPf);
  private detailCurpRfcPfServiceServiceHomoPf = inject(CurpRfcPfService);

  data: AssignmentDetail[] = [];

  resultTableCols: ColumnsDataTable[] = [
    {
      name: 'id',
      title: 'ID',
      show: true,
      type: 'string'
    }, {
      name: 'workflowStatus',
      title: 'Estatus',
      show: true,
      type: 'status'
    }, {
      name: 'requestDate',
      title: 'Fecha Creación',
      show: true,
      type: 'string'
    },
    {
      name: 'responseDate',
      title: 'Fecha Termino',
      show: true,
      type: 'string'
    },
    {
      name: 'createdBy',
      title: 'Nombre del Solicitante',
      show: true,
      type: 'string'
    },
    {
      name: 'description',
      title: 'Concepto de la Solicitud',
      show: true,
      type: 'string'
    },
    {
      name: 'personType',
      title: 'Persona',
      show: true,
      type: 'string'
    },
    {
      name: 'workFlowID',
      title: 'Fecha de Aprobación',
      show: false,
      type: 'string'
    },
    {
      name: 'personTypeID',
      title: 'Fecha de Aprobación',
      show: false,
      type: 'string'
    },
    {
      name: 'idName',
      title: 'idName',
      show: false,
      type: 'string'
    }
  ]

  resultTableData: any = [];
  selectedRowData: any;
  filterString: string = '';

  constructor(
    private readonly dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.recarga();
  }

  cancelEvent() {
    this.config = {
      showPag: true,
      showEditAction: false,
      showDeleteAction: false,
      showViewAction: false,
      multipleSelection: false,
      isSelected: false,
      idName: "id"
    }
  }

  async consultar() {
    if (this.selectedRowData) {
      const data = "";
      if (this.selectedRowData.workFlowID === 1) {
        const data = await this.findObjectById(this.selectedRowData.id).then();
        const dialogRef = this.dialog.open(ContractApprovalModalComponent, {
          maxWidth: '99%',
          width: '95%',
          height: 'auto', maxHeight: '80vh',
          data: {
            data: { data: data },
            edit: false
          }
        });
        dialogRef.afterClosed().subscribe((modalData: any) => {

          this.recarga();
        });
      } else if (this.selectedRowData.workFlowID === 3) {
        if (this.selectedRowData.personTypeID === 1) {
          const data = await this.findObjecHomoPfById(this.selectedRowData.id).then();
          const dialogRef = this.dialog.open(HomonymyApprovalModalComponent, {
            maxWidth: '99%',
            width: '80%',
            height: 'auto', maxHeight: '80vh',
            data: { data: data, id: this.selectedRowData.id },
          });
          dialogRef.afterClosed().subscribe((modalData: any) => {

            this.recarga();
          });
        } else if (this.selectedRowData.personTypeID === 2) {
          console.log("MORAL");
          const dialogRef = this.dialog.open(HomonymyPmApprovalModalComponent, {
            maxWidth: '99%',
            width: '80%',
            height: 'auto', maxHeight: '80vh',
            data: { data: data },
          });
          dialogRef.afterClosed().subscribe((modalData: any) => {

            this.recarga();
          });
        }
      } else if (this.selectedRowData.workFlowID === 4) {
        if (this.selectedRowData.personTypeID === 1) {
          const data = await this.findObjecPldPftById(this.selectedRowData.id).then();
          const dialogRef = this.dialog.open(PfPldApprovalWorkflowComponent, {
            maxWidth: '99%',
            width: '95%',
            height: 'auto', maxHeight: '80vh',
            data: { data: data },
          });
          dialogRef.afterClosed().subscribe((modalData: any) => {

            this.recarga();
          });
        } else if (this.selectedRowData.personTypeID === 2) {
          const dialogRef = this.dialog.open(PmPldApprovalWorkflowComponent, {
            maxWidth: '99%',
            width: '95%',
            height: 'auto', maxHeight: '80vh',
            data: { data: data },
          });
          dialogRef.afterClosed().subscribe((modalData: any) => {

            this.recarga();
          });
        }
      } else if (this.selectedRowData.workFlowID === 5) {
        // if (this.selectedRowData.personTypeID === 1) {
          const data = await this.findObjecCurpAndRfcPfById(this.selectedRowData.id).then();
          const dialogRef = this.dialog.open(CurpRfcApprovalComponent, {
            maxWidth: '99%',
            width: '95%',
            height: 'auto', maxHeight: '80vh',
            data: { data: {...data, id:this.selectedRowData.id} },
          });
          dialogRef.afterClosed().subscribe((modalData: any) => {
            this.recarga();
          });
        // }
      } else if (this.selectedRowData.workFlowID === 6) {
        const data = await this.findObjecPldPftById(this.selectedRowData.id).then();
        const dialogRef = this.dialog.open(InvestmentProfileRestructuringComponent, {
          maxWidth: '99%',
          width: '95%',
          height: 'auto', maxHeight: '80vh',
          data: { data: data },
        });
        dialogRef.afterClosed().subscribe((modalData: any) => {
          this.recarga();
        });
      } else if (this.selectedRowData.workFlowID === 'undefined') {
        const dialogRef = this.dialog.open(TrustsApprovalModalWorkflowComponent, {
          maxWidth: '99%',
          width: '95%',
          height: 'auto', maxHeight: '80vh',
          data: { data: data },
        });
        dialogRef.afterClosed().subscribe((modalData: any) => {

          this.recarga();
        });
      }
    } else {
      this.notificationService.error(ERROR_MESSAGES.NO_DATA_SELECTED);
    }
  }

  selectedRow(event: any): void {
    console.log(event);
    this.config = {
      showPag: true,
      showEditAction: false,
      showDeleteAction: false,
      showViewAction: false,
      multipleSelection: false,
      isSelected: true,
      idName: "id"
    }
    this.selectedRowData = null;
    this.selectedRowData = event.row;
  }

  recarga() {
    this.inboxService.getTask({ domainUser: this.authService.getUserInfo()().employeeId }).subscribe(data => {
      this.data = data;
      if (this.data.length > 0) {
        const dataTable = data.map(item => ({
          id: item.id ?? '',
          idName: item.id ?? '',
          workflowStatus: item.workflowStatus.description ?? '',
          requestDate: item.requestDate ?? '',
          responseDate: item.responseDate ?? '',
          createdBy: item.createdBy?.firstName ?? '',
          description: item.description ?? '',
          personType: item.personType === 1 ? 'FISICA' : item.personType === 2 ? 'MORAL' : '',
          personTypeID: item.personType ?? '',
          workFlowID: item.workFlow.id ?? ''
        }));
        this.resultTableData = dataTable;
      } else {
        this.resultTableData = [];
        this.notificationService.info("Sin Tareas Asignadas");
      }
    });
  }

  /**
   * Apply filters to table results
   */
  applyFilters(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterString = filterValue.trim().toLowerCase();
  }

  async findObjectById(id: number): Promise<WorkflowAssignmentDetail | undefined> {
    return await this.detailService.getDetailWF({ workFlowDetailId: id }).toPromise();
  }

  async findObjecPldPftById(id: number): Promise<ApplicationData | undefined> {
    return await this.detailServicePldPf.getDetailWFPldPf({ workFlowDetailId: id }).toPromise();
  }

  async findObjecHomoPfById(id: number): Promise<WorkFlowClientHomoDet[] | undefined> {
    return await this.detailServiceHomoPf.getDetailWFHomoPf({ workFlowDetailId: id }).toPromise();
  }
  async findObjecCurpAndRfcPfById(id: number): Promise<RfcCurpData | undefined> {
    return await this.detailCurpRfcPfServiceServiceHomoPf.getDetailCurpAndRfc({ idWorkflowDetalle: id }).toPromise();
  }
}
