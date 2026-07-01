import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CustomerIdentificationSectionComponent } from '../sections/identification-section/customer-identification-section.component';
import { CustomerMailSectionComponent } from '../sections/mail-section/customer-mail-section.component';
import { CustomerPhoneSectionComponent } from '../sections/phone-section/customer-phone-section.component';
import { CustomerNotificationsService } from '../../services/customer-notifications.service';
import { CustomerCheckpointService } from '../../services/customer-customer-checkpoint-core.service';
import { CustomerIdentificationItem } from '../../models/customer-identification-item';

import { CustomerPhoneItem } from '../../models/customer-phone-item';
import { CustomerMailItem } from '../../models/customer-mail-item';

import { ERROR_MESSAGES, NOTIFICATION_MESSAGES, SUCCESS_MESSAGES } from '../../constants/customer-form-messages';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { exitentedToIdentificationAndContactEdit, identificationAndContactToCheckpoint } from '../../services/mappers/customer-identification-and-contact.mapper';
import { CustomerIdentificationAndContactService } from '../../services/storage-services/customer-identification-and-contact.service';
import { CustomerIndentificationAndContactInformation } from '../../models/customer-identification-and-contact';
import { CustomerOnboardingService } from '../../services/customer-onboarding.service';
import { CHECKPOINT_IDS } from '../../constants/customer-constants';
import { CustomerInformationService } from '../../services/customer-information.service';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { IdentificationType } from '../../models/customer-identification-type';
import { Countries } from '../../models/customer-country';
import { PhoneType } from '../../models/customer-phone-type';
import { butonFunctionDis, buttonFunctionEn } from '../../utils/customer-disable-or-enabled';
import { PermissionRolService } from '../../../core/services/rol.service';
import { firstValueFrom } from 'rxjs';
import { exitentedClientToIdentificationAndContact } from '../../services/mappers/mappers-get-client/identification-and-contact.mapper';
import { identificationAndContactToCheckpointMant, mapCheckpointMant } from '../../services/mappers/maintenance/customer-identification-and-contract-mant-mapper';

@Component({
  selector: 'app-customer-contact-info',
  standalone: false,
  templateUrl: './customer-contact-info.component.html',
  styleUrl: './customer-contact-info.component.scss'
})

export class CustomerContactInfoComponent implements OnInit {

  @ViewChild(CustomerIdentificationSectionComponent)
  identificationSection!: CustomerIdentificationSectionComponent;

  @ViewChild(CustomerMailSectionComponent)
  mailSection!: CustomerMailSectionComponent;

  @ViewChild(CustomerPhoneSectionComponent)
  phoneSection!: CustomerPhoneSectionComponent;

