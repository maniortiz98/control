import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalCotitularComponent } from '../components/modals/modal-cotitular/modal-cotitular.component';
import { firstValueFrom, Observable } from 'rxjs';
import { CotitularInfo } from '../../onboarding/models/cotitular';

@Injectable({
  providedIn: 'root'
})
export class ModalCotitularService {

  private dialogRef: MatDialogRef<ModalCotitularComponent> | null = null;

  constructor(private readonly dialog: MatDialog) {
  }


  async cotitularWithoutClientNumber(cotitularNumber: number, signatureType: string, readOnly:boolean, isMaintenance: boolean, content?: CotitularInfo, permises?: any): Promise<CotitularInfo | undefined> {
    return firstValueFrom(this.callCotitularModal(false, cotitularNumber, signatureType, readOnly, isMaintenance, content, permises))
  }

  async cotitularWithClientNumber(cotitularNumber: number, signatureType: string,  readOnly:boolean, isMaintenance: boolean, content?: CotitularInfo, permises?: any): Promise<CotitularInfo | undefined> {
    return firstValueFrom(this.callCotitularModal(true, cotitularNumber, signatureType, readOnly, isMaintenance, content, permises))
  }



  private callCotitularModal(hasClientNumber: boolean, cotitularNumber: number, signatureType: string, readOnly:boolean, isMaintenance: boolean, content?: CotitularInfo, permises?: any):
    Observable<CotitularInfo | undefined> {
    this.dialogRef = this.dialog.open(ModalCotitularComponent, {
      panelClass: ['cotitular-modal'],
      disableClose: true,
      data: {
        hasClientNumber,
        content,
        cotitularNumber,
        signatureType,
        readOnly,
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
