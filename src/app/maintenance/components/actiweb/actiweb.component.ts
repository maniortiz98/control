import { Component, computed, effect, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActiwebService } from '../../../shared/services/actiweb.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../../onboarding/constants/form-messages';
import { actiwebToCheckpoint, checkpointToActiweb } from '../../../onboarding/services/mappers/actiweb.mapper';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { concatMap } from 'rxjs';
import { OnboardingService } from '../../../onboarding/services/onboarding.service';
import { PermissionRolService } from '../../../core/services/rol.service';
import { ActiwebDataCheckpoint, CheckpointDataActiweb } from '../../../onboarding/models/checkpoints/actiweb-checkpoint';
import { Advisor } from '../../../onboarding/models/catalogs/advisor';
import { ActivatedRoute } from '@angular/router';
import { GeneralInfoStorageService } from '../../../shared/services/storage-services/general-info-storage.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserInfo } from '../../../core/models/user-info';
import { GeneralInfoContract } from '../../../onboarding/models/general-info';
import { scAlphaPortfolioInvestment, scBankOrigin, scCreditType, scHighSpeedChannel, scInvestorKey, scMinMarkClassification, scPlanType, scPortfolioCharge, scPortfolioChargeType } from '../../../onboarding/constants/small-catalogs';
import { DefaultList } from '../../../shared/models/default-list';

