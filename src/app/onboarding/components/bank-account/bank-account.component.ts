import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { REGEX, STRINGS } from '../../constants/constants';
import { Countries } from '../../models/country';
import { AccountType } from '../../models/account-type';
import { ActivatedRoute } from '@angular/router';
import { CurrencyType } from '../../models/currency-type';
import { AccountStatement } from '../../models/account-statement';
import { Bank } from '../../models/bank';
import { ERROR_MESSAGES, NOTIFICATION_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
import { ColumnsDataTable, ConfigDataTable } from '../../../shared/components/table-results/interfaces';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { BankAccountCheckpoint, BankAccountDataSection } from '../../models/bank-account';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { FirstDataClientService } from '../../../shared/services/storage-services/first-data-client.service';
import { SignStorageService } from '../../../shared/services/storage-services/sign-storage.service';
import { SingSection } from '../../models/sign-section';
import { CotitularInfo } from '../../models/cotitular';
import { BankAccountCheckpointSignalService } from '../../services/checkpoint/bank-account-signal.service';
import { Data } from '../../models/checkpoints/initial-data-checkpoint';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { MatSelectChange } from '@angular/material/select';
import * as BankAccountMapper from '../../services/mappers/bank-account.mapper';
import { SaveCheckpointResponse } from '../../../shared/models/checkpoint';
import {
  AllowedValuesRfcNifTinNss,
  compareAndReturnIdRfcNifTinNss,
  compareAndReturnRfcNifTinNss,
  compareAndReturnValueRfcNifTinNss
} from '../../../shared/utils/map-rfc-nif-tin-nss';
import { CurrentOnboardingInfo } from '../../models/current-onboarding';
import { PermissionRolService } from '../../../core/services/rol.service';
import { OnboardingService } from '../../services/onboarding.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { concatMap, EMPTY, firstValueFrom, lastValueFrom } from 'rxjs';
import { SearchClientFlowService } from '../../../shared/services/search-client-flow.service';
import { DataClient } from '../../models/client-data';
import { concatFullName } from '../../../shared/utils/string';

@Component({
  selector: 'app-bank-account',
  standalone: false,
  templateUrl: './bank-account.component.html',
  styleUrl: './bank-account.component.scss'
})
export class BankAccountComponent implements OnInit {

  private readonly nnformBuilder         = inject(NonNullableFormBuilder);
  private readonly modalService          = inject(NotificationModalService);
  private readonly notifService          = inject(NotificationsService);
  private readonly route                 = inject(ActivatedRoute);
  private readonly checkpointService     = inject(CheckpointService);
  private readonly checkSignalService    = inject(BankAccountCheckpointSignalService);
  private readonly dataClientService     = inject(FirstDataClientService);
  private readonly signService           = inject(SignStorageService);
  private readonly catalogService        = inject(CatalogsService);
  private readonly permissionService     = inject(PermissionRolService);
  private readonly onboardingService     = inject(OnboardingService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly clientFlowService     = inject(SearchClientFlowService);

  // Enable use on template.
  validators = Validators;

  readonly BANAMEX_INFO = {
    name: 'BANAMEX',
    id: '40002',
    chequesId: '1',
    chequesAccountLen: 7,
    debitoId: '3',
    debitoAccountLen: 16,
    creditoId: '2',
    creditoAccountLen: 16
  };

  readonly BANKS_INFO: {
    name: string;
    id:string;
    accountLen: number;
    clabeReq?: boolean;
  }[] = [
    { name: 'ACTINVER',   id: '40133', accountLen: 8,  clabeReq: false },
    { name: 'BANORTE',    id: '40072', accountLen: 10, clabeReq: true },
    { name: 'BBVA',       id: '40012', accountLen: 10, clabeReq: true },
    { name: 'HSBC',       id: '40021', accountLen: 10, clabeReq: true },
    { name: 'SCOTIABANK', id: '40044', accountLen: 10, clabeReq: true },
  ];

  /**
   * Catalogs
   */
  accountStatementList = signal<AccountStatement[]>([]);
  accountTypeList      = signal<Array<AccountType>>([]);
  bankList             = signal<Array<Bank>>([]);
  countriesList        = signal<Array<Countries>>([]);
  currencyTypeList     = signal<CurrencyType[]>([]);
  addresseeList        = signal<Array<{
    id: string;
    firstName: string;
    middleName: string;
    firstLastName: string;
    secondLastName: string;
    birthDate: string;
    curp: string;
    foreignerWithoutCurp: boolean;
    rfc: string;
    nif: string;
    ssn: string;
    gender: string;
    countryOfBirth: string;
  }>>([]);

  showDomiciled         = signal<boolean>(true);
  hideClabe             = signal<boolean>(false);

  accountMaxLength: number = 100;

  // values to show in readonly input.
  curp: string = '';
  rfc : string = '';

  form: FormGroup =  this.nnformBuilder.group({
    accountType      : ['', []],
    currency         : ['', [Validators.required]],
    domiciled        : ['', [Validators.required]],
    accountStatus    : ['1', [Validators.required]],

    maxAmount        : ['', ],
    bank             : ['', [Validators.required]],
    alias            : ['', []],

    checkThird       : [false, []],
    checkDocument    : [false, []],
    checkPayment     : [false, []],

    addressee       : ['', [Validators.required]],
    addresseeAccount: ['', [Validators.required]],
    addresseeClabe  : ['', []],
    abaCode         : ['', [
                            Validators.minLength(9),
                            Validators.maxLength(9)
                          ]
                        ],
    swiftCode       : ['', [
                            Validators.maxLength(11)
                          ]
                        ],
    reference        : ['', []],
    concept          : ['', []],
    intermediaryBank : ['', []],
    subAccount       : ['', []],
    subAccountId     : ['', [
                              Validators.pattern(REGEX.SWIFT_VALIDATION),
                              Validators.minLength(8),
                              Validators.maxLength(11)
                            ]
                       ],
    temporality      : ['', []],
  });

  tableCols: ColumnsDataTable[] = [
      { name: 'accountStatusName', title: 'Estado de la Cuenta', show: true, type: 'string' },
      { name: 'temporality',       title: 'Temporalidad',        show: true, type: 'string' },
      { name: 'currencyName',      title: 'Divisa',              show: true, type: 'string' },
      { name: 'bankName',          title: 'Banco',               show: true, type: 'string' },
      { name: 'accountTypeName',   title: 'Tipo',                show: true, type: 'string' },
      { name: 'addresseeClabe',    title: 'CLABE',               show: true, type: 'string' },
  ];
  tableData: BankAccountDataSection[] = [];
  tableConfig: ConfigDataTable = {
    showPag: false,
    showEditAction: true,
    showDeleteAction: true,
    showViewAction: false,
    multipleSelection: false,
    idName: 'tempId',
    saveWord: 'active',
  };

  isEditting = false;
  edittingId = '';

  isThird: boolean = false;
  isSavedChanges: boolean = true;

  /** Data for Maintenance */
  onboardingInfo: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
  isMaintenance = signal<boolean>(this.onboardingService.getCurrentInfo().isMaintenance);
  permissions = this.permissionService.getPermissions()?.['bank-account'];
  disButtons = {
    edit: false,
    register: false,
    save: false,
    cancel: false,
  };
  canAdd = false;
  canEdit = false;
  canDelete = false;
  /** */

  /**
   * constructor
   */
  filteredBankList = signal<Bank[]>([]);
  bankFilter = new FormControl('');
  constructor() {
    document.body.classList.remove('show-validation');

    if ( 'PF' === this.onboardingService.getCurrentInfo().personType ) {
      this.permissions = this.permissionService.getPermissions()?.['bank-account'];
    } else if ( 'PM' === this.onboardingService.getCurrentInfo().personType ) {
      this.permissions = this.permissionService.getPermissions()?.['bank-account-pm'];
    }
    this.canAdd = this.permissions.permission.includes('add');
    this.canEdit = this.permissions.permission.includes('edit');
    this.canDelete = this.permissions.permission.includes('delete');
    this.bankFilter.valueChanges.subscribe(value => {
      const filterValue = value?.toLowerCase() || '';

      this.filteredBankList.set(
        this.bankList().filter(item =>
          item.bankName.toLowerCase().includes(filterValue)
        )
      );
    });
  }

  /**
   * On Init
   */
  ngOnInit(): void {
    document.body.classList.remove('show-validation');

    this.tableData = this.checkSignalService.getData();
    console.log(this.tableData);

    this.clientDataToList(this.dataClientService.getItem()); // Agrega al titular, a la lisa de destinatarios.
    this.coOwnerToList(this.signService.singSectionSignal()); // Agrega Cotitulares a la lista de destinatarios.
    console.log(this.addresseeList());

    this.accountStatementList.set(this.route.snapshot.data['accountStatement']);
    this.accountTypeList.set(this.route.snapshot.data['accountType']);
    this.countriesList.set(this.route.snapshot.data['countries']);
    this.currencyTypeList.set(this.route.snapshot.data['currencyType']);

    this.form.valueChanges.subscribe(() => {
      if(this.isSavedChanges && !this.form.dirty) {
        this.unsavedChangesService.setUnsavedChanges(this.form.dirty);
      } else {
        this.unsavedChangesService.setUnsavedChanges(true);
      }
    });

    if ( this.onboardingInfo.isMaintenance ) {
      this.initializeMaintenance();
    }

    this.getNames();
    console.log(this.tableData);

    this.onFormValueChanges();
  }

  /**
   * form control value changes
   */
  onFormValueChanges(): void {

    this.form.controls['currency'].valueChanges.subscribe((currency: any) => {
      console.log(`currency: ${currency}`);
      if ( '00' == currency ) {
        this.showDomiciled.set(false);
        this.form.controls['domiciled'].setValue('MX');
          this.catalogService.getBank({ country: 'MX'}).subscribe( i => {
          this.bankList.set(i)
          this.filteredBankList.set(i);
        });
      } else {
        this.showDomiciled.set(true);
        this.form.controls['domiciled'].setValue('');
        this.bankList.set([]);
        this.filteredBankList.set([]);
      }
    });

    this.form.controls['bank'].valueChanges.subscribe((bank: any) => {
      console.log(`bank: ${bank}`);
      this.validateBankAccountType(
        bank,
        this.form.controls['accountType'].value
      );
    });

    this.form.controls['accountType'].valueChanges.subscribe((accountType: any) => {
      console.log(`accountType: ${accountType}`);
      this.validateBankAccountType(
        this.form.controls['bank'].value,
        accountType
      );
    });

    this.form.controls['checkThird'].valueChanges.subscribe((checkThird: any) => {
      console.error(`thirdParty: ${checkThird}`);
      this.validateCheckThird(checkThird, true);
    });

    this.form.controls['addressee'].valueChanges.subscribe((addressee: any) => {
      console.log(`addressee: ${addressee}`);
      this.validateAddresseeControl(addressee);
    });
  }

  /**
   * Performs validation between BANK and ACCOUNT TYPE
   * than change account , clabe , account status and account type
   */
  validateBankAccountType(bankId: string, accountType: string): void {
    console.warn(`el banco es: ${bankId}`);
    console.log(`tipo de cuenta: ${accountType}`);

    this.hideClabe.set(false);
    this.accountMaxLength = 100;

    if ( this.BANAMEX_INFO.id === bankId ) {

      this.form.controls['accountType'].setValidators([Validators.required]);

      if ( this.BANAMEX_INFO.chequesId === accountType ) {
        // - addresseeClabe -> REQUERIDO
        // - addresseeAccount -> 7 digitos max y min
        this.form.controls['addresseeClabe'].setValidators([Validators.required]);
        this.form.controls['addresseeAccount'].setValidators(
          [
            Validators.required,
            Validators.minLength(this.BANAMEX_INFO.chequesAccountLen),
            Validators.maxLength(this.BANAMEX_INFO.chequesAccountLen)
          ]
        );
        this.accountMaxLength = this.BANAMEX_INFO.chequesAccountLen;

      } else if ( this.BANAMEX_INFO.debitoId === accountType ) {
        // - addresseeClabe -> OPCIONAL
        // - addresseeAccount -> 16 digitos max y min
        this.form.controls['addresseeClabe'].clearValidators();
        this.form.controls['addresseeAccount'].setValidators(
          [
            Validators.required,
            Validators.minLength(this.BANAMEX_INFO.debitoAccountLen),
            Validators.maxLength(this.BANAMEX_INFO.debitoAccountLen)
          ]
        );
        this.accountMaxLength = this.BANAMEX_INFO.debitoAccountLen;

      } else if ( this.BANAMEX_INFO.creditoId === accountType ) {
        // - addresseeClabe -> NO SE MUESTRA
        // - addresseeAccount -> 16 digitos max y min
        this.form.controls['addresseeClabe'].clearValidators();
        this.form.controls['addresseeClabe'].setValue('');
        this.form.controls['addresseeAccount'].setValidators(
          [
            Validators.required,
            Validators.minLength(this.BANAMEX_INFO.creditoAccountLen),
            Validators.maxLength(this.BANAMEX_INFO.creditoAccountLen)
          ]
        );
        this.hideClabe.set(true);
        this.accountMaxLength = this.BANAMEX_INFO.creditoAccountLen;
      } else {
        this.form.controls['addresseeClabe'].clearValidators();
        this.form.controls['addresseeAccount'].clearValidators();
      }

    } else {
      this.form.controls['accountType'].clearValidators();
      // this.form.controls['accountType'].setValue('');

      const info = this.BANKS_INFO.find(item => item.id === this.form.controls['bank'].value);
      console.log(info);

      if ( info ) {
        console.log('el banco ESTÁ en la lista');
        this.form.controls['addresseeAccount'].setValidators(
          [
            Validators.minLength(info.accountLen),
            Validators.maxLength(info.accountLen),
            Validators.required,
          ]
        );
        this.accountMaxLength = info.accountLen;

        if ( info.clabeReq ) {
          this.form.controls['addresseeClabe'].setValidators(
            [ Validators.required ]
          );
        } else {
          this.form.controls['addresseeClabe'].clearValidators();
        }

      } else {
        console.log('el banco NO está en la lista');
        this.form.controls['addresseeAccount'].setValidators([
          Validators.required,
          Validators.maxLength(100)
        ]);
        this.form.controls['addresseeClabe'].clearValidators();
      }

    }

    // at the end, update validity and value
    this.form.controls['accountType'].updateValueAndValidity({emitEvent: false});
    this.form.controls['addresseeAccount'].updateValueAndValidity({emitEvent: false});
    this.form.controls['addresseeClabe'].updateValueAndValidity({emitEvent: false});
  }

  /**
   * Submit Form
   * 1. makes validations ( required, format.. )
   */
  async onSubmit(): Promise<any> {
    document.body.classList.add('show-validation');
    console.log(this.form.value);

    if ( this.validateRequiredFields() ) {
      this.notifService.error(ERROR_MESSAGES.MISSING_INFO);
      return;
    }

    if ( this.invalidAccountNumber() ) {
      this.notifService.error(ERROR_MESSAGES.VERIFY_ACCOUNT_NUMBER);
      return;
    }

    if ( this.invalidFormat() ) {
      this.notifService.error(ERROR_MESSAGES.INCORRECT_FORMAT);
      return;
    }

    const formData = this.form.value;

    // Watch List Validation:
    if ( !formData.checkThird ) {
      await this.personWlValidation(formData, false);
    }

    if ( this.isEditting ) {
      const newArr = this.tableData.map(async (item: any) => {
        if ( this.edittingId === item.tempId ) {
          item.addresseeData     = formData.checkThird ? null : this.getClientData(formData.addressee),
          item.bankName          = await this.getBankName(formData.bank, formData.domiciled),
          item.currencyName      = this.getName('currency', formData.currency),
          item.accountTypeName   = this.getName('accountType', formData.accountType),
          item.accountStatusName = this.getName('accountStatus', formData.accountStatus),
          item = { ...item, ...formData };
        }
        return item;
      });
      this.isEditting = false;
      this.edittingId = '';
      this.tableData = await Promise.all(newArr);
      this.notifService.success(SUCCESS_MESSAGES.SUCCESSFUL_UPDATE);

    } else {
      const tempId: any = {
        bankAccountId: null,
        active: true,
        tempId: crypto.randomUUID(),
        addresseeData: formData.checkThird ? null : this.getClientData(formData.addressee),
        bankName: await this.getBankName(formData.bank, formData.domiciled),
        currencyName: this.getName('currency', formData.currency),
        accountTypeName: this.getName('accountType', formData.accountType),
        accountStatusName: this.getName('accountStatus', formData.accountStatus),

      };
      const data = {...formData, ...tempId};
      this.tableData = [...this.tableData, data];
      this.notifService.success(SUCCESS_MESSAGES.SUCCESSFUL_ADD);
    }

    this.isSavedChanges = false;
    console.log(this.tableData);
    this.resetForms();
    this.unsavedChangesService.setUnsavedChanges(true);
  }

  /**
   *
   * @returns if at least one control required its invalid.
   */
  validateRequiredFields(): any {
    const oneInvalid = Object.values(this.form.controls).some((control) => control.hasError('required') );
    if ( oneInvalid ) {
      Object.keys(this.form.controls).forEach(controlName => {
        if ( this.form.get(controlName)?.invalid ) {
          console.log("empty", controlName);
          this.form.get(controlName)?.markAsTouched();
        }
      });
    }
    return oneInvalid;
  }

  /**
   * Checks if account number is invalid.
   */
  invalidAccountNumber(): boolean {
    const accountCon = this.form.get('addresseeAccount');
    if ( accountCon?.hasError('minlength') || accountCon?.hasError('maxlength')) {
      return true;
    }
    return false;
  }

  /**
   *
   */
  invalidFormat(): boolean {
    const maxAmount = this.form.get('maxAmount');
    maxAmount?.setValidators([Validators.maxLength(20), Validators.pattern(REGEX.MONEY)]);
    Object.keys(this.form.controls).forEach(controlName => {
      const control = this.form.get(controlName);
      control?.updateValueAndValidity({emitEvent: false});
    });
    let invalid = false;
    Object.keys(this.form.controls).forEach(controlName => {
      if ( this.form.get(controlName)?.invalid ) {
        console.log("invalid", controlName);
        this.form.get(controlName)?.markAsTouched();
        invalid = true;
      }
    });
    return invalid;
  }

  /**
   * event emmited by table component.
   */
  eventRow(event: {type: string, row: any}): void {
    console.log(event.type, event.row);

    if ( STRINGS.EDIT === event.type ) {
      this.resetForms();
      this.isEditting = true;
      this.edittingId = event.row.tempId;
      this.manualPatchValue(event.row);

      if ( this.isMaintenance() && this.disButtons.edit ) {
        this.validateRolOnEdit();
      }

    } else if ( STRINGS.DELETE === event.type ) {

      if ( this.disButtons.save ) return;

      this.modalService.confirm({
        title: NOTIFICATION_MESSAGES.DELETE_QUESTION_MESSAGE,
        btnAccept: 'Si, Eliminar.',
        btnDeny: 'No'
      }).then((res: { value: boolean; message?: string } | undefined) => {
        if ( res && res.value ) {
          let newArr: any[] = [];
          if ( this.isMaintenance() ) {
              newArr = this.tableData.reduce((acc: BankAccountDataSection[], item: BankAccountDataSection) => {

                if ( item.tempId !== event.row.tempId ) {
                  acc.push(item);
                  return acc;
                }

                if ( item.bankAccountId === null ) {
                  return acc;
                }

                item.active = false;
                acc.push(item);
                return acc;
              }, []);
          } else {
            newArr = this.tableData.filter((item: any) => {
              if ( event.row.tempId != item.tempId ) {
                return item;
              }
            });
          }
          this.tableData = newArr;
          this.notifService.success(SUCCESS_MESSAGES.ITEM_DELETED);
        }
      });
    }
  }

  /**
   * used to reset all forms in this interface
   */
  resetForms(): void {
    this.form.reset({}, {emitEvent: false});
    document.body.classList.remove('show-validation');
  }

  save(): void {
    if ( this.isMaintenance() ) {
      this.saveData();
    } else {
      this.saveCheckpoint();
    }
  }

  /**
   * Saves data section on Maintenance mode.
   */
  saveData(): void {
    const body: BankAccountCheckpoint = {
      bankAccounts: BankAccountMapper.bankAccountMapperSaveMaint(this.tableData)
    };
    console.log(body);
    this.checkpointService.saveSectionMant<BankAccountCheckpoint>('bank-account', body)
      .pipe(
        concatMap((resp: SaveCheckpointResponse) => {
          console.log(resp);

          if ( 'CREATED' !== resp.status ) {
            return EMPTY;
          }

          this.isSavedChanges = true;
          return this.checkpointService.getMaintenanceSectionByPersonaFisica(['bank-account']);
        })
      )
      .subscribe((response: any) => {
        this.tableData = BankAccountMapper.bankAccountMapperQueryMaint(
          response?.checkpoints?.[0]?.data?.bankAccounts
        );
        this.getNames();
        this.checkSignalService.setData(this.tableData);
        this.unsavedChangesService.setUnsavedChanges(false);
        this.notifService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
      });
  }

  /**
   * Checkpoint
   */
  saveCheckpoint(): void {
    console.log(this.addresseeList());
    console.log(this.tableData);
    const body: BankAccountCheckpoint = {
      bankAccounts: BankAccountMapper.bankAccountMapperSaveCheckpoint(this.tableData)
    };
    console.log(body);
    this.checkpointService.saveSection<BankAccountCheckpoint>('bank-account', body)
    .pipe(
      concatMap((resp: SaveCheckpointResponse) => {
        console.log(resp);

        if ( 'CREATED' !== resp.status ) {
          return EMPTY;
        }

        this.isSavedChanges = true;
        return this.checkpointService.getSection(['bank-account']);
      })
    )
    .subscribe((resp: any) => {
      console.log(resp);
      this.checkSignalService.setData(BankAccountMapper.mapBankAccounts(resp['checkpoints'][0]['data']));
      this.unsavedChangesService.setUnsavedChanges(false);
      this.notifService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
    });
  }

  /**
   *
   */
  coOwnerToList(data: SingSection | null): void {
    console.log(data);
    if ( data && data.cotitularList ) {
      console.log(data.cotitularList);
      const dataco = data.cotitularList
      .filter((item: CotitularInfo) => item.active)
      .map((item: CotitularInfo) => {
        let coId = item.dataSection?.firstName ?? '';
        coId += item.dataSection?.middleName ?? '';
        coId += item.dataSection?.countryOfBirth ?? '';
        coId += item.dataSection?.firstLastName ?? '';
        coId += item.dataSection?.secondLastName ?? '';
        coId = coId.replace(' ', '');

        return {
          id: coId,
          firstName: item.dataSection?.firstName,
          middleName: item.dataSection?.middleName,
          firstLastName: item.dataSection?.firstLastName,
          secondLastName: item.dataSection?.secondLastName,
          birthDate: item.dataSection?.dateOfBirth,
          curp: item.dataSection?.curp,
          foreignerWithoutCurp: item.dataSection?.foreignerWithoutCurp,
          rfc: compareAndReturnRfcNifTinNss(
            item.dataSection?.rfc ?? '',
            AllowedValuesRfcNifTinNss.RFC,
            item.dataSection?.typeIden ?? ''
          ),
          nif: compareAndReturnRfcNifTinNss(
            item.dataSection?.rfc ?? '',
            AllowedValuesRfcNifTinNss.NIF,
            item.dataSection?.typeIden ?? ''
          ),
          ssn: compareAndReturnRfcNifTinNss(
            item.dataSection?.rfc ?? '',
            AllowedValuesRfcNifTinNss.SSN,
            item.dataSection?.typeIden ?? ''
          ),
          gender: item.dataSection?.gender,
          countryOfBirth: item.dataSection?.countryOfBirth,
        };
      });

      this.addresseeList.update((current: any[]) => [...(current ?? []), ...(dataco ?? [])]);
    }
  }

  /**
   *
   */
  clientDataToList(data: Data | null): void {
    console.log(data);
    if ( data ) {
      let coId = data.firstName + data.middleName + data.countryOfBirth + data.firstLastName + data.secondLastName;
      coId = coId.replace(' ', '');
      const item = {
        id: coId,
        firstName: data.firstName,
        middleName: data.middleName,
        firstLastName: data.firstLastName,
        secondLastName: data.secondLastName,
        birthDate: data.dateOfBirth,
        curp: data.curp,
        foreignerWithoutCurp: data.foreignerWithoutCurp,
        rfc: data.rfc,
        nif: '',
        ssn: '',
        gender: data.gender,
        countryOfBirth: data.countryOfBirth,
      };
      this.addresseeList.update((current: any) => [...current, item]);
    }
  }

  /**
   *
   * @param event
   */
  onCountryBankChange(event: MatSelectChange){
      this.catalogService.getBank({ country: event.value}).subscribe( i => {
        this.bankList.set(i)
        this.filteredBankList.set(i);
      });
  }

  /**
   *
   * @param curp
   * @returns
   */
  getClientData(id: string): any {
    console.log(id);
    const dd = this.addresseeList().find((item: any) => {
      console.log(item)
      if ( id === item.id ) {
        return item;
      }
    });
    console.log(dd);
    return dd ?? null;
  }

  /**
   *
   * @param curp
   * @returns
   */
  getClientDataByName(name: any): any {
    const dd = this.addresseeList().find((item: any) => {
      console.log(item);
      const fullName = concatFullName(item.firstName, item.middleName, item.firstLastName, item.secondLastName);
      console.log(name + ' === ' + fullName, name === fullName);
      return name === fullName;
    });
    console.log(dd);
    return dd ?? null;
  }

  /**
   * Gets the name of the option selected, to show in table results,
   * instead of show the ID value.
   */
  getName(cat: string, id: any): string {
    let name = '';
    if ( 'currency' === cat ) {
      const currency = this.currencyTypeList().find((item: CurrencyType) => id == item.currencyTypeId);
      name = currency?.description ?? '';
    } else if ( 'accountType' === cat ) {
      const type = this.accountTypeList().find((item: AccountType) => id == item.bankAccountTypeId);
      name = type?.bankAccount ?? '';
    } else if ( 'accountStatus' === cat ) {
      const type = this.accountStatementList().find((item: AccountStatement) => id == item.accountStatementId);
      name = type?.accountStatement ?? '';
    }
    return name;
  }

  /**
   * Custom function to get bank name, this method needs the country where the account
   * is domiciled, to get the proper bank list.
   */
  async getBankName(id: string, domiciled: string): Promise<string> {
    const i = await firstValueFrom(this.catalogService.getBank({ country: domiciled ?? 'MX'}));
    this.bankList.set(i)
    this.filteredBankList.set(i);
    const bank = this.bankList().find((item: Bank) => id == item.bankId);
    return bank?.bankName ?? '';
  }

  /**
   * Performs the patch data to form. Without event emit.
   * Then validates the currency.
   */
  async manualPatchValue(data: any): Promise<any> {
    console.log(JSON.stringify(data));

    // gets the banks from "domiciled"
    const banks = await lastValueFrom(this.catalogService.getBank({ country: data.domiciled}));
    this.bankList.set(banks);
    this.filteredBankList.set(banks);

    // validates if "domiciled" field should be shown
    this.showDomiciled.set(!('00' === data.currency));

    // patch values
    this.form.patchValue(data, { emitEvent: false });
    this.validateBankAccountType(data.bank, data.accountType);
    this.validateCheckThird(data.checkThird, false);

    console.log(data.addresseeData);
    if ( !data.checkThird && data.addresseeData ) {
      this.form.controls['addressee'].setValue(data.addresseeData.id, {emitEvent: false});
      this.validateAddresseeControl(data.addresseeData.id);
    }
  }


  /**
   * Method for MAINTENANCE
   *
   * evento al dar click en boton "editar" que aparece solamente
   * en modo Mantenimiento.
   */
  editMaintenance(): any {
    /*
    si todo está deshabilitado, se entiende que solo es modo lectura.
    y no hace nada mas.
     */
    if ( this.permissions.allDisabled ) {
      return;
    }

    if ( this.canAdd ) {
      this.form.enable();
    }

    this.form.enable();

    this.disButtons = {
      register: true,
      cancel: false,
      save: false,
      edit: true
    };

    this.disButtons.register = !this.canAdd;


  }

  /**
   * Method for MAINTENANCE
   *
   * Initialize default maintenance mode. (all disabled)
   */
  initializeMaintenance(): any {

    // 1. deshaiblitar todo los forms
    this.form.disable();

    // 2. deshabilitar todos los botones (configurarlos)
    this.disButtons = {
      save: true,
      register: true,
      edit: false,
      cancel: true,
    };

    if ( this.permissions.allDisabled ) {
      this.disButtons.edit = true;
    }

    this.tableConfig.showDeleteAction = this.permissions.permission.includes('delete');
  }

  /**
   * Method for MAINTENANCE
   *
   * es como regresar al estado inicial de mantenimiento.
   */
  cancelMaintenance(): any {
    this.resetForms();
    this.initializeMaintenance();
  }

  /**
   * Method for MAINTENANCE
   *
   * este método se va a llamar cuando el usuario de click en "editar" de la tabla.
   */
  validateRolOnEdit(): any {
    if ( this.canEdit ) {
      this.form.enable();
    } else {
      this.form.disable();
    }
    this.disButtons.register = !this.canEdit;
  }

  /**
   * Method for MAINTENANCE
   *
   * este método se llamaria cuando se de click en "eliminar" de la tabla.
   */
  validateRolOnDelete(): any {

  }


  /**
   * Gets the names for properties with id as value, to show in table section.
   */
  async getNames(byId: boolean = false): Promise<void> {
    const temp = this.tableData.map(async (item: any) => {
      console.log(item);
      item.bankName          = await this.getBankName(item.bank, item.domiciled);
      item.currencyName      = this.getName('currency', item.currency);
      item.accountTypeName   = this.getName('accountType', item.accountType);
      item.accountStatusName = this.getName('accountStatus', item.accountStatus);
      if ( byId ) {
        item.addresseeData   = item.checkThird ? null : this.getClientData(item.addressee);
      } else {
        item.addresseeData   = item.checkThird ? null : this.getClientDataByName(item.addressee);
      }
      return item;
    });
    this.tableData = await Promise.all(temp);
  }

  /**
   * Watch List Validation.
   */
  async personWlValidation(formData: any, checkPerson2: boolean): Promise<any> {
    console.log(formData);
    const add = checkPerson2 ? formData.addressee2 : formData.addressee;
    const dd = this.getClientData(add);
    console.log(dd);
    const bodyWL: DataClient = {
      ppe                   : false,
      bankAreaTypeId        : '',
      contraTypeId          : '',
      typeContractSubtypeId : '',
      curp                  : dd.curp,
      foreignerWithoutCurp  : dd.foreignerWithoutCurp,
      typeIden              : compareAndReturnIdRfcNifTinNss(
        dd.rfc, dd.nif, '', dd.ssn
      ),
      rfc                   : compareAndReturnValueRfcNifTinNss(
        dd.rfc, dd.nif, '', dd.ssn
      ),
      dateOfBirth           : dd.birthDate,
      gender                : dd.gender,
      countryOfBirth        : dd.countryOfBirth,
      firstName             : dd.firstName,
      middleName            : dd.middleName,
      firstLastName         : dd.firstLastName,
      secondLastName        : dd.secondLastName,
      nationality           : '',
      stateOfBirth          : '',
    };
    return await this.clientFlowService.validInWatchList(bodyWL);
  }

  /**
   *
   */
  validateCheckThird(value: boolean, clear: boolean = false): void {
    console.log(clear);
    this.isThird = value;
    if ( clear ) {
      this.form.controls['addressee'].setValue('', { emitEvent: false });
      this.form.controls['addresseeAccount'].setValue('', { emitEvent: false });
      this.form.controls['addresseeClabe'].setValue('', { emitEvent: false });
    }
    if ( value ) {
      this.form.controls['accountStatus'].setValidators([Validators.required]);
    } else {
      this.form.controls['accountStatus'].clearValidators();
    }
    this.form.controls['accountStatus'].updateValueAndValidity({emitEvent: false});
  }

  /**
   *
   */
  validateAddresseeControl(value: string): void {
    const dest = this.addresseeList().find((add: any) => {
    const coId = (
      String(add.firstName ?? '') +
      String(add.middleName ?? '') +
      String(add.countryOfBirth ?? '') +
      String(add.firstLastName ?? '') +
      String(add.secondLastName ?? '')
      ).replace(/ /g, '');
      console.log(`${coId} === ${value}`);
      return coId === value;
    });

    this.curp = dest?.curp || '';
    this.rfc = dest?.rfc || '';
  }

}
