import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { PhoneItem } from '../../models/phone-item';
import { MailItem } from '../../models/mail-item';
import { MailSectionComponent } from '../../../shared/components/sections/mail-section/mail-section.component';
import { PhoneSectionComponent } from '../../../shared/components/sections/phone-section/phone-section.component';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
import { IdentificationAndContactService } from '../../../shared/services/storage-services/identification-and-contact.service';
import { ContactInformationPm } from '../../models/identification-and-contact';
import { STRINGS } from '../../constants/constants';
import { OnboardingService } from '../../services/onboarding.service';
import { PermissionRolService } from '../../../core/services/rol.service';
import { butonFunctionDis, buttonFunctionEn } from '../../../shared/utils/disableOrEnabled';

@Component({
  selector: 'app-contact-info-pm',
  standalone: false,
  templateUrl: './contact-info-pm.component.html',
  styleUrl: './contact-info-pm.component.scss'
})
export class ContactInfoPmComponent implements OnInit{
  phoneSaved: PhoneItem[] = [];
  mailSaved: MailItem[] = [];

  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly checkpoint = inject(CheckpointService);
  private readonly notificationService = inject(NotificationsService)
  private readonly signalStorage = inject(IdentificationAndContactService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly roleService = inject(PermissionRolService);

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

  isMaintenance: boolean = false;
  rolePermises: any = {}

  @ViewChild(MailSectionComponent)
  mailSection!: MailSectionComponent;

  @ViewChild(PhoneSectionComponent)
  phoneSection!: PhoneSectionComponent;

  initialData: ContactInformationPm | null = null;
  ngOnInit() {
    this.unsavedChangesService.setUnsavedChanges(false);
    this.initialData = this.signalStorage.getContactInfo();
    this.isMaintenance = this.onboardingService.getCurrentInfo().isMaintenance;
    if (this.isMaintenance) {
      this.rolePermises = this.configDisabled;
    }
    console.log('initial data')
    console.log(this.initialData);
    if(this.initialData){
      this.phoneSaved = this.initialData.phones;
      this.mailSaved = this.initialData.emails;
    }
  }

  ngAfterViewInit(){
    if(this.isMaintenance){
      butonFunctionDis(['btnCancelCIM', 'btnSaveCIM']);
      const allPermises = this.roleService.getPermissions();
      const cantEdit = allPermises['contact-info-pm']['allDisabled']
      if(cantEdit){
        butonFunctionDis(['btnEditCIM']);
      }else {
        buttonFunctionEn(['btnEditCIM']);
      }
    }
  }

  save() {
    const phones = this.phoneSection.phoneList()
    const mails = this.mailSection.mailList()

    const hasOficinePhone = phones.some(p => p.phoneTypeId === '3');

    if (hasOficinePhone || mails.length > 0) {

      console.log('info para checkpoint')
      const data: ContactInformationPm = {
        phones: phones,
        emails: mails,
      };

      // this.checkpoint.saveCheckpoint('saveCheckpoint', data).subscribe({
      //   next: (i) => {
      //     console.log(i);
      //     this.signalStorage.setContactInfoPm(data);
      //     this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
      //     this.mailSection.resetModified();
      //     this.phoneSection.resetModified();
      //   },
      //   error: (err) => {
      //     console.error(err);
      //     this.notificationService.error(ERROR_MESSAGES.SAVE_CHECKPOINT_ERROR);
      //   }
      // });
    } else {
      this.notificationService.error(ERROR_MESSAGES.MISSING_CONTACT_INFO_PM_SECTION);
    }
  }

    editt() {
      butonFunctionDis(['btnEditCIM']);
      buttonFunctionEn(['btnSaveCIM', 'btnCancelCIM']);
      const allPermises = this.roleService.getPermissions();
      this.rolePermises = {
        phone: allPermises['contact-info-pm']['sections']['phone'],
        mail: allPermises['contact-info-pm']['sections']['mail'],
      }
      console.log('permises')
      console.log(this.rolePermises);
    }

    cancel() {
      this.rolePermises = this.configDisabled;
      buttonFunctionEn(['btnEditCIM']);
      butonFunctionDis(['btnSaveCIM', 'btnCancelCIM']);
      this.phoneSection.clear();
      this.mailSection.clear();
    }
}
