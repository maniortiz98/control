import { AfterViewInit, Component, computed, DestroyRef, effect, inject, input, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InvestmentProfileQuizModalComponent } from './investment-profile-quiz-modal/investment-profile-quiz-modal.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QuizSection } from '../../models/transactional-investment-profile';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { TransactionalResourcesModalComponent } from './transactional-resources-modal/transactional-resources-modal.component';
import { ColumnsDataTable, ConfigDataTable } from '../../../shared/components/table-results/interfaces';
import { EMPTY, first, firstValueFrom, map, merge, Observable, skip } from 'rxjs';
import { transactionalResourcesQuestion, transactionalProfileLastQuestion } from '../../../shared/services/transactional-profile-quiz-data'; //remove once consume real service
import { TiProfilePmService } from '../../../shared/services/ti-profile-pm.service';
import { TiProfileService } from '../../../shared/services/storage-services/ti-profile.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { Checkpoint } from '../../models/checkpoints/checkpoint';
import { CHECKPOINT_IDS } from '../../constants/constants';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { OnboardingService } from '../../services/onboarding.service';
import { ERROR_MESSAGES, NOTIFICATION_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
import { ServiceType } from '../../models/service-type';
import { OriginResource, Ranges } from '../../models/origin-resource';
import { transactionalInvestmentSectionToCheckpoint, HolderOption, getHolderOption, getCoHoldersOptions } from '../../services/mappers/transactional-investment-mapper';
import { transactioanalProfileData } from '../../../shared/services/checkpoints-fake-data';
import { PermissionRolService } from '../../../core/services/rol.service';
import { FirstDataClientService } from '../../../shared/services/storage-services/first-data-client.service';
import { Data } from '../../models/checkpoints/initial-data-checkpoint';
import { SignStorageService } from '../../../shared/services/storage-services/sign-storage.service';
import { CotitularInfo } from '../../models/cotitular';
import { TransactionalLimitsResponse } from '../../models/transactional-limits-response';
import { transactionalInvestmentSectionToCheckpointMant } from '../../services/mappers/maintenance/transactional-investment-profile-mapper-mant';
import { InvestmentProfileData } from '../../models/transactional-investment-profile-section';
import { ExperienceTimeResponse } from '../../models/experience-time';
import { ActivatedRoute } from '@angular/router';
import { isFormValidIncludingDisabled } from '../../../shared/utils/validators';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { TransactionalResource } from '../../models/general-info-pm';
import { butonFunctionDis, buttonFunctionEn } from '../../../shared/utils/disableOrEnabled';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-transactional-investment-profile',
  standalone: false,
  templateUrl: './transactional-investment-profile.component.html',
  styleUrl: './transactional-investment-profile.component.scss'
})
export class TransactionalInvestmentProfileComponent implements OnInit, AfterViewInit {

  transactionalProfileSections = input.required<QuizSection[]>();
  getQuizRateUrl = input.required<string>();
  getQuizRateReprofilingUrl = input.required<string>();
  getQuizUrl = input.required<string>();
  getQuizReprofilingUrl = input.required<string>();
  serviceName = input.required<string>();
  initialQuizCatalog = signal<QuizSection[]>([]);
  isQuizDisabled = computed(() => {
  const permises = this.permissionRolService.getPermissions()['transactional-investment-profile'];
  const disabledFields = permises?.fieldsDisabled ?? [];
  // To do: We need to fix roles for sales practices
  return ['quizTIP']
    .some(id => disabledFields.includes(id));
  });

  public readonly services: any = {
    pf: inject(TiProfileService),
    pm: inject(TiProfilePmService)
  };

  private readonly destroyRef = inject(DestroyRef);
  private readonly checkpoint = inject(CheckpointService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly notificationService = inject(NotificationsService);
  private readonly catalogsService = inject(CatalogsService);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);
  private readonly onboardingService = inject(OnboardingService);
  private readonly permissionRolService = inject(PermissionRolService);
  private readonly route = inject(ActivatedRoute);
  private readonly firstDataClientService = inject(FirstDataClientService);
  private readonly signStorageService = inject(SignStorageService);
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly auth = inject(AuthService);


  isMaintenance = signal<boolean>(false);
  isEditable = signal<boolean>(false);

