import { inject, Injectable, signal } from '@angular/core';
import { CustomerClient } from '../models/customer-client-data';
import { CustomerNewContract } from '../models/customer-initial-data';
import { CustomerCurrentOnboardingInfo } from '../models/customer-current-onboarding';
import { PERSON_TYPE } from '../constants/customer-constants';
import { TABS_PF } from '../constants/customer-tabs';
import { CustomerTabs } from '../models/customer-tabs';
import { Observable, firstValueFrom } from 'rxjs';
import { HttpClientService } from '../../core/services/http-client.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { CustomerAddressesService } from './storage-services/customer-addresses.service';
import { CustomerAdditionalInfoService } from './storage-services/customer-additional-info.service';
import { CustomerIdentificationAndContactService } from './storage-services/customer-identification-and-contact.service';
import { CustomerFirstDataClientService } from './storage-services/customer-first-data-client.service';
import { CustomerGeneralInfoStorageService } from './storage-services/customer-general-info-storage.service';
import { CustomerPpeService } from './storage-services/customer-ppe.service';
import { CustomerSignStorageService } from './storage-services/customer-sign-storage.service';
import { CustomerFiscalSelfDeclarationDataClientService } from './storage-services/customer-fiscal-self-declaration.service';

import { mapToSignalAddress } from './mappers/response/customer-address';
import { mapToSignalInitialData } from './mappers/response/customer-initial-data-mapper';
import { mapToSignalPPE } from './mappers/response/customer-ppe-mapper';
import { mapToSignalRealOwner } from './mappers/response/customer-real-owner-mapper';
import { mapToSignalResourceProvider } from './mappers/response/customer-resources-provider';
import { checkpointToSignSection } from './mappers/customer-signature.mapper';
import { checkpointToGeneralInfo } from './mappers/customer-general-info.mapper';
import { checkpointToOperateChangeSection } from './mappers/customer-operate-changes.mapper';
import { CustomerCatalogsService } from './customer-catalogs.service';
import * as bankAccountMapper from './mappers/response/customer-bank-account-mapper';
import { mapResToSignalFiscalSelfDeclaration } from './mappers/response/customer-fiscal-self-declaration-mapper';

import { checkpointToIdentificationAndContact } from './mappers/customer-identification-and-contact.mapper';
import { CustomerPhoneType } from '../models/customer-phone-type';
import { CustomerCountries } from '../models/customer-country';
import { CustomerIdentificationType } from '../models/customer-identification-type';
import { exitentedClientToIdentificationAndContact } from './mappers/mappers-get-client/identification-and-contact.mapper';
import { mapToSignalInitialDataCustomer } from './mappers/mappers-get-client/initial-data-mapper';
import { mapToSignalAddressCustomer } from './mappers/mappers-get-client/address';
import { mapToSignalPPECustomer } from './mappers/mappers-get-client/ppe-mapper';
import { existingClientToGeneralInfo } from './mappers/mappers-get-client/general-info.mapper';


@Injectable({
  providedIn: 'root'
})
export class CustomerOnboardingService {

  private readonly http = inject(HttpClientService);
  private readonly authService = inject(AuthService);
  private readonly catalogsService = inject(CustomerCatalogsService);
  private readonly addressesService = inject(CustomerAddressesService);
  private readonly additionalInfoService = inject(CustomerAdditionalInfoService);
  private readonly pageStorageService = inject(CustomerIdentificationAndContactService);
  private readonly firstDataClientService = inject(CustomerFirstDataClientService);
  private readonly generalInfoStorageService = inject(CustomerGeneralInfoStorageService);
  private readonly ppeService = inject(CustomerPpeService);
  private readonly signStorageService = inject(CustomerSignStorageService);
  private readonly fiscalSelfDeclarationDataService = inject(CustomerFiscalSelfDeclarationDataClientService);

  private readonly url = environment.api.registerOnboarding;

