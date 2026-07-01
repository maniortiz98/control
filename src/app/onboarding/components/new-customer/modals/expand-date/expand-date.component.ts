import { Component, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-expand-date',
  standalone: false,
  templateUrl: './expand-date.component.html',
  styleUrl: './expand-date.component.scss'
})
export class ExpandDateComponent {

  readonly dialogRef = inject(MatDialogRef<ExpandDateComponent>);

  dateControl = new FormControl('', [Validators.required]);

  /**
   *
   */
  onSubmit(): void {
    console.log(this.dateControl.value);
  }
  /**
   *
   */
  onClose(): any {
    this.dialogRef.close({
      ok: false,
      data: {}
    });
  }

}
