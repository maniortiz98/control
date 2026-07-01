import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralInfoContract } from '../../models/general-info';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { OnboardingService } from '../../services/onboarding.service';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { Client } from '../../models/client-data';
import { ACCOUNT_LEVEL, CLIENT_STATUS, CONTRACT_MANAGEMENT, ENROLLMENT_STATUS, MANAGEMENT_TYPE, NOTIFICATION_TYPE, REQUEST_STATUS } from './general-info-catalogs';
import { Advisor } from '../../models/catalogs/advisor';
import { FinancialCenter } from '../../models/catalogs/financial-center';
import { FundsOriginCategory } from '../../models/catalogs/funds-origin-category';
import { formToGeneralInfoContractSection, generalInfoContractToForm } from '../../services/mappers/general-info.mapper';
import { ERROR_MESSAGES } from '../../constants/form-messages';
import { TiProfileService } from '../../../shared/services/storage-services/ti-profile.service';
import { ActiwebService } from '../../../shared/services/actiweb.service';
import { firstValueFrom, Observable } from 'rxjs';
import { EquityCreationContractComponent } from './equity-creation-contract/equity-creation-contract.component';
import { MatDialog } from '@angular/material/dialog';
import { CreationEquityContract, EquityRegistrationResponse, PreviewEquityContract } from '../../models/equity-contract';
import { EquityPreviewContractComponent } from './equity-preview-contract/equity-preview-contract.component';
import { EquityStrategyItem } from '../../../maintenance/models/equity-stategy';


@Component({
  selector: 'app-general-info-contract-section',
  standalone: false,
  templateUrl: './general-info-contract-section.component.html',
  styleUrl: './general-info-contract-section.component.scss'
})
export class GeneralInfoContractSectionComponent {
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationsService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly catalogsService = inject(CatalogsService);
  private readonly tiprofileService = inject(TiProfileService);
  private readonly actiwebService = inject(ActiwebService);
  private readonly dialog = inject(MatDialog);

  isMaintenance: boolean = false;
  personType = input<string>('PM');
  isReadOnly = input<boolean>(false);
  initialInfo = input<GeneralInfoContract | null>(null);
  showGeneralInfo = signal<boolean>(false);
  options: any = [
    {
      id: 1,
      value: 'Option 1'
    },
    {
      id: 2,
      value: 'Option 2'
    },
    {
      id: 3,
      value: 'Other'
    }
  ]

  contract: Client = this.onboardingService.getCustomerInitialData()
  contractType: string = "";
  subContractType: string = "";
  isEquityVisible = true;
  isEquityDisabled = true;

  contactStatus = REQUEST_STATUS;
  accountLevel = ACCOUNT_LEVEL;
  contractManagement = CONTRACT_MANAGEMENT;
  managmenetType = MANAGEMENT_TYPE;
  notficationType = NOTIFICATION_TYPE;
  enrollmentStatus = ENROLLMENT_STATUS;
  clientStatus = CLIENT_STATUS;

  advisor = signal<Array<Advisor>>([]);
  financialCenters = signal<Array<FinancialCenter>>([]);

  fundOringCategory = signal<Array<FundsOriginCategory>>([]);
  equityStrategies = signal<Array<EquityStrategyItem>>([]);

