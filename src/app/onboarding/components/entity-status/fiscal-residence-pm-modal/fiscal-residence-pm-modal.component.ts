import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { Countries } from '../../../models/country';
import { ERROR_MESSAGES } from '../../../constants/form-messages';
import { CountryWithFiscalObligation } from '../../../models/CountryWithFiscalObligation';

@Component({
  selector: 'app-fiscal-residence-pm-modal',
  standalone: false,
  templateUrl: './fiscal-residence-pm-modal.component.html',
  styleUrl: './fiscal-residence-pm-modal.component.scss'
})
export class FiscalResidencePmModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationsService);
  private readonly catalogsService = inject(CatalogsService);

  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<FiscalResidencePmModalComponent>);
  readonly id = crypto.randomUUID()


  form: FormGroup = this.fb.group({
    fiscalResidence: ['', Validators.required],
    ein: [''],
    tin: [''],
    nss: [''],
  });

  countries = signal<Array<Countries>>([]);

  ngOnInit() {
    this.catalogsService.getCountry({ land: [] }).subscribe(c => {
      this.countries.set(c);
    });

    console.log(this.data)
    const inputValues = this.data.content;
    if (inputValues) {
      this.form.patchValue({
        fiscalResidence: inputValues.fiscalResidenceId,
        ein: inputValues.ein ?? '',
        tin: inputValues.tin ?? '',
        nss: inputValues.nss ?? '',
      });
    }
    if(this.data.isNotEditable){
      this.form.disable()
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const capturedData: CountryWithFiscalObligation = {
        id: this.data.content?.id ?? crypto.randomUUID(),
        registerNumber: this.data.registerNumber,
        fiscalResidence: this.countries().find(c => c.countryId == this.form.value.fiscalResidence)?.country ?? '',
        fiscalResidenceId: this.form.value.fiscalResidence,
        ein: this.form.value.ein,
        tin: this.form.value.tin,
        nss: this.form.value.nss,
      }
      this.dialogRef.close(capturedData);
    } else {
      document.body.classList.add('show-validation');
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
      this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS)
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
