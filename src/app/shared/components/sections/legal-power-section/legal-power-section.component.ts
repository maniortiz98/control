import { ChangeDetectorRef, Component, inject, input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from '../../../services/notifications.service';
import { ERROR_MESSAGES } from '../../../../onboarding/constants/form-messages';
import { LegalPowerInfo } from '../../../../onboarding/models/legal-power-section';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-legal-power-section',
  standalone: false,
  templateUrl: './legal-power-section.component.html',
  styleUrl: './legal-power-section.component.scss'
})
export class LegalPowerSectionComponent implements OnInit{
  @ViewChild('pickerBirthdate') pickerBirthdate!: MatDatepicker<Date>;
  
  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notificationService = inject(NotificationsService);
  legalPowerSaved = input.required<LegalPowerInfo | null>()


  form: FormGroup = this.fb.group({
    adminitration: [false],
    domain: [false],
    powerToDelegate: [false],
    creditTitles: [false],
    powerToOpenAccount: [false],

    writingNumber: ['', Validators.required],
    writingDate: ['', Validators.required],
    writingNotaryName: ['', Validators.required],
    notaryNumber: ['', Validators.required],
    protocalizationPlace: ['', Validators.required],
    powerLimitations: ['', Validators.required],
  });

  ngOnInit() {
    
  }
  ngAfterViewInit(): void {
    this.chargeInitialData(this.legalPowerSaved());
  }

  onSubmit(): LegalPowerInfo | null {
    if (this.form.valid) {

      const response: LegalPowerInfo = {
        id: this.legalPowerSaved()?.id,
        adminitration: this.form.value.adminitration,
        domain: this.form.value.domain,
        powerToDelegate: this.form.value.powerToDelegate,
        creditTitles: this.form.value.creditTitles,
        powerToOpenAccount: this.form.value.powerToOpenAccount,

        writingNumber: this.form.value.writingNumber,
        writingDate: this.form.value.writingDate,
        writingNotaryName: this.form.value.writingNotaryName,
        notaryNumber: this.form.value.notaryNumber,
        protocalizationPlace: this.form.value.protocalizationPlace,
        powerLimitations: this.form.value.powerLimitations,
      }
      if(response.adminitration || response.domain || response.powerToDelegate || response.creditTitles || response.powerToOpenAccount){
        return response;
      }else {
        this.notificationService.error(ERROR_MESSAGES.AT_LEAST_ONE_POWER_REQUIRED)
        return null;
      }

    } else {
      document.body.classList.add('show-validation');
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
      this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS)
      return null;
    }
  }



  chargeInitialData(content: LegalPowerInfo | null) {
    if (content) {
      this.form.patchValue({
        adminitration: content?.adminitration,
        domain: content?.domain,
        powerToDelegate: content?.powerToDelegate,
        creditTitles: content?.creditTitles,
        powerToOpenAccount: content?.powerToOpenAccount,

        writingNumber: content?.writingNumber,
        writingDate: content?.writingDate,
        writingNotaryName: content?.writingNotaryName,
        notaryNumber: content?.notaryNumber,
        protocalizationPlace: content?.protocalizationPlace,
        powerLimitations: content?.powerLimitations,
      });
    }
  }
  onDateInput(event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
    const date = event.value;
    console.log(date);
    const control = this.form.get('writingDate');

    if (date instanceof Date && control && this.pickerBirthdate) {
      this.pickerBirthdate.select(date); 
    }
  }
}