@Component({
  selector: 'app-actiweb',
  standalone: false,
  templateUrl: './actiweb.component.html',
  styleUrl: './actiweb.component.scss'
})
export class ActiwebComponent implements OnInit {
  private readonly authService           = inject(AuthService);
  readonly onboardingService     = inject(OnboardingService);
  private readonly permissionRolService  = inject(PermissionRolService);
  private readonly notificationService   = inject(NotificationsService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly actiwebService        = inject(ActiwebService);
  private readonly route                 = inject(ActivatedRoute);
  private readonly checkpoint            = inject(CheckpointService);
  private readonly generalInfoStorage    = inject(GeneralInfoStorageService);

  // TODO default en el formulario, en el campo [Promotor Inversión ALPHA | "alphaInvPromo"]
  // El Valor Predeterminado se muestra con el nombre del Asesor Dueño del Contrato

  public readonly isMaintenance = computed(() => this.onboardingService.getCurrentInfo().isMaintenance);
  public readonly isEditable = computed(() => !this.permissionRolService.getPermissions()['actiweb'].allDisabled);

  private readonly fb: FormBuilder = new FormBuilder;
  private readonly confirmControls: string[] = ["treasuryOperations", "capitalDeskTrading", "moneyDeskTrading", "invFundsTrading"];

  private readonly ssControls: string[] = ['range7mxn','tiie196mxn','range196mxn','range7eu','range7usd','dnt7usd']; //structuralStrategies
  private readonly cpControls: string[] = ['planType']; //clientPlan
  private readonly ccControls: string[] = ['creditType']; //creditContract
  private readonly mmControls: string[] = ['mmClass','highSpeedChannel']; //minimumMarketability
  private readonly apControls: string[] = ['alphaInvPortType','alphaInvPromo']; //alphaInv
  private readonly pcControls: string[] = ['pwmPortfolio','pwmPromo']; //pwmContract
  private readonly capDeskControls: string[] = [];

  public readonly form: FormGroup;
  readonly userInfo: Signal<UserInfo> = this.authService.getUserInfo();
  generalInfoContract: GeneralInfoContract | null  = null;

  editMode: WritableSignal<boolean> = signal(false);

  readonly planTypeOptions: DefaultList<string>[] = scPlanType;
  readonly creditTypeOptions: DefaultList<string>[] = scCreditType;
  readonly minMarkClassificationOptions: DefaultList<string>[] = scMinMarkClassification;
  readonly portfolioChargeOptions: DefaultList<boolean>[] = scPortfolioCharge;
  readonly highSpeedChannelOptions: DefaultList<string>[] = scHighSpeedChannel;
  readonly portfolioChargeTypeOptions: DefaultList<string>[] = scPortfolioChargeType;
  readonly bankOriginOptions: DefaultList<string>[] = scBankOrigin;
  readonly alphaPortfolioInvestmentOptions: DefaultList<string>[] = scAlphaPortfolioInvestment;
  readonly investorKeyOptions: DefaultList<string>[] = scInvestorKey;

  advisor: WritableSignal<Array<Advisor>> = signal([]);

  advisorAlpha: WritableSignal<Array<Advisor>> = signal([]);
  promoterAlphaFilter = new FormControl('');

  advisorPrivate: WritableSignal<Array<Advisor>> = signal([]);
  promoterPrivateFilter = new FormControl('');

  structuralStrategiesCtrlSgnl: Signal<boolean> = signal(false);
  clientPlanCtrlSgnl          : Signal<boolean> = signal(false);
  creditContractCtrlSgnl      : Signal<boolean> = signal(false);
  alphaInvCtrlSgnl            : Signal<boolean> = signal(false);
  pwmContractCtrlSgnl         : Signal<boolean> = signal(false);
  futEligCapDeskCtrlSgnl      : Signal<boolean> = signal(false);


  // #region Constructor
  /**
   * Constructor
   */
  constructor() {

    console.log("isMaintenance:",this.isMaintenance());
    console.log("isEditable:",this.isEditable());

    const data: CheckpointDataActiweb = checkpointToActiweb(this.actiwebService.actiwebData());
    this.generalInfoContract = this.generalInfoStorage.generalInfoContract();

    console.log(this.generalInfoContract);
    console.log(data);

    this.form = this.fb.group({
      // NOTAS ESTRUCTURADAS
      structuralStrategies: [data.structuralStrategies ?? false], // Estrategias Notas Estructuradas CP
      range7mxn           : [data.range7mxn ?? false],    // Nota Rango Acumulable MXN a 7 días
      tiie196mxn          : [data.tiie196mxn ?? false],   // Nota TIIE MXN a 196 días
      range196mxn         : [data.range196mxn ?? false],  // Nota Rango Acumulable MXN a 196 días
      range7eu            : [data.range7eu ?? false],     // Nota Rango Europeo USD a 7 días
      range7usd           : [data.range7usd ?? false],    // Nota Rango Acumulable USD a 7 días
      dnt7usd             : [data.dnt7usd ?? false],      // Nota DNT USD a 7 días

      // EL CLIENTE
      clientSic       : [data.clientSic ?? false],        // El Cliente Opera SIC
      clientActions   : [data.clientActions ?? false],    // El Cliente Opera Acciones
      clientMargin    : [data.clientMargin ?? false],     // El Cliente tiene Operación de Margen
      clientPlan      : [data.clientPlan ?? false],       // El Cliente tiene Plan de Retiro || If = TRUE then [Tipo de Plan de Retiro].visible = TRUE
      clientFc        : [data.clientFc ?? false],         // Prestamista - Fondos de Inversión
      clientInvestment: [data.clientInvestment ?? false], // El Cliente tiene Fideicomiso
      planType        : [data.planType],                  // Tipo de Plan de Retiro

      // CARACTERISTICSA GENERALES
      accountStatement    : [data.accountStatement ?? false],      // Se debe imprimir el Estado de Cuenta
      liquidatingAccount  : [data.liquidatingAccount ?? false],    // Cuenta Liquidadora
      employeeContract    : [data.employeeContract ?? false],      // Contrato de Empleado
      creditContract      : [data.creditContract ?? false],        // El Contrato se usa para Crédito                       || Checkbox
      rmmOps              : [data.rmmOps ?? false],                // Restringir operaciones de Mercado de Dinero           || Checkbox
      rdw                 : [data.rdw ?? false],                   // Restringir Depósitos y Retiros                        || Checkbox
      creditType          : [data.creditType || ''],               // Especifique Tipo de Crédito                           || Combobox
      minimumMarketability: [data.minimumMarketability ?? false],  // Mínima Bursatilidad                                   || Checkbox
      restrictTransfers   : [data.restrictTransfers ?? false],     // Restringir Traspasos                                  || Checkbox
      noMarketingRequired : [data.noMarketingRequired ?? false],   // No se require Mercadeo                                || Checkbox
      mmClass             : [data.mmClass ?? false],               // Clasificación de Mínima Bursatilidad                  || Combobox
      highSpeedChannel    : [data.highSpeedChannel || ''],         // Canal de Alta Velocidad                               || Combobox
      stabContracts       : [data.stabContracts ?? false],         // Contratos de Estabilización                           || Checkbox
      sophisticatedClient : [data.sophisticatedClient ?? false],   // Indicar quien de los titulares es cliente sofisticado || Checkbox
      alphaInvestment     : [data.alphaInvestment ?? false],       // No. de inversión ALPHA                                || Checkbox
      // marketabilityRequirementClassification: [''],

      // Confirmaciones section
      treasuryOperations : [data.treasuryOperations ],  // Depósitos y Retiros de Tesorería || Checkbox
      capitalDeskTrading : [data.capitalDeskTrading ],  // Compra/Venta de Mesa de Capitales || Checkbox
      moneyDeskTrading   : [data.moneyDeskTrading ],    // Compra/Venta de Mesa de Dinero || Checkbox
      invFundsTrading    : [data.invFundsTrading ],     // Compra/Venta de Fondos de Inversión || Checkbox
      allConfirmations   : [data.allConfirmations],     // Selecciona Todas las Confirmaciones || Checkbox

      // PORTAFOLIO
      portfolioAdmin    : [data.portfolioAdmin],    // Cobro de Administración de Portafolios  ||  Combobox
      portfolioSafeType : [data.portfolioSafeType], // Tipo de Cobro de Administración de Portafolio  ||  Combobox
      contractOriginBank: [data.contractOriginBank],     // Origen del Contrato es Banco  ||  Optionbutton
      alphaInv          : [data.alphaInv],                // Inversión ALPHA  ||  Checkbox
      estacm            : [data.estacm || ''],            // ESTASM  ||  Checkbox
      alphaInvPortType  : [data.alphaInvPortType || ''],  // Portafolio de Inversión ALPHA  ||  Combobox
      alphaInvPromo     : [data.alphaInvPromo || ''],     // Promotor Inversión ALPHA  ||  Combobox
      pwmContract       : [data.pwmContract ],            // Contrato Private Wealth Management  ||  Checkbox
      assetManagement   : [data.assetManagement],         // Asset Management  ||  Checkbox
      pwmPortfolio      : [data.pwmPortfolio || ''],      // Portafolio Private Wealth Management  ||  Combobox
      pwmPromo          : [data.pwmPromo || ''],          // Promotor Private Wealth Management  ||  Combobox

      // CAPITALES CASA DE BOLSA
      futEligCapDesk      : [data.futEligCapDesk],             // Capitales Casa de Bolsa || Elegibilidad para Ruteo a Mesa de Capitales  ||  Checkbox
      // eligibilityDate: [data.eligibilityDate || ''],
      activationDate      : [data.activationDate || ''],       // Capitales Casa de Bolsa || Fecha de Activación  ||  Pickdate
      activationUserCode  : [data.activationUserCode || ''],   // Capitales Casa de Bolsa || Código de Usuario  ||  Textbox
      activationUserName  : [data.activationUserName || ''],   // Capitales Casa de Bolsa || Nombre de Usuario  ||  Textbox
      deactivationDate    : [data.deactivationDate || ''],     // Capitales Casa de Bolsa || Fecha de Desactivación  ||  Pickdate
      deactivationUserCode: [data.deactivationUserCode || ''], // Capitales Casa de Bolsa || Código de Usuario  ||  Textbox
      deactivationUserName: [data.deactivationUserName || ''], // Capitales Casa de Bolsa || Nombre de Usuario  ||  Textbox
      minPortException    : [data.minPortException || true],   // Capitales Casa de Bolsa || Excepción de Portafolio Mínimo  ||  Checkbox
      highVelocityTrading : [data.highVelocityTrading ],       // Capitales Casa de Bolsa || Opera con canal de Alta Velocidad  ||  Checkbox
      distributedClosed   : [data.distributedClosed || ''],    // Capitales Casa de Bolsa || Clave de Inversionista Calificado  ||  Combobox
      repoAgreementFunds  : [data.repoAgreementFunds ],        // Capitales Casa de Bolsa || Contratos de Fondos de Recompra  ||  Checkbox
      facOpsPart          : [data.facOpsPart],                 // Capitales Casa de Bolsa || Acepta participar en Operaciones de Facilitación  ||  Checkbox
      globalBdPart        : [data.globalBdPart],               // Capitales Casa de Bolsa || Participa en Desglose de Global  ||  Checkbox
      warrantOperations   : [data.warrantOperations],          // Capitales Casa de Bolsa || Opera con WARRANT  ||  Checkbox
      derivativeContracts : [data.derivativeContracts],        // Capitales Casa de Bolsa || Contrato Omnibus  ||  Checkbox
      purchPowerPos       : [data.purchPowerPos],              // Capitales Casa de Bolsa || Opera sin Poder de Compra y Posición  ||  Checkbox
      shortSalesManagement: [data.shortSalesManagement ],      // Capitales Casa de Bolsa || Maneja Ventas en Corto  ||  Checkbox
      extRepoOpsPart      : [data.extRepoOpsPart],             // Capitales Casa de Bolsa || Aceptan participar en Operaciones de Auto-Entrada  ||  Checkbox

      // CAPITALES BANCO
      operateWithWarrant  : [data.operateWithWarrant],         // Capitales Banco  ||  Opera con WARRANT  ||  Checkbox
      shortSalesMgmtAlt   : [data.shortSalesMgmtAlt],          // Capitales Banco  ||  Maneja Ventas en Corto  ||  Checkbox
      routeEligCapDesk    : [data.routeEligCapDesk],           // Capitales Banco  ||  Elegibilidad para Ruteo a Mesa de Capitales  ||  Checkbox
      validityDate        : [data.validityDate],               // Capitales Banco  ||  Fecha de Vigencia  ||  Textbox
    });
    this.form.patchValue({validityDate:data.validityDate});
    this.structuralStrategEmpty(data);

    // #region Signal Controls
    this.structuralStrategiesCtrlSgnl = toSignal(this.form.controls['structuralStrategies'].valueChanges, {
      initialValue: this.form.controls['structuralStrategies'].value
    });

    this.clientPlanCtrlSgnl = toSignal(this.form.controls['clientPlan'].valueChanges, {
      initialValue: this.form.controls['clientPlan'].value
    });

    this.creditContractCtrlSgnl = toSignal(this.form.controls['creditContract'].valueChanges, {
      initialValue: this.form.controls['creditContract'].value
    });

    this.alphaInvCtrlSgnl = toSignal(this.form.controls['alphaInv'].valueChanges, {
      initialValue: this.form.controls['alphaInv'].value
    });

    this.pwmContractCtrlSgnl = toSignal(this.form.controls['pwmContract'].valueChanges, {
      initialValue: this.form.controls['pwmContract'].value
    });

    this.futEligCapDeskCtrlSgnl = toSignal(this.form.controls['futEligCapDesk'].valueChanges, {
      initialValue: this.form.controls['futEligCapDesk'].value
    });
    // # endregion

    console.log(this.form.value);

    // merge(
    //   this.form.controls['structuralStrategies'].valueChanges.pipe(map(value => ({controls: ssControls,value}))),
    //   this.form.controls['clientPlan'].valueChanges.pipe(map(value => ({controls: cpControls,value}))),
    //   this.form.controls['creditContract'].valueChanges.pipe(map(value => ({controls: ccControls,value}))),
    //   this.form.controls['minimumMarketability'].valueChanges.pipe(map(value => ({controls: mmControls,value}))),
    //   this.form.controls['alphaInv'].valueChanges.pipe(map(value => ({controls: apControls,value}))),
    //   this.form.controls['pwmContract'].valueChanges.pipe(map(value => ({controls: pcControls,value}))),
    // ).pipe(takeUntilDestroyed()).subscribe(({value, controls}) => {
    //   console.log({value, controls});
    //   this.enableControls(value, controls);
    // });



    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(e => {
      if ( !this.form.dirty ) {
        this.unsavedChangesService.setUnsavedChanges(this.form.dirty);
      } else {
        this.unsavedChangesService.setUnsavedChanges(true);
      }
    });

    // #region REACTIVE TO SIGNALS
    // notas estructuradas
    effect(() => {
      const value = this.structuralStrategiesCtrlSgnl();
      if (!this.editMode()) return;
      this.enableControls(value, this.ssControls);
    });

    // el cliente
    effect(() => {
      const value = this.clientPlanCtrlSgnl();
      if (!this.editMode()) return;
      this.enableControls(value, this.cpControls);
    });

    // Características Generales
    effect(() => {
      // creditContract
      const value = this.creditContractCtrlSgnl();
      if (!this.editMode()) return;
      this.enableControls(value, this.ccControls);
    });

    // confirmaciones
    this.form.get('allConfirmations')?.valueChanges.pipe(takeUntilDestroyed()).subscribe(value => {
      for(const control of this.confirmControls){
        this.form.get(control)?.setValue(value);
      }
    });

    this.confirmControls.forEach((op: string) => {
      this.form.get(op)?.valueChanges.subscribe(() => {
        const allChecked = this.confirmControls.every((op: any) => this.form.get(op)?.value);
        this.form.get('allConfirmations')?.setValue(allChecked, {emitEvent: false});
      });
    });

    // portafolio => inversionALPHA y Contrato Private Wealth Management
    effect(() => {
      const value = this.alphaInvCtrlSgnl();
      if (!this.editMode()) return;
      this.enableControls(value, this.apControls);
    });

    effect(() => {
      const value = this.pwmContractCtrlSgnl();
      if (!this.editMode()) return;
      this.enableControls(value, this.pcControls);
    });

    // capitales casa de bolsa
    effect(() => {
      const value = this.futEligCapDeskCtrlSgnl();
      if (!this.editMode()) return;
      this.checkEligCapDesk(value);
    });
    // #endregion

    this.promoterAlphaFilter.valueChanges.subscribe(value => {
      const filterValue = value?.toLowerCase() || '';

      this.advisorAlpha.set(
        this.advisor().filter(item =>
          item.name.toLowerCase().includes(filterValue)
        )
      );
    });

    this.promoterPrivateFilter.valueChanges.subscribe(value => {
      const filterValue = value?.toLowerCase() || '';

      this.advisorPrivate.set(
        this.advisor().filter(item =>
          item.name.toLowerCase().includes(filterValue)
        )
      );
    });

  } // #enderegion

  // #region NgOnInit
  /**
   * Ng OnInit
   *
   */
  ngOnInit(): void {
    this.advisor.set(this.route.snapshot.data['advisorResolver']);
    this.advisorAlpha.set(this.route.snapshot.data['advisorResolver']);
    this.advisorPrivate.set(this.route.snapshot.data['advisorResolver']);
    // TODO verificar IDs / valores
    // TODO 1. aplicar regla en campo "Inversión ALPHA" | "alphaInv"
    const showAlpha: boolean = this.generalInfoContract?.contractManagement === 'DISCRECIONAL' &&
      this.generalInfoContract?.gestionType === 'ASSET MANAGEMENT';

    if ( showAlpha ) {
      this.form.controls['alphaInv'].enable();
    } else {
      this.form.controls['alphaInv'].disable();
    }

    if ( this.isMaintenance() ) {
      console.log("oninit - estoy en Mantto.");
      this.disableForm();

      // TODO verificar donde poner este llamado, debe validarse si maintenancne o no
      // this.enableControls(false, [
      //   ...this.ssControls,
      //   ...this.cpControls,
      //   ...this.ccControls,
      //   ...this.mmControls,
      //   ...this.apControls,
      //   ...this.pcControls,
      // ]);
    }
  } // #endregion

  /**
   *
   */
  checkEligCapDesk(value: boolean): void {
    let username = this.userInfo().username ?? '';
    username = username != '' ? username.split('@')[0] : '';

    if ( value ) {
      // Fecha de Activación    ===>>  if futEligCapDesk === TRUE then [activationDate] = Today() SE QUEDA REGISTRO DEL ÚLTIMO MOVIMIENTO REALIZADO
      // Código de Usuario      ===>>  if futEligCapDesk === TRUE then [activationUserCode] = "Código de Usuario" SE QUEDA REGISTRO DEL ÚLTIMO MOVIMIENTO REALIZADO
      // Nombre de Usuario      ===>>  if futEligCapDesk === TRUE then [activationUserName] = Nombre de Usuario Concatenado SE QUEDA REGISTRO DEL ÚLTIMO MOVIMIENTO REALIZADO
      this.form.get('activationDate')?.setValue(new Date());
      this.form.get('activationUserCode')?.setValue(username);
      this.form.get('activationUserName')?.setValue(this.userInfo().name ?? '');

      this.form.get('deactivationDate')?.setValue('');
      this.form.get('deactivationUserCode')?.setValue('');
      this.form.get('deactivationUserName')?.setValue('');

      this.form.get('deactivationDate')?.disable();
      this.form.get('deactivationUserCode')?.disable();
      this.form.get('deactivationUserName')?.disable();
    } else {
      // Fecha de Desactivación ===>>  if futEligCapDesk === FALSE then [deactivationDate] = Today() SE QUEDA REGISTRO DEL ÚLTIMO MOVIMIENTO REALIZADO
      // Código de Usuario      ===>>  if futEligCapDesk === FALSE then [deactivationUserCode] = "Código de Usuario" SE QUEDA REGISTRO DEL ÚLTIMO MOVIMIENTO REALIZADO
      // Nombre de Usuario      ===>>  if futEligCapDesk === FALSE then [deactivationUserName] = Nombre de Usuario Concatenado SE QUEDA REGISTRO DEL ÚLTIMO MOVIMIENTO REALIZADO
      this.form.get('deactivationDate')?.setValue(new Date());
      this.form.get('deactivationUserCode')?.setValue(username);
      this.form.get('deactivationUserName')?.setValue(this.userInfo().name ?? '');

      this.form.get('activationDate')?.setValue('');
      this.form.get('activationUserCode')?.setValue('');
      this.form.get('activationUserName')?.setValue('');

      this.form.get('activationDate')?.disable();
      this.form.get('activationUserCode')?.disable();
      this.form.get('activationUserName')?.disable();
    }
  }

  /**
   *
   */
  checkConfirmations(): void {
    const data: CheckpointDataActiweb = checkpointToActiweb(this.actiwebService.actiwebData());
    this.form.get('allConfirmations')?.setValue(data.allConfirmations, {emitEvent: false});
    for(const control of this.confirmControls){
      this.form.get(control)?.setValue((data as Record<string, any>)[control], {emitEvent: false});
    }
  }

  /**
   *
   */
  enableControls(value: boolean, controls: string[]){
      for ( const control of controls ) {
        if ( value ) {
          this.form.controls[control].enable();
          this.form.controls[control].setValidators(Validators.required);
          this.form.controls[control].updateValueAndValidity();
        } else {
          this.form.controls[control].clearValidators();
          this.form.controls[control].updateValueAndValidity();
          this.form.controls[control].setValue('');
          this.form.controls[control].disable();
        }
      }
  }

  /**
   *
   */
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

  // #region save()
  /**
   * Performs save section data.
   */
  save(): void {
    if ( this.form.valid ) {
      console.log(this.form.getRawValue());
      const body: ActiwebDataCheckpoint = actiwebToCheckpoint(this.form.getRawValue());
      console.log(body);
      this.checkpoint.saveSectionMant('actiweb', body)
      .pipe(
        concatMap(
          (res: any) => {
            console.log(res);
            if ( this.isMaintenance() ) {
              this.disableForm();
            }
            return this.checkpoint.getMaintenanceSectionByPersonaFisica(['actiweb']);
          })
      ).subscribe((response: any) => {
        this.actiwebService.setItem(response['checkpoints'][0]['data']);

        let data: CheckpointDataActiweb = checkpointToActiweb(this.actiwebService.actiwebData());
        this.manualPatchValue(data);
        this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
        this.unsavedChangesService.setUnsavedChanges(false);
      });

    } else {
      const missingRequiredFields = this.getMissingRequiredFields();
      console.log(missingRequiredFields);
      // const invalidFields = this.getInvalidFieldsExcludingRequired();

      document.body.classList.add('show-validation');
      for (const [, control] of Object.entries(this.form.controls)) {
        if (control.invalid) {
          control.markAsTouched();
        }
      }

      if ( missingRequiredFields.length > 0 ) {
        this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS);
      }

    }
  }// #endregion save()

