import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { CustomerModalFormComponent } from '../components/modals/modal-form/customer-modal-form.component';
import { CustomerTypeModal } from '../types/customer-modals.type';
import {
  DataClientDepPPE,

  DataClientFamilyPPE,
  DataClientSocAndAssoPPE,
} from '../models/customer-client-data';
import { Observable, isObservable } from 'rxjs';
import { CustomerHomonymsResponse } from '../models/customer-homonyms';
import {
  CustomerFiscalSelfDeclarationForm,
  CustomerFiscalSelfDeclarationPageData,
  CustomerMinFiscalData,
} from '../models/customer-fiscal-self-declaration-data';
import { CustomerFiscalSelfDeclaration } from '../models/checkpoints/customer-fiscal-self-declaration-checkpoint';
import { configFiscalResidenceModalAdministratorExercisingPfControlComponent } from '../models/customer-config-fiscal-residence-modal';
import { CustomerShareholderFormData } from '../models/customer-real-owner';



export interface CustomerMaintenance{
  all: boolean;
  edit: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class CustomerModalFormService {
  private dialogRef: MatDialogRef<CustomerModalFormComponent> | null = null;
  constructor(private readonly _modal: MatDialog) {}

  /**
   * An Form Modal
   *
   * @param message  The message to be displayed on the notification.
   */
  formModalDataPPE(isMaintenance: CustomerMaintenance,
    dataClient?: DataClientFamilyPPE | null
  ): Observable<DataClientFamilyPPE | null> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.minHeight = 'auto';
    dialogConfig.maxHeight = '80vh';
    dialogConfig.maxWidth = '80vw';
    dialogConfig.minWidth = 'auto';
    dialogConfig.panelClass = 'custom-dialog-border';
    return this.callModal(isMaintenance, 'ppe', dialogConfig, dataClient);
  }

