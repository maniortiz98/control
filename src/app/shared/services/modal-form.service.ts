import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { ModalFormComponent } from '../components/modals/modal-form/modal-form.component';
import { TypeModal } from '../types/modals.type';
import {
  DataClientDepPPE,
  DataClientFamilyPPE,
  DataClientSocAndAssoPPE,
} from '../../onboarding/models/client-data';
import { Observable, isObservable } from 'rxjs';
import { HomonymsResponse } from '../../onboarding/models/homonyms';
import {
  FiscalSelfDeclarationForm,
  FiscalSelfDeclarationPageData,
  MinFiscalData,
} from '../../onboarding/models/fiscal-self-declaration-data';
import { FiscalSelfDeclaration } from '../../onboarding/models/checkpoints/fiscal-self-declaration-checkpoint';
import { configFiscalResidenceModalAdministratorExercisingPfControlComponent } from '../../onboarding/components/administrator-exercising-pf-control/config-modal';
import { ShareholderFormData } from '../../onboarding/models/real-owner';

export interface Maintenance{
  all: boolean;
  edit: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class ModalFormService {
  private dialogRef: MatDialogRef<ModalFormComponent> | null = null;
  constructor(private readonly _modal: MatDialog) {}

  /**
   * An Form Modal
   *
   * @param message  The message to be displayed on the notification.
   */
  formModalDataPPE(isMaintenance: Maintenance,
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
  formModalDataDepPPE(isMaintenance: Maintenance,
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
  formModalDataAsoPPE(isMaintenance: Maintenance,
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
    dataClient?: HomonymsResponse[]
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
    dataClient?: FiscalSelfDeclarationPageData | null,
    dataConfigAdministratorExercisingPfControl?: configFiscalResidenceModalAdministratorExercisingPfControlComponent | null,
    minFiscalData?: MinFiscalData | null,
    isCotitular?: boolean
  ): Observable<FiscalSelfDeclaration | null> {
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
    dataClient?: ShareholderFormData | null,
  ): Observable<ShareholderFormData | null> {
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
    dataClient?: ShareholderFormData | null,
  ): Observable<ShareholderFormData | null> {
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
   * An Bank Contract Linking Modal
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

    this.dialogRef = this._modal.open(ModalFormComponent, {
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
   * Calls to NotificationComponent to be displayed within the modal
   *
   * @param type  The type of modal
   */
  private callModal(
    isMaintenance: Maintenance,
    type: TypeModal,
    dialogConfig: MatDialogConfig,
    dataClient?:
      | DataClientFamilyPPE
      | DataClientDepPPE
      | DataClientSocAndAssoPPE
      | HomonymsResponse[]
      | FiscalSelfDeclarationPageData
      | ShareholderFormData
      | null,
    dataConfigAdministratorExercisingPfControl?: configFiscalResidenceModalAdministratorExercisingPfControlComponent | null,
    minFiscalData?: MinFiscalData | null,
    isCotitular?: boolean
  ): Observable<any | null> {
    this.dialogRef = this._modal.open(ModalFormComponent, {
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

  getDialogRef(): MatDialogRef<ModalFormComponent> | null {
    return this.dialogRef;
  }
}
