import { AfterViewInit, Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { OnboardingService } from '../../services/onboarding.service';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { REGEX, STRINGS } from '../../constants/constants';
import { ConfigDataTable, ColumnsDataTable } from '../../../shared/components/table-results/interfaces';
import { AddressSectionComponent } from '../../../shared/components/sections/address-section/address-section.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { ERROR_MESSAGES, NOTIFICATION_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { BeneficiariesSignalService } from '../../services/checkpoint/beneficiaries-signal.service';
import { BeneficiariesPM, BeneficiariesPMForm, BeneficiariesPMPageData, BeneficiariesPMTableData } from '../../models/checkpoints/beneficiaries-pm';
import { StrTempId } from '../../../shared/utils/string';
import { Address } from '../../models/address';
import { CurrentOnboardingInfo } from '../../models/current-onboarding';
import { PermissionRolService } from '../../../core/services/rol.service';

@Component({
  selector: 'app-beneficiaries-pm',
  standalone: false,
  templateUrl: './beneficiaries-pm.component.html',
  styleUrl: './beneficiaries-pm.component.scss'
})
export class BeneficiariesPmComponent implements OnInit, AfterViewInit {

  // TODO WL y HM - no hay servicio.
  // TODO PERSISTEN LOS DATOS ?? SALIENDO DE LA PAGIAN SIN CHECKPINT ?
  @ViewChild(AddressSectionComponent) addressComponent!: AddressSectionComponent;

  private readonly onboardingService  = inject(OnboardingService);
  private readonly modalService       = inject(NotificationModalService);
  private readonly notificationService= inject(NotificationsService);
  private readonly checkSignalService = inject(BeneficiariesSignalService);
  private readonly formBuilder        = inject(NonNullableFormBuilder);
  private readonly unsavedService     = inject(UnsavedChangesService);
  private readonly permissionService  = inject(PermissionRolService);

  beneficiariesPMPageData = signal<BeneficiariesPMPageData>({
    data: [],
    table: []
  });

  form: FormGroup<BeneficiariesPMForm> = this.formBuilder.group({
    companyName     : this.formBuilder.control('', [
      Validators.required,
      Validators.max(100),
      Validators.maxLength(60)
    ]),
    id              : this.formBuilder.control('', [
      Validators.required,
      Validators.pattern(REGEX.RFC_PM_VALIDATION)
    ]),
    typeId          : this.formBuilder.control('1', [Validators.required]),
    economicActivity: this.formBuilder.control('', [
      Validators.required,
      Validators.maxLength(60)
    ]),
    creationDate    : this.formBuilder.control('', [Validators.required]),
    percentage      : this.formBuilder.control('', [
      Validators.required,
      Validators.min(1),
      Validators.max(100),
      Validators.pattern(REGEX.ONLY_NUMBERS)
    ]),
  });

  typeIdControlSignal = toSignal<string>(this.form.controls.typeId.valueChanges);

  /**
   * Inputs for Result Table Component
   */
  tableConfig: ConfigDataTable = {
    showPag: false,
    showEditAction: true,
    showDeleteAction: true,
    showViewAction: false,
    multipleSelection: false,
  };
  tableCols: ColumnsDataTable[] = [
    { name: 'companyName', title: 'Demoninación ó Razón Social', show: true, type: 'string' },
    { name: 'rfc',         title: 'RFC',                         show: true, type: 'string' },
    { name: 'percentage',  title: 'Porcentaje Beneficiario',     show: true, type: 'string' },
    { name: 'zipcode',     title: 'Código Postal',               show: true, type: 'string' }
  ];

  isEditting = false;
  edittingId = '';

  onboardingInfo: CurrentOnboardingInfo = this.onboardingService.getCurrentInfo();
  isMaintenance = signal<boolean>(this.onboardingService.getCurrentInfo().isMaintenance);
  permissions = this.permissionService.getPermissions()?.['beneficiaries-pm'];
  disButtons = {
    edit    : false,
    register: false,
    save    : false,
    cancel  : false,
  };
  canAdd = this.permissions.permission.includes('add');
  canEdit = this.permissions.permission.includes('edit');
  canDelete = this.permissions.permission.includes('delete');


  constructor() {
    document.body.classList.remove('show-validation');

    effect(() => {
      console.log(this.typeIdControlSignal());
      if ( '1' === this.typeIdControlSignal() ) {
        console.log("1");
        this.form.controls.id.setValidators(
          [
            Validators.pattern(REGEX.RFC_PM_VALIDATION),
            Validators.required
          ]
        );
      } else if ( '2' === this.typeIdControlSignal() || '5' === this.typeIdControlSignal() )  {
        this.form.controls.id.setValidators(
          [
            Validators.pattern(REGEX.NIF_TIN_NSS_PM_VALIDATION),
            Validators.required
          ]
        );
      }
      this.form.controls.id.updateValueAndValidity();
    });

  }

  ngOnInit(): void {
    console.log(this.onboardingService.getCustomerInitialData());
    console.log(this.checkSignalService.getBeneficiariesPM());
    this.beneficiariesPMPageData.set(this.checkSignalService.getBeneficiariesPM());
    /*this.beneficiariesPMPageData.set({
    "data": [
        {
            "tempId": "12",
            "companyName": "asdfasdf",
            "id": "1234",
            "typeId": "1",
            "economicActivity": "12",
            "creationDate": "2025-12-01",
            "percentage": "100",
            "address": {
                "addressRole": "",
                "addressType": "1",
                "other": "",
                "country": "MX",
                "postalCode": "20126",
                "federalEntity": "AGUASCALIENTES",
                "city": "AGUASCALIENTES MUNICIPIO DE, AGS",
                "municipality": "AGUASCALIENTES",
                "neighborhood": "0094",
                "street": "ADSF",
                "externalNumber": "12345678",
                "internalNumber": "",
                "confirmCp": 'null',
                "timeLiveMexico": "",
                "reasonsOpeningContractMexico": "",
                "proofOfAddressType": "",
                "addressProofIssueDate": "",
                "expirationYear": "",
                "taxPostalCode": "",
                "geographicalArea": "B",
                "deliveryCenter": "20001",
                "federalEntityID": "AGS",
                "cityID": "101003",
                "municipalityID": "001"
            }
        },
        {
            "companyName": "DEVKOD SA DE CV",
            "id": "ASD451201EER",
            "typeId": "1",
            "economicActivity": "DSFASFSDF",
            "creationDate": "1987-11-10T06:00:00.000Z",
            "percentage": "100",
            "address": {
                "addressRole": "",
                "addressType": "1",
                "other": "",
                "country": "MX",
                "postalCode": "20126",
                "federalEntity": "AGUASCALIENTES",
                "city": "AGUASCALIENTES MUNICIPIO DE, AGS",
                "municipality": "AGUASCALIENTES",
                "neighborhood": "0094",
                "street": "ADSF",
                "externalNumber": "324",
                "internalNumber": "",
                "confirmCp": 'null',
                "timeLiveMexico": "",
                "reasonsOpeningContractMexico": "",
                "proofOfAddressType": "",
                "addressProofIssueDate": "",
                "expirationYear": "",
                "taxPostalCode": "",
                "geographicalArea": "B",
                "deliveryCenter": "20001",
                "federalEntityID": "AGS",
                "cityID": "101003",
                "municipalityID": "001"
            },
            "tempId": "34"
        }
    ],
    "table": [
        {
            "tempId": "12",
            "companyName": "string;",
            "rfc": "string;",
            "percentage": "string;",
            "zipcode": "string;"
        },
        {
            "tempId": "34",
            "companyName": "DEVKOD SA DE CV",
            "rfc": "ASD451201EER",
            "percentage": "100",
            "zipcode": "20126"
        }
    ]
});
*/


    console.log(this.beneficiariesPMPageData());

    /** activates the save changes before leave */
    this.form.valueChanges.subscribe(() => {
      this.unsavedService.setUnsavedChanges(this.form.dirty);
    });
  }

  ngAfterViewInit(): void {
    this.addressComponent.profileForm.valueChanges.subscribe(() => {
      this.unsavedService.setUnsavedChanges(this.addressComponent.profileForm.dirty);
    });

    if ( this.onboardingInfo.isMaintenance ) {
      console.log(this.permissions);
      this.initializeMaintenance();
    }
  }

  /**
   * Register.
   *
   * event when user register new item.
   *
   * Adds the current form information, to list of beneficiaries.
   */
  async onSubmit(): Promise<any> {
    document.body.classList.add('show-validation');

    const addressData: Address | null = await this.addressComponent.onSubmit();
    const formData = this.form.value;

    if ( !this.validateForm() ) {
      return;
    }

    const data: any = {
      ...formData,
      address: addressData
    };

    // TODO aplicar WL y Homonimias

    if ( this.isEditting ) {
      this.updateItem(data);
      this.isEditting = false;
      this.edittingId = '';
    } else {
      this.addItem(data);
    }
    this.unsavedService.setUnsavedChanges(true);
    this.resetForm();
  }

  /**
   *
   */
  addItem(data: any): void {
    const temp = StrTempId();
    const withTempId = {...data, tempId: temp};

    this.beneficiariesPMPageData.update(item => ({
      ...item,
      data: [...item.data, withTempId],
      table: [...item.table, {
        tempId: temp,
        companyName: data.companyName,
        rfc: data.id,
        percentage: data.percentage,
        zipcode: data.address.postalCode,
      }]
    }));

    console.log(this.beneficiariesPMPageData());
    this.notificationService.success(SUCCESS_MESSAGES.BENEFICIARIE_ADDED);
  }

  /**
   *
   */
  updateItem(data: BeneficiariesPM): void {
    this.beneficiariesPMPageData.update((benef: BeneficiariesPMPageData) => ({
      ...benef,
      data: benef.data.map((person: BeneficiariesPM) =>
        person.tempId === this.edittingId ? { ...person, ...data } : person
      ),

      table: benef.table.map((row: BeneficiariesPMTableData) =>
        row.tempId === this.edittingId ? { ...row, ...data} : row
      )
    }));
  }

  /**
   *
   */
  validateForm(): boolean {
    // first validate required fields
    const oneInvalid = Object.values(this.form.controls).some((control) => control.hasError('required') );
    if ( oneInvalid ) {
      Object.keys(this.form.controls).forEach(controlName => {
        if ( this.form.get(controlName)?.invalid ) {
          console.log("empty", controlName);
          this.form.get(controlName)?.markAsTouched();
        }
      });

      this.notificationService.error(ERROR_MESSAGES.MISSING_INFO);
      return false;
    }

    // validate format Fiscal ID
    const idControl = this.form.controls.id;
    if ( idControl.hasError('pattern') ) {
      console.log(this.form.controls.id.hasValidator(Validators.pattern(REGEX.RFC_PM_VALIDATION)));
      console.log(this.form.controls.id.hasError('pattern'));

      this.notificationService.error(ERROR_MESSAGES.INCORRECT_FORMAT);
      return false;
    }

    // validate percentage
    const per = this.form.controls.percentage;
    if (per.hasError('pattern') || per.hasError('min') || per.hasError('max') ) {
      this.notificationService.error(ERROR_MESSAGES.INCORRECT_FORMAT);
      return false;
    }

    return true;
  }

  /**
   * Event when user clicks "Guardar" to perform a Checkpoint
   */
  save(): void {
    // if ( 0 === this.tableData.length ) {
    //   this.modalService.info({
    //     title: '¿Deseas Continuar Sin Agregar Beneficiario?',
    //     btnAccept: 'Continuar sin Beneficiarios',
    //     btnDeny: '+ Agregar Beneficiario',
    //   }).then((modal: any) => {
    //     if ( modal.value ) {
    //       this.saveCheckpoint();
    //     }
    //   });
    // }

    // solo 1 benef, debe tener el 100%
    if ( this.beneficiariesPMPageData().table.length === 1 && this.beneficiariesPMPageData().table[0].percentage != '100' ) {
      this.notificationService.error(ERROR_MESSAGES.ONE_BENEFICIARIE);
    }

    // mas benef
    else if ( !this.verify100Per().ok ) {
      this.notificationService.error(ERROR_MESSAGES.PERCENTAGE_100);
    }

    else {
      this.saveCheckpoint();
    }
  }

  /**
   * Performs the checkpoint save after users clicks "Guardar"
   */
  saveCheckpoint(): void {
    // const boddy: Beneficiaries = {
    //   beneficiaries: convertToCheckpoint(this.beneficiariesPMPageData().data)
    // };

    // this.checkpointService.saveSection<Beneficiaries>('beneficiarios', boddy).subscribe((resp: any) => {
    //   console.log(resp);
      this.checkSignalService.setBeneficiariesPM(this.beneficiariesPMPageData());
      this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
      this.unsavedService.setUnsavedChanges(false);
    // });
  }

  /**
   * Event triggered when user selects 'edit' or 'delete'
   * a row from beneficiearies table.
   */
  eventRow(event: any): void {
    console.log(event.type, event.row);

    if ( STRINGS.EDIT === event.type ) {
      this.isEditting = true;
      this.edittingId = event.row.tempId;
      const dd = this.beneficiariesPMPageData().data.find(item => item.tempId === this.edittingId);
      console.log(dd);
      this.form.patchValue({
        companyName: dd?.companyName,
        id: dd?.id,
        typeId: dd?.typeId,
        economicActivity: dd?.economicActivity,
        creationDate: dd?.creationDate,
        percentage: dd?.percentage
      });
      const add = 'undefined' != typeof dd ? dd.address : null;
      this.addressComponent.setAddresData(add);

      if ( this.isMaintenance() && this.disButtons.edit ) {
        this.validateRolOnEdit();
      }

    } else if ( STRINGS.DELETE === event.type ) {
      this.modalService.confirm({
        title: NOTIFICATION_MESSAGES.DELETE_QUESTION_MESSAGE,
        btnAccept: 'Si, Eliminar.',
        btnDeny: 'No'
      }).then((res: { value: boolean; message?: string } | undefined) => {
        if ( res && res.value ) {
          this.unsavedService.setUnsavedChanges(true);
          this.beneficiariesPMPageData.update(current => ({
            ...current,
            data: current.data.filter(item => item.tempId != event.row.tempId),
            table: current.table.filter(item => item.tempId != event.row.tempId)
          }));
          this.notificationService.success(SUCCESS_MESSAGES.ITEM_DELETED);
        }
        console.log(this.beneficiariesPMPageData());
      });

    }
  }

  /**
   *
   */
  verify100Per(): { ok: boolean; sum: number; } {
    const sum = this.beneficiariesPMPageData().table.reduce((accumulator: any, currentValue: any) => {
        return accumulator + +currentValue.percentage;
    }, 0);
    return {
      ok: sum === 100 || sum === 0,
      sum
    };
  }

  /**
   * used to reset all forms in this interface
   */
  resetForm(): void {
    this.addressComponent.profileForm.reset();
    this.form.reset();
  }

  /**
   * Event Cancel
   *
   * Cancels the edit action.
   */
  cancel(): void {
    this.isEditting = false;
    this.edittingId = '';
    this.resetForm();
  }

  /**
   * Method for MAINTENANCE
   *
   * Initialize default maintenance mode. (all disabled)
   */
  initializeMaintenance(): any {

    // 1. deshaiblitar todo los forms
    this.form.disable();
    this.addressComponent.profileForm.disable();

    // 2. deshabilitar todos los botones (configurarlos)
    this.disButtons = {
      save: true,
      register: true,
      edit: false,
      cancel: true,
    };


    this.tableConfig.showDeleteAction = this.permissions.permission.includes('delete');

  }

  /**
   * Method for MAINTENANCE
   *
   * es como regresar al estado inicial de mantenimiento.
   */
  cancelMaintenance(): any {
    this.initializeMaintenance();
  }

  /**
   * Method for MAINTENANCE
   *
   * este método se va a llamar cuando el usuario de click en "editar" de la tabla.
   */
  validateRolOnEdit(): any {
    if ( this.canEdit ) {
      this.addressComponent.profileForm.enable();
      this.form.enable();
    } else {
      this.addressComponent.profileForm.disable();
      this.form.disable();
    }
    this.disButtons.register = !this.canEdit;
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
      this.addressComponent.profileForm.enable();
    }


    this.disButtons = {
      register: true,
      cancel: false,
      save: false,
      edit: true
    };

    this.disButtons.register = !this.canAdd;

  }

}
