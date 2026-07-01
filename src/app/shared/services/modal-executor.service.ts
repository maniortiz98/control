import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom, Observable } from 'rxjs';
import { ExecutorInfo } from '../../onboarding/models/executor';

@Injectable({ providedIn: 'root' })
export class ModalExecutorService {
  private dialogRef: MatDialogRef<any> | null = null;

  constructor(private readonly dialog: MatDialog) {}

  async callExecutor(
    hasclientNumber: boolean,
    executorNumber: number,
    content?: ExecutorInfo
  ): Promise<ExecutorInfo | undefined> {
    const { ExecutorModalComponent } = await import(
      '../components/modals/executor-modal/executor-modal.component'
    );

    this.dialogRef = this.dialog.open(ExecutorModalComponent, {
      panelClass: ['executor-modal'],
      disableClose: true,
      data: {
        hasclientNumber,
        executorNumber,
        content,
        keepOnHttpError: false
      }
    });

    return firstValueFrom(this.dialogRef.afterClosed());
  }

  closeModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }
}
