import { Component, inject, signal, ViewChild } from '@angular/core';
import { ClientDataComponent } from '../../sections/client-data/client-data.component';
import { MiscellaneousSectionComponent } from '../../sections/miscellaneous-section/miscellaneous-section.component';
import { AddressSectionComponent } from '../../sections/address-section/address-section.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AutoCertificationSectionComponent } from '../../sections/auto-certification-section/auto-certification-section.component';
import { IdentificationSectionComponent } from '../../sections/identification-section/identification-section.component';
import { MailSectionComponent } from '../../sections/mail-section/mail-section.component';
import { PhoneSectionComponent } from '../../sections/phone-section/phone-section.component';
import { PpeSectionComponent } from '../../sections/ppe-section/ppe-section.component';
import { ModalSearchClientService } from '../../../services/modal-search-client.service';
import { NotificationsService } from '../../../services/notifications.service';
import { Address } from '../../../../onboarding/models/address';
import { Client } from '../../../../onboarding/models/client-data';
import { IdentificationItem } from '../../../../onboarding/models/identification-item';
import { MailItem } from '../../../../onboarding/models/mail-item';
import { MiscellaneousInfo } from '../../../../onboarding/models/miscellaneous-section';
import { PhoneItem } from '../../../../onboarding/models/phone-item';
import { RealOwnerPPE } from '../../../../onboarding/models/real-owner';

import { ERROR_MESSAGES } from '../../../../onboarding/constants/form-messages';
import { ExecutorInfo } from '../../../../onboarding/models/executor';
import { ClientTaxData } from '../../../../onboarding/models/fiscal-self-declaration-data';
import { CustomerInformation } from '../../../models/customer';
import { existingClientToAddress, existingClientToClient, existingClientToDataClient, existingClientToIdentifications, existingClientToMails, existingClientToMisceSection, existingClientToPhones, existingClientToPpe } from '../../../services/mapper-services/third-person-modal-mapper';
import { PhoneType } from '../../../../customer/models/phone-type';
import { Countries } from '../../../../onboarding/models/country';
import { IdentificationType } from '../../../../onboarding/models/identification-type';
import { CatalogsService } from '../../../services/catalogs.service';
import { butonFunctionDis, buttonFunctionEn, formFunctionEn } from '../../../utils/disableOrEnabled';
import { SearchClientFlowService } from '../../../services/search-client-flow.service';
import { CustomerInformationService } from '../../../services/customer.service';
import { firstValueFrom } from 'rxjs';
import { Mantent } from '../../../services/modal-ppe-family.service';

@Component({
  selector: 'app-executor-modal',
  standalone: false,
  templateUrl: './executor-modal.component.html',
  styleUrl: './executor-modal.component.scss'
})
export class ExecutorModalComponent {
  @ViewChild(ClientDataComponent)
  clientDataSection!: ClientDataComponent;

  @ViewChild(MiscellaneousSectionComponent)
  miscellaneousSection!: MiscellaneousSectionComponent;

  @ViewChild(AddressSectionComponent)
  addressSection!: AddressSectionComponent;

  //Autocertification Section
  @ViewChild(AutoCertificationSectionComponent)
  autoCertSection!: AutoCertificationSectionComponent;

  @ViewChild(PpeSectionComponent)
  ppeSection!: PpeSectionComponent;

  @ViewChild(IdentificationSectionComponent)
  identificationSection!: IdentificationSectionComponent;

  @ViewChild(MailSectionComponent)
  mailSection!: MailSectionComponent;

  @ViewChild(PhoneSectionComponent)
  phoneSection!: PhoneSectionComponent;

