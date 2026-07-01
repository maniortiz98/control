import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PreviewEquityContract } from '../../../models/equity-contract';

@Component({
  selector: 'app-equity-preview-contract',
  standalone: false,
  templateUrl: './equity-preview-contract.component.html',
  styleUrl: './equity-preview-contract.component.scss'
})
export class EquityPreviewContractComponent {

  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationsService);

  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<EquityPreviewContractComponent>);




  fatherContractNumber = '';
  fatherClientNumber = '';
  fatherFullName = '';
  childrenContractNumber = '';
  childrenClientNumber = '';
  childrenFullName = '';
  childrenStrategyType = '';


  ngOnInit() {
    const content = this.data.content;
    if (content) {
      this.fatherContractNumber = content.fatherContractNumber;
      this.fatherClientNumber = content.fatherClientNumber;
      this.fatherFullName = content.fatherFullName;
      this.childrenContractNumber = content.childrenContractNumber;
      this.childrenClientNumber = content.childrenClientNumber;
      this.childrenFullName = content.childrenFullName;
      this.childrenStrategyType = content.childrenStrategyType;
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
