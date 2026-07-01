import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { firstValueFrom, Observable } from 'rxjs';
import { CustomerHomonymsComponent } from '../components/customer-homonyms/customer-homonyms.component';

@Injectable({
  providedIn: 'root'
})
export class CustomerModalHomonymsServiceService {
constructor(
    private readonly _modal: MatDialog
  ) { }

  /**
   * An Form Modal
   *
   * @param message  The message to be displayed on the notification.
   */
  async formModalHomonyms(): Promise<any | undefined> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.disableClose = true;
    dialogConfig.minHeight = 'auto';
    dialogConfig.maxHeight = '90vh';
    dialogConfig.maxWidth = '90vw';
    dialogConfig.minWidth = 'auto';
    dialogConfig.panelClass = 'custom-dialog-border'
    const result = await firstValueFrom(this.callModal(dialogConfig));
    return result;
  }

  /**
   * Calls to CustomerNotificationComponent to be displayed within the modal
   *
   * @param type  The type of modal
   */
  private callModal(dialogConfig: MatDialogConfig): Observable<any | undefined> {
    const dialogRef = this._modal.open(CustomerHomonymsComponent, {
      ...dialogConfig,
    });
    return dialogRef.afterClosed();
  }
}

export type ModalHomonymsServiceService = CustomerModalHomonymsServiceService;

