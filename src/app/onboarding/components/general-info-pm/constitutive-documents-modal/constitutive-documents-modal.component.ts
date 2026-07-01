import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalNotificationComponent } from '../../../../shared/components/modals/modal-notification/modal-notification.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralInfoPmService } from '../../../../shared/services/storage-services/pm/general-info-pm.service';
import { ConstitutiveDocuments } from '../../../models/general-info-pm';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../../constants/form-messages';
import { convertDate, convertDateBack } from '../../../../shared/utils/datetime';

@Component({
  selector: 'app-constitutive-documents-modal',
  standalone: false,
  templateUrl: './constitutive-documents-modal.component.html',
  styleUrl: './constitutive-documents-modal.component.scss'
})
export class ConstitutiveDocumentsModalComponent {

  options = [
    {
      value: 'a',
      text: 'A'
    },
    {
      value: 'b',
      text: 'B'
    },
    {
      value: 'c',
      text: 'C'
    },
  ]

  private readonly generalInfoPmService = inject(GeneralInfoPmService);
  private readonly notificationService = inject(NotificationsService);

  private readonly dialogRef = inject(MatDialogRef<ModalNotificationComponent>);
  private readonly fb: FormBuilder = new FormBuilder;

  public readonly form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any){
    this.form = this.fb.group({
        documentType: [
          this.data?.document ? this.data.document.documentType : '',
          Validators.required],
        deedNumber: [
          this.data?.document ? this.data.document.deedNumber : '',
          Validators.required],
        deedDate: [
          this.data?.document ? convertDateBack(this.data.document.deedDate) : '',
          Validators.required],
        notaryNumber: [
          this.data?.document ? this.data.document.notaryNumber : '',
          Validators.required],
        notaryName: [
          this.data?.document ? this.data.document.notaryName : '',
          Validators.required],
        protocolSquare: [
          this.data?.document ? this.data.document.protocolSquare : '',
          Validators.required],
        inscriptionDate: [
          this.data?.document ? convertDateBack(this.data.document.inscriptionDate) : '',
          Validators.required],
        govermentContract: [
          this.data?.document ? this.data.document.govermentContract : ''],
        publicFolio: [
          this.data?.document ? this.data.document.publicFolio : '',
          Validators.required],
    });

  }

  createDocument():ConstitutiveDocuments {
    return {
      documentType: this.form.controls['documentType'].value,
      deedNumber: this.form.controls['deedNumber'].value,
      deedDate: convertDate(this.form.controls['deedDate'].value).toString(),
      notaryNumber: this.form.controls['notaryNumber'].value,
      notaryName: this.form.controls['notaryName'].value,
      protocolSquare: this.form.controls['protocolSquare'].value,
      inscriptionDate: convertDate(this.form.controls['inscriptionDate'].value).toString(),
      govermentContract: this.form.controls['govermentContract'].value,
      publicFolio: this.form.controls['publicFolio'].value,
    }
  }

  private getMissingRequiredFields(): string[] {
    const missingFields: string[] = [];
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);

      if (control?.invalid && control?.hasError('required')) {
        const labelElement = document.getElementById(`${key}Label`);
        const labelText = labelElement?.textContent?.replace('*', '').trim() || key;
        missingFields.push(labelText);
      }
    });
    return missingFields;
  }

  saveDocument(){
    if(this.form.valid){
      let documents: ConstitutiveDocuments[] = [];
      if(this.data.edit){
        documents = this.generalInfoPmService.documents().map(document => {
            return document.deedNumber === this.data.document.deedNumber ? this.createDocument() : document;
          }
        );
      }

      else{
        documents = [...this.generalInfoPmService.documents(), this.createDocument()];
      }

      this.generalInfoPmService.documents.set(documents);
      this.form.reset();
      this.notificationService.success(SUCCESS_MESSAGES.CONSTITUTIVE_DOCUMENT);
      this.closeModal();
    }

    else{
      const missingFields = this.getMissingRequiredFields();
      document.body.classList.add('show-validation');
      for (const [, control] of Object.entries(this.form.controls)) {
        if (control.invalid) {
          control.markAsTouched();
        }
      }

      if(missingFields.length > 0) {
        this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS);
        // this.notificationService.error(`Faltan campos requeridos: • ${missingFields.join(' • ')}`);
      }
    }
  }

  closeModal(){
    this.dialogRef.close();
  }

}