  ngOnInit() {
    const info = this.initialInfo();
    if (info) {
      generalInfoContractToForm(info, this.contractForm);
    }

    this.catalogsService.getAdvisor().subscribe(i => {
      this.advisor.set(i);
    })

    this.catalogsService.getFinancialCenter().subscribe(i => {
      this.financialCenters.set(i);
    })

    this.catalogsService.getFundsOriginCategory().subscribe(i => {
      this.fundOringCategory.set(i);
      console.log(this.fundOringCategory())
    })
    this.checkEquityVisibility();

    this.contract = this.onboardingService.getCustomerInitialData()
    this.contractType = this.contract.contractTypeId?.toString() ?? "";
    this.subContractType = this.contract.typeContractSubtypeId?.toString() ?? "";

    console.log('iniciando seccion')
    console.log(this.contract);
    console.log(this.subContractType)
    if (this.subContractType == "48") {
      this.showGeneralInfo.set(true);
    }
    this.contractForm.get('consentGeolocalization')?.valueChanges.subscribe(val => {
      if (val) {
        this.contractForm.get('dateTime')?.enable();
        this.contractForm.get('latitude')?.enable();
        this.contractForm.get('longitude')?.enable();
      } else {
        this.contractForm.get('dateTime')?.disable();
        this.contractForm.get('latitude')?.disable();
        this.contractForm.get('longitude')?.disable();
      }
    });

    this.setRequiredIf(this.subContractType == "48", [
      'operationConfiramtionMedia',
    ]);

    const tiprofileServiceStorege = this.tiprofileService.maintenanceQuiz()
    console.log({ tiprofileServiceStorege })
    const actiwebStorage = this.actiwebService.actiwebData();
    console.log({ actiwebStorage })

    console.log(this.isEquityVisible)
    if (info) {
      this.isEquityDisabled = !info.isEquity;
    }
    console.log({ isEquityDisabled: this.isEquityDisabled })
    /*
    else if (tiprofileServiceStorege && actiwebStorage) {
      this.isEquityDisabled = false;
    }
    */

    this.contractForm.get('gestionType')?.valueChanges.subscribe(val => {
      if (val === "05") {
        this.loadEquityStrategies();
      } else {
        this.strategyTypesControl.setValue([]);
      }
      this.checkEquityVisibility();
    });

    // Check initially if it's already "05"
    if (this.contractForm.value.gestionType === "05") {
      this.loadEquityStrategies();
    }
  }

  loadEquityStrategies() {
    this.catalogsService.getStrategiesEquity().subscribe(res => {
      const activeStrategies = res.filter(item => item.active);
      this.equityStrategies.set(activeStrategies);
    });
  }

  checkEquityVisibility() {
    const strategies = this.contractForm.value.strategyTypes || [];
    if (strategies.length > 0 && this.contractForm.value.gestionType === "05") {
      this.isEquityVisible = true;
    } else {
      this.isEquityVisible = false;
    }
  }



  ngOnChanges() {
    if (this.isReadOnly()) {
      this.contractForm.disable();
    } else {
      this.contractForm.enable();
    }
  }

  setInitialData(info: GeneralInfoContract | null) {
    if (info) {
      generalInfoContractToForm(info, this.contractForm);
    }
  }


  contractForm: FormGroup = this.fb.group({
    saleForceProspect: [{ value: '', disabled: true }],
    clientStatus: [''],
    // clientStatus: ['', Validators.required], //TODO make catalog
    contractStatus: [''],
    openDate: [{ value: '', disabled: true }],

    initialRiskId: [{ value: '', disabled: true }],
    initialRiskDescription: [{ value: '', disabled: true }],
    modifyRiskId: [{ value: '', disabled: true }],
    modifyRiskDespcription: [{ value: '', disabled: true }],
    origin: [{ value: '', disabled: true }],
    n4UpdateDate: [{ value: '', disabled: true }],
    liverpoolDomicilie: [{ value: '', disabled: true }],

    isNumbered: [''],
    //operateCapitals: [''],
    checkProtected: [''],
    isOwnPosition: [''],

    isSocialPrevision: [''],
    authorizationConsultCreditReports: [''],
    biometricsAccount: [''],
    facialBiometrics: [''],

    accountLevel: [{ value: '', disabled: true }],
    contractDenomination: [''],
    PMContractBE: [''],  //TODO if true Beneficiario BE is required in PM
    h2hServices: [''],
    independentAsesor: [''],

    enrollmentStatus: [''],
    asociatedDirector: [''],
    directPromote: [''],
    financailCenter: [''],

    isrPercentage: ['', Validators.required],
    isrMonthlyCommision: [''],
    comissionPercentage: [''],

    trust: [''],
    clientHasTrust: [''],
    brokerageActinverTrust: [''],

    isPMSorety: [''],
    isBrokerageHouse: [''],

    externalCustody: [''],
    custody: [''],
    custodyIndeval: [''],
    financialCenterDelivery: [''],
    contractManagement: ['', Validators.required],
    gestionType: ['', Validators.required],
    vip: [''],
    strategyTypes: [[]],
    equityStrategies: [[]],
    isEquity: [false],
    operationReason: [''],
    otherReasons: [''],
    operationConfiramtionMedia: [''],

    documents: [''],
    transfers: [''],
    accountDeposit: [''],
    other: [''],
    otherPreferedProduct: [''],

    asociatedDirectorStatus: [''],
    asociatedDirectorFolio: [''],
    asociatedDirectorNumber: [''],
    asociatedDirectorName: [''],

    consentGeolocalization: [''],
    date: [''],
    time: [''],
    latitude: [''],
    longitude: [''],

    incapacity: [''],
    incapacityLetter: [''],
    dateOfDefunction: ['']
  })

