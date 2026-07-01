import { Component, forwardRef, inject, Inject, signal, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerClientDataComponent } from '../../sections/client-data/customer-client-data.component';
import { CustomerPositionHeldComponent } from '../../sections/position-held/customer-position-held.component';
import { DataClientDepPPE, DataClientFamilyPPE, DataClientSocAndAssoPPE } from '../../../models/customer-client-data';
import { CustomerAddressSectionComponent } from '../../sections/address-section/customer-address-section.component';

import { CustomerEconomicDependentsComponent } from '../../sections/economic-dependents/customer-economic-dependents.component';
import { CustomerOnboardingService } from '../../../services/customer-onboarding.service';
import { formFunctionDis, butonFunctionDis } from '../../../utils/customer-disable-or-enabled';
import { CustomerCountries } from '../../../models/customer-country';
import { CustomerEntity } from '../../../models/customer-entity';
import { CustomerCatalogsService } from '../../../services/customer-catalogs.service';
import { CustomerSearchClientFlowService } from '../../../services/customer-search-client-flow.service';
import { CustomerBankContractLinkingComponent, CustomerContract } from '../../modals/bank-contract-linking/customer-bank-contract-linking.component';

@Component({
  selector: 'app-customer-modal-form',
  standalone: false,
  templateUrl: './customer-modal-form.component.html',
  styleUrl: './customer-modal-form.component.scss'
})
export class CustomerModalFormComponent {
  private readonly onboardingService = inject(CustomerOnboardingService);
  private readonly catalogService = inject(CustomerCatalogsService);
  private readonly searchClientFlowService = inject(CustomerSearchClientFlowService);
  isMainten: boolean = (this.onboardingService as any).getCurrentInfo().isMaintenance
  isCustomer: boolean = (this.onboardingService as any).getCurrentInfo().isCustomer


  @ViewChild(CustomerClientDataComponent) clientDataComponent!: CustomerClientDataComponent
  @ViewChild(CustomerPositionHeldComponent) positionHeldComponent!: CustomerPositionHeldComponent;
  @ViewChild(CustomerAddressSectionComponent) addressSectionComponent!: CustomerAddressSectionComponent;

  @ViewChild(CustomerEconomicDependentsComponent) economicDependentsComponent!: CustomerEconomicDependentsComponent;
  @ViewChild(CustomerBankContractLinkingComponent) bankContractLinkingComponent!: CustomerBankContractLinkingComponent;
  constructor(
    public readonly modalRef: MatDialogRef<CustomerModalFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    document.body.classList.remove('show-validation');
  }

  countries = signal<Array<CustomerCountries>>([]);
  states = signal<CustomerEntity[]>([]);

  ngOnInit() {
    this.catalogService.getCountry({ land: [] }).subscribe(c => {
      this.countries.set(c);
    });

    this.catalogService.getFederalEntity({ land1s: ["MX"] }).subscribe(c => {
      this.states.set(c);
    });
  }

  ngAfterViewInit() {
    if (this.isMainten) {
      if (this.data.isMaintenance.all === true) {
        if (this.data.type === 'customer-ppe') {
          formFunctionDis(this.clientDataComponent.profileForm);
          formFunctionDis(this.positionHeldComponent.profileForm);
          butonFunctionDis(['btnAddData']);
        } else if (this.data.type === 'ppeDep') {
          formFunctionDis(this.clientDataComponent.profileForm);
          formFunctionDis(this.addressSectionComponent.profileForm);
          formFunctionDis(this.economicDependentsComponent.profileForm);
          butonFunctionDis(['btnAddData']);

        }
      }
    } else if (this.isCustomer) {
      if (this.data.isMaintenance.all === true) {
        if (this.data.type === 'customer-ppe') {
          formFunctionDis(this.clientDataComponent.profileForm);
          formFunctionDis(this.positionHeldComponent.profileForm);
          butonFunctionDis(['btnAddData']);
        } else if (this.data.type === 'ppeDep') {
          formFunctionDis(this.clientDataComponent.profileForm);
          formFunctionDis(this.addressSectionComponent.profileForm);
          formFunctionDis(this.economicDependentsComponent.profileForm);
          butonFunctionDis(['btnAddData']);

        }
      }
    }
  }

  close() {
    this.modalRef.close(null);
  }

  continue() {
    this.modalRef.close(this.data.dataClient[0].clientNumber);
  }

  searchC(): string | null {
    this.data.dataClient[0].countryOfBirth
    const countries = this.countries();
    const dat = countries.find(dat => dat.countryId === this.data.dataClient[0].countryOfBirth);
    return dat ? dat.country : null;
  }

  searchG(): string | null {
    const curp = this.data.dataClient[0].curp
    if (curp.length < 18) return null;
    if (curp.charAt(10) === 'H') {
      return 'MASCULINO'
    } else if (curp.charAt(10) === 'M') {
      return 'FEMENINO'
    } else if (curp.charAt(10) === 'X') {
      return 'NO BINARIO'
    }
    else {
      return null
    }
  }

  searchD(): string | null {
    const curp = this.data.dataClient[0].curp
    if (curp.length < 18) return null;

    const dateStr = curp.substring(4, 10);
    const centuryIndicator = curp.charAt(16);
    const year = parseInt(dateStr.substring(0, 2), 10);
    const month = parseInt(dateStr.substring(2, 4), 10);
    const day = parseInt(dateStr.substring(4, 6), 10);
    const century = isNaN(Number(centuryIndicator)) ? 2000 : 1900;
    const fullYear = century + year;

    const date = new Date(fullYear, month - 1, day);
    if (date.getFullYear() !== fullYear || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return null;
    }

    const dayStr = day.toString().padStart(2, '0');
    const monthStr = month.toString().padStart(2, '0');
    return `${dayStr}/${monthStr}/${fullYear}`;
  }

  searchS(): string | null {
    const curp = this.data.dataClient[0].curp
    if (curp.length < 18) return null;
    const satate = this.states();
    const dat = satate.find(dat => dat.bland === curp.substring(11, 13));
    return dat ? dat.bezei : null;
  }

  async saveFppe() {
    document.body.classList.add('show-validation');
    const resultData = await this.clientDataComponent.submitPPE();
    const resultDataPositionHeld = await this.positionHeldComponent.sendInformation();
    if (resultData !== null && resultDataPositionHeld !== null) {
      const data: DataClientFamilyPPE = {
        ...resultData,
        ...resultDataPositionHeld
      }
      await this.searchClientFlowService.validInWatchList(resultData);
      this.modalRef.close(data);
    }
  }

  onContractSelected(contract: any) {
    this.modalRef.close(contract);
  }

  async saveDppe() {
    document.body.classList.add('show-validation');
    const resultData = await this.clientDataComponent.submitPPE();
    const resultEconomicDependents = await this.economicDependentsComponent.sendInformation();
    const resultDataAddress = await this.addressSectionComponent.onSubmit()
    console.log(resultData, resultEconomicDependents, resultDataAddress);
    if (resultData !== null && resultEconomicDependents !== null && resultDataAddress !== null) {
      const data: DataClientDepPPE = {
        ...resultData,
        ...resultEconomicDependents,
        ...resultDataAddress
      }
      await this.searchClientFlowService.validInWatchList(resultData);
      this.modalRef.close(data);
    }
  }


}






