import { AfterViewInit, ChangeDetectionStrategy, Component, effect, inject, OnInit,signal,ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Relationships } from '../../../models/relationships';
import { DataClient } from '../../../models/client-data';
import { Address, AddressType } from '../../../models/address';
import { ClientDataComponent } from '../../../../shared/components/sections/client-data/client-data.component';
import { AddressSectionComponent } from '../../../../shared/components/sections/address-section/address-section.component';
import { EconomicActivity } from '../../../models/economic-activity';
import { Occupation } from '../../../models/occupation';
import { ERROR_MESSAGES } from '../../../constants/form-messages';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthorizedPerson, AuthorizedPersonCatalog, AuthorizedPersonForm } from '../../../models/authorized-person-page-data';
import { StrTempId } from '../../../../shared/utils/string';
import { PhoneItem } from '../../../models/phone-item';
import { PhoneSectionComponent } from '../../../../shared/components/sections/phone-section/phone-section.component';
import { FacultyContractOption } from '../faculties';
import { SIGN_CLASS_CATALOG } from '../../../constants/small-catalogs';
import { ModalSearchClientService } from '../../../../shared/services/modal-search-client.service';
import { CustomerInformationService } from '../../../../shared/services/customer.service';
import { SearchClientFlowService } from '../../../../shared/services/search-client-flow.service';
import { CustomerInformation } from '../../../../shared/models/customer';
import { existingClientToAddress, existingClientToDataClient, existingClientToPhones } from '../../../../shared/services/mapper-services/third-person-modal-mapper';
import { PhoneType } from '../../../models/phone-type';
import { Countries } from '../../../models/country';
import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { RolePermises } from '../../../../core/services/matrix_role';

