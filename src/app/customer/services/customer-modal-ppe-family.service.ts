import { Injectable, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CustomerModalPpeFamilyComponent } from '../components/modals/modal-ppe-family/customer-modal-ppe-family.component';
import { DataRealOwnerClientFamilyPPE } from '../models/customer-real-owner';

import { Form } from '@angular/forms';
import { ConfigDataTable } from '../models/customer-table-interfaces';

export interface CustomerMantent{
  isMainten: boolean,
  allDisabled: boolean,
  config: ConfigDataTable,
  fieldsDisabled: [],
  fieldsEnabled: [],
  butonsDisabled: []
}
@Injectable({
  providedIn: 'root'
})
export class CustomerModalPpeFamilyService {
  constructor(
    private readonly _modal: MatDialog
  ) { }

  /**
   * An Form Modal
   *
   * @param message  The message to be displayed on the notification.
   */
  formModalDataPPE(mant: CustomerMantent, showCountry: boolean, dataClient?: DataRealOwnerClientFamilyPPE | null): Observable<any | null> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.minHeight = 'auto';
    dialogConfig.maxHeight = '80vh';
    dialogConfig.maxWidth = '80vw';
    dialogConfig.minWidth = 'auto';
    dialogConfig.panelClass = 'custom-dialog-border'
    return this.callModal(dialogConfig, mant,showCountry, dataClient);
  }

  /**
   * Calls to CustomerNotificationComponent to be displayed within the modal
   *
   * @param type  The type of modal
   */
  private callModal(dialogConfig: MatDialogConfig, mant: CustomerMantent, showCountry: boolean, dataClient?: DataRealOwnerClientFamilyPPE | null): Observable<any | null> {
    const dialogRef = this._modal.open(CustomerModalPpeFamilyComponent, {
      ...dialogConfig,
      data: {
        showCountry,
        dataClient,
        mant
      }
    });
    return dialogRef.afterClosed();
  }
}


export type Mantent = CustomerMantent;
export type ModalPpeFamilyService = CustomerModalPpeFamilyService;




