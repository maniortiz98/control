import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdentificationItem } from '../../../../onboarding/models/identification-item';
import { NotificationsService } from '../../../services/notifications.service';
import { NotificationModalService } from '../../../services/notification-modal.service';
import { Countries } from '../../../../onboarding/models/country';
import { IdentificationType } from '../../../../onboarding/models/identification-type';
import { CatalogsService } from '../../../services/catalogs.service';
import { MatSelectChange } from '@angular/material/select';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { ERROR_MESSAGES } from '../../../../onboarding/constants/form-messages';
import { ColumnsDataTable, ConfigDataTable } from '../../table-results/interfaces';
import moment from 'moment';
import { convertDate, convertDateBack } from '../../../utils/datetime';
import { RolePermises } from '../../../../core/services/matrix_role';



@Component({
  selector: 'app-identification-section',
  standalone: false,
  templateUrl: './identification-section.component.html',
  styleUrl: './identification-section.component.css'
})


export class IdentificationSectionComponent implements OnInit {

  identificationSaved = input<IdentificationItem[]>([]);
  rolePermises = input<RolePermises | null>()

  private readonly roleDefault: RolePermises = {
    hide: false,
    "allDisabled": false,
    "fieldsDisabled": [],
    "buttonsDisabled": []
  };

  rolePermisesUse = computed(() => this.rolePermises() ?? this.roleDefault);

  unsavedState = signal<boolean>(false);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly fb = inject(FormBuilder);
  private readonly notificationModalService = inject(NotificationModalService)
  private readonly catalogsService = inject(CatalogsService);
  expDateValidate: string[] = ['000003', '000005', '000006', '000007'];

  identificationList = signal<IdentificationItem[]>([]);
  identificationColumns: Array<ColumnsDataTable> = [];
  identificationConfigs: ConfigDataTable = { showPag: false, showEditAction: true, showDeleteAction: true, showViewAction: false, multipleSelection: false, idName: 'id' };
  cantSave: boolean = false;

  today: string = '';
  countries = signal<Array<Countries>>([]);
  identificationTypes = signal<Array<IdentificationType>>([]);

