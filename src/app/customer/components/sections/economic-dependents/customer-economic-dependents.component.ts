import { Component, inject, Input, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CustomerOccupation } from '../../../models/customer-occupation';
import { CustomerPositionHeld } from '../../../models/customer-position-held';
import { CustomerRelationships } from '../../../models/customer-relationships';
import { CustomerCatalogsService } from '../../../services/customer-catalogs.service';
import { CustomerModalFormService } from '../../../services/customer-modal-form.service';
import { CustomerNotificationModalService } from '../../../services/customer-notification-modal.service';
import { CustomerNotificationsService } from '../../../services/customer-notifications.service';
import { CustomerWatchlistService } from '../../../services/customer-watchlist.service';
import { CustomerEconomicDependents } from '../../../models/customer-economic-dependents';
import { CustomerEconomicActivity } from '../../../models/customer-economic-activity';

@Component({
  selector: 'app-customer-economic-dependents',
  standalone: false,
  templateUrl: './customer-economic-dependents.component.html',
  styleUrl: './customer-economic-dependents.component.scss'
})
export class CustomerEconomicDependentsComponent {
  @Input() data?: CustomerEconomicDependents | null = null;
  //Inject
  private readonly fb = inject(FormBuilder);
  private readonly catalogService = inject(CustomerCatalogsService);
  readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(CustomerNotificationsService)
  private readonly dataWatchlistService = inject(CustomerWatchlistService);
  private readonly modalService = inject(CustomerModalFormService)
  private readonly notificationModalService = inject(CustomerNotificationModalService);

  relationships = signal<Array<CustomerRelationships>>([]);
  occupations = signal<Array<CustomerOccupation>>([]);
  economicActivity = signal<Array<CustomerEconomicActivity>>([]);

  // Form
  profileForm: FormGroup = this.fb.nonNullable.group({
    relationship: ['', Validators.required],
    occupation: ['', Validators.required],
    businessTurnaround: ['', Validators.required],
    phone: ['', Validators.required],
  });

  constructor() {
    document.body.classList.remove('show-validation');

  }

  ngOnInit() {
    const bb = {
    bool: '',
    clientId: '',
    language: '',
    };
    this.catalogService.getRelationships(bb).subscribe(c => {
      this.relationships.set(c);
    });
    this.catalogService.getOccupations({ocupationIds: []}).subscribe(c => {
      this.occupations.set(c);
    });
    this.catalogService.getEconomicActivity({lineBusinessId: []}).subscribe(m => {
      this.economicActivity.set(m);
    });
    if (this.data) {
      this.profileForm.patchValue({ relationship: this.data.relationship });
      this.profileForm.patchValue({ occupation: this.data.occupation });
      this.profileForm.patchValue({ businessTurnaround: this.data.businessTurnaround });
      this.profileForm.patchValue({ phone: this.data.phone });
    }
  }

  async sendInformation(): Promise<CustomerEconomicDependents | null> {
    document.body.classList.add('show-validation');
    Object.keys(this.profileForm.controls).forEach(controlName => {
      const control = this.profileForm.get(controlName);
      control?.updateValueAndValidity();
    });

    if (!this.profileForm.valid) {
      this.error();
      this.notificationService.error('Faltan campos obligatorios por capturar');
      return null;
    } else {
      return this.economicDependents();
    }
  }

  //function to map to CustomerPositionHeld
  economicDependents = (): CustomerEconomicDependents => this.profileForm.getRawValue() as CustomerEconomicDependents;

  //function to detonate error
  error(): void {
    Object.values(this.profileForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsTouched();
      }
    });
  }

  allowNumericOnly(event: KeyboardEvent): void {
    const regex = /^[0-9]$/;
    const key = event.key;
    if (!regex.test(key)) {
      event.preventDefault();
    }
  }
}


