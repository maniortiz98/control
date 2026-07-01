import { AfterViewInit, Component, computed, ElementRef, inject, OnInit, QueryList, signal, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { vulnerableActivities } from '../../../shared/services/storage-services/pm/general-info-fields-data';
import { GeneralInfoPmService } from '../../../shared/services/storage-services/pm/general-info-pm.service';
import { ConstitutiveDocumentsModalComponent } from './constitutive-documents-modal/constitutive-documents-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ConstitutiveDocuments } from '../../models/general-info-pm';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { CHECKPOINT_IDS, REGEX } from '../../constants/constants';
import { Checkpoint } from '../../models/checkpoints/checkpoint';
import { first } from 'rxjs';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { EconomicActivity } from '../../models/economic-activity';
import { PersonType } from '../../models/person-type';
import { CustomerIdentificationPmService } from '../../../shared/services/storage-services/pm/customer-identification-pm.service';
import { ERROR_MESSAGES } from '../../constants/form-messages';
import { Sector } from '../../models/sector';
import { FiscalRegimes } from '../../models/fiscal-regime';
import { ClientNoGuaranteedIpab } from '../../models/client-no-guaranteed-ipab';
import { CFDI } from '../../models/cfdi';
import { MatSelectChange } from '@angular/material/select';
import { OnboardingService } from '../../services/onboarding.service';
import { PermissionRolService } from '../../../core/services/rol.service';

@Component({
  selector: 'app-general-info-pm',
  standalone: false,
  templateUrl: './general-info-pm.component.html',
  styleUrl: './general-info-pm.component.scss'
})
export class GeneralInfoPmComponent implements OnInit, AfterViewInit {

  private readonly notificationService = inject(NotificationsService);
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly checkpoint = inject(CheckpointService);

  private readonly customerIdentificationPmService = inject(CustomerIdentificationPmService);
  private readonly dialog = inject(MatDialog);
  private readonly fb: FormBuilder = new FormBuilder;

  public readonly generalInfoPmService = inject(GeneralInfoPmService);
  public vulnerableActivities = vulnerableActivities;
  public columns = this.generalInfoPmService.columns;
  public documents = computed<ConstitutiveDocuments[]>(() => this.generalInfoPmService.documents());

  private readonly onboardingService = inject(OnboardingService);
  private readonly permissionRolService = inject(PermissionRolService);
  public readonly isMaintenance = computed(() => this.onboardingService.getCurrentInfo().isMaintenance);
  public readonly isEditable = computed(() => !this.permissionRolService.getPermissions()['general-info-pm'].allDisabled);
  public readonly permissionsRole = this.permissionRolService.getPermissions()['general-info-pm'];
  public permissionsSections: any = {};
  public availableFields: string[] = [];

  public readonly catalogService = inject(CatalogsService);

  public readonly form: FormGroup;
  public editMode = signal<boolean>(false);

  // #region catalogs
  public options = [
    {
      value: "Option1"
    },
    {
      value: "Option2"
    },
    {
      value: "Option3"
    },
  ];//TODO: Generic while we get real fields options

  public readonly banxicoOptions = [
    {
      value: "yes",
      label: "Si",
    },
    {
      value: "no",
      label: "No",
    },
    {
      value: "noUse",
      label: "No utilizo el servicio",
    },
  ];
  // #endregion catalogs

  public readonly economicActivity = signal<EconomicActivity[]>([]);
  public readonly personType = signal<PersonType[]>([]);
  public readonly sectors = signal<Array<Sector>>([]);
  public readonly fiscalRegime = signal<FiscalRegimes[]>([]);
  public readonly personClasification = signal<PersonType[]>([]);
  public readonly clientNoGuaranted = signal<ClientNoGuaranteedIpab[]>([]);
  public readonly cfdi = signal<CFDI[]>([]);

  public isMexican = computed(() => !this.customerIdentificationPmService.getItem() || this.customerIdentificationPmService.getItem()?.nationality === "MX");

  constructor(){
    // #region getting catalogs from services
    this.catalogService.getEconomicActivity({lineBusinessId: []}).subscribe(m => {
      this.economicActivity.set(m);
    });
    this.catalogService.getClassificationPerson({subPersonTypeIds: [], personType: '2'}).subscribe(m => {
      this.personType.set(m);
    });
    this.catalogService.getSector({idsSectorTypeCve: [""]}).subscribe(i => {
      this.sectors.set(i);
    });
    this.catalogService.getFiscalRegime({ personType: '' }).subscribe((c: any) => {
      this.fiscalRegime.set(c);
    });
    this.catalogService.getClassificationPerson({subPersonTypeIds: [], personType: '2'}).subscribe(i => {
      this.personClasification.set(i);
    })
    this.catalogService.getClientNoGuaranteedIpab( {guaranteedNoClientIds: [""]}).subscribe(i => {
      this.clientNoGuaranted.set(i);
    })

    // #endregion getting catalogs from services

    const rfcValidators = [Validators.required, Validators.minLength(12), Validators.maxLength(12)];
    const socialReasonValidators = [Validators.required, Validators.maxLength(60)];
    const zipCodeValidators = [Validators.required, Validators.minLength(5), Validators.maxLength(5)];
    const taxRegimeValidators = [Validators.required];
    const cdfiValidators = [Validators.required];

    const data = this.generalInfoPmService.generalInfoPmData();
    this.form = this.fb.group({
      personType: [data.personType || '', Validators.required],
      personClasification: [data.personClasification || '', Validators.required],
      moralPersonClasification: [data.moralPersonClasification || '', Validators.required],
      economicActivities: [data.economicActivities || '', Validators.required],
      otherEconomicActivities: [data.otherEconomicActivities || '', Validators.required],
      sector: [data.sector || '', Validators.required],
      employeesNumber: [data.employeesNumber || '', Validators.required],
      w9facta: [data.w9facta || ''],
      exemptDE: [data.exemptDE || ''],
      exemptIVA: [data.exemptIVA || ''],
      retentionISR: [data.retentionISR || ''],
      privateCompany: [data.privateCompany || ''],
      banxico: [data.banxico || ''],
      socialCapital: [data.socialCapital || '', [Validators.required, Validators.maxLength(100)]],
      investmentRange: [data.investmentRange || '', Validators.required],
      isGobermentMoralPerson: [data.isGobermentMoralPerson || '', Validators.required],
      companySize: [data.companySize || '', Validators.required],

      rfc: [data.rfc || ''],
      socialReason: [data.socialReason || ''],
      zipCode: [data.zipCode || ''],
      taxRegime: [data.taxRegime || ''],
      cdfi: [data.cdfi || ''],

      fiel: [data.fiel || '', [Validators.required, Validators.minLength(20), Validators.maxLength(20)]],
      expirationFiel: [data.expirationFiel || '', Validators.required],
      webPage: [data.webPage || '', [Validators.required, Validators.maxLength(20)]],
      relatedParts: [data.relatedParts || '', Validators.required],
      ipab: [data.ipab || '', Validators.required],
      isOwnAccountAct: [data.isOwnAccountAct || '', Validators.required],
      haveResourceProvider: [data.haveResourceProvider || '', Validators.required],
      vulnerableActivity: [data.vulnerableActivity || '', Validators.required],
      activity: [data.activity || ''],
      spid: [data.spid || ''],
    });

    if(this.isMexican()){
        this.form.controls['rfc'].setValidators(rfcValidators);
        this.form.controls['socialReason'].setValidators(socialReasonValidators);
        this.form.controls['zipCode'].setValidators(zipCodeValidators);
        this.form.controls['taxRegime'].setValidators(taxRegimeValidators);
        this.form.controls['cdfi'].setValidators(cdfiValidators);
    }
    else{
        this.form.controls['rfc'].clearValidators();
        this.form.controls['socialReason'].clearValidators();
        this.form.controls['zipCode'].clearValidators();
        this.form.controls['taxRegime'].clearValidators();
        this.form.controls['cdfi'].clearValidators();
    }

    this.form.valueChanges.subscribe(e => {
      this.unsavedChangesService.setUnsavedChanges(true);
      if(this.form.controls['vulnerableActivity'].value === 'yes'){
        this.form.controls['activity'].setValidators(Validators.required);
      }
      else{
        this.form.controls['activity'].clearValidators();
      }
      this.generalInfoPmService.generalInfoPmData.set(this.form.value);
    });
  }
  ngOnInit(): void {
    if(this.permissionsRole.sections){
      const sectionsWithFields = Object.values(this.permissionsRole.sections).filter((section:any) => section.fields);
      this.availableFields = sectionsWithFields.reduce((acc:any, section:any) => acc.concat(section.fields), []) as string[];
      this.permissionsSections = this.permissionsRole.sections;      
    }
  }

  ngAfterViewInit(): void {
    if(this.isMaintenance()){
      if(!this.editMode()){
        this.disableForm();
      }
    }
  }

  fielValidate(){
    // TODO: Validate Fiel with service
  }

  showConstitutiveDocumentsModal(e: Event): void {
    e.preventDefault();
    this.dialog.open(ConstitutiveDocumentsModalComponent, {
      maxWidth: '99%',
      width: '80%',
      data: { edit: false }
    });
  }

  async eventRowConstitutiveDocuments(e:any){
    if(e.type === 'delete'){
      const result = await this.notificationModalService.confirm({
        title: '¿Confirma eliminar el registro?',
        btnAccept: 'Confirmar',
        btnDeny: 'Cancelar',
      });
      if (result?.value === true) {
        this.unsavedChangesService.setUnsavedChanges(true);
        this.notificationService.success('Registro eliminado con éxito');
        this.generalInfoPmService.documents.set(
          this.generalInfoPmService.documents().filter((document: ConstitutiveDocuments) => document.deedNumber !== e.row.deedNumber)
        );
      }
    }
    else if(e.type === 'edit'){
      this.dialog.open(ConstitutiveDocumentsModalComponent, {
        maxWidth: '99%',
        width: '80%',
        data: { edit: true, document: e.row }
    });
    }
  }

  private getMissingRequiredFields(): string[] {
    const missingFields: string[] = [];
    for( const key of Object.keys(this.form.controls)) {
      const control = this.form.get(key);

      if (control?.invalid && control?.hasError('required')) {
        const labelElement = document.getElementById(`${key}Label`);
        const labelText = labelElement?.textContent?.replace('*', '').trim() || key;
        missingFields.push(labelText);
      }
    };
    return missingFields;
  }

  private getInvalidFieldsExcludingRequired(): string[] {
    const invalidFields: string[] = [];
    for (const key of Object.keys(this.form.controls)){
      const control = this.form.get(key);

      if (control?.invalid && control?.errors) {
        const errors = control.errors;
        const nonRequiredErrors = Object.keys(errors).filter(errorKey => errorKey !== 'required');

        if (nonRequiredErrors.length > 0) {
          const labelElement = document.getElementById(`${key}Label`);
          const labelText = labelElement?.textContent?.replace('*', '').trim() || key;
          invalidFields.push(labelText);
        }
      }
    };
    return invalidFields;
  }

  save(){
    if(this.form.valid){
      this.unsavedChangesService.setUnsavedChanges(false);
      // this.checkpoint.saveCheckpoint('saveCheckpoint', this.mapToCheckpointPrivacyNotice())
      // .pipe(first())
      // .subscribe(
      //   {
      //     next: (res) => {
      //       console.log("res:",res);
      //       this.notificationService.success('Guardado con éxito');
      //     },
      //     error: (err) => {
      //       console.log("err:",err);
      //       this.notificationService.error('Error al guardar');
      //     },
      //     complete: () => {
      //       console.log("completed");
      //     }
      //   },
      // );
    }
    else{
      // const invalidFields = this.getInvalidFieldsExcludingRequired();
      // if(missingFields.length > 0) {
      //   this.notificationService.error(`Faltan campos requeridos: • ${missingFields.join(' • ')}`);
      // }

      // else if(invalidFields.length > 0) {
      //   this.notificationService.error(`Campos con formato inválido: • ${invalidFields.join(' • ')}`);
      // }
      // const invalidFields = this.getInvalidFieldsExcludingRequired();
      const missingRequiredFields = this.getMissingRequiredFields();
      document.body.classList.add('show-validation');
      for (const [, control] of Object.entries(this.form.controls)) {
        if (control.invalid) {
          control.markAsTouched();
        }
      }

      if(missingRequiredFields.length > 0) {
        this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS);
      }

      else if(!REGEX.RFC_PM_VALIDATION.test(this.form.controls['rfc'].value)){
        this.notificationService.error('Campos con formato inválido: • RFC • ');
      }
    }
  }

  edit(){
    this.enableForm();
  }

  cancel(){
    this.form.reset(this.generalInfoPmService.initialGeneralInfoPmData);
    this.disableForm();
    this.unsavedChangesService.setUnsavedChanges(false);
  }

  enableForm(){
    if(this.availableFields.length > 0){
      this.availableFields.forEach(field => {
        this.form.get(field)?.enable({ emitEvent: false });
      });
    }
    else {
      this.form.enable({ emitEvent: false });
    }
    this.editMode.set(true);
    this.disableTableButtons(false);
  }

  disableForm(){
    this.form.disable({ emitEvent: false });
    this.editMode.set(false);
    this.disableTableButtons(true);
  }

  disableTableButtons(disable: boolean){
    document.querySelectorAll(".btn-text-edit").forEach((btn: any) => {
      btn.disabled = disable;
      btn.style.cursor = disable ? 'not-allowed' : 'pointer';
    });
    document.querySelectorAll(".btn-text-delete").forEach((btn: any) => {
      btn.disabled = disable;
      btn.style.cursor = disable ? 'not-allowed' : 'pointer';
    });
  }

  mapToCheckpointPrivacyNotice(): Checkpoint<GeneralInfoPMCheckpoint> {
    return {
      sectionId: CHECKPOINT_IDS.IDENTIFICATION_SECTION,
      data: {
        generalInfoPmData: this.form.value //TODO: set real data structure
      }
    }
  }

  onFiscalRegimenChange(event: MatSelectChange){
    this.catalogService.getCfdi( {personType: "PM", fiscalRegimeId: event.value }).subscribe(i => {
      this.cfdi.set(i);
    })
  }

}

interface GeneralInfoPMCheckpoint{ //TODO: set real data structure

}
