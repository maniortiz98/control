import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { CustomerModalTokenVerificationComponent } from '../components/modals/modal-token-verification/customer-modal-token-verification.component';

@Injectable({
  providedIn: 'root'
})
export class CustomerTokenVerificationServiceService {

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
    const dialogRef = this.dialog.open(CustomerModalTokenVerificationComponent, {
      data: {
        notificationType,
        message,
        inputLength
      }
    });

    return await firstValueFrom(dialogRef.afterClosed());
  }
}

export type TokenVerificationServiceService = CustomerTokenVerificationServiceService;