  /**
   * Edit event triggerd by 'editar' button
   */
  edit(): void {
    this.enableForm();
  }

  /**
   * Cancel event.
   */
  cancel(): void {
    const data: CheckpointDataActiweb = checkpointToActiweb(this.actiwebService.actiwebData());
    this.form.reset(data);
    this.disableForm();
    this.unsavedChangesService.setUnsavedChanges(false);
  }

  /**
   *
   */
  enableForm(): void {
    this.form.enable({ emitEvent: false });
    this.checkValidationFields();
    this.editMode.set(true);
  }

  /**
   *
   */
  disableForm(): void {
    console.log("deshabilito form");
    this.form.disable({ emitEvent: false });
    this.editMode.set(false);
  }

  /**
   *
   */
  checkValidationFields(): void {
    this.enableControls(this.structuralStrategiesCtrlSgnl(), this.ssControls);
    this.enableControls(this.clientPlanCtrlSgnl(), this.cpControls);
    this.enableControls(this.creditContractCtrlSgnl(), this.ccControls);
    this.enableControls(this.alphaInvCtrlSgnl(), this.apControls);
    this.enableControls(this.pwmContractCtrlSgnl(), this.pcControls);
    this.checkEligCapDesk(this.futEligCapDeskCtrlSgnl());
    this.checkConfirmations();
  }

  /**
   *
   */
  manualPatchValue(data: any): void {
    console.log(data);
    this.form.patchValue(data);
    this.structuralStrategEmpty(data);
  }

  /**
   * if "Notas Estructuradas" is NOT checked.
   * User request to set subsection radio buttons to empty value.
   */
  structuralStrategEmpty(data: CheckpointDataActiweb): void {
    if ( !data.structuralStrategies ) {
      this.form.controls['range7mxn'].setValue('', {emitEvent: false});
      this.form.controls['tiie196mxn'].setValue('', {emitEvent: false});
      this.form.controls['range196mxn'].setValue('', {emitEvent: false});
      this.form.controls['range7eu'].setValue('', {emitEvent: false});
      this.form.controls['range7usd'].setValue('', {emitEvent: false});
      this.form.controls['dnt7usd'].setValue('', {emitEvent: false});
    }
  }
}