@Component({
  selector: 'app-authorized-form-modal',
  standalone: false,
  templateUrl: './authorized-form-modal.component.html',
  styleUrls: ['./authorized-form-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizedFormModalComponent implements OnInit, AfterViewInit {

  @ViewChild(ClientDataComponent) clientDataComponent!: ClientDataComponent;
  @ViewChild(AddressSectionComponent) addressComponent!: AddressSectionComponent;
  @ViewChild(PhoneSectionComponent) phoneSectionComponent!: PhoneSectionComponent;

  readonly data      = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<AuthorizedFormModalComponent>);

  private readonly formBuilder          = inject(FormBuilder);
  private readonly notifService         = inject(NotificationsService);
  private readonly searchClientService  = inject(ModalSearchClientService);
  private readonly customerService      = inject(CustomerInformationService);
  private readonly clientFlowService    = inject(SearchClientFlowService);
  private readonly catalogsService      = inject(CatalogsService);
  private readonly unsavedChangeService = inject(UnsavedChangesService);

  readonly OTHER_RULE_ID: string = 'Otra regla de firma';

  form: FormGroup<AuthorizedPersonForm> = this.formBuilder.group({
    // customerNumber: : ['', []], // TODO func. 3ro relacionado.
    signClass   : ['', []],
    management  : ['', []],
    relationship: ['', [Validators.required]],

    authorizedPerson: ['', [Validators.required]],
    economicActivity: ['', [Validators.required]],
    occupation      : ['', [Validators.required]],

    profession : ['', [Validators.maxLength(50)]],
    workCompany: ['', [Validators.maxLength(100)]],
    jobTitle   : ['', [Validators.maxLength(100)]],

    isPpe       : ['', [Validators.required]],
    ppeType     : ['', []],
    ppeRol      : ['', []],
    ppeExpires  : ['', []],
    ppeHasFamily: ['', [Validators.required]],

    email: ['', [Validators.email]],

    faculty     : ['', [Validators.required]],
    otherFaculty: ['']
  });

  managementControlSignal        = toSignal(this.form.controls.management.valueChanges);
  isPpeControlSignal             = toSignal(this.form.controls.isPpe.valueChanges);

  relationShipList        : Relationships[] = [];
  economicActivityList    : EconomicActivity[] = [];
  occupationList          : Occupation[] = [];
  addressTypeList         : AddressType[] = [];
  signClassList           : { key: string; value: string; }[] = SIGN_CLASS_CATALOG;
  authorizedPersonTypeList: AuthorizedPersonCatalog[] = [];
  facultyOption           : FacultyContractOption | null;

  // Catalogs used for mappers
  phoneTypeList: PhoneType[] = [];
  countryList  : Countries[] = [];

  // used to catch the data emitted by "app-address-section"
  phoneContactSection: PhoneItem = {} as PhoneItem;

  phoneSectionData: PhoneItem = {
    id: '',
    phone: '',
    phoneType: '',
    phoneTypeId: '',
    phoneCountry: '',
    phoneCountryId: '',
    phoneCodeArea: '',
    phoneLada: '',
    phoneExtension: '',
    phoneNotification: false,
    active: false,
  };
  birthDates = {
    startAt: new Date(),
    min: new Date(),
  };

  isEditting = false;

  authorizedPerson: AuthorizedPerson;

  showOtherFaculty = false;

  isMaintenance: boolean = false;
  permissions: Array<string> = [];
  allPermissions: RolePermises;
  disButtons = {
    save: false
  };

  /**
   * This property indicates if a person(customer) was selected to fullfill
   * this form, or, it's capturing data from new 'person'.
   */
  isThird: boolean = false;

  /**
   * Another way the "Validate Data" can be disabled.
   */
  disValidateDataBtn = false;

  /**
   * disables 'Cancel' btn in specific scenario
   */
  disCancelValidData = false;

  filteredEconomicActivities = signal<EconomicActivity[]>([]);
  economicActivityFilter = new FormControl('');

  constructor() {
    console.log(this.data);
    this.relationShipList         = this.data.relationshipList();
    this.economicActivityList     = this.data.economicActivityList();
    this.filteredEconomicActivities.set(this.data.economicActivityList());
    this.occupationList           = this.data.occupationList();
    this.authorizedPersonTypeList = this.data.authorizedPersonTypeList();
    this.addressTypeList          = this.data.addressTypeList();
    this.facultyOption            = this.data.facultyOption;
    this.isEditting               = this.data.edit;
    this.authorizedPerson         = this.data.dataToEdit;
    this.isMaintenance            = this.data.isMaintenance;
    this.permissions              = this.data.permissions;
    this.allPermissions           = this.data.allPermissions;


    console.log(`facutly option: ${this.facultyOption}`);
    if ( this.facultyOption === null ) {
      this.form.controls.faculty.clearValidators();
      this.form.controls.faculty.updateValueAndValidity();
    }

    effect(() => {
      if ('yes' === this.isPpeControlSignal()) {
        this.form.get('ppeType')?.addValidators(Validators.required)
        this.form.get('ppeRol')?.addValidators(Validators.required)
        this.form.get('ppeExpires')?.addValidators(Validators.required)
      } else {
        this.form.controls.ppeType.clearValidators();
        this.form.controls.ppeRol.clearValidators();
        this.form.controls.ppeExpires.clearValidators();

        this.form.controls.ppeType.reset();
        this.form.controls.ppeRol.reset();
        this.form.controls.ppeExpires.reset();
      }

      this.form.controls.ppeType.updateValueAndValidity();
      this.form.controls.ppeRol.updateValueAndValidity();
      this.form.controls.ppeExpires.updateValueAndValidity();
    });
    this.economicActivityFilter.valueChanges.subscribe(value => {
      const filterValue = value?.toLowerCase() || '';

      this.filteredEconomicActivities.set(
        this.economicActivityList.filter(item =>
          item.lineBusiness.toLowerCase().includes(filterValue)
        )
      );
    });
  }

  ngOnInit(): void {
    this.catalogsService.getPhoneType({telephoneTypeIds: []}).subscribe((phonesResp: PhoneType[]) => this.phoneTypeList = phonesResp);
    this.catalogsService.getCountry({land: []}).subscribe((countryResp: Countries[]) => this.countryList = countryResp);

    this.form.controls['faculty'].valueChanges.subscribe((value: string) => {
      console.log('faculty: ' + value);
      if ( this.OTHER_RULE_ID === value ) {
        this.form.get('otherFaculty')?.addValidators(Validators.required);
      } else {
        this.form.get('otherFaculty')?.setValue('');
        this.form.get('otherFaculty')?.clearValidators();
      }
      this.form.get('otherFaculty')?.updateValueAndValidity();
    });

    if ( this.isEditting ) {
      if (this.authorizedPerson.contactData) {
        this.phoneSectionData = this.authorizedPerson.contactData;
      }
      this.form.patchValue(this.authorizedPerson.authorizedPerson);
    }
  }



  ngAfterViewInit(): void {

    if (this.isEditting) {
      this.clientDataComponent.setClientData(this.authorizedPerson.clientData);
      this.addressComponent.setAddresData(this.authorizedPerson.addressData);
    }

    if (this.isMaintenance) {

      this.initializeMaintenance();

      if ( this.isEditting ) {
        this.disValidateDataBtn = true;
        this.disCancelValidData = true;
        this.clientDataComponent.profileForm.disable();
      }

    } // (isMaintenance)

  }

  /**
   *
   */
  async onSubmit(): Promise<any> {
    document.body.classList.add('show-validation');

    this.phoneContactSection = {} as PhoneItem;

    console.log(this.form.getRawValue());

    let canPass = true;

    const clientData: DataClient | null = await this.clientDataComponent.submitComplet();
    const addressData: Address | null = await this.addressComponent.onSubmit();
    const phoneValid: boolean = await this.phoneSectionComponent.onSubmit();
    const reqFields = this.validateRequiredFields();

    document.body.classList.add('show-validation');

    if (clientData == null) {
      canPass = false;
      return;
    }

    if (!phoneValid || clientData == null || !addressData || reqFields) {
      if (phoneValid) {
        this.notifService.error(ERROR_MESSAGES.MISSING_INFO);
      }
      canPass = false;
      return;
    }

    if (this.invalidFormatFields()) {
      this.notifService.error(ERROR_MESSAGES.INCORRECT_FORMAT);
      canPass = false;
    }

    if (!phoneValid || clientData == null || !addressData || reqFields || !canPass) {
      return;
    }

    const theTempId = this.isEditting ? this.authorizedPerson.tempId : StrTempId();

    const data: AuthorizedPerson = {
      id: this.authorizedPerson.id,
      tempId: theTempId,
      active: true,
      personId: this.authorizedPerson.personId,
      clientData: {...this.authorizedPerson.clientData, ...clientData},
      addressData: {...this.authorizedPerson.addressData, ...addressData},
      contactData: {...this.authorizedPerson.contactData, ...this.phoneContactSection},
      authorizedPerson: {...this.authorizedPerson.authorizedPerson, ...this.form.getRawValue()},
      // customerNumber: 123456789, // TODO func. 3ro relacionado.
    };
    console.log(data);
    if ( this.isEditting ) {
      if ( data.contactData ) data.contactData.id = this.authorizedPerson.contactData?.id ?? '';
      if ( data.addressData ) data.addressData.id = this.authorizedPerson.addressData.id;
    }

    const table = {
      tempId: theTempId,
      clientNumber: '', // customerNumber: data.customerNumber, // TODO func. 3ro relacionado.
      rfc: clientData.rfc,
      address: this.getAddressName(addressData.addressType),
      telephone: this.phoneContactSection.phone,
      privileges: data.authorizedPerson.faculty,
      active: data.active
    };

    this.unsavedChangeService.setUnsavedChanges(true);

    this.dialogRef.close({
      ok: true,
      data,
      table,
      edit: this.isEditting
    });
  }

  /**
   *
   * @returns if at least one control required its invalid.
   */
  validateRequiredFields(): any {
    const oneInvalid = Object.values(this.form.controls).some((control) => control.hasError('required'));
    console.log('oneInvalid: ' + oneInvalid);
    if (oneInvalid) {
      Object.keys(this.form.controls).forEach(controlName => {
        if (this.form.get(controlName)?.invalid) {
          console.log("empty", controlName);
          this.form.get(controlName)?.markAsTouched();
        }
      });
    }
    return oneInvalid;
  }

  /**
   * Checks if some control has error.
   */
  invalidFormatFields(): any {
    let invalid = false;
    Object.values(this.form.controls).map((control) => {
      if (control.invalid) {
        invalid = true;
        control.markAsTouched();
      }
    });
    return invalid;
  }

  /**
   * Cancel/close the modal without data.
   */
  cancel(): void {
    const dd = {
      ok: false,
      data: null
    }
    this.dialogRef.close(dd);
  }

  getPhoneSectionValues(data: PhoneItem): any {
    console.log(data);
    this.phoneContactSection = data;
  }

  /**
   * Return the name of a type address by ID
   * used to show human data on data table.
   */
  getAddressName(id: any): string {
    const address = this.addressTypeList.find((item: AddressType) => id == item.addressTypeId);
    return address?.addressType ?? '';
  }


  /**
   * Method for MAINTENANCE
   *
   * Initialize default maintenance mode. (all disabled)
   */
  initializeMaintenance(): any {

    const canAdd = this.permissions.includes('add');
    const canEdit = this.permissions.includes('edit');
    const canRead = this.permissions.includes('read');

    if (canRead) {

      this.clientDataComponent.profileForm.disable();
      this.addressComponent.profileForm.disable();
      this.phoneSectionComponent.form.disable();
      this.form.disable();

      this.disButtons = {
        save: true
      };

    }

    if (!this.isEditting && canAdd) {

      this.clientDataComponent.profileForm.enable();
      this.addressComponent.profileForm.enable();
      this.phoneSectionComponent.form.enable();
      this.form.enable();

      this.disButtons = {
        save: false
      };

    }

    if (this.isEditting && canEdit) {

      this.clientDataComponent.profileForm.enable();
      this.addressComponent.profileForm.enable();
      this.phoneSectionComponent.form.enable();
      this.form.enable();

      this.disButtons = {
        save: false
      };

      if ( this.allPermissions.fieldsEnabled?.length ) {
        Object.keys(this.form.controls).forEach((name) => {
          if ( !this.allPermissions.fieldsEnabled?.includes(name) ) {
            const control = this.form.get(name) as AbstractControl;
            control.disable();
          }
        });
      }

      if ( this.allPermissions.sections ) {
        Object.keys(this.allPermissions.sections).forEach(name => {
          console.log(name);
          console.log(this.allPermissions.sections[name]);

          // verifica si toda la seccion se deshabilita.
          if ( this.allPermissions.sections[name].disabled ) {
            (this as any)[name]?.[this.allPermissions.sections[name].formName]?.disable({emitEvent: false});
          }
        })
      }

    }
    // 1. deshaiblitar todo los forms
    // 2. deshabilitar todos los botones (configurarlos)
  }

  /**
   * Opens Modal for Customer Search
   */
  async searchCustomerModal(): Promise<any> {
    const result = await this.searchClientService.searchClient();
    console.log(result);
    if ( result ) {
      this.customerValidation(result.clientNumber);
      this.disValidateDataBtn = true;
    } else {
      this.disValidateDataBtn = false;
    }
  }

  /**
   * "Validar Datos" Event Button
   * Validates if data entered belongs to existing customer or not.
   *
   * 1. Gets form person data.
   * 2. Looks for homonyms.
   * 3. Looks for watchlist
   */
  async validateData(): Promise<any> {
    const clientData: DataClient | null = await this.clientDataComponent.submitComplet();
    console.log(clientData);

    if ( clientData ) {
      const hm = await this.clientFlowService.validInHomonyms(clientData, true);
      console.log(hm);
      if ( hm.passOnHomonyms && hm.numberClient === null ) {
        if ( this.isMaintenance ) {
          this.disValidateDataBtn = false;
          return;
        }
        const wl = await this.clientFlowService.validInWatchList(clientData);
        console.log(wl);
        if ( wl ) {
          this.clientDataComponent.profileForm.disable();
          this.disValidateDataBtn = true;
        }
      } else {
        if ( hm.numberClient ) {
          this.customerValidation(hm.numberClient);
          this.disValidateDataBtn = true;
        }
      }
    } else {
      return;
    }
  }

  /**
   * Clears form and enable to allow new data.
   */
  cancelData(): any {
    this.form.reset();
    // this.clientDataComponent.profileForm.reset();
    this.addressComponent.profileForm.reset();
    this.phoneSectionData = {
      id: '',
      phone: '',
      phoneType: '',
      phoneTypeId: '',
      phoneCountry: '',
      phoneCountryId: '',
      phoneCodeArea: '',
      phoneLada: '',
      phoneExtension: '',
      phoneNotification: false,
      active: false,
    };

    this.form.enable();

    this.clientDataComponent.enableForm();
    this.addressComponent.profileForm.enable();
    this.phoneSectionComponent.form.enable();

    this.isThird = false;
    this.disValidateDataBtn = false;
  }

  /**
   * When customer is found, disable exact sections/fields.
   */
  disableSectionThirdCustomer(): void {
    // y se dejan habilitados los siguientes campos/secciones
    // - Parentesco
    // - Clase de Firma
    // - Facultades

    // datos generales
    this.clientDataComponent.profileForm.disable();
    this.addressComponent.profileForm.disable();
    this.phoneSectionComponent.form.disable();

    //-/ signClass
    this.form.get('management')?.disable();
    //-/ relationship
    // this.form.get('authorizedPerson')?.disable();
    this.form.get('economicActivity')?.disable();
    this.form.get('occupation')?.disable();
    this.form.get('profession')?.disable();
    this.form.get('workCompany')?.disable();
    this.form.get('jobTitle')?.disable();
    this.form.get('isPpe')?.disable();
    this.form.get('ppeType')?.disable();
    this.form.get('ppeRol')?.disable();
    this.form.get('ppeExpires')?.disable();
    this.form.get('ppeHasFamily')?.disable();
    this.form.get('email')?.disable();
    //-/ faculties
    //-/ otherFaculty
  }

  /**
   * When a customer (third related ) is searched and return its details, this method
   * patchs customer data into sections.
   */
  setDataCustomerToForm(customerResponse: CustomerInformation): void {
    console.log(customerResponse);
    if ( customerResponse.initialData && customerResponse.generalInformation ) {
      const dd = existingClientToDataClient(customerResponse.initialData, customerResponse.generalInformation);
      this.clientDataComponent.setClientData(dd);
      this.form.patchValue(
        {
          economicActivity: customerResponse.generalInformation?.economicActivity,
          occupation      : customerResponse.generalInformation?.occupation,
          profession      : customerResponse.generalInformation?.profession ?? '',
          workCompany     : customerResponse.generalInformation?.companyName ?? '',
          jobTitle        : customerResponse.generalInformation?.jobTitle ?? '',
        }
      );
    }

    if ( customerResponse.ppeInformation ) {
      this.form.patchValue({
        isPpe       : customerResponse.ppeInformation.ppe ? 'yes' : 'no',
        ppeType     : customerResponse.ppeInformation.ppeType,
        ppeRol      : customerResponse.ppeInformation.positionHeld,
        ppeExpires  : customerResponse.ppeInformation.expirationDate,
        ppeHasFamily: customerResponse.ppeInformation.hasFamilyPpe ? 'yes' : 'no',
      });
    }

    if ( customerResponse.addresses ) {
      this.addressComponent.setAddresData(existingClientToAddress(customerResponse.addresses));
    }

    this.form.get('email')?.setValue(customerResponse.emails?.[0]?.emailAddress ?? '');

    if ( customerResponse.telephones ) {
      const phones: PhoneItem[] = existingClientToPhones(customerResponse.telephones, this.phoneTypeList, this.countryList);
      let phone = phones.find((item: PhoneItem) => item.active === true);
      console.log(phone);
      if ( phone === undefined ) {
        phone = {
          id: '',
          phone: '',
          phoneType: '',
          phoneTypeId: '',
          phoneCountry: '',
          phoneCountryId: '',
          phoneCodeArea: '',
          phoneLada: '',
          phoneExtension: '',
          phoneNotification: false,
          active: false,
        };
      }
      // TODO mover esto al comopnetne phone section (si es posible)
      this.phoneSectionComponent.form.setValue({
        phoneType: phone.phoneTypeId,
        phoneCountry: phone.phoneCountryId,
        phoneCodeArea: phone.phoneCodeArea,
        phone: phone.phone,
        phoneExtension: phone.phoneExtension ?? '',
        phoneNotification: phone.phoneNotification,
        isSaved: false
      });
      this.phoneSectionComponent.selectedPhoneType.set(phone.phoneType)
      this.phoneSectionComponent.selectedCountry.set(phone.phoneCountry);
      //
    }
  }

  /**
   * Validates WL and HM for given Customer Number
   */
  customerValidation(customerNumber: number): void {

    this.isThird = true;

    this.customerService.getCustomerInfo(customerNumber,
      ['initialData', 'generalInformation', 'ppeInformation', 'addresses', 'emails', 'telephones']
    ).subscribe((customerResponse: CustomerInformation) => {

      if ( customerResponse ) {
        const bodyWL: DataClient = {
          ppe                  : false,
          bankAreaTypeId       : '',
          contraTypeId         : '',
          typeContractSubtypeId: '',
          curp                 : customerResponse.initialData?.curp ?? '',
          foreignerWithoutCurp : customerResponse.initialData?.foreignerWithoutCurp ?? false,
          typeIden             : '',
          rfc                  : '',
          dateOfBirth          : customerResponse.initialData?.dateOfBirth ?? '',
          gender               : customerResponse.initialData?.gender ?? '1',
          nationality          : '',
          countryOfBirth       : customerResponse.initialData?.countryOfBirth ?? '',
          stateOfBirth         : customerResponse.initialData?.stateOfBirth ?? '',
          cityOfBirth          : customerResponse.initialData?.cityOfBirth ?? '',
          firstName            : customerResponse.initialData?.firstName ?? '',
          middleName           : customerResponse.initialData?.middleName ?? '',
          firstLastName        : customerResponse.initialData?.firstLastName ?? '',
          secondLastName       : customerResponse.initialData?.secondLastName ?? '',
        };

        const customerNumberStr = customerNumber?.toString() ?? null;

        this.clientFlowService.validInWatchList(bodyWL, customerNumberStr).then((wlResp: any) => {
          console.log(wlResp);

          console.log(customerResponse);

          this.setDataCustomerToForm(customerResponse);
          console.log(this.phoneSectionData);

          this.disableSectionThirdCustomer();
        });
      }
    });
  }


}
