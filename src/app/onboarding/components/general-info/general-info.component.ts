import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CATALOG_NAME, REGEX, STRINGS } from '../../constants/constants';
import { Countries } from '../../models/country';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { CatalogsAllowed } from '../../../shared/types/catalogs.type';
import { EconomicActivity } from '../../models/economic-activity';
import { Occupation } from '../../models/occupation';
import { MaritalStatus } from '../../models/marital-status';
import { MarriageType } from '../../models/marriage-type';
import { MatSelectChange } from '@angular/material/select';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { Relationships } from '../../models/relationships';
import { ColumnsDataTable, ConfigDataTable } from '../../../shared/components/table-results/interfaces';
import { AddressSectionComponent } from '../../../shared/components/sections/address-section/address-section.component';
import { GeneralInfoCheckpoint, GeneralInfoExecutorSection } from '../../models/checkpoints/general-info-checkpoint';
import { GeneralInfoStorageService } from '../../../shared/services/storage-services/general-info-storage.service';
import { ERROR_MESSAGES, NOTIFICATION_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
import { Address } from '../../models/address';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { generalInfoToCheckpoint, mapFormToGeneralInfo, mapGeneralInfoToForm, mapToExecutorTable } from '../../services/mappers/general-info.mapper';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { OnboardingService } from '../../services/onboarding.service';
import { Sector } from '../../models/sector';
import { Client } from '../../models/client-data';
import { ExecutorInfo, ExecutorTableInfo } from '../../models/executor';
import { catchError, EMPTY, firstValueFrom, map, Observable, tap } from 'rxjs';
import { ExecutorModalComponent } from '../../../shared/components/modals/executor-modal/executor-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { butonFunctionDis, buttonFunctionEn } from '../../../shared/utils/disableOrEnabled';
import { PermissionRolService } from '../../../core/services/rol.service';
import { GeneralInfoContract } from '../../models/general-info';
import { FielValidationService } from '../../../shared/services/fiel-validation.service';
import { checkpointMantToGeneralInfo, generalInfoToCheckpointMant } from '../../services/mappers/maintenance/general-info-mant-mapper';
import { GeneralInfoPfMantCheckpoint } from '../../models/checkpoints/maintenance/general-info-pf-mant-checkpoint';
import { convertDateBack, convertDateTwoDigitsToMomentForFiel } from '../../../shared/utils/datetime';
import { GeneralInfoContractSectionComponent } from '../general-info-contract-section/general-info-contract-section.component';
import { TiProfileService } from '../../../shared/services/storage-services/ti-profile.service';
import { ModalExecutorService } from '../../../shared/services/modal-executor.service';
import { PhoneType } from '../../models/phone-type';
import { IdentificationType } from '../../models/identification-type';
import { CurrentOnboardingInfo } from '../../models/current-onboarding';

@Component({
  selector: 'app-general-info',
  standalone: false,
  templateUrl: './general-info.component.html',
  styleUrl: './general-info.component.scss'
})
export class GeneralInfoComponent implements OnInit {

  generalInfoStorage = signal<GeneralInfoCheckpoint>;

  private readonly fb = inject(FormBuilder);
  private readonly catalogsService = inject(CatalogsService);
  private readonly notificationService = inject(NotificationsService);
  private readonly notificationModal = inject(NotificationModalService);
  private readonly storageService = inject(GeneralInfoStorageService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly checkpoint = inject(CheckpointService);
  private readonly dialog = inject(MatDialog);
  private readonly roleService = inject(PermissionRolService);
  private readonly fielValidationService = inject(FielValidationService);
  private readonly modalExecutorService = inject(ModalExecutorService);
  public readonly ERROR_MESSAGES = ERROR_MESSAGES;

  isMaintenance: boolean = false;
  isExistingClient: boolean = false;
  isReadOnly: boolean = false;
  lastWillSuccession: boolean = false;
  dataAddress?: Address;
  showExpiration = false;
  executorNumber: number = 1;
  initalContractData: GeneralInfoContract | null = null;
  allPermises: any;

  readonly banxicoAutorization = [
    {
      value: true,
      label: "SI",
    },
    {
      value: false,
      label: "NO / NO UTILIZO EL SERVICIO",
    },
  ];

  contract: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo()
  contractType = this.contract.contractType?.toString() ?? "";
  subContractType: string = this.contract.contractSubtype?.toString() ?? "";

  generalInfoPageInformation: GeneralInfoExecutorSection = {
    showExecutors: false,
    executors: [],
    executorsTable: [],
  };


  form: FormGroup = this.fb.group({
    personClasification: ['', Validators.required],
    economicActivity: ['', Validators.required],
    ocupation: ['', Validators.required],
    sector: ['', Validators.required],
    actinverEmployee: [false, Validators.required],
    actinverEmployeeNumber: [''],
    civilStatus: ['', Validators.required],
    maritalType: ['', Validators.required],

    profession: ['', Validators.required],
    company: [''],
    charge: [''],
    phoneCompany: [''],
    webPage: [''],

    isParentOfEmployee: ['', Validators.required],
    relationship: [''],
    institutionDenomination: [''],

    haveBanxicoAutorization: ['', Validators.required],

    fiel: [''],
    expirationFiel: [{ value: '', disabled: true }],
    isOwnAccountAct: ['', Validators.required],
    haveResourceProvider: ['', Validators.required],
    mensajesMt940: [false],
    codigoSwiftBic: ['']
  });

  formOC: FormGroup = this.fb.group({
    changeOperation: [''],
  })

  testamentForm: FormGroup = this.fb.group({
    showTestamentaries: [''],
  })

  personClasifications = signal<Array<any>>([]);
  phoneTypes = signal<Array<PhoneType>>([]);
  countries = signal<Array<Countries>>([]);
  identifications = signal<Array<IdentificationType>>([]);

  economicActivities = signal<Array<EconomicActivity>>([]);

  occupations = signal<Array<Occupation>>([]);
  civilStatus = signal<Array<MaritalStatus>>([]);
  maritalTypes = signal<Array<MarriageType>>([]);
  relationship = signal<Array<Relationships>>([]);
  sectors = signal<Array<Sector>>([]);
  showOperationChange = signal<boolean>(true);
  showTestamentarySection = signal<boolean>(false);
  executorData = signal<ExecutorTableInfo[]>([]);
  executorFullData = signal<ExecutorInfo[]>([]);
  executorColumns: Array<ColumnsDataTable> = [];
  executorConfigs: ConfigDataTable = { showPag: false, showEditAction: true, showDeleteAction: true, showViewAction: false, multipleSelection: false, idName: 'id'};

  filteredEconomicActivities = signal<EconomicActivity[]>([]);
  economicActivityFilter = new FormControl('');

  @ViewChild(AddressSectionComponent)
  addressSectionComponent?: AddressSectionComponent;

  @ViewChild(GeneralInfoContractSectionComponent)
  contractSection!: GeneralInfoContractSectionComponent;

  constructor() {
    this.economicActivityFilter.valueChanges.subscribe(value => {
      const filterValue = value?.toLowerCase() || '';

      this.filteredEconomicActivities.set(
        this.economicActivities().filter(item =>
          item.lineBusiness.toLowerCase().includes(filterValue)
        )
      );
    });
  }

  executorsChanged = false;
  private subscriptionsInitialized = false;

  initFormSubscriptions() {
    if (this.subscriptionsInitialized) return;
    this.subscriptionsInitialized = true;

    this.form.get('actinverEmployee')?.valueChanges.subscribe(value => {
      const control = this.form.get('actinverEmployeeNumber');
      if (value) {
        control?.setValidators([Validators.required]);
      } else {
        control?.clearValidators();
        control?.setValue('');
      }
      control?.updateValueAndValidity();
    });

    this.form.get('civilStatus')?.valueChanges.subscribe(value => {
      const expirationControl = this.form.get('maritalType');
      const isMarried = value && value.trim() === '2';
      this.isInMarriage.set(isMarried);

      if (isMarried) {
        expirationControl?.setValidators([Validators.required]);
      } else {
        expirationControl?.clearValidators();
        expirationControl?.setValue('');
      }
      expirationControl?.updateValueAndValidity();
    });

    this.form.get('ocupation')?.valueChanges.subscribe(value => {
      const expirationControl = this.form.get('profession');
      const expirationControl2 = this.form.get('isParentOfEmployee');
      const isEmp = value && value.trim() === '02';
      this.isEmployee.set(isEmp);

      if (isEmp) {
        expirationControl?.setValidators([Validators.required]);
        expirationControl2?.setValidators([Validators.required]);
        if (this.addressSectionComponent) {
          (this.addressSectionComponent as any).active = true;
        }
      } else {
        expirationControl?.clearValidators();
        expirationControl?.setValue('');
        expirationControl2?.clearValidators();
        expirationControl2?.setValue('');
        
        if (this.addressSectionComponent) {
          (this.addressSectionComponent as any).active = false;
        }
 
        if (this.form.get('ocupation')?.dirty) {
          this.form.patchValue({
            company: '',
            charge: '',
            phoneCompany: '',
            relationship: '',
            institutionDenomination: ''
          }, {emitEvent: false});
          this.addressSectionComponent?.profileForm.reset();
        }
      }
      expirationControl?.updateValueAndValidity();
      expirationControl2?.updateValueAndValidity();
    });

    this.form.get('fiel')?.valueChanges.subscribe(value => {
      if (value && value.trim() !== '') {
        this.showExpiration = true;
      } else {
        this.showExpiration = false;
      }
    });

    this.form.get('mensajesMt940')?.valueChanges.subscribe(value => {
      const bicCodeControl = this.form.get('codigoSwiftBic');
      if (value) {
        bicCodeControl?.setValidators([Validators.required, Validators.pattern(REGEX.BIC_VALIDATION)]);
      } else {
        bicCodeControl?.clearValidators();
        bicCodeControl?.setValue('');
      }
      bicCodeControl?.updateValueAndValidity();
    });
  }

  checkUnsavedChanges() {
    const isDirty = this.form.dirty ||
                    this.formOC.dirty ||
                    this.testamentForm.dirty ||
                    (this.contractSection?.contractForm?.dirty ?? false) ||
                    (this.addressSectionComponent?.profileForm?.dirty ?? false) ||
                    this.executorsChanged;
    this.unsavedChangesService.setUnsavedChanges(isDirty);
  }

  ngOnInit() {
    this.isMaintenance = this.onboardingService.getCurrentInfo().isMaintenance;
    this.isExistingClient = this.onboardingService.getCurrentInfo().isCustomer;

    this.form.valueChanges.subscribe(() => this.checkUnsavedChanges());
    this.formOC.valueChanges.subscribe(() => this.checkUnsavedChanges());
    this.testamentForm.valueChanges.subscribe(() => this.checkUnsavedChanges());

    this.initFormSubscriptions();
    this.chargeInitialData();

    this.catalogsService.getCountry({ land: [] }).subscribe(c => {
      this.countries.set(c);
    });

    this.catalogsService.getPhoneType({ telephoneTypeIds: [] }).subscribe(c => {
      this.phoneTypes.set(c);
    });

    this.catalogsService.getIdentificationType({ types: [] }).subscribe(c => {
      this.identifications.set(c);
    });

    this.catalogsService.getClassificationPerson({ subPersonTypeIds: [], personType: '1' }).subscribe(i => {
      this.personClasifications.set(i);
    })

    this.catalogsService.getOccupations({ ocupationIds: [] }).subscribe(i => {
      this.occupations.set(i);
    })

    this.catalogsService.getMaritalStatus({ maritalStatusIds: [] }).subscribe(i => {
      this.civilStatus.set(i);
    })

    this.catalogsService.getMarriageType({ marriageTypeIds: [] }).subscribe(i => {
      this.maritalTypes.set(i);
    })

    this.catalogsService.getRelationships({ bool: '', clientId: '', language: '' }).subscribe(i => {
      this.relationship.set(i)
    })

    this.catalogsService.getSector({ idsSectorTypeCve: [""] }).subscribe(i => {
      this.sectors.set(i);
    })

    this.executorColumns = [
      { name: 'registryNumber', title: 'Registro No.', show: true, type: 'string' },
      { name: 'clientNumber', title: 'No. de Cliente', show: true, type: 'string' },
      { name: 'fiscalNumber', title: 'RFC/NIF/TIN/NSS', show: true, type: 'string' },
      { name: 'address', title: 'Domicilio de Residencia', show: true, type: 'string' },
      { name: 'contact', title: 'Contacto', show: true, type: 'string' },
      { name: 'isActiveExecutor', title: 'Albacea', show: true, type: 'checkbox' },
    ]

    this.allPermises = this.roleService.getPermissions();

  }

  private addressSubscribed = false;
  private contractSubscribed = false;

  ngAfterViewInit() {
    if (this.contractSection?.contractForm && !this.contractSubscribed) {
      this.contractSection.contractForm.valueChanges.subscribe(() => this.checkUnsavedChanges());
      this.contractSubscribed = true;
    }

    setTimeout(() => {
      if (this.addressSectionComponent) {
        const isEmp = this.form.get('ocupation')?.value === '02';
        (this.addressSectionComponent as any).active = isEmp;

        if (this.addressSectionComponent?.profileForm && !this.addressSubscribed) {
          this.addressSectionComponent.profileForm.valueChanges.subscribe(() => this.checkUnsavedChanges());
          this.addressSubscribed = true;
        }
      }

      if (this.isMaintenance) {
        const cantEdit = this.allPermises['general-info'].allDisabled
        console.log({ cantEdit });
        if (cantEdit) {
          butonFunctionDis(['btnEditGI']);
        } else {
          buttonFunctionEn(['btnEditGI']);
        }
        butonFunctionDis(['btnCancelGI', 'btnSaveGI', 'saveExecutor']);
        this.form.disable();
        this.formOC.disable();
        this.testamentForm.disable();
        this.contractSection.contractForm.disable();
        this.addressSectionComponent?.profileForm.disable();
        this.executorConfigs = {
          ...this.executorConfigs,
          showEditAction: true,
          showDeleteAction: false
        };
      }

      if(this.isExistingClient){
        this.form.disable();
        this.addressSectionComponent?.profileForm.disable();

        this.form.get('isOwnAccountAct')?.enable({ emitEvent: false });
        this.form.get('haveResourceProvider')?.enable({ emitEvent: false });
        this.form.get('haveBanxicoAutorization')?.enable({ emitEvent: false });
      }

      if (this.storageService.isSavedInfoFlag()) {
        this.form.disable();
        this.addressSectionComponent?.profileForm.disable();
      }
    }, 100);
  }

  async onSubmit() {
    const webPageRexex = /^((https?:\/\/)?(www\.)?)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/)?$/i;
    const webPageControl = this.form.get('webPage');
    const webPageValue = webPageControl?.value;

    if (webPageValue !== null && webPageValue !== undefined && webPageValue.trim() !== '') {
      if (!webPageRexex.test(webPageValue)) {
        webPageControl?.setErrors({ invalidFormat: true });
        webPageControl?.markAsTouched();
        this.notificationService.error(ERROR_MESSAGES.WEB_PAGE_INVALID);
        return;
      } else {
        if (webPageControl?.hasError('invalidFormat')) {
          webPageControl.setErrors(null);
        }
      }
    }
    var resultDataAddress = null;
    if(this.isEmployee()){
      console.log('Es empleado, llenado su direccion')
      resultDataAddress = await this.addressSectionComponent?.onSubmit();
    }

    console.log("result direccion")
    console.log(resultDataAddress)
    var contractSectiontoSave: GeneralInfoContract | undefined = undefined;

    const raw = this.form.getRawValue();
    if (raw.mensajesMt940 && raw.codigoSwiftBic?.length === 8) {
      this.form.patchValue({ codigoSwiftBic: raw.codigoSwiftBic + 'XXX' });
    }
    console.log('valid ', this.form.valid, (this.formOC.valid || this.formOC.disabled ), this.isFormValidIncludingDisabled(this.form));
    if (this.form.valid && (this.formOC.valid || this.formOC.disabled ) && this.isFormValidIncludingDisabled(this.form)) {
      console.log('valid');
      if (resultDataAddress == null  && this.isEmployee()) {
        return;
      }
      this.generalInfoPageInformation.showExecutors = this.testamentForm.value.showTestamentaries;
      if (this.generalInfoPageInformation.showExecutors && !this.generalInfoPageInformation.executors.some(exe => exe.isActiveExecutor === true)) {
        this.notificationService.error(ERROR_MESSAGES.NOT_CAPTURED_INFO, 'Debe Registrar al Menos un Albacea Activo');
        return;
      }

      if (this.form.value.fiel && this.form.value.fiel !== '') {
        try {
          const fielValue = this.form.value.fiel.toString();
          console.log("Validando FIEL...");

          const isValid = await firstValueFrom(
            this.fielValidationService.validateFiel('fielValidation', {
              certificateNumber: fielValue
            })
          );

          if(isValid.certificateStatus == SUCCESS_MESSAGES.VALID_FIEL){
            console.log('fiel válida')
            console.log('colocando fecha')
            console.log(isValid.maturityDate)
            this.form.patchValue({
              expirationFiel: convertDateBack(isValid.maturityDate)
            })
          }else {
            if(isValid.certificateStatus){
              console.log({isValid})
              this.notificationService.error(ERROR_MESSAGES.INVALID_FIEL);
              return;
            }else {
              console.log('servicio con respuesta null')
              this.notificationService.warning(ERROR_MESSAGES.SERVICE_ERROR_FIEL,
                ERROR_MESSAGES.SERVICE_ERROR_FIEL_MESSAGE
              )
              return
            }
          }
          console.log('FIEL OK');
        } catch (err) {
          console.log("Error validando FIEL", err);
          return;
        }
      }

      const itemToSave = mapFormToGeneralInfo(this.form, this.formOC, resultDataAddress ?? null, this.getNonGuaranteedByIPAB());
      console.log({itemToSave})
      itemToSave.fielExpirationDate = this.form.getRawValue().expirationFiel;
      if (!this.isMaintenance) {
        const requestCheckpoint = generalInfoToCheckpoint(itemToSave, this.generalInfoPageInformation);
        this.checkpoint.saveSection('general-information', requestCheckpoint).subscribe({
          next: (i) => {
            if (i.status !== 'CREATED') {
              console.log(i.status)
            } else {
              this.unsavedChangesService.setUnsavedChanges(false);
              this.executorsChanged = false;
              this.form.markAsPristine();
              this.formOC.markAsPristine();
              this.testamentForm.markAsPristine();
              if (this.contractSection?.contractForm) {
                this.contractSection.contractForm.markAsPristine();
              }
              if (this.addressSectionComponent?.profileForm) {
                this.addressSectionComponent.profileForm.markAsPristine();
              }
              this.storageService.setFullSectionSingal({
                contractSection: contractSectiontoSave ? contractSectiontoSave : null,
                executorSection: this.generalInfoPageInformation,
                clientSection: itemToSave,
              })

              this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
              this.showAndHideTabs(requestCheckpoint, this.generalInfoPageInformation.showExecutors);
              this.onboardingService.enableTabs();
            }
          },
          error: (err) => {
            console.log(err)
          }
        });
      } else {

        contractSectiontoSave = this.contractSection.onSubmit();
        if (!contractSectiontoSave) {
          return;
        }
        console.log({contractSectiontoSave});
        const requestCheckpoint = generalInfoToCheckpointMant(itemToSave, contractSectiontoSave, this.generalInfoPageInformation)
        this.checkpoint.saveSectionMant('general-information', requestCheckpoint).subscribe({
          next: (i) => {
            if (i.status !== 'CREATED') {
              console.log(i.status)
            } else {
              this.unsavedChangesService.setUnsavedChanges(false);
              this.executorsChanged = false;
              this.form.markAsPristine();
              this.formOC.markAsPristine();
              this.testamentForm.markAsPristine();
              if (this.contractSection?.contractForm) {
                this.contractSection.contractForm.markAsPristine();
              }
              if (this.addressSectionComponent?.profileForm) {
                this.addressSectionComponent.profileForm.markAsPristine();
              }
              console.log('recargando')
              this.rechargePage();
              this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
              this.showAndHideTabs(requestCheckpoint, this.generalInfoPageInformation.showExecutors);
              if (requestCheckpoint.marriageType == '2') {
                this.onboardingService.showTabs('spouse');
              } else {
                this.onboardingService.hideTabs('spouse');
              }
            }
          },
          error: (err) => {
            console.log(err)
          }
        });
      }
    } else {
      console.log('false');
      document.body.classList.add('show-validation');

      this.form.markAllAsTouched();
      this.formOC.markAllAsTouched();

      const hasRequiredError = (control: AbstractControl): boolean => {
        if (control.hasError('required')) return true;
        if (control instanceof FormGroup) {
          return Object.values(control.controls).some(child => hasRequiredError(child));
        }
        if (control instanceof FormArray) {
          return control.controls.some(child => hasRequiredError(child));
        }
        return false;
      };

      if (hasRequiredError(this.form) || hasRequiredError(this.formOC)) {
        this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS);
      } else {
        const bicControl = this.form.get('codigoSwiftBic');
        if (this.form.get('mensajesMt940')?.value && bicControl?.hasError('pattern')) {
          this.notificationService.error(ERROR_MESSAGES.CODIGO_BIC_INVALID_MSG001);
        } else {
          this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS);
        }
      }
    }
  }

  showAndHideTabs(requestCheckpoint: GeneralInfoCheckpoint, showBeneficiaries: boolean) {
    if (!requestCheckpoint?.operatesChanges) {
      this.onboardingService.hideTabs('operate-changes');
    } else {
      const isRoleHidden = this.isMaintenance && this.allPermises && this.allPermises['operate-changes']?.hide;
      if (isRoleHidden) {
        this.onboardingService.hideTabs('operate-changes');
      } else {
        this.onboardingService.showTabs('operate-changes');
      }
    }
    if (requestCheckpoint?.acting) {
      this.onboardingService.hideTabs('real-owner');
    } else {
      this.onboardingService.showTabs('real-owner');
    }
    if (!requestCheckpoint?.hasSupplier) {
      this.onboardingService.hideTabs('resource-provider');
    } else {
      this.onboardingService.showTabs('resource-provider');
    }
    showBeneficiaries ? this.onboardingService.hideTabs('beneficiaries') : this.onboardingService.showTabs('beneficiaries');
  }

  isInMarriage = signal<boolean>(false);
  isEmployee = signal<boolean>(false);

  onMaritalStatusChange(event: MatSelectChange) {
    if (event.value == '2') {
      this.isInMarriage.set(true);
    } else {
      this.isInMarriage.set(false);
    }
  }

  onOcupationChange(event: MatSelectChange) {
    if (event.value == '02') {
      this.isEmployee.set(true);
    } else {
      this.isEmployee.set(false);
      this.form.patchValue({
        profession: '',
        company: '',
        charge: '',
        phoneCompany: ''
      });
    }
  }

  onPersonTypeChange(event: MatSelectChange) {
    this.catalogsService.getEconomicActivityByPersonType({ subPersonTypeId: event.value }).subscribe(i => {
      this.economicActivities.set(i);
      this.filteredEconomicActivities.set(i);
      this.form.patchValue({
        economicActivity: ''
      })
    })
  }

  getNonGuaranteedByIPAB(): string {
    const allowedContracts: string[] = ["4", "04", "12", "23", "24", "36", "37"];
    if (this.contractType === "01" && allowedContracts.includes(this.subContractType)) {
      return "30"
    }

    if (this.contractType === "08" && this.subContractType === "51") {
      return "30"
    }
    return "01"
  }

  isOperateChangeAvailable(): boolean {
    console.log("validando contratos")
    console.log(this.contractType)
    console.log(this.subContractType)


    // if (this.contractType === "3" && this.subContractType == "44") {
    //   return false;
    // }
    if (this.contractType === "5" && this.subContractType == "45") {
      return false;
    }
    if (this.contractType === "6" && this.subContractType == "46") {
      return false;
    }
    if (this.contractType === "9" && this.subContractType == "58") {
      return false;
    }
    if (this.contractType === "9" && this.subContractType == "57") {
      return false;
    }
    return true;
  }

  isTestamentarySectionAvailable(): boolean {

    //revert 1 and 1 MARCO PRODUCTOS Y SERVICIOS BANCARIOS MÚLTIPLES, Subtipo “NORMAL
    if (this.contractType === "1" && (this.subContractType == "1")) {
      return true;
    }
    return false;
  }


  async saveAlbacea() {
    console.log('agregando')

    const hasClientNumber = await this.notificationModal.success({
      title: 'Desea Continuar Captura de Albacea',
      btnAccept: 'Con No. de Cliente',
      btnDeny: 'Sin No. de Cliente'
    })
    if (hasClientNumber?.value === undefined) {
      return;
    }

    let newItem: ExecutorInfo | undefined = undefined;

    if (!hasClientNumber?.value) {
      newItem = await this.modalExecutorService.callExecutor(true, this.executorNumber);
    } else if (hasClientNumber?.value) {
      newItem = await this.modalExecutorService.callExecutor(false, this.executorNumber);
    }

    if (newItem) {
      console.log(newItem);
      this.executorFullData.update((list => [...list, newItem]))
      const newLine = mapToExecutorTable(newItem,
        (newItem?.address?.federalEntity ?? 'N/A')
        + ", " + (this.countries().find(c => c.countryId === (newItem?.address?.country ?? ''))?.country ?? 'N/A')
      )
      this.executorData.update((list => [...list, newLine]))
      this.executorNumber++;
      this.generalInfoPageInformation.executors = this.executorFullData();
      this.generalInfoPageInformation.executorsTable = this.executorData();
      this.executorsChanged = true;
      this.checkUnsavedChanges();
    }
  }

  async eventRowExecutor(event: any): Promise<void> {
    if (event.type === 'edit') {
      await this.editExecutor(event);
    }
    if (event.type === 'delete') {
      await this.deleteExecutor(event);
    }
  }


  async editExecutor(event: any) {
    const itemToEdit = event.row
    const executorInfoToEdit = this.executorFullData().filter(item => item.executorId == itemToEdit.executorId);
    let editedItem: ExecutorInfo | undefined;

    console.log({executorInfoToEdit})
    if (itemToEdit.clientNumber && itemToEdit.clientNumber != '-') {
      editedItem = await this.modalExecutorService.callExecutor(true, executorInfoToEdit[0].executorNumber ?? this.executorNumber, executorInfoToEdit[0]);
    } else {
      editedItem = await this.modalExecutorService.callExecutor(false, executorInfoToEdit[0].executorNumber ?? this.executorNumber, executorInfoToEdit[0]);
    }

    console.log({editedItem})
    if (editedItem) {
      this.executorFullData.update(list =>
        list.map(item =>
          item.executorId === editedItem.executorId ? editedItem : item
        )
      );
      const editeItemline = mapToExecutorTable(editedItem,
        (editedItem?.address?.federalEntity ?? 'N/A')
        + ", " + (this.countries().find(c => c.countryId === (editedItem?.address?.country ?? ''))?.country ?? 'N/A')
      )

      this.executorData.update(list => list.map(item => item.executorId === editeItemline.executorId ? editeItemline : item));
      this.generalInfoPageInformation.executors = this.executorFullData();
      this.generalInfoPageInformation.executorsTable = this.executorData();
      this.executorsChanged = true;
      this.checkUnsavedChanges();
    }
  }


  async deleteExecutor(event: any) {
    //TODO eliminado logico
    const result = await this.notificationModal.confirm({
      title: NOTIFICATION_MESSAGES.DELETE_CONFIRMATION_MESSAGE,
      btnAccept: 'Sí, Eliminar',
      btnDeny: 'No',
    });
    if (result?.value === true) {
      const itemToDelete = event.row

      this.executorData.update(list => list.filter(item => item.executorId != itemToDelete.executorId))
      this.executorFullData.update(list => list.filter(item => item.executorId != itemToDelete.executorId))

      this.generalInfoPageInformation.executors = this.executorFullData();
      this.generalInfoPageInformation.executorsTable = this.executorData();
      this.executorsChanged = true;
      this.checkUnsavedChanges();
      this.notificationService.success(SUCCESS_MESSAGES.DELETE_EXECUTOR)
    }
  }





  editt() {
    butonFunctionDis(['btnEditGI']);
    buttonFunctionEn(['btnSaveGI', 'btnCancelGI']);

    console.log(this.allPermises);

    if (!this.allPermises['general-info']['sections']['executor-modal'].allDisabled) {
      this.testamentForm.enable();
      if (!this.allPermises['general-info']['sections']['executor-modal'].buttonsDisabled.includes('save')) {
        buttonFunctionEn(['saveExecutor']);
      }
      this.executorConfigs = {
        ...this.executorConfigs,
        showEditAction: true,
        showDeleteAction: true
      };
    }

    if (!this.allPermises['general-info']['sections']['client-section'].allDisabled) {
      if (!this.allPermises['general-info']['sections']['client-section'].fieldsDisabled.includes('changeOperation')) {
        this.formOC.enable();
      }
      console.log(this.allPermises['general-info']['sections']['client-section'].fieldsEnabled)
      if ((this.allPermises['general-info']['sections']['client-section']?.fieldsEnabled?.length ?? 0) > 0) {
        this.allPermises['general-info']['sections']['client-section'].fieldsEnabled.forEach((field: string) => {
          const control = this.form.get(field);
          if (control) {
            control.enable();
          }
        })
      } else if ((this.allPermises['general-info']['sections']['client-section']?.fieldsDisabled?.length ?? 0) > 0) {
        this.addressSectionComponent?.profileForm.enable();
        this.form.enable();
        const storage = this.storageService.generalInfoItem();
        this.addressSectionComponent?.enableDisableFECityMun(storage?.country ?? 'MX');
        this.allPermises['general-info']['sections']['client-section'].fieldsDisabled.forEach((field: string) => {
          const control = this.form.get(field);
          if (control) {
            control.disable();
          }
        });
      } else {
        this.addressSectionComponent?.profileForm.enable();
        const storage = this.storageService.generalInfoItem();
        this.addressSectionComponent?.enableDisableFECityMun(storage?.country ?? 'MX');
        this.form.enable();
      }
    }
    if (!this.allPermises['general-info']['sections']['contract-section'].allDisabled) {
      this.contractSection.contractForm.enable();

      const contractFieldsDisabled: string[] =
        this.allPermises['general-info']['sections']['contract-section']?.fieldsDisabled ?? [];
      contractFieldsDisabled.forEach(field =>
        this.contractSection.contractForm.get(field)?.disable({ emitEvent: false })
      );
    }
  }

  cancel() {
    buttonFunctionEn(['btnEditGI']);
    butonFunctionDis(['btnSaveGI', 'btnCancelGI', 'saveExecutor']);
    this.isReadOnly = true;
    this.formOC.disable();
    this.form.disable();
    this.testamentForm.disable();
    this.contractSection.contractForm.disable();
    this.addressSectionComponent?.profileForm.disable();
    this.executorConfigs = {
      ...this.executorConfigs,
      showEditAction: true,
      showDeleteAction: false
    };

    this.executorsChanged = false;
    this.form.markAsPristine();
    this.formOC.markAsPristine();
    this.testamentForm.markAsPristine();
    if (this.contractSection?.contractForm) {
      this.contractSection.contractForm.markAsPristine();
    }
    if (this.addressSectionComponent?.profileForm) {
      this.addressSectionComponent.profileForm.markAsPristine();
    }
    this.unsavedChangesService.setUnsavedChanges(false);

    if (this.isMaintenance) {
      this.rechargePage();
    } else {
      this.chargeInitialData(true);
      setTimeout(() => {
        if (this.addressSectionComponent) {
          this.addressSectionComponent.setAddresData(this.dataAddress ?? null);
          this.addressSectionComponent.profileForm.disable();
        }
        if (this.contractSection) {
          this.contractSection.setInitialData(this.initalContractData ?? null);
          this.contractSection.contractForm.disable();
        }
      }, 100);
    }
  }

  chargeInitialData(isReset?: boolean) {
    const storage = this.storageService.generalInfoItem();
    const testamentaryData = this.storageService.testamentarySection();
    console.log(storage)

    this.showOperationChange.set(this.isOperateChangeAvailable());
    this.showTestamentarySection.set(this.isTestamentarySectionAvailable());

    if (testamentaryData) {
      this.generalInfoPageInformation = testamentaryData;
      this.testamentForm.patchValue({
        showTestamentaries: testamentaryData.showExecutors
      })
      this.executorData.set(testamentaryData.executorsTable)
    } else {
      this.executorData.set([])
      this.generalInfoPageInformation = {
        showExecutors: false,
        executors: [],
        executorsTable: []
      }
    }
    if (storage != null) {
      console.log({storage})
      this.catalogsService.getEconomicActivityByPersonType({ subPersonTypeId: storage.personClassification }).subscribe(i => {
        this.economicActivities.set(i);
        this.filteredEconomicActivities.set(i);
      })
      this.dataAddress = {
        addressType: storage.domicilieType,
        country: storage.country,
        postalCode: storage.postalCode,

        federalEntity: storage.federalEntity,
        city: storage.city,
        municipality: storage.municipality,
        neighborhood: storage.colony,
        street: storage.street,
        externalNumber: storage.externalNumber,
        internalNumber: storage.internalNumber,
      }
      console.log(mapGeneralInfoToForm(storage));
      this.form.setValue(mapGeneralInfoToForm(storage));
      this.formOC.setValue({ changeOperation: storage.operatesChanges });

      if (storage.mensajesMt940) {
        this.form.get('codigoSwiftBic')?.setValidators([Validators.required, Validators.pattern(REGEX.BIC_VALIDATION)]);
        this.form.get('codigoSwiftBic')?.updateValueAndValidity();
      }
      this.catalogsService.getEconomicActivityByPersonType({ subPersonTypeId: storage.personClassification }).subscribe(i => {
        this.economicActivities.set(i)
        this.filteredEconomicActivities.set(i);
      })
      if (storage.occupation === '02') {
        this.isEmployee.set(true);
      } else {
        this.isEmployee.set(false);
      }

      if (storage.maritalStatus === '2') {
        this.isInMarriage.set(true);
      } else {
        this.isInMarriage.set(false);
      }

      if (storage.fiel && storage.fiel.trim() !== '') {
        this.showExpiration = true;
      } else {
        this.showExpiration = false;
      }
    } else {
      this.form.reset();
      this.formOC.reset();
      this.isEmployee.set(false);
      this.isInMarriage.set(false);
      this.showExpiration = false;
      if (isReset) {
        this.addressSectionComponent?.profileForm.reset();
      }
      this.form.patchValue({
        actinverEmployee: false
      })
      this.formOC.patchValue({
        changeOperation: false
      })
    }
    const contractStorage = this.storageService.generalInfoContract();
    console.log({contractStorage})
    if (contractStorage) {
      this.initalContractData = contractStorage;
    }
  }



  isFormValidIncludingDisabled(form: AbstractControl): boolean {
    let isValid = true;

    const validate = (control: AbstractControl) => {
      const errors = control.validator ? control.validator(control) : null;
      if (errors) {
        isValid = false;
      }

      if (control instanceof FormGroup) {
        Object.values(control.controls).forEach(validate);
      }

      if (control instanceof FormArray) {
        control.controls.forEach(validate);
      }
    };

    validate(form);
    return isValid;
  }


  rechargePage() {
    if (!this.isMaintenance) {
      this.unsavedChangesService.setUnsavedChanges(false)
      return;
    }
    this.checkpoint
      .getMaintenanceSectionByPersonaFisica(['general-information'])
      .pipe(
        tap(async (response: any) => {
          const info = await checkpointMantToGeneralInfo(
            response?.checkpoints?.[0]?.data,
            this.phoneTypes(),
            this.countries(),
            this.identifications()
          );

          if (info) {
            this.storageService.setFullSectionSingal(info);
            this.chargeInitialData();
            this.unsavedChangesService.setUnsavedChanges(false)
          } else {
            console.log(
              'No hay info capturada previamente para datos generales'
            );
          }
        }),
        catchError(err => {
          console.error(err);
          return EMPTY;
        })
      )
      .subscribe({
        next: () => {
          this.ngOnInit();
          this.ngAfterViewInit();
          this.isReadOnly = true;
          setTimeout(() => {
            if (this.addressSectionComponent) {
              this.addressSectionComponent.setAddresData(this.dataAddress ?? null);
              this.addressSectionComponent.profileForm.disable();
            }
            if (this.contractSection) {
              this.contractSection.setInitialData(this.initalContractData ?? null);
              this.contractSection.contractForm.disable();
            }
          }, 150);
          this.unsavedChangesService.setUnsavedChanges(false)
        }
      });
  }

}
