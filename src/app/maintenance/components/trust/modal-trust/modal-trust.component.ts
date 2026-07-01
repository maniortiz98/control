import { Component, inject, ViewChild } from '@angular/core';
import { InternSection, InternTrust } from '../../../../onboarding/models/trust';
import { PhoneItem } from '../../../../onboarding/models/phone-item';
import { MailItem } from '../../../../onboarding/models/mail-item';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MailSectionComponent } from '../../../../shared/components/sections/mail-section/mail-section.component';
import { PhoneSectionComponent } from '../../../../shared/components/sections/phone-section/phone-section.component';
import { SectionTrustComponent } from '../section-trust/section-trust.component';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { ERROR_MESSAGES } from '../../../../onboarding/constants/form-messages';
import { butonFunctionDis } from '../../../../shared/utils/disableOrEnabled';

@Component({
  selector: 'app-modal-trust',
  standalone: false,
  templateUrl: './modal-trust.component.html',
  styleUrl: './modal-trust.component.scss'
})
export class ModalTrustComponent {

  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ModalTrustComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationsService);

  initSection: InternSection | null = null;
  phoneSaved: PhoneItem[] = [];
  mailSaved: MailItem[] = [];

  private readonly configDisabled: any = {
    "phone": {
      "allDisabled": true,
      "fieldsDisabled": [],
      "buttonsDisabled": []
    },
    "mail": {
      "allDisabled": true,
      "fieldsDisabled": [],
      "buttonsDisabled": []
    }
  }

  rolePermises: any = {}
  form: FormGroup = this.fb.group({
    recomendations: [''],
  })

  @ViewChild(MailSectionComponent)
  mailSection!: MailSectionComponent;

  @ViewChild(PhoneSectionComponent)
  phoneSection!: PhoneSectionComponent;

  @ViewChild(SectionTrustComponent)
  trustSection!: SectionTrustComponent;

  ngOnInit() {
    console.log(this.data.content);
    if (this.data.content) {
      this.initSection = this.data.content;
      this.phoneSaved = this.data.content.phones;
      this.mailSaved = this.data.content.mails;
    }
  }
  ngAfterViewInit() {
    console.log('data')
    console.log(this.data)
    console.log(this.data.onlyRead)
    if (this.data.onlyRead) {
      this.trustSection.form.disable();
      this.phoneSection.form.disable();
      this.mailSection.form.disable();
      this.form.disable()
      this.rolePermises = this.configDisabled;
      butonFunctionDis(['searchClientTrust', 'createTrust', 'saveTrust']);

    }
  }


  save() {
    const sectionResponse = this.trustSection.save();
    const phones = this.phoneSection.phoneList();
    const mails = this.mailSection.mailList();

    const hasCelularPhone = phones.some(p => p.phoneTypeId === '1');
    const hasMail = mails.length > 0;

    if (sectionResponse && hasCelularPhone && hasMail) {
      const stor: InternTrust = {
        ...sectionResponse,
        phones: phones,
        mails: mails,
        recomendations: this.form.value.recomendations ?? '',
      }

      //TODO servicio de guardado
      this.mailSection.resetModified();
      this.phoneSection.resetModified();
      this.notificationService.info('En espera de entrega de servicio Backend')
    } else {
      this.notificationService.info(ERROR_MESSAGES.MISSING_INFO);
    }
  }

  create() {

  }


  close() {
    this.dialogRef.close()
  }
}
