import { Component, inject, Input, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CatalogsService } from '../../../services/catalogs.service';
import { NotificationsService } from '../../../services/notifications.service';
import { PositionHeld } from '../../../../onboarding/models/position-held';
import { Relationships } from '../../../../onboarding/models/relationships';
import { Occupation } from '../../../../onboarding/models/occupation';
import { formatDateYYYYMMDD } from '../../../utils/datetime';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import moment from 'moment';

@Component({
  selector: 'app-position-held',
  standalone: false,
  templateUrl: './position-held.component.html',
  styleUrl: './position-held.component.scss'
})
export class PositionHeldComponent {

  @Input() data?: PositionHeld | null = null;
  @ViewChild('pickerBirthdate') pickerBirthdate!: MatDatepicker<Date>;

  //Inject
  private readonly fb = inject(FormBuilder);
  private readonly catalogService = inject(CatalogsService);
  readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationsService)

  relationships = signal<Array<Relationships>>([]);
  occupations = signal<Array<Occupation>>([]);

  // Form
  profileForm: FormGroup = this.fb.nonNullable.group({
    chargeDueDate: ['',],
    relationship: ['', Validators.required],
    positionHeld: ['', Validators.required],
  });
  birthDates = {
    startAt: new Date(),
    min: new Date(),
  };

  constructor() {
    document.body.classList.remove('show-validation');

  }

  ngOnInit() {
    const bbRel = {
      bool: '',
      clientId: '',
      language: '',
    };
    this.catalogService.getRelationships(bbRel).subscribe(c => {
      this.relationships.set(c);
    });
    this.catalogService.getOccupations({ ocupationIds: [] }).subscribe(c => {
      this.occupations.set(c);
    });
    if (this.data) {
      console.log(this.data)
      if (this.data.chargeDueDate != '') {
        this.profileForm.patchValue({ chargeDueDate: formatDateYYYYMMDD(this.data.chargeDueDate) });
      } else {
        this.profileForm.patchValue({ chargeDueDate: null });
      }
      this.profileForm.patchValue({ relationship: this.data.relationship });
      this.profileForm.patchValue({ positionHeld: this.data.positionHeld });
    }
  }

  async sendInformation(): Promise<PositionHeld | null> {
    document.body.classList.add('show-validation');
    Object.keys(this.profileForm.controls).forEach(controlName => {
      const control = this.profileForm.get(controlName);
      control?.updateValueAndValidity();
    });
    console.log(this.profileForm.getRawValue().chargeDueDate)
    if (!this.profileForm.valid) {
      this.error();
      if (this.profileForm.getRawValue().chargeDueDate) {
        const dobValue = this.profileForm.getRawValue().chargeDueDate
        const dob = moment(dobValue);
        const today = moment().startOf('day');
        if (dob.isBefore(today, 'day')) {
          this.error();
          this.notificationService.error('Fecha de Vencimiento de Cargo no Válida')
          return null;
        }
      }
      this.notificationService.error('Faltan campos obligatorios por capturar');
      return null;
    } else {
      return this.positionHeld();
    }
  }

  //function to map to PositionHeld
  positionHeld = (): PositionHeld => this.profileForm.getRawValue() as PositionHeld;

  //function to detonate error
  error(): void {
    Object.values(this.profileForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsTouched();
      }
    });
  }
  onDateInput(event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
    const date = event.value;
    console.log(date);
    const control = this.profileForm.get('chargeDueDate');

    if (date instanceof Date && control && this.pickerBirthdate) {
      this.pickerBirthdate.select(date);
    }
  }
}
