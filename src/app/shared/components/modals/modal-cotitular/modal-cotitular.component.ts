import { AfterViewInit, Component, forwardRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MailSectionComponent } from '../../sections/mail-section/mail-section.component';
import { PhoneSectionComponent } from '../../sections/phone-section/phone-section.component';
import { AddressSectionComponent } from '../../sections/address-section/address-section.component';
import { ClientDataComponent } from '../../sections/client-data/client-data.component';
import { MiscellaneousSectionComponent } from '../../sections/miscellaneous-section/miscellaneous-section.component';
import { ERROR_MESSAGES, NOTIFICATION_MESSAGES } from '../../../../onboarding/constants/form-messages';
import { NotificationsService } from '../../../services/notifications.service';
import { CotitularInfo } from '../../../../onboarding/models/cotitular';
import { MiscellaneousInfo } from '../../../../onboarding/models/miscellaneous-section';
import { Address } from '../../../../onboarding/models/address';
import { PhoneItem } from '../../../../onboarding/models/phone-item';
import { MailItem } from '../../../../onboarding/models/mail-item';
import { IdentificationItem } from '../../../../onboarding/models/identification-item';
import { Client } from '../../../../onboarding/models/client-data';
import { IdentificationSectionComponent } from '../../sections/identification-section/identification-section.component';
import { PpeSectionComponent } from '../../sections/ppe-section/ppe-section.component';
import { RealOwnerPPE } from '../../../../onboarding/models/real-owner';
import { ModalSearchClientService } from '../../../services/modal-search-client.service';
import { AutoCertificationSectionComponent } from '../../sections/auto-certification-section/auto-certification-section.component';
import { butonFunctionDis, buttonFunctionEn, formFunctionDisMatch, formFunctionEn, formFunctionEnAll } from '../../../utils/disableOrEnabled';
import { ClientTaxData } from '../../../../onboarding/models/fiscal-self-declaration-data';
import { firstValueFrom } from 'rxjs';
import { SearchClientFlowService } from '../../../services/search-client-flow.service';
import { CustomerInformationService } from '../../../services/customer.service';
import { existingClientToAddress, existingClientToClient, existingClientToDataClient, existingClientToIdentifications, existingClientToMails, existingClientToMisceSection, existingClientToPhones, existingClientToPpe } from '../../../services/mapper-services/third-person-modal-mapper';
import { PhoneType } from '../../../../onboarding/models/phone-type';
import { Countries } from '../../../../onboarding/models/country';
import { IdentificationType } from '../../../../onboarding/models/identification-type';
import { CatalogsService } from '../../../services/catalogs.service';
import { CustomerInformation } from '../../../models/customer';
import { Mantent } from '../../../services/modal-ppe-family.service';
import { STRINGS } from '../../../../onboarding/constants/constants';


@Component({
  selector: 'app-modal-cotitular',
  standalone: false,
  templateUrl: './modal-cotitular.component.html',
  styleUrl: './modal-cotitular.component.scss'
})
export class ModalCotitularComponent implements OnInit, AfterViewInit {

