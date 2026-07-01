import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-customer-notification',
  standalone: false,
  templateUrl: './customer-notification.component.html',
  styleUrl: './customer-notification.component.scss'
})
export class CustomerNotificationComponent {

  constructor(
    private readonly snackBarRef: MatSnackBarRef<CustomerNotificationComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
  ) { }

  close(): void {
    this.snackBarRef.dismiss();
  }
}
