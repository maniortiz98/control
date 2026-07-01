import { Component, inject, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { TopContract } from '../../models/top-contract';
import { NewContract } from '../../models/customer-initial-data';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { ERROR_MESSAGES } from '../../constants/form-messages';
import { Client } from '../../models/client-data';
import { OnboardingService } from '../../services/onboarding.service';
import { SubContract } from '../../models/subcontract';
import { ContractTopRequest } from '../../models/contract';

@Component({
  selector: 'app-new-contract',
  standalone: false,
  templateUrl: './new-contract.component.html',
  styleUrl: './new-contract.component.scss'
})
export class NewContractComponent {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly catalogsService = inject(CatalogsService);
  private readonly notifiactionsService = inject(NotificationsService);
  private readonly onboardingService = inject(OnboardingService);

  showCardTwo = false;
  showOptions = false;

  personTypeSelected = ''; // legal - person
  contractSelected: NewContract = { // el objeto
      personType: '1',           // Persona Fisica / Persona Moral
      bankAreaTypeId: 0,         // Tipo de Negocio => Casa de Bolsa / Banco
      contractTypeId: 0,         // Contrato ID
      contractType: '',          // Contrato Name
      typeContractSubtypeId: 0,  // Sub Contrato
      typeContractSubtype: ''    // Sub Contrato Name
  };

  clientData: Client = {} as Client;

  btnNext = false;
  btnNextOther = false;

  listType = signal<Array<any>>([]);
  listSubtype = signal<any[]>([]);

  topContracts: TopContract[] = [];

  otherContract: NewContract = {
    personType: '1',           // Persona Fisica / Persona Moral
    bankAreaTypeId: 0,         // Tipo de Negocio => Casa de Bolsa / Banco
    contractTypeId: 0,         // Contrato ID
    contractType: 'other',          // Contrato Name
    typeContractSubtypeId: 0,  // Sub Contrato
    typeContractSubtype: ''    // Sub Contrato Name
  };

  businessType = new FormControl('', {
    validators: [Validators.required],
    nonNullable: true
  });
  typeList = new FormControl({value: '', disabled: true}, {
    validators: [Validators.required],
    nonNullable: true
  });
  subTypeList = new FormControl({value: '', disabled: true}, {
    validators: [Validators.required],
    nonNullable: true
  });



  constructor() {}

  ngOnInit(): void {
    this.clientData = this.onboardingService.getCustomerInitialData();
    this.controlChanges();
  }

  /**
   * Method for subscribe to changes on any of their controls.
   */
  controlChanges(): void {
    this.businessType.valueChanges.subscribe((businessType: string|null) => {
      if ( businessType ) {
        this.typeList.reset();
        this.subTypeList.reset();
        this.subTypeList.disable();

        const bb = {
          personTypeId: this.personTypeSelected === 'person' ? 1 : 2
        };
        this.catalogsService.getContract(bb).subscribe(cat => {
          let filtered = cat.filter((item: any) => item.bankAreaTypeId == businessType);
          this.listType.set(filtered);
          this.typeList.enable();
        });
      }
    });

    this.typeList.valueChanges.subscribe((typeValue: any) => {
      if ( typeValue ) {
        const pt = this.personTypeSelected === 'person' ? 1 : 2;
        this.catalogsService.getSubContract({ contractTypeId: typeValue, personTypeId: pt}).subscribe((subtypeRes: SubContract[]) => {
          this.listSubtype.set(subtypeRes);
          this.subTypeList.enable();
        });
      }
    });
  }

  /**
   * if user selects PM or PF
   */
  selectTypePerson(type: 'legal'|'person'): void {

    this.close();

    if ( this.personTypeSelected == type ) {
      this.personTypeSelected = '';
    } else {
      this.personTypeSelected = type;
      this.btnNextOther = 'legal' === type;
    }

    if ( 'person' === this.personTypeSelected ) {
      this.getTopByPerson(this.personTypeSelected);
    }

    this.contractSelected = {
      personType: (this.personTypeSelected === 'person' ? '1' : '2'),
      bankAreaTypeId: 0,
      contractTypeId: 0,
      contractType: '',
      typeContractSubtypeId: 0,
      typeContractSubtype: '',
    };

  }

  /**
   *
   */
  close(): void {
    this.showOptions = false;
    this.resetForm();
    this.btnNext = false;
    this.btnNextOther = false;
  }

  selectTopContract(top: TopContract): void {
    if (
      this.contractSelected.bankAreaTypeId === top.bankAreaTypeId &&
      this.contractSelected.contractTypeId === top.contractTypeId &&
      this.contractSelected.typeContractSubtypeId === top.typeContractSubtypeId
    ) {
      this.contractSelected = {
        personType: '1',
        bankAreaTypeId: 0,
        contractTypeId: 0,
        contractType: '',
        typeContractSubtypeId: 0,
        typeContractSubtype: '',
      };

      this.btnNext = false;
      this.showOptions = false;
      this.btnNextOther = false;

      this.resetForm();
    } else {
      this.btnNext = true;
      this.btnNextOther = false;
      this.showOptions = false;

      this.contractSelected.bankAreaTypeId        = top.bankAreaTypeId;
      this.contractSelected.contractTypeId        = top.contractTypeId;
      this.contractSelected.contractType          = top.contractType;
      this.contractSelected.typeContractSubtypeId = top.typeContractSubtypeId;
      this.contractSelected.typeContractSubtype   = top.contractSubtype;

      this.resetForm();
    }

  }

  /**
   * Event when click on large buttons ( top contract or other )
   */
  selectOtherContract(con: NewContract): void {
    if ( this.contractSelected.contractType === con.contractType ) {
      this.contractSelected = {
        personType: '1',
        bankAreaTypeId: 0,
        contractTypeId: 0,
        contractType: '',
        typeContractSubtypeId: 0,
        typeContractSubtype: '',
      };

      this.btnNext = false;
      this.showOptions = false;
      this.btnNextOther = false;
    } else {
      this.btnNext = false;
      this.btnNextOther = true;
      this.showOptions = true;
      this.contractSelected = {
        personType: '1',
        bankAreaTypeId: con.bankAreaTypeId,
        contractTypeId: con.contractTypeId,
        contractType: 'other',
        typeContractSubtypeId: 0,
        typeContractSubtype: '',
      };
    }
    this.resetForm();
  }

  /**
   * form control resets
   */
  resetForm(): void {
    this.businessType.reset();
    this.typeList.reset();
    this.subTypeList.reset();
    this.typeList.disable();
    this.subTypeList.disable();
  }

  /**
   *
   */
  navigate(where: 'next'|'back'): void {

    document.body.classList.add('show-validation');

    if ( 'next' === where ) {

      this.clientData.personType = this.personTypeSelected === 'person' ? '1' : '2'; // : "1"

      if ( 'person' === this.personTypeSelected ) {

        if ( 'other' === this.contractSelected.contractType ) {

          if (this.businessType.hasError('required')) {
            this.businessType.markAsTouched();
            this.notifiactionsService.error(ERROR_MESSAGES.EMPTY_FORM);
            return;
          }

          if ( this.typeList.hasError('required') ) {
            this.typeList.markAsTouched();
            this.notifiactionsService.error(ERROR_MESSAGES.EMPTY_FORM);
            return;
          }
          if ( this.subTypeList.hasError('required') ) {
            this.subTypeList.markAsTouched();
            this.notifiactionsService.error(ERROR_MESSAGES.EMPTY_FORM);
            return;
          }

          if ( this.businessType.invalid || this.typeList.invalid || this.subTypeList.invalid ) {
            this.notifiactionsService.error(ERROR_MESSAGES.EMPTY_FORM);
          } else {
            this.clientData.bankAreaTypeId = this.businessType.value ? +this.businessType.value : 0;
            this.clientData.contractTypeId = this.typeList.value ? +this.typeList.value : 0;
            this.clientData.typeContractSubtypeId = this.subTypeList.value ? +this.subTypeList.value : 0;
            this.clientData.contractType = this.getTypeName(this.clientData.contractTypeId);
            this.clientData.typeContractSubtype = this.getSubtypeName(this.clientData.typeContractSubtypeId);

            console.log(this.clientData);
            this.onboardingService.setCustomerInitalData(this.clientData);
            this.onboardingService.updateCurrentOnboardingInfo({
              personType: 'PF',
              contractType: ''+this.clientData.contractTypeId,
              contractSubtype: ''+this.clientData.typeContractSubtypeId,
              businessType: ''+this.clientData.bankAreaTypeId,
            });
            this.router.navigate(['new-customer'], {relativeTo: this.route.parent});
          }
        } else {
          this.clientData.bankAreaTypeId = this.contractSelected.bankAreaTypeId; // : 1
          this.clientData.contractType = this.contractSelected.contractType; // : "CONTRATO BURSANET"
          this.clientData.contractTypeId = this.contractSelected.contractTypeId; // : 1
          this.clientData.typeContractSubtypeId = this.contractSelected.typeContractSubtypeId; // : 2
          this.clientData.typeContractSubtype = this.contractSelected.typeContractSubtype; // : 2

          console.log(this.clientData);
          this.onboardingService.updateCurrentOnboardingInfo({
            personType: 'PF',
            contractType: ''+this.clientData.contractTypeId,
            contractSubtype: ''+this.clientData.typeContractSubtypeId,
            businessType: ''+this.clientData.bankAreaTypeId,
          });
          this.onboardingService.setCustomerInitalData(this.clientData);
          this.router.navigate(['new-customer'], {relativeTo: this.route.parent});
        }

      } else {

        if ( this.businessType.invalid || this.typeList.invalid || this.subTypeList.invalid ) {
          this.businessType.markAsTouched();
          this.typeList.markAsTouched();
          this.subTypeList.markAsTouched();
          this.notifiactionsService.error(ERROR_MESSAGES.EMPTY_FORM);
        } else {
          this.clientData.bankAreaTypeId = this.businessType.value ? +this.businessType.value : 0;
          this.clientData.contractTypeId = this.typeList.value ? +this.typeList.value : 0;
          this.clientData.typeContractSubtypeId = this.subTypeList.value ? +this.subTypeList.value : 0;
          this.clientData.contractType = this.getTypeName(this.clientData.contractTypeId);
          this.clientData.typeContractSubtype = this.getSubtypeName(this.clientData.typeContractSubtypeId);

          this.onboardingService.setCustomerInitalData(this.clientData);
          this.onboardingService.updateCurrentOnboardingInfo({
              personType: 'PM',
              contractType: ''+this.clientData.contractTypeId,
              contractSubtype: ''+this.clientData.typeContractSubtypeId,
              businessType: ''+this.clientData.bankAreaTypeId,
            });
          this.router.navigate(['new-customer'], {relativeTo: this.route.parent});
        }

      }

    } else if ( 'back' === where ) {
      this.router.navigate(['../'], {relativeTo: this.route});
    }
  }

  /**
   * gets the name of contract type by id given
   */
  getTypeName(id: number): string {
    const aa = this.listType().find(item => id == item.contractTypeId);
    return aa.contractType ?? '';
  }

  getSubtypeName(id: number): string {
    console.log(this.listSubtype());
    const aa = this.listSubtype().find(item => id == item.contractSubtypeId);
    console.log(aa);
    return aa.contractSubtype ?? '';
  }

  /**
   *
   */
  getTopByPerson(personType: string): any {
    const body: ContractTopRequest = {
      limit: 3,
      personTypeId: (personType === 'person' ? 1 : 2)
    };
    this.catalogsService.getContractTop(body).subscribe((item: any) => {
      this.topContracts = item;
    });
  }

}