  private readonly notificationService = inject(NotificationsService);
  private readonly searchClientService = inject(ModalSearchClientService);
  private readonly catalogsService = inject(CatalogsService);
  private readonly searchClientFlowService = inject(SearchClientFlowService);
  private readonly customerInformationService = inject(CustomerInformationService);

  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ExecutorModalComponent>);
  readonly id = crypto.randomUUID()
  executorNumber: number = this.data.executorNumber;
  private readonly fb = inject(FormBuilder);
  disabledML: boolean = false;
  hasClientNumber: boolean = this.data.hasClientNumber;
  dataAutoCertification: ClientTaxData | null = null;
  private receivedFormGroup: FormGroup | undefined;

  ipabEnabled: boolean = false;
  ipabPercentage: number = 0;
  signatureClass = signal(false);

  signatureType: string = '';
  executorAmount: number = 1;
  dataAddress?: Address;
  dataSection: Client | null = null;
  ppeSectionInfo!: RealOwnerPPE;
  isExistingClient = signal(false);
  identificationSaved: IdentificationItem[] = [];
  phoneSaved: PhoneItem[] = [];
  mailSaved: MailItem[] = [];
  misceSection: MiscellaneousInfo | null = null;

  phoneTypes = signal<Array<PhoneType>>([]);
  countries = signal<Array<Countries>>([]);
  identifications = signal<Array<IdentificationType>>([]);

  identificationPermises: any = null;
  phonePermises: any = null;
  mailPermises: any = null;

  disabledAll = {
    "allDisabled": true,
    "fieldsDisabled": [],
    "buttonsDisabled": []
  }

  ppeDisabledPermises: Mantent = {
    isMainten: false,
    allDisabled: false,
    config: {
      showPag: false,
      showEditAction: true,
      showDeleteAction: true,
      showViewAction: false,
      isSelected: false,
      multipleSelection: false,
      idName: 'tr_tempid',
      singleSelection: { show: false, title: '', propertyName: 'customProperty' }
    },
    fieldsDisabled: [],
    fieldsEnabled: [],
    butonsDisabled: []

  }

  form: FormGroup = this.fb.group({
    clientNumber: [''],
    isActiveExecutor: [false]
  });

  ngOnInit() {

    this.signatureType = this.data.signatureType;
    this.executorAmount = this.data.executorAmount;

    if (this.signatureType == 'MANCOMUNADA') {
      this.signatureClass.set(true);
    }

    this.catalogsService.getCountry({ land: [] }).subscribe(c => {
      this.countries.set(c);
    });
    this.catalogsService.getPhoneType({ telephoneTypeIds: [] }).subscribe(c => {
      this.phoneTypes.set(c);
    });
    this.catalogsService.getIdentificationType({ types: [] }).subscribe(c => {
      this.identifications.set(c);
    });

    console.log('initData')
    console.log(this.data)
    console.log(this.data.content);
    if (this.data.content) {
      this.form.patchValue({
        clientNumber: this.data.content.clientNumber,
        isActiveExecutor: this.data.content.isActiveExecutor,
      })
      this.dataAddress = this.data.content.address;
      this.dataSection = this.data.content.dataSection;
      this.misceSection = this.data.content.taxSection;
      this.identificationSaved = this.data.content.identifications;
      this.phoneSaved = this.data.content.phones;
      this.mailSaved = this.data.content.mails;
      this.ppeSectionInfo = this.data.content.ppeInfo;
      this.dataAutoCertification = this.data.content.autoSign;
      this.isExistingClient.set(this.data.content.isExistingClient);

      if (this.data.content.clientNumber && this.data.content.clientNumber != '-') {
        this.form.patchValue({
          clientNumber: this.data.content.clientNumber
        })
      }

      if (!this.dataAutoCertification) {
        this.dataAutoCertification = {
          mexicoResident: false,
          curp: '',
          foreignerWithoutCurp: false,
          rfc: '',
          name: '',
          fiscalRegimeId: 0,
          cfdiUsageId: '',
          taxPostalCode: '',
          nationality: '',
          country: '',
          fiscalResidenceAbroad: false,
          facta: false,
          crs: false,
          fiscalResidences: [
          ],
        };
      }

    } else {
      this.dataAutoCertification = {
        mexicoResident: false,
        curp: '',
        foreignerWithoutCurp: false,
        rfc: '',
        name: '',
        fiscalRegimeId: 0,
        cfdiUsageId: '',
        taxPostalCode: '',
        nationality: '',
        country: '',
        fiscalResidenceAbroad: false,
        facta: false,
        crs: false,
        fiscalResidences: [
        ],
      };
    }
  }

  private readonly mapToAutoCert: Record<string, string> = {
    curp: 'curp',
    foreignerWithoutCurp: 'foreignerWithoutCurp',
    countryOfBirth: 'country',
    nationality: 'nationality'

  };

  ngAfterViewInit() {
    if (this.clientDataSection?.profileForm) {

      for (const [clientData, autoCert] of Object.entries(this.mapToAutoCert)) {
        this.clientDataSection.profileForm.get(clientData)?.valueChanges.subscribe(value => {
          this.autoCertSection.form.patchValue(
            { [autoCert]: value },
            { emitEvent: false }
          );
          console.log(autoCert)
          console.log(value)
          const countryControl = this.autoCertSection.form.get('country');
          const nationalityControl = this.autoCertSection.form.get('nationality');
          if (this.clientDataSection.profileForm.value.foreignerWithoutCurp) {
            countryControl?.enable();
            nationalityControl?.enable();
            this.autoCertSection.foreignerCURP.set(true)
          } else {
            countryControl?.disable();
            nationalityControl?.disable();
            this.autoCertSection.foreignerCURP.set(false)
          }
        });
      }
      this.clientDataSection.profileForm.get("rfc")?.valueChanges.subscribe(value => {
        console.log(this.clientDataSection.profileForm.get("typeIden")?.value)
        if (this.clientDataSection.profileForm.get("typeIden")?.value == "1") {
          this.autoCertSection.form.patchValue({
            rfc: value
          })
        }
      });
    }

    this.disableAll();
    this.disableAllButtons();
    this.identificationPermises = this.disabledAll;
    this.phonePermises = this.disabledAll;
    this.mailPermises = this.disabledAll;
    if (this.data.isMaintenance && this.data.readOnly) {
      this.disabledML = true;
      butonFunctionDis(['validExe', 'cancelValidExe']);
    } else {
      this.form.enable()
      this.clientDataSection.profileForm.enable();
    }

    console.log('cargando secciones iniciales');
    if (this.data.isMaintenance) {
      this.applyMaintenancePermises();
    } else {
      this.applyPermisesSections(this.isExistingClient(), this.data.content)
    }
  }

  disableAll() {
    this.form.disable()
    this.clientDataSection.profileForm.disable();
    this.miscellaneousSection.form.disable();
    this.addressSection.profileForm.disable();
    this.ppeSection.profileForm.disable();
    this.autoCertSection.form.disable();
    this.identificationSection.form.disable();
    this.phoneSection.form.disable();
    this.mailSection.form.disable();
  }

  enableAll() {
    this.form.enable()
    this.clientDataSection.profileForm.enable();
    this.miscellaneousSection.form.enable();
    this.addressSection.profileForm.enable();
    this.addressSection.enableDisableFECityMun(this.addressSection.profileForm.get('country')?.value ?? 'MX');
    this.ppeSection.profileForm.enable();
    this.autoCertSection.form.enable();
    this.identificationSection.form.enable();
    this.phoneSection.form.enable();
    this.mailSection.form.enable();
  }

  disableAllButtons() {
    butonFunctionDis(['registerExecutor', 'addFiscalResidences', 'btnAddFam']);
    this.mailSection.cantSave = true;
    this.identificationSection.cantSave = true;
    this.phoneSection.cantSave = true;
  }

  enableAllButtons() {
    buttonFunctionEn(['registerExecutor', 'addFiscalResidences', 'btnAddFam']);
    this.mailSection.cantSave = false;
    this.identificationSection.cantSave = false;
    this.phoneSection.cantSave = false;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  async saveExecutor() {

    const miscellaneousResponse = this.miscellaneousSection.onSubmit();
    const ppeResponse = this.ppeSection.onSubmit();
    const addressResponse = await this.addressSection.onSubmit()
    const phones = this.phoneSection.phoneList()
    const identifications = this.identificationSection.identificationList()
    const mails = this.mailSection.mailList()
    const autoCertResponse = await this.autoCertSection.onSubmit();
    const hasCelularPhone = phones.some(p => p.phoneTypeId === '1' && p.active);
    const hasMail = mails.length > 0 && mails.some(m => m.active);
    const hastIdentification = identifications.length > 0 && identifications.some(i => i.active);

    const isClienValid = !this.clientDataSection.validadorFormComplet();
    console.log({ autoCertResponse })
    if (miscellaneousResponse && addressResponse && phones && mails && ppeResponse && autoCertResponse && isClienValid) {

      if (hastIdentification) {
        if (((hasCelularPhone || hasMail) && phones.length > 0 
        && phones.some(p => p.active && p.phoneTypeId === "1" && p.phoneNotification) 
        && mails.some(m => m.active && m.mailNotification))) {
          const dataSectionResponse = await this.clientDataSection.submitComplet();
          if (dataSectionResponse) {
            const executorResponse: ExecutorInfo = {
              personId: this.data.personId ?? null,
              executorNumber: this.data.executorNumber,
              clientNumber: this.form.value.clientNumber ?? '',
              executorId: this.data.content?.executorId ?? crypto.randomUUID(),
              isActiveExecutor: this.form.value.isActiveExecutor ?? false,
              dataSection: dataSectionResponse,
              taxSection: miscellaneousResponse ?? undefined,
              address: addressResponse,
              ppeInfo: ppeResponse,
              autoSign: autoCertResponse,
              identifications: identifications.filter(i => i.active),
              phones: phones.filter(p => p.active),
              mails: mails.filter(m => m.active),
              isExistingClient: this.isExistingClient(),
              active: true,
            }
            this.dialogRef.close(executorResponse);
          }
        } else {
          this.notificationService.error(ERROR_MESSAGES.MISSING_CONTACT_INFO_SECTION);
        }
      } else {
        this.notificationService.error(ERROR_MESSAGES.MISSING_IDENTIFICATION);
      }
    }
  }

  onFormGroupReceived(formGroup: FormGroup): void {
    this.receivedFormGroup = formGroup;
  }

  async searchClient() {
    const result = await this.searchClientService.searchClient();
    if (result) {
      const watchList = await this.searchNewClient(result.clientNumber);
      if (watchList) {
        this.applyPermisesSections(true, true);
        this.isExistingClient.set(true);
      }
    }
  }

  cancelValid() {
    this.disableAll();
    this.disableAllButtons()
    this.clientDataSection.profileForm.enable();
    this.form.enable();
    buttonFunctionEn(['validExe', 'cancelValidExe']);
  }

  async valid() {
    const clientToSearch = await this.clientDataSection.submitComplet();
    if (clientToSearch) {
      const homonym = await this.searchClientFlowService.validInHomonyms(clientToSearch)
      let watchList = false;
      if (homonym.numberClient) {
        watchList = await this.searchNewClient(homonym.numberClient);
        this.isExistingClient.set(true);
      } else {
        watchList = await this.searchClientFlowService.validInWatchList(clientToSearch);
        this.isExistingClient.set(false);
      }
      if (watchList) {
        this.applyPermisesSections(this.isExistingClient(), true);
      }
    }
  }

  async searchClientByNumber(event: any) {
    if (!event.target.value || event.target.value === '') {
      return;
    }
    console.log('buscando')
    console.log(event.target.value)
    const watchList = await this.searchNewClient(event.target.value);
    if (watchList) {
      this.applyPermisesSections(true, true);
      this.isExistingClient.set(true);
    }
  }

  async searchNewClient(clientId: number): Promise<boolean> {
    const searchedClient = await firstValueFrom(this.customerInformationService.getCustomerInfo(clientId));
    let wl = false;
    if (searchedClient.initialData) {
      wl = await this.searchClientFlowService.validInWatchList(existingClientToDataClient(searchedClient.initialData));
    }
    wl ? this.mapInfoToForm(searchedClient) : console.log('Falló en WL')
    return wl;
  }

  applyMaintenancePermises() {
    if (this.data.permises && !this.data.readOnly) {
      console.log('iniciando permisos')
      console.log(this.data.permises)
      this.applySectionPermissions('clientDataSection', this.clientDataSection.profileForm);
      this.applySectionPermissions('miscellaneousSection', this.miscellaneousSection.form);
      this.applySectionPermissions('addressSection', this.addressSection.profileForm);
      this.applySectionPermissions('ppeSection', this.ppeSection.profileForm);
      this.addressSection.enableDisableFECityMun(this.dataAddress?.country ?? '');
      this.applySectionPermissions('autoCertSection', this.autoCertSection.form);
      this.applySectionPermissions('identificationSection', this.identificationSection.form);
      this.applySectionPermissions('phoneSection', this.phoneSection.form);
      this.applySectionPermissions('mailSection', this.mailSection.form)

      if (!this.data.permises['main']) {
        this.form.disable()
      }
      if (!this.data.permises['autoCertSection']) {
        butonFunctionDis(['addFiscalResidences']);
      }
      if (!this.data.permises['ppeSection']) {
        butonFunctionDis(['btnAddFam']);
        this.ppeDisabledPermises = {
          isMainten: false,
          allDisabled: false,
          config: {
            showPag: false,
            showEditAction: true,
            showDeleteAction: true,
            showViewAction: false,
            isSelected: false,
            multipleSelection: false,
            idName: 'tr_tempid',
            singleSelection: { show: false, title: '', propertyName: 'customProperty' }
          },
          fieldsDisabled: [],
          fieldsEnabled: [],
          butonsDisabled: []

        }
      }
      if (this.data.permises['identificationSection']) {
        this.identificationPermises = this.data.permises['identificationSection'];
      } else {
        this.identificationPermises = this.disabledAll;
      }
      if (this.data.permises['phoneSection']) {
        this.phonePermises = this.data.permises['phoneSection'];
      } else {
        this.phonePermises = this.disabledAll;
      }
      if (this.data.permises['mailSection']) {
        this.mailPermises = this.data.permises['mailSection'];
      } else {
        this.mailPermises = this.disabledAll;
      }

    } else {
      this.disableAll();
      this.disableAllButtons();
      this.identificationPermises = this.disabledAll;
      this.phonePermises = this.disabledAll;
      this.mailPermises = this.disabledAll;
      this.ppeDisabledPermises = {
        isMainten: false,
        allDisabled: false,
        config: {
          showPag: false,
          showEditAction: true,
          showDeleteAction: true,
          showViewAction: false,
          isSelected: false,
          multipleSelection: false,
          idName: 'tr_tempid',
          singleSelection: { show: false, title: '', propertyName: 'customProperty' }
        },
        fieldsDisabled: [],
        fieldsEnabled: [],
        butonsDisabled: []
      }
    }
  }

  applyPermisesSections(isExistingClient: boolean, haveData: boolean) {

    if (haveData) {
      if (isExistingClient) {
        console.log('El cliente es existente');
        formFunctionEn(this.miscellaneousSection.form, ['relationship']);
        this.addressSection.profileForm.disable();
        this.ppeSection.profileForm.disable();
        this.autoCertSection.form.disable();
        this.identificationSection.form.enable();
        this.phoneSection.form.enable();
        this.mailSection.form.enable();
      } else {
        console.log('El cliente no existe');
        this.enableAll()
      }
      this.enableAllButtons()
      this.identificationPermises = null;
      this.phonePermises = null;
      this.mailPermises = null;
      this.clientDataSection.profileForm.disable();
      this.form.disable();
      butonFunctionDis(['validExe']);
    } else {
      console.log('Primera vez del modal')
      this.disableAll()
      this.disableAllButtons()
      this.identificationPermises = this.disabledAll;
      this.phonePermises = this.disabledAll;
      this.mailPermises = this.disabledAll;
      this.clientDataSection.profileForm.enable();
      this.form.enable();
    }
  }

  mapInfoToForm(searchedClient: CustomerInformation) {
    console.log('cargando info')

    if (searchedClient?.initialData) {
      this.dataSection = existingClientToClient(searchedClient?.initialData, searchedClient?.generalInformation)
      this.clientDataSection.data = this.dataSection;
      this.clientDataSection.ngOnInit();
    }

    if (searchedClient?.generalInformation) {
        this.misceSection = existingClientToMisceSection(searchedClient?.generalInformation, searchedClient?.fiscalResidences);
        this.miscellaneousSection.chargeInitialData(this.misceSection);
    }

    if (searchedClient?.addresses) {
      this.dataAddress = existingClientToAddress(searchedClient?.addresses)
      this.addressSection.dataAddress = this.dataAddress;
      this.addressSection.ngOnInit();
    }

    if (searchedClient?.identifications) {
      this.identificationSaved = existingClientToIdentifications(searchedClient?.identifications, this.identifications(), this.countries())
      this.identificationSection.identificationList.set(this.identificationSaved)
    }

    if (searchedClient?.ppeInformation) {
      this.ppeSectionInfo = existingClientToPpe(searchedClient?.ppeInformation)
      this.ppeSection.dataPPE = this.ppeSectionInfo;
      this.ppeSection.ngOnInit();
    }

    if (searchedClient?.emails) {
      this.mailSaved = existingClientToMails(searchedClient?.emails)
      this.mailSection.mailList.set(this.mailSaved)
    }

    if (searchedClient?.telephones) {
      this.phoneSaved = existingClientToPhones(searchedClient?.telephones, this.phoneTypes(), this.countries())
      this.phoneSection.phoneList.set(this.phoneSaved)
    }

    //TODO mapear lo que haya que aplicar
    //this.dataAutoCertification = this.data.content.autoSign;
  }

  applySectionPermissions(sectionName: string, form: FormGroup) {
    const section = this.data.permises[sectionName];
    form.disable();
    if (!section) return;
    if (!section.allDisabled && ((section.fieldsEnabled?.length ?? 0) == 0)) {
      form.enable();
      return;
    }

    section.fieldsEnabled?.forEach((field: string) => {
      if (form.get(field)) {
        form.get(field)?.enable();
      }
    });
  }
}
