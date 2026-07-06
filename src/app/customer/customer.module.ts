import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CustomerRoutingModule } from './customer-routing.module';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

// Material
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
// Servicio de checkpoint con header { business: 'client' }
import { CustomerCheckpointService } from './services/customer-customer-checkpoint-core.service';

// Resolvers
import { CustomerGetSectionDataAddressResolver } from './resolvers/customer-get-section-data-address.resolver';
import { CustomerGetSectionDataPpeResolver } from './resolvers/customer-get-section-data-ppe.resolver';

// Components
import { CustomerAddressComponent } from './components/address/customer-address.component';
import { CustomerAutoCertificationSectionComponent } from './components/auto-certification-section/customer-auto-certification-section.component';
import { CustomerContactInfoComponent } from './components/contact-info/customer-contact-info.component';
import { CustomerFirstDataComponent } from './components/first-data/customer-first-data.component';
import { CustomerGeneralInfoComponent } from './components/general-info/customer-general-info.component';
import { CustomerNewCustomerComponent } from './components/new-customer/customer-new-customer.component';
import { CustomerPpeInfoComponent } from './components/ppe-info/customer-ppe-info.component';

import { CustomerTaxInfoComponent } from './components/tax-info/customer-tax-info.component';

import { CustomerFinalizationComponent } from './components/finalization/customer-finalization.component';
import { CustomerNotificationComponent } from './components/notification/customer-notification.component';

// Localized Sections
import { CustomerAddressSectionComponent } from './components/sections/address-section/customer-address-section.component';
import { CustomerClientDataComponent } from './components/sections/client-data/customer-client-data.component';

import { CustomerEconomicDependentsComponent } from './components/sections/economic-dependents/customer-economic-dependents.component';
import { CustomerIdentificationSectionComponent } from './components/sections/identification-section/customer-identification-section.component';

import { CustomerMailSectionComponent } from './components/sections/mail-section/customer-mail-section.component';

import { CustomerPhoneSectionComponent } from './components/sections/phone-section/customer-phone-section.component';
import { CustomerPositionHeldComponent } from './components/sections/position-held/customer-position-held.component';



// Localized Modals
import { CustomerBankContractLinkingComponent } from './components/modals/bank-contract-linking/customer-bank-contract-linking.component';


import { CustomerModalFiscalResidenceComponent } from './components/modals/modal-fiscal-residence/customer-modal-fiscal-residence.component';
import { CustomerModalFormComponent } from './components/modals/modal-form/customer-modal-form.component';

import { CustomerModalNotificationComponent } from './components/modals/modal-notification/customer-modal-notification.component';

import { CustomerModalPpeFamilyComponent } from './components/modals/modal-ppe-family/customer-modal-ppe-family.component';

import { CustomerModalSearchClientComponent } from './components/modals/modal-search-client/customer-modal-search-client.component';

import { CustomerModalTokenVerificationComponent } from './components/modals/modal-token-verification/customer-modal-token-verification.component';


// Search
import { CustomerSearchCustomerComponent } from './components/search-customer/customer-search-customer.component';
import { CustomerSearchCustomerV2Component } from './components/search-customer-v2/customer-search-customer-v2.component';

// Table Results
import { TableResultsComponent } from './components/table-results/customer-table-results.component';

// Directives
import { CustomerUppercaseDirective } from './directives/customer-uppercase.directive';
import { CustomerDateInputStrictDirective } from './directives/customer-date-strict-input.directive';
import { CustomerDateValidatorDirective } from './directives/customer-date-validator-input.directive';
import { CustomerNumericOnlyDirective } from './directives/customer-numeric-only.directive';
import { CustomerAlphanumericOnlyDirective } from './directives/customer-alphanumeric-only.directive';
import { CustomerHomonymsComponent } from './components/customer-homonyms/customer-homonyms.component';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    CustomerAddressComponent,
    CustomerAutoCertificationSectionComponent,
    CustomerContactInfoComponent,
    CustomerFinalizationComponent,
    CustomerFirstDataComponent,
    CustomerGeneralInfoComponent,

    CustomerNewCustomerComponent,
    CustomerPpeInfoComponent,

    CustomerTaxInfoComponent,
    CustomerNotificationComponent,

    // Localized Sections
    CustomerAddressSectionComponent,
    CustomerClientDataComponent,

    CustomerEconomicDependentsComponent,
    CustomerIdentificationSectionComponent,

    CustomerMailSectionComponent,

    CustomerPhoneSectionComponent,
    CustomerPositionHeldComponent,



    // Localized Modals
    CustomerBankContractLinkingComponent,


    CustomerModalFiscalResidenceComponent,
    CustomerModalFormComponent,

    CustomerModalNotificationComponent,
    CustomerModalPpeFamilyComponent,

    CustomerModalSearchClientComponent,



    // Search
    CustomerSearchCustomerComponent,
    CustomerSearchCustomerV2Component,

    // Table Results
    TableResultsComponent,

    // Directives
    CustomerUppercaseDirective,
    CustomerDateInputStrictDirective,
    CustomerDateValidatorDirective,
    CustomerNumericOnlyDirective,
    CustomerAlphanumericOnlyDirective,
    CustomerHomonymsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomerRoutingModule,
    SharedModule,
    AsyncPipe,

    CustomerModalTokenVerificationComponent,
    MatChipsModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatCardModule,
    MatTabsModule
  ],
  exports: [
    CustomerDateInputStrictDirective
  ],
  providers: [
    { provide: CustomerCheckpointService, useClass: CustomerCheckpointService },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_DATE_FORMAT,
    },
    CustomerGetSectionDataAddressResolver,
    CustomerGetSectionDataPpeResolver
  ]
})
export class CustomerModule { }




