import { Component, inject, Input, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Occupation } from '../../../../onboarding/models/occupation';
import { PositionHeld } from '../../../../onboarding/models/position-held';
import { Relationships } from '../../../../onboarding/models/relationships';
import { CatalogsService } from '../../../services/catalogs.service';
import { ModalFormService } from '../../../services/modal-form.service';
import { NotificationModalService } from '../../../services/notification-modal.service';
import { NotificationsService } from '../../../services/notifications.service';
import { WatchlistService } from '../../../services/watchlist.service';
import { EconomicDependents } from '../../../../onboarding/models/economic-dependents';
import { EconomicActivity } from '../../../../onboarding/models/economic-activity';

@Component({
  selector: 'app-economic-dependents',
  standalone: false,
  templateUrl: './economic-dependents.component.html',
  styleUrl: './economic-dependents.component.scss'
})
export class EconomicDependentsComponent {
  @Input() data?: EconomicDependents | null = null;
  //Inject
  private readonly fb = inject(FormBuilder);
  private readonly catalogService = inject(CatalogsService);
  readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationsService)
  private readonly dataWatchlistService = inject(WatchlistService);
  private readonly modalService = inject(ModalFormService)
  private readonly notificationModalService = inject(NotificationModalService);

  relationships = signal<Array<Relationships>>([]);
  occupations = signal<Array<Occupation>>([]);
  economicActivity = signal<Array<EconomicActivity>>([]);

  // Form
  profileForm: FormGroup = this.fb.nonNullable.group({
    relationship: ['', Validators.required],
    occupation: ['', Validators.required],
    businessTurnaround: ['', Validators.required],
    phone: ['', Validators.required],
  });

  filteredEconomicActivities = signal<EconomicActivity[]>([]);
  economicActivityFilter = new FormControl('');

  constructor() {
    document.body.classList.remove('show-validation');
    this.economicActivityFilter.valueChanges.subscribe(value => {
      const filterValue = value?.toLowerCase() || '';

      this.filteredEconomicActivities.set(
        this.economicActivity().filter(item =>
          item.lineBusiness.toLowerCase().includes(filterValue)
        )
      );
    });
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
      this.filteredEconomicActivities.set(m);
    });
    if (this.data) {
      this.profileForm.patchValue({ relationship: this.data.relationship });
      this.profileForm.patchValue({ occupation: this.data.occupation });
      this.profileForm.patchValue({ businessTurnaround: this.data.businessTurnaround });
      this.profileForm.patchValue({ phone: this.data.phone });
    }
  }

  async sendInformation(): Promise<EconomicDependents | null> {
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

  //function to map to PositionHeld
  economicDependents = (): EconomicDependents => this.profileForm.getRawValue() as EconomicDependents;

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