  get strategyTypesControl(): FormControl<any[]> {
    return this.contractForm.get('strategyTypes') as FormControl<any[]>;
  }

  onSubmit(): GeneralInfoContract | undefined {
    if (this.contractForm.valid) {
      let message = "";
      message = this.validatePercent(this.contractForm.value.isrPercentage)
      if (message !== "") {
        this.notificationService.error(message + ": % ISR")
        return;
      }
      if (this.contractForm.value.isrMonthlyCommision) {
        message = this.validatePercent(this.contractForm.value.isrMonthlyCommision)
        if (message !== "") {
          this.notificationService.error(message + ": % de Comisión Mensual Credit Suisse")
          return;
        }
      }
      if (this.contractForm.value.comissionPercentage) {
        message = this.validatePercent(this.contractForm.value.comissionPercentage)
        if (message !== "") {
          this.notificationService.error(message + ": Porcentaje de Comisión")
          return;
        }
      }
      console.log(this.contractForm)
      const infoToSave = this.initialInfo ? formToGeneralInfoContractSection(this.contractForm, this.initialInfo()) : formToGeneralInfoContractSection(this.contractForm, null);
      this.checkEquityVisibility();
      return infoToSave;
    } else {
      document.body.classList.add('show-validation');
      Object.values(this.contractForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
      this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS)
      return undefined;
    }
  }

  validatePercent(value: string | number): string {
    console.log({ value })
    if (Number(value) >= 0 && Number(value) <= 100) {
      return ""
    } else {
      return "El porcentaje debe estar entre 0 y 100%"
    }
  }

  setRequiredIf(condition: boolean, controls: string[]) {
    controls.forEach(name => {
      const control = this.contractForm.get(name);
      if (!control) return;

      if (condition) {
        control.addValidators(Validators.required);
      } else {
        control.removeValidators(Validators.required);
      }

      control.updateValueAndValidity({ emitEvent: false });
    });
  }

  async createNewEquityContract() {
    console.log('agregando')
    const selectedIds = this.contractForm.value.strategyTypes || [];
    const selectedStrategies = this.equityStrategies().filter((s: EquityStrategyItem) =>
      selectedIds.includes(s.cveStrategy)
    );
    const responseModal = await firstValueFrom(this.callEquityCreationContract(selectedStrategies)) as EquityRegistrationResponse | undefined;
    console.log({ responseModal })
    if (responseModal != undefined && responseModal.status === 'SUCCESS') {
      const contract = responseModal.data.contracts[0];
      const member = responseModal.data.members?.[0];
      const fullName = member ? `${member.firstName} ${member.lastName} ${member.secondLastName}`.replace(/\s+/g, ' ').trim() : '';

      const previewData: PreviewEquityContract = {
        fatherContractNumber: this.onboardingService.currentInfo().accountId?.toString() || '',
        fatherClientNumber: member?.clientId || '',
        fatherFullName: fullName,
        childrenContractNumber: contract?.contractNumber || '',
        childrenClientNumber: member?.clientId || '',
        childrenFullName: fullName,
        childrenStrategyType: contract?.strategy || ''
      }

      const previewModal = await firstValueFrom(this.callEquityPreviewContact(previewData));
      console.log({ previewModal })
    }
  }

  private callEquityCreationContract(strategies: EquityStrategyItem[]):
    Observable<CreationEquityContract | undefined> {
    const dialogRef = this.dialog.open(EquityCreationContractComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '60vw',
      height: '56vh',
      data: {
        strategies: strategies,
        contract: this.onboardingService.currentInfo().accountId?.toString() || '',
        advisorId: this.contractForm.value.asociatedDirectorNumber || ''
      }
    });
    return dialogRef.afterClosed();
  }

  private callEquityPreviewContact(content: PreviewEquityContract):
    Observable<CreationEquityContract | undefined> {
    const dialogRef = this.dialog.open(EquityPreviewContractComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '80vw',
      height: '76vh',
      data: {
        content: content
      }
    });
    return dialogRef.afterClosed();
  }

}
