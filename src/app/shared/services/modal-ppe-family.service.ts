import { Injectable, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ModalPpeFamilyComponent } from '../components/modals/modal-ppe-family/modal-ppe-family.component';
import { DataRealOwnerClientFamilyPPE } from '../../onboarding/models/real-owner';
import { Form } from '@angular/forms';
import { ConfigDataTable } from '../components/table-results/interfaces';

export interface Mantent{
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
export class ModalPpeFamilyService {
  constructor(
    private readonly _modal: MatDialog
  ) { }

  /**
   * An Form Modal
   *
   * @param message  The message to be displayed on the notification.
   */
  formModalDataPPE(mant: Mantent, showCountry: boolean, dataClient?: DataRealOwnerClientFamilyPPE | null): Observable<any | null> {
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
   * Calls to NotificationComponent to be displayed within the modal
   *
   * @param type  The type of modal
   */
  private callModal(dialogConfig: MatDialogConfig, mant: Mantent, showCountry: boolean, dataClient?: DataRealOwnerClientFamilyPPE | null): Observable<any | null> {
    const dialogRef = this._modal.open(ModalPpeFamilyComponent, {
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
