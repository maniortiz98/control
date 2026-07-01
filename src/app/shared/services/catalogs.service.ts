import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { HttpClientService } from '../../core/services/http-client.service';
import { environment } from '../../../environments/environment';
import { CatalogsAllowed } from '../types/catalogs.type';
import { Nationalities, NationalityRequest, NationalityResponse } from '../../onboarding/models/nationality';
import { AddressRole, AddressRoleRequest, AddressType, AddressTypeRequest, ProofOfAddressType, ProofOfAddressTypeRequest, ProofOfAddressTypeResponse } from '../../onboarding/models/address';
import { CatalogById, EconomicActivity, EconomicActivityAccredited, EconomicActivityAccreditedRequest, EconomicActivityByPersonTypeRequest, EconomicActivityRequest, EconomicActivityResponse } from '../../onboarding/models/economic-activity';
import { IdentificationType, IdentificationTypeRequest, IdentificationTypeResponse } from '../../onboarding/models/identification-type';
import { MaritalStatus, MaritalStatusRequest, MaritalStatusResponse } from '../../onboarding/models/marital-status';
import { Occupation, OccupationRequest, OccupationResponse } from '../../onboarding/models/occupation';
import { MarriageType, MarriageTypeRequest, MarriageTypeResponse } from '../../onboarding/models/marriage-type';
import { PersonType, PersonTypeRequest, PersonTypeResponse } from '../../onboarding/models/person-type';
import { PhoneType, PhoneTypeRequest, PhoneTypeResponse } from '../../onboarding/models/phone-type';
import { RelationshipRequest, RelationshipResponse, Relationships } from '../../onboarding/models/relationships';
import { Entity, FederalEntityRequest, FederalEntityResponse } from '../../onboarding/models/entity';
import { Contract, ContractRequest, ContractTop, ContractTopRequest } from '../../onboarding/models/contract';
import { SubContract, SubContractRequest } from '../../onboarding/models/subcontract';
import { AuthorizedPersonCatalog, AuthorizedPersonRequest } from '../../onboarding/models/authorized-person-page-data';
import { AccountStatement, AccountStatementRequest } from '../../onboarding/models/account-statement';
import { FiscalRegimeRequest, FiscalRegimeResponse, FiscalRegimes } from '../../onboarding/models/fiscal-regime';
import { CFDI, CfdiRequest, CfdiResponse } from '../../onboarding/models/cfdi';
import { SignatureType, SignatureTypeRequest } from '../../onboarding/models/signature-type';
import { AmountMonthlyDeposit, AmountMonthlyDepositResponse, MonthlyDeposit, MonthlyDepositRequest, MonthlyDepositResponse } from '../../onboarding/models/monthly-deposit';
import { Countries, CountryRequest, CountryResponse } from '../../onboarding/models/country';
import { AccountType, AccountTypeRequest } from '../../onboarding/models/account-type';
import { Bank, BankRequest } from '../../onboarding/models/bank';
import { CurrencyType, CurrencyTypeRequest } from '../../onboarding/models/currency-type';
import { AmountRetreatsAvg, AmountRetreatsAvgRequest, AmountRetreatsAvgResponse } from '../../onboarding/models/amount-retreats-avg';
import { TaxId, TaxIdRequest } from '../../onboarding/models/tax-id';
import { PersonRole, PersonRoleRequest } from '../../onboarding/models/person-role';
import { OriginResource, OriginResourceRequest, Ranges } from '../../onboarding/models/origin-resource';
import { ServiceType, ServiceTypeRequest } from '../../onboarding/models/service-type';
import { ServiceSubtype, ServiceSubtypeRequest } from '../../onboarding/models/service-subtype';
import { AccountRole, AccountRoleRequest } from '../../onboarding/models/account-role';
import { FiscalCertificate, FiscalCertificateRequest } from '../../onboarding/models/fiscal-certificate';
import { ResidentialArea, ResidentialAreaRequest } from '../../onboarding/models/residential-area';
import { CatalogSavedLS } from '../models/catalogs-localstorage';
import { NO_LOADING } from '../../core/interceptors/http-contexts';
import { HttpContext } from '@angular/common/http';
import { Sector, SectorRequest } from '../../onboarding/models/sector';
import { ClientKnowledge, ClientKnowledgeRequest } from '../../onboarding/models/client-knowledge';
import { ClientNoGuaranteedIpab, ClientNoGuaranteedIpabRequest } from '../../onboarding/models/client-no-guaranteed-ipab';
import { InterviewPlace, InterviewPlaceRequest } from '../../onboarding/models/interview-place';
import { ProfileInvestment, ProfileInvestmentRequest } from '../../onboarding/models/profile-investment';
import { PropertyType, PropertyTypeRequest } from '../../onboarding/models/property-type';
import { InvestmentType, InvestmentTypeRequest } from '../../onboarding/models/investment-type';
import { DocumentTypeRequest } from '../../onboarding/models/document-type';
import { DistrictMunicipality, DistrictMunicipalityRequest } from '../../onboarding/models/district-municipality';
import { Advisor } from '../../onboarding/models/catalogs/advisor';
import { FinancialCenter } from '../../onboarding/models/catalogs/financial-center';
import { StartedWorking } from '../../onboarding/models/catalogs/started-working';
import { FundsOriginCategory } from '../../onboarding/models/catalogs/funds-origin-category';
import { FiscalPersonType, FiscalPersonTypeRequest } from '../../onboarding/models/fiscal-person-type';
import { FiscalPersonSubType, FiscalPersonSubTypeRequest } from '../../onboarding/models/fiscal-person-subtype';
import { TransactionalLimitsResponse } from '../../onboarding/models/transactional-limits-response';
import { EconomicSector, EconomicSectorRequest } from '../../onboarding/models/economic-sector';
import { RiskGroup, RiskGroupRequest } from '../../onboarding/models/risk-group';
import { PaymentPeriod, PaymentPeriodRequest } from '../../onboarding/models/payment-period';
import { ExperienceTimeRequest, ExperienceTimeResponse } from '../../onboarding/models/experience-time';
import { EquityStrategyItem } from '../../maintenance/models/equity-stategy';

