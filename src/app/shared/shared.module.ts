import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedRoutingModule } from './shared-routing.module';

// Directives
import { AlphanumericOnlyDirective } from './directives/alphanumeric-only.directive';
import { NumericOnlyDirective } from './directives/numeric-only.directive';
import { UppercaseDirective } from './directives/uppercase.directive';

// Components
import { AddressSectionComponent } from './components/sections/address-section/address-section.component';
import { AutoCertificationSectionComponent } from './components/sections/auto-certification-section/auto-certification-section.component';
import { ClientDataComponent } from './components/sections/client-data/client-data.component';
import { CustomerIdentificationPmComponent } from './components/sections/customer-identification-pm/customer-identification-pm.component';
import { EconomicDependentsComponent } from './components/sections/economic-dependents/economic-dependents.component';
import { IdentificationSectionComponent } from './components/sections/identification-section/identification-section.component';
import { LegalPowerSectionComponent } from './components/sections/legal-power-section/legal-power-section.component';
import { MailSectionComponent } from './components/sections/mail-section/mail-section.component';
import { MiscellaneousSectionComponent } from './components/sections/miscellaneous-section/miscellaneous-section.component';
import { ModalAttoneryComponent } from './components/modals/modal-attonery/modal-attonery.component';
import { ModalCotitularComponent } from './components/modals/modal-cotitular/modal-cotitular.component';
import { ModalFiscalResidenceComponent } from './components/modals/modal-fiscal-residence/modal-fiscal-residence.component';
import { ModalFormComponent } from './components/modals/modal-form/modal-form.component';
import { ModalHomonymsComponent } from './components/modals/modal-homonyms/modal-homonyms.component';
import { ModalNotificationComponent } from './components/modals/modal-notification/modal-notification.component';
import { ModalPpeFamilyComponent } from './components/modals/modal-ppe-family/modal-ppe-family.component';
import { ModalSearchClientComponent } from './components/modals/modal-search-client/modal-search-client.component';
import { NotificationComponent } from './components/notification/notification.component';
import { PhoneSectionComponent } from './components/sections/phone-section/phone-section.component';
import { PositionHeldComponent } from './components/sections/position-held/position-held.component';
import { PpeSectionComponent } from './components/sections/ppe-section/ppe-section.component';
import { SearchCustomerComponent } from './components/search-customer/search-customer.component';
import { SearchCustomerV2Component } from './components/search-customer-v2/search-customer-v2.component';
import { SocietiesAndAssociationsComponent } from './components/sections/societies-and-associations/societies-and-associations.component';
import { TableResultsComponent } from './components/table-results/table-results.component';
import { ModalShareholderComponent } from './components/modals/modal-shareholder/modal-shareholder.component';
import { ModalAddShareholderComponent } from './components/modals/modal-add-shareholder/modal-add-shareholder.component';
import { TableResultsTreeComponent } from './components/table-results-tree/table-results-tree.component';
import { BankContractLinkingComponent } from './components/modals/bank-contract-linking/bank-contract-linking.component';
import { CatalogTableComponent } from './components/catalog-table/catalog-table.component';

// Angular Material
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorIntlEs } from './providers/mat-paginator.intl-es.provider';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatSortModule } from '@angular/material/sort';


// others
import { DomSanitizer } from '@angular/platform-browser';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import { W8BENModalComponent } from './components/modals/modal-w8-ben/modal-w8-ben.component';
import { RegisteredOfficersModalComponent } from './components/modals/modal-registered-officers/modal-registered-officers.component';
import { CurrencyInputDirective } from './directives/currency-input.directive';
import { CurrencyDirective } from './directives/currency.directive';
import { ExecutorModalComponent } from './components/modals/executor-modal/executor-modal.component';
import { DateValidatorDirective } from './directives/date-validator-input.directive';
import { DateInputStrictDirective } from './directives/date-strict-input.directive';
import { PercentageDirective } from './directives/percentage-directive';

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
    // Directives
    AlphanumericOnlyDirective,
    NumericOnlyDirective,
    PercentageDirective,
    DateValidatorDirective,
    DateInputStrictDirective,
    UppercaseDirective,
    CurrencyInputDirective,
    CurrencyDirective,
    // Components
    AddressSectionComponent,
    AutoCertificationSectionComponent,
    ClientDataComponent,
    SocietiesAndAssociationsComponent,
    ModalCotitularComponent,
    MailSectionComponent,
    PhoneSectionComponent,
    IdentificationSectionComponent,
    EconomicDependentsComponent,
    MiscellaneousSectionComponent,
    LegalPowerSectionComponent,
    ModalAttoneryComponent,
    ModalSearchClientComponent,
    PpeSectionComponent,
    ModalPpeFamilyComponent,
    ModalFiscalResidenceComponent,
    ModalHomonymsComponent,
    CustomerIdentificationPmComponent,
    EconomicDependentsComponent,
    LegalPowerSectionComponent,
    ModalShareholderComponent,
    W8BENModalComponent,
    RegisteredOfficersModalComponent,
    ModalAddShareholderComponent,
    ModalFormComponent,
    ModalHomonymsComponent,
    ModalNotificationComponent,
    ModalPpeFamilyComponent,
    ModalSearchClientComponent,
    NotificationComponent,
    PhoneSectionComponent,
    PositionHeldComponent,
    PpeSectionComponent,
    SearchCustomerComponent,
    SearchCustomerV2Component,
    SocietiesAndAssociationsComponent,
    TableResultsComponent,
    TableResultsTreeComponent,
    ExecutorModalComponent,
    CatalogTableComponent,
    BankContractLinkingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedRoutingModule,
    // Angular Material
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDividerModule,
    MatChipsModule,
    MatSortModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    // Directives
    AlphanumericOnlyDirective,
    CurrencyDirective,
    NumericOnlyDirective,
    PercentageDirective,
    DateValidatorDirective,
    DateInputStrictDirective,
    UppercaseDirective,
    CurrencyInputDirective,
    // Components
    TableResultsComponent,
    TableResultsTreeComponent,
    CatalogTableComponent,
    SearchCustomerComponent,
    SearchCustomerV2Component,
    AddressSectionComponent,
    AutoCertificationSectionComponent,
    ClientDataComponent,
    IdentificationSectionComponent,
    MailSectionComponent,
    PhoneSectionComponent,
    MiscellaneousSectionComponent,
    PpeSectionComponent,
    CustomerIdentificationPmComponent,
    // Angular Material
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatButtonToggleModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDividerModule,
    MatChipsModule,
    MatSortModule,
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorIntlEs,
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_DATE_FORMAT,
    },
  ],
})
export class SharedModule {
  constructor(
    private registry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    const icons = [
      'action-view',
      'catalogs',
      'check',
      'cancel',
      'check_circle_fill',
      'Generals',
      'how_to_vote',
      'left-arrow',
      'legal_person',
      'money-sheet',
      'notification-bell',
      'paper',
      'paper_edit',
      'person',
      'person_add_alt_1',
      'person-card',
      'person-circle',
      'person_search',
      'person-square',
      'plagiarism',
      'point-green',
      'point-red',
      'point-yellow',
      'right_arrow',
      'search_custom',
      'search_person',
      'square-check',
      'square-uncheck',
      'transfer',
      'trust',

    ];

    icons.forEach((icon: string) => {
      this.registry.addSvgIcon(
        icon,
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `assets/icons/${icon}.svg`
        )
      );
    });
  }
}
