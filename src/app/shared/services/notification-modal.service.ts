import { Injectable } from '@angular/core';
import { TypeNotification } from '../types/notifications.type';
import { ModalNotification } from '../../onboarding/models/modal-notification';
import { MatDialog } from '@angular/material/dialog';
import { ModalNotificationComponent } from '../components/modals/modal-notification/modal-notification.component';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationModalService {
  constructor(private readonly dialog: MatDialog) {}

  /**
   * Error Notification
   */
  async error(
    content: ModalNotification & {
      keepOnHttpError?: boolean;
      forceDisableClose?: boolean;
    },
  ): Promise<{ value: boolean; message?: string } | undefined> {
    return await this.openNotification(content, 'error');
  }

  /**
   * Warning Notification
   */
  async warning(
    content: ModalNotification & {
      keepOnHttpError?: boolean;
      forceDisableClose?: boolean;
    },
  ): Promise<{ value: boolean; message?: string } | undefined> {
    return await this.openNotification(content, 'warning');
  }

  /**
   * Success Notification
   */
  async success(
    content: ModalNotification & {
      keepOnHttpError?: boolean;
      forceDisableClose?: boolean;
    },
  ): Promise<{ value: boolean; message?: string } | undefined> {
    return await this.openNotification(content, 'success');
  }

  /**
   * Fail Notification
   */
  async fail(
    content: ModalNotification & {
      keepOnHttpError?: boolean;
      forceDisableClose?: boolean;
    },
  ): Promise<{ value: boolean; message?: string } | undefined> {
    return await this.openNotification(content, 'fail');
  }

  /**
   * Info Notification
   */
  async info(
    content: ModalNotification & {
      keepOnHttpError?: boolean;
      forceDisableClose?: boolean;
    },
  ): Promise<{ value: boolean; message?: string } | undefined> {
    return await this.openNotification(content, 'info');
  }

  /**
   * Confirm Notification
   */
  async confirm(
    content: ModalNotification & {
      keepOnHttpError?: boolean;
      forceDisableClose?: boolean;
    },
  ): Promise<{ value: boolean; message?: string } | undefined> {
    return await this.openNotification(content, 'confirm');
  }

  /**
   * Confirm retry (used for retry modal)
   */
  async retry(
    content: ModalNotification & {
      keepOnHttpError?: boolean;
      forceDisableClose?: boolean;
    },
  ): Promise<{ value: boolean; message?: string } | undefined> {
    return await this.openNotification(content, 'retry');
  }
  /**
   * Review Notification
   */
  async review(
    content: ModalNotification & {
      keepOnHttpError?: boolean;
      forceDisableClose?: boolean;
    },
  ): Promise<{ value: boolean; message?: string } | undefined> {
    return await this.openNotification(content, 'review');
  }

  /**
   * Centralized function to open modal
   */
  private async openNotification(
    content: ModalNotification & {
      keepOnHttpError?: boolean;
      forceDisableClose?: boolean;
    },
    type: TypeNotification,
  ): Promise<{ value: boolean; message?: string } | undefined> {
    const result = await firstValueFrom(
      this.callModalNotification(content, type),
    );

    if (result) return result;

    console.log('Modal closed without action.');
    return undefined;
  }

  /**
   * Opens the modal using MatDialog
   */
  private callModalNotification(
    content: ModalNotification & {
      keepOnHttpError?: boolean;
      forceDisableClose?: boolean;
    },
    type: TypeNotification,
  ): Observable<{ value: boolean; message?: string } | undefined> {
    const data: any = {
      type,
      ...Object.fromEntries(
        Object.entries(content).filter(([_, v]) => v !== undefined),
      ),
    };

    const dialogRef = this.dialog.open(ModalNotificationComponent, {
      width: '530px',
      disableClose: content.forceDisableClose === true,
      data,
      panelClass: 'custom-dialog',
      backdropClass: 'custom-dialog-backdrop',
    });

    return dialogRef.afterClosed();
  }
}
