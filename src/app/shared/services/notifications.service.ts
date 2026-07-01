import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NotificationComponent } from '../components/notification/notification.component';
import { TypeNotification } from '../types/notifications.type';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private readonly HORIZONTAL_POSITION: MatSnackBarHorizontalPosition = 'right';
  private readonly VERTICAL_POSITION: MatSnackBarVerticalPosition = 'top';
  private readonly DURATION: number = 5000;

  constructor(
    private readonly _snackBar: MatSnackBar
  ) { }

  /**
   * An Error Notification
   *
   * @param message  The message to be displayed on the notification.
   */
  error(message: string, secondaryText?: string): void {
    this.callNotification(message, 'error', secondaryText);
  }

  /**
   * A Success Notification
   *
   * @param message  The message to be displayed on the notification.
   */
  success(message: string, secondMessage?: string): void {
    this.callNotification(message, 'success', secondMessage);
  }

  /**
   * An Info Notification
   *
   * @param message  The message to be displayed on the notification.
   */
  info(message: string, secondMessage?: string): void {
    this.callNotification(message, 'info', secondMessage);
  }

  /**
   * An Info Notification
   *
   * @param message  The message to be displayed on the notification.
   */
  warning(message: string, secondMessage?: string): void {
    this.callNotification(message, 'warning', secondMessage);
  }

  /**
   * Calls to NotificationComponent to be displayed within the snackbar
   *
   * @param message  The message passed to component.
   * @param type  The type of notification (error, info, success)
   */
  private callNotification(message: string, type: TypeNotification, secondaryText?: string): void {
    this._snackBar.openFromComponent(NotificationComponent, {
      data: {
        type,
        message,
        secondaryText
      },
      duration: this.DURATION,
      horizontalPosition: this.HORIZONTAL_POSITION,
      verticalPosition: this.VERTICAL_POSITION
    });
  }
}
