import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { CHECKPOINT_IDS, REGEX } from '../../constants/constants';
import { Checkpoint } from '../../models/checkpoints/checkpoint';
import { first, merge, map } from 'rxjs';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AllowedValuesRfcNifTinNss } from '../../../shared/utils/map-rfc-nif-tin-nss';
import { PldQuizPmService } from '../../../shared/services/pld-quiz-pm.service';
import { Nationalities } from '../../models/nationality';
import { Countries } from '../../models/country';
import { ERROR_MESSAGES } from '../../constants/form-messages';
import { OnboardingService } from '../../services/onboarding.service';
import { PermissionRolService } from '../../../core/services/rol.service';

@Component({
  selector: 'app-pld-quiz-pm',
  standalone: false,
  templateUrl: './pld-quiz-pm.component.html',
  styleUrl: './pld-quiz-pm.component.scss'
})
export class PldQuizPmComponent {

  private readonly onboardingService = inject(OnboardingService);
  private readonly permissionRolService = inject(PermissionRolService);
  public readonly isMaintenance = computed(() => this.onboardingService.getCurrentInfo().isMaintenance);
  public readonly isEditable = computed(() => !this.permissionRolService.getPermissions()['pld-quiz-pm'].allDisabled);

  private readonly notificationService = inject(NotificationsService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly checkpoint = inject(CheckpointService);  
  private readonly fb: FormBuilder = new FormBuilder;  
  
  public readonly pldQuizPmService = inject(PldQuizPmService);  
  public readonly catalogsService = inject(CatalogsService);  
  public readonly form: FormGroup;
  public editMode = signal<boolean>(false);

  // #region catalogs
  nationalities = signal<Nationalities[]>([]);
  countries = signal<Array<Countries>>([]);
  // #endregion catalogs

    constructor() {
      this.catalogsService.getNationalities({ land: [] }).subscribe(i => {
        this.nationalities.set(i)
      });

      this.catalogsService.getCountry({land: []}).subscribe(c => {
        this.countries.set(c);
      });

      //TODO: Make the api call and set the values
      // if(this.isMaintenance()){
      //   this.pldQuizPmService.pldQuizData.set({});
      // }

      const data = this.pldQuizPmService.pldQuizData();
      this.form = this.fb.group({
        anualSalary: [data.anualSalary || '', Validators.required],
        employeesNumber: [data.employeesNumber || '', Validators.required],

        presidentFirstName: [data.presidentFirstName || '', Validators.required],
        presidentSecondName: [data.presidentSecondName || ''],
        presidentFirstLastName: [data.presidentFirstLastName || '', Validators.required],
        presidentSecondLastName: [data.presidentSecondLastName || ''],
        presidentNationality: [data.presidentNationality || '', Validators.required],
        presidentResidencePlace: [data.presidentResidencePlace || '', Validators.required],

        secretaryFirstName: [data.secretaryFirstName || '', Validators.required],
        secretarySecondName: [data.secretarySecondName || ''],
        secretaryFirstLastName: [data.secretaryFirstLastName || '', Validators.required],
        secretarySecondLastName: [data.secretarySecondLastName || ''],
        secretaryNationality: [data.secretaryNationality || '', Validators.required],
        secretaryResidencePlace: [data.secretaryResidencePlace || '', Validators.required],

        directorFirstName: [data.directorFirstName || '', Validators.required],
        directorSecondName: [data.directorSecondName || ''],
        directorFirstLastName: [data.directorFirstLastName || '', Validators.required],
        directorSecondLastName: [data.directorSecondLastName || ''],
        directorJobTitle: [data.directorSecondLastName || '', Validators.required],
        directorNationality: [data.directorNationality || '', Validators.required],
        directorResidencePlace: [data.directorResidencePlace || '', Validators.required],

        isGafiOfficial: [data.isGafiOfficial || false, Validators.required],
        gafiOfficial: [{value: data.gafiOfficial || '', disabled: true}],
        isGafiZone: [data.isGafiZone || false, Validators.required],
        gafiZone: [{value: data.gafiZone || '', disabled: true}],
        isGafiCompany: [data.isGafiCompany || false, Validators.required],
        gafiCompany: [{value: data.gafiCompany || '', disabled: true}],

        activityTypes: [data.activityTypes || '', Validators.required],
        hasTaxDonation: [data.hasTaxDonation || false, Validators.required],
        taxDonation: [{value: data.taxDonation || '', disabled: true}],
        hasDonors: [data.hasDonors || false, Validators.required],
        // donors: [{value: data.donors || '', disabled: true}],
        donorsNumber: [data.donorsNumber || '', Validators.required],

        inCash: [data.hasAccountCash || false, Validators.required],
        hasAccountCash: [data.hasAccountCash || false, Validators.required],
        accountCash: [{value: data.accountCash || '', disabled: true}],        
        hasDirectlyCash: [data.hasDirectlyCash || false, Validators.required],
        directlyCash: [{value: data.directlyCash || '', disabled: true}],        
        hasChecks: [data.hasChecks || false, Validators.required],
        checks: [{value: data.checks || '', disabled: true}],        
        hasTransfers: [data.hasTransfers || false, Validators.required],
        transfers: [{value: data.transfers || '', disabled: true}],        
        hasCreditCard: [data.hasCreditCard || false, Validators.required],
        creditCard: [{value: data.creditCard || '', disabled: true}],        
        hasInKind: [data.hasInKind || false, Validators.required],
        inKind: [{value: data.inKind || '', disabled: true}],
        hasForeignDonation: [data.hasForeignDonation || false, Validators.required],
        foreignDonation: [{value: data.foreignDonation || '', disabled: true}],

        isGafiDonation: [data.isGafiDonation || false, Validators.required],
        gafiDonation: [{value: data.gafiDonation || '', disabled: true}],
        monthAverage: [data.monthAverage || '', Validators.required],

        isGovernmentCompany: [data.isGovernmentCompany || false, Validators.required],
        governmentCompany: [{value: data.governmentCompany || '', disabled: true}],
        hasDonationTypes: [data.hasDonationTypes || false, Validators.required],
        donationTypes: [{value: data.donationTypes || '', disabled: true}],

        hasIncomeSources: [data.hasIncomeSources || false, Validators.required],
        incomeSources: [{value: data.incomeSources || '', disabled: true}],
        businessType: [data.businessType || '', Validators.required],

        isPpe: [data.isPpe || false, Validators.required],
        ppeFirstName: [{value: data.ppeFirstName || '', disabled: true}],
        ppeSecondName: [{value: data.ppeSecondName || '', disabled: true}],
        ppeFirstLastName: [{value: data.ppeFirstLastName || '', disabled: true}],
        ppeSecondLastName: [{value: data.ppeSecondLastName || '', disabled: true}],

        // General Data controls
        curp: [data.curp || '', Validators.required],
        rfc: [data.rfc || '', Validators.required],
        email: [data.email || '', [Validators.required, Validators.email]],
        firstName: [data.firstName || '', Validators.required],
        secondName: [data.secondName || ''],
        firstLastName: [data.firstLastName || '', Validators.required],
        secondLastName: [data.secondLastName || '', Validators.required],
        birthDate: [data.birthDate || '', Validators.required],
        birthPlace: [data.birthPlace || '', Validators.required],
        nationality: [data.nationality || '', Validators.required],
        address: [data.address || '', Validators.required],
        homePhone: [data.homePhone || '', Validators.required],
        cellPhone: [data.cellPhone || '', Validators.required],
        // alternativeEmail: [data.alternativeEmail || '', Validators.email],
        foreignResidentId: [data.foreignResidentId || '', Validators.required],
        additionalFunctions: [data.additionalFunctions || '', Validators.required],

        // Real Owner Data controls
        realOwnerFirstName: [data.realOwnerFirstName || '', Validators.required],
        realOwnerSecondName: [data.realOwnerSecondName || ''],
        realOwnerFirstLastName: [data.realOwnerFirstLastName || '', Validators.required],
        realOwnerSecondLastName: [data.realOwnerSecondLastName || '', Validators.required],
        groupFirstName: [data.groupFirstName || '', Validators.required],
        groupSecondName: [data.groupSecondName || ''],
        groupFirstLastName: [data.groupFirstLastName || '', Validators.required],
        groupSecondLastName: [data.groupSecondLastName || '', Validators.required],
        businessDenomination: [data.businessDenomination || '', Validators.required],
        businessNationality: [data.businessNationality || '', Validators.required],
        businessAddress: [data.businessAddress || '', Validators.required],
        economicActivity: [data.economicActivity || '', Validators.required],
        shareCapital: [data.shareCapital || '', Validators.required],
        isGafiCountryRealOwner: [data.isGafiCountryRealOwner || false, Validators.required],
        gafiCountryRealOwner: [{value: data.gafiCountryRealOwner || '', disabled: true}],

        capitalFirstName: [data.capitalFirstName || '', Validators.required],
        capitalSecondName: [data.capitalSecondName || ''],
        capitalFirstLastName: [data.capitalFirstLastName || '', Validators.required],
        capitalSecondLastName: [data.capitalSecondLastName || '', Validators.required],

        // GAFI Country controls
        gafiCountryFirstName: [data.gafiCountryFirstName || '', Validators.required],
        gafiCountrySecondName: [data.gafiCountrySecondName || ''],
        gafiCountryFirstLastName: [data.gafiCountryFirstLastName || '', Validators.required],
        gafiCountrySecondLastName: [data.gafiCountrySecondLastName || '', Validators.required],

        // Organizational Structure controls
        orgStructureFirstName: [data.orgStructureFirstName || '', Validators.required],
        orgStructureSecondName: [data.orgStructureSecondName || ''],
        orgStructureFirstLastName: [data.orgStructureFirstLastName || '', Validators.required],
        orgStructureSecondLastName: [data.orgStructureSecondLastName || '', Validators.required],
        orgStructureDescription: [data.orgStructureDescription || '', Validators.required],

        // Shareholders Control controls
        shareholdersFirstName: [data.shareholdersFirstName || '', Validators.required],
        shareholdersSecondName: [data.shareholdersSecondName || ''],
        shareholdersFirstLastName: [data.shareholdersFirstLastName || '', Validators.required],
        shareholdersSecondLastName: [data.shareholdersSecondLastName || '', Validators.required],
        shareholdersDescription: [data.shareholdersDescription || '', Validators.required],

        isTtp: [data.isTtp || false, Validators.required],
        ttpReason: [{value: data.ttpReason || '', disabled: true}],
        ttpRelation: [{value: data.ttpRelation || '', disabled: true}],
        ttpReasonServices: [{value: data.ttpReasonServices || '', disabled: true}],
        
        isOneTtpContribution: [data.isOneTtpContribution || false, Validators.required],
        oneTtpContribution: [{value: data.oneTtpContribution || '', disabled: true}],

        isPeriodicTtpContribution: [data.isPeriodicTtpContribution || false, Validators.required],
        periodicAmountContribution: [{value: data.periodicAmountContribution || '', disabled: true}],
        periodicContribution: [{value: data.periodicContribution || '', disabled: true}],
        reasonContribution: [{value: data.reasonContribution || '', disabled: true}],
        ttpBenefits: [data.ttpBenefits || '', Validators.required],

        accountPurpose: [data.accountPurpose || '', Validators.required],
        monthPayment: [data.monthPayment || '', Validators.required],
        inputsNumber: [data.inputsNumber || null, Validators.required],
        outputsNumber: [data.outputsNumber || null, Validators.required],
        nationalInputsNumber: [data.nationalInputsNumber || null, Validators.required],
        nationalOutputsNumber: [data.nationalOutputsNumber || null, Validators.required],
        internationalInputsNumber: [data.internationalInputsNumber || null, Validators.required],
        internationalOutputsNumber: [data.internationalOutputsNumber || null, Validators.required],
        otherMovements: [data.otherMovements || '', Validators.required],
        countriesMovements: [data.countriesMovements || '', Validators.required],
        gafiCountriesMovements: [data.gafiCountriesMovements || '', Validators.required],
        countriesMovementsReason: [data.countriesMovementsReason || '', Validators.required],

        hasOtherInstruments: [data.hasOtherInstruments || false, Validators.required],
        otherInstruments: [{value: data.otherInstruments || '', disabled: true}],

        isForOthersMovementsAccount: [data.isForOthersMovementsAccount || false, Validators.required],
        forOthersMovementsAccount: [{value: data.forOthersMovementsAccount || '', disabled: true}],

        hasClientReference: [data.hasClientReference || false, Validators.required],
        clientReference: [{value: data.clientReference || '', disabled: true}],
        isMovementSimilar: [data.isMovementSimilar || false, Validators.required],
        movementSimilar: [{value: data.movementSimilar || '', disabled: true}],
        isHighRiskActivity: [data.isHighRiskActivity || false, Validators.required],
        highRiskActivity: [{value: data.highRiskActivity || '', disabled: true}],

        clientDisposition: [data.clientDisposition || '', Validators.required],
        clientVisitDate: [data.clientVisitDate || '', Validators.required],
        adviserName: [data.adviserName || '', Validators.required],
        adviserRole: [data.adviserRole || '', Validators.required],
        financialManager: [data.financialManager || '', Validators.required],
        financialDirector: [data.financialDirector || '', Validators.required],
      });

      if(this.isMaintenance()){
        this.disableForm();
      }

      if(this.pldQuizPmService.isMaintenance()){
        this.form.disable({ emitEvent: false });
      }

      merge(
        this.form.controls['isGafiOfficial'].valueChanges.pipe(map(value => ({ control: 'gafiOfficial', value }))),
        this.form.controls['isGafiZone'].valueChanges.pipe(map(value => ({ control: 'gafiZone', value }))),
        this.form.controls['isGafiCompany'].valueChanges.pipe(map(value => ({ control: 'gafiCompany', value }))),

        this.form.controls['hasTaxDonation'].valueChanges.pipe(map(value => ({ control: 'taxDonation', value }))),
        // this.form.controls['hasDonors'].valueChanges.pipe(map(value => ({ control: 'donors', value }))),

        this.form.controls['hasAccountCash'].valueChanges.pipe(map(value => ({ control: 'accountCash', value }))),
        this.form.controls['hasDirectlyCash'].valueChanges.pipe(map(value => ({ control: 'directlyCash', value }))),
        this.form.controls['hasChecks'].valueChanges.pipe(map(value => ({ control: 'checks', value }))),
        this.form.controls['hasTransfers'].valueChanges.pipe(map(value => ({ control: 'transfers', value }))),
        this.form.controls['hasCreditCard'].valueChanges.pipe(map(value => ({ control: 'creditCard', value }))),
        this.form.controls['hasInKind'].valueChanges.pipe(map(value => ({ control: 'inKind', value }))),
        this.form.controls['hasForeignDonation'].valueChanges.pipe(map(value => ({ control: 'foreignDonation', value }))),

        this.form.controls['isGafiDonation'].valueChanges.pipe(map(value => ({ control: 'gafiDonation', value }))),

        this.form.controls['isGovernmentCompany'].valueChanges.pipe(map(value => ({ control: 'governmentCompany', value }))),
        this.form.controls['hasDonationTypes'].valueChanges.pipe(map(value => ({ control: 'donationTypes', value }))),

        this.form.controls['hasIncomeSources'].valueChanges.pipe(map(value => ({ control: 'incomeSources', value }))),

        this.form.controls['isPpe'].valueChanges.pipe(map(value => ({ control: 'ppeFirstName', value }))),
        this.form.controls['isPpe'].valueChanges.pipe(map(value => ({ control: 'ppeSecondName', value }))),
        this.form.controls['isPpe'].valueChanges.pipe(map(value => ({ control: 'ppeFirstLastName', value }))),
        this.form.controls['isPpe'].valueChanges.pipe(map(value => ({ control: 'ppeSecondLastName', value }))),

        this.form.controls['isGafiCountryRealOwner'].valueChanges.pipe(map(value => ({ control: 'gafiCountryRealOwner', value }))),

        this.form.controls['isOneTtpContribution'].valueChanges.pipe(map(value => ({ control: 'oneTtpContribution', value }))),

        this.form.controls['isPeriodicTtpContribution'].valueChanges.pipe(map(value => ({ control: 'periodicAmountContribution', value }))),
        this.form.controls['isPeriodicTtpContribution'].valueChanges.pipe(map(value => ({ control: 'periodicContribution', value }))),
        this.form.controls['isPeriodicTtpContribution'].valueChanges.pipe(map(value => ({ control: 'reasonContribution', value }))),

        this.form.controls['isTtp'].valueChanges.pipe(map(value => ({ control: 'ttpReason', value }))),
        this.form.controls['isTtp'].valueChanges.pipe(map(value => ({ control: 'ttpRelation', value }))),
        this.form.controls['isTtp'].valueChanges.pipe(map(value => ({ control: 'ttpReasonServices', value }))),

        this.form.controls['hasOtherInstruments'].valueChanges.pipe(map(value => ({ control: 'otherInstruments', value }))),        
        this.form.controls['isForOthersMovementsAccount'].valueChanges.pipe(map(value => ({ control: 'forOthersMovementsAccount', value }))),

        this.form.controls['hasClientReference'].valueChanges.pipe(map(value => ({ control: 'clientReference', value }))),
        this.form.controls['isMovementSimilar'].valueChanges.pipe(map(value => ({ control: 'movementSimilar', value }))),
        this.form.controls['isHighRiskActivity'].valueChanges.pipe(map(value => ({ control: 'highRiskActivity', value }))),
      ).pipe(takeUntilDestroyed()).subscribe(
        ({control, value}) => {
          if(value){
            this.form.controls[control].enable();
            this.form.controls[control].setValidators(Validators.required);
            this.form.controls[control].updateValueAndValidity();
          }
          else{
            this.form.controls[control].clearValidators();
            this.form.controls[control].updateValueAndValidity();
            this.form.controls[control].setValue('');
            this.form.controls[control].disable();
          }
        }
      );

      this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(e => {
        this.unsavedChangesService.setUnsavedChanges(true);
        this.pldQuizPmService.pldQuizData.set(this.form.value);
      });
    }

    private getMissingRequiredFields(): string[] {
      const missingFields: string[] = [];
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);

        if (control?.invalid && control?.hasError('required')) {
          const labelElement = document.getElementById(`${key}Label`);
          const labelText = labelElement?.textContent?.replace('*', '').trim() || key;
          missingFields.push(labelText);
        }
      });
      return missingFields;
    }

    private getInvalidFieldsExcludingRequired(): string[] {
      const invalidFields: string[] = [];
      Object.keys(this.form.controls).forEach(key => {
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
      });
      return invalidFields;
    }

    save(){
      if(this.form.valid){
        this.unsavedChangesService.setUnsavedChanges(false);
        // this.checkpoint.saveCheckpoint('saveCheckpoint', this.mapToCheckpointPldQuiz())
        // .pipe(first())
        // .subscribe(
        //   {
        //     next: (res) => {
        //       this.notificationService.success('Guardado con éxito');
        //     },
        //     error: (err) => {
        //       this.notificationService.error('Error al guardar');
        //     },
        //     complete: () => {
        //     }
        //   },
        // );
      }
      else{
        const missingRequiredFields = this.getMissingRequiredFields();
        // const invalidFields = this.getInvalidFieldsExcludingRequired();
        
        document.body.classList.add('show-validation');
        for (const [, control] of Object.entries(this.form.controls)) {
          if (control.invalid) {
            control.markAsTouched();
          }
        }     
        
        if(missingRequiredFields.length > 0) {
          this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS);
        }

        // else if(invalidFields.length > 0) {
        //   this.notificationService.error(`Campos con formato inválido: • ${invalidFields.join(' • ')}`);
        // }

        else if(!REGEX.CURP_VALIDATION.test(this.form.controls['curp'].value)){
          this.notificationService.error('Campos con formato inválido: • CURP de Apoderado Entrevistado • ');
        }

        else if(this.form.controls['rfc'].value === AllowedValuesRfcNifTinNss.RFC && !REGEX.RFC_VALIDATION.test(this.form.controls['rfc'].value)){
          this.notificationService.error('Campos con formato inválido: • RFC de Apoderado Entrevistado • ');
        }
      }
    }

    edit(){
      this.enableForm();
    }
    
    cancel(){
      this.form.reset(this.pldQuizPmService.initialPldQuizData); 
      this.disableForm();
      this.unsavedChangesService.setUnsavedChanges(false);  
    }

    enableForm(){
      this.form.enable({ emitEvent: false });
      this.editMode.set(true);
    }

    disableForm(){
      this.form.disable({ emitEvent: false });
      this.editMode.set(false);
    }

    mapToCheckpointPldQuiz(): Checkpoint<pldQuizPMCheckpoint> {
      return {
        sectionId: CHECKPOINT_IDS.IDENTIFICATION_SECTION,
        data: {
          generalInfoPmData: this.form.value //TODO: set real data structure
        }
      }
    }

    editForm(edit: boolean){
      edit ? this.form.enable({ emitEvent: false }) : this.form.disable({ emitEvent: false });
    }

}

interface pldQuizPMCheckpoint{ //TODO: set real data structure

}
