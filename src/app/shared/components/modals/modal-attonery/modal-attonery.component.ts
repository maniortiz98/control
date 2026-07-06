import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationsService } from '../../../services/notifications.service';
import { PhoneItem } from '../../../../onboarding/models/phone-item';
import { MailItem } from '../../../../onboarding/models/mail-item';
import { MiscellaneousInfo } from '../../../../onboarding/models/miscellaneous-section';
import { Client } from '../../../../onboarding/models/client-data';
import { Address } from '../../../../onboarding/models/address';
import { ERROR_MESSAGES, NOTIFICATION_MESSAGES } from '../../../../onboarding/constants/form-messages';
import { ClientDataComponent } from '../../sections/client-data/client-data.component';
import { MiscellaneousSectionComponent } from '../../sections/miscellaneous-section/miscellaneous-section.component';
import { AddressSectionComponent } from '../../sections/address-section/address-section.component';
import { MailSectionComponent } from '../../sections/mail-section/mail-section.component';
import { PhoneSectionComponent } from '../../sections/phone-section/phone-section.component';
import { AttoneryInfo } from '../../../../onboarding/models/attonery';
import { IdentificationItem } from '../../../../onboarding/models/identification-item';
import { LegalPowerSectionComponent } from '../../sections/legal-power-section/legal-power-section.component';
import { LegalPowerInfo } from '../../../../onboarding/models/legal-power-section';
import { IdentificationSectionComponent } from '../../sections/identification-section/identification-section.component';
import { PpeSectionComponent } from '../../sections/ppe-section/ppe-section.component';
import { RealOwnerPPE } from '../../../../onboarding/models/real-owner';
import { butonFunctionDis, buttonFunctionEn, formFunctionDisMatch, formFunctionEn } from '../../../utils/disableOrEnabled';
import { ModalSearchClientService } from '../../../services/modal-search-client.service';
import { AddressesService } from '../../../services/storage-services/addresses.service';
import { CatalogsService } from '../../../services/catalogs.service';
import { PhoneType } from '../../../../onboarding/models/phone-type';
import { Countries } from '../../../../onboarding/models/country';
import { IdentificationType } from '../../../../onboarding/models/identification-type';
import { firstValueFrom } from 'rxjs';
import { SearchClientFlowService } from '../../../services/search-client-flow.service';
import { CustomerInformationService } from '../../../services/customer.service';
import { CustomerInformation } from '../../../models/customer';
import { existingClientToAddress, existingClientToClient, existingClientToDataClient, existingClientToIdentifications, existingClientToMails, existingClientToMisceSection, existingClientToPhones, existingClientToPpe } from '../../../services/mapper-services/third-person-modal-mapper';
import { Mantent } from '../../../services/modal-ppe-family.service';