  public maintenanceQuizForm: FormGroup = new FormGroup({});
  public investmentProfileForm: FormGroup = new FormGroup({});
  public transactionalProfileForm: FormGroup = new FormGroup({});
  public investmentProfileQuizSections: QuizSection[] = [];
  public transactionalProfileLastQuestion = transactionalProfileLastQuestion;
  public totalResourcesOptions = 0;
  public profileRating: any;
  public investmentQuizCompleted: any;
  fullsection = signal<InvestmentProfileData | null>(null);
  transactionalLimits = signal<TransactionalLimitsResponse[]>([])

  experienceTime = signal<ExperienceTimeResponse[]>([]);

  public transactionalResourcesData = signal<TransactionalResource[]>([])
  public columns: Array<ColumnsDataTable> = [];
  public config: ConfigDataTable = { showPag: false, showEditAction: true, showDeleteAction: true, showViewAction: false, multipleSelection: false, idName: 'id' };

  public editMode = signal<boolean>(false);
  public controlRequired: boolean = false;
  public showTransactionalAmount: boolean = false;
  personClasifications = signal<Array<ServiceType>>([]);
  personSubClasifications = signal<Array<any>>([]);
  allResources = signal<Array<Ranges>>([]);

  private readonly investmentProfileList: BanckAreaType[] = [
    {
      bankAreaTypeId: 999,
      contractType: [
        {
          contractTypeId: 62,
          typeContractSubtypeIds: [1]
        },
        {
          contractTypeId: 12,
          typeContractSubtypeIds: [68, 1]
        },
        {
          contractTypeId: 4,
          typeContractSubtypeIds: [47, 48]
        },
        {
          contractTypeId: 1,
          typeContractSubtypeIds: [43, 60, 61]
        },
        {
          contractTypeId: 5,
          typeContractSubtypeIds: [45]
        },
        {
          contractTypeId: 6,
          typeContractSubtypeIds: [46]
        },
        {
          contractTypeId: 64,
          typeContractSubtypeIds: [2, 3, 1, 4]
        },
        {
          contractTypeId: 7,
          typeContractSubtypeIds: [60]
        },

      ]
    },
    {
      bankAreaTypeId: 998,
      // bankAreaTypeId: 1,
      contractType: [
        {
          contractTypeId: 8,
          typeContractSubtypeIds: [64]
        },
        {
          contractTypeId: 10,
          typeContractSubtypeIds: [68, 59]
        },
        {
          contractTypeId: 13,
          typeContractSubtypeIds: [59]
        }
      ]
    }
  ];

  public titulares: HolderOption[] = [];

  public investmentProfileVisible = signal<boolean>(false);

  unsavedState: any;

  constructor() {
    effect(() => {
      ;
      if (this.services[this.serviceName()].profileRating()) {
        this.investmentProfileForm.controls['profileRating']
          .setValue(this.services[this.serviceName()].profileRating());
      }
    });
  }

  ngOnInit(): void {
    this.catalogsService.getOriginResource({ full: true, rangeId: "1" }).subscribe(i => {
      this.allResources.set(i);
    });

    this.catalogsService.getTransactionLimits().subscribe(i => {
      this.transactionalLimits.set(i);
    });

    this.columns = [
      { name: 'text', title: 'Origen de los Recursos', type: 'string', show: true },
      { name: 'percentage', title: 'Porcentaje', type: 'string', show: true },
    ];
    this.isMaintenance.set(this.onboardingService.getCurrentInfo().isMaintenance);
    this.experienceTime.set(this.route.snapshot.data['experienceTime']);

    this.initialQuizCatalog.set(
      structuredClone(this.transactionalProfileSections())
    );
    this.transactionalResourcesData.set(this.services[this.serviceName()]?.transactionalResources() ?? [])
    this.initialQuizCatalog.update(sections =>
      sections.map(s =>
        s.sectionId === 'Conocimiento del cliente'
          ? {
            ...s,
            questions: s.questions.map(q =>
              q.questionId === 10
                ? {
                  ...q,
                  options:
                    this.experienceTime().map(e => ({
                      optionId: e.idTipoTiempoExperienciaCve,
                      checked: false,
                      answerText: e.tiempoExperiencia,
                      value: e.tiempoExperiencia
                    }))
                }
                : q
            ),
          }
          : s
      )
    );

    this.totalResourcesOptions = this.services[this.serviceName()].allResources().length;
    this.fullsection.set(this.services[this.serviceName()].fullSectionTransactionalInvestment())

    this.catalogsService.getServiceSubtype({
      serviceTypeCve: ''
    }).subscribe(c => {
      this.personSubClasifications.set(c);
    });
    this.profileRating = computed(() => this.services[this.serviceName()].profileRating());
    this.investmentQuizCompleted = computed(() => this.services[this.serviceName()].investmentQuizCompleted());
    this.setHoldersOptions();

    this.catalogsService.getServiceType({ serviceTypeCve: [""] }).subscribe(i => { this.personClasifications.set(i); });

    this.maintenanceQuizForm = this.fb.group({
      sClient: [false],
      adendum: [false],
      mga: [false],
      awm: [false],
      globalFront: [false],
      titular: [''],
      notApply: [false],
      instClient: [false],
      noInstClient: [false],
      instClientPub: [false],
      instClientFid: [false],
    });

    this.chargeInvestmentProfile();
    this.setInvestmentProfileVisible();
    if(this.isMaintenance()){
      this.chargeMantInfo();
      this.applyFieldPermissions();
    }

    this.chargeTransactionalProfile();
  }