  constructor(
    private readonly notificationService: NotificationsService,
  ) {
    effect(() => {
      this.unsavedChangesService.setUnsavedChanges(this.unsavedState());
    });

    effect(() => {
      if (this.rolePermisesUse().allDisabled) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    })
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      this.unsavedChangesService.setUnsavedChanges(this.form.dirty);
    });

    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear();
    this.today = `${year}-${month}-${day}`;

    this.catalogsService.getCountry({ land: [] }).subscribe(c => {
      this.countries.set(c);
    });
    this.catalogsService.getIdentificationType({ types: [] }).subscribe(c => {
      this.identificationTypes.set(c);
    });

    const storedItems = this.identificationSaved();
    if (storedItems) {
      this.identificationList.set(storedItems);
    }

    this.identificationColumns = [
      { name: 'identificationCountry', title: 'País Emisor de la Identificación', show: true, type: 'string' },
      { name: 'identificationType', title: 'Tipo de Identificación', show: true, type: 'string' },
      { name: 'identificationNumber', title: 'Número de Identificación', show: true, type: 'string' },
      { name: 'identificationExpDate', title: 'Fecha de Vencimiento', show: true, type: 'string' }
    ]

    if (this.rolePermisesUse().allDisabled || this.rolePermisesUse().buttonsDisabled.some(p => ['edit', 'save'].includes(p))) {
      this.cantSave = true;
    }

  }

  setData(storedItems: IdentificationItem[]){
    if (storedItems) {
      this.identificationList.set(storedItems);
    }
  }

  ngOnChanges() {
    const allDisabled = this.rolePermisesUse().allDisabled;
    const disabledButtons = this.rolePermisesUse()?.buttonsDisabled ?? [];

    const edit = !allDisabled && !disabledButtons.includes('edit');
    const del = !allDisabled && !disabledButtons.includes('delete');
    console.log(this.rolePermises()?.buttonsDisabled)
    console.log({ edit });
    console.log({ del });
    this.identificationConfigs = {
      ...this.identificationConfigs,
      showEditAction: edit,
      showDeleteAction: del
    };
    this.cantSave = allDisabled || disabledButtons.includes('save')
  }

  showInput = input.required<boolean>();
  showTable = input.required<boolean>();

  form: FormGroup = this.fb.group({
    identificationCountry: ['', Validators.required],
    identificationType: ['', Validators.required],
    identificationNumber: ['', Validators.required],
    identificationExpDate: ['', [Validators.required]]
  });

  editingId: string | number | null = null;

  onSubmit(): void {
    if (this.form.valid) {
      const expDate = this.validateExpirationDate(this.form.value);
      if (!expDate) {
        this.notificationService.error(
          'La Fecha de Vencimiento debe ser último día del año al que corresponda la vigencia',
          'Ingresa el último día del año indicado en el INE'
        );
        return;
      }

      const formatedDate = convertDate(this.form.value.identificationExpDate);
      const type = this.identificationTypes().find(item => item.type === this.form.value.identificationType)?.text ?? '';
      const country = this.countries().find(item => item.countryId === this.form.value.identificationCountry)?.country ?? '';

      if (this.editingId) {
        const result = this.expDateValidate.includes(this.identificationTypes()
          .find(item => item.type === this.form.value.identificationType)?.type ?? '');

        if (!result) {
          if (this.isEditingIndentificationDuplicated()) {
            this.notificationService.error(ERROR_MESSAGES.IDENTIFICATION_ALREADY_EXIST);
            return;
          }
          this.identificationList.update(list =>
            list.map(item =>
              item.id === this.editingId ? {
                ...item, ...this.form.value,
                identificationExpDate: '',
                identificationType: type,
                identificationCountry: country,
                identificationTypeId: this.form.value.identificationType,
                identificationCountryId: this.form.value.identificationCountry,
                active: true
              } : item
            )
          );
          if(this.rolePermises()?.buttonsDisabled.includes('save')){
            this.cantSave = true;
          }
        } else {
          if (this.isEditingIndentificationDuplicated()) {
            this.notificationService.error(ERROR_MESSAGES.IDENTIFICATION_ALREADY_EXIST);
            return;
          }

          this.identificationList.update(list =>
            list.map(item =>
              item.id === this.editingId ? {
                ...item, ...this.form.value,
                identificationExpDate: formatedDate,
                identificationType: type,
                identificationCountry: country,
                identificationTypeId: this.form.value.identificationType,
                identificationCountryId: this.form.value.identificationCountry,
                active: true
              } : item
            )
          );
        }
        this.notificationService.success(
          '¡Identificación Actualizada con Éxito!',
          'Se actualizó la Identificación ' + type
        );
        this.unsavedState.set(true);
        this.resetForm();
        return;
      }

      const newItem: IdentificationItem = {
        ...this.form.value,
        id: crypto.randomUUID(),
        identificationExpDate: formatedDate,
        identificationType: type,
        identificationTypeId: this.form.value.identificationType,
        identificationCountry: country,
        identificationCountryId: this.form.value.identificationCountry,
        active: true
      };
      const exist = this.identificationList().some(i => {
        return (
          i.identificationCountryId === newItem.identificationCountryId &&
          i.identificationTypeId === newItem.identificationTypeId &&
          (i.identificationExpDate ? i.identificationExpDate : '')=== newItem.identificationExpDate &&
          i.identificationNumber === newItem.identificationNumber &&
          i.active);
      })
      if (exist) {
        this.notificationService.error(ERROR_MESSAGES.IDENTIFICATION_ALREADY_EXIST);
        return;
      }
      this.identificationList.update(list => [...list, newItem]);
      this.notificationService.success(
        '¡Identificación Capturada con Éxito!',
        'Se Agregó la Identificación ' + type
      );
      this.unsavedState.set(true);
      this.resetForm();
    } else {
      document.body.classList.add('show-validation');
      if (this.form.controls['identificationExpDate'].hasError('matDatepickerMin')) {
        const mailControl = this.form.get('identificationExpDate');
        mailControl?.setErrors({ invalidFormat: true });
        mailControl?.markAsTouched();
        this.notificationService.error('La fecha no puede ser anterior a hoy');
      } else {
        Object.values(this.form.controls).forEach(control => {
          if (control.invalid) {
            control.markAsTouched();
          }
        });
        this.notificationService.error(ERROR_MESSAGES.MISSING_INFO);
      }
    }
  }


  isEditingIndentificationDuplicated(): boolean {
    const existId = this.identificationList().find(i => {
      return (
        i.id !== this.editingId &&
        String(i.identificationCountryId) === String(this.form.value.identificationCountry) &&
        String(i.identificationTypeId) === String(this.form.value.identificationType) &&
        i.identificationNumber === this.form.value.identificationNumber &&
        i.identificationExpDate === convertDate(this.form.value.identificationExpDate).toString() &&
        i.active
      );
    })?.id;
    if (existId !== this.editingId && existId !== undefined) {
      return true;
    }
    return false;
  }

  async eventRowidentification(event: any): Promise<void> {
    if (event.type === 'edit') {
      this.editIdentification(event);
    }
    if (event.type === 'delete') {
      await this.deleteIdent(event);
    }
  }


  async deleteIdent(event: any) {
    const result = await this.notificationModalService.confirm({
      title: 'Confirmar eliminar el registro',
      btnDeny: 'Cancelar',
      btnAccept: 'Sí, eliminar',
    });

    if (result?.value === true) {
      const itemToDelete = event.row

      this.identificationList.update(list =>
        list.map(item =>
          item.id === itemToDelete.id
            ? { ...item, active: false }
            : item
        )
      );
      //this.identificationList.update(list => list.filter(item => item.id !== itemToDelete.id));
      this.notificationService.success(
        '¡Identificación Eliminada con Éxito!',
        'Se Eliminó la Identificación'
      );
      this.unsavedState.set(true);
    }

  }

  validateExpirationDate(item: IdentificationItem): boolean {
    const selectedType = item.identificationType;

    if (!item.identificationExpDate) return true;

    const expirationDate = moment(item.identificationExpDate, 'DD/MM/YYYY', true);
    if (!expirationDate.isValid()) return false;

    if (selectedType === '000003') {
      const d = expirationDate.date();
      const m = expirationDate.month();
      if (d !== 31 || m !== 11) {
        return false;
      }
    }

    return true;
  }

  private resetForm(): void {
    this.editingId = null;
    this.form.reset();
  }

  editIdentification(event: any) {
    const item: IdentificationItem = event.row;
    const type = this.identificationTypes().find(i => i.text === item.identificationType)?.type;
    const country = this.countries().find(i => i.country === item.identificationCountry)?.countryId;
    this.form.patchValue({
      identificationCountry: country,
      identificationType: type,
      identificationNumber: item.identificationNumber,
      identificationExpDate: item.identificationExpDate ? convertDateBack(item.identificationExpDate) : '',
    });
    this.editingId = item.id;
    this.changeIdentification(this.identificationTypes().find(i => i.text === item.identificationType)?.type ?? '');
    this.cantSave = false;
  }

  onIdentificationTypeChange(event: MatSelectChange) {
    this.changeIdentification(this.identificationTypes().find(item => item.type === event.value)?.type ?? '');
  }

  changeIdentification(input: string) {
    const result = this.expDateValidate.includes(input);
    const expDateControl = this.form.get('identificationExpDate');
    if (result) {
      expDateControl?.enable({ emitEvent: false });
    } else {
      this.form.patchValue({ identificationExpDate: '', });
      expDateControl?.disable({ emitEvent: false });
    }
  }

  onlyAlfanumerics(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/[^a-zA-Z0-9]/g, '');
    if (cleaned !== input.value) {
      input.value = cleaned;
    }
  }

  resetModified() {
    this.unsavedState.set(false);
  }

  clear() {
    const storageValue = this.identificationSaved();
    if (storageValue && storageValue.length > 0) {
      this.identificationList.set(storageValue);
    } else {
      this.identificationList.set([]);
    }
  }
}
