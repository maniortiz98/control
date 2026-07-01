import { Component, inject, ViewChild } from '@angular/core';
import { PhoneItem } from '../../../../onboarding/models/phone-item';
import { MailItem } from '../../../../onboarding/models/mail-item';
import { MailSectionComponent } from '../../../../shared/components/sections/mail-section/mail-section.component';
import { PhoneSectionComponent } from '../../../../shared/components/sections/phone-section/phone-section.component';
import { InternSection, InternTrust } from '../../../../onboarding/models/trust';
import { TrustService } from '../../../../shared/services/storage-services/pm/trust.service';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { GeneralInfoStorageService } from '../../../../shared/services/storage-services/general-info-storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalSearchClientService } from '../../../../shared/services/modal-search-client.service';
import { SectionTrustComponent } from '../section-trust/section-trust.component';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { ERROR_MESSAGES } from '../../../../onboarding/constants/form-messages';

@Component({
  selector: 'app-intern-trust',
  standalone: false,
  templateUrl: './intern-trust.component.html',
  styleUrl: './intern-trust.component.scss'
})
export class InternTrustComponent {

  private readonly trustStorage = inject(TrustService);
  private readonly notificationService = inject(NotificationsService);
  private readonly notificationModal = inject(NotificationModalService);
  private readonly fb = inject(FormBuilder);
  private readonly unsavedChangesService = inject(UnsavedChangesService);

  @ViewChild(MailSectionComponent)
  mailSection!: MailSectionComponent;

  @ViewChild(PhoneSectionComponent)
  phoneSection!: PhoneSectionComponent;

  @ViewChild(SectionTrustComponent)
  trustSection!: SectionTrustComponent;

  form: FormGroup = this.fb.group({
    recomendations: [''],
  })

  initialData: InternTrust | null = null;
  initSection: InternSection | null = null;
  phoneSaved: PhoneItem[] = [];
  mailSaved: MailItem[] = [];
  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      this.unsavedChangesService.setUnsavedChanges(this.form.dirty);
    });

    this.initialData = this.trustStorage.internTrust();

    console.log('initial data')
    console.log(this.initialData);
    if (this.initialData) {
      this.initSection = this.initialData;
      this.phoneSaved = this.initialData.phones;
      this.mailSaved = this.initialData.mails;
    }
  }

  save(){
    const sectionResponse = this.trustSection.save();
    const phones = this.phoneSection.phoneList();
    const mails = this.mailSection.mailList();

    const hasCelularPhone = phones.some(p => p.phoneTypeId === '1');
    const hasMail = mails.length > 0;

    console.log({sectionResponse})
    console.log({mails})
    console.log({phones})
    console.log(hasCelularPhone)
    console.log(hasMail)
    if(sectionResponse && hasCelularPhone && hasMail){
      const stor: InternTrust = {
        ...sectionResponse,
        phones: phones,
        mails: mails,
        recomendations: this.form.value.recomendations ?? '',
      }

      //TODO servicio de guardado
      console.log({stor})
      this.trustStorage.setInternTrust(stor);
      this.mailSection.resetModified();
      this.phoneSection.resetModified();
      this.unsavedChangesService.setUnsavedChanges(false);
      this.notificationService.info('En espera de entrega de servicio Backend');
    }else {
      this.notificationService.error(ERROR_MESSAGES.MISSING_INFO);
    }
  }

  create(){
    this.save();
  }
}
