import { inject, Injectable, signal } from '@angular/core';
import { Client } from '../models/client-data';
import { NewContract } from '../models/customer-initial-data';
import { CurrentOnboardingInfo } from '../models/current-onboarding';
import { PERSON_TYPE } from '../constants/constants';
import { TABS_PF, TABS_PM } from '../constants/tabs';
import { Tabs } from '../models/tabs';
import { Observable, firstValueFrom } from 'rxjs';
import { HttpClientService } from '../../core/services/http-client.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { PermissionRolService } from '../../core/services/rol.service';
import { AddressesService } from '../../shared/services/storage-services/addresses.service';
import { AdditionalInfoService } from '../../shared/services/storage-services/additional-info.service';
import { AuthorizedPersonSignalService } from './checkpoint/authorized-persona-signal.service';
import { BankAccountCheckpointSignalService } from './checkpoint/bank-account-signal.service';
import { BeneficiariesSignalService } from './checkpoint/beneficiaries-signal.service';
import { IdentificationAndContactService } from '../../shared/services/storage-services/identification-and-contact.service';
import { EntityStatusService } from '../../shared/services/storage-services/pm/entity-status.service';
import { DirectorateSignalService } from './checkpoint/directorate-signal.service';
import { FirstDataClientService } from '../../shared/services/storage-services/first-data-client.service';
import { GeneralInfoStorageService } from '../../shared/services/storage-services/general-info-storage.service';
import { PersonalInterviewService } from '../../shared/services/storage-services/personal-interview.service';
import { OperateChangesStorageService } from '../../shared/services/storage-services/operate-changes-storage.service';
import { OrganizationChartService } from '../../shared/services/storage-services/pm/organization-chart.service';
import { PldQuizService } from '../../shared/services/pld-quiz.service';
import { PpeService } from '../../shared/services/storage-services/ppe.service';
import { PrivacyNoticeService } from '../../shared/services/storage-services/privacy-notice.service';
import { RealOwnerService } from '../../shared/services/storage-services/real-owner.service';
import { ResourceProviderService } from '../../shared/services/storage-services/resource-provider.service';
import { SignStorageService } from '../../shared/services/storage-services/sign-storage.service';
import { SpidProfileSignalService } from './checkpoint/spid-profile-signal.service';
import { FiscalSelfDeclarationDataClientService } from '../../shared/services/storage-services/fiscal-self-declaration.service';

