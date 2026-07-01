import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-customer-modal-notification',
  standalone: false,
  templateUrl: './customer-modal-notification.component.html',
  styleUrl: './customer-modal-notification.component.scss'
})

/**
* Modal for commons notification
* for a better implementation use the notification-modal service with commons methods, and the modal-notification interface
* @param type the notification type, is invoked by the selected method. the select type afect the icon displayed
* @param title  The header message to be displayed on the notification.
* the next elements are optional if dont exist the modal will be apear without the respective html element
* @param beforeMessages The messages to be displayed on the notification before the icon.
* @param afterMessages  The messages to be displayed on the notification after the icon.
* @param inputMessage if exist the btnDeny element the impunt message will be the header of the input
* @param infoToCopy  used when you need show a message to be copied on the notification.
* @param btnAccept  The message to be displayed in the accept button, this button return true and must be used for confirmations
* @param btnDeny  The message to be displayed in the reject button, this button return true and must be used for reject
* @param btnSend  The message to be displayed in the send button, this button return true and the captured message.
*/

export class CustomerModalNotificationComponent {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  data = inject(MAT_DIALOG_DATA) as {
    type: string;
    title: string;
    beforeMessages?: string | string[];
    beforeMessagesNotIcon?: string[];
    afterCopyMessages?: string | string[];
    afterMessages?: string | string[];
    inputMessage?: string;
    infoToCopy?: string;
    btnAccept?: string;
    btnDeny?: string;
    btnSend?: string;
  };

  messageInput: string = '';

  readonly dialogRef = inject(MatDialogRef<CustomerModalNotificationComponent>);

  isArray(value: unknown): value is string[] {
    return Array.isArray(value);
  }

  close(value: boolean, message?: string): void {
    this.dialogRef.close({ value, message });
  }

  exit(){
    this.dialogRef.close({});
  }
  copyProspectNumber(): void {
    if (this.data.infoToCopy) {
      navigator.clipboard.writeText(this.data.infoToCopy).then(() => {
        console.log('Número copiado:', this.data.infoToCopy);
      });
    }
  }
}
