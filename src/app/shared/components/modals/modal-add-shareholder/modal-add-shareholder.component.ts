// modal-add-shareholder.component.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export type ModalAddShareholderResult = {
  personType: 'PF' | 'PM';
  percentage: number;
  nombre?: string;
  fideicomiso?: boolean;
  cotizaBmv?: boolean;
};

@Component({
  selector: 'app-modal-add-shareholder',
  standalone: false,
  templateUrl: './modal-add-shareholder.component.html',
  styleUrls: ['./modal-add-shareholder.component.scss'],
})
export class ModalAddShareholderComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(
    MatDialogRef<ModalAddShareholderComponent, ModalAddShareholderResult>
  );
  public data = inject(MAT_DIALOG_DATA) as { remaining: number };

  form = this.fb.group({
    personType: this.fb.nonNullable.control<'PF' | 'PM'>(
      'PF',
      Validators.required
    ),
    percentage: this.fb.nonNullable.control<number>(
      this.data.remaining || 100,
      [
        Validators.required,
        Validators.min(0.01),
        Validators.max(Math.max(0.01, this.data.remaining || 100)),
      ]
    ),
    // opcionales:
    nombre: this.fb.control<string>(''),
    fideicomiso: this.fb.nonNullable.control<boolean>(false),
    cotizaBmv: this.fb.nonNullable.control<boolean>(false),
  });

  save() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.dialogRef.close({
      personType: v.personType!,
      percentage: Number(v.percentage),
      nombre: (v.nombre || '').trim(),
      fideicomiso: v.fideicomiso ?? false,
      cotizaBmv: v.cotizaBmv ?? false,
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
