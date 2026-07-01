import { Component, inject, Input, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CatalogsService } from '../../../services/catalogs.service';
import { ModalFormService } from '../../../services/modal-form.service';
import { NotificationModalService } from '../../../services/notification-modal.service';
import { NotificationsService } from '../../../services/notifications.service';
import { WatchlistService } from '../../../services/watchlist.service';
import { EconomicActivity } from '../../../../onboarding/models/economic-activity';
import { Nationalities } from '../../../../onboarding/models/nationality';
import { SocietiesAndAssociations } from '../../../../onboarding/models/societies-and-associations';

@Component({
  selector: 'app-societies-and-associations',
  standalone: false,
  templateUrl: './societies-and-associations.component.html',
  styleUrl: './societies-and-associations.component.scss'
})
export class SocietiesAndAssociationsComponent {
  @Input() data?: SocietiesAndAssociations | null = null;
  //Inject
  private readonly fb = inject(FormBuilder);
  private readonly catalogService = inject(CatalogsService);
  readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationsService)
  private readonly dataWatchlistService = inject(WatchlistService);
  private readonly modalService = inject(ModalFormService)
  private readonly notificationModalService = inject(NotificationModalService);


  // Form
  profileForm: FormGroup = this.fb.nonNullable.group({
    rfc: ['', ],
    companyName: ['', Validators.required],
    commercialBusiness: ['', Validators.required],
    administratorManagerAttorney: ['', Validators.required],
    phone: ['', Validators.required],
    economicActivity: ['', Validators.required],
    nationality: ['', Validators.required],
  });

  economicActivityFilter = new FormControl('');
  filteredEconomicActivities = signal<EconomicActivity[]>([]);

  economicActivity = signal<EconomicActivity[]>([]);
  nationalities = signal<Nationalities[]>([]);

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
    this.catalogService.getEconomicActivity({lineBusinessId: []}).subscribe(m => {
      this.economicActivity.set(m);
      this.filteredEconomicActivities.set(m);
    });
    this.catalogService.getNationalities({land: []}).subscribe(c => {
      this.nationalities.set(c);
    });

    if (this.data) {
      this.profileForm.patchValue({ rfc: this.data.rfc });
      this.profileForm.patchValue({ companyName: this.data.companyName?.toUpperCase() });
      this.profileForm.patchValue({ commercialBusiness: this.data.commercialBusiness?.toUpperCase() });
      this.profileForm.patchValue({ administratorManagerAttorney: this.data.administratorManagerAttorney?.toUpperCase() });
      this.profileForm.patchValue({ phone: this.data.phone });
      this.profileForm.patchValue({ economicActivity: this.data.economicActivity?.toUpperCase() });
      this.profileForm.patchValue({ nationality: this.data.nationality?.toUpperCase() });
    }
  }

  async sendInformation(): Promise<SocietiesAndAssociations | null> {
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
      return this.societiesAndAssociations();
    }
  }

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

  societiesAndAssociations = (): SocietiesAndAssociations => this.profileForm.getRawValue() as SocietiesAndAssociations;
}
