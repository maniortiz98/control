import { Injectable } from '@angular/core';
import { ModalHomonymsComponent } from '../components/modals/modal-homonyms/modal-homonyms.component';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DataClientFamilyPPE } from '../../onboarding/models/client-data';
import { HomonymsResponse } from '../../onboarding/models/homonyms';
import { TypeModal } from '../types/modals.type';

@Injectable({
  providedIn: 'root'
})
export class HomonymsPmService {
  private dialogRef: MatDialogRef<ModalHomonymsComponent> | null = null;
  constructor(
    private readonly _modal: MatDialog
  ) { }
  /**
  * An Homonimia Modal
  *
  * @param message  The message to be displayed on the notification.
  */
  homonimiaModal(dataClient?: HomonymsResponse[]): Observable<DataClientFamilyPPE | null> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.minHeight = 'auto';
    dialogConfig.maxHeight = '80vh';
    dialogConfig.maxWidth = '80vw';
    dialogConfig.minWidth = 'auto';
    dialogConfig.panelClass = 'custom-dialog-border'
    return this.callModal(dialogConfig, dataClient);
  }

  /**
   * Calls to NotificationComponent to be displayed within the modal
   *
   * @param dialogConfig  The type of modal
   */
  private callModal(dialogConfig: MatDialogConfig, dataClient?: HomonymsResponse[] | null): Observable<any | null> {
    this.dialogRef = this._modal.open(ModalHomonymsComponent, {
      ...dialogConfig,
      data: {
        dataClient
      }
    });
    return this.dialogRef.afterClosed();
  }

  closeModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }

  getDialogRef(): MatDialogRef<ModalHomonymsComponent> | null {
    return this.dialogRef;
  }
}
