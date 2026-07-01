import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from '../../../../../shared/services/notifications.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EquityStrategyItem } from '../../../../models/equity-stategy';
import { ERROR_MESSAGES } from '../../../../../onboarding/constants/form-messages';

@Component({
  selector: 'app-equity-modal',
  standalone: false,
  templateUrl: './equity-modal.component.html',
  styleUrl: './equity-modal.component.scss'
})
export class EquityModalComponent {

  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationsService);

  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<EquityModalComponent>);

  form: FormGroup = this.fb.group({
    idStrategy: [{ value: '', disabled: true}],
    cveStrategy: ['', Validators.required],
    description: ['', Validators.required],
    minimumAmount: ['', [Validators.required, Validators.min(1000)]],
    active: [true],
  });

  title = 'Add element'
  ngOnInit() {
    const inputValues: EquityStrategyItem = this.data.content;
    const idInit = this.data.id
    if(idInit){
      this.form.patchValue({
        idStrategy: idInit
      })
    }
    if (inputValues) {
      this.title = 'Edit element'
      this.form.patchValue({
        cveStrategy: inputValues.cveStrategy ?? '',
        description: inputValues.description ?? '',
        minimumAmount: inputValues.minimumAmount ?? '',
        active: inputValues.active,
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const capturedData: EquityStrategyItem = {
        idStrategy: this.data.id,
        cveStrategy: this.form.getRawValue().cveStrategy,
        description: this.form.value.description,
        minimumAmount: Number(this.form.value.minimumAmount),
        active: this.form.value.active,
      }
      this.dialogRef.close(capturedData);
    } else {
      document.body.classList.add('show-validation');
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
      this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS)
    }
  }

  close(): void {
    this.dialogRef.close();
  }

}
