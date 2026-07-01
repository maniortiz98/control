import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { IdentificationSectionComponent } from '../../../shared/components/sections/identification-section/identification-section.component';
import { MailSectionComponent } from '../../../shared/components/sections/mail-section/mail-section.component';
import { PhoneSectionComponent } from '../../../shared/components/sections/phone-section/phone-section.component';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { IdentificationItem } from '../../models/identification-item';

import { PhoneItem } from '../../models/phone-item';
import { MailItem } from '../../models/mail-item';

import { ERROR_MESSAGES, NOTIFICATION_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { identificationAndContactToCheckpoint } from '../../services/mappers/identification-and-contact.mapper';
import { IdentificationAndContactService } from '../../../shared/services/storage-services/identification-and-contact.service';
import { IndentificationAndContactInformation } from '../../models/identification-and-contact';
import { OnboardingService } from '../../services/onboarding.service';
import { butonFunctionDis, buttonFunctionEn } from '../../../shared/utils/disableOrEnabled';
import { PermissionRolService } from '../../../core/services/rol.service';
import { CHECKPOINT_IDS } from '../../constants/constants';
import { checkpointMantToIdentificationAndContact, identificationAndContactToCheckpointMant } from '../../services/mappers/maintenance/identification-and-contract-mant-mapper';
import { catchError, firstValueFrom, map } from 'rxjs';
import { Countries } from '../../models/country';
import { PhoneType } from '../../models/phone-type';
import { IdentificationType } from '../../models/identification-type';
import { CatalogsService } from '../../../shared/services/catalogs.service';

@Component({
  selector: 'app-contact-info',
  standalone: false,
  templateUrl: './contact-info.component.html',
  styleUrl: './contact-info.component.scss'
})

export class ContactInfoComponent implements OnInit {

  @ViewChild(IdentificationSectionComponent)
  identificationSection!: IdentificationSectionComponent;

  @ViewChild(MailSectionComponent)
  mailSection!: MailSectionComponent;

  @ViewChild(PhoneSectionComponent)
  phoneSection!: PhoneSectionComponent;

  private readonly notificationService = inject(NotificationsService);
  private readonly checkpoint = inject(CheckpointService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly pageStorageService = inject(IdentificationAndContactService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly roleService = inject(PermissionRolService);
  private readonly checkpointService = inject(CheckpointService);
  private readonly catalogsService = inject(CatalogsService);

  phoneTypes = signal<Array<PhoneType>>([]);
  countries = signal<Array<Countries>>([]);
  identifications = signal<Array<IdentificationType>>([]);

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

  isMaintenance: boolean = false;
  rolePermises: any = {}
  showInput = signal(true);
  showTable = signal(true);
  initialData: IndentificationAndContactInformation | null = null;
  manifestLetter = signal(false);
  phoneSaved: PhoneItem[] = [];
  mailSaved: MailItem[] = [];
  identificationSaved: IdentificationItem[] = [];

  constructor() {
    this.manifestLetter.set(false);
  }

  ngOnInit() {
    this.unsavedChangesService.setUnsavedChanges(false);
    this.initialData = this.pageStorageService.identificationAndContactInfo();
    this.isMaintenance = this.onboardingService.getCurrentInfo().isMaintenance;
    const exitingClient = this.onboardingService.getCurrentInfo().isCustomer;
    if (exitingClient) {
      this.rolePermises = {
        "identification": {
          "allDisabled": true,
          "fieldsDisabled": [],
          "buttonsDisabled": []
        }
      }
    }
    if (this.isMaintenance) {
      this.rolePermises = this.configDisabled;
    }
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
      butonFunctionDis(['btnCancelCI', 'btnSaveCI']);
      const allPermises = this.roleService.getPermissions();
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
    if (identifications.some(p => p.identificationType === 'CREDENCIAL PARA VOTAR' && p.active)) return true;
    if (identifications.length < 2) return true;
    return false;
  }

  save() {
    const phones = this.phoneSection.phoneList()
    const identifications = this.identificationSection.identificationList()
    const mails = this.mailSection.mailList()

    const hasCelularPhone = phones.some(p => p.phoneTypeId === '1' && p.active);
    const hasMail = mails.length > 0 && mails.some(m => m.active);
    const hastIdentification = identifications.length > 0 && identifications.some( i=> i.active );

    if (hastIdentification) {
      console.log(this.manifestLetter())
      console.log(((hasCelularPhone || hasMail) && phones.length > 0))
      if (((hasCelularPhone || hasMail) && phones.length > 0 
        && phones.some(p => p.active && p.phoneTypeId === "1" && p.phoneNotification) 
        && mails.some(m => m.active && m.mailNotification)) || this.manifestLetter()) {

        if (!this.isMaintenance) {
          const data: IndentificationAndContactInformation = {
            identifications: identifications.filter(i => i.active),
            manifestLetter: this.manifestLetter(),
            phones: phones.filter(p => p.active),
            emails: mails.filter(m => m.active),
          };
          console.log('info para checkpoint')
          console.log(data)
          const requestCheckpoint = identificationAndContactToCheckpoint(data)
          console.log('Llamando Onboarding Checkpoint')
          this.checkpoint.saveSection('identification-contact', requestCheckpoint).subscribe({
            next: (i) => {
              console.log(i);

              if (i.status === "FAILED") {
                console.log(i.status);
              } else {
                console.log("Guardando info en signal")
                console.log({data})
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
          const data: IndentificationAndContactInformation = {
            identifications: identifications,
            manifestLetter: this.manifestLetter(),
            phones: phones,
            emails: mails,
          };
          console.log('info para checkpoint')
          console.log(data)
          const requestCheckpointMant = identificationAndContactToCheckpointMant(data)
          console.log('Llamando Mantenimiento Checkpoint')
          console.log({requestCheckpointMant})
          this.checkpoint.saveSectionMant('identification-contact', requestCheckpointMant).subscribe({
            next: async (i) => {
              console.log(i);

              if (i.status === "FAILED") {
                console.log(i.status)
              } else {
                const getCountry = await firstValueFrom(this.catalogsService.getCountry({ land: [] }));
                const getIdentificationType = await firstValueFrom(this.catalogsService.getIdentificationType({ types: [] }));
                const getPhoneType = await firstValueFrom(this.catalogsService.getPhoneType({ telephoneTypeIds: [] }));
                this.countries.set(getCountry);
                this.phoneTypes.set(getPhoneType);
                this.identifications.set(getIdentificationType);
                const response = await firstValueFrom(this.checkpointService.getMaintenanceSectionByPersonaFisica(['identification-contact']));
                const info = await checkpointMantToIdentificationAndContact(response['checkpoints'][0]['data'], this.phoneTypes(), this.countries(), this.identifications());
                this.pageStorageService.setIdentificationAndContactInfo(info);
                this.initialData = this.pageStorageService.identificationAndContactInfo();
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
    if(allPermises['contact-info']['sections']['phone']['edit']){
      console.log("contact-info sections phone edit")
      if (this.initialData) {
        this.initialData.phones = this.initialData.phones.map(phone => ({
          ...phone,
          isView: true,
        }));
        this.phoneSection.setData(this.initialData.phones);
      }
    }
    if(allPermises['contact-info']['sections']['mail']['edit']){
      console.log("contact-info sections mail edit")
      if (this.initialData) {
        this.initialData.emails = this.initialData.emails.map(emails => ({
          ...emails,
          isView: true,
        }));
        this.mailSection.setData(this.initialData.emails);
      }
    }
  }

  cancel() {
    this.rolePermises = this.configDisabled;
    buttonFunctionEn(['btnEditCI']);
    butonFunctionDis(['btnSaveCI', 'btnCancelCI']);
    this.phoneSection.clear();
    this.mailSection.clear();
    this.identificationSection.clear();
  }


}
