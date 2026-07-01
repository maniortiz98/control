import { Component, Inject, inject, signal } from '@angular/core';
import { Question } from '../../../models/transactional-investment-profile';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalNotificationComponent } from '../../../../shared/components/modals/modal-notification/modal-notification.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { transactionalResourcesQuestion } from '../../../../shared/services/transactional-profile-quiz-data';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { filter } from 'rxjs';
import { TransactionalResource } from '../../../models/general-info-pm';
import { ERROR_MESSAGES } from '../../../constants/form-messages';
import { Ranges } from '../../../models/origin-resource';

@Component({
  selector: 'app-transactional-resources-modal',
  standalone: false,
  templateUrl: './transactional-resources-modal.component.html',
  styleUrl: './transactional-resources-modal.component.scss'
})
export class TransactionalResourcesModalComponent {

  private readonly notificationService = inject(NotificationsService);
  private readonly dialogRef = inject(MatDialogRef<ModalNotificationComponent>);
  private readonly fb = inject(FormBuilder);

  readonly data = inject(MAT_DIALOG_DATA);
  public resources: Question;
  resourceOrigin = signal<Ranges[]>([])

  form: FormGroup = this.fb.group({
    resource: ['', Validators.required],
    percentage: [null, Validators.required],
  });

  constructor() {
    this.resources = transactionalResourcesQuestion;
  }

  ngOnInit() {
    console.log(this.data.availableResource);
    this.resourceOrigin.set(this.data.availableResource ?? [])
    if (this.data.resource) {
      this.form.patchValue({
        resource: this.data.resource.type,
        percentage: this.data.resource.percentage,
      })
    }
    if (this.data.isMaintenance) {
      this.data.editMode ? this.form.enable() : this.form.disable()
    }
  }

  saveResource() {
    if (this.form.invalid) {
      document.body.classList.add('show-validation');
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
      this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS)

    }

    let transactionalResources: TransactionalResource[] = this.data.resourcesList;
    let totalPercentageBefore: number = 0

    if(this.data.resource){
      totalPercentageBefore = transactionalResources
      .filter(r => r.active && r.id !== this.data?.resource?.id)
      .reduce((acc: number, rsc: TransactionalResource) => acc + Number(rsc.percentage), 0);
    }else {
      totalPercentageBefore = transactionalResources
      .filter(r => r.active)
      .reduce((acc: number, rsc: TransactionalResource) => acc + Number(rsc.percentage), 0);

    }

    const actualValue: number = this.form.value.percentage;
    console.log({actualValue})
    console.log({totalPercentageBefore})
    if (totalPercentageBefore + actualValue > 100) {
      this.notificationService.error('El porcentaje total no puede ser mayor a 100%');
      return;
    };

    const text = this.resourceOrigin().filter(ar => ar.rangeId === this.form.value.resource)[0].description;
    const response: TransactionalResource = {
      type: this.form.value.resource,
      text: text,
      percentage: this.form.value.percentage,
      id: this.data?.resource?.id ?? crypto.randomUUID(),
      active: true,
    }
    this.dialogRef.close(response);
  }

  closeModal() {
    this.dialogRef.close();
  }
}
