import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { HttpClientService } from '../../core/services/http-client.service';
import { environment } from '../../../environments/environment';
import { CatalogsAllowed } from '../../shared/types/catalogs.type';
import { CustomerNationalities, CustomerNationalityRequest, CustomerNationalityResponse } from '../models/customer-nationality';
import { CustomerAddressRole, CustomerAddressRoleRequest, CustomerAddressType, CustomerAddressTypeRequest, CustomerProofOfAddressType, CustomerProofOfAddressTypeRequest, CustomerProofOfAddressTypeResponse } from '../models/customer-address';
import { CustomerCatalogById, CustomerEconomicActivity, CustomerEconomicActivityAccredited, CustomerEconomicActivityAccreditedRequest, CustomerEconomicActivityByPersonTypeRequest, CustomerEconomicActivityRequest, CustomerEconomicActivityResponse } from '../models/customer-economic-activity';
import { CustomerIdentificationType, CustomerIdentificationTypeRequest, CustomerIdentificationTypeResponse } from '../models/customer-identification-type';
import { CustomerMaritalStatus, CustomerMaritalStatusRequest, CustomerMaritalStatusResponse } from '../models/customer-marital-status';
import { CustomerOccupation, CustomerOccupationRequest, CustomerOccupationResponse } from '../models/customer-occupation';
import { CustomerMarriageType, CustomerMarriageTypeRequest, CustomerMarriageTypeResponse } from '../models/customer-marriage-type';
import { CustomerPersonType, CustomerPersonTypeRequest, CustomerPersonTypeResponse } from '../models/customer-person-type';
import { CustomerPhoneType, CustomerPhoneTypeRequest, CustomerPhoneTypeResponse } from '../models/customer-phone-type';
import { CustomerRelationshipRequest, CustomerRelationshipResponse, CustomerRelationships } from '../models/customer-relationships';
import { CustomerEntity, CustomerFederalEntityRequest, CustomerFederalEntityResponse } from '../models/customer-entity';
import { CustomerContract, CustomerContractRequest, CustomerContractTop, CustomerContractTopRequest } from '../models/customer-contract';
import { CustomerSubContract, CustomerSubContractRequest } from '../models/customer-subcontract';
import { CustomerAuthorizedPersonCatalog, CustomerAuthorizedPersonRequest } from '../models/customer-authorized-person-page-data';
import { CustomerAccountStatement, CustomerAccountStatementRequest } from '../models/customer-account-statement';
import { CustomerFiscalRegimeRequest, CustomerFiscalRegimeResponse, CustomerFiscalRegimes } from '../models/customer-fiscal-regime';
import { CustomerCFDI, CustomerCfdiRequest, CustomerCfdiResponse } from '../models/customer-cfdi';
import { CustomerSignatureType, CustomerSignatureTypeRequest } from '../models/customer-signature-type';
import { CustomerAmountMonthlyDeposit, CustomerAmountMonthlyDepositResponse, CustomerMonthlyDeposit, CustomerMonthlyDepositRequest, CustomerMonthlyDepositResponse } from '../models/customer-monthly-deposit';
import { CustomerCountries, CustomerCountryRequest, CustomerCountryResponse } from '../models/customer-country';
import { CustomerAccountType, CustomerAccountTypeRequest } from '../models/customer-account-type';
import { CustomerBank, CustomerBankRequest } from '../models/customer-bank';
import { CustomerCurrencyType, CustomerCurrencyTypeRequest } from '../models/customer-currency-type';
import { CustomerAmountRetreatsAvg, CustomerAmountRetreatsAvgRequest, CustomerAmountRetreatsAvgResponse } from '../models/customer-amount-retreats-avg';
import { CustomerTaxId, CustomerTaxIdRequest } from '../models/customer-tax-id';
import { CustomerPersonRole, CustomerPersonRoleRequest } from '../models/customer-person-role';
import { CustomerOriginResource, CustomerOriginResourceRequest, CustomerRanges } from '../models/customer-origin-resource';
import { CustomerServiceType, CustomerServiceTypeRequest } from '../models/customer-service-type';
import { CustomerServiceSubtype, CustomerServiceSubtypeRequest } from '../models/customer-service-subtype';
import { CustomerAccountRole, CustomerAccountRoleRequest } from '../models/customer-account-role';
import { CustomerFiscalCertificate, CustomerFiscalCertificateRequest } from '../models/customer-fiscal-certificate';
import { CustomerResidentialArea, CustomerResidentialAreaRequest } from '../models/customer-residential-area';
import { CustomerCatalogSavedLS } from '../models/customer-catalogs-localstorage';
import { NO_LOADING } from '../../core/interceptors/http-contexts';
import { HttpContext } from '@angular/common/http';
import { CustomerSector, CustomerSectorRequest } from '../models/customer-sector';
import { CustomerClientKnowledge, CustomerClientKnowledgeRequest } from '../models/customer-client-knowledge';
import { CustomerClientNoGuaranteedIpab, CustomerClientNoGuaranteedIpabRequest } from '../models/customer-client-no-guaranteed-ipab';
import { CustomerInterviewPlace, CustomerInterviewPlaceRequest } from '../models/customer-interview-place';
import { CustomerProfileInvestment, CustomerProfileInvestmentRequest } from '../models/customer-profile-investment';
import { CustomerPropertyType, CustomerPropertyTypeRequest } from '../models/customer-property-type';
import { CustomerInvestmentType, CustomerInvestmentTypeRequest } from '../models/customer-investment-type';
import { CustomerDocumentType, CustomerDocumentTypeRequest } from '../models/customer-document-type';
import { CustomerDistrictMunicipality, CustomerDistrictMunicipalityRequest } from '../models/customer-district-municipality';
import { CustomerAdvisor } from '../models/catalogs/customer-advisor';
import { CustomerFinancialCenter } from '../models/catalogs/customer-financial-center';
import { CustomerStartedWorking } from '../models/catalogs/customer-started-working';
import { CustomerFundsOriginCategory } from '../models/catalogs/customer-funds-origin-category';
import { CustomerFiscalPersonType, CustomerFiscalPersonTypeRequest } from '../models/customer-fiscal-person-type';
import { CustomerFiscalPersonSubType, CustomerFiscalPersonSubTypeRequest } from '../models/customer-fiscal-person-subtype';
import { CustomerTransactionalLimitsResponse } from '../models/customer-transactional-limits-response';
import { CustomerEconomicSector, CustomerEconomicSectorRequest } from '../models/customer-economic-sector';
import { CustomerRiskGroup, CustomerRiskGroupRequest } from '../models/customer-risk-group';
import { CustomerPaymentPeriod, CustomerPaymentPeriodRequest } from '../models/customer-payment-period';
import { CustomerExperienceTimeRequest, CustomerExperienceTimeResponse } from '../models/customer-experience-time';