  @ViewChild(forwardRef(() => ClientDataComponent))
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
  private readonly searchClientFlowService = inject(SearchClientFlowService);
  private readonly customerInformationService = inject(CustomerInformationService);
  private readonly catalogsService = inject(CatalogsService);

  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ModalCotitularComponent>);
  readonly id = crypto.randomUUID()
  cotitularNumber: number = this.data.cotitularNumber;
  private readonly fb = inject(FormBuilder);
  hasClientNumber: boolean = this.data.hasClientNumber;
  isExistingClient = signal(false);
  clientNumber: number = 0;

  ipabEnabled: boolean = false;
  ipabPercentage: number = 0;
  signatureClass = signal(false);

  signatureType: string = '';
  cotitularAmount: number = 1;
  dataAddress?: Address;
  dataSection: Client | null = null;
  ppeSectionInfo!: RealOwnerPPE;

  phoneTypes = signal<Array<PhoneType>>([]);
  countries = signal<Array<Countries>>([]);
  identifications = signal<Array<IdentificationType>>([]);

  manifestLetter = signal(false);
  identificationSaved: IdentificationItem[] = [];
  phoneSaved: PhoneItem[] = [];
  mailSaved: MailItem[] = [];
  misceSection: MiscellaneousInfo | null = null;
  disabledML: boolean = false;
  disabledMantML: boolean = false;
  dataAutoCertification: ClientTaxData | null = null;
  private receivedFormGroup: FormGroup | undefined;
  identificationPermises: any = null;
  phonePermises: any = null;
  mailPermises: any = null;

  disabledAll = {
    "allDisabled": true,
    "fieldsDisabled": [],
    "buttonsDisabled": []
  }

  actionsActiveMant = {
        mant: false,
        active: false,
        buttons: {
          edit: true,
          delete: true,
          read: true,
          add: true
        }
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
  });

  ngOnInit() {
    this.signatureType = this.data.signatureType;
    this.cotitularAmount = this.data.cotitularAmount;

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

    if (this.data.isMaintenance && this.data.readOnly) {
      this.actionsActiveMant = {
          mant: true,
          active: false,
          buttons: {
            edit: false,
            delete: false,
            read: true,
            add: false
          }
        }
    }

    if (this.data.permises && !this.data.readOnly) {
      if (this.data.permises['autoCertSection']) {
        buttonFunctionEn(this.data.permises['autoCertSection']['buttonsEnabled']);
        this.actionsActiveMant = {
          mant: true,
          active: true,
          buttons: {
            edit: true,
            delete: true,
            read: true,
            add: true
          }
        }
      }
    }

    console.log('initData')
    console.log(this.data)
    console.log(this.data.content);
    if (this.data.content) {
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
      this.clientNumber=Number(this.data.content.customerNumber ?? 0)
      this.manifestLetter.set(this.data.content?.manifestLetter ?? false)

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
      butonFunctionDis(['validCotitular', 'cancelValid']);
    } else {
      this.form.enable()
      this.clientDataSection.profileForm.enable();
    }

    console.log('cargando secciones iniciales');
    if (this.data.isMaintenance) {
      this.applyMaintenancePermises();
      console.log(this.ppeDisabledPermises);
    } else {
      console.log('aplicando permisos')
      this.applyPermisesSections(this.isExistingClient(), this.data.content?.dataSection)
    }
  }


  onFormGroupReceived(formGroup: FormGroup): void {
    this.receivedFormGroup = formGroup;
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
  }

  enableAll() {
    this.form.enable()
    this.clientDataSection.profileForm.enable();
    this.miscellaneousSection.form.enable();
    this.addressSection.profileForm.enable();
    this.addressSection.enableDisableFECityMun(this.addressSection.profileForm.get('country')?.value ?? 'MX');
    this.ppeSection.profileForm.enable();
    this.identificationSection.form.enable();
    this.phoneSection.form.enable();
    this.mailSection.form.enable();
  }

  disableAllButtons() {
    butonFunctionDis(['saveCotitular', 'addFiscalResidences']);
    this.mailSection.cantSave = true;
    this.identificationSection.cantSave = true;
    this.phoneSection.cantSave = true;
  }

  enableAllButtons() {
    buttonFunctionEn(['saveCotitular', 'addFiscalResidences', 'serachCln']);
    this.mailSection.cantSave = false;
    this.identificationSection.cantSave = false;
    this.phoneSection.cantSave = false;
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
      this.disabledML = true;
      return true;
    }
    if (identifications.some(p => p.identificationType === 'CREDENCIAL PARA VOTAR' && p.active)) {
      this.disabledML = true;
      return true;
    }
    if (identifications.filter(p => p.active).length < 2) {
      this.disabledML = true;
      return true;
    }
    this.disabledML = false;
    return false;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  async saveCotitular() {

    const miscellaneousResponse = this.miscellaneousSection.onSubmit();
    const ppeResponse = this.ppeSection.onSubmit();
    const addressResponse = await this.addressSection.onSubmit()
    const phones = this.phoneSection.phoneList()
    const identifications = this.identificationSection.identificationList()
    const mails = this.mailSection.mailList()
    const autoCertResponse = await this.autoCertSection.onSubmit();
    console.log({ autoCertResponse })

    const hasCelularPhone = phones.some(p => p.phoneTypeId === '1' && p.active);
    const hasMail = mails.length > 0 && mails.some(m => m.active);
    const hastIdentification = identifications.length > 0 && identifications.some(i => i.active);
    const isClienValid = !this.clientDataSection.validadorFormComplet();

    console.log({ isClienValid })
    if (miscellaneousResponse && addressResponse && phones && mails && ppeResponse && autoCertResponse && isClienValid) {

      if (hastIdentification) {
        if (((hasCelularPhone || hasMail) && phones.length > 0
        && phones.some(p => p.active && p.phoneTypeId === "1" && p.phoneNotification)
        && mails.some(m => m.active && m.mailNotification)) || this.manifestLetter()) {
          const dataSectionResponse = await this.clientDataSection.submitComplet();

          if (dataSectionResponse) {
            console.log('Data section response')
            console.log(dataSectionResponse)
            if(this.isExistingClient() && this.clientNumber != 0){
              const cotitularResponse: CotitularInfo = {
              coHolderId: this.data.content?.coHolderId,
              customerNumber: this.clientNumber,
              personId: this.data.content?.personId,
              active: this.data.content?.active ?? true,
              cotitularNumber: this.data.cotitularNumber,
              cotitularId: this.data.content?.cotitularId ?? crypto.randomUUID(),
              clientNumber: this.clientNumber.toString(),
              dataSection: dataSectionResponse,
              taxSection: miscellaneousResponse,
              address: addressResponse,
              ppeInfo: ppeResponse,
              autoSign: autoCertResponse,
              identifications: identifications.filter(i => i.active),
              manifestLetter: this.manifestLetter(),
              phones: phones.filter(p => p.active),
              mails: mails.filter(m => m.active),
              isExistingClient: this.isExistingClient(),
              }
              this.dialogRef.close(cotitularResponse);
            }else{
              const cotitularResponse: CotitularInfo = {
              coHolderId: this.data.content?.coHolderId,
              personId: this.data.content?.personId,
              active: this.data.content?.active ?? true,
              cotitularNumber: this.data.cotitularNumber,
              cotitularId: this.data.content?.cotitularId ?? crypto.randomUUID(),
              clientNumber: this.form.value.clientNumber,
              dataSection: dataSectionResponse,
              taxSection: miscellaneousResponse,
              address: addressResponse,
              ppeInfo: ppeResponse,
              autoSign: autoCertResponse,
              identifications: identifications.filter(i => i.active),
              manifestLetter: this.manifestLetter(),
              phones: phones.filter(p => p.active),
              mails: mails.filter(m => m.active),
              isExistingClient: this.isExistingClient(),
              }
              this.dialogRef.close(cotitularResponse);
            }
          }
        } else {
          this.notificationService.error(ERROR_MESSAGES.MISSING_CONTACT_INFO_SECTION);
        }
      } else {
        this.notificationService.error(ERROR_MESSAGES.MISSING_IDENTIFICATION);
      }

    }
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
    this.disableAllButtons();
    this.form.enable();
    this.clientNumber = 0;
    buttonFunctionEn(['validCotitular', 'cancelValid', 'serachCln']);
    this.clientDataSection.enableForm();
  }

  async valid() {
    const clientToSearch = await this.clientDataSection.submitComplet();
    const isThirdRelated = true;
    if (clientToSearch) {
      const homonym = await this.searchClientFlowService.validInHomonyms(clientToSearch,isThirdRelated);
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

  applyPermisesSections(isExistingClient: boolean, haveData: boolean) {

    if (haveData) {

      if (isExistingClient) {
        console.log('El cliente es existente')
        this.miscellaneousSection.form.enable();
        formFunctionEnAll(this.autoCertSection.form, ['fatca',
                            'crs',]);
        this.addressSection.profileForm.enable();
        this.addressSection.enableDisableFECityMun(this.dataAddress?.country ?? '');
        this.ppeSection.profileForm.enable();
        this.identificationSection.form.enable();
        this.phoneSection.form.enable();
        this.mailSection.form.enable();
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
      butonFunctionDis(['validCotitular']);
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

  applyMaintenancePermises() {

    if (!this.data.content) {
      this.cancelValid();
      return;
    }
    
    console.log(this.data.readOnly)
    if (this.data.permises && !this.data.readOnly) {
      console.log('iniciando permisos')
      console.log(this.data.permises)
      if(this.data.content){
        buttonFunctionEn(['saveCotitular']);
      }
      this.applySectionPermissions('clientDataSection', this.clientDataSection.profileForm);
      if(this.data?.content?.dataSection?.foreignerWithoutCurp === true){
        formFunctionDisMatch(this.clientDataSection.profileForm, ['curp']);
      }
      this.applySectionPermissions('miscellaneousSection', this.miscellaneousSection.form);
      this.applySectionPermissions('addressSection', this.addressSection.profileForm);
      this.addressSection.enableDisableFECityMun(this.dataAddress?.country ?? '');
      this.applySectionPermissions('ppeSection', this.ppeSection.profileForm);
      if (!this.data.permises['autoCertSection']) {
        butonFunctionDis(['addFiscalResidences']);
      } else {
        buttonFunctionEn(this.data.permises['autoCertSection']['buttonsEnabled']);
      }
      this.applySectionPermissions('identificationSection', this.identificationSection.form);
      this.applySectionPermissions('phoneSection', this.phoneSection.form);
      this.applySectionPermissions('mailSection', this.mailSection.form)

      if (!this.data.permises['main']) {
        this.form.disable()
      }
      if (!this.data.permises['autoCertSection']) {
        butonFunctionDis(['addFiscalResidences']);
      }else{
        buttonFunctionEn(this.data.permises['autoCertSection']['buttonsEnabled']);
        this.applySectionPermissions('autoCertSection', this.autoCertSection.form)
        this.actionsActiveMant = {
          mant: true,
          active: true,
          buttons: {
            edit: true,
            delete: true,
            read: true,
            add: true
          }
        }
        if(this.dataAutoCertification?.rfc && this.dataAutoCertification?.rfc.length === 10){
          formFunctionDisMatch(this.autoCertSection.form, ['name',
                                                          'fiscalRegimeId',
                                                          'cfdiUse',
                                                          'taxPostalCode']);
        }

      }
      if (this.data.permises['ppeSection']) {
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
        this.disabledMantML = false;
      }else {
        this.disabledMantML = true;
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
      this.disableAll();
      this.disableAllButtons();
      butonFunctionDis(['serachCln']);
      this.actionsActiveMant = {
        mant: true,
        active: false,
          buttons: {
            edit: false,
            delete: false,
            read: true,
            add: false
          }
        }
      this.identificationPermises = this.disabledAll;
      this.phonePermises = this.disabledAll;
      this.mailPermises = this.disabledAll;
      // butonFunctionDis(['btnAddFam']);
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

  getAutoCertPermissions() {
    if(this.data.permises && !this.data.readOnlyif){
      return (
        this.data?.permises?.sign?.sections?.['cotitular-modal']?.sections?.['autoCertSection'] ??
        null
      );
    }
    return null;
  }
}

