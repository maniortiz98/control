import { ModalAttoneryComponent } from './../components/modals/modal-attonery/modal-attonery.component';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AttoneryInfo } from '../../onboarding/models/attonery';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalAttoneryService {

  private dialogRef: MatDialogRef<ModalAttoneryComponent> | null = null;
  constructor(private readonly dialog: MatDialog) {
   }

  async addAttoneryWithClientNumber(attoneryNumber: number, signatureType: string, readOnly: boolean, isMaintenance: boolean, content?: AttoneryInfo, permises?: any): Promise<AttoneryInfo | undefined>{
    return firstValueFrom(this.callAttoneryModal( true, attoneryNumber, signatureType, readOnly, isMaintenance, content, permises))
  }

  async addAttoneryWithoutClientNumber(attoneryNumber: number, signatureType: string, readOnly: boolean, isMaintenance: boolean, content?: AttoneryInfo, permises?: any): Promise<AttoneryInfo | undefined>{
    return firstValueFrom(this.callAttoneryModal(false, attoneryNumber, signatureType, readOnly, isMaintenance, content, permises))
  }

  private callAttoneryModal(hasClientNumber: boolean, attoneryNumber: number, signatureType: string, readOnly: boolean, isMaintenance: boolean, content?: AttoneryInfo, permises?: any):
  Observable<AttoneryInfo | undefined> {
    this.dialogRef = this.dialog.open(ModalAttoneryComponent, {
      panelClass: ['attonery-modal'],
      disableClose: true,
      data: {
        hasClientNumber,
        content,
        attoneryNumber,
        readOnly,
        signatureType,
        permises,
        isMaintenance,
        keepOnHttpError: false
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
}
