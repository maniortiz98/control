import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, Validators } from '@angular/forms';
import { OnboardingService } from '../../../onboarding/services/onboarding.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchContractService } from '../../services/search-contract.service';
import { ClientPFCustomer, ClientPMCustomer, Contract, ContractsSearchResponse } from '../../models/contracts';
import { compareGenderAndReturnValue, compareGenderFullText } from '../../../shared/utils/maper-gender';
import { BankingAreaTypeEnum } from '../../../onboarding/models/contract';
import { NotificationsService } from '../../../shared/services/notifications.service';

@Component({
  selector: 'app-search',
  standalone: false,
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  private readonly router                = inject(Router);
  private readonly route                 = inject(ActivatedRoute);
  private readonly onboardingService     = inject(OnboardingService);
  private readonly searchContractService = inject(SearchContractService);
  private readonly notificationService   = inject(NotificationsService);

  businessTypeControl = new FormControl('998', {
    nonNullable: true,
    validators: [Validators.required]
  });
  searchTypeControl   = new FormControl('contractNumber', {
    nonNullable: true,
    validators: [Validators.required]
  });
  searchControl       = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required]
  });

  businessTypeControlSignal = toSignal(this.businessTypeControl.valueChanges, {
    initialValue: this.businessTypeControl.value
  });
  searchTypeControlSignal   = toSignal(this.searchTypeControl.valueChanges, {
    initialValue: this.searchTypeControl.value
  });
  searchControlSignal       = toSignal(this.searchControl.valueChanges, {
    initialValue: this.searchControl.value
  });

  personType: 'PF'|'PM' = 'PM';

  bancoList = signal<Array<Contract>>([]);
  bolsaList = signal<Array<Contract>>([]);

  selectedContract: Contract = {} as Contract;
  isContractSelected: boolean = false;
  clientPF: ClientPFCustomer = {} as ClientPFCustomer;
  clientPM: ClientPMCustomer = {} as ClientPMCustomer;

  constructor() {
    // this.searchTypeControl.setValue('contractNumber');
  }

  /**
   * Event triggered by 'search' button.
   */
  search(): void {

    console.log(this.searchControlSignal());
    if ( this.searchControlSignal() === '' ) {
      return;
    }

    this.clearData();

    if ( this.searchTypeControlSignal() === 'contractNumber' ) {

      this.searchContractService.searchByContract(this.searchControlSignal(), this.businessTypeControlSignal()).subscribe({
        next: (response: ContractsSearchResponse) => {
          const businesTypeMessage =  this.searchTypeControlSignal() === 'contractNumber' ? 'Cuenta' : 'Cliente';
          if ( response.client == null ) {
            this.notificationService.error(`${businesTypeMessage} No Encontrado`, 'Favor de Verificar');
            return;
          }

          console.log(response);
          this.personType = response.client.personType === '1' ? 'PF' : 'PM';
          this.processClient(response.client, response.client.personType);

          if ( null === response.contracts || 0 === response.contracts.length ) {
            this.notificationService.error('La Búsqueda no Devolvió Cuentas');
          } else {
            this.processResponse(response);
          }
        },
        error: (err: any) => {
          console.log(err);
        }
      });

    } else if ( this.searchTypeControlSignal() === 'customerNumber' ) {

      this.searchContractService.searchByCustomer(this.searchControlSignal()).subscribe({
        next: (response: ContractsSearchResponse) => {
          if ( response.client == null ) {
            this.notificationService.error('Cliente No Encontrado', 'Favor de Verificar');
            return;
          }
          console.log(response);
          this.personType = response.client.personType === '1' ? 'PF' : 'PM';
          this.processClient(response.client, response.client.personType);
          if ( null === response.contracts || 0 === response.contracts.length ) {
            this.notificationService.error('La Búsqueda no Devolvió Cuentas');
          } else {
            this.processResponse(response);
          }
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }

  /**
   *
   */
  processClient(data: any, personType: string): void {
    if ( personType === '1' ) {
      this.clientPF = data;
      this.clientPF.gender = compareGenderFullText(this.clientPF.gender);
    } else if ( personType === '2' ) {
      this.clientPM = data;
    }
  }

  /**
   *
   */
  processResponse(data: ContractsSearchResponse): void {

    const bancoContracts: Contract[] = [];
    const bolsaContracts: Contract[] = [];

    for (let i in data.contracts) {
      if (BankingAreaTypeEnum.BANCO === data.contracts[i]['bankingArea']) {
        bancoContracts.push(data.contracts[i]);
      } else if (BankingAreaTypeEnum.BOLSA === data.contracts[i]['bankingArea']) {
        bolsaContracts.push(data.contracts[i]);
      }
    }

    this.bancoList.set(bancoContracts);
    this.bolsaList.set(bolsaContracts);
  }

  /**
   *
   */
  selectContract(contract: any): void {
    this.isContractSelected = true;
    this.selectedContract = contract;
    console.log(this.selectedContract);
  }

  /**
   * Clear Data
   *
   * clears singals and vars used to store retrieved/selected data.
   */
  clearData(): void {
    this.bancoList.set([]);
    this.bolsaList.set([]);

    this.clientPF = {} as ClientPFCustomer;
    this.clientPM = {} as ClientPMCustomer;

    this.selectedContract = {} as Contract;
    this.isContractSelected = false;
  }

  /**
   *
   */
  go(): void {

    this.onboardingService.updateCurrentOnboardingInfo({
      requestId: '000',
      personType: this.personType,
      name: this.clientPF.fullName,
      contractType: String(this.selectedContract.contractTypeId),
      contractSubtype: String(this.selectedContract.contractSubtypeId),
      businessType: this.selectedContract.bankingArea,
      onboardingId: 0,
      isCustomer: false,
      isMaintenance: true,
      clientId: this.selectedContract.clientId,
      accountId: this.selectedContract.accountNumber,
      accountData: this.selectedContract
    });

    this.onboardingService.setCustomerInitalData({
      curp: this.personType === 'PF' ? this.clientPF.curp : this.clientPM.curp,
      // foreignerWithoutCurp?: boolean;
      rfc: this.personType === 'PF' ? this.clientPF.rfc : 'P M',
      // nif?: string;
      // nss?: string;
      // tin?: string;
      firstName: '',
      middleName: '',
      dateOfBirth: this.personType === 'PF' ? this.clientPF.birthDate : 'P M',
      firstLastName: '',
      secondLastName: '',
      gender: compareGenderAndReturnValue(this.personType === 'PF' ? +this.clientPF.gender : 1),
      // maritalStatus?: string;
      nationality:  this.personType === 'PF' ? this.clientPF.nationality : 'P M',
      countryOfBirth: this.personType === 'PF' ? this.clientPF.countryOfBirth : 'P M',
      // stateOfBirth?: string;
      // cityOfBirth?: string;
      // ppe?: boolean;
      // typeIden?: string;
      isMaintenance: true,
      personType: this.personType === 'PF' ? '1' : '2',
      bankAreaTypeId: Number(this.selectedContract.bankingArea),
      contractTypeId: this.selectedContract.contractTypeId,
      contractType: this.selectedContract.contractType,
      typeContractSubtypeId: this.selectedContract.contractSubtypeId,
      typeContractSubtype: this.selectedContract.contractSubtype
    });

    this.router.navigate(['/onboarding/new-customer']);
  }

  /**
   * Removes all spaces from the value of a FormControl.
   * Bind to (input) or (change) event on the template.
   * @param control - The FormControl whose value will be sanitized.
   */
  removeSpaces(control: FormControl<string>): void {
    const sanitized = control.value.replace(/\s/g, '');
    if (sanitized !== control.value) {
      control.setValue(sanitized);
    }
  }

}
