import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

import { AppComponent } from './components/app/app.component';
import { AddressComponent } from './components/address/address.component';
import { AuthorizedFormModalComponent } from './components/authorized-person/authorized-form-modal/authorized-form-modal.component';
import { AuthorizedPersonComponent } from './components/authorized-person/authorized-person.component';
import { BankAccountComponent } from './components/bank-account/bank-account.component';
import { BeneficiariesComponent } from './components/beneficiaries/beneficiaries.component';
import { ContactInfoComponent } from './components/contact-info/contact-info.component';
import { FinalizationComponent } from './components/finalization/finalization.component';
import { FirstDataComponent } from './components/first-data/first-data.component';
import { FirstDataPmComponent } from './components/first-data-pm/first-data-pm.component';
import { GeneralInfoComponent } from './components/general-info/general-info.component';
import { HomonimiasComponent } from './components/homonimias/homonimias.component';
import { HomonymsPmComponent } from './components/homonyms-pm/homonyms-pm.component';
import { InterviewComponent } from './components/interview/interview.component';
import { NewContractComponent } from './components/new-contract/new-contract.component';
import { NewCustomerComponent } from './components/new-customer/new-customer.component';
import { PpeInfoComponent } from './components/ppe-info/ppe-info.component';
import { PrivacyNoticeComponent } from './components/privacy-notice/privacy-notice.component';
import { RealOwnerComponent } from './components/real-owner/real-owner.component';
import { ResourceProviderComponent } from './components/resource-provider/resource-provider.component';
import { SearchComponent } from './components/search/search.component';
import { SignComponent } from './components/sign/sign.component';
import { TaxInfoComponent } from './components/tax-info/tax-info.component';
import { KitContractComponent } from './components/kit-contract/kit-contract.component';
import { TransactionalInvestmentProfileComponent } from './components/transactional-investment-profile/transactional-investment-profile.component';
import { InvestmentProfileQuizModalComponent } from './components/transactional-investment-profile/investment-profile-quiz-modal/investment-profile-quiz-modal.component';
import { TransactionalResourcesModalComponent } from './components/transactional-investment-profile/transactional-resources-modal/transactional-resources-modal.component';
import { DirectorateComponent } from './components/directorate/directorate.component';
import { ContactInfoPmComponent } from './components/contact-info-pm/contact-info-pm.component';
import { OrganizationChartComponent } from './components/organization-chart/organization-chart.component';
import { OrganizationChartModalComponent } from './components/organization-chart/organization-chart-modal/organization-chart-modal.component';
import { GeneralInfoPmComponent } from './components/general-info-pm/general-info-pm.component';
import { ConstitutiveDocumentsModalComponent } from './components/general-info-pm/constitutive-documents-modal/constitutive-documents-modal.component';
import { EntityStatusComponent } from './components/entity-status/entity-status.component';
import { OperateChangesComponent } from './components/operate-changes/operate-changes.component';
import { ResourceProviderPmComponent } from './components/resource-provider-pm/resource-provider-pm.component';
import { AddressPmComponent } from './components/address-pm/address-pm.component';
import { AddressComponentPmComponent } from './components/address-pm/address-component-pm/address-component-pm.component';
import { AdministratorExercisingPfControlComponent } from './components/administrator-exercising-pf-control/administrator-exercising-pf-control.component';
import { PldQuizComponent } from './components/pld-quiz/pld-quiz.component';
import { BeneficiariesPmComponent } from './components/beneficiaries-pm/beneficiaries-pm.component';
import { FiscalResidencePmModalComponent } from './components/entity-status/fiscal-residence-pm-modal/fiscal-residence-pm-modal.component';
import { ControlPersonModalComponent } from './components/entity-status/control-person-modal/control-person-modal.component';
import { TiProfileComponent } from './components/ti-profile/ti-profile.component';
import { TiProfilePmComponent } from './components/ti-profile-pm/ti-profile-pm.component';
import { SpidProfileComponent } from './components/spid-profile/spid-profile.component';
import { CounterpartModalComponent } from './components/spid-profile/counterpart-modal/counterpart-modal.component';
import { PldQuizPmComponent } from './components/pld-quiz-pm/pld-quiz-pm.component';
import { TaxProfileComponent } from './components/tax-profile/tax-profile.component';
import { RealOwnerComponentPM } from './components/real-owner/real-owner.component-pm';
import { SpouseComponent } from './components/spouse/spouse.component';
import { ContractChangeStatusComponent } from './components/new-customer/modals/contract-change-status/contract-change-status.component';
import { SendEmailComponent } from './components/new-customer/modals/send-email/send-email.component';
import { ExpandDateComponent } from './components/new-customer/modals/expand-date/expand-date.component';
import { AdditionalInfoComponent } from './components/additional-info/additional-info.component';
import { CreditDataComponent } from '../maintenance/credit-data/credit-data.component';
import { GeneralInfoContractSectionComponent } from './components/general-info-contract-section/general-info-contract-section.component';
import { MultipleCatalogComponent } from './components/general-info-contract-section/multiple-catalog/multiple-catalog.component';
import { EquityCreationContractComponent } from './components/general-info-contract-section/equity-creation-contract/equity-creation-contract.component';
import { EquityPreviewContractComponent } from './components/general-info-contract-section/equity-preview-contract/equity-preview-contract.component'

@NgModule({
  declarations: [
    AppComponent,
    AddressComponent,
    AuthorizedFormModalComponent,
    AuthorizedPersonComponent,
    BankAccountComponent,
    BeneficiariesComponent,
    ContactInfoComponent,
    FinalizationComponent,
    FirstDataComponent,
    FirstDataPmComponent,
    GeneralInfoComponent,
    HomonimiasComponent,
    HomonymsPmComponent,
    InterviewComponent,
    CreditDataComponent,
    NewContractComponent,
    NewCustomerComponent,
    PpeInfoComponent,
    PrivacyNoticeComponent,
    ResourceProviderComponent,
    RealOwnerComponent,
    RealOwnerComponentPM,
    SearchComponent,
    SignComponent,
    TaxInfoComponent,
    KitContractComponent,
    TransactionalInvestmentProfileComponent,
    InvestmentProfileQuizModalComponent,
    TransactionalResourcesModalComponent,
    DirectorateComponent,
    ContactInfoPmComponent,
    OrganizationChartComponent,
    OrganizationChartModalComponent,
    GeneralInfoPmComponent,
    ConstitutiveDocumentsModalComponent,
    EntityStatusComponent,
    OperateChangesComponent,
    ResourceProviderPmComponent,
    AddressPmComponent,
    AddressComponentPmComponent,
    AdministratorExercisingPfControlComponent,
    PldQuizComponent,
    BeneficiariesPmComponent,
    FiscalResidencePmModalComponent,
    ControlPersonModalComponent,
    TiProfileComponent,
    TiProfilePmComponent,
    SpidProfileComponent,
    CounterpartModalComponent,
    PldQuizPmComponent,
    TaxProfileComponent,
    SpouseComponent,
    ContractChangeStatusComponent,
    SendEmailComponent,
    ExpandDateComponent,
    AdditionalInfoComponent,
    MultipleCatalogComponent,
    GeneralInfoContractSectionComponent,
    EquityCreationContractComponent,
    EquityPreviewContractComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    OnboardingRoutingModule,
    CoreModule,
    AsyncPipe,
]
})
export class OnboardingModule { }
