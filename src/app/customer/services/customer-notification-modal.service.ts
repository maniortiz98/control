import { Injectable } from '@angular/core';
import { CustomerTypeNotification } from '../types/customer-notifications.type';
import { CustomerModalNotification } from '../models/customer-modal-notification';
import { MatDialog } from '@angular/material/dialog';
import { CustomerModalNotificationComponent } from '../components/modals/modal-notification/customer-modal-notification.component';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerNotificationModalService {
  constructor(private readonly dialog: MatDialog) {}

  /**
   * Error Notification
   */
  async error(
    content: CustomerModalNotification & {
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
    content: CustomerModalNotification & {
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
    content: CustomerModalNotification & {
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
    content: CustomerModalNotification & {
      keepOnHttpError?: boolean;
      forceDisableClose?: boolean;
    },
  ): Promise<{ value: boolean; message?: string } | undefined> {
    return await this.openNotification(content, 'fail');
  }

  /**
   * CustomerInfo Notification
   */
  async info(
    content: CustomerModalNotification & {
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
    content: CustomerModalNotification & {
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
    content: CustomerModalNotification & {
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
    content: CustomerModalNotification & {
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
    content: CustomerModalNotification & {
      keepOnHttpError?: boolean;
      forceDisableClose?: boolean;
    },
    type: CustomerTypeNotification,
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
    content: CustomerModalNotification & {
      keepOnHttpError?: boolean;
      forceDisableClose?: boolean;
    },
    type: CustomerTypeNotification,
  ): Observable<{ value: boolean; message?: string } | undefined> {
    const data: any = {
      type,
      ...Object.fromEntries(
        Object.entries(content).filter(([_, v]) => v !== undefined),
      ),
    };

    const dialogRef = this.dialog.open(CustomerModalNotificationComponent, {
      width: '530px',
      disableClose: content.forceDisableClose === true,
      data,
      panelClass: 'custom-dialog',
      backdropClass: 'custom-dialog-backdrop',
    });

    return dialogRef.afterClosed();
  }
}



export type NotificationModalService = CustomerNotificationModalService;

