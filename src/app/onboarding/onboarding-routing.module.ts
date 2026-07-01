import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './components/app/app.component';
import { NewCustomerComponent } from './components/new-customer/new-customer.component';
import { GeneralInfoComponent } from './components/general-info/general-info.component';
import { ContactInfoComponent } from './components/contact-info/contact-info.component';
import { PpeInfoComponent } from './components/ppe-info/ppe-info.component';
import { FirstDataComponent } from './components/first-data/first-data.component';
import { AddressComponent } from './components/address/address.component';
import { SignComponent } from './components/sign/sign.component';
import { BeneficiariesComponent } from './components/beneficiaries/beneficiaries.component';
import { AuthorizedPersonComponent } from './components/authorized-person/authorized-person.component';
import { TaxInfoComponent } from './components/tax-info/tax-info.component';
import { InterviewComponent } from './components/interview/interview.component';
import { PrivacyNoticeComponent } from './components/privacy-notice/privacy-notice.component';
import { NewContractComponent } from './components/new-contract/new-contract.component';
import { SearchComponent } from './components/search/search.component';
import { SEARCH_TYPE } from './constants/constants';
import { HomonimiasComponent } from './components/homonimias/homonimias.component';
import { PendingChangesGuard } from '../core/guards/pending-changes.guard';
import { ResourceProviderComponent } from './components/resource-provider/resource-provider.component';
import { RealOwnerComponent } from './components/real-owner/real-owner.component';
import { FinalizationComponent } from './components/finalization/finalization.component';
import { BankAccountComponent } from './components/bank-account/bank-account.component';
import { KitContractComponent } from './components/kit-contract/kit-contract.component';
import { GetAccountTypeResolver } from './resolvers/get-account-type.resolver';
import { GetCurrencyTypeResolver } from './resolvers/get-currency-type.resolver';
import { GetAccountStatementResolver } from './resolvers/get-account-statement.resolver';
import { GetCountryCatalogResolver } from './resolvers/get-country.resolver';
import { FirstDataPmComponent } from './components/first-data-pm/first-data-pm.component';
import { GetRelationShipCatalogResolver } from './resolvers/get-relationship-catalog.resolver';
import { HomonymsPmComponent } from './components/homonyms-pm/homonyms-pm.component';
import { GetEconomicActivityResolver } from './resolvers/get-economic-activity.resolver';
import { GetOccupationResolver } from './resolvers/get-occupation.resolver';
import { DirectorateComponent } from './components/directorate/directorate.component';
import { ContactInfoPmComponent } from './components/contact-info-pm/contact-info-pm.component';
import { OrganizationChartComponent } from './components/organization-chart/organization-chart.component';
import { GeneralInfoPmComponent } from './components/general-info-pm/general-info-pm.component';
import { OperateChangesComponent } from './components/operate-changes/operate-changes.component';
import { EntityStatusComponent } from './components/entity-status/entity-status.component';
import { ResourceProviderPmComponent } from './components/resource-provider-pm/resource-provider-pm.component';
import { AddressPmComponent } from './components/address-pm/address-pm.component';
import { AdministratorExercisingPfControlComponent } from './components/administrator-exercising-pf-control/administrator-exercising-pf-control.component';
import { PldQuizComponent } from './components/pld-quiz/pld-quiz.component';
import { BeneficiariesPmComponent } from './components/beneficiaries-pm/beneficiaries-pm.component';
import { GetAuthorizedPersonCatalogResolver } from './resolvers/get-authorized-person.resolver';
import { TiProfileComponent } from './components/ti-profile/ti-profile.component';
import { TiProfilePmComponent } from './components/ti-profile-pm/ti-profile-pm.component';
import { SpidProfileComponent } from './components/spid-profile/spid-profile.component';
import { PldQuizPmComponent } from './components/pld-quiz-pm/pld-quiz-pm.component';
import { TaxProfileComponent } from './components/tax-profile/tax-profile.component';
import { SpouseComponent } from './components/spouse/spouse.component';
import { RealOwnerComponentPM } from './components/real-owner/real-owner.component-pm';
import { AdditionalInfoComponent } from './components/additional-info/additional-info.component';
import { GetAddressTypeCatalogResolver } from './resolvers/get-address-type.resolver';
import { ActiwebComponent } from '../maintenance/components/actiweb/actiweb.component';
import { CreditDataComponent } from '../maintenance/credit-data/credit-data.component';
import { GetBankCatalogResolver } from './resolvers/get-bank-catalog.resolver';
import { GetSectionDataBeneficiariesResolver } from './resolvers/get-section-data-beneficiaries.resolver';
import { GetSectionDataPpeResolver } from './resolvers/get-section-data-ppe.resolver';
import { GetSectionDataAddressResolver } from './resolvers/get-section-data-address.resolver';
import { GetSectionDataRealOwnerResolver } from './resolvers/get-section-data-real-owner.resolver';
import { GetSectionDataResourceProviderResolver } from './resolvers/get-section-data-resource-provider.resolver';
import { GetSectionDataInterviewResolver } from './resolvers/get-section-data-interview.resolver';
import { getSectionDataPldQuizResolver } from './resolvers/get-section-data-pld-quiz.resolver';
import { GetSectionDataExchangeOperationResolver } from './resolvers/get-section-data-exchange-operation.resolver';
import { GetSectionDataAuthorizedPersonResolver } from './resolvers/get-section-data-authorized-person.resolver';
import { GetSectionDataBankAccountResolver } from './resolvers/get-section-data-bank-account.resolver';
import { GetAdvisorCatalogResolver } from '../onboarding/resolvers/get-advisor.resolver';
import { GetSectionDataSpouseResolver } from './resolvers/get-section-data-spouse.resolver';
import { GetSectionDataTaxProfileResolver } from './resolvers/get-section-data-tax-profile.resolver';
import { GetEconomicActivityAccreditedResolver } from './resolvers/get-economic-activity-accredited.resolver';
import { GetRiskGroupResolver } from './resolvers/get-risk-group.resolver';
import { GetEconomicSectorResolver } from './resolvers/economic-sector.resolver';
import { GetPaymentPeriodResolver } from './resolvers/payment-period.resolver';
import { GetSectionDataActiwebResolver } from './resolvers/get-section-data-actiweb.resolver';
import { GetSectionDataFiscalSelfDeclarationResolver } from './resolvers/get-section-fiscal-self-declaration.resolver';
import { GetSectionDataAdditionalInfoResolver } from './resolvers/get-section-data-additional-info.resolver';
import { GetSectionCreditDataResolver } from './resolvers/get-credit-data.resolver';
import { GetExperienceTimeCatalogResolver } from './resolvers/get-experience-time.resolver';
import { GetSectionDataGeneralInfoResolver } from './resolvers/get-section-data-general-info.resolver';
import { AdvisorCheckGuard } from '../core/guards/advisor-check.guard';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
  },
  {
    path: 'new-contract',
    component: NewContractComponent,
    canActivate: [AdvisorCheckGuard]
  },
  {
    path: 'new-customer',
    component: NewCustomerComponent,
    children: [
      {
        path: 'customer-info',
        component: FirstDataComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'contact-info',
        component: ContactInfoComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'customer-info-pm',
        component: FirstDataPmComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'ppe-info',
        resolve: {
          sectionData: GetSectionDataPpeResolver,
          relationshipResolver    : GetRelationShipCatalogResolver,
          economicActivityResolver: GetEconomicActivityResolver,
          occupationResolver      : GetOccupationResolver,
          addressTypeResolver     : GetAddressTypeCatalogResolver,
        },
        component: PpeInfoComponent,
        canDeactivate: [PendingChangesGuard],
      },
      {
        path: 'general-info',
        component: GeneralInfoComponent,
        canDeactivate: [PendingChangesGuard],
        resolve: {
          sectionData: GetSectionDataGeneralInfoResolver
        }
      },
      {
        path: 'spouse',
        component: SpouseComponent,
        canDeactivate: [PendingChangesGuard],
        resolve: {
          sectionData: GetSectionDataSpouseResolver
        }
      },
      {
        path: 'address',
        component: AddressComponent,
        canDeactivate: [PendingChangesGuard],
        resolve: {
          sectionData: GetSectionDataAddressResolver
        }
      },
      {
        path: 'sign',
        component: SignComponent,
        canDeactivate: [PendingChangesGuard],
      },
      {
        path: 'beneficiaries',
        component: BeneficiariesComponent,
        canDeactivate: [PendingChangesGuard],
        resolve: {
          relationshipResolver: GetRelationShipCatalogResolver,
          sectionData: GetSectionDataBeneficiariesResolver
        }
      },
      {
        path: 'beneficiaries-pm',
        component: BeneficiariesPmComponent,
        canDeactivate: [PendingChangesGuard],
        resolve: {
          relationshipResolver: GetRelationShipCatalogResolver
        }
      },
      {
        path: 'bank-account',
        component: BankAccountComponent,
        canDeactivate: [PendingChangesGuard],
        resolve: {
          accountStatement: GetAccountStatementResolver,
          accountType     : GetAccountTypeResolver,
          countries       : GetCountryCatalogResolver,
          currencyType    : GetCurrencyTypeResolver,
          sectionData     : GetSectionDataBankAccountResolver,
        },
      },
      {
        path: 'authorized-person',
        component: AuthorizedPersonComponent,
        canDeactivate: [PendingChangesGuard],
        resolve: {
          relationshipResolver    : GetRelationShipCatalogResolver,
          economicActivityResolver: GetEconomicActivityResolver,
          occupationResolver      : GetOccupationResolver,
          authorizedPersonResolver: GetAuthorizedPersonCatalogResolver,
          addressTypeResolver     : GetAddressTypeCatalogResolver,
          sectionData             : GetSectionDataAuthorizedPersonResolver,
        },
      },
      {
        path: 'transactional-investment-profile',
        component: TiProfileComponent,
        canDeactivate: [PendingChangesGuard],
        resolve: {
          experienceTime: GetExperienceTimeCatalogResolver
        }
      },
      {
        path: 'tax-info',
        component: TaxInfoComponent,
        canDeactivate: [PendingChangesGuard],
        resolve: {
          sectionData: GetSectionDataFiscalSelfDeclarationResolver
        }
      },
      {
        path: 'interview',
        component: InterviewComponent,
        canDeactivate: [PendingChangesGuard],
        resolve: {
          sectionData: GetSectionDataInterviewResolver
        },
      },
      {
        path: 'privacy-notice',
        component: PrivacyNoticeComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'pld-quiz',
        resolve: {
          sectionData: getSectionDataPldQuizResolver,
          economiActity: GetEconomicActivityResolver,
          countries: GetCountryCatalogResolver,
        },
        component: PldQuizComponent,
        canDeactivate: [PendingChangesGuard],
      },
      {
        path: 'real-owner',
        component: RealOwnerComponent,
        canDeactivate: [PendingChangesGuard],
        resolve: {
          economicActivityResolver: GetEconomicActivityResolver,
          sectionData: GetSectionDataRealOwnerResolver
        }
      },
      {
        path: 'real-owner-pm',
        component: RealOwnerComponentPM,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'resource-provider',
        component: ResourceProviderComponent,
        canDeactivate: [PendingChangesGuard],
        resolve: {
          sectionData: GetSectionDataResourceProviderResolver
        }
      },
      {
        path: 'resource-provider-pm',
        component: ResourceProviderPmComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'general-info-pm',
        component: GeneralInfoPmComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'directorate',
        component: DirectorateComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'address-pm',
        component: AddressPmComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'contact-info-pm',
        component: ContactInfoPmComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'organization-chart',
        component: OrganizationChartComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'operate-changes',
        component: OperateChangesComponent,
        canDeactivate: [PendingChangesGuard],
        resolve: {
          sectionData: GetSectionDataExchangeOperationResolver
        }
      },
      {
        path: 'operate-changes-pm',
        component: OperateChangesComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'entity-status',
        component: EntityStatusComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'administrator-exercising-pf-control',
        component: AdministratorExercisingPfControlComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'pld-quiz-pm',
        component: PldQuizPmComponent,
        canDeactivate: [PendingChangesGuard]
      },
      {
        path: 'transactional-investment-profile-pm',
        component: TiProfilePmComponent,
        canDeactivate: [PendingChangesGuard],
        resolve: {
          experienceTime: GetExperienceTimeCatalogResolver
        }
      },
      {
        path: 'spid-profile-pm',
        component: SpidProfileComponent,
        canDeactivate: [PendingChangesGuard],
        resolve: {
          economicActivityResolver: GetEconomicActivityResolver,
          bankResolver: GetBankCatalogResolver,
          /*relationTypeResolver: '',
          frecuencyOperationsResolver: '', */
        },
      },
      {
        path: 'tax-profile',
        component: TaxProfileComponent,
        canDeactivate: [PendingChangesGuard],
        resolve: {
          sectionData: GetSectionDataTaxProfileResolver
        }
      },
      {
        path: 'additional-info',
        component: AdditionalInfoComponent,
        canDeactivate: [PendingChangesGuard],
        resolve: {
          sectionDataAddresses: GetSectionDataAddressResolver,
          sectionData: GetSectionDataAdditionalInfoResolver
        }
      },
      {
        path: 'credit-data',
        component: CreditDataComponent,
        canDeactivate: [PendingChangesGuard],
        resolve: {
          economicActivityAccreditedResolver: GetEconomicActivityAccreditedResolver,
          riskGroupResolver: GetRiskGroupResolver,
          economicSectorResolver: GetEconomicSectorResolver,
          paymentPeriodResolver: GetPaymentPeriodResolver,
          currencyTypeResolver: GetCurrencyTypeResolver,
          creditDataResolver: GetSectionCreditDataResolver
        },
      },
      {
        path: 'actiweb',
        component: ActiwebComponent,
        canDeactivate: [PendingChangesGuard],
        resolve: {
          advisorResolver: GetAdvisorCatalogResolver,
          sectionData    : GetSectionDataActiwebResolver,
        },
      },
      {
        path: '',
        redirectTo: 'customer-info',
        pathMatch: 'full'
      },
      {
        path: '**',
        redirectTo: 'customer-info',
        pathMatch: 'full'
      },

    ],
  },
  {
    path: 'search',
    component: SearchComponent,
    canDeactivate: [PendingChangesGuard],
    data: {
      typeSearch: SEARCH_TYPE.CUSTOMER
    }
  },
  {
    path: 'search-id',
    component: SearchComponent,
    data: {
      typeSearch: SEARCH_TYPE.PROSPECT
    }
  },
  {
    path: 'homonyms',
    component: HomonimiasComponent,
  },
  {
    path: 'homonyms-pm',
    component: HomonymsPmComponent,
  },
  {
    path: 'finalization',
    component: FinalizationComponent,
  },
  {
    path: 'kit-contract',
    component: KitContractComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
