import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ModalTokenVerificationComponent } from '../components/modals/modal-token-verification/modal-token-verification.component';

@Injectable({
  providedIn: 'root'
})
export class TokenVerificationServiceService {

  constructor(
    private readonly dialog: MatDialog
  ) {}

  async showModal(
    notificationType: string,
    message: string,
    inputLength: number
  ): Promise<{ message: string } | undefined> {
    return await this.callTokenVerificationModal(notificationType, message, inputLength);
  }

  private async callTokenVerificationModal(
    notificationType: string,
    message: string,
    inputLength: number
  ): Promise<{ message: string } | undefined> {
    const dialogRef = this.dialog.open(ModalTokenVerificationComponent, {
      data: {
        notificationType,
        message,
        inputLength
      }
    });

    return await firstValueFrom(dialogRef.afterClosed());
  }
}
