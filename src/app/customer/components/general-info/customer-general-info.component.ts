import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CATALOG_NAME, CustomerSTRINGS } from '../../constants/customer-constants';
import { CustomerCountries } from '../../models/customer-country';
import { CustomerCatalogsService } from '../../services/customer-catalogs.service';
import { CatalogsAllowed } from '../../types/customer-catalogs.type';
import { CustomerEconomicActivity } from '../../models/customer-economic-activity';
import { CustomerOccupation } from '../../models/customer-occupation';
import { CustomerMaritalStatus } from '../../models/customer-marital-status';
import { CustomerMarriageType } from '../../models/customer-marriage-type';
import { MatSelectChange } from '@angular/material/select';
import { CustomerNotificationsService } from '../../services/customer-notifications.service';
import { CustomerRelationships } from '../../models/customer-relationships';
import { ColumnsDataTable, ConfigDataTable } from '../../models/customer-table-interfaces';
import { CustomerAddressSectionComponent } from '../sections/address-section/customer-address-section.component';
import { CustomerGeneralInfoCheckpoint } from '../../models/checkpoints/customer-general-info-checkpoint';
import { CustomerGeneralInfoStorageService } from '../../services/storage-services/customer-general-info-storage.service';
import { ERROR_MESSAGES, NOTIFICATION_MESSAGES, SUCCESS_MESSAGES } from '../../constants/customer-form-messages';
import { CustomerAddress } from '../../models/customer-address';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { generalInfoToCheckpoint, mapFormToGeneralInfo, mapGeneralInfoToForm } from '../../services/mappers/customer-general-info.mapper';
import { CustomerCheckpointService } from '../../services/customer-customer-checkpoint-core.service';
import { CustomerOnboardingService } from '../../services/customer-onboarding.service';
import { CustomerSector } from '../../models/customer-sector';
import { CustomerClient } from '../../models/customer-client-data';
import { firstValueFrom, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CustomerNotificationModalService } from '../../services/customer-notification-modal.service';
import { CustomerGeneralInfoContract } from '../../models/customer-general-info';
import { CustomerFielValidationService } from '../../services/customer-fiel-validation.service';
import { convertDateBack } from '../../utils/customer-datetime';
import { PermissionRolService } from '../../../core/services/rol.service';
import { generalInfoToNonContractCheckpoint } from '../../services/mappers/maintenance/customer-general-info-mant-mapper';
import { butonFunctionDis, buttonFunctionEn } from '../../utils/customer-disable-or-enabled';
import { CustomerInformationService } from '../../services/customer-information.service';

@Component({
  selector: 'app-customer-general-info',
  standalone: false,
  templateUrl: './customer-general-info.component.html',
  styleUrl: './customer-general-info.component.scss'
})
export class CustomerGeneralInfoComponent implements OnInit {

  generalInfoStorage = signal<CustomerGeneralInfoCheckpoint>;

