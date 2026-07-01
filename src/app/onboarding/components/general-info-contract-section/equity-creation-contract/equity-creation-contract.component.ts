import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { Countries } from '../../../models/country';
import { CreationEquityContract } from '../../../models/equity-contract';
import { ERROR_MESSAGES } from '../../../constants/form-messages';
import { EquityStrategyItem } from '../../../../maintenance/models/equity-stategy';

import { OnboardingService } from '../../../services/onboarding.service';
import { EquityRegistrationRequest, EquityRegistrationResponse } from '../../../models/equity-contract';

@Component({
  selector: 'app-equity-creation-contract',
  standalone: false,
  templateUrl: './equity-creation-contract.component.html',
  styleUrl: './equity-creation-contract.component.scss'
})
export class EquityCreationContractComponent {
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationsService);
  private readonly catalogsService = inject(CatalogsService);
  private readonly onboardingService = inject(OnboardingService);

  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<EquityCreationContractComponent>);
  catalog: EquityStrategyItem[] = [];
  isNotSelectedContract = signal<boolean>(true);

  form: FormGroup = this.fb.group({
    selectedContract: ['', Validators.required],
    investmentAmmount: ['', Validators.required],
  });

  countries = signal<Array<Countries>>([]);

  ngOnInit() {
    this.catalog = this.data?.strategies || [];
  }



  onSubmit() {
    if (this.form.valid) {
      const selectedStrategyId = this.form.value.selectedContract;
      const selectedStrategy = this.catalog.find(s => s.cveStrategy == selectedStrategyId);

      const investmentAmount = Number(this.form.value.investmentAmmount.toString().replace(/[^0-9.]/g, ''));

      if (selectedStrategy && investmentAmount < selectedStrategy.minimumAmount) {
        const formattedAmount = new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
          minimumFractionDigits: 2
        }).format(selectedStrategy.minimumAmount);
        this.notificationService.error(`El monto mínimo para esta estrategia es ${formattedAmount} MXN`);
        return;
      }

      this.registerEquity();

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

  registerEquity() {
    console.debug("registerEquity businessType: ",this.onboardingService.getCurrentInfo().businessType?.toString())
    const request: EquityRegistrationRequest = {
      contract: this.data.contract,
      bankingArea: this.onboardingService.getCurrentInfo().businessType?.toString() || '998',
      cveStrategy: this.form.value.selectedContract,
      advisorId: this.data.advisorId,
      amount: Number(this.form.value.investmentAmmount.toString().replace(/[^0-9.]/g, '')).toFixed(1)
    };

    this.onboardingService.registerEquity(request).subscribe({
      next: (res: EquityRegistrationResponse) => {
        if (res.status === 'SUCCESS') {
          this.notificationService.success(res.messages);
          this.dialogRef.close(res);
        } else {
          this.notificationService.error(res.messages);
        }
      },
      error: (err: any) => {
        this.notificationService.error('Error al registrar la estrategia Equity');
        console.error(err);
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }



  selectAvailableEstrategies(){
    if(this.form.value.selectedContract){
      this.isNotSelectedContract.set(false)
    }else {
      this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS)
    }
  }


onSelectContract(item: EquityStrategyItem) {
  if (item.cveStrategy !== undefined) {
    this.form.get('selectedContract')?.setValue(item.cveStrategy);
  }
}

  isSelected(item: EquityStrategyItem) {
    return this.form.get('selectedContract')?.value === item.cveStrategy;
  }

  get selectedStrategy(): EquityStrategyItem | undefined {
    const selectedContractId = this.form.get('selectedContract')?.value;
    return this.catalog.find(s => s.cveStrategy == selectedContractId);
  }

}
