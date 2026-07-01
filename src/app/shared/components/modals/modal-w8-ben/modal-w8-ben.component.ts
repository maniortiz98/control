import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationsService } from '../../../services/notifications.service';
import { DatePipe } from '@angular/common';
import { ERROR_MESSAGES } from '../../../../onboarding/constants/form-messages';

interface W8BENData {
  tempId: string;
  startDateW8: string | Date;
  endDateW8: string | Date;
  active?: boolean,
}

@Component({
  selector: 'app-w8-ben-modal',
  standalone: false,
  templateUrl: './modal-w8-ben.component.html',
  styleUrls: ['./modal-w8-ben.component.scss'],
})
export class W8BENModalComponent implements OnInit {
  editForm!: FormGroup;
  existingData: W8BENData[];
  private datePipe = new DatePipe('en-US');

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      existingData: W8BENData[];
      tempId: string;
      startDateW8: string;
      endDateW8: string;
      enabled: boolean
    },
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<W8BENModalComponent>,
    private notificationService: NotificationsService
  ) {
    // Filter out the current record to avoid self-overlap
    this.existingData = data.existingData.filter(
      (item) => item.tempId !== data.tempId
    );
  }

  ngOnInit(): void {
    this.editForm = this.fb.group({
      startDateW8: [this.parseDate(this.data.startDateW8), Validators.required],
      endDateW8: [this.parseDate(this.data.endDateW8), Validators.required],
    });
    if(this.data.enabled){
      this.editForm.enable();
    }else{
      this.editForm.disable()
    }
  }

  save(): void {
    if (this.editForm.invalid) {
      this.notificationService.error(
        'Por favor completa los campos requeridos.'
      );
      return;
    }

    const startDate: Date = new Date(this.editForm.value.startDateW8);
    const endDate: Date =  new Date(this.editForm.value.endDateW8);

    // Validate overlap
    const validFlag = this.w8DateValidator(startDate, endDate)
    if(!validFlag){
      return;
    }
    const overlap = this.data.existingData
    .filter(r => r.active && r.tempId !== this.data.tempId)
    .some((item) => {
      const start = this.parseW8Date(item.startDateW8);
      const end   = this.parseW8Date(item.endDateW8);
      return startDate <= end && endDate >= start;
    });

    if (overlap) {
      this.notificationService.error(
        'Ya Existe un Registro en el Mismo Período.'
      );
      return;
    }

    // ✅ Only format when closing the modal
    this.dialogRef.close({
      startDateW8: this.formatDate(startDate),
      endDateW8: this.formatDate(endDate),
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  w8DateValidator(newStart: Date, newEnd: Date): boolean{

    const startCtrl = this.editForm.get('startDateW8');
    const endCtrl = this.editForm.get('endDateW8');


    if (isNaN(newStart.getTime())) {
      startCtrl?.setErrors({ invalidDate: true });
      startCtrl?.markAsTouched();
    }

    if (isNaN(newEnd.getTime())) {
      endCtrl?.setErrors({ invalidDate: true });
      endCtrl?.markAsTouched();
    }

    if (isNaN(+newStart) || isNaN(+newEnd)) {
      this.notificationService.error(
        ERROR_MESSAGES.MISSING_FIELDS
      );
      return false;
    }
    if (newStart >= newEnd) {
      this.notificationService.error(
        'La Fecha Inicial debe ser Menor que la Fecha Final'
      );
      return false;
    }


    const maxEnd = new Date(newStart);
    maxEnd.setFullYear(maxEnd.getFullYear() + 3);

    if (newEnd > maxEnd) {
      this.notificationService.error(
        'El Período de Vigencia Seleccionado no Puede Exceder los 3 Años'
      );
      return false
    }
    return true;
  }



  parseW8Date(value: string | Date): Date {
    if (value instanceof Date) {
      const d = new Date(value);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    const [day, month, year] = value.split('/').map(Number);
    const d = new Date(year, month - 1, day);
    d.setHours(0, 0, 0, 0);
    return d;
  }



  private formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  private parseDate(dateStr: any): Date {
    if (!dateStr) return new Date();
    if (dateStr instanceof Date) return dateStr;
    if (typeof dateStr === 'string') {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts.map(Number);
        return new Date(year, month - 1, day);
      }
    }
    this.notificationService.error('Formato de fecha no válido');
    return new Date();
  }
}