import { EquityStrategyItem } from '../models/customer-equity-stategy';

@Injectable({
  providedIn: 'root'
})
export class CustomerCatalogsService {

  private readonly urls: any = environment.api.catalogs;

  private currentDay = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  noloadctx = new HttpContext().set(NO_LOADING, true);

  constructor(
    private localStorageService: LocalStorageService,
    private httpClientService: HttpClientService
  ) { }

  /**
   *
   * returns data stored on Local Storage ( if exists )
   */
  getLocal(name: CatalogsAllowed): CustomerCatalogSavedLS {
    return this.localStorageService.getCatalog(name);
  }


  /**
   * Account Statement
   *
   * accountStatement: HOST_ACTINVER + '/cross/catalogs/customer-account-statement'
   */
  getAccountStatement(body: CustomerAccountStatementRequest): Observable<CustomerAccountStatement[]> {
    const catalogName = 'accountStatement';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      //
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerAccountStatement[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerAccountStatement[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Account Type
   *
   * accountType: HOST_ACTINVER + '/cross/catalogs/customer-account-role'
   */
  getAccountRole(body: CustomerAccountRoleRequest): Observable<CustomerAccountRole[]> {
    const catalogName = 'accountRole';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerAccountRole[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerAccountRole[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerAccountRole[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerAccountRole[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Account Type
   *
   * accountType: HOST_ACTINVER + '/cross/catalogs/customer-account-type'
   */
  getAccountType(body: CustomerAccountTypeRequest): Observable<CustomerAccountType[]> {
    const catalogName = 'accountType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerAccountType[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerAccountType[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerAccountType[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerAccountType[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * CustomerAddress Role
   *
   * addressRol: HOST_ACTINVER + '/cross/catalogs/address-rol'
   */
  getAddressRole(body: CustomerAddressRoleRequest): Observable<CustomerAddressRole[]> {
    const catalogName = 'addressRole';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerAddressRole[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerAddressRole[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerAddressRole[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerAddressRole[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * CustomerAddress Type
   *
   * addressType: HOST_ACTINVER + '/cross/catalogs/address-type'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187334675/cross+catalogs+address-type
   */
  getAddressType(body: CustomerAddressTypeRequest): Observable<CustomerAddressType[]> {
    const catalogName = 'addressType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: any) => {
          this.localStorageService.setCatalog(catalogName, response['payload'][catalogName]['item']);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post(this.urls[catalogName], body).pipe(
        map((response: any) => {
          data.data = response['payload'][catalogName]['item'];
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * CustomerAdvisor
   *
   * addressType: HOST_ACTINVER + '/cross/catalogs/customer-advisor'
   */
  getAdvisor(): Observable<CustomerAdvisor[]> {
    const catalogName = ('advisor' as any);
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post(this.urls[catalogName], undefined, { context: this.noloadctx })
        .subscribe((response: any) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post(this.urls[catalogName]).pipe(
        map((response: any) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Amount Retreats Average
   *
   * amountRetreatsAvg: HOST_ACTINVER + '/cross/catalogs/average/amount/retreats'
   */
  getAmountRetreatsAvg(body: CustomerAmountRetreatsAvgRequest): Observable<CustomerAmountRetreatsAvg[]> {
    const catalogName = 'amountRetreatsAvg';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerAmountRetreatsAvgResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerAmountRetreatsAvgResponse) => {
          this.localStorageService.setCatalog(catalogName, response.payload.ranges);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerAmountRetreatsAvgResponse>(this.urls[catalogName], body).pipe(
        map((response: CustomerAmountRetreatsAvgResponse) => {
          data.data = response.payload.ranges;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Authorized Person
   *
   * authorizedPerson: HOST_ACTINVER + '/cross/catalogs/customer-authorized-person'
   */
  getAuthorizedPerson(body: CustomerAuthorizedPersonRequest): Observable<CustomerAuthorizedPersonCatalog[]> {
    const catalogName = 'authorizedPerson';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerAuthorizedPersonCatalog[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerAuthorizedPersonCatalog[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerAuthorizedPersonCatalog[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerAuthorizedPersonCatalog[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * CustomerBank
   *
   * bank: HOST_ACTINVER + '/cross/catalogs/banks'
   */
  getBank(body: CustomerBankRequest): Observable<CustomerBank[]> {
    const catalogName = 'customer-bank';
    const idKey = body?.country?.toString() ?? 'default';

    const CustomerCatalogById: CustomerCatalogById = this.localStorageService.getSeparatedByIdCatalog(catalogName);
    const dataForId = CustomerCatalogById[idKey] || { data: [], updatedAt: '' };

    if (dataForId.data.length > 0 && dataForId.updatedAt === this.currentDay) {
      return of(dataForId.data);
    }

    if (dataForId.data.length > 0 && dataForId.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerBank[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerBank[]) => {
          const items = response;
          this.localStorageService.setSeparatedByIdCatalog(catalogName, idKey, items);
        });
      return of(dataForId.data);
    }

    if (dataForId.data.length === 0) {
      return this.httpClientService.post<CustomerBank[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerBank[]) => {
          const items = response;
          this.localStorageService.setSeparatedByIdCatalog(catalogName, idKey, items);
          return items;
        })
      );
    }

    return of(dataForId.data);
  }

  /**
   * CustomerCFDI
   *
   * cfdi: HOST_ACTINVER + '/cross/catalogs/customer-cfdi'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/242253825/cross+catalogs+cfdi
   */
  getCfdi(body: CustomerCfdiRequest): Observable<CustomerCFDI[]> {
    const catalogName: CatalogsAllowed = 'customer-cfdi' as CatalogsAllowed;
    const idKey =
      (body?.personType?.toString() ?? 'default') +
      '-' +
      (body?.fiscalRegimeId?.toString() ?? 'default')

    const CustomerCatalogById: CustomerCatalogById = this.localStorageService.getSeparatedByIdCatalog(catalogName);
    const dataForId = CustomerCatalogById[idKey] || { data: [], updatedAt: '' };

    if (dataForId.data.length > 0 && dataForId.updatedAt === this.currentDay) {
      return of(dataForId.data);
    }

    if (dataForId.data.length > 0 && dataForId.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerCfdiResponse>(this.urls['customer-cfdi'], body, { context: this.noloadctx })
        .subscribe((response: CustomerCfdiResponse) => {
          const items = response.payload.cfdi.item;
          this.localStorageService.setSeparatedByIdCatalog(catalogName, idKey, items);
        });
      return of(dataForId.data);
    }

    if (dataForId.data.length === 0) {
      return this.httpClientService.post<CustomerCfdiResponse>(this.urls['customer-cfdi'], body).pipe(
        map((response: CustomerCfdiResponse) => {
          const items = response.payload.cfdi.item;
          this.localStorageService.setSeparatedByIdCatalog(catalogName, idKey, items);
          return items;
        })
      );
    }

    return of(dataForId.data);
  }

  /**
   * Classification Person
   *
   * cfdi: HOST_ACTINVER + '/cross/catalogs/customer-person-type'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187367537/cross+catalogs+person-type
   */
  getClassificationPerson(body: CustomerPersonTypeRequest): Observable<CustomerPersonType[]> {
    let data = this.localStorageService.getClassificationPersonByPersonType(body.personType);
    if (0 === data.length) {
      return this.httpClientService.post<CustomerPersonTypeResponse>(this.urls['classificationPerson'], body)
        .pipe(
          map((response: CustomerPersonTypeResponse) => {
            const niuArr: CustomerPersonType[] = response.payload.personType.item.map((it: CustomerPersonType) => {
              if (it.personTypeId == null) {
                it.personTypeId = '1';
              }
              return it;
            });
            this.localStorageService.setClassificationPersonByPersonType(niuArr);
            data = response.payload.personType.item.filter((item: CustomerPersonType) => item.personTypeId === body.personType);

            return data;
          })
        );
    }
    return of(data);
  }

  /**
   * Interview knowledge
   *
   * contractTop: HOST_ACTINVER + ' /cross/catalogs/customer-client-knowledge'
   */
  getClientKnowledge(body: CustomerClientKnowledgeRequest): Observable<CustomerClientKnowledge[]> {
    const catalogName = 'clientKnowledge';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerClientKnowledge[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerClientKnowledge[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerClientKnowledge[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerClientKnowledge[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * CustomerClient no guaranteed ipab
   *
   * contractTop: HOST_ACTINVER + '/cross/catalogs/contracts/customer-client-no-guaranteed-ipab'
   */
  getClientNoGuaranteedIpab(body: CustomerClientNoGuaranteedIpabRequest): Observable<CustomerClientNoGuaranteedIpab[]> {

    const catalogName = 'clientNoGuaranteedIpab';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerClientNoGuaranteedIpab[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerClientNoGuaranteedIpab[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerClientNoGuaranteedIpab[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerClientNoGuaranteedIpab[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }



  /**
   * CustomerContract catalog.
   *
   * contract: HOST_ACTINVER + '/cross/catalogs/contracts'
   */
  getContract(body: CustomerContractRequest): Observable<CustomerContract[]> {
    let data = this.localStorageService.getContracts(body.personTypeId);
    if (0 === data.length) {
      return this.httpClientService.post<CustomerContract[]>(this.urls['customer-contract'], body).pipe(
        map((response: CustomerContract[]) => {
          data = response;
          this.localStorageService.setContracts(body.personTypeId, data);
          return data;
        })
      );
    }
    return of(data);
  }

  /**
   * CustomerContract Top 3
   *
   * contractTop: HOST_ACTINVER + '/cross/catalogs/contracts/search'
   */
  getContractTop(body: CustomerContractTopRequest): Observable<CustomerContractTop[]> {

    const catalogName = body.personTypeId === 1 ? 'contractTopPerson' : 'contractTopLegal';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerContractTop[]>(this.urls['contractTop'], body, { context: this.noloadctx })
        .subscribe((response: CustomerContractTop[]) => {
          this.localStorageService.setCatalog(catalogName, this.top3Contracts(response));
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerContractTop[]>(this.urls['contractTop'], body).pipe(
        map((response: CustomerContractTop[]) => {
          console.log(response);
          data.data = this.top3Contracts(response);
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Country
   *
   * country: HOST_ACTINVER + '/cross/catalogs/countries'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/206864402/cross+catalogs+countries
   */
  getCountry(body: CustomerCountryRequest): Observable<CustomerCountries[]> {

    if (0 === body.land.length) {
      body.land.push("");
    }

    const catalogName = 'country';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerCountryResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerCountryResponse) => {
          this.localStorageService.setCatalog(catalogName, response.payload.countries);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerCountryResponse>(this.urls[catalogName], body).pipe(
        map((response: CustomerCountryResponse) => {
          data.data = response.payload.countries;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Currency Type
   *
   * currencyType: HOST_ACTINVER + '/cross/catalogs/customer-currency-type'
   */
  getCurrencyType(body: CustomerCurrencyTypeRequest): Observable<CustomerCurrencyType[]> {

    const catalogName = 'currencyType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerCurrencyType[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerCurrencyType[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerCurrencyType[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerCurrencyType[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * District-Municipality catalog
   *
   * districtMnicipality: HOST_ACTINVER + '/cross/catalogs/customer-district-municipality',
   */
  getDistrictMunicipality(body: CustomerDistrictMunicipalityRequest[]): Observable<CustomerDistrictMunicipality[]> {
    const catalogName = 'documentType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerDistrictMunicipality[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerDistrictMunicipality[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerDistrictMunicipality[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerDistrictMunicipality[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Document Type catalog
   *
   * documentType: HOST_ACTINVER + '/cross/catalogs/customer-document-type',
   */
  getDocumentType(body: CustomerDocumentTypeRequest): Observable<CustomerDocumentType[]> {
    const catalogName = 'documentType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerDocumentType[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerDocumentType[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerDocumentType[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerDocumentType[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Economic Activity
   *
   * economicActivity    : HOST_ACTINVER + '/cross/catalogs/economic-activity'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187334764/cross+catalogs+economic-activity
   */
  getEconomicActivity(body: CustomerEconomicActivityRequest): Observable<CustomerEconomicActivity[]> {
    const catalogName = 'economicActivity';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerEconomicActivityResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerEconomicActivityResponse) => {
          this.localStorageService.setCatalog(catalogName, response['payload'][catalogName]['item']);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerEconomicActivityResponse>(this.urls[catalogName], body).pipe(
        map((response: CustomerEconomicActivityResponse) => {
          data.data = response['payload'][catalogName]['item'];
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

    /**
   * Economic Activity Accredited
   *
   * economicActivity    : HOST_ACTINVER + '/cross/catalogs/economic-activity-accredited'
   */

  getEconomicActivityAccredited(body: CustomerEconomicActivityAccreditedRequest): Observable<CustomerEconomicActivityAccredited[]> {
    const catalogName = 'economicActivityAccredited';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerEconomicActivityAccredited>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerEconomicActivityAccredited) => {
          this.localStorageService.setCatalog(catalogName, (response as any).payload[catalogName]);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerEconomicActivityAccredited>(this.urls[catalogName], body).pipe(
        map((response: CustomerEconomicActivityAccredited) => {
          data.data = (response as any);
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Risk Group
   *
   * riskGroup    : HOST_ACTINVER + '/cross/catalogs/customer-risk-group'
   */

  getRiskGroup(body: CustomerRiskGroupRequest): Observable<CustomerRiskGroup[]> {
    const catalogName = 'riskGroup';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerRiskGroup>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerRiskGroup) => {
          this.localStorageService.setCatalog(catalogName, (response as any).payload[catalogName]);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerRiskGroup>(this.urls[catalogName], body).pipe(
        map((response: CustomerRiskGroup) => {
          data.data = (response as any);
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }


  /**
   * Economic CustomerSector
   *
   * economicSector    : HOST_ACTINVER + '/cross/catalogs/customer-economic-sector'
   */

  getEconomicSector(body: CustomerEconomicSectorRequest): Observable<CustomerEconomicSector[]> {
    const catalogName = 'economicSector';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerEconomicSector>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerEconomicSector) => {
          this.localStorageService.setCatalog(catalogName, (response as any).payload[catalogName]);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerEconomicSector>(this.urls[catalogName], body).pipe(
        map((response: CustomerEconomicSector) => {
          data.data = (response as any);
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }


  /**
   * Payment Period
   *
   * paymentPeriod    : HOST_ACTINVER + '/cross/catalogs/customer-payment-period'
   */

  getPaymentPeriod(body: CustomerPaymentPeriodRequest): Observable<CustomerPaymentPeriod[]> {
    const catalogName = 'paymentPeriod';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerPaymentPeriod>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerPaymentPeriod) => {
          this.localStorageService.setCatalog(catalogName, (response as any).payload[catalogName]);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerPaymentPeriod>(this.urls[catalogName], body).pipe(
        map((response: CustomerPaymentPeriod) => {
          data.data = (response as any);
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
 * Economic Activity by Person Type
 *
 * economicActivity    : HOST_ACTINVER + '/cross/catalogs/economic-activity'
 */
  getEconomicActivityByPersonType(body: CustomerEconomicActivityByPersonTypeRequest): Observable<CustomerEconomicActivity[]> {
    const catalogName: CatalogsAllowed = 'economicActivityById';
    const idKey = body?.subPersonTypeId?.toString() ?? 'default';

    const CustomerCatalogById: CustomerCatalogById = this.localStorageService.getSeparatedByIdCatalog(catalogName);
    const dataForId = CustomerCatalogById[idKey] || { data: [], updatedAt: '' };

    if (dataForId.data.length > 0 && dataForId.updatedAt === this.currentDay) {
      return of(dataForId.data);
    }

    if (dataForId.data.length > 0 && dataForId.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerEconomicActivityResponse>(this.urls['economicActivity'], body, { context: this.noloadctx })
        .subscribe((response: CustomerEconomicActivityResponse) => {
          const items = response.payload.economicActivity.item;
          this.localStorageService.setSeparatedByIdCatalog(catalogName, idKey, items);
        });
      return of(dataForId.data);
    }

    if (dataForId.data.length === 0) {
      return this.httpClientService.post<CustomerEconomicActivityResponse>(this.urls['economicActivity'], body).pipe(
        map((response: CustomerEconomicActivityResponse) => {
          const items = response.payload.economicActivity.item;
          this.localStorageService.setSeparatedByIdCatalog(catalogName, idKey, items);
          return items;
        })
      );
    }

    return of(dataForId.data);
  }

    /**
 * Economic Activity by Person Type
 *
 * economicActivity    : HOST_ACTINVER + '/cross/catalogs/customer-experience-time'
 */
    getExperienceTime(body: CustomerExperienceTimeRequest): Observable<CustomerExperienceTimeResponse[]> {
      const catalogName: CatalogsAllowed = 'experienceTime';
      const idKey = body?.idTipoPersona?.toString() ?? 'default';

      const CustomerCatalogById: CustomerCatalogById = this.localStorageService.getSeparatedByIdCatalog(catalogName);
      const dataForId = CustomerCatalogById[idKey] || { data: [], updatedAt: '' };

      if (dataForId.data.length > 0 && dataForId.updatedAt === this.currentDay) {
        return of(dataForId.data);
      }

      if (dataForId.data.length > 0 && dataForId.updatedAt !== this.currentDay) {
        this.httpClientService.post<CustomerExperienceTimeResponse[]>(this.urls['experienceTime'], body, { context: this.noloadctx })
          .subscribe((response: CustomerExperienceTimeResponse[]) => {
            const items = response;
            this.localStorageService.setSeparatedByIdCatalog(catalogName, idKey, items);
          });
        return of(dataForId.data);
      }

      if (dataForId.data.length === 0) {
        return this.httpClientService.post<CustomerExperienceTimeResponse[]>(this.urls['experienceTime'], body).pipe(
          map((response: CustomerExperienceTimeResponse[]) => {
            const items = response;
            this.localStorageService.setSeparatedByIdCatalog(catalogName, idKey, items);
            return items;
          })
        );
      }

      return of(dataForId.data);
    }

  /**
   * Federal CustomerEntity catalog
   *
   * federalEntity: host + '/cross/catalogs/federal-entity'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187334764/cross+catalogs+economic-activity
   */
  getFederalEntity(body: CustomerFederalEntityRequest): Observable<CustomerEntity[]> {
    const catalogName = 'federalEntity';

    if (0 === body.land1s.length) {
      body.land1s.push("");
    }

    let data = this.getLocal(catalogName);
    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerFederalEntityResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerFederalEntityResponse) => {
          this.localStorageService.setCatalog(catalogName, response['payload'][catalogName]['item']);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerFederalEntityResponse>(this.urls[catalogName], body).pipe(
        map((response: CustomerFederalEntityResponse) => {
          data.data = response['payload'][catalogName]['item'];
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data
        })
      );
    }
    return of(data.data);
  }

  /**
   * Financial center
   *
   * addressType: HOST_ACTINVER + '/cross/catalogs/customer-financial-center'
   */
  getFinancialCenter(): Observable<CustomerFinancialCenter[]> {
    const catalogName = 'financialCenter';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post(this.urls[catalogName], { context: this.noloadctx })
        .subscribe((response: any) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post(this.urls[catalogName]).pipe(
        map((response: any) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Fiscal person type
   *
   * fiscalPersonType: HOST_ACTINVER + '/cross/catalogs/customer-fiscal-person-type'
   */
  getFiscalPersonType(body: CustomerFiscalPersonTypeRequest): Observable<CustomerFiscalPersonType[]> {

    if (0 === body.land.length) {
      body.land.push("");
    }

    const catalogName = 'fiscalPersonType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerFiscalPersonType[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerFiscalPersonType[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerFiscalPersonType[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerFiscalPersonType[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }


  /**
   * Fiscal person subtype
   *
   * fiscalPersonType: HOST_ACTINVER + '/cross/catalogs/customer-fiscal-person-subtype'
   */
  getFiscalPersonSubType(body: CustomerFiscalPersonSubTypeRequest): Observable<CustomerFiscalPersonSubType[]> {

    if (0 === body.land.length) {
      body.land.push("");
    }

    const catalogName = 'fiscalPersonSubType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerFiscalPersonSubType[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerFiscalPersonSubType[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerFiscalPersonSubType[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerFiscalPersonSubType[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Fiscal Certificate
   *
   * fiscalCertificate: HOST_ACTINVER + '/cross/catalogs/customer-fiscal-certificate'
   */
  getFiscalCertificate(body: CustomerFiscalCertificateRequest): Observable<CustomerFiscalCertificate[]> {
    const catalogName = 'fiscalCertificate';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerFiscalCertificate[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerFiscalCertificate[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerFiscalCertificate[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerFiscalCertificate[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Fiscal Regime
   *
   * fiscalRegime: HOST_ACTINVER + '/cross/catalogs/customer-fiscal-regime'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/242352129/cross+catalogs+fiscal-regime
   */
  getFiscalRegime(body: CustomerFiscalRegimeRequest): Observable<CustomerFiscalRegimes[]> {
    const catalogName = 'fiscalRegime';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerFiscalRegimeResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerFiscalRegimeResponse) => {
          this.localStorageService.setCatalog(catalogName, response.payload.fiscalRegime.item);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerFiscalRegimeResponse>(this.urls[catalogName], body).pipe(
        map((response: CustomerFiscalRegimeResponse) => {
          data.data = response.payload.fiscalRegime.item;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Funds origin category
   *
   * addressType: HOST_ACTINVER + '/cross/catalogs/customer-funds-origin-category'
   */
  getFundsOriginCategory(): Observable<CustomerFundsOriginCategory[]> {
    const catalogName = 'fundsOriginCategory';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post(this.urls[catalogName], { context: this.noloadctx })
        .subscribe((response: any) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post(this.urls[catalogName]).pipe(
        map((response: any) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }


  /**
   * CustomerIdentification Type
   *
   * identificationType: HOST_ACTINVER + '/cross/catalogs/identification-type'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187367706/cross+catalogs+identification-type
   */
  getIdentificationType(body: CustomerIdentificationTypeRequest): Observable<CustomerIdentificationType[]> {
    const catalogName = 'identificationType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerIdentificationTypeResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerIdentificationTypeResponse) => {
          this.localStorageService.setCatalog(catalogName, response['payload'][catalogName]['item']);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerIdentificationTypeResponse>(this.urls[catalogName], body).pipe(
        map((response: CustomerIdentificationTypeResponse) => {
          data.data = response['payload'][catalogName]['item'];
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }


  /**
   * Investment Type catalog
   *
   * investmentType: HOST_ACTINVER + '/cross/catalogs/customer-investment-type',
   */
  getInvestmentType(body: CustomerInvestmentTypeRequest): Observable<CustomerInvestmentType[]> {
    const catalogName = 'investmentType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerInvestmentType[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerInvestmentType[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerInvestmentType[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerInvestmentType[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }



  /**
   * Interview places
   *
   * contractTop: HOST_ACTINVER + '/cross/catalogs/contracts/customer-interview-place'
   */
  getInterviewPlaces(body: CustomerInterviewPlaceRequest): Observable<CustomerInterviewPlace[]> {

    const catalogName = 'interviewPlaces';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerInterviewPlace[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerInterviewPlace[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerInterviewPlace[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerInterviewPlace[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }


  /**
   * Marital Status
   *
   * maritalStatus: HOST_ACTINVER + '/cross/catalogs/marital-status'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187367782/cross+catalogs+marital-status
   */
  getMaritalStatus(body: CustomerMaritalStatusRequest): Observable<CustomerMaritalStatus[]> {
    const catalogName = 'maritalStatus';
    if (0 === body.maritalStatusIds.length) {
      body.maritalStatusIds.push("");
    }
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerMaritalStatusResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerMaritalStatusResponse) => {
          this.localStorageService.setCatalog(catalogName, response['payload'][catalogName]['item']);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerMaritalStatusResponse>(this.urls[catalogName], body).pipe(
        map((response: CustomerMaritalStatusResponse) => {
          data.data = response['payload'][catalogName]['item'];
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Marriage Type catalog.
   *
   * marriageType: HOST_ACTINVER + '/cross/catalogs/customer-marriage-type'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187367506/cross+catalogs+marriage-type
   */
  getMarriageType(body: CustomerMarriageTypeRequest): Observable<CustomerMarriageType[]> {
    const catalogName = 'marriageType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerMarriageTypeResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerMarriageTypeResponse) => {
          this.localStorageService.setCatalog(catalogName, response['payload'][catalogName]['item']);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerMarriageTypeResponse>(this.urls[catalogName], body).pipe(
        map((response: CustomerMarriageTypeResponse) => {
          data.data = response['payload'][catalogName]['item'];
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Monthly Deposit
   *
   * monthlyDeposit: HOST_ACTINVER + '/cross/catalogs/monthly-operationals-number'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/2762244097/cross+catalogs+monthly-operationals-number
   */
  getMonthlyDeposit(body: CustomerMonthlyDepositRequest): Observable<CustomerMonthlyDeposit[]> {
    const catalogName = 'monthlyDeposit';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerMonthlyDepositResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerMonthlyDepositResponse) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerMonthlyDepositResponse>(this.urls[catalogName], body).pipe(
        map((response: CustomerMonthlyDepositResponse) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Monthly Deposit Average
   *
   * monthlyDepositAvg: HOST_ACTINVER + '/cross/catalogs/monthly-operationals-amount'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/2761097678/cross+catalogs+monthly-operationals-amount
   */
  getMonthlyDepositAvg(body: CustomerMonthlyDepositRequest): Observable<CustomerAmountMonthlyDeposit[]> {
    const catalogName = 'monthlyDepositAvg';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerAmountMonthlyDepositResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerAmountMonthlyDepositResponse) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerAmountMonthlyDepositResponse>(this.urls[catalogName], body).pipe(
        map((response: CustomerAmountMonthlyDepositResponse) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Nationality catalog.
   *
   * nationality : HOST_ACTINVER + '/cross/catalogs/nationalities'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187334886/cross+catalogs+nationalities
   */
  getNationalities(body: CustomerNationalityRequest): Observable<CustomerNationalities[]> {
    const catalogName = 'nationality';
    let data = this.getLocal(catalogName);
    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerNationalityResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerNationalityResponse) => {
          this.localStorageService.setCatalog(catalogName, response['payload']['nationalities']);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerNationalityResponse>(this.urls[catalogName], body).pipe(
        map((response: CustomerNationalityResponse) => {
          data.data = response['payload']['nationalities'];
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * CustomerOccupation catalog.
   *
   * occupations: HOST_ACTINVER + '/cross/catalogs/occupations'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187367675/cross+catalogs+occupations
   */
  getOccupations(body: CustomerOccupationRequest): Observable<CustomerOccupation[]> {
    const catalogName = 'occupations';
    if (0 === body.ocupationIds.length) {
      body.ocupationIds.push("");
    }
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerOccupationResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerOccupationResponse) => {
          this.localStorageService.setCatalog(catalogName, response['payload']['occupation']['item']);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerOccupationResponse>(this.urls[catalogName], body).pipe(
        map((response: CustomerOccupationResponse) => {
          data.data = response['payload']['occupation']['item'];
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Origin Resource
   *
   * origin_resource: HOST_ACTINVER + '/cross/catalogs/origin/resources'
   */
  getOriginResource(body: CustomerOriginResourceRequest): Observable<CustomerRanges[]> {
    const catalogName = 'origin_resource';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerOriginResource>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerOriginResource) => {
          this.localStorageService.setCatalog(catalogName, response['payload']['ranges']);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerOriginResource>(this.urls[catalogName], body).pipe(
        map((response: CustomerOriginResource) => {
          data.data = response['payload']['ranges'];
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Person Role
   *
   * personRole: HOST_ACTINVER + '/cross/catalogs/person-rol'
   */
  getPersonRole(body: CustomerPersonRoleRequest): Observable<CustomerPersonRole[]> {
    const catalogName = 'personRole';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerPersonRole[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerPersonRole[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerPersonRole[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerPersonRole[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Person Type catalog. // DEPRECATED se queda este catálogo en front.
   *
   * personType: HOST_ACTINVER + '/cross/catalogs/customer-person-type'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187367537/cross+catalogs+person-type
   */
  getPersonType(body: CustomerPersonTypeRequest): Observable<CustomerPersonType[]> {
    if (0 === body.subPersonTypeIds.length) {
      body.subPersonTypeIds.push("");
    }

    const catalogName = 'personType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerPersonTypeResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerPersonTypeResponse) => {
          this.localStorageService.setCatalog(catalogName, response.payload.personType.item);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerPersonTypeResponse>(this.urls[catalogName], body).pipe(
        map((response: CustomerPersonTypeResponse) => {
          data.data = response.payload.personType.item;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Telephone Type
   *
   * CustomerPhoneType: HOST_ACTINVER + '/cross/catalogs/telephone-type'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187367624/cross+catalogs+telephone-type
   */
  getPhoneType(body: CustomerPhoneTypeRequest): Observable<CustomerPhoneType[]> {
    const catalogName = 'phoneType';
    let data = this.getLocal(catalogName as any);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerPhoneTypeResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerPhoneTypeResponse) => {
          this.localStorageService.setCatalog(catalogName, response.payload.telephoneType.item);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerPhoneTypeResponse>(this.urls[catalogName], body).pipe(
        map((response: CustomerPhoneTypeResponse) => {
          data.data = response.payload.telephoneType.item;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Proof of CustomerAddress catalog
   *
   * proofOfAddressType: host + '/cross/catalogs/proof-of-address-type'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187334802/cross+catalogs+proof-of-address-type
   */
  getProofOfAddress(body: CustomerProofOfAddressTypeRequest): Observable<CustomerProofOfAddressType[]> {
    if (0 === body.proofAddressIds.length) {
      body.proofAddressIds.push("");
    }
    const catalogName = 'proofOfAddressType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerProofOfAddressTypeResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerProofOfAddressTypeResponse) => {
          this.localStorageService.setCatalog(catalogName, response['payload']['proofOfAddressType']['item']);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerProofOfAddressTypeResponse>(this.urls[catalogName], body).pipe(
        map((response: CustomerProofOfAddressTypeResponse) => {
          data.data = response['payload']['proofOfAddressType']['item'];
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Profile investment catalog
   *
   * profileInvestment: HOST_ACTINVER + '/cross/catalogs/customer-profile-investment',
   */
  getProfileInvestment(body: CustomerProfileInvestmentRequest): Observable<CustomerProfileInvestment[]> {
    const catalogName = 'profileInvestment';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerProfileInvestment[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerProfileInvestment[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerProfileInvestment[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerProfileInvestment[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Property Type catalog
   *
   * propertyType: HOST_ACTINVER + '/cross/catalogs/customer-property-type',
   */
  getPropertyType(body: CustomerPropertyTypeRequest): Observable<CustomerPropertyType[]> {
    const catalogName = 'propertyType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerPropertyType[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerPropertyType[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerPropertyType[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerPropertyType[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }


  /**
   * Relationship catalog.
   *
   * relationships: HOST_ACTINVER + '/cross/catalogs/customer-relationships'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187367578/cross+catalogs+relationships
   */
  getRelationships(body: CustomerRelationshipRequest): Observable<CustomerRelationships[]> {
    const catalogName = ('relationships' as any);
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerRelationshipResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerRelationshipResponse) => {
          this.localStorageService.setCatalog(catalogName, response['payload']['relationship']['item']);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerRelationshipResponse>(this.urls[catalogName], body).pipe(
        map((response: CustomerRelationshipResponse) => {
          data.data = response['payload']['relationship']['item'];
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Residential Area
   *
   * residentialArea: HOST_ACTINVER + '/cross/catalogs/customer-residential-area',
   */
  getResidentialArea(body: CustomerResidentialAreaRequest): Observable<CustomerResidentialArea[]> {
    const catalogName = 'residentialArea';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerResidentialArea[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerResidentialArea[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerResidentialArea[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerResidentialArea[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * sector
   *
   * sector: HOST_ACTINVER + '/cross/catalogs/customer-sector',
   */
  getSector(body: CustomerSectorRequest): Observable<CustomerSector[]> {
    const catalogName = ('sector' as any);
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerSector[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerSector[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerSector[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerSector[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Service Type
   *
   * serviceType: HOST_ACTINVER + '/cross/customer-catalogs.service-type'
   */
  getServiceType(body: CustomerServiceTypeRequest): Observable<CustomerServiceType[]> {
    const catalogName = 'serviceType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerServiceType[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerServiceType[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerServiceType[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerServiceType[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Service Subtype
   *
   * serviceSubtype: HOST_ACTINVER + '/cross/customer-catalogs.service-subtype'
   */
  getServiceSubtype(body: CustomerServiceSubtypeRequest): Observable<CustomerServiceSubtype[]> {
    const catalogName = 'serviceSubtype';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerServiceSubtype[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerServiceSubtype[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerServiceSubtype[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerServiceSubtype[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }


  /**
   * Signature Type
   *
   * signatureType: HOST_ACTINVER + '/cross/catalogs/customer-signature-type'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187334713/cross+catalogs+signature-type
   */
  getSignatureType(body: CustomerSignatureTypeRequest): Observable<CustomerSignatureType[]> {
    const catalogName = 'signatureType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerSignatureType[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerSignatureType[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerSignatureType[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerSignatureType[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Started Working
   *
   * addressType: HOST_ACTINVER + '/cross/catalogs/customer-started-working'
   */
  getStartedWorking(): Observable<CustomerStartedWorking[]> {
    const catalogName = 'startedWorking';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post(this.urls[catalogName], undefined, { context: this.noloadctx })
        .subscribe((response: any) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post(this.urls[catalogName]).pipe(
        map((response: any) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }


  /**
   * CustomerContract Sub Type | SubContractType
   *
   * subcontract: HOST_ACTINVER + '/cross/catalogs/contracts/sub-contracts'
   */
  getSubContract(body: CustomerSubContractRequest): Observable<any> { // CustomerSubContract[]
    let data = this.localStorageService.getSubcontracts(body.personTypeId, body.contractTypeId);
    if (0 === data.length) {
      return this.httpClientService.post<CustomerSubContract[]>(this.urls['customer-subcontract'], body).pipe(
        map((response: CustomerSubContract[]) => {
          data = response;
          this.localStorageService.setSubcontracts(body.personTypeId, body.contractTypeId, data);
          return data;
        })
      );
    }
    return of(data);
  }

  /**
   * Tax id
   *
   * CustomerTaxId: HOST_ACTINVER + '/cross/catalogs/tax-id'
   */
  getTaxId(body: CustomerTaxIdRequest): Observable<CustomerTaxId[]> {
    const catalogName = ('taxId' as any);
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerTaxId[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CustomerTaxId[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerTaxId[]>(this.urls[catalogName], body).pipe(
        map((response: CustomerTaxId[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * CustomerContract Sub Type | SubContractType
   *
   * subcontract: HOST_ACTINVER + '/cross/catalogs/contracts/transactional-limits'
   */
  getTransactionLimits(): Observable<any> {
    const catalogName = 'transactionalLimits';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CustomerTransactionalLimitsResponse[]>(this.urls[catalogName], {}, { context: this.noloadctx })
        .subscribe((response: CustomerTransactionalLimitsResponse[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CustomerTransactionalLimitsResponse[]>(this.urls[catalogName], {}).pipe(
        map((response: CustomerTransactionalLimitsResponse[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Equity strategies catalog
   * 
   * strategiesEquity: HOST_ACTINVER + '/cross/catalogs/strategies-equity'
   */
  getStrategiesEquity(forceRefresh: boolean = false): Observable<EquityStrategyItem[]> {
    const catalogName = 'strategiesEquity';
    let data = this.getLocal(catalogName);

    if (forceRefresh) {
      return this.httpClientService.get<EquityStrategyItem[]>(this.urls[catalogName]).pipe(
        map((response: EquityStrategyItem[]) => {
          this.localStorageService.setCatalog(catalogName, response);
          return response;
        })
      );
    }

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.get<EquityStrategyItem[]>(this.urls[catalogName], { context: this.noloadctx })
        .subscribe((response: EquityStrategyItem[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.get<EquityStrategyItem[]>(this.urls[catalogName]).pipe(
        map((response: EquityStrategyItem[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  createStrategyEquity(body: EquityStrategyItem): Observable<EquityStrategyItem> {
    const catalogName = 'strategiesEquity';
    return this.httpClientService.post<EquityStrategyItem>(this.urls[catalogName], body);
  }

  updateStrategyEquity(body: EquityStrategyItem): Observable<EquityStrategyItem> {
    const catalogName = 'strategiesEquity';
    return this.httpClientService.put<EquityStrategyItem>(this.urls[catalogName], body);
  }

  deleteStrategyEquity(id: number): Observable<any> {
    const catalogName = 'strategiesEquity';
    const body = { idStrategy: id };
    return this.httpClientService.delete<any>(this.urls[catalogName], { body } as any);
  }

  /**
   * Gets the first 3 contracts by ranking.
   */
  top3Contracts(response: CustomerContractTop[]): Array<CustomerContractTop> {
    let top3 = [];
    for (let i = 1; i <= 3; i++) {
      let found = response.find((item: any) => item.ranking === i);
      if (found) {
        top3.push(found);
      }
    }
    return top3;
  }
}

export type CatalogsService = CustomerCatalogsService;