  private readonly fb = inject(FormBuilder);
  private readonly catalogsService = inject(CustomerCatalogsService);
  private readonly notificationService = inject(CustomerNotificationsService);
  private readonly notificationModal = inject(CustomerNotificationModalService);
  private readonly storageService = inject(CustomerGeneralInfoStorageService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly onboardingService = inject(CustomerOnboardingService);
  private readonly checkpoint = inject(CustomerCheckpointService);
  private readonly dialog = inject(MatDialog);
  private readonly fielValidationService = inject(CustomerFielValidationService);
  private readonly roleService = inject(PermissionRolService);
  private readonly customerInformationService = inject(CustomerInformationService);

  isMaintenance: boolean = false;
  isReadOnly: boolean = false;
  dataAddress?: CustomerAddress;
  showExpiration = false;
  initalContractData: CustomerGeneralInfoContract | null = null;
  allPermises: any;

  contract = this.onboardingService.getCustomerInitialData();
  contractType = this.contract?.contractTypeId?.toString() ?? "";
  subContractType: string = this.contract?.typeContractSubtypeId?.toString() ?? "";


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


    fiel: [''],
    expirationFiel: [{ value: '', disabled: true }]
  });

  personClasifications = signal<Array<any>>([]);
  countries = signal<Array<CustomerCountries>>([]);
  economicActivities = signal<Array<CustomerEconomicActivity>>([]);

  occupations = signal<Array<CustomerOccupation>>([]);
  civilStatus = signal<Array<CustomerMaritalStatus>>([]);
  maritalTypes = signal<Array<CustomerMarriageType>>([]);
  relationship = signal<Array<CustomerRelationships>>([]);
  sectors = signal<Array<CustomerSector>>([]);

  filteredEconomicActivities = signal<CustomerEconomicActivity[]>([]);
  economicActivityFilter = new FormControl('');

  @ViewChild(CustomerAddressSectionComponent)
  addressSectionComponent?: CustomerAddressSectionComponent;

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

  checkUnsavedChanges() {
    const isDirty = this.form.dirty ||
                    (this.addressSectionComponent?.profileForm?.dirty ?? false);
    this.unsavedChangesService.setUnsavedChanges(isDirty);
  }

  ngOnInit() {
    this.isMaintenance = this.onboardingService.getCurrentInfo().isMaintenance;
    this.allPermises = this.roleService.getPermissionsCustomer();

    this.isMaintenance = this.onboardingService.getCurrentInfo().isMaintenance;
    this.allPermises = this.roleService.getPermissionsCustomer();

    this.form.valueChanges.subscribe(() => this.checkUnsavedChanges());

    this.chargeInitialData();

    this.catalogsService.getCountry({ land: [] }).subscribe(c => {
      this.countries.set(c);
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

    this.initFormSubscriptions();
  }

  initFormSubscriptions() {
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
          this.addressSectionComponent?.setAddresData(null);
        }
      }
      expirationControl?.updateValueAndValidity();
      expirationControl2?.updateValueAndValidity();
    });

    this.form.get('isParentOfEmployee')?.valueChanges.subscribe(value => {
      const relControl = this.form.get('relationship');
      const instControl = this.form.get('institutionDenomination');
      if (value === true) {
        relControl?.setValidators([Validators.required]);
        instControl?.setValidators([Validators.required]);
      } else {
        relControl?.clearValidators();
        relControl?.setValue('');
        instControl?.clearValidators();
        instControl?.setValue('');
      }
      relControl?.updateValueAndValidity();
      instControl?.updateValueAndValidity();
    });

    this.form.get('fiel')?.valueChanges.subscribe(value => {
      if (value && value.trim() !== '') {
        this.showExpiration = true;
      } else {
        this.showExpiration = false;
      }
    });
  }

  ngAfterViewInit() {
    const generalInfoPerms = this.allPermises?.['general-info'];
    const cantEdit = generalInfoPerms?.allDisabled ?? true;

    if (this.addressSectionComponent) {
      const isEmp = this.form.get('ocupation')?.value === '02';
      (this.addressSectionComponent as any).active = isEmp;
    }

    if (this.addressSectionComponent?.profileForm) {
      this.addressSectionComponent.profileForm.valueChanges.subscribe(() => this.checkUnsavedChanges());
    }

    if (this.isMaintenance) {
      console.log({ cantEdit });
      if (cantEdit) {
        butonFunctionDis(['btnEditGI']);
      } else {
        buttonFunctionEn(['btnEditGI']);
      }
      butonFunctionDis(['btnCancelGI', 'btnSaveGI']);
      this.form.disable();
      if (this.addressSectionComponent) {
        this.addressSectionComponent.profileForm.disable();
      }
    }

    if (this.storageService.isSavedInfoFlag()) {
      this.form.disable();
      if (this.addressSectionComponent) {
        this.addressSectionComponent.profileForm.disable();
      }
    }
  }

  editGI() {
    butonFunctionDis(['btnEditGI']);
    buttonFunctionEn(['btnSaveGI', 'btnCancelGI']);

    const clientSectionPerms = this.allPermises?.['general-info']?.['sections']?.['client-section'];
    if (clientSectionPerms && !clientSectionPerms.allDisabled) {
      if ((clientSectionPerms.fieldsEnabled?.length ?? 0) > 0) {
        clientSectionPerms.fieldsEnabled.forEach((field: string) => {
          this.form.get(field)?.enable();
        });
      } else if ((clientSectionPerms.fieldsDisabled?.length ?? 0) > 0) {
        if (this.addressSectionComponent) {
          this.addressSectionComponent.profileForm.enable();
        }
        this.form.enable();
        const storage = this.storageService.generalInfoItem();
        if (this.addressSectionComponent) {
          this.addressSectionComponent.enableDisableFECityMun(storage?.country ?? 'MX');
        }
        clientSectionPerms.fieldsDisabled.forEach((field: string) => {
          this.form.get(field)?.disable();
        });
      } else {
        if (this.addressSectionComponent) {
          this.addressSectionComponent.profileForm.enable();
        }
        const storage = this.storageService.generalInfoItem();
        if (this.addressSectionComponent) {
          this.addressSectionComponent.enableDisableFECityMun(storage?.country ?? 'MX');
        }
        this.form.enable();
      }
    } else if (!clientSectionPerms) {
      const cantEdit = this.allPermises?.['general-info']?.allDisabled ?? true;
      if (!cantEdit) {
        if (this.addressSectionComponent) {
          this.addressSectionComponent.profileForm.enable();
        }
        this.form.enable();
      }
    }
  }

  cancelGI() {
    buttonFunctionEn(['btnEditGI']);
    butonFunctionDis(['btnSaveGI', 'btnCancelGI']);
    this.isReadOnly = true;
    this.form.disable();
    if (this.addressSectionComponent) {
      this.addressSectionComponent.profileForm.disable();
    }

    this.form.markAsPristine();
    if (this.addressSectionComponent) {
      this.addressSectionComponent.profileForm.markAsPristine();
    }
    this.unsavedChangesService.setUnsavedChanges(false);

    this.rechargePage();
  }

  rechargePage() {
    const clientId = this.initalContractData?.clientId || this.onboardingService.getCurrentInfo().clientId;
    if (clientId) {
      this.customerInformationService.getCustomerInfo(Number(clientId)).subscribe({
        next: async (response) => {
          await this.onboardingService.getCustomerInfo(response);
          this.chargeInitialData(true);
          setTimeout(() => {
            if (this.addressSectionComponent) {
              this.addressSectionComponent.setAddresData(this.dataAddress ?? null);
              this.addressSectionComponent.profileForm.disable();
            }
          }, 100);
        },
        error: (err) => {
          console.log('Error refrescando detail de cliente', err);
          this.chargeInitialData(true);
          setTimeout(() => {
            if (this.addressSectionComponent) {
              this.addressSectionComponent.setAddresData(this.dataAddress ?? null);
              this.addressSectionComponent.profileForm.disable();
            }
          }, 100);
        }
      });
    } else {
      this.chargeInitialData(true);
      setTimeout(() => {
        if (this.addressSectionComponent) {
          this.addressSectionComponent.setAddresData(this.dataAddress ?? null);
          this.addressSectionComponent.profileForm.disable();
        }
      }, 100);
    }
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
    if (this.isEmployee()) {
      console.log('Es empleado, llenado su direccion')
      resultDataAddress = await this.addressSectionComponent?.onSubmit();
    }

    console.log("result direccion")
    console.log(resultDataAddress)
    var contractSectiontoSave: CustomerGeneralInfoContract | undefined = undefined;

    if (this.form.valid) {
      console.log('valid');


      if (resultDataAddress == null && this.isEmployee()) {
        return;
      }

      if (this.form.value.fiel && this.form.value.fiel.trim() !== '') {
        try {
          const fielValue = this.form.value.fiel.toString();
          console.log("Validando FIEL...");

          const isValid = await firstValueFrom(
            this.fielValidationService.validateFiel('fielValidation', {
              certificateNumber: fielValue
            })
          );

          if (isValid && isValid.certificateStatus == SUCCESS_MESSAGES.VALID_FIEL) {
            console.log('fiel válida')
            console.log('colocando fecha')
            console.log(isValid.maturityDate)
            this.form.patchValue({
              expirationFiel: convertDateBack(isValid.maturityDate)
            })
          } else {
            if (isValid && isValid.certificateStatus) {
              console.log({ isValid })
              this.notificationService.error(ERROR_MESSAGES.INVALID_FIEL);
              return;
            } else {
              console.log('servicio con respuesta null o intermitente')
              this.notificationService.warning(ERROR_MESSAGES.SERVICE_ERROR_FIEL,
                ERROR_MESSAGES.SERVICE_ERROR_FIEL_MESSAGE
              )
              return;
            }
          }
          console.log('FIEL OK');
        } catch (err) {
          console.log("Error validando FIEL", err);
          return;
        }
      } else {
        this.form.patchValue({
          expirationFiel: ''
        });
      }

      const itemToSave = mapFormToGeneralInfo(this.form, resultDataAddress ?? null);
      console.log({ itemToSave })
      itemToSave.fielExpirationDate = this.form.getRawValue().expirationFiel;

      if (this.isMaintenance) {
        const detailAddressId = this.storageService.generalInfoItem()?.addressId?.toString() || this.initalContractData?.addressId?.toString() || "";
        const requestCheckpoint = generalInfoToNonContractCheckpoint(itemToSave, detailAddressId);
        (this.checkpoint as any).saveSectionNonContract('general-information', requestCheckpoint).subscribe({
          next: (i: any) => {
            this.unsavedChangesService.setUnsavedChanges(false);
            this.form.markAsPristine();
            if (this.addressSectionComponent?.profileForm) {
              this.addressSectionComponent.profileForm.markAsPristine();
            }
            this.storageService.setFullSectionSingal({
              contractSection: contractSectiontoSave ? contractSectiontoSave : null,
              executorSection: null,
              clientSection: itemToSave,
            });
            this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
            
            this.cancelGI();
          },
          error: (err: any) => {
            console.log(err);
          }
        });
      } else {
        const requestCheckpoint = generalInfoToCheckpoint(itemToSave);
        this.checkpoint.saveSection('general-information', requestCheckpoint).subscribe({
          next: (i: any) => {
            if (i.status !== 'CREATED') {
              console.log(i.status)
            } else {
              this.unsavedChangesService.setUnsavedChanges(false);
              this.form.markAsPristine();
              if (this.addressSectionComponent?.profileForm) {
                this.addressSectionComponent.profileForm.markAsPristine();
              }
              this.storageService.setFullSectionSingal({
                contractSection: contractSectiontoSave ? contractSectiontoSave : null,
                executorSection: null,
                clientSection: itemToSave,
              })
              this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
              this.showAndHideTabs();
              (this.onboardingService as any).enableTabs();
            }

          },
          error: (err: any) => {
            console.log(err)
          }
        });
      }
    } else {
      console.log('false');
      document.body.classList.add('show-validation');

      Object.entries(this.form.controls).forEach(([name, control]) => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });

      this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS);
    }
  }

  showAndHideTabs() {
    (this.onboardingService as any).hideTabs('customer-operate-changes');
    // BEAT: Always hide real-owner tab in customer flow
    (this.onboardingService as any).hideTabs('customer-real-owner');
    (this.onboardingService as any).hideTabs('customer-resource-provider');
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
    const ecoCtrl = this.form.get('economicActivity');
    ecoCtrl?.setValue('');
    ecoCtrl?.setValidators([Validators.required]);
    ecoCtrl?.updateValueAndValidity();
    this.economicActivityFilter.setValue('');
    
    this.catalogsService.getEconomicActivityByPersonType({ subPersonTypeId: event.value }).subscribe(i => {
      this.economicActivities.set(i);
      this.filteredEconomicActivities.set(i);
    })
  }


  chargeInitialData(isReset?: boolean) {
    const storage = this.storageService.generalInfoItem();
    console.log(storage)
    if (storage != null) {
      console.log({ storage })
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
        other: storage.otherAddress ?? '',
      }
      console.log(mapGeneralInfoToForm(storage));
      this.form.patchValue(mapGeneralInfoToForm(storage));
      this.catalogsService.getEconomicActivityByPersonType({ subPersonTypeId: storage.personClassification }).subscribe(i => {
        console.log(i)
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
      this.isEmployee.set(false);
      this.isInMarriage.set(false);
      this.showExpiration = false;
      if (isReset) {
        this.addressSectionComponent?.profileForm.reset();
      }
      this.form.patchValue({
        actinverEmployee: false
      })
    }
    const contractStorage = this.storageService.generalInfoContract();
    console.log({ contractStorage })
    if (contractStorage) {
      this.initalContractData = contractStorage;
    }
  }
}
