@Injectable({
  providedIn: 'root'
})
export class CatalogsService {

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
  getLocal(name: CatalogsAllowed): CatalogSavedLS {
    return this.localStorageService.getCatalog(name);
  }


  /**
   * Account Statement
   *
   * accountStatement: HOST_ACTINVER + '/cross/catalogs/account-statement'
   */
  getAccountStatement(body: AccountStatementRequest): Observable<AccountStatement[]> {
    const catalogName = 'accountStatement';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      //
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<AccountStatement[]>(this.urls[catalogName], body).pipe(
        map((response: AccountStatement[]) => {
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
   * accountType: HOST_ACTINVER + '/cross/catalogs/account-role'
   */
  getAccountRole(body: AccountRoleRequest): Observable<AccountRole[]> {
    const catalogName = 'accountRole';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<AccountRole[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: AccountRole[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<AccountRole[]>(this.urls[catalogName], body).pipe(
        map((response: AccountRole[]) => {
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
   * accountType: HOST_ACTINVER + '/cross/catalogs/account-type'
   */
  getAccountType(body: AccountTypeRequest): Observable<AccountType[]> {
    const catalogName = 'accountType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<AccountType[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: AccountType[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<AccountType[]>(this.urls[catalogName], body).pipe(
        map((response: AccountType[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Address Role
   *
   * addressRol: HOST_ACTINVER + '/cross/catalogs/address-rol'
   */
  getAddressRole(body: AddressRoleRequest): Observable<AddressRole[]> {
    const catalogName = 'addressRole';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<AddressRole[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: AddressRole[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<AddressRole[]>(this.urls[catalogName], body).pipe(
        map((response: AddressRole[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Address Type
   *
   * addressType: HOST_ACTINVER + '/cross/catalogs/address-type'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187334675/cross+catalogs+address-type
   */
  getAddressType(body: AddressTypeRequest): Observable<AddressType[]> {
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
   * Advisor
   *
   * addressType: HOST_ACTINVER + '/cross/catalogs/advisor'
   */
  getAdvisor(): Observable<Advisor[]> {
    const catalogName = 'advisor';
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
  getAmountRetreatsAvg(body: AmountRetreatsAvgRequest): Observable<AmountRetreatsAvg[]> {
    const catalogName = 'amountRetreatsAvg';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<AmountRetreatsAvgResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: AmountRetreatsAvgResponse) => {
          this.localStorageService.setCatalog(catalogName, response.payload.ranges);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<AmountRetreatsAvgResponse>(this.urls[catalogName], body).pipe(
        map((response: AmountRetreatsAvgResponse) => {
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
   * authorizedPerson: HOST_ACTINVER + '/cross/catalogs/authorized-person'
   */
  getAuthorizedPerson(body: AuthorizedPersonRequest): Observable<AuthorizedPersonCatalog[]> {
    const catalogName = 'authorizedPerson';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<AuthorizedPersonCatalog[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: AuthorizedPersonCatalog[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<AuthorizedPersonCatalog[]>(this.urls[catalogName], body).pipe(
        map((response: AuthorizedPersonCatalog[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Bank
   *
   * bank: HOST_ACTINVER + '/cross/catalogs/banks'
   */
  getBank(body: BankRequest): Observable<Bank[]> {
    const catalogName = 'bank';
    const idKey = body?.country?.toString() ?? 'default';

    const catalogById: CatalogById = this.localStorageService.getSeparatedByIdCatalog(catalogName);
    const dataForId = catalogById[idKey] || { data: [], updatedAt: '' };

    if (dataForId.data.length > 0 && dataForId.updatedAt === this.currentDay) {
      return of(dataForId.data);
    }

    if (dataForId.data.length > 0 && dataForId.updatedAt !== this.currentDay) {
      this.httpClientService.post<Bank[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: Bank[]) => {
          const items = response;
          this.localStorageService.setSeparatedByIdCatalog(catalogName, idKey, items);
        });
      return of(dataForId.data);
    }

    if (dataForId.data.length === 0) {
      return this.httpClientService.post<Bank[]>(this.urls[catalogName], body).pipe(
        map((response: Bank[]) => {
          const items = response;
          this.localStorageService.setSeparatedByIdCatalog(catalogName, idKey, items);
          return items;
        })
      );
    }

    return of(dataForId.data);
  }

  /**
   * CFDI
   *
   * cfdi: HOST_ACTINVER + '/cross/catalogs/cfdi'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/242253825/cross+catalogs+cfdi
   */
  getCfdi(body: CfdiRequest): Observable<CFDI[]> {
    const catalogName: CatalogsAllowed = 'cfdi';
    const idKey =
      (body?.personType?.toString() ?? 'default') +
      '-' +
      (body?.fiscalRegimeId?.toString() ?? 'default')

    const catalogById: CatalogById = this.localStorageService.getSeparatedByIdCatalog(catalogName);
    const dataForId = catalogById[idKey] || { data: [], updatedAt: '' };

    if (dataForId.data.length > 0 && dataForId.updatedAt === this.currentDay) {
      return of(dataForId.data);
    }

    if (dataForId.data.length > 0 && dataForId.updatedAt !== this.currentDay) {
      this.httpClientService.post<CfdiResponse>(this.urls['cfdi'], body, { context: this.noloadctx })
        .subscribe((response: CfdiResponse) => {
          const items = response.payload.cfdi.item;
          this.localStorageService.setSeparatedByIdCatalog(catalogName, idKey, items);
        });
      return of(dataForId.data);
    }

    if (dataForId.data.length === 0) {
      return this.httpClientService.post<CfdiResponse>(this.urls['cfdi'], body).pipe(
        map((response: CfdiResponse) => {
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
   * cfdi: HOST_ACTINVER + '/cross/catalogs/person-type'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187367537/cross+catalogs+person-type
   */
  getClassificationPerson(body: PersonTypeRequest): Observable<PersonType[]> {
    let data = this.localStorageService.getClassificationPersonByPersonType(body.personType);
    if (0 === data.length) {
      return this.httpClientService.post<PersonTypeResponse>(this.urls['classificationPerson'], body)
        .pipe(
          map((response: PersonTypeResponse) => {
            const niuArr: PersonType[] = response.payload.personType.item.map((it: PersonType) => {
              if (it.personTypeId == null) {
                it.personTypeId = '1';
              }
              return it;
            });
            this.localStorageService.setClassificationPersonByPersonType(niuArr);
            data = response.payload.personType.item.filter(item => item.personTypeId === body.personType);
            return data;
          })
        );
    }
    return of(data);
  }

  /**
   * Interview knowledge
   *
   * contractTop: HOST_ACTINVER + ' /cross/catalogs/client-knowledge'
   */
  getClientKnowledge(body: ClientKnowledgeRequest): Observable<ClientKnowledge[]> {
    const catalogName = 'clientKnowledge';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<ClientKnowledge[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: ClientKnowledge[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<ClientKnowledge[]>(this.urls[catalogName], body).pipe(
        map((response: ClientKnowledge[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Client no guaranteed ipab
   *
   * contractTop: HOST_ACTINVER + '/cross/catalogs/contracts/client-no-guaranteed-ipab'
   */
  getClientNoGuaranteedIpab(body: ClientNoGuaranteedIpabRequest): Observable<ClientNoGuaranteedIpab[]> {

    const catalogName = 'clientNoGuaranteedIpab';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<ClientNoGuaranteedIpab[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: ClientNoGuaranteedIpab[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<ClientNoGuaranteedIpab[]>(this.urls[catalogName], body).pipe(
        map((response: ClientNoGuaranteedIpab[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }



  /**
   * Contract catalog.
   *
   * contract: HOST_ACTINVER + '/cross/catalogs/contracts'
   */
  getContract(body: ContractRequest): Observable<Contract[]> {
    let data = this.localStorageService.getContracts(body.personTypeId);
    if (0 === data.length) {
      return this.httpClientService.post<Contract[]>(this.urls['contract'], body).pipe(
        map((response: Contract[]) => {
          data = response;
          this.localStorageService.setContracts(body.personTypeId, data);
          return data;
        })
      );
    }
    return of(data);
  }

  /**
   * Contract Top 3
   *
   * contractTop: HOST_ACTINVER + '/cross/catalogs/contracts/search'
   */
  getContractTop(body: ContractTopRequest): Observable<ContractTop[]> {

    const catalogName = body.personTypeId === 1 ? 'contractTopPerson' : 'contractTopLegal';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<ContractTop[]>(this.urls['contractTop'], body, { context: this.noloadctx })
        .subscribe((response: ContractTop[]) => {
          this.localStorageService.setCatalog(catalogName, this.top3Contracts(response));
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<ContractTop[]>(this.urls['contractTop'], body).pipe(
        map((response: ContractTop[]) => {
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
  getCountry(body: CountryRequest): Observable<Countries[]> {

    if (0 === body.land.length) {
      body.land.push("");
    }

    const catalogName = 'country';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CountryResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CountryResponse) => {
          this.localStorageService.setCatalog(catalogName, response.payload.countries);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CountryResponse>(this.urls[catalogName], body).pipe(
        map((response: CountryResponse) => {
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
   * currencyType: HOST_ACTINVER + '/cross/catalogs/currency-type'
   */
  getCurrencyType(body: CurrencyTypeRequest): Observable<CurrencyType[]> {

    const catalogName = 'currencyType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<CurrencyType[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: CurrencyType[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<CurrencyType[]>(this.urls[catalogName], body).pipe(
        map((response: CurrencyType[]) => {
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
   * districtMnicipality: HOST_ACTINVER + '/cross/catalogs/district-municipality',
   */
  getDistrictMunicipality(body: DistrictMunicipalityRequest[]): Observable<DistrictMunicipality[]> {
    const catalogName = 'documentType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<DistrictMunicipality[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: DistrictMunicipality[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<DistrictMunicipality[]>(this.urls[catalogName], body).pipe(
        map((response: DistrictMunicipality[]) => {
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
   * documentType: HOST_ACTINVER + '/cross/catalogs/document-type',
   */
  getDocumentType(body: DocumentTypeRequest): Observable<DocumentType[]> {
    const catalogName = 'documentType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<DocumentType[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: DocumentType[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<DocumentType[]>(this.urls[catalogName], body).pipe(
        map((response: DocumentType[]) => {
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
  getEconomicActivity(body: EconomicActivityRequest): Observable<EconomicActivity[]> {
    const catalogName = 'economicActivity';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<EconomicActivityResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: EconomicActivityResponse) => {
          this.localStorageService.setCatalog(catalogName, response['payload'][catalogName]['item']);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<EconomicActivityResponse>(this.urls[catalogName], body).pipe(
        map((response: EconomicActivityResponse) => {
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

  getEconomicActivityAccredited(body: EconomicActivityAccreditedRequest): Observable<EconomicActivityAccredited[]> {
    const catalogName = 'economicActivityAccredited';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<EconomicActivityAccredited>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: EconomicActivityAccredited) => {
          this.localStorageService.setCatalog(catalogName, (response as any).payload[catalogName]);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<EconomicActivityAccredited>(this.urls[catalogName], body).pipe(
        map((response: EconomicActivityAccredited) => {
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
   * riskGroup    : HOST_ACTINVER + '/cross/catalogs/risk-group'
   */

  getRiskGroup(body: RiskGroupRequest): Observable<RiskGroup[]> {
    const catalogName = 'riskGroup';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<RiskGroup>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: RiskGroup) => {
          this.localStorageService.setCatalog(catalogName, (response as any).payload[catalogName]);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<RiskGroup>(this.urls[catalogName], body).pipe(
        map((response: RiskGroup) => {
          data.data = (response as any);
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }


  /**
   * Economic Sector
   *
   * economicSector    : HOST_ACTINVER + '/cross/catalogs/economic-sector'
   */

  getEconomicSector(body: EconomicSectorRequest): Observable<EconomicSector[]> {
    const catalogName = 'economicSector';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<EconomicSector>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: EconomicSector) => {
          this.localStorageService.setCatalog(catalogName, (response as any).payload[catalogName]);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<EconomicSector>(this.urls[catalogName], body).pipe(
        map((response: EconomicSector) => {
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
   * paymentPeriod    : HOST_ACTINVER + '/cross/catalogs/payment-period'
   */

  getPaymentPeriod(body: PaymentPeriodRequest): Observable<PaymentPeriod[]> {
    const catalogName = 'paymentPeriod';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<PaymentPeriod>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: PaymentPeriod) => {
          this.localStorageService.setCatalog(catalogName, (response as any).payload[catalogName]);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<PaymentPeriod>(this.urls[catalogName], body).pipe(
        map((response: PaymentPeriod) => {
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
  getEconomicActivityByPersonType(body: EconomicActivityByPersonTypeRequest): Observable<EconomicActivity[]> {
    const catalogName: CatalogsAllowed = 'economicActivityById';
    const idKey = body?.subPersonTypeId?.toString() ?? 'default';

    const catalogById: CatalogById = this.localStorageService.getSeparatedByIdCatalog(catalogName);
    const dataForId = catalogById[idKey] || { data: [], updatedAt: '' };

    if (dataForId.data.length > 0 && dataForId.updatedAt === this.currentDay) {
      return of(dataForId.data);
    }

    if (dataForId.data.length > 0 && dataForId.updatedAt !== this.currentDay) {
      this.httpClientService.post<EconomicActivityResponse>(this.urls['economicActivity'], body, { context: this.noloadctx })
        .subscribe((response: EconomicActivityResponse) => {
          const items = response.payload.economicActivity.item;
          this.localStorageService.setSeparatedByIdCatalog(catalogName, idKey, items);
        });
      return of(dataForId.data);
    }

    if (dataForId.data.length === 0) {
      return this.httpClientService.post<EconomicActivityResponse>(this.urls['economicActivity'], body).pipe(
        map((response: EconomicActivityResponse) => {
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
 * economicActivity    : HOST_ACTINVER + '/cross/catalogs/experience-time'
 */
    getExperienceTime(body: ExperienceTimeRequest): Observable<ExperienceTimeResponse[]> {
      const catalogName: CatalogsAllowed = 'experienceTime';
      const idKey = body?.idTipoPersona?.toString() ?? 'default';

      const catalogById: CatalogById = this.localStorageService.getSeparatedByIdCatalog(catalogName);
      const dataForId = catalogById[idKey] || { data: [], updatedAt: '' };

      if (dataForId.data.length > 0 && dataForId.updatedAt === this.currentDay) {
        return of(dataForId.data);
      }

      if (dataForId.data.length > 0 && dataForId.updatedAt !== this.currentDay) {
        this.httpClientService.post<ExperienceTimeResponse[]>(this.urls['experienceTime'], body, { context: this.noloadctx })
          .subscribe((response: ExperienceTimeResponse[]) => {
            const items = response;
            this.localStorageService.setSeparatedByIdCatalog(catalogName, idKey, items);
          });
        return of(dataForId.data);
      }

      if (dataForId.data.length === 0) {
        return this.httpClientService.post<ExperienceTimeResponse[]>(this.urls['experienceTime'], body).pipe(
          map((response: ExperienceTimeResponse[]) => {
            const items = response;
            this.localStorageService.setSeparatedByIdCatalog(catalogName, idKey, items);
            return items;
          })
        );
      }

      return of(dataForId.data);
    }

  /**
   * Federal Entity catalog
   *
   * federalEntity: host + '/cross/catalogs/federal-entity'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187334764/cross+catalogs+economic-activity
   */
  getFederalEntity(body: FederalEntityRequest): Observable<Entity[]> {
    const catalogName = 'federalEntity';

    if (0 === body.land1s.length) {
      body.land1s.push("");
    }

    let data = this.getLocal(catalogName);
    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<FederalEntityResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: FederalEntityResponse) => {
          this.localStorageService.setCatalog(catalogName, response['payload'][catalogName]['item']);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<FederalEntityResponse>(this.urls[catalogName], body).pipe(
        map((response: FederalEntityResponse) => {
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
   * addressType: HOST_ACTINVER + '/cross/catalogs/financial-center'
   */
  getFinancialCenter(): Observable<FinancialCenter[]> {
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
   * fiscalPersonType: HOST_ACTINVER + '/cross/catalogs/fiscal-person-type'
   */
  getFiscalPersonType(body: FiscalPersonTypeRequest): Observable<FiscalPersonType[]> {

    if (0 === body.land.length) {
      body.land.push("");
    }

    const catalogName = 'fiscalPersonType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<FiscalPersonType[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: FiscalPersonType[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<FiscalPersonType[]>(this.urls[catalogName], body).pipe(
        map((response: FiscalPersonType[]) => {
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
   * fiscalPersonType: HOST_ACTINVER + '/cross/catalogs/fiscal-person-subtype'
   */
  getFiscalPersonSubType(body: FiscalPersonSubTypeRequest): Observable<FiscalPersonSubType[]> {

    if (0 === body.land.length) {
      body.land.push("");
    }

    const catalogName = 'fiscalPersonSubType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<FiscalPersonSubType[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: FiscalPersonSubType[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<FiscalPersonSubType[]>(this.urls[catalogName], body).pipe(
        map((response: FiscalPersonSubType[]) => {
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
   * fiscalCertificate: HOST_ACTINVER + '/cross/catalogs/fiscal-certificate'
   */
  getFiscalCertificate(body: FiscalCertificateRequest): Observable<FiscalCertificate[]> {
    const catalogName = 'fiscalCertificate';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<FiscalCertificate[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: FiscalCertificate[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<FiscalCertificate[]>(this.urls[catalogName], body).pipe(
        map((response: FiscalCertificate[]) => {
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
   * fiscalRegime: HOST_ACTINVER + '/cross/catalogs/fiscal-regime'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/242352129/cross+catalogs+fiscal-regime
   */
  getFiscalRegime(body: FiscalRegimeRequest): Observable<FiscalRegimes[]> {
    const catalogName = 'fiscalRegime';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<FiscalRegimeResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: FiscalRegimeResponse) => {
          this.localStorageService.setCatalog(catalogName, response.payload.fiscalRegime.item);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<FiscalRegimeResponse>(this.urls[catalogName], body).pipe(
        map((response: FiscalRegimeResponse) => {
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
   * addressType: HOST_ACTINVER + '/cross/catalogs/funds-origin-category'
   */
  getFundsOriginCategory(): Observable<FundsOriginCategory[]> {
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
   * Identification Type
   *
   * identificationType: HOST_ACTINVER + '/cross/catalogs/identification-type'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187367706/cross+catalogs+identification-type
   */
  getIdentificationType(body: IdentificationTypeRequest): Observable<IdentificationType[]> {
    const catalogName = 'identificationType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<IdentificationTypeResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: IdentificationTypeResponse) => {
          this.localStorageService.setCatalog(catalogName, response['payload'][catalogName]['item']);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<IdentificationTypeResponse>(this.urls[catalogName], body).pipe(
        map((response: IdentificationTypeResponse) => {
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
   * investmentType: HOST_ACTINVER + '/cross/catalogs/investment-type',
   */
  getInvestmentType(body: InvestmentTypeRequest): Observable<InvestmentType[]> {
    const catalogName = 'investmentType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<InvestmentType[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: InvestmentType[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<InvestmentType[]>(this.urls[catalogName], body).pipe(
        map((response: InvestmentType[]) => {
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
   * contractTop: HOST_ACTINVER + '/cross/catalogs/contracts/interview-place'
   */
  getInterviewPlaces(body: InterviewPlaceRequest): Observable<InterviewPlace[]> {

    const catalogName = 'interviewPlaces';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<InterviewPlace[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: InterviewPlace[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<InterviewPlace[]>(this.urls[catalogName], body).pipe(
        map((response: InterviewPlace[]) => {
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
  getMaritalStatus(body: MaritalStatusRequest): Observable<MaritalStatus[]> {
    const catalogName = 'maritalStatus';
    if (0 === body.maritalStatusIds.length) {
      body.maritalStatusIds.push("");
    }
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<MaritalStatusResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: MaritalStatusResponse) => {
          this.localStorageService.setCatalog(catalogName, response['payload'][catalogName]['item']);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<MaritalStatusResponse>(this.urls[catalogName], body).pipe(
        map((response: MaritalStatusResponse) => {
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
   * marriageType: HOST_ACTINVER + '/cross/catalogs/marriage-type'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187367506/cross+catalogs+marriage-type
   */
  getMarriageType(body: MarriageTypeRequest): Observable<MarriageType[]> {
    const catalogName = 'marriageType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<MarriageTypeResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: MarriageTypeResponse) => {
          this.localStorageService.setCatalog(catalogName, response['payload'][catalogName]['item']);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<MarriageTypeResponse>(this.urls[catalogName], body).pipe(
        map((response: MarriageTypeResponse) => {
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
  getMonthlyDeposit(body: MonthlyDepositRequest): Observable<MonthlyDeposit[]> {
    const catalogName = 'monthlyDeposit';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<MonthlyDepositResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: MonthlyDepositResponse) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<MonthlyDepositResponse>(this.urls[catalogName], body).pipe(
        map((response: MonthlyDepositResponse) => {
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
  getMonthlyDepositAvg(body: MonthlyDepositRequest): Observable<AmountMonthlyDeposit[]> {
    const catalogName = 'monthlyDepositAvg';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<AmountMonthlyDepositResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: AmountMonthlyDepositResponse) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<AmountMonthlyDepositResponse>(this.urls[catalogName], body).pipe(
        map((response: AmountMonthlyDepositResponse) => {
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
  getNationalities(body: NationalityRequest): Observable<Nationalities[]> {
    const catalogName = 'nationality';
    let data = this.getLocal(catalogName);
    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<NationalityResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: NationalityResponse) => {
          this.localStorageService.setCatalog(catalogName, response['payload']['nationalities']);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<NationalityResponse>(this.urls[catalogName], body).pipe(
        map((response: NationalityResponse) => {
          data.data = response['payload']['nationalities'];
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Occupation catalog.
   *
   * occupations: HOST_ACTINVER + '/cross/catalogs/occupations'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187367675/cross+catalogs+occupations
   */
  getOccupations(body: OccupationRequest): Observable<Occupation[]> {
    const catalogName = 'occupations';
    if (0 === body.ocupationIds.length) {
      body.ocupationIds.push("");
    }
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<OccupationResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: OccupationResponse) => {
          this.localStorageService.setCatalog(catalogName, response['payload']['occupation']['item']);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<OccupationResponse>(this.urls[catalogName], body).pipe(
        map((response: OccupationResponse) => {
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
  getOriginResource(body: OriginResourceRequest): Observable<Ranges[]> {
    const catalogName = 'origin_resource';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<OriginResource>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: OriginResource) => {
          this.localStorageService.setCatalog(catalogName, response['payload']['ranges']);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<OriginResource>(this.urls[catalogName], body).pipe(
        map((response: OriginResource) => {
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
  getPersonRole(body: PersonRoleRequest): Observable<PersonRole[]> {
    const catalogName = 'personRole';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<PersonRole[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: PersonRole[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<PersonRole[]>(this.urls[catalogName], body).pipe(
        map((response: PersonRole[]) => {
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
   * personType: HOST_ACTINVER + '/cross/catalogs/person-type'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187367537/cross+catalogs+person-type
   */
  getPersonType(body: PersonTypeRequest): Observable<PersonType[]> {
    if (0 === body.subPersonTypeIds.length) {
      body.subPersonTypeIds.push("");
    }

    const catalogName = 'personType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<PersonTypeResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: PersonTypeResponse) => {
          this.localStorageService.setCatalog(catalogName, response.payload.personType.item);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<PersonTypeResponse>(this.urls[catalogName], body).pipe(
        map((response: PersonTypeResponse) => {
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
   * phoneType: HOST_ACTINVER + '/cross/catalogs/telephone-type'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187367624/cross+catalogs+telephone-type
   */
  getPhoneType(body: PhoneTypeRequest): Observable<PhoneType[]> {
    const catalogName = 'phoneType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<PhoneTypeResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: PhoneTypeResponse) => {
          this.localStorageService.setCatalog(catalogName, response.payload.telephoneType.item);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<PhoneTypeResponse>(this.urls[catalogName], body).pipe(
        map((response: PhoneTypeResponse) => {
          data.data = response.payload.telephoneType.item;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Proof of Address catalog
   *
   * proofOfAddressType: host + '/cross/catalogs/proof-of-address-type'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187334802/cross+catalogs+proof-of-address-type
   */
  getProofOfAddress(body: ProofOfAddressTypeRequest): Observable<ProofOfAddressType[]> {
    if (0 === body.proofAddressIds.length) {
      body.proofAddressIds.push("");
    }
    const catalogName = 'proofOfAddressType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<ProofOfAddressTypeResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: ProofOfAddressTypeResponse) => {
          this.localStorageService.setCatalog(catalogName, response['payload']['proofOfAddressType']['item']);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<ProofOfAddressTypeResponse>(this.urls[catalogName], body).pipe(
        map((response: ProofOfAddressTypeResponse) => {
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
   * profileInvestment: HOST_ACTINVER + '/cross/catalogs/profile-investment',
   */
  getProfileInvestment(body: ProfileInvestmentRequest): Observable<ProfileInvestment[]> {
    const catalogName = 'profileInvestment';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<ProfileInvestment[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: ProfileInvestment[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<ProfileInvestment[]>(this.urls[catalogName], body).pipe(
        map((response: ProfileInvestment[]) => {
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
   * propertyType: HOST_ACTINVER + '/cross/catalogs/property-type',
   */
  getPropertyType(body: PropertyTypeRequest): Observable<PropertyType[]> {
    const catalogName = 'propertyType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<PropertyType[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: PropertyType[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<PropertyType[]>(this.urls[catalogName], body).pipe(
        map((response: PropertyType[]) => {
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
   * relationships: HOST_ACTINVER + '/cross/catalogs/relationships'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187367578/cross+catalogs+relationships
   */
  getRelationships(body: RelationshipRequest): Observable<Relationships[]> {
    const catalogName = 'relationships';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<RelationshipResponse>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: RelationshipResponse) => {
          this.localStorageService.setCatalog(catalogName, response['payload']['relationship']['item']);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<RelationshipResponse>(this.urls[catalogName], body).pipe(
        map((response: RelationshipResponse) => {
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
   * residentialArea: HOST_ACTINVER + '/cross/catalogs/residential-area',
   */
  getResidentialArea(body: ResidentialAreaRequest): Observable<ResidentialArea[]> {
    const catalogName = 'residentialArea';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<ResidentialArea[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: ResidentialArea[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<ResidentialArea[]>(this.urls[catalogName], body).pipe(
        map((response: ResidentialArea[]) => {
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
   * sector: HOST_ACTINVER + '/cross/catalogs/sector',
   */
  getSector(body: SectorRequest): Observable<Sector[]> {
    const catalogName = 'sector';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<Sector[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: Sector[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<Sector[]>(this.urls[catalogName], body).pipe(
        map((response: Sector[]) => {
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
   * serviceType: HOST_ACTINVER + '/cross/catalogs/service-type'
   */
  getServiceType(body: ServiceTypeRequest): Observable<ServiceType[]> {
    const catalogName = 'serviceType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<ServiceType[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: ServiceType[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<ServiceType[]>(this.urls[catalogName], body).pipe(
        map((response: ServiceType[]) => {
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
   * serviceSubtype: HOST_ACTINVER + '/cross/catalogs/service-subtype'
   */
  getServiceSubtype(body: ServiceSubtypeRequest): Observable<ServiceSubtype[]> {
    const catalogName = 'serviceSubtype';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<ServiceSubtype[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: ServiceSubtype[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<ServiceSubtype[]>(this.urls[catalogName], body).pipe(
        map((response: ServiceSubtype[]) => {
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
   * signatureType: HOST_ACTINVER + '/cross/catalogs/signature-type'
   * https://actinver.atlassian.net/wiki/spaces/DMA/pages/187334713/cross+catalogs+signature-type
   */
  getSignatureType(body: SignatureTypeRequest): Observable<SignatureType[]> {
    const catalogName = 'signatureType';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<SignatureType[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: SignatureType[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<SignatureType[]>(this.urls[catalogName], body).pipe(
        map((response: SignatureType[]) => {
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
   * addressType: HOST_ACTINVER + '/cross/catalogs/started-working'
   */
  getStartedWorking(): Observable<StartedWorking[]> {
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
   * Contract Sub Type | SubContractType
   *
   * subcontract: HOST_ACTINVER + '/cross/catalogs/contracts/sub-contracts'
   */
  getSubContract(body: SubContractRequest): Observable<any> { // SubContract[]
    let data = this.localStorageService.getSubcontracts(body.personTypeId, body.contractTypeId);
    if (0 === data.length) {
      return this.httpClientService.post<SubContract[]>(this.urls['subcontract'], body).pipe(
        map((response: SubContract[]) => {
          data = response;
          this.localStorageService.setSubcontracts(body.personTypeId, body.contractTypeId, data);
          return data;
        })
      );
    }
    return of(data);
  }

  /**
   * Tax Id
   *
   * taxId: HOST_ACTINVER + '/cross/catalogs/tax-id'
   */
  getTaxId(body: TaxIdRequest): Observable<TaxId[]> {
    const catalogName = 'taxId';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<TaxId[]>(this.urls[catalogName], body, { context: this.noloadctx })
        .subscribe((response: TaxId[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<TaxId[]>(this.urls[catalogName], body).pipe(
        map((response: TaxId[]) => {
          data.data = response;
          this.localStorageService.setCatalog(catalogName, data.data);
          return data.data;
        })
      );
    }
    return of(data.data);
  }

  /**
   * Contract Sub Type | SubContractType
   *
   * subcontract: HOST_ACTINVER + '/cross/catalogs/contracts/transactional-limits'
   */
  getTransactionLimits(): Observable<any> {
    const catalogName = 'transactionalLimits';
    let data = this.getLocal(catalogName);

    if (data.data.length > 0 && data.updatedAt !== this.currentDay) {
      this.httpClientService.post<TransactionalLimitsResponse[]>(this.urls[catalogName], {}, { context: this.noloadctx })
        .subscribe((response: TransactionalLimitsResponse[]) => {
          this.localStorageService.setCatalog(catalogName, response);
        });
      return of(data.data);
    }

    if (0 === data.data.length) {
      return this.httpClientService.post<TransactionalLimitsResponse[]>(this.urls[catalogName], {}).pipe(
        map((response: TransactionalLimitsResponse[]) => {
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

  /**
   *
   */
  createStrategyEquity(body: EquityStrategyItem): Observable<EquityStrategyItem> {
    const catalogName = 'strategiesEquity';
    return this.httpClientService.post<EquityStrategyItem>(this.urls[catalogName], body);
  }

  /**
   *
   */
  updateStrategyEquity(body: EquityStrategyItem): Observable<EquityStrategyItem> {
    const catalogName = 'strategiesEquity';
    return this.httpClientService.put<EquityStrategyItem>(this.urls[catalogName], body);
  }

  /**
   *
   */
  deleteStrategyEquity(id: number): Observable<any> {
    const catalogName = 'strategiesEquity';
    const body = { idStrategy: id };
    return this.httpClientService.delete<any>(this.urls[catalogName], { body } as any);
  }

  /**
   * Gets the first 3 contracts by ranking.
   */
  top3Contracts(response: ContractTop[]): Array<ContractTop> {
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