  phoneTypes = signal<Array<CustomerPhoneType>>([]);
  countries = signal<Array<CustomerCountries>>([]);
  identifications = signal<Array<CustomerIdentificationType>>([]);

  constructor() { }

  /**
   * CustomerInformation of the current onboarding.
   */
  private _currentInfo = signal<CustomerCurrentOnboardingInfo>({
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
    clientId: 0,
    accountId: 0,
    accountData: null
  });

  readonly currentInfo = (this._currentInfo as any).asReadonly();

  /**
   * CustomerTabs for Onboarding
   */
  tabs = signal<Array<CustomerTabs>>([]);

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
  customerInitialData = signal<CustomerClient>({} as CustomerClient);

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
  updateCurrentOnboardingInfo(data: Partial<CustomerCurrentOnboardingInfo>): void {
    (this._currentInfo as any).update((item: any) => ({
      ...item,
      ...data
    }));
  }

  /**
   * Used to clear onboarding signals.
   */
  clearOnboardingInfo(): void {
    (this._currentInfo as any).set({
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
      clientId: 0,
      accountId: 0,
      accountData: null
    });


    (this.customerInitialData as any).set({} as CustomerClient);

    this._currentTab.set({
      previous: 0,
      current: 0
    });

    this.addressesService.clear();
    this.additionalInfoService.removeItem();
    this.pageStorageService.cleartIdentificationAndContactInfo();
    this.firstDataClientService.removeItem();
    this.generalInfoStorageService.clearGeneralInfoItem();
    this.ppeService.clear();
    this.signStorageService.clear();
    this.fiscalSelfDeclarationDataService.removeItem();
    this.restoreInitialTabs();
    this._onboardingRegister.set({});
  }
  restoreInitialTabs() {
    this.enableTabs
    this.disableTabs();
    this.enableTabs(['customer-info'])
    this.tabs.set(TABS_PF)
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
   *
   */
  finishOnboarding(): Observable<any> {
    const dd: { applicationId: string; advisorId: string; } = {
      applicationId: (this._currentInfo as any)().requestId,
      advisorId: (this.authService as any).getUserInfo()().employeeId
    };
    return this.http.post(this.url, dd, { headers: { business: 'cliente' } });
  }

  /**
   * Gets the current onboarding information.
   *
   * @returns The current information.
   */
  getCurrentInfo(): CustomerCurrentOnboardingInfo {
    return (this.currentInfo as any)();
  }

  /**
   * Method to enable tabs, passed as an array of string.
   * It works with the 'path'. Eg: ['customer-bank-account']
   *
   * If not param passed, then enable all tabs.
   */
  enableTabs(tabs?: string[]): void {
    let updated: Array<any> = [];

    if (tabs) {
      updated = this.tabs().map((item) => {
        if (tabs.indexOf(item.path) !== -1) {
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

  /**
   * Sets the CustomerTabs to show if Persona Fisica or Persona Moral onboarding.
   */
  setTabs(): void {
    this.tabs = signal<Array<CustomerTabs>>(TABS_PF);
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
  getTabs(): CustomerTabs[] {
    return this.tabs();
  }

  /**
   *
   */
  setCustomerInitalData(data: CustomerClient | CustomerNewContract): void {
    let currData: CustomerClient = (this.getCustomerInitialData as any)();

    console.log({ currData })
    console.log({ data })
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        currData[key] = value;
      }
    });
    (this.customerInitialData as any).set(currData);
    console.log('seteando tipo de persona')
    console.log({ currData })
    console.log(currData.personType);
    (this._currentInfo as any).update((item: any) => ({
      ...item,
      personType: (currData.personType === '1' ? 'PF' : 'PM')
    }));
  }

  /**
   *
   */
  getCustomerInitialData(): any {
    return (this.customerInitialData as any)();
  }

  /** // DEPRECATED LA PROPIEDAD POSICION Y A NO EXITE.
   * Get the tab with position 0 property on Array of CustomerTabs.
   * If no tab with position 0, it returs the first tab.
   */
  getFirstTab(): CustomerTabs {
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
    this.tabs.update(tabs => tabs.map(
      item => tabsToShow.includes(item.path) ? { ...item, hide: false } : item));
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
      // this.ranges.set(getOriginResource);
      const serviceMap: Record<string, (data: any) => void> = {
      'initialData': (data) => this.firstDataClientService.setItem(mapToSignalInitialDataCustomer(data)),
      'addresses': (data) => {
        const dataMap = mapToSignalAddressCustomer(data);
        this.addressesService.set(dataMap);
        this.addressesService.setCopy(dataMap);
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
      'fiscalSelfDeclaration': (data) => {
        console.log(data);  
        const fiscalSelf = mapResToSignalFiscalSelfDeclaration(data);
        this.fiscalSelfDeclarationDataService.setItem(fiscalSelf);

      },
      'factaObligation': (data) => {
        console.log(data);
      },
      'ppeInformation': (data) => {
        console.log(data);
        const dataMap = mapToSignalPPECustomer(data);
        this.ppeService.set(dataMap);
        this.ppeService.setCopy(dataMap);
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
   * Set CustomerCheckpoint Sections
   *
   */
  async setCheckpointSections(sections: Array<any>): Promise<void> {
    console.log(sections);

    // you can reuse this catalogs on your mappers:
    const addressTypeCatalog = await firstValueFrom((this.catalogsService as any).getAddressType({ addressTypeIds: [] }));
    (this.catalogsService as any).getCountry({ land: [] }).subscribe((c: any) => {
      this.countries.set(c);
    });
    (this.catalogsService as any).getPhoneType({ telephoneTypeIds: [] }).subscribe((c: any) => {
      this.phoneTypes.set(c);
    });
    (this.catalogsService as any).getIdentificationType({ types: [] }).subscribe((c: any) => {
      this.identifications.set(c);
    });
    const serviceMap: Record<string, (data: any) => void> = {
      // TODO aqui van las demas secciones.
      'address'     : (data) => ((this.addressesService as any) as any).set(mapToSignalAddress(data)),
      'fiscal-self-declaration': (data) => ((this.fiscalSelfDeclarationDataService as any) as any).setItem(mapResToSignalFiscalSelfDeclaration(data)),
      'identification-contact': async (data) => {
        const info = await checkpointToIdentificationAndContact(data, this.phoneTypes(), this.countries(), this.identifications());
        ((this.pageStorageService as any) as any).setIdentificationAndContactInfo(info);
      },
      // 'signature': async (data) => {
      //   const info = await checkpointToSignSection(data, this.phoneTypes(), this.countries(), this.identifications());
      //   ((this.signStorageService as any) as any).setSingSection(info);
      // },
      'general-information': (data) => ((this.generalInfoStorageService as any) as any).setGeneralInfoItem(checkpointToGeneralInfo(data)),
      // 'exchange-operation' : async (data) => {
      //   const info = checkpointToOperateChangeSection(data);
      //   info ? (this.operateChangesStorageService as any).setoperateChanges(info): console.log('No hay info capturada previamente para opera-cambios');
      // },
      'initial-data': (data) => ((this.firstDataClientService as any) as any).setItem(mapToSignalInitialData(data)),
      //'personal-interview': (data) => (this.personalInterviewService as any).setItem(mapResToPersonalInterview(data)),
      //'ppe-information'     : (data) => ((this.ppeService as any) as any).set(mapToSignalPPE(data)),
      // '-real-owner'     : (data) => ((this.realOwnerService as any) as any).setItem(mapToSignalRealOwner(data)),
      // 'resources-provider'     : (data) => ((this.resourceProviderService as any) as any).setItem(mapToSignalResourceProvider(data)),

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

}










export type OnboardingService = CustomerOnboardingService;























