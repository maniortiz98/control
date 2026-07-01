import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ERROR_MESSAGES } from '../../../constants/form-messages';
import { HieraticLevel } from '../../../models/hieratic-level';

@Component({
  selector: 'app-organization-chart-modal',
  standalone: false,
  templateUrl: './organization-chart-modal.component.html',
  styleUrl: './organization-chart-modal.component.scss'
})
export class OrganizationChartModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationsService);
  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<OrganizationChartModalComponent>);
  readonly id = crypto.randomUUID()


  form: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    secondName: [''],
    firstLastName: [''],
    secondLastName: [''],
    charge: ['', Validators.required],
  });

  ngOnInit() {
    const inputValues = this.data.content;
    if (inputValues) {
      this.form.patchValue({
        firstName: inputValues.firstName,
        secondName: inputValues.secondName ?? '',
        firstLastName: inputValues.firstLastName ?? '',
        secondLastName: inputValues.secondLastName ?? '',
        charge: inputValues.charge,
      });
    }
  }

  onSubmit() {
    document.body.classList.add('show-validation');

    const requiredControls = ['firstName', 'charge'];
    let hasRequiredError = false;
    requiredControls.forEach(name => {
      const control = this.form.get(name);
      if (!control?.value) {
        control?.markAsTouched();
        hasRequiredError = true;
      }
    });
    if (hasRequiredError) {
      this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS);
      return;
    }

    const firstLastName = this.form.get('firstLastName');
    const secondLastName = this.form.get('secondLastName');

    if (!firstLastName?.value && !secondLastName?.value) {
      firstLastName?.setErrors({ required: true });
      secondLastName?.setErrors({ required: true });
      firstLastName?.markAsTouched();
      secondLastName?.markAsTouched();

      this.notificationService.error(ERROR_MESSAGES.AT_LEAST_ONE_LAST_NAME);
      return;
    }

    const response: HieraticLevel = {
      id: this.data.content?.id ?? crypto.randomUUID(),
      firstName: this.form.value.firstName,
      secondName: this.form.value.secondName,
      firstLastName: this.form.value.firstLastName,
      secondLastName: this.form.value.secondLastName,
      charge: this.form.value.charge,
    };
    this.dialogRef.close(response);
  }

  close(): void {
    this.dialogRef.close();
  }


}
