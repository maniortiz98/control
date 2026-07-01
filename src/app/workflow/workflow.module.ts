import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";

// Declarations
import { InboxComponent } from './components/inbox/inbox.component';
import { CurpRfcApprovalComponent } from './components/modals/curp-rfc-approval-modal/curp-rfc-approval-modal.component';

// Modules
import { WorkflowRoutingModule } from './workflow-routing.module';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ContractApprovalModalComponent } from './components/modals/contract-approval-modal/contract-approval-modal.component';
import { HomonymyApprovalModalComponent } from './components/modals/homonymy-approval-modal/homonymy-approval-modal.component';
import { PfPldApprovalWorkflowComponent } from './components/modals/pf-pld-approval-workflow/pf-pld-approval-workflow.component';
import { PmPldApprovalWorkflowComponent } from './components/modals/pm-pld-approval-workflow/pm-pld-approval-workflow.component';
import { InvestmentProfileRestructuringComponent } from './components/modals/investment-profile-restructuring/investment-profile-restructuring.component';
import { HomonymyPmApprovalModalComponent } from './components/modals/homonymy-pm-approval-modal/homonymy-pm-approval-modal.component';
import { TrustsApprovalModalWorkflowComponent } from './components/modals/trusts-approval-modal-workflow/trusts-approval-modal-workflow.component';
import { CurpRfcApprovalModalPmComponent } from './components/modals/curp-rfc-approval-modal-pm/curp-rfc-approval-modal-pm.component';




@NgModule({
  declarations: [
    InboxComponent,
    CurpRfcApprovalComponent,
    ContractApprovalModalComponent,
    HomonymyApprovalModalComponent,
    PfPldApprovalWorkflowComponent,
    PmPldApprovalWorkflowComponent,
    InvestmentProfileRestructuringComponent,
    HomonymyPmApprovalModalComponent,
    TrustsApprovalModalWorkflowComponent,
    CurpRfcApprovalModalPmComponent,
  ],
  imports: [
    CommonModule,
    WorkflowRoutingModule,
    CoreModule,
    SharedModule,
    MatIconModule

  ]
})
export class WorkflowModule { }