  setInvestmentProfileVisible() {
    const customerData = this.onboardingService.customerInitialData();
    const banckArea = this.investmentProfileList.find(banckArea => banckArea.bankAreaTypeId === customerData.bankAreaTypeId);
    const contractType = banckArea?.contractType.find(contractType => contractType.contractTypeId === customerData.contractTypeId);
    const visible = contractType?.typeContractSubtypeIds.includes(customerData.typeContractSubtypeId!);
    this.investmentProfileVisible.set(!visible);
  }

  ngAfterViewInit(): void {
    if (this.isMaintenance()) {
      const permises = this.permissionRolService.getPermissions()['transactional-investment-profile'];
      const salesPermises = this.permissionRolService.getPermissions()['sales-practices'];
      this.disableForm();
      (permises?.allDisabled && salesPermises?.allDisabled ) ? butonFunctionDis(['btnEditTIP']): buttonFunctionEn(['btnEditTIP']);
      butonFunctionDis(['btnSaveTIP', 'btnCancelTIP', 'quizTIP']);
    }
  }

  setHoldersOptions() {
    const holder: Data | null = this.firstDataClientService.getItem();
    const coholders: CotitularInfo[] | undefined = this.signStorageService.singSectionSignal()?.cotitularList;

    if (coholders) {
      this.titulares = getCoHoldersOptions(coholders);
    }

    if (holder) {
      this.titulares.unshift(getHolderOption(holder));
    }
  }


  displayTransactionalAmount(value: number) {
    if (value === 4) {
      this.enableControl("8");
    }
    else {
      this.disableControl("8");
      this.investmentProfileForm.patchValue({
        8: ''
      });
    }

  }

  showTransactionalAm(value: string | number | undefined) {
    if (value && value.toString() === '999') {
      this.showTransactionalAmount = true
      this.enableControl('transactionalLimit')
    } else {
      this.showTransactionalAmount = false
      this.disableControl('transactionalLimit')
    }

  }

  enableControl(controlId: string) {
    this.transactionalProfileForm.controls[controlId].enable();
    this.transactionalProfileForm.controls[controlId].setValidators(Validators.required);
    this.transactionalProfileForm.controls[controlId].updateValueAndValidity();
    this.controlRequired = true;
  }

  disableControl(controlId: string) {
    this.transactionalProfileForm.controls[controlId].clearValidators();
    this.transactionalProfileForm.controls[controlId].updateValueAndValidity();
    this.transactionalProfileForm.controls[controlId].setValue('');
    this.transactionalProfileForm.controls[controlId].disable();
    this.controlRequired = false;
  }

  showQuizModal(): void {
    const dialogRef = this.dialog.open(InvestmentProfileQuizModalComponent, {
      maxWidth: '99%',
      width: '100%',
      data: {
        quizUrl: this.isMaintenance() ? this.getQuizReprofilingUrl() : this.getQuizUrl(),
        quizRateUrl: this.isMaintenance() ? this.getQuizRateReprofilingUrl() : this.getQuizRateUrl(),
        service: this.services[this.serviceName()],
        personType: this.serviceName(),
        transactionalProfileSections: this.transactionalProfileSections()
      }
    });


    dialogRef.afterClosed().subscribe(response => {
      if (response === true && this.isMaintenance()) {
        this.saveTransactionalQuiz();
      }
    });

  }