import { mapToSignalAddressCustomer } from './mappers/response/address';
import { mapToSignalInitialData, mapToSignalInitialDataCustomer } from './mappers/response/initial-data-mapper';
import { mapToSignalPPECustomer } from './mappers/response/ppe-mapper';
import { checkpointToGeneralInfo, existingClientToGeneralInfo } from './mappers/general-info.mapper';
import { CatalogsService } from '../../shared/services/catalogs.service';
import { mapResToPersonalInterview } from './mappers/response/personal-interview-mapper';
import { mapResToSignalFiscalSelfDeclarationM } from './mappers/maintenance/respnse/fiscal-self-declaration-mapper';
import { mapResToSignalFiscalSelfDeclaration } from './mappers/response/fiscal-self-declaration-mapper';
import { TiProfileService } from '../../shared/services/storage-services/ti-profile.service';
import { mapToSignalInitialDataM } from './mappers/maintenance/respnse/initial-data-mapper';
import { checkpointToIdentificationAndContact, exitentedClientToIdentificationAndContact } from './mappers/identification-and-contact.mapper';
import { PhoneType } from '../models/phone-type';
import { Countries } from '../models/country';
import { IdentificationType } from '../models/identification-type';
import { SpouseService } from '../../shared/services/storage-services/spouse.service';
import { checkpointToOperateChangeSectionMant } from './mappers/maintenance/operate-changes-mant-mapper';
import { checkpointMantToGeneralInfo } from './mappers/maintenance/general-info-mant-mapper';
import * as BankAccountMappers from './mappers/bank-account.mapper';
import * as AuthorizedPersonMapper from './mappers/authorized-person.mapper';
import { beneficiariesMapperQueryMaint } from './mappers/beneficiaries.mapper';
import { ActiwebService } from '../../shared/services/actiweb.service';
import { checkpointMantToSignSection } from './mappers/maintenance/signature-mapper-mant';
import { additionalInfoCheckpointToSection } from './mappers/maintenance/additional-info-mapper';
import { CreditDataService } from '../../shared/services/storage-services/credit-data.service';
import { TaxProfileService } from '../../shared/services/storage-services/tax-profile.service';
import { checkpointMantToTransactionaInvestmentProfileSection } from './mappers/maintenance/transactional-investment-profile-mapper-mant';
import { Ranges } from '../models/origin-resource';
import { EquityRegistrationRequest, EquityRegistrationResponse } from '../models/equity-contract';
import { checkpointMantToIdentificationAndContact } from './mappers/maintenance/identification-and-contract-mant-mapper';
import { OnboardingStateServiceService } from './onboarding-state-service.service';
import { checkpointToTransactionalInvestmentSection } from './mappers/transactional-investment-mapper';
import { checkpointToSignSection } from './mappers/signature-mapper';
import { ZipCodeService } from '../../shared/services/zip-code.service';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  private readonly http                               = inject(HttpClientService);
  private readonly authService                        = inject(AuthService);
  private readonly catalogsService                    = inject(CatalogsService);
  private readonly zipCodeService                     = inject(ZipCodeService);
  private readonly permissionRolService               = inject(PermissionRolService);
  private readonly addressesService                   = inject(AddressesService);
  private readonly additionalInfoService              = inject(AdditionalInfoService);
  private readonly authorizedPersonSignalService      = inject(AuthorizedPersonSignalService);
  private readonly bankAccountCheckpointSignalService = inject(BankAccountCheckpointSignalService);
  private readonly beneficiariesSignalService         = inject(BeneficiariesSignalService);
  private readonly pageStorageService                 = inject(IdentificationAndContactService);
  private readonly directorateSignalService           = inject(DirectorateSignalService);
  private readonly storageService                     = inject(EntityStatusService);
  private readonly firstDataClientService             = inject(FirstDataClientService);
  private readonly generalInfoStorageService          = inject(GeneralInfoStorageService);
  private readonly personalInterviewService           = inject(PersonalInterviewService);
  private readonly operateChangesStorageService       = inject(OperateChangesStorageService);
  private readonly organizationChartService           = inject(OrganizationChartService);
  private readonly pldQuizService                     = inject(PldQuizService);
  private readonly ppeService                         = inject(PpeService);
  private readonly privacyNoticeService               = inject(PrivacyNoticeService);
  private readonly realOwnerService                   = inject(RealOwnerService);
  private readonly resourceProviderService            = inject(ResourceProviderService);
  private readonly signStorageService                 = inject(SignStorageService);
  private readonly spidProfileSignal                  = inject(SpidProfileSignalService);
  private readonly fiscalSelfDeclarationDataService   = inject(FiscalSelfDeclarationDataClientService);
  private readonly tiProfileService                   = inject(TiProfileService);
  private readonly spouseService                      = inject(SpouseService);
  private readonly actiwebService                     = inject(ActiwebService);
  private readonly creditDataService                  = inject(CreditDataService);
  private readonly taxProfileService                  = inject(TaxProfileService);

  private readonly url = environment.api.registerOnboarding;

  phoneTypes = signal<Array<PhoneType>>([]);
  countries = signal<Array<Countries>>([]);
  identifications = signal<Array<IdentificationType>>([]);
  ranges = signal<Array<Ranges>>([]);


  constructor(private state: OnboardingStateServiceService) {}

  setCurrentInfo(info: CurrentOnboardingInfo): void {
    this.state.setCurrentInfo(info);
  }

  getCurrentInfoState(): CurrentOnboardingInfo{
    return this.state.getCurrentInfo();
  }


  /**
   * Information of the current onboarding.
   */
  private _currentInfo = signal<CurrentOnboardingInfo>({
    requestId: '',
    personType: 'PF',
    name: '',
    contractType: '',
    contractSubtype: '',
    businessType: '',
    onboardingId: 0,
    isMaintenance: false,
    isCustomer: false,
    isOnboarding: false,
    isOnboardingWL: false,
    clientId: 0,
    accountId: 0,
    accountData: null,
  });
  readonly currentInfo = this._currentInfo.asReadonly();

  /**
   * Tabs for Onboarding
   */
  tabs = signal<Array<Tabs>>([]);

  private _currentTab = signal<{ previous: number; current: number }>({ previous: 0, current: 0 });
  readonly currentTab = this._currentTab.asReadonly();

  /**
   * Stores the data reponse when temporally
   */
  private _onboardingRegister = signal<any>({});
  readonly onboardingRegister = this._onboardingRegister.asReadonly();


  /**
   * The information with which the new customer's onboarding begins.
   */
  customerInitialData = signal<Client>({} as Client);

  /**
   * The information with which the new customer's onboarding begins.
   */
  btnConfirmData = signal<boolean>(false);
  btnConfirmDataDisabled = signal<boolean>(true);

  /**
   *
   */
  setOnboardingRegister(data: any): any {
    this._onboardingRegister.set(data);
  }

  /**
   *
   */
  getOnboardingRegister(): any {
    return this.onboardingRegister();
  }

  /**
   * Updates the "current info" signal
   * and receives as parameter a partial of the interface/model object.
   */
  updateCurrentOnboardingInfo(data: Partial<CurrentOnboardingInfo>): void {
    this._currentInfo.update(item => ({
      ...item,
      ...data
    }));
    this.setCurrentInfo(this._currentInfo.asReadonly()());
  }

  /**
   * Used to clear onboarding signals.
   */
  clearOnboardingInfo(): void {
    this._currentInfo.set({
      requestId: '',
      personType: 'PF',
      name: '',
      contractType: '',
      contractSubtype: '',
      businessType: '',
      onboardingId: 0,
      isMaintenance: false,
      isCustomer: false,
      isOnboarding: false,
      isOnboardingWL: false,
      clientId: 0,
      accountId: 0,
      accountData: null,
    });
    this.setCurrentInfo(this._currentInfo.asReadonly()());

    this.customerInitialData.set({} as Client);

    this._currentTab.set({
      previous: 0,
      current: 0
    });

    this.addressesService.clear();
    this.additionalInfoService.removeItem();
    this.authorizedPersonSignalService.clear();
    this.bankAccountCheckpointSignalService.clear();
    this.beneficiariesSignalService.clear();
    this.pageStorageService.cleartIdentificationAndContactInfo();
    this.directorateSignalService.clear();
    this.storageService.clearEntityStatusPm();
    this.firstDataClientService.removeItem()
    this.generalInfoStorageService.clearFullSectionSingal();
    this.personalInterviewService.removeItem();
    this.operateChangesStorageService.clearOperateChanges();
    this.organizationChartService.clearOrganizationChartSection();
    this.pldQuizService.clear();
    this.ppeService.clear();
    this.privacyNoticeService.clear();
    this.realOwnerService.removeItem();
    this.resourceProviderService.removeItem()
    this.signStorageService.clear();
    this.spidProfileSignal.clear();
    this.fiscalSelfDeclarationDataService.removeItem();
    this.tiProfileService.clear();
    this.taxProfileService.removeItem();
    this.spouseService.removeItem();
    this.creditDataService.removeItem();
    this.restoreInitialTabs();
    this.actiwebService.clear();
    this._onboardingRegister.set({});
  }

  restoreInitialTabs(){
    this.enableTabs
    this.hideTabs('operate-changes');
    this.hideTabs('real-owner');
    this.hideTabs('resource-provider');
    this.hideTabs('spouse');
    this.disableTabs();
    this.enableTabs(['customer-info'])
    this.tabs.set(TABS_PF)
  }

  /**
   *
   */
  finishOnboarding(): Observable<any> {
    const dd: { applicationId: string; advisorId: string; } = {
      applicationId: this._currentInfo().requestId,
      advisorId: this.authService.getUserInfo()().employeeId
    };
    return this.http.post(this.url, dd);
  }

  /**
   * Gets the current onboarding information.
   *
   * @returns The current information.
   */
  getCurrentInfo(): CurrentOnboardingInfo {
    return this.currentInfo();
  }

  /**
   * Method to enable tabs, passed as an array of string.
   * It works with the 'path'. Eg: ['bank-account']
   *
   * If not param passed, then enable all tabs.
   */
  enableTabs(tabs?: string[]): void {
    let updated: Array<any> = [];

    if ( tabs ) {
      updated = this.tabs().map((item) => {
        if ( tabs.indexOf(item.path) !== -1) {
          item.disabled = false;
        }
        return item;
      });

    } else {
      updated = this.tabs().map((item) => {
        item.disabled = false;
        return item;
      });
    }

    this.tabs.set(updated);
  }

  disableTabs(tabs?: string[]): void{
    let updated: Array<any> = [];
    if ( tabs ) {
      updated = this.tabs().map((item) => {
        if ( tabs.indexOf(item.path) !== -1) {
          item.disabled = true;
        }
        return item;
      });

    } else {
      updated = this.tabs().map((item) => {
        item.disabled = true;
        return item;
      });
    }

    this.tabs.set(updated);
  }

  /**
   * Sets the Tabs to show if Persona Fisica or Persona Moral onboarding.
   */
  setTabs(): void {
    if (this.currentInfo().personType === PERSON_TYPE.PF) {
      if (this.currentInfo().isMaintenance) {
        const rolePermissions = this.permissionRolService.getPermissions();
        // Crear una copia del array TABS_PF para modificar sin afectar el original
        let tabs = TABS_PF.map(section => ({ ...section }));
        tabs.forEach(section => {
          const path = section.path;
          const permissions = rolePermissions[path];
          if (permissions) {
            section.hide = permissions.hide; // Modifica la propiedad en la copia
          }
        });
        // Asignar la copia modificada al signal
        this.tabs = signal<Array<Tabs>>(tabs);
      } else {
        // Asignar el original al signal cuando no está en mantenimiento
        this.tabs = signal<Array<Tabs>>(TABS_PF);
      }
    } else {
      if (this.currentInfo().isMaintenance) {
        const rolePermissions = this.permissionRolService.getPermissions();
        // Crear una copia del array TABS_PF para modificar sin afectar el original
        let tabs = TABS_PM.map(section => ({ ...section }));
        tabs.forEach(section => {
          const path = section.path;
          const permissions = rolePermissions[path];
          if (permissions) {
            section.hide = permissions.hide; // Modifica la propiedad en la copia
          }
        });
        // Asignar la copia modificada al signal
        this.tabs = signal<Array<Tabs>>(tabs);
      } else {
        // Asignar el original al signal cuando no está en mantenimiento
        this.tabs = signal<Array<Tabs>>(TABS_PM);
      }
    }
  }

  /**
   *
   * @param position
   */
  setCurrentTab(position: number): void {
    const niu = {
      previous: this._currentTab().current,
      current: position
    };
    console.log(niu);
    this._currentTab.set(niu);
  }

  /**
   *
   */
  restoreTabPosition(): void {
    this.setCurrentTab(this._currentTab().previous);
  }

  /**
   * Gets the tabs to show in onboarding.
   */
  getTabs(): Tabs[] {
    return this.tabs();
  }

  /**
   *
   */
  setCustomerInitalData(data: Client | NewContract): void {
    let currData: Client = this.getCustomerInitialData();

    console.log({currData})
    console.log({data})
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        currData[key] = value;
      }
    });
    this.customerInitialData.set(currData);
    console.log('seteando tipo de persona')
    console.log({currData})
    console.log(currData.personType)
    this._currentInfo.update((item) => ({
      ...item,
      personType: (currData.personType === '1' ? 'PF' : 'PM')
    }));
    this.setCurrentInfo(this._currentInfo.asReadonly()());
  }

  /**
   *
   */
  getCustomerInitialData(): any {
    return this.customerInitialData();
  }

  /** // DEPRECATED LA PROPIEDAD POSICION Y A NO EXITE.
   * Get the tab with position 0 property on Array of Tabs.
   * If no tab with position 0, it returs the first tab.
   */
  getFirstTab(): Tabs {
    let tab = this.tabs().find((item: any) => item.position === 0);
    return tab ?? this.tabs()[0];
  }

  /**
   *
   */
  hideTabs(tabToHide: string | string[]) {
    const tabsToShow = Array.isArray(tabToHide) ? tabToHide : [tabToHide];
    this.tabs.update(tabs => tabs.map(
      item => tabsToShow.includes(item.path) ? { ...item, hide: true } : item));
  }

  /**
   *
   */
  showTabs(tabToHide: string | string[]) {
    const tabsToShow = Array.isArray(tabToHide) ? tabToHide : [tabToHide];
    const isMaintenance = this.currentInfo().isMaintenance;
    const rolePermissions = isMaintenance ? this.permissionRolService.getPermissions() : null;

    this.tabs.update(tabs => tabs.map(item => {
      if (tabsToShow.includes(item.path)) {
        if (isMaintenance && rolePermissions && rolePermissions[item.path] !== undefined) {
          return { ...item, hide: rolePermissions[item.path].hide };
        }
        return { ...item, hide: false };
      }
      return item;
    }));
  }


  /**
   * Retrieves all information from customer/contract (onboarding completed)
   */
  getContractInfo(): void {
    // code here
  }

  /**
   * Retrieves customer information, to initialize onboarding.
   */
  async getCustomerInfo(sections: any): Promise<void> {
       console.log(sections);

    // you can reuse this catalogs on your mappers:
    //const addressTypeCatalog = await firstValueFrom(this.catalogsService.getAddressType({addressTypeIds: []}));
    const getCountry = await firstValueFrom(
      this.catalogsService.getCountry({ land: [] })
    );
    const getPhoneType = await firstValueFrom(
      this.catalogsService.getPhoneType({ telephoneTypeIds: [] })
    );
    const getIdentificationType = await firstValueFrom(
      this.catalogsService.getIdentificationType({ types: [] })
    );
    const getOriginResource = await firstValueFrom(
      this.catalogsService.getOriginResource({full: true, rangeId: "1"})
    );
    this.countries.set(getCountry);
    this.phoneTypes.set(getPhoneType);
    this.identifications.set(getIdentificationType);
    this.ranges.set(getOriginResource);
    const serviceMap: Record<string, (data: any) => void> = {
    'initialData': (data) => this.firstDataClientService.setItem(mapToSignalInitialDataCustomer(data)),
    'addresses': (data) => {
      console.log(mapToSignalAddressCustomer(data));
      this.addressesService.set(mapToSignalAddressCustomer(data));
      console.log("data direcciones: ",this.addressesService.get());
    },
    'generalInformation': (data) => {
      console.log(data);
      const generalInfo = existingClientToGeneralInfo(data ?? null);
      generalInfo ? this.generalInfoStorageService.setGeneralInfoItem(generalInfo) : console.log('No hay general info');
    },
    'identificationContact': async (data) => {
      const info = await exitentedClientToIdentificationAndContact(data, this.phoneTypes(), this.countries(), this.identifications());
      this.pageStorageService.setIdentificationAndContactInfo(info);
    },
    'fiscalResidences': (data) => {
      console.log(data);
    },
    'factaObligation': (data) => {
      console.log(data);
    },
    'ppeInformation': (data) => {
      console.log(data);
      this.ppeService.set(mapToSignalPPECustomer(data));
    }
    };



    for (const sectionId in sections) {
      if (sections.hasOwnProperty(sectionId)) {
        const handler = serviceMap[sectionId];

        if (handler) {
          try {
            handler(sections[sectionId]);
          } catch (error) {
            console.error(`Error processing section ${sectionId}:`, error);
          }
        } else {
          console.log('La sección del servicio no existe en nuestro mapa.');
        }
      }
    }
  }

  /**
   * Set Checkpoint Sections
   *
   */
  async setCheckpointSections(sections: Array<any>): Promise<void> {
    console.log(sections);

    // you can reuse this catalogs on your mappers:
    const getCountry = await firstValueFrom(
      this.catalogsService.getCountry({ land: [] })
    );
    const getPhoneType = await firstValueFrom(
      this.catalogsService.getPhoneType({ telephoneTypeIds: [] })
    );
    const getIdentificationType = await firstValueFrom(
      this.catalogsService.getIdentificationType({ types: [] })
    );
    const getOriginResource = await firstValueFrom(
      this.catalogsService.getOriginResource({full: true, rangeId: "1"})
    );
    this.countries.set(getCountry);
    this.phoneTypes.set(getPhoneType);
    this.identifications.set(getIdentificationType);
    this.ranges.set(getOriginResource);
    const serviceMap: Record<string, (data: any) => void> = {
      // TODO aqui van las demas secciones.
      // 'address'     : (data) => this.addressesService.set(mapToSignalAddress(data)),
      'fiscal-self-declaration' : (data) => this.fiscalSelfDeclarationDataService.setItem(mapResToSignalFiscalSelfDeclaration(data)),
      'identification-contact': async (data) => {
        const info = await checkpointToIdentificationAndContact(data, this.phoneTypes(), this.countries(), this.identifications());
        this.pageStorageService.setIdentificationAndContactInfo(info);
      },
      'signature': async (data) => {
        const info = await checkpointToSignSection(data, this.phoneTypes(), this.countries(), this.identifications(), this.zipCodeService);
        this.signStorageService.setSingSection(info);
      },
      'general-information' : async (data) => {
        const generalInfo = checkpointToGeneralInfo(data)
        this.generalInfoStorageService.setGeneralInfoItem(generalInfo)

        //TODO activar cuando este listo los executors
        //const testamentatySection = await checkpointToGeneralInfoExecutors(data, this.phoneTypes(), this.countries(), this.identifications())
        //this.generalInfoStorageService.setTestamentarySection(testamentatySection)
        if(this._currentInfo().isOnboarding){
          if (generalInfo) {
            console.log('Activando el resto de tabs');
            if (!generalInfo?.operatesChanges) {
              this.hideTabs('operate-changes');
            } else {
              this.showTabs('operate-changes');
            }
            if (generalInfo?.acting) {
              this.hideTabs('real-owner');
            } else {
              this.showTabs('real-owner');
            }
            if (!generalInfo?.hasSupplier) {
              this.hideTabs('resource-provider');
            } else {
              this.showTabs('resource-provider');
            }
          }
        }
      },
      // 'exchange-operation' : async (data) => {
      //   const info = checkpointToOperateChangeSection(data);
      //   info ? this.operateChangesStorageService.setoperateChanges(info): console.log('No hay info capturada previamente para opera-cambios');
      // },
      'initial-data'     : (data) => this.firstDataClientService.setItem(mapToSignalInitialData(data)),
      //'personal-interview': (data) => this.personalInterviewService.setItem(mapResToPersonalInterview(data)),
      //'ppe-information'     : (data) => this.ppeService.set(mapToSignalPPE(data)),
      // 'real-owner'     : (data) => this.realOwnerService.setItem(mapToSignalRealOwner(data)),
      // 'resources-provider'     : (data) => this.resourceProviderService.setItem(mapToSignalResourceProvider(data)),
      'transactional-investment-profile'  : (data) => {
        const info = checkpointToTransactionalInvestmentSection(data, this.ranges())
        this.tiProfileService.setFullSectionSignal(info)
      },
      'privacy-notice'     : (data) => this.privacyNoticeService.setItem(data),
    };

    for (const i in sections ) {
      const handler = serviceMap[sections[i].sectionId];

      if (handler) {
        handler(sections[i].data);
      } else {
        console.log('la sección del servicio, no existe en nuestro map.');
      }

    }

  }

  async setCheckpointSectionsMant(sections: Array<any>): Promise<void> {
    console.log(sections);
    console.log(sections);
    const getCountry = await firstValueFrom(
      this.catalogsService.getCountry({ land: [] })
    );
    const getPhoneType = await firstValueFrom(
      this.catalogsService.getPhoneType({ telephoneTypeIds: [] })
    );
    const getIdentificationType = await firstValueFrom(
      this.catalogsService.getIdentificationType({ types: [] })
    );
    const getOriginResource = await firstValueFrom(
      this.catalogsService.getOriginResource({full: true, rangeId: "1"})
    );
    this.countries.set(getCountry);
    this.phoneTypes.set(getPhoneType);
    this.identifications.set(getIdentificationType);
    this.ranges.set(getOriginResource);
   const serviceMap: Record<string, (data: any) => void> = {
      // TODO aqui van las demas secciones.
      'initial-data'     : (data) => this.firstDataClientService.setItem(mapToSignalInitialDataM(data)),
      // 'ppe-information'     : (data) => {this.ppeService.set(mapToSignalPPEm(data)),
      //                                   this.ppeService.setCopy(this.ppeService.get() ?? {ppe: false,
      //                                                                                     fppe: 'no',
      //                                                                                     dppe: 'no',
      //                                                                                     sappe: 'no',
      //                                                                                     dataClientFamilyPPE: [],
      //                                                                                     dataClientDepPPE: [],
      //                                                                                     dataClientSocAndAssoPPE: [],})},
      // 'resources-provider'     : (data) => {
      //   const resInfo= mapToSignalResourceProviderMant(data);
      //   this.resourceProviderService.setItem(resInfo),
      //   this.resourceProviderService.setItemCopy(resInfo)
      // },
      // 'real-owner'     : (data) => {
      //   const resInfo= mapToSignalRealOwnerMant(data);
      //   this.realOwnerService.setItem(resInfo),
      //   this.realOwnerService.setItemCopy(resInfo)
      // },
      // 'address'     : (data) =>{this.addressesService.set(mapToSignalAddressM(data)),
      //                           this.addressesService.setCopy(this.addressesService.get() ?? {addressList:[]})},
      // 'spouse-data'     : (data) =>this.spouseService.setItem(mapToCheckpointToSignalSpouse(data)),
      'identification-contact': async (data) => {
        const info = await checkpointMantToIdentificationAndContact(data, this.phoneTypes(), this.countries(), this.identifications());
        this.pageStorageService.setIdentificationAndContactInfo(info);
      },
      'signature': async (data) => {
        const info = await checkpointMantToSignSection(data, this.phoneTypes(), this.countries(), this.identifications(), this.zipCodeService);
        this.signStorageService.setSingSection(info);
      },
      'general-information' : async (data) => {
        const info = await checkpointMantToGeneralInfo(data, this.phoneTypes(), this.countries(), this.identifications())
        this.generalInfoStorageService.setFullSectionSingal(info);
      },
      'exchange-operation' : async (data) => {
        const info = checkpointToOperateChangeSectionMant(data);
        info ? this.operateChangesStorageService.setoperateChanges(info): console.log('No hay info capturada previamente para opera-cambios');
      },
      'bank-account'       : (data) => this.bankAccountCheckpointSignalService.setData(BankAccountMappers.bankAccountMapperQueryMaint(data)),
      'authorized-person'  : (data) => this.authorizedPersonSignalService.setData(AuthorizedPersonMapper.authorizedPersonMapperQueryMaint(data)),
      'beneficiaries'      : (data) => this.beneficiariesSignalService.setBeneficiaries(beneficiariesMapperQueryMaint(data)),
      'personal-interview' : (data) => this.personalInterviewService.setItem(mapResToPersonalInterview(data)),
      'fiscal-self-declaration' : (data) => this.fiscalSelfDeclarationDataService.setItem(mapResToSignalFiscalSelfDeclarationM(data)),
      'privacy-notice'     : (data) => this.privacyNoticeService.setItem(data),
      'actiweb'            : (data) => this.actiwebService.setItem(data),
      'additional-information': (data) => {
        const info = additionalInfoCheckpointToSection(data)
        this.additionalInfoService.setItem(info);
      },
      'credit-information' : (data) => this.creditDataService.setItem(data),
      // 'tax-profile'        : (data) => this.taxProfileService.setItem(mapToCheckpointToSignalTaxProfile(data)),
      'questionnairePld'   : (data) => this.pldQuizService.set(data),
      'transactional-investment-profile'  : (data) => {
        const info = checkpointMantToTransactionaInvestmentProfileSection(data, this.ranges())
        this.tiProfileService.setFullSectionSignal(info)
      },
    };

    for (const i in sections) {
      const handler = serviceMap[sections[i].sectionId];

      if (handler) {
        handler(sections[i].data);
      } else {
        console.log('la sección del servicio, no existe en nuestro map.');
      }

    }
  }

  /**
   * Registers an equity strategy.
   *
   * @param data The registration request data.
   * @returns An observable with the registration response.
   */
  registerEquity(data: EquityRegistrationRequest): Observable<EquityRegistrationResponse> {
    const url = environment.api.maintenance.equityRegister;
    return this.http.post(url, data);
  }
}