  private readonly notificationService = inject(CustomerNotificationsService);
  private readonly checkpoint = inject(CustomerCheckpointService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly pageStorageService = inject(CustomerIdentificationAndContactService);
  private readonly onboardingService = inject(CustomerOnboardingService);
  isMaintenance = this.onboardingService.getCurrentInfo().isMaintenance;
  private readonly roleService = inject(PermissionRolService);
  private readonly catalogsService = inject(CatalogsService);

  private readonly configDisabled: any = {
    "identification": {
      "allDisabled": true,
      "fieldsDisabled": [],
      "buttonsDisabled": []
    },
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
  showInput = signal(true);
  showTable = signal(true);
  initialData: CustomerIndentificationAndContactInformation | null = null;
  manifestLetter = signal(false);
  phoneSaved: CustomerPhoneItem[] = [];
  mailSaved: CustomerMailItem[] = [];
  identificationSaved: CustomerIdentificationItem[] = [];

  phoneTypes = signal<Array<PhoneType>>([]);
  countries = signal<Array<Countries>>([]);
  identifications = signal<Array<IdentificationType>>([]);

  constructor() {
    this.manifestLetter.set(false);
  }

  ngOnInit() {
    this.unsavedChangesService.setUnsavedChanges(false);
    this.initialData = this.pageStorageService.identificationAndContactInfo();
    console.log('initial data')
    console.log(this.initialData);
    if (this.initialData) {
      this.identificationSaved = this.initialData.identifications;
      this.manifestLetter.set(this.initialData.manifestLetter);
      this.phoneSaved = this.initialData.phones;
      this.mailSaved = this.initialData.emails;
    }
  }

  ngAfterViewInit() {
    if (this.isMaintenance) {
      this.rolePermises = this.configDisabled;
      butonFunctionDis(['btnCancelCI', 'btnSaveCI']);
      const allPermises = this.roleService.getPermissionsCustomer();
      const cantEdit = allPermises['contact-info']['allDisabled']
      if (cantEdit) {
        butonFunctionDis(['btnEditCI']);
      } else {
        buttonFunctionEn(['btnEditCI']);
      }
    }
  }

  checkManifestLetter(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.manifestLetter.set(input.checked);
    console.log(this.manifestLetter());
    if (this.manifestLetter()) {
      this.notificationService.success(NOTIFICATION_MESSAGES.MANIFEST_LETTER_NOTIFICATION)
    }
  }

  checkDisableManifest(): boolean {
    const identifications = this.identificationSection?.identificationList() ?? [];
    if (identifications.some((p: any) => p.identificationType === 'CREDENCIAL PARA VOTAR')) return true;
    if (identifications.length < 2) return true;
    return false;
  }

  save() {
    const phones = this.phoneSection.phoneList()
    const identifications = this.identificationSection.identificationList()
    const mails = this.mailSection.mailList()

    const hasCelularPhone = phones.some(p => p.phoneTypeId === '1' && p.active);
    const hasMail = mails.length > 0 && mails.some(m => m.active);
    const hastIdentification = identifications.length > 0 && identifications.some(i => i.active);

    if (hastIdentification) {
      console.log(this.manifestLetter())
      console.log(((hasCelularPhone || hasMail) && phones.length > 0))
      if (((hasCelularPhone || hasMail) && phones.length > 0) || this.manifestLetter()) {

        if (!this.isMaintenance) {
          const data: CustomerIndentificationAndContactInformation = {
            identifications: identifications.filter(i => i.active),
            manifestLetter: this.manifestLetter(),
            phones: phones.filter(p => p.active),
            emails: mails.filter(m => m.active),
          };
          console.log('info para checkpoint')
          console.log(data)

          console.log(identificationAndContactToCheckpoint(data))
          const requestCheckpoint = identificationAndContactToCheckpoint(data)
          this.checkpoint.saveSection('identification-contact', requestCheckpoint).subscribe({
            next: (i) => {
              console.log(i);

              if (i.status === "FAILED") {
                console.log(i.status);
              } else {
                this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
                this.pageStorageService.setIdentificationAndContactInfo(data);
                this.mailSection.resetModified();
                this.identificationSection.resetModified();
                this.phoneSection.resetModified();
              }

            },
            error: (err) => {
              console.error(err);
            }
          });
        } else {
          const data: CustomerIndentificationAndContactInformation = {
            identifications: identifications,
            manifestLetter: this.manifestLetter(),
            phones: phones,
            emails: mails,
          };
          console.log('info para checkpoint')
          console.log(data)

          console.log(identificationAndContactToCheckpointMant(data))
          const requestCheckpoint = mapCheckpointMant(identificationAndContactToCheckpointMant(data));
          this.checkpoint.saveSectionNonContract('identification-contact', requestCheckpoint).subscribe({
            next: (i) => {
              console.log(i);

              if (i.status === "FAILED") {
                console.log(i.status);
              } else {
                this.update()
              }

            },
            error: (err) => {
              console.error(err);
            }
          });
        }
      } else {
        this.notificationService.error(ERROR_MESSAGES.MISSING_CONTACT_INFO_SECTION);
      }
    } else {
      this.notificationService.error(ERROR_MESSAGES.MISSING_IDENTIFICATION);
    }

  }

  editt() {
    butonFunctionDis(['btnEditCI']);
    buttonFunctionEn(['btnSaveCI', 'btnCancelCI']);
    const allPermises = this.roleService.getPermissions();
    this.rolePermises = {
      identification: allPermises['contact-info']['sections']['identification'],
      phone: allPermises['contact-info']['sections']['phone'],
      mail: allPermises['contact-info']['sections']['mail'],
    }
    console.log('permises')
    console.log(this.rolePermises);
  }

  cancel() {
    this.rolePermises = this.configDisabled;
    buttonFunctionEn(['btnEditCI']);
    butonFunctionDis(['btnSaveCI', 'btnCancelCI']);
    this.phoneSection.clear();
    this.mailSection.clear();
    this.identificationSection.clear();
  }

  async update() {
    this.checkpoint.getSectionsByCustomer()
      .subscribe({
        next: async (response: any) => {
          await this.onboardingService.getCustomerInfo(response);
          this.initialData = this.pageStorageService.identificationAndContactInfo();
          console.log(this.initialData);
          // this.ngOnInit()
          if (this.initialData) {
            this.identificationSaved = this.initialData.identifications;
            this.manifestLetter.set(this.initialData.manifestLetter);
            this.phoneSaved = this.initialData.phones;
            this.mailSaved = this.initialData.emails;
            this.identificationSection.setData(this.initialData.identifications);
            this.mailSection.setData(this.initialData.emails);
            this.phoneSection.setData(this.initialData.phones);
            this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
          }
          this.mailSection.resetModified();
          this.identificationSection.resetModified();
          this.phoneSection.resetModified();
          this.rolePermises = this.configDisabled;
          buttonFunctionEn(['btnEditCI']);
          butonFunctionDis(['btnSaveCI', 'btnCancelCI']);
        },
        error: (err) => {
        },
        complete: () => {
        }
      });
  }

}








