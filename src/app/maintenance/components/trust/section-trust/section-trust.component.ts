import { Component, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalSearchClientService } from '../../../../shared/services/modal-search-client.service';
import { TrustService } from '../../../../shared/services/storage-services/pm/trust.service';
import { InternSection, InternTrust } from '../../../../onboarding/models/trust';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { ERROR_MESSAGES } from '../../../../onboarding/constants/form-messages';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';

@Component({
  selector: 'app-section-trust',
  standalone: false,
  templateUrl: './section-trust.component.html',
  styleUrl: './section-trust.component.scss'
})
export class SectionTrustComponent {

  private readonly notificationService = inject(NotificationsService);
  private readonly fb = inject(FormBuilder);
  private readonly searchClientService = inject(ModalSearchClientService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);

  initialInfo = input<InternSection | null>(null);

  options: any = [
    {
      id: 1,
      value: 'PERFIL 1',
      text: 'text 1'
    },
    {
      id: 2,
      value: 'PERFIL 2',
      text: 'text 2'
    },
    {
      id: 3,
      value: 'PERFIL 3',
      text: 'text other'
    }
  ]

  form: FormGroup = this.fb.group({
    asesorId: ['', Validators.required],
    asesorName: [{value: '', disabled: true}, Validators.required],

    branchId: ['', Validators.required],
    branchName: [{value: '', disabled: true}, Validators.required],

    clientNumber: [{value: '', disabled: true}, Validators.required],
    trustNumber: ['', Validators.required],
    contractBankAmount: ['', Validators.required],
    contractBrokerAmount: ['', Validators.required],
    trustType: [{value: 'INTERNO', disabled: true}, Validators.required],

    internTrustType: ['', Validators.required],
    trustPersonType: ['', Validators.required],
    profileType: ['', Validators.required],

  })

  ngOnInit(){
    this.form.valueChanges.subscribe(() => {
      this.unsavedChangesService.setUnsavedChanges(this.form.dirty);
    });
    if(this.initialInfo()){
      this.form.patchValue({
        asesorId: this.initialInfo()?.asesorId,
        asesorName: this.initialInfo()?.asesorName,

        branchId: this.initialInfo()?.branchId,
        branchName: this.initialInfo()?.branchName,

        clientNumber: this.initialInfo()?.clientNumber,
        trustNumber: this.initialInfo()?.trustNumber,
        contractBankAmount: this.initialInfo()?.contractBankAmount,
        contractBrokerAmount: this.initialInfo()?.contractBrokerAmount,
        trustType: this.initialInfo()?.trustType,

        internTrustType: this.initialInfo()?.internTrustType,
        trustPersonType: this.initialInfo()?.trustPersonType,
        profileType: this.initialInfo()?.profileType,
      })
    }
  }

  save(): InternSection | null {
    if (this.form.valid) {
      const resp: InternSection = {
        asesorId: this.form.value.asesorId,
        asesorName: this.form.value.asesorName,

        branchId: this.form.value.branchId,
        branchName: this.form.value.branchName,

        clientNumber: this.form.value.clientNumber,
        trustNumber: this.form.value.trustNumber,
        contractBankAmount: this.form.value.contractBankAmount,
        contractBrokerAmount: this.form.value.contractBrokerAmount,
        trustType: this.form.value.trustType,

        internTrustType: this.form.value.internTrustType,
        trustPersonType: this.form.value.trustPersonType,
        profileType: this.form.value.profileType,
      }

      return resp;
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

  async searchClient() {
    const result = await this.searchClientService.searchClient()
    console.log({result});
    this.form.patchValue({
      clientNumber: result?.clientNumber ?? ''
    })

  }

  searchAsesorName(){
    //TODO integrar servicio backend
    this.notificationService.info('En espera de entrega de servicio Backend')
    // this.form.patchValue({
    //   asesorName: 'Lorem ipsum'
    // })
  }

  searchBranchName(){
    //TODO integrar servicio backend
    this.notificationService.info('En espera de entrega de servicio Backend')
    // this.form.patchValue({
    //   branchName: 'Lorem ipsum'
    // })
  }

  limitLength(event: any, maxLength: number) {
    const value = event.target.value;
    if (value.length > maxLength) {
      event.target.value = value.slice(0, maxLength);
    }
  }
}
