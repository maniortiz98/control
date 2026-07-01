import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-send-email',
  standalone: false,
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.scss'
})
export class SendEmailComponent {

  readonly dialogRef = inject(MatDialogRef<SendEmailComponent>);
  private readonly _formBuilder = inject(FormBuilder);

  form = this._formBuilder.group({
    privacyOption: false,
    clauseOption: false,
    coverOption: false,
  });

  /**
   *
   */
  onClose(): any {
    this.dialogRef.close({
      ok: false,
      data: {}
    });
  }

  /**
   *
   */
  send(): any {
    console.log(this.form.value);
    this.dialogRef.close({
      ok: true,
      data: {}
    });
  }

}