@Component({
  selector: 'app-modal-attonery',
  standalone: false,
  templateUrl: './modal-attonery.component.html',
  styleUrl: './modal-attonery.component.scss'
})
export class ModalAttoneryComponent implements OnInit {

  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ModalAttoneryComponent>);
  private readonly searchClientService = inject(ModalSearchClientService);
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationsService);
  private readonly addressStorage = inject(AddressesService);
  private readonly catalogsService = inject(CatalogsService);
  private readonly searchClientFlowService = inject(SearchClientFlowService);
  private readonly customerInformationService = inject(CustomerInformationService);

  isExistingClient = signal(false);
  clientNumber: number = 0;

  @ViewChild(ClientDataComponent)
  clientDataSection!: ClientDataComponent;

  @ViewChild(MiscellaneousSectionComponent)
  miscellaneousSection!: MiscellaneousSectionComponent;

  @ViewChild(AddressSectionComponent)
  addressSection!: AddressSectionComponent;

  @ViewChild(PpeSectionComponent)
  ppeSection!: PpeSectionComponent;

  @ViewChild(IdentificationSectionComponent)
  identificationSection!: IdentificationSectionComponent;

  @ViewChild(MailSectionComponent)
  mailSection!: MailSectionComponent;

  @ViewChild(PhoneSectionComponent)
  phoneSection!: PhoneSectionComponent;

  @ViewChild(LegalPowerSectionComponent)
  legalPowerSection!: LegalPowerSectionComponent;

  attoneryNumber: number = this.data.attoneryNumber;
  albacea: boolean = false; //cambiar a parametro de entrada
  hasClientNumber: boolean = false; //cambiar a parametro de entrada
  signatureType: string = '';
  dataAddress?: Address;
  manifestLetter = signal(false);
  preFillAddress = signal(false);

  identificationSaved: IdentificationItem[] = [];
  phoneSaved: PhoneItem[] = [];
  mailSaved: MailItem[] = [];
  misceSection: MiscellaneousInfo | null = null;
  dataSection: Client | null = null;
  legalPowerSaved: LegalPowerInfo | null = null;
  ppeSectionInfo!: RealOwnerPPE;
  disabledML: boolean = false;
  capturedAddress: Address | null = null;

  phoneTypes = signal<Array<PhoneType>>([]);
  countries = signal<Array<Countries>>([]);
  identifications = signal<Array<IdentificationType>>([]);

  identificationPermises: any = null;
  phonePermises: any = null;
  mailPermises: any = null;

  buttonAddress: boolean = false;

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

  ipabEnabled: boolean = false;
  ipabPercentage: number = 0;
  signatureClass = signal(false);

  form: FormGroup = this.fb.group({
    clientNumber: [''],
  });

  ngOnInit() {
    console.log('initData')
    console.log(this.data)
    console.log(this.data.content);

    this.catalogsService.getCountry({ land: [] }).subscribe(c => {
      this.countries.set(c);
    });

    this.catalogsService.getPhoneType({ telephoneTypeIds: [] }).subscribe(c => {
      this.phoneTypes.set(c);
    });

    this.catalogsService.getIdentificationType({ types: [] }).subscribe(c => {
      this.identifications.set(c);
    });

    if (this.data.content) {
      this.dataAddress = this.data.content.address;
      this.dataSection = this.data.content.dataSection;
      this.misceSection = this.data.content.taxSection;
      this.ppeSectionInfo = this.data.content.ppeInfo;
      this.identificationSaved = this.data.content.identifications;
      this.phoneSaved = this.data.content.phones;
      this.mailSaved = this.data.content.mails;
      this.legalPowerSaved = this.data.content.legalPowerSection;
    }
    if (this.data.content?.clientNumber && this.data.content?.clientNumber != '-') {
      this.form.patchValue({
        clientNumber: this.data.content.clientNumber
      })
    }
    this.clientNumber=Number(this.data?.content?.customerNumber ?? 0)
    this.signatureType = this.data.signatureType;
    if (this.signatureType == 'MANCOMUNADA') {
      this.signatureClass.set(true);
    }
    this.manifestLetter.set(this.data.content?.manifestLetter ?? false)
    this.preFillAddress.set(this.data.content?.preFillAddress ?? false)
    console.log('address pre fill')
    console.log(this.addressStorage.get())
    this.capturedAddress = this.addressStorage.get()?.addressList.filter(re => re.addressRole === '5')[0] ?? null;
    console.log(this.capturedAddress)
  }

  ngAfterViewInit() {
    this.disableAll();
    this.disableAllButtons();
    this.identificationPermises = this.disabledAll;
    this.phonePermises = this.disabledAll;
    this.mailPermises = this.disabledAll;
    this.buttonAddress = true;

    if (this.data.isMaintenance && this.data.readOnly) {
      this.disabledML = true;
      butonFunctionDis(['validAtto', 'cancelValidAtto']);
    } else {
      this.form.enable()
      this.clientDataSection.profileForm.enable();
    }

    if (this.data.isMaintenance) {
      this.applyMaintenancePermises()
    }else {
      this.applyPermisesSections(this.isExistingClient(), this.data.content)
    }

  }

  disableAll() {
    this.form.disable()
    this.clientDataSection.profileForm.disable();
    this.miscellaneousSection.form.disable();
    this.addressSection.profileForm.disable();
    this.ppeSection.profileForm.disable();
    this.identificationSection.form.disable();
    this.phoneSection.form.disable();
    this.mailSection.form.disable();
    this.legalPowerSection.form.disable();
  }

  enableAll() {
    this.form.enable()
    this.clientDataSection.profileForm.enable();
    this.miscellaneousSection.form.enable();
    this.buttonAddress = false;
    this.addressSection.profileForm.enable();
    this.addressSection.enableDisableFECityMun(this.addressSection.profileForm.get('country')?.value ?? 'MX');
    this.ppeSection.profileForm.enable();
    this.identificationSection.form.enable();
    this.phoneSection.form.enable();
    this.mailSection.form.enable();
    this.legalPowerSection.form.enable();
  }

  disableAllButtons() {
    butonFunctionDis(['saveAttonery']);
    this.mailSection.cantSave = true;
    this.identificationSection.cantSave = true;
    this.phoneSection.cantSave = true;
    this.buttonAddress = true;
  }

  enableAllButtons() {
    buttonFunctionEn(['saveAttonery', 'serachCln']);
    this.mailSection.cantSave = false;
    this.identificationSection.cantSave = false;
    this.phoneSection.cantSave = false;
  }


  applySectionPermissions(sectionName: string, form: FormGroup) {
    const section = this.data.permises[sectionName];
    form.disable();
    if (!section) return;
    if (!section.allDisabled && ((section.fieldsEnabled?.length ?? 0) == 0)){
      form.enable();
      return;
    }
    section.fieldsEnabled?.forEach((field: string) => {
      if (form.get(field)) {
        form.get(field)?.enable();
      }
    });
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

    if (identifications.filter(p => p.active).length === 0) {
      return true;
    }

    if (identifications.some(p => p.identificationType === 'CREDENCIAL PARA VOTAR' && p.active)) {
      return true;
    }

    if (identifications.filter(p => p.active).length < 2) {
      return true;
    }

    return false;
  }

  async saveAttonery() {

    const miscellaneousResponse = this.miscellaneousSection.onSubmit();
    const addressResponse = await this.addressSection.onSubmit()
    const phones = this.phoneSection.phoneList()
    const identifications = this.identificationSection.identificationList()
    const mails = this.mailSection.mailList()
    const legalpowers = this.legalPowerSection.onSubmit();
    const ppeResponse = this.ppeSection.onSubmit();
    const isClienValid = !this.clientDataSection.validadorFormComplet();
    console.log(miscellaneousResponse)
    console.log(addressResponse)
    console.log(phones)
    console.log(mails)
    console.log(legalpowers)
    console.log(ppeResponse)

    const hasCelularPhone = phones.some(p => p.phoneTypeId === '1' && p.active);
    const hasMail = mails.length > 0 && mails.some(m => m.active);
    const hastIdentification = identifications.length > 0 && identifications.some( i=> i.active );


    if (miscellaneousResponse && addressResponse && phones && mails && legalpowers && isClienValid) {
      if(hastIdentification){
        if (((hasCelularPhone || hasMail) && phones.length > 0 
        && phones.some(p => p.active && p.phoneTypeId === "1" && p.phoneNotification) 
        && mails.some(m => m.active && m.mailNotification)) || this.manifestLetter()) {
          const dataSectionResponse = await this.clientDataSection.submitComplet();
          console.log(dataSectionResponse)
          if (dataSectionResponse) {
            if(this.isExistingClient() && this.clientNumber != 0){
              const cotitularResponse: AttoneryInfo = {
              customerNumber: this.clientNumber,
              clientNumber: this.clientNumber.toString(),
              attoneryNumber: this.data.attoneryNumber,
              attoneryId: this.data.content?.attoneryId ?? crypto.randomUUID(),
              dataSection: dataSectionResponse,
              taxSection: miscellaneousResponse,
              address: addressResponse,
              ppeInfo: ppeResponse,
              identifications: identifications.filter(i => i.active),
              manifestLetter: this.manifestLetter(),
              phones: phones.filter(p => p.active),
              mails: mails.filter(m => m.active),
              legalPowerSection: legalpowers,
              legalProxyId: this.data.content?.legalProxyId,
              personId: this.data.content?.personId,
              active: this.data.content?.active ?? true,
              preFillAdress: this.preFillAddress()
              }
              this.dialogRef.close(cotitularResponse);
            } else {
              const cotitularResponse: AttoneryInfo = {
              clientNumber: this.form.value.clientNumber,
              attoneryNumber: this.data.attoneryNumber,
              attoneryId: this.data.content?.attoneryId ?? crypto.randomUUID(),
              dataSection: dataSectionResponse,
              taxSection: miscellaneousResponse,
              address: addressResponse,
              ppeInfo: ppeResponse,
              identifications: identifications.filter(i => i.active),
              manifestLetter: this.manifestLetter(),
              phones: phones.filter(p => p.active),
              mails: mails.filter(m => m.active),
              legalPowerSection: legalpowers,
              legalProxyId: this.data.content?.legalProxyId,
              personId: this.data.content?.personId,
              active: this.data.content?.active ?? true,
              preFillAdress: this.preFillAddress()
              }
              this.dialogRef.close(cotitularResponse);
            }
          }
        } else {
          this.notificationService.error(ERROR_MESSAGES.MISSING_CONTACT_INFO_SECTION);
        }
      }else {
        this.notificationService.error(ERROR_MESSAGES.MISSING_IDENTIFICATION);
      }

    }
  }

  cancel(): void {
    this.dialogRef.close();
  }



  async searchClientByNumber(event: any) {
    if(!event.target.value || event.target.value === ''){
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
    this.form.enable();
    this.clientNumber = 0;
    buttonFunctionEn(['validAtto', 'cancelValidAtto', 'serachCln']);
    this.clientDataSection.enableForm();
  }

  async valid() {
    const clientToSearch = await this.clientDataSection.submitComplet();
    const isThirdRelated = true;
    if (clientToSearch) {
      const homonym = await this.searchClientFlowService.validInHomonyms(clientToSearch, isThirdRelated);
      if(!homonym.numberClient && this.data.isMaintenance){ 
        this.cancelValid();
        return;
      }
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

    async searchNewClient(clientId: number): Promise<boolean> {
      const searchedClient = await firstValueFrom(this.customerInformationService.getCustomerInfo(clientId));
      let wl = false;
      if(searchedClient.initialData){
         wl = await this.searchClientFlowService.validInWatchList(existingClientToDataClient(searchedClient.initialData), clientId.toString());
      }
      wl ? this.mapInfoToForm(searchedClient) : console.log('Falló en WL')
      this.clientNumber = clientId;
      return wl;
    }

  applyMaintenancePermises() {

    if (!this.data.content) {
      this.cancelValid();
      return;
    }

    if (this.data.permises && !this.data.readOnly) {
      console.log(this.data.permises)
      this.buttonAddress = false;
      if(this.data.content){
        buttonFunctionEn(['saveAttonery']);
      }
      this.applySectionPermissions('clientDataSection', this.clientDataSection.profileForm);
      if(this.data?.content?.dataSection?.foreignerWithoutCurp === true){
        formFunctionDisMatch(this.clientDataSection.profileForm, ['curp']);
      }
      this.applySectionPermissions('miscellaneousSection', this.miscellaneousSection.form);
      this.applySectionPermissions('addressSection', this.addressSection.profileForm);
      this.addressSection.enableDisableFECityMun(this.dataAddress?.country ?? '');
      this.applySectionPermissions('ppeSection', this.ppeSection.profileForm);
      this.applySectionPermissions('legalPowerSection', this.legalPowerSection.form);
      this.applySectionPermissions('identificationSection', this.identificationSection.form);
      this.applySectionPermissions('phoneSection', this.phoneSection.form);
      this.applySectionPermissions('mailSection', this.mailSection.form)

      if (!this.data.permises['main']) {
        this.form.disable()
      }
      if (this.data.permises['ppeSection']) {
        // butonFunctionDis(['btnAddFam']);
        this.ppeDisabledPermises = {
          isMainten: true,
          allDisabled: this.data.permises['ppeSection'].allDisabled,
          config: {
            showPag: false,
            showEditAction: true,
            showDeleteAction: false,
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
      if (this.data.permises['identificationSection']['buttonsEnabled']?.length ?? 0 != 0) {
        this.disabledML = false;
      }else {
        this.disabledML = true;
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
      this.clientDataSection.profileForm.disable();
      this.form.get('clientNumber')?.disable();

    } else {
      this.buttonAddress = true;
      this.disableAll();
      this.disableAllButtons();
      butonFunctionDis(['serachCln']);
      this.disabledML = true;
      this.identificationPermises = this.disabledAll;
      this.phonePermises = this.disabledAll;
      this.mailPermises = this.disabledAll;
      this.ppeDisabledPermises = {
        isMainten: true,
        allDisabled: true,
        config: {
          showPag: false,
          showEditAction: true,
          showDeleteAction: false,
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

  applyPermisesSections(isExistingClient: boolean, haveData: boolean) {

    if (haveData) {
      if (isExistingClient) {
        console.log('El cliente es existente')
        this.identificationSection.form.enable();
        this.miscellaneousSection.form.enable();
        this.addressSection.profileForm.enable();
        this.addressSection.enableDisableFECityMun(this.dataAddress?.country ?? '');
        this.ppeSection.profileForm.enable();
        this.phoneSection.form.enable();
        this.mailSection.form.enable();
        this.legalPowerSection.form.enable();
        this.buttonAddress = false;
      } else {
        console.log('El cliente no existe')
        this.enableAll()
      }
      this.enableAllButtons()
      this.identificationPermises = null;
      this.phonePermises = null;
      this.mailPermises = null;
      this.clientDataSection.profileForm.disable();
      this.form.disable();
      butonFunctionDis(['validAtto']);
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

  onTogglePreFill(event: MouseEvent) {
    const nextValue = !this.preFillAddress();
    if (nextValue && !this.capturedAddress) {
      event.preventDefault();
      event.stopPropagation();
      this.notificationService.error(ERROR_MESSAGES.NO_ADDRESS_REGISTERED);
      return;
    }

    this.preFillAddress.set(nextValue);

    if (nextValue) {
      this.dataAddress = this.capturedAddress!;
      this.addressSection.setAddresData(this.capturedAddress!);
    } else {
      this.addressSection.profileForm.reset();
      this.dataAddress = undefined;
    }
  }
}
 