  saveTransactionalQuiz() {
    const saveFn = this.isMaintenance() ? 'saveSectionMant' : 'saveSection';
    if (this.transactionalProfileForm.invalid || (this.investmentProfileVisible() && !isFormValidIncludingDisabled(this.investmentProfileForm))) {
      this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS);
      document.body.classList.add('show-validation');
      const controls = this.investmentProfileVisible() ? { ...this.transactionalProfileForm.controls, ...this.investmentProfileForm.controls } : this.transactionalProfileForm.controls;
      for (const [, control] of Object.entries(controls)) {
        if (control.invalid) {
          control.markAsTouched();
        }
      }
      return;
    }

    const sumaTotal = this.transactionalResourcesData().filter(tr => tr.active).reduce((acum, actual) => {
      return acum + Number(actual.percentage);
    }, 0);

    console.log({sumaTotal})
    if (sumaTotal < 100) {
      this.notificationService.error('El Porcentaje Total no puede ser Menor a 100%');
      return;
    }

    if (sumaTotal > 100) {
      this.notificationService.error('El Porcentaje Total no puede ser Mayor a 100%');
      return;
    }

    const selectedResources = this.transactionalResourcesData();

    const personType = this.serviceName() === 'pf' ? '1' : '2';

    let body;

    if (saveFn === 'saveSection') {
      body = transactionalInvestmentSectionToCheckpoint(
        this.transactionalProfileForm.value,
        this.profileRating,
        selectedResources,
        this.investmentProfileForm,
        this.services[this.serviceName()].investmentQuizId()?.toString() || '',
        personType,
        this.maintenanceQuizForm.value
      );
    } else {
      body = transactionalInvestmentSectionToCheckpointMant(
        this.transactionalProfileForm.getRawValue(),
        this.profileRating,
        selectedResources,
        this.investmentProfileForm,
        this.services[this.serviceName()].investmentQuizId()?.toString() || '',
        this.maintenanceQuizForm,
        this.fullsection(),
        this.titulares,
        personType
      )
    };

