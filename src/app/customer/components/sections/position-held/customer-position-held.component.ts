import { Component, inject, Input, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CustomerCatalogsService } from '../../../services/customer-catalogs.service';
import { CustomerNotificationsService } from '../../../services/customer-notifications.service';
import { CustomerPositionHeld } from '../../../models/customer-position-held';
import { CustomerRelationships } from '../../../models/customer-relationships';
import { CustomerOccupation } from '../../../models/customer-occupation';
import { formatDateYYYYMMDD } from '../../../utils/customer-datetime';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-customer-position-held',
  standalone: false,
  templateUrl: './customer-position-held.component.html',
  styleUrl: './customer-position-held.component.scss'
})
export class CustomerPositionHeldComponent {

  @Input() data?: CustomerPositionHeld | null = null;
  @ViewChild('pickerBirthdate') pickerBirthdate!: MatDatepicker<Date>;
  
  //Inject
  private readonly fb = inject(FormBuilder);
  private readonly catalogService = inject(CustomerCatalogsService);
  readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(CustomerNotificationsService)
  
  relationships = signal<Array<CustomerRelationships>>([]);
  occupations = signal<Array<CustomerOccupation>>([]);

  // Form
  profileForm: FormGroup = this.fb.nonNullable.group({
    chargeDueDate: ['', ],
    relationship: ['', Validators.required],
    positionHeld: ['', Validators.required],
  });

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
    this.catalogService.getOccupations({ocupationIds: []}).subscribe(c => {
      this.occupations.set(c);
    });
    if (this.data) {
      console.log( this.data)
      if(this.data.chargeDueDate != ''){
        this.profileForm.patchValue({ chargeDueDate: formatDateYYYYMMDD(this.data.chargeDueDate) });
      }else{
        this.profileForm.patchValue({ chargeDueDate: null });
      }
      this.profileForm.patchValue({ relationship: this.data.relationship });
      this.profileForm.patchValue({ positionHeld: this.data.positionHeld });
    }
  }

  async sendInformation(): Promise<CustomerPositionHeld | null> {
    document.body.classList.add('show-validation');
    Object.keys(this.profileForm.controls).forEach(controlName => {
      const control = this.profileForm.get(controlName);
      control?.updateValueAndValidity();
    });
    console.log(this.profileForm.getRawValue().chargeDueDate)
    if (!this.profileForm.valid) {
      this.error();
      this.notificationService.error('Faltan campos obligatorios por capturar');
      return null;
    } else {
      return this.positionHeld();
    }
  }

  //function to map to CustomerPositionHeld
  positionHeld = (): CustomerPositionHeld => this.profileForm.getRawValue() as CustomerPositionHeld;

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



