import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnsDataTable, ConfigDataTable } from '../../../shared/components/table-results/interfaces';
import { MatSelectChange } from '@angular/material/select';
import { ModalCotitularService } from '../../../shared/services/modal-cotitular.service';
import { NotificationModalService } from '../../../shared/services/notification-modal.service';
import { CotitularInfo, cotitularInfoToTable, CotitularTableInfo } from '../../models/cotitular';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { STRINGS } from '../../constants/constants';
import { CatalogsAllowed } from '../../../shared/types/catalogs.type';
import { Countries } from '../../models/country';
import { Entity } from '../../models/entity';
import { SignStorageService } from '../../../shared/services/storage-services/sign-storage.service';
import { SingSection } from '../../models/sign-section';
import { ERROR_MESSAGES, NOTIFICATION_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { ModalAttoneryService } from '../../../shared/services/modal-attonery.service';
import { AttoneryInfo, AttoneryTableInfo, attoneryInfoToTable } from '../../models/attonery';
import { AddressesService } from '../../../shared/services/storage-services/addresses.service';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { OnboardingService } from '../../services/onboarding.service';
import { signSectionToCheckpoint } from '../../services/mappers/signature-mapper';
import { RolePermises } from '../../../core/services/matrix_role';
import { butonFunctionDis, buttonFunctionEn, formFunctionEnAll } from '../../../shared/utils/disableOrEnabled';
import { PermissionRolService } from '../../../core/services/rol.service';
import { checkpointMantToSignSection, signSectionToCheckpointMant } from '../../services/mappers/maintenance/signature-mapper-mant';
import { firstValueFrom } from 'rxjs';
import { IdentificationType } from '../../models/identification-type';
import { PhoneType } from '../../models/phone-type';
import { ZipCodeService } from '../../../shared/services/zip-code.service';

@Component({
  selector: 'app-sign',
  standalone: false,
  templateUrl: './sign.component.html',
  styleUrl: './sign.component.scss'
})
export class SignComponent implements OnInit {

  private readonly cotitularService = inject(ModalCotitularService);
  private readonly attoneryService = inject(ModalAttoneryService);
  private readonly notificationModal = inject(NotificationModalService);
  private readonly notificationService = inject(NotificationsService);
  private readonly catalogsService = inject(CatalogsService);
  private readonly signStorageService = inject(SignStorageService);
  private readonly addressStorage = inject(AddressesService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly checkpoint = inject(CheckpointService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly roleService = inject(PermissionRolService);
  private readonly zipCodeService = inject(ZipCodeService);

  phoneTypes = signal<Array<PhoneType>>([]);
  identifications = signal<Array<IdentificationType>>([]);

  private readonly fb = inject(FormBuilder);
  singCatalog: string[] = ['INDIVIDUAL', 'MANCOMUNADA', 'SOLIDARIA']

  personType: string = '';

  cotitularData = signal<CotitularTableInfo[]>([]);
  cotitularColumns: Array<ColumnsDataTable> = [];
  cotitularConfigs: ConfigDataTable = { showPag: false, showEditAction: true, showDeleteAction: true, showViewAction: false, multipleSelection: false, idName: 'cotitularNumber'};

  attoneryData = signal<AttoneryTableInfo[]>([]);
  attoneryColumns: Array<ColumnsDataTable> = [];
  attoneryConfigs: ConfigDataTable = { showPag: false, showEditAction: true, showDeleteAction: true, showViewAction: false, multipleSelection: false, idName: 'attoneryNumber' };

  text: string = '';
  selectedSignType = signal<string>('');

  cotitularDataCapturated = signal<CotitularInfo[]>([]);
  attoneryDataCapturated = signal<AttoneryInfo[]>([]);
  countries = signal<Array<Countries>>([]);
  fenderativeEntities = signal<Array<Entity>>([]);
  cotitularNumber: number = 1;
  attoneryNumber: number = 1;
  isMaintenance: boolean = false;
  readOnlyMode: boolean = false;
  rolePermises: any;
  btnAddCotitular: boolean = false;
  btnAddAttonery: boolean = false;

  form: FormGroup = this.fb.group({
    signType: ['', Validators.required],
    instructions: [''],
    titularIpabPercentaje: ['', Validators.required],
    titularIsrPecentaje: ['', Validators.required]
  });

  signPageInformation: SingSection = {
    id: null,
    signType: '',
    instructions: '',
    titularIpabPercentaje: 0,
    titularIsrPecentaje: 0,
    cotitularList: [],
    cotitularTableList: [],
    attoneryList: [],
    attoneryTableList: []
  };
  private signPageTrigger = signal(0);

  constructor() {
    effect(() => {
      this.signPageTrigger(); 

      const current = this.signPageInformation;
      const initial = this.signStorageService.singSectionSignal();
      console.log(current)
      console.log(initial)
      if (initial != null) {
        const changed = JSON.stringify(current) !== JSON.stringify(initial);
        console.log('diry contruct')
        this.unsavedChangesService.setUnsavedChanges(changed);
      }
    });
  }
  ngOnInit() {

    this.cotitularColumns = [
      { name: 'cotitularNumber', title: 'Registro No.', show: true, type: 'string' },
      { name: 'clientNumber', title: 'No. de Cliente', show: true, type: 'string' },
      { name: 'rfc', title: 'RFC/NIF/TIN/NSS', show: true, type: 'string' },
      { name: 'domicile', title: 'Domicilio de Residencia', show: true, type: 'string' },
      { name: 'contact', title: 'Contacto', show: true, type: 'string' },
      { name: 'ipabPercentage', title: '% IPAB', show: true, type: 'string' },
      { name: 'isrPercentage', title: '% ISR', show: true, type: 'string' },
    ]

    this.attoneryColumns = [
      { name: 'attoneryNumber', title: 'Registro No.', show: true, type: 'string' },
      { name: 'clientNumber', title: 'No. de Cliente', show: true, type: 'string' },
      { name: 'rfc', title: 'RFC/NIF/TIN/NSS', show: true, type: 'string' },
      { name: 'domicile', title: 'Domicilio de Residencia', show: true, type: 'string' },
      { name: 'ppe', title: 'Persona Políticamente Expuesta', show: true, type: 'string' }
    ]

    this.personType = this.onboardingService.currentInfo().personType;
    this.isMaintenance = this.onboardingService.getCurrentInfo().isMaintenance;

    console.log(this.personType)

    if (this.personType == 'PM') {
      this.form.get('titularIpabPercentaje')?.clearValidators();
      this.form.get('titularIsrPecentaje')?.clearValidators();
      this.form.get('titularIpabPercentaje')?.updateValueAndValidity();
      this.form.get('titularIsrPecentaje')?.updateValueAndValidity();
    }
    this.form.valueChanges.subscribe(() => {
      console.log('dirty form ' + this.form.dirty);
      this.unsavedChangesService.setUnsavedChanges(this.form.dirty);
    });

    this.catalogsService.getCountry({ land: [] }).subscribe(c => {
      this.countries.set(c);
    });

    this.catalogsService.getFederalEntity({ land1s: ["MX"] }).subscribe(c => {
      this.fenderativeEntities.set(c);
    });
    this.catalogsService.getPhoneType({ telephoneTypeIds: [] }).subscribe(c => {
      this.phoneTypes.set(c);
    });
    this.catalogsService.getIdentificationType({ types: [] }).subscribe(c => {
      this.identifications.set(c);
    });


    const infoStorage = this.signStorageService.singSectionSignal()
    console.log('loading')
    console.log(infoStorage)
    if (infoStorage) {
      this.loadInitialInfo(infoStorage);
    }
  }

  ngAfterViewInit() {
    if (this.isMaintenance) {
      this.rolePermises = this.roleService.getPermissions();
      if (this.rolePermises?.['sign']?.fieldsDisabled?.includes('signType')) {
        this.form.get('signType')?.disable({ emitEvent: false });
      }
      let isNotEditable = null;
      if (this.personType === 'PM') {
        isNotEditable = this.rolePermises['sign-pm'].allDisabled
      } else {
        isNotEditable = this.rolePermises['sign'].allDisabled
      }
      console.log({ isNotEditable })
      if (isNotEditable) {
        butonFunctionDis(['btnEditSign']);
      } else {
        buttonFunctionEn(['btnEditSign']);
      }
      butonFunctionDis(['btnSaveSign', 'btnCancelSign', 'btnAddCotitular', 'btnAddAttonery']);
      this.btnAddCotitular = true;
      this.btnAddAttonery = true;

      this.form.disable({ emitEvent: false });
      this.form.updateValueAndValidity({ onlySelf: false, emitEvent: false });
      this.cotitularConfigs = { showPag: false, showEditAction: true, showDeleteAction: false, showViewAction: false, multipleSelection: false, idName: 'cotitularNumber' };
      this.attoneryConfigs = { showPag: false, showEditAction: true, showDeleteAction: false, showViewAction: false, multipleSelection: false, idName: 'attoneryNumber' };
      this.readOnlyMode = true;
      this.rolePermises = this.roleService.getPermissions();

    }
  }


  async onSingTypeChange(event: MatSelectChange) {
    const initial = this.selectedSignType();
    let responseSign: { value: boolean; message?: string } | undefined;
    console.log(initial)
    console.log(event.value)
    if (initial == '' && event.value == 'INDIVIDUAL') {
      this.form.patchValue({
        titularIpabPercentaje: 100,
        titularIsrPecentaje: 100,
      })
    }
    if (this.signPageInformation.signType != 'INDIVIDUAL' && this.signPageInformation.signType != '' && event.value == 'INDIVIDUAL') {
      responseSign = await this.notificationModal.confirm({
        title: 'Está seguro que desea proceder con el cambio?',
        beforeMessages: ['Se Eliminarán a los Cotitulares dado que ya no es Aplicable para un Contrato con Firma Individual.'],
        btnAccept: 'Aceptar',
        btnDeny: 'Cancelar'
      })
    } else if (this.signPageInformation.signType != 'INDIVIDUAL' || initial == 'INDIVIDUAL') {
      responseSign = { value: true, message: 'NA' }
    }
    if (responseSign?.value) {
      if (responseSign.message) {
        console.log('cambiando de firma sin borrar')
        this.selectedSignType.set(event.value);
        this.signPageInformation.signType = this.selectedSignType();
      } else {
        console.log('cambiando de firma borrando')
        this.selectedSignType.set(event.value);
        this.signPageInformation.signType = this.selectedSignType();
        this.cotitularDataCapturated.set([]);
        this.cotitularData.set([]);
        this.signPageInformation.cotitularList = this.cotitularDataCapturated();
        this.signPageInformation.cotitularTableList = this.cotitularData();
        this.form.patchValue({
          titularIpabPercentaje: 100,
          titularIsrPecentaje: 100,
        })
      }
    } else {
      console.log('No se cambia de firma')
      this.selectedSignType.set(initial);
      this.form.patchValue({
        signType: initial
      })
    }
    if (event.value != 'MANCOMUNADA') {
      this.form.get('instructions')?.clearValidators();
      this.form.get('instructions')?.updateValueAndValidity();
    } else {
      this.form.get('instructions')?.setValidators(Validators.required);
      this.form.get('instructions')?.updateValueAndValidity();
    }


  }



  save() {

    console.log('save')
    if (this.form.invalid) {
      if (this.form.disabled && !this.form.errors) {
        console.log('prosigue')
      } else {
        document.body.classList.add('show-validation');
        Object.values(this.form.controls).forEach(control => {
          if (control.invalid) {
            control.markAsTouched();
          }
        });
        this.notificationService.error(ERROR_MESSAGES.MISSING_INFO)
        return
      }
    }

    const message = this.validateDataContent(this.selectedSignType())
    if (message[0] != '') {
      this.notificationService.error(message[0], message[1]);
      return;
    }

    this.signPageInformation.signType = this.form.getRawValue().signType
    this.signPageInformation.instructions = this.form.getRawValue().instructions
    this.signPageInformation.titularIpabPercentaje = this.form.getRawValue().titularIpabPercentaje
    this.signPageInformation.titularIsrPecentaje = this.form.getRawValue().titularIsrPecentaje

    console.log(this.signPageInformation)

    if (!this.isMaintenance) {
      this.checkpoint.saveSection('signature', signSectionToCheckpoint(this.signPageInformation)).subscribe({
        next: (i) => {
          console.log(i);
          if (i.status !== 'CREATED') {
            console.log(i.status)
          } else {
            this.unsavedChangesService.setUnsavedChanges(false)
            this.signStorageService.setSingSection(this.signPageInformation);
            this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
          }

        },
        error: (err) => {
          console.error(err);
        }
      })
    } else {
      this.checkpoint.saveSectionMant('signature', signSectionToCheckpointMant(this.signPageInformation)).subscribe({
        next: async (i) => {
          console.log(i);
          if (i.status !== 'CREATED') {
            console.log(i.status)
          } else {
            await this.update();
            this.unsavedChangesService.setUnsavedChanges(false)
            this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
          }

        },
        error: (err) => {
          console.error(err);
        }
      })
    }

  }

  async update(){
    const response = await firstValueFrom(this.checkpoint.getMaintenanceSectionByPersonaFisica(['signature']));
    const info = await checkpointMantToSignSection(response['checkpoints'][0]['data'], this.phoneTypes(), this.countries(), this.identifications(), this.zipCodeService);
    this.signStorageService.setSingSection(info);
    const infoStorage = this.signStorageService.singSectionSignal()
    if (infoStorage) {
      this.loadEmptyInfo();
      this.loadInitialInfo(infoStorage);
    }
  }

  validateDataContent(selected: string): string[] {
    if (selected == 'INDIVIDUAL' && this.signPageInformation.attoneryList.filter(a => a.active).length > 1 && this.signPageInformation.attoneryList.some(a => a.active)) {
      return ['Solo Puede Registrar un Apoderado'];
    }

    if (this.personType == 'PF') {
      return this.validatePf(selected);
    }
    if (this.personType == 'PM') {
      return this.validatePm(selected);
    }
    return ['']
  }

  validatePm(selected: string): string[] {
    if (this.personType == 'PM') {
      if (selected != 'INDIVIDUAL' &&
        (this.signPageInformation.attoneryList.length < 2)) {
        return ['Debe Registar al Menos dos Apoderados']
      }
      if (selected == 'INDIVIDUAL' && this.signPageInformation.attoneryList.length == 0) {
        return ['Debe Registrar un Apoderado'];
      }
    }
    return [''];
  }

  private toSafeNumber(value: any, field: string): number {
    const n = Number(value);

    if (Number.isNaN(n)) {
      console.warn('[validatePf][NaN detectado]', {
        field,
        value,
        formValue: this.form?.value
      });
      return 0;
    }

    return n;
  }

  validatePf(selected: string): string[] {
    if (selected != 'INDIVIDUAL' && this.signPageInformation.cotitularList.length < 1) {
      console.warn('[validatePf] No hay cotitulares', {
        selected,
        cotitularListLength: this.signPageInformation?.cotitularList?.length
      });
      return ['Debe Registar al Menos un Cotitular'];
    }

    const infoCot: CotitularInfo[] = this.cotitularDataCapturated().filter(item => item.active === true);

    console.log('[validatePf][snapshot]', {
      selected,
      formValue: this.form?.value,
      infoCot
    });

    const sumaCotIbap = infoCot.reduce(
      (acc, item, index) => acc + this.toSafeNumber(item.taxSection?.ipabTitularityPercent ?? 0, `infoCot[${index}].ipabTitularityPercent`),
      0
    );

    const sumaCotIsr = infoCot.reduce(
      (acc, item, index) => acc + this.toSafeNumber(item.taxSection?.retentionIsr ?? 0, `infoCot[${index}].retentionIsr`),
      0
    );

    const ipabTotal = sumaCotIbap + this.toSafeNumber(this.form.value.titularIpabPercentaje, 'form.titularIpabPercentaje');
    const isrTotal = sumaCotIsr + this.toSafeNumber(this.form.value.titularIsrPecentaje, 'form.titularIsrPecentaje');

    console.log('[validatePf][totales]', {
      sumaCotIbap,
      sumaCotIsr,
      ipabTotal,
      isrTotal
    });

    if (ipabTotal != 100) {
      const ibapMissing = Number((100 - ipabTotal).toFixed(2));

      console.warn('[validatePf] IPAB inválido', {
        ipabTotal,
        ibapMissing
      });

      return [
        'El porcentaje total de Titularidad en IPAB debe ser igual al 100%',
        'Completa el ' + ibapMissing + '% Faltante de Participación'
      ];
    }

    if (selected == 'SOLIDARIA') {

      const requiredIpabCot = Math.floor(100 / (infoCot.length + 1));
      const requiredIpabTit = requiredIpabCot + (100 - requiredIpabCot * (infoCot.length + 1));

      const valitatedCot = requiredIpabCot && infoCot.every((item, index) =>
        this.toSafeNumber(item.taxSection?.ipabTitularityPercent ?? 0, `infoCot[${index}].ipabTitularityPercent`) === requiredIpabCot
      );

      console.log('[validatePf][SOLIDARIA]', {
        requiredIpabCot,
        requiredIpabTit,
        valitatedCot
      });

      if (!valitatedCot) {
        return [
          'Para Firma Solidaria los Porcentajes de Titularidad IPAB deben ser Proporcionales',
          'Debe Registrarse un ' + requiredIpabTit + '% para el Titular y un ' + requiredIpabCot + '% Para cada Cotitular'
        ];
      }
    }

    if (isrTotal != 100) {
      const isrMissing = Number((100 - isrTotal).toFixed(2));

      console.warn('[validatePf] ISR inválido', {
        isrTotal,
        isrMissing
      });

      return [
        'El porcentaje total de Titularidad en ISR debe ser igual al 100%',
        'Completa el ' + isrMissing + '% Faltante de Participación'
      ];
    }

    return [''];
  }

  async showCotitularModal() {

    const hasClientNumber = await this.notificationModal.success({
      title: 'Desea Continuar Captura de Cotitular',
      btnAccept: 'Con No. de Cliente',
      ...(!this.isMaintenance ? { btnDeny: 'Sin No. de Cliente' }: {})
    })

    console.log({hasClientNumber})
    if (hasClientNumber?.value === undefined) {
      return;
    }
    console.log(this.addressStorage.get())
    console.log(this.addressStorage.get()?.addressList)
    const capturedAddress = this.addressStorage.get()?.addressList.filter(re => re.addressRole === '5')[0];
    console.log({ capturedAddress })

    let content: CotitularInfo | undefined = undefined;

    if (capturedAddress) {
      content = {
        active: true,
        personId: null,
        coHolderId: null,
        address: capturedAddress,
        autoSign: null,
        ppeInfo: null,
        identifications: [],
        manifestLetter: false,
        phones: [],
        mails: [],
      }
    }


    var permieses = {}
    if (this.isMaintenance) {
      if (this.personType == 'PM') {
        permieses = this.rolePermises['sign-pm']['sections']['cotitular-modal']['sections']
      } else {
        permieses = this.rolePermises['sign']['sections']['cotitular-modal']['sections']
      }
      console.log({ permieses })
    }
    let newItem: CotitularInfo | undefined;

    if (!hasClientNumber?.value) {
      newItem = await this.cotitularService.cotitularWithoutClientNumber(this.cotitularNumber, this.selectedSignType(), this.readOnlyMode, this.isMaintenance, content, permieses);
    }

    if (hasClientNumber?.value) {
      newItem = await this.cotitularService.cotitularWithClientNumber(this.cotitularNumber, this.selectedSignType(), this.readOnlyMode, this.isMaintenance, content, permieses);
    }

    if (newItem) {
      this.cotitularDataCapturated.update((list => [...list, newItem]))

      const newLine = cotitularInfoToTable(newItem, (newItem?.address?.federalEntity ?? 'N/A')
        + ", " + (this.countries().find(c => c.countryId === (newItem?.address?.country ?? ''))?.country ?? 'N/A'));

      this.cotitularData.update((list => [...list, newLine]))
      this.cotitularNumber++;

      this.signPageInformation.cotitularList = this.cotitularDataCapturated();
      this.signPageInformation.cotitularTableList = this.cotitularData();
      this.notificationService.success(SUCCESS_MESSAGES.SAVE_COTITULAR)
      this.signPageTrigger.update(v => v + 1);
    }
  }

  async showAttoneryModal() {
    console.log('Apoderado')

    const hasClientNumber = await this.notificationModal.success({
      title: 'Desea Continuar Captura de Apoderado',
      btnAccept: 'Con No. de Cliente',
      ...(!this.isMaintenance ? { btnDeny: 'Sin No. de Cliente' }: {})
    });

    if (hasClientNumber?.value === undefined) {
      return;
    }

    let newItem: AttoneryInfo | undefined;
    var permieses = {}
    if (this.isMaintenance) {
      if (this.personType == 'PM') {
        permieses = this.rolePermises['sign-pm']['sections']['attonery-modal']['sections']
      } else {
        permieses = this.rolePermises['sign']['sections']['attonery-modal']['sections']
      } console.log({ permieses })
    }

    if (!hasClientNumber?.value) {
      newItem = await this.attoneryService.addAttoneryWithoutClientNumber(this.attoneryNumber, this.selectedSignType(), this.readOnlyMode, this.isMaintenance, undefined, permieses);
    }
    if (hasClientNumber?.value) {
      newItem = await this.attoneryService.addAttoneryWithClientNumber(this.attoneryNumber, this.selectedSignType(), this.readOnlyMode, this.isMaintenance, undefined, permieses);
    }

    if (newItem) {
      this.attoneryDataCapturated.update((list => [...list, newItem]))
      const newLine = attoneryInfoToTable(newItem, (newItem?.address?.federalEntity ?? 'N/A')
        + ", " + (this.countries().find(c => c.countryId === (newItem?.address?.country ?? ''))?.country ?? 'N/A'))
      this.attoneryData.update((list => [...list, newLine]))
      this.attoneryNumber++;
      this.signPageInformation.attoneryList = this.attoneryDataCapturated();
      this.signPageInformation.attoneryTableList = this.attoneryData();
      this.notificationService.success(SUCCESS_MESSAGES.SAVE_ATTONERY)
      this.signPageTrigger.update(v => v + 1);
    }
  }

  async eventRowCotitular(event: any): Promise<void> {
    if (event.type === 'edit') {
      await this.editCotitular(event);
    }
    if (event.type === 'delete') {
      await this.deleteCotitular(event);
    }
  }

  async eventRowAttonery(event: any): Promise<void> {
    if (event.type === 'edit') {
      await this.editAttonery(event);
    }
    if (event.type === 'delete') {
      await this.deleteAttonery(event);
    }
  }

  async editCotitular(event: any) {
    const itemToEdit = event.row
    const cotitularInfoToEdit = this.cotitularDataCapturated().filter(item => item.cotitularId == itemToEdit.cotitularId);
    let editedItem: CotitularInfo | undefined;

    var permieses = {}
    if (this.isMaintenance) {
      if (this.personType == 'PM') {
        permieses = this.rolePermises['sign-pm']['sections']['cotitular-modal']['sections']
      } else {
        permieses = this.rolePermises['sign']['sections']['cotitular-modal']['sections']
      }
      console.log({ permieses })
    }
    if (itemToEdit.clientNumber && itemToEdit.clientNumber != '-') {
      editedItem = await this.cotitularService.cotitularWithClientNumber(itemToEdit.cotitularNumber, this.selectedSignType(), this.readOnlyMode, this.isMaintenance, cotitularInfoToEdit[0], permieses);
    } else {
      editedItem = await this.cotitularService.cotitularWithoutClientNumber(itemToEdit.cotitularNumber, this.selectedSignType(), this.readOnlyMode, this.isMaintenance, cotitularInfoToEdit[0], permieses);
    }

    if (editedItem) {
      this.cotitularDataCapturated.update(list =>
        list.map(item =>
          item.cotitularId === editedItem.cotitularId ? editedItem : item
        )
      );
      const editeItemline = cotitularInfoToTable(editedItem, (editedItem?.address?.federalEntity ?? 'N/A')
        + ", " + (this.countries().find(c => c.countryId === (editedItem?.address?.country ?? ''))?.country ?? 'N/A'));

      this.cotitularData.update(list => list.map(item => item.cotitularId === editeItemline.cotitularId ? editeItemline : item));
      this.signPageInformation.cotitularList = this.cotitularDataCapturated();
      this.signPageInformation.cotitularTableList = this.cotitularData();
      this.notificationService.success(SUCCESS_MESSAGES.SUCCESSFUL_UPDATE);
      this.signPageTrigger.update(v => v + 1);
    }
  }

  async editAttonery(event: any) {
    const itemToEdit = event.row
    const attoneryInfoToEdit = this.attoneryDataCapturated().filter(item => item.attoneryId == itemToEdit.attoneryId)
    let editedItem: AttoneryInfo | undefined;

    var permieses = {}
    if (this.isMaintenance) {
      if (this.personType == 'PM') {
        permieses = this.rolePermises['sign-pm']['sections']['attonery-modal']['sections']
      } else {
        permieses = this.rolePermises['sign']['sections']['attonery-modal']['sections']
      }

      console.log({ permieses })
    }
    if (itemToEdit.clientNumber && itemToEdit.clientNumber != '-') {
      editedItem = await this.attoneryService.addAttoneryWithClientNumber(itemToEdit.attoneryNumber, this.selectedSignType(), this.readOnlyMode, this.isMaintenance, attoneryInfoToEdit[0], permieses);
    } else {
      editedItem = await this.attoneryService.addAttoneryWithoutClientNumber(itemToEdit.attoneryNumber, this.selectedSignType(), this.readOnlyMode, this.isMaintenance, attoneryInfoToEdit[0], permieses);
    }

    if (editedItem) {
      this.attoneryDataCapturated.update(list =>
        list.map(item =>
          item.attoneryId === editedItem.attoneryId ? editedItem : item
        )
      );
      const editedItemLine = attoneryInfoToTable(editedItem, (editedItem?.address?.federalEntity ?? 'N/A')
        + ", " + (this.countries().find(c => c.countryId === (editedItem?.address?.country ?? ''))?.country ?? 'N/A'))
      this.attoneryData.update(list => list.map(item => item.attoneryId === editedItemLine.attoneryId ? editedItemLine : item));
      this.signPageInformation.attoneryList = this.attoneryDataCapturated();
      this.signPageInformation.attoneryTableList = this.attoneryData();
      this.notificationService.success(SUCCESS_MESSAGES.SUCCESSFUL_UPDATE);
      this.signPageTrigger.update(v => v + 1);
    }
  }

  async deleteCotitular(event: any) {
    const result = await this.notificationModal.confirm({
      title: NOTIFICATION_MESSAGES.DELETE_CONFIRMATION_MESSAGE,
      btnAccept: 'Sí, Eliminar',
      btnDeny: 'No',
    });
    if (result?.value === true) {
      const itemToDelete = event.row
      this.cotitularData.update(list =>
        list.map(item =>
          item.cotitularNumber === itemToDelete.cotitularNumber
            ? { ...item, active: false }
            : item
        )
      );
      this.cotitularDataCapturated.update(list =>
        list.map(item =>
          item.cotitularNumber === itemToDelete.cotitularNumber
            ? { ...item, active: false }
            : item
        )
      );

      this.signPageInformation.cotitularList = this.cotitularDataCapturated();
      this.signPageInformation.cotitularTableList = this.cotitularData();

      this.notificationService.success(SUCCESS_MESSAGES.DELETE_COTITULAR)
      this.signPageTrigger.update(v => v + 1);
    }
  }

  async deleteAttonery(event: any) {
    const result = await this.notificationModal.confirm({
      title: NOTIFICATION_MESSAGES.DELETE_CONFIRMATION_MESSAGE,
      btnAccept: 'Sí, Eliminar',
      btnDeny: 'No',
    });
    if (result?.value === true) {
      const itemToDelete = event.row

      this.attoneryData.update(list =>
        list.map(item =>
          item.attoneryId === itemToDelete.attoneryId
            ? { ...item, active: false }
            : item
        )
      );
      this.attoneryDataCapturated.update(list =>
        list.map(item =>
          item.attoneryId === itemToDelete.attoneryId
            ? { ...item, active: false }
            : item
        )
      );

      this.signPageInformation.attoneryList = this.attoneryDataCapturated();
      this.signPageInformation.attoneryTableList = this.attoneryData();

      this.notificationService.success(
        SUCCESS_MESSAGES.DELETE_ATTONERY)
      this.signPageTrigger.update(v => v + 1);
    }
  }

  onlyNumbers(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/\D/g, '');
    if (cleaned !== input.value) {
      input.value = cleaned;
    }
  }


  editt() {
    if(this.rolePermises['sign']['sections']['attonery-modal']['buttonsDisabled'].length === 0){
      buttonFunctionEn(['btnAddAttonery']);
      this.btnAddAttonery = false;
      this.attoneryConfigs = { showPag: false, showEditAction: true, showDeleteAction: true, showViewAction: false, multipleSelection: false, idName: 'attoneryNumber' };
    }
    if(this.rolePermises['sign']['sections']['cotitular-modal']['buttonsDisabled'].length === 0){
      buttonFunctionEn(['btnAddCotitular']);
      this.btnAddCotitular = false;
      this.cotitularConfigs = { showPag: false, showEditAction: true, showDeleteAction: true, showViewAction: false, multipleSelection: false, idName: 'cotitularNumber' };
    }
    if(this.rolePermises['sign']['sections']['attonery-modal']['delete'] === true){
      this.attoneryConfigs = { showPag: false, showEditAction: true, showDeleteAction: true, showViewAction: false, multipleSelection: false, idName: 'attoneryNumber' };
    }
    if(this.rolePermises['sign']['sections']['cotitular-modal']['delete'] === true){
      this.cotitularConfigs = { showPag: false, showEditAction: true, showDeleteAction: true, showViewAction: false, multipleSelection: false, idName: 'cotitularNumber' };
    }
    butonFunctionDis(['btnEditSign']);
    buttonFunctionEn(['btnSaveSign', 'btnCancelSign']);
    this.readOnlyMode = false;
    // this.form.enable({ emitEvent: false });
    formFunctionEnAll(this.form, this.rolePermises['sign']['fieldsDisabled'])
  }

  cancel() {
    this.cotitularConfigs = { showPag: false, showEditAction: true, showDeleteAction: false, showViewAction: false, multipleSelection: false, idName: 'cotitularNumber' };
    this.attoneryConfigs = { showPag: false, showEditAction: true, showDeleteAction: false, showViewAction: false, multipleSelection: false, idName: 'attoneryNumber' };
    buttonFunctionEn(['btnEditSign']);
    butonFunctionDis(['btnSaveSign', 'btnCancelSign', 'btnAddCotitular', 'btnAddAttonery']);
    this.btnAddAttonery = true;
    this.btnAddCotitular = true;
    this.form.disable({ emitEvent: false });
    this.form.updateValueAndValidity({ onlySelf: false, emitEvent: false });
    const infoStorage = this.signStorageService.singSectionSignal()
    console.log('canceling')
    console.log(infoStorage)
    if (infoStorage) {
      this.loadInitialInfo(infoStorage);
    } else {
      this.loadEmptyInfo();
    }
    this.readOnlyMode = true;
  }

  loadInitialInfo(infoStorage: SingSection) {
    this.signPageInformation.id = infoStorage.id,
    this.signPageInformation.signType = infoStorage.signType;
    this.signPageInformation.cotitularList = [...infoStorage.cotitularList];
    this.signPageInformation.cotitularTableList = [...infoStorage.cotitularTableList];
    this.signPageInformation.attoneryList = [...infoStorage.attoneryList];
    this.signPageInformation.attoneryTableList = [...infoStorage.attoneryTableList];
    this.signPageInformation.instructions = infoStorage.instructions;
    this.signPageInformation.titularIpabPercentaje = infoStorage.titularIpabPercentaje;
    this.signPageInformation.titularIsrPecentaje = infoStorage.titularIsrPecentaje;

    this.selectedSignType.set(this.signPageInformation.signType);
    this.cotitularDataCapturated.set(this.signPageInformation.cotitularList);
    this.cotitularData.set(this.signPageInformation.cotitularTableList);
    this.attoneryDataCapturated.set(this.signPageInformation.attoneryList);
    this.attoneryData.set(this.signPageInformation.attoneryTableList);

    const maxId = Math.max(
      0,
      ...this.signPageInformation.cotitularTableList.map(obj => Number(obj.cotitularNumber)).filter(Number.isFinite)
    );
    this.cotitularNumber = maxId + 1;
    console.log(maxId)

    const maxId2 = Math.max(
      0,
      ...this.signPageInformation.attoneryList
        .map(obj => Number(obj.attoneryNumber))
        .filter(Number.isFinite)
    );
    this.attoneryNumber = maxId2 + 1;
    console.log(maxId2)
    this.form.patchValue({
      signType: this.signPageInformation.signType,
      instructions: this.signPageInformation.instructions,
      titularIpabPercentaje: this.signPageInformation.titularIpabPercentaje,
      titularIsrPecentaje: this.signPageInformation.titularIsrPecentaje,
    })
  }

  loadEmptyInfo() {
    this.signPageInformation.signType = '';
    this.signPageInformation.cotitularList = [];
    this.signPageInformation.cotitularTableList = [];
    this.signPageInformation.attoneryList = [];
    this.signPageInformation.attoneryTableList = [];
    this.signPageInformation.instructions = '';
    this.signPageInformation.titularIpabPercentaje = 0;
    this.signPageInformation.titularIsrPecentaje = 0;

    this.selectedSignType.set(this.signPageInformation.signType);
    this.cotitularDataCapturated.set(this.signPageInformation.cotitularList);
    this.cotitularData.set(this.signPageInformation.cotitularTableList);
    this.attoneryDataCapturated.set(this.signPageInformation.attoneryList);
    this.attoneryData.set(this.signPageInformation.attoneryTableList);

    this.form.patchValue({
      signType: this.signPageInformation.signType,
      instructions: this.signPageInformation.instructions,
      titularIpabPercentaje: '',
      titularIsrPecentaje: '',
    })
  }
}