    this.checkpoint[saveFn]('transactional-investment-profile', body)
      .pipe(first())
      .subscribe(
        {
          next: (res) => {
            if (res.status === "FAILED") {
              console.log(res)
            } else {
              this.services[this.serviceName()].investmentProfile.set(this.investmentProfileForm.value);
              this.services[this.serviceName()].transactionalProfile.set(this.transactionalProfileForm.value);
              this.services[this.serviceName()].maintenanceQuiz.set(this.maintenanceQuizForm.value);
              this.services[this.serviceName()].transactionalResources.set(this.transactionalResourcesData());
              this.notificationService.success('Guardado con éxito');
              this.unsavedChangesService.setUnsavedChanges(false);
            }
          },
          error: (err) => {
            console.log("err:", err);
          },
          complete: () => {
            console.log("completed");
          }
        },
      );
  }

  async showResourcesModal(): Promise<void> {
    const selectedResources = this.transactionalResourcesData()
      .filter(r => r.active)
      .map((rsc: TransactionalResource) => rsc.type);
    const availableResources = this.allResources().filter(ar => !selectedResources.includes(ar.rangeId));
    const responseModal = await firstValueFrom(this.callTransactionalResourceModal(availableResources));
    if (responseModal != undefined) {
      const newLine: TransactionalResource = responseModal;
      this.transactionalResourcesData.update((list => [...list, newLine]))
    }
  }

  eventRowTransactionalResource(e: any) {
    if (e.type === 'delete') {
      this.deleteResource(e);
    }
    else if (e.type === 'edit') {
      this.editResources(e);
    }
  }

  async editResources(event: any) {
    const selectedResource = event.row;
    const selectedType = selectedResource.type.toString()
    const availableResources = this.allResources().filter(ar => ar.rangeId === selectedType);
    const responseModal = await firstValueFrom(this.callTransactionalResourceModal(availableResources, selectedResource));
    if (responseModal != undefined) {
      const editedItem: TransactionalResource = responseModal;
      this.transactionalResourcesData.update(list =>
        list.map(item =>
          item.id === editedItem.id ? editedItem : item
        )
      );
    }
  }

  async deleteResource(event: any) {
    const result = await this.notificationModalService.confirm({
      title: NOTIFICATION_MESSAGES.DELETE_CONFIRMATION_MESSAGE,
      btnAccept: 'Sí, Eliminar',
      btnDeny: 'No',
    });

    if (result?.value === true) {
      const resource = event.row;

      this.transactionalResourcesData.update(list =>
        list.map(item =>
          item.id === resource.id
            ? { ...item, active: false }
            : item
        )
      );
      this.notificationService.success(SUCCESS_MESSAGES.ITEM_DELETED);
    }
  }

  private callTransactionalResourceModal(availableResources?: any, item?: TransactionalResource):
    Observable<TransactionalResource | undefined> {
    const dialogRef = this.dialog.open(TransactionalResourcesModalComponent, {
      width: '50%',
      data: {
        isMaintenance: this.isMaintenance(),
        editMode: this.editMode(),
        resource: item,
        resourcesList: this.transactionalResourcesData(),
        availableResource: availableResources
      }
    });
    return dialogRef.afterClosed();
  }



  edit() {
    console.log('editando')
    this.enableForm();
    butonFunctionDis(['btnEditTIP']);
    buttonFunctionEn(['btnSaveTIP', 'btnCancelTIP']);

    const permises = this.permissionRolService.getPermissions()['transactional-investment-profile'];
    const salesPermises = this.permissionRolService.getPermissions()['sales-practices'];
    
    if(!salesPermises?.allDisabled){
      buttonFunctionEn(['quizTIP'])
      this.maintenanceQuizForm.enable({ emitEvent: false });
      this.investmentProfileForm.enable({ emitEvent: false });
    }else {
      butonFunctionDis(['quizTIP']);
      this.maintenanceQuizForm.disable({ emitEvent: false });
      this.investmentProfileForm.disable({ emitEvent: false });
    }
    
    if(!permises?.allDisabled){
      this.transactionalProfileForm.enable({ emitEvent: false });
      this.disableTableButtons(false);
      this.editMode.set(true);
      this.displayTransactionalAmount(this.transactionalProfileForm.get('7')?.value);
    }else{
      this.transactionalProfileForm.disable({ emitEvent: false });
      this.disableTableButtons(true);
      this.editMode.set(false);
    }
    this.applyFieldPermissions();
  }

  cancel() {
    buttonFunctionEn(['btnEditTIP']);
    butonFunctionDis(['btnSaveTIP', 'btnCancelTIP', 'quizTIP']);
    this.transactionalResourcesData.set(this.services[this.serviceName()]?.transactionalResources() ?? []);
    this.chargeInvestmentProfile();
    this.chargeTransactionalProfile();
    this.chargeMantInfo();
    this.disableForm();
    this.unsavedChangesService.setUnsavedChanges(false);
  }

  enableForm() {
    const role = this.auth.getUserInfo()().rol;
    const rolesBlocked = ['ROL_CAT_VIDEOLLAMADAS', 'ROL_ASESOR_FIN', 'ROL_ANALISTA_DE_CONTRATOS', 'SPINE_GESTOR_SUP'];
    const isBlockedRole = rolesBlocked.includes(role);

    this.transactionalProfileForm.enable({ emitEvent: false });

    if (!isBlockedRole) {
      this.maintenanceQuizForm.enable({ emitEvent: false });
      this.investmentProfileForm.enable({ emitEvent: false });
    } else {
      this.maintenanceQuizForm.disable({ emitEvent: false });
      this.investmentProfileForm.disable({ emitEvent: false });
      butonFunctionDis(['quizTIP']);
    }

    this.editMode.set(true);
    this.disableTableButtons(false);

    this.displayTransactionalAmount(this.transactionalProfileForm.get('7')?.value);
  }

  disableForm() {
    this.transactionalProfileForm.disable({ emitEvent: false });
    this.maintenanceQuizForm.disable({ emitEvent: false });
    this.investmentProfileForm.disable({ emitEvent: false });
    this.editMode.set(false);
    this.disableTableButtons(true);
  }

  disableTableButtons(disable: boolean) {
    this.config = {
      showPag: false,
      showEditAction: true,
      showDeleteAction: !disable,
      showViewAction: false,
      multipleSelection: false,
      idName: 'id',
      singleSelection: { show: false, title: '', propertyName: 'customProperty' },
    };
  }

  mapToCheckpointPrivacyNotice(checks: boolean[]): Checkpoint<TransactionalProfile> {
    return {
      sectionId: CHECKPOINT_IDS.TRANSACTIONAL_INVESTMENT_PROFILE,
      data: {
        transactionalProfileData: this.investmentProfileVisible() ?
          {
            ...this.transactionalProfileForm.value,
            ...this.investmentProfileForm.value,
            // ...this.maintenanceQuizForm.value,
          }
          : this.transactionalProfileForm.value
      }
    }
  }



  chargeMantInfo() {

    if (this.services[this.serviceName()].maintenanceQuiz()) {
      const infoMant = this.services[this.serviceName()].maintenanceQuiz();
      this.maintenanceQuizForm.patchValue({
        sClient: infoMant?.sClient,
        adendum: infoMant?.adendum,
        mga: infoMant?.mga,
        awm: infoMant?.awm,
        globalFront: infoMant?.globalFront,
        titular: this.titulares.filter(f => f.text === infoMant?.titular)[0]?.value ?? '',
        notApply: infoMant?.notApply,
        instClient: infoMant?.instClient,
        noInstClient: infoMant?.noInstClient,
        instClientPub: infoMant?.instClientPub,
        instClientFid: infoMant?.instClientFid,
      })
    }
  }

  chargeInvestmentProfile(){
    const investmentProfile = this.services[this.serviceName()].investmentProfile();
    const porfileRating = this.services[this.serviceName()].profileRating();
    this.investmentProfileForm = this.fb.group({
      service: [investmentProfile.service || '', Validators.required],
      subtype: [investmentProfile.subtype || '', Validators.required],
      profileRating: [porfileRating || '', Validators.required],
    });
  }

  chargeTransactionalProfile(){
    const transactionalProfileControls: any = {};
    const transactionalProfileDefaultValues = this.services[this.serviceName()].transactionalProfile();
    this.initialQuizCatalog().forEach(section => {
      section.questions.forEach(question => {
        let value = transactionalProfileDefaultValues[question.questionId] ?? '';
        if (question.questionId === 10 || question.questionId === 14) {
          value = value !== '' && value !== null && value !== undefined
            ? String(value)
            : '';
        }
        transactionalProfileControls[question.questionId] = [
          value,
          question.attributes.required ? Validators.required : null
        ];
      });
    });

    const lastId = transactionalProfileLastQuestion.questionId;
    transactionalProfileControls[lastId] = [transactionalProfileDefaultValues[lastId] || '', Validators.required];

    this.transactionalProfileForm = this.fb.group({
      ...transactionalProfileControls,
      transactionalLimit: new FormControl(this.services[this.serviceName()].transactionalProfile().transactionalLimit ?? null)
    });

    if (this.transactionalProfileForm.get('7')?.value !== 4) {
      this.disableControl("8");
      this.investmentProfileForm.patchValue({
        8: ''
      });
    }

    this.transactionalProfileForm.controls['7'].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.displayTransactionalAmount(value)
      }
      );
    const controlValue = this.transactionalProfileForm.controls['7']
    this.displayTransactionalAmount(controlValue.value);
    let contract
    if(!this.onboardingService.getCurrentInfo().isOnboarding && !this.onboardingService.getCurrentInfo().isCustomer && !this.onboardingService.getCurrentInfo().isMaintenance){
      contract = this.onboardingService.customerInitialData().bankAreaTypeId?.toString();
    }else {
      contract = this.onboardingService.getCurrentInfo().businessType;
    }
    this.showTransactionalAm(contract);
  }

  applyFieldPermissions() {
    const permises = this.permissionRolService.getPermissions()['transactional-investment-profile'];
    const disabled = permises?.fieldsDisabled ?? [];

    Object.keys(this.transactionalProfileForm.controls).forEach(key => {
      if (disabled.includes(key)) {
        this.transactionalProfileForm.get(key)?.disable({ emitEvent: false });
      }
    });
  }
}
interface TransactionalProfile {
}

interface BanckAreaType {
  bankAreaTypeId: number;
  contractType: ContractType[];
}

interface ContractType {
  contractTypeId: number;
  typeContractSubtypeIds: number[];
}