  /**
   * An Form Modal
   *
   * @param message  The message to be displayed on the notification.
   */
  formModalDataDepPPE(isMaintenance: CustomerMaintenance,
    dataClient?: DataClientDepPPE | null
  ): Observable<DataClientDepPPE | null> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.minHeight = 'auto';
    dialogConfig.maxHeight = '80vh';
    dialogConfig.maxWidth = '80vw';
    dialogConfig.minWidth = 'auto';
    dialogConfig.panelClass = 'custom-dialog-border';
    return this.callModal(isMaintenance,'ppeDep', dialogConfig, dataClient);
  }

  /**
   * An Form Modal
   *
   * @param message  The message to be displayed on the notification.
   */
  formModalDataAsoPPE(isMaintenance: CustomerMaintenance,
    dataClient?: DataClientSocAndAssoPPE | null
  ): Observable<DataClientSocAndAssoPPE | null> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.minHeight = 'auto';
    dialogConfig.maxHeight = '80vh';
    dialogConfig.maxWidth = '80vw';
    dialogConfig.minWidth = 'auto';
    dialogConfig.panelClass = 'custom-dialog-border';
    return this.callModal(isMaintenance,'ppeAep', dialogConfig, dataClient);
  }

  /**
   * An Homonimia Modal
   *
   * @param message  The message to be displayed on the notification.
   */
  homonimiaModal(
    dataClient?: CustomerHomonymsResponse[]
  ): Observable<any | null> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.minHeight = 'auto';
    dialogConfig.maxHeight = '80vh';
    dialogConfig.maxWidth = '80vw';
    dialogConfig.minWidth = 'auto';
    dialogConfig.panelClass = 'custom-dialog-border';
    return this.callModal({
      all: false,
      edit: false
    },'homonimia', dialogConfig, dataClient);
  }

  /**
   * An Fiscal Residences Modal
   *
   * @param message  The message to be displayed on the notification.
   */
  fiscalResidenceModal(
    dataClient?: CustomerFiscalSelfDeclarationPageData | null,
    dataConfigAdministratorExercisingPfControl?: configFiscalResidenceModalAdministratorExercisingPfControlComponent | null,
    minFiscalData?: CustomerMinFiscalData | null,
    isCotitular?: boolean
  ): Observable<CustomerFiscalSelfDeclaration | null> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.minHeight = 'auto';
    dialogConfig.maxHeight = '80vh';
    dialogConfig.maxWidth = '80vw';
    dialogConfig.minWidth = 'auto';
    dialogConfig.panelClass = 'custom-dialog-border';
    return this.callModal({
      all: false,
      edit: false
    },'fiscalResidence', dialogConfig, dataClient, dataConfigAdministratorExercisingPfControl, minFiscalData, isCotitular);
  }


  /**
   * An ShareholderModal Modal
   *
   * @param message  The message to be displayed on the notification.
   */
  shareholderModal(
    dataClient?: CustomerShareholderFormData | null,
  ): Observable<CustomerShareholderFormData | null> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.minHeight = 'auto';
    dialogConfig.maxHeight = '80vh';
    dialogConfig.maxWidth = '80vw';
    dialogConfig.minWidth = 'auto';
    dialogConfig.panelClass = 'custom-dialog-border';
    return this.callModal({
      all: false,
      edit: false
    },'shareholderModal', dialogConfig, dataClient);
  }

  /**
   * An ShareholderModal Modal
   *
   * @param message  The message to be displayed on the notification.
   */
  addShareholderModal(
    dataClient?: CustomerShareholderFormData | null,
  ): Observable<CustomerShareholderFormData | null> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.minHeight = 'auto';
    dialogConfig.maxHeight = '80vh';
    dialogConfig.maxWidth = '80vw';
    dialogConfig.minWidth = 'auto';
    dialogConfig.panelClass = 'custom-dialog-border';
    return this.callModal({
      all: false,
      edit: false
    },'addShareholderModal', dialogConfig, dataClient);
  }

  /**
   * An CustomerBank CustomerContract Linking Modal
   */
  bankContractLinkingModal(
    contracts: any[] = []
  ): Observable<any | null> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.minHeight = 'auto';
    dialogConfig.maxHeight = '80vh';
    dialogConfig.maxWidth = '80vw';
    dialogConfig.minWidth = '50vw';
    dialogConfig.panelClass = 'custom-dialog-border';

    this.dialogRef = this._modal.open(CustomerModalFormComponent, {
      ...dialogConfig,
      data: {
        type: 'bankContractLinking',
        contracts,
        isMaintenance: { all: false, edit: false }
      },
    });
    return this.dialogRef.afterClosed();
  }

  /**
   * Calls to CustomerNotificationComponent to be displayed within the modal
   *
   * @param type  The type of modal
   */
  private callModal(
    isMaintenance: CustomerMaintenance,
    type: CustomerTypeModal,
    dialogConfig: MatDialogConfig,
    dataClient?:
      | DataClientFamilyPPE
      | DataClientDepPPE
      | DataClientSocAndAssoPPE
      | CustomerHomonymsResponse[]
      | CustomerFiscalSelfDeclarationPageData
      | CustomerShareholderFormData
      | null,
    dataConfigAdministratorExercisingPfControl?: configFiscalResidenceModalAdministratorExercisingPfControlComponent | null,
    minFiscalData?: CustomerMinFiscalData | null,
    isCotitular?: boolean
  ): Observable<any | null> {
    this.dialogRef = this._modal.open(CustomerModalFormComponent, {
      ...dialogConfig,
      data: {
        type,
        dataClient,
        dataConfigAdministratorExercisingPfControl,
        isMaintenance,
        minFiscalData,
        isCotitular
      },
    });
    return this.dialogRef.afterClosed();
  }

  closeModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }

  getDialogRef(): MatDialogRef<CustomerModalFormComponent> | null {
    return this.dialogRef;
  }
}




export type Maintenance = CustomerMaintenance;
export type ModalFormService = CustomerModalFormService;





