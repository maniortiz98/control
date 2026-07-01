import { ChangeDetectorRef, Component, computed, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CATALOG_NAME, REGEX, STRINGS } from '../../../../onboarding/constants/constants';
import { PhoneItem } from '../../../../onboarding/models/phone-item';
import { NotificationsService } from '../../../services/notifications.service';
import { NotificationModalService } from '../../../services/notification-modal.service';
import { TokenVerificationServiceService } from '../../../services/token-verification-service.service';
import { Countries } from '../../../../onboarding/models/country';
import { CatalogsService } from '../../../services/catalogs.service';
import { CatalogsAllowed } from '../../../types/catalogs.type';
import { PhoneType } from '../../../../onboarding/models/phone-type';
import { ERROR_MESSAGES, NOTIFICATION_MESSAGES, SUCCESS_MESSAGES } from '../../../../onboarding/constants/form-messages';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { ColumnsDataTable, ConfigDataTable } from '../../table-results/interfaces';
import { OtcSmsRequest } from '../../../../onboarding/models/otc-sms';
import { firstValueFrom, of } from 'rxjs';
import { OtcService } from '../../../services/otc.service';
import { RolePermises } from '../../../../core/services/matrix_role';
import { NotificationFormRegistry } from '../../../services/notifications/notification-form-registry.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-phone-section',
  standalone: false,
  templateUrl: './phone-section.component.html',
  styleUrl: './phone-section.component.css'
})
export class PhoneSectionComponent implements OnInit {
  env = environment;
  listStorage = input<PhoneItem[]>();
  personType = input<string>('');
  initialFormValues = input<PhoneItem>();
  showTable = input<boolean>(true);
  formValues = output<PhoneItem>();
  disabled = input.required<boolean>();
  rolePermises = input<RolePermises>();
  disableOTC = input<boolean>(this.env.otcConfig.disableOtcSms);

  private readonly roleDefault: RolePermises = {
    hide: false,
    "allDisabled": false,
    "fieldsDisabled": [],
    "buttonsDisabled": []
  };

  rolePermisesUse = computed(() => this.rolePermises() ?? this.roleDefault);

  phoneList = signal<PhoneItem[]>([]);
  phoneColumns: Array<ColumnsDataTable> = [];
  phoneConfigs: ConfigDataTable = { showPag: false, showEditAction: true, showDeleteAction: true, showViewAction: false, multipleSelection: false, idName: 'id' };

  unsavedState = signal<boolean>(false);
  countries = signal<Array<Countries>>([]);
  phoneTypes = signal<Array<PhoneType>>([]);

  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly catalogsService = inject(CatalogsService);
  private readonly notificationService = inject(NotificationsService)
  private readonly notificationModalService = inject(NotificationModalService)
  private readonly tokenVerificationService = inject(TokenVerificationServiceService)
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly otcService = inject(OtcService);
  private readonly notificationRegistry = inject(NotificationFormRegistry);
  cantSave: boolean = false;

  constructor() {

    effect(() => {
      const controls = ['phoneType', 'phoneCountry', 'phone'];
      const validators = this.disabled() ? [] : [Validators.required];
      controls.forEach(name => {
        const control = this.form.get(name);
        if (control) {
          control.setValidators(validators);
          control.updateValueAndValidity({ emitEvent: false });
        }
      });
      this.cdr.detectChanges();
    });

    effect(() => {
      const countryKey = this.selectedCountry();
      if (!countryKey) {
        this.form.get('phoneCodeArea')!.setValue('', { emitEvent: false });
        return;
      }
      const countryObj = this.countries().find(
        c => c.countryId === countryKey
      );
      console.log(countryObj)
      const countryAreaCode = countryObj?.countryCode ?? '';
      if (this.form.get('phoneCodeArea')!.value !== countryAreaCode) {
        this.form.get('phoneCodeArea')!.setValue(countryAreaCode, { emitEvent: false });
      }
    });

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
      console.log('View initialized');
      this.unsavedChangesService.setUnsavedChanges(this.form.dirty);
    });
    const storageValue = this.listStorage();
    const inputValues = this.initialFormValues()
    console.log(this.initialFormValues())
    if (inputValues) {
      this.form.setValue({
        phoneType: inputValues.phoneType,
        phoneCountry: inputValues.phoneCountry,
        phoneCodeArea: inputValues.phoneCodeArea,
        phone: inputValues.phone,
        phoneExtension: inputValues.phoneExtension ?? '',
        phoneNotification: inputValues.phoneNotification,
        isSaved: false
      });

      this.selectedPhoneType.set(inputValues.phoneType);
      this.selectedCountry.set(inputValues.phoneCountry);
    }

    if (storageValue && storageValue.length > 0) {
      this.phoneList.set(storageValue);
    }

    this.catalogsService.getCountry({ land: [] }).subscribe(c => {
      this.countries.set(c);
    });

    this.catalogsService.getPhoneType({ telephoneTypeIds: [] }).subscribe(c => {
      if (this.personType() == 'PM') {
        const filtered = c.filter((item: PhoneType) =>
          item.telephoneTypeId === '3' || item.telephoneTypeId === '1'
        );
        this.phoneTypes.set(filtered);
        console.log(filtered)
      } else {
        this.phoneTypes.set(c);
      }

    });

    this.phoneColumns = [
      { name: 'phoneType', title: 'Tipo de Teléfono', show: true, type: 'string' },
      { name: 'phoneCountry', title: 'País', show: true, type: 'string' },
      { name: 'phoneCodeArea', title: 'Código de Área', show: true, type: 'string' },
      { name: 'phone', title: 'Teléfono', show: true, type: 'string' },
      { name: 'phoneNotification', title: 'Teléfono de notificación', show: true, type: 'checkbox' },
    ]

    if (this.rolePermisesUse().allDisabled || this.rolePermisesUse().buttonsDisabled.some(p => ['edit', 'save'].includes(p))) {
      this.cantSave = true;
    }
    this.notificationRegistry.registerForm(this.form);
  }

  setData(storageValue: PhoneItem[]) {
    if (storageValue && storageValue.length > 0) {
      this.phoneList.set(storageValue);
    }
  }

  ngOnChanges() {
    const allDisabled = this.rolePermisesUse().allDisabled;
    const disabledButtons = this.rolePermisesUse()?.buttonsDisabled ?? [];

    const edit = !allDisabled && !disabledButtons.includes('edit');
    const del = !allDisabled && !disabledButtons.includes('delete');
    console.log({ edit });
    console.log({ del });

    // this.phoneConfigs = {
    //   ...this.phoneConfigs,
    //   showEditAction: edit,
    //   showDeleteAction: del
    // };
    this.phoneConfigs = { showPag: false, showEditAction: edit, showDeleteAction: del, showViewAction: false, multipleSelection: false, idName: 'id' }

    this.cantSave = allDisabled || disabledButtons.includes('save')
  }


  form: FormGroup = this.fb.group({
    phoneType: ['', Validators.required],
    phoneCountry: ['', Validators.required],
    phoneCodeArea: [''],
    phone: ['', Validators.required],
    phoneExtension: [''],
    phoneNotification: [false],
    isSaved: [{value: false, disabled: true}]
  });

  selectedPhoneType = signal<string>('');
  selectedCountry = signal<string | null>(null);

  onPhoneTypeChange(event: MatSelectChange) {
    this.selectedPhoneType.set(event.value);
    console.log(event.value);
    if (this.selectedPhoneType() !== '1') {
      this.form.patchValue({
        phoneNotification: false,
      });
    }
  }
  onCountryChange(event: MatSelectChange) {
    this.selectedCountry.set(event.value);
  }

  editingId: string | number | null = null;

  async onSubmit(): Promise<boolean> {
    document.body.classList.add('show-validation');
    const phoneControl = this.form.get('phone');

    if (this.form.value.phone && this.form.value.phone != '') {
      console.log('limpiando')
      console.log(this.form.value.phone)
      phoneControl?.setErrors(null);
    }

    if (this.form.valid || this.form.disabled) {

      if (!this.showTable()) {
        const { phoneCountry, phone } = this.form.value;
        if (!this.validPhoneNumber(phoneCountry, phone)) {
          this.notificationService.error(ERROR_MESSAGES.PHONE_INVALID)
          const control = this.form.get('phone');
          control?.setErrors({ invalidFormat: true });
          control?.markAsTouched();
          return false;
        }

        this.formValues.emit({
          id: 'crypto.randomUUID',
          phone: this.form.value.phone,
          phoneType: this.form.value.phoneType,
          phoneTypeId: this.form.value.phoneType,
          phoneCountry: this.form.value.phoneCountry,
          phoneCountryId: this.form.value.phoneCountry,
          phoneCodeArea: this.form.value.phoneCodeArea,
          phoneLada: this.form.value?.phoneLada,
          phoneExtension: this.form.value?.phoneExtension,
          phoneNotification: this.form.value.phoneNotification,
          active: true,
        });
        return true;
      }
      const { phoneCountry, phoneType, phone, phoneNotification } = this.form.value;
      const existingPhones = this.phoneList();
      const phoneExist = existingPhones.some(item => item.phone.toUpperCase() === phone.toUpperCase() && item.active)
      const hasNotification = existingPhones.some(item => item.phoneNotification && item.active);

      if (!this.validPhoneNumber(phoneCountry, phone)) {
        this.notificationService.error(ERROR_MESSAGES.PHONE_INVALID)
        const control = this.form.get('phone');
        const errors = control?.errors || {};
        control?.setErrors({ ...errors, invalidFormat: true })
        control?.markAsTouched();
        return false;
      }

      if (this.editingId) {
        console.log('entró el edit')
        const anotherPhoneExist = existingPhones.some(item => item.phone.toUpperCase() === phone.toUpperCase() && item.id !== this.editingId && item.active)
        if (anotherPhoneExist) {
          this.notificationService.error(ERROR_MESSAGES.PHONE_ALREADY_EXIST)
          return false;
        }
        const anotherWithNotification = existingPhones.some(
          item => item.phoneNotification && item.id !== this.editingId && item.active
        );
        if (phoneNotification && anotherWithNotification) {
          this.notificationService.error(ERROR_MESSAGES.PHONE_NOTIFICATION_ALREADY_EXIST)
          return false;
        }
        if (phoneType === '1' && !hasNotification && !phoneNotification) {
          const result = await this.notificationModalService.warning({
            title: 'No cuenta con ningún teléfono de notificación registrado. ¿Desea continuar?',
            btnAccept: 'Sí',
            btnDeny: 'No',
          });
          if (result?.value != true) {
            return false;
          }
        }
        this.checkAndSavePhone(phoneType, phone, true);
        return true;
      }
      if (phoneExist) {
        this.notificationService.error(ERROR_MESSAGES.PHONE_ALREADY_EXIST)
        return false;
      }
      if (phoneNotification && hasNotification) {
        this.notificationService.error(ERROR_MESSAGES.PHONE_NOTIFICATION_ALREADY_EXIST)
        return false;
      }
      if (phoneType === '1' && !hasNotification && !phoneNotification) {
        const result = await this.notificationModalService.warning({
          title: 'No cuenta con ningún teléfono de notificación registrado. ¿Desea continuar?',
          btnAccept: 'Sí',
          btnDeny: 'No',
        });
        if (result?.value != true) {
           return false;
        }
      }
      this.checkAndSavePhone(phoneType, phone, false);
      return true;
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
      this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS)
      return false;
    }
  }

  async checkAndSavePhone(phoneType: string, phone: string, isEdit: boolean) {
    const phoneCodeArea = this.form.get('phoneCodeArea')?.value;
    let verifyPhoneNumber = phone;

    if (
      (phoneType.toUpperCase() == '1') &&
      phoneCodeArea !== '52' &&
      /^\d+$/.test(phoneCodeArea) 
    ) {
      verifyPhoneNumber = `${phoneCodeArea}${phone}`;
    }

    const smsBody: OtcSmsRequest = {
      code: '',
      phoneNumber: verifyPhoneNumber,
      onboarding: ''
    };


    let response = null;

    try {
      if (this.disableOTC()) {
        response = true;
      } else {
        if (phoneType.toUpperCase() == '1') {
          const i = await firstValueFrom(this.otcService.sendSms(smsBody));
          console.log(i);
          response = await this.tokenVerificationService.showModal('phone', verifyPhoneNumber, 6)
        } else {
          response = true;
        }
      }
      if (response) {
        if (isEdit) {
          this.phoneList.update(list => list.map(item =>
            item.id === this.editingId ? {
              ...item, ...this.form.value,
              phoneType: this.phoneTypes().find(item => item.telephoneTypeId === this.form.value.phoneType)?.telephoneType ?? '-',
              phoneTypeId: this.form.value.phoneType,
              phoneCountry: this.countries().find(item => item.countryId === this.form.value.phoneCountry)?.country ?? '-',
              phoneCountryId: this.form.value.phoneCountry,
            } : item
          ));
          if (this.rolePermises()?.buttonsDisabled.includes('save')) {
            this.cantSave = true;
          }
        } else {
          const newItem: PhoneItem = {
            ...this.form.value,
            id: crypto.randomUUID(),
            phoneType: this.phoneTypes().find(item => item.telephoneTypeId === this.form.value.phoneType)?.telephoneType ?? '-',
            phoneTypeId: this.form.value.phoneType,
            phoneCountry: this.countries().find(item => item.countryId === this.form.value.phoneCountry)?.country ?? '-',
            phoneCountryId: this.form.value.phoneCountry,
            active: true,
          }
          this.phoneList.update(list => [...list, newItem]);
        }
        this.notificationService.success(
          SUCCESS_MESSAGES.SAVE_PHONE_MAIN_MESSAGE,
          SUCCESS_MESSAGES.SAVE_PHONE_SECONDARY_MESSAGE
        )
        this.resetForm();
        this.unsavedState.set(true)
      }
    } catch (err) {
      console.error(err);
      this.notificationService.error('Falló al Enviar el Código SMS');
    }

  }

  async eventRowPhone(event: any) {
    if (event.type === 'edit') {
      if (!(this.rolePermisesUse().allDisabled || this.rolePermisesUse().buttonsDisabled.includes('edit'))) {
        this.editPhone(event);
      }
    }
    if (event.type === 'delete') {
      if (!(this.rolePermisesUse().allDisabled || this.rolePermisesUse().buttonsDisabled.includes('delete'))) {
        await this.deletePhone(event);
      }
    }
  }

  async deletePhone(event: any) {

    const result = await this.notificationModalService.confirm({
      title: NOTIFICATION_MESSAGES.DELETE_CONFIRMATION_MESSAGE,
      btnAccept: 'Sí, Eliminar',
      btnDeny: 'No',
    });

    if (result?.value === true) {
      const itemToDelete = event.row;

      this.phoneList.update(list =>
        list.map(item =>
          item.id === itemToDelete.id
            ? { ...item, active: false }
            : item
        )
      );

      //this.phoneList.update(list => list.filter(item => item.id != itemToDelete.id))
      this.notificationService.success(
        SUCCESS_MESSAGES.DELETE_PHONE_MAIN_MESSAGE,
        SUCCESS_MESSAGES.DELETE_PHONE_SECONDARY_MESSAGE)
      this.unsavedState.set(true)
    }
  };

  editPhone(event: any) {
    const item: PhoneItem = event.row;
    console.log('itemToEdit ');
    console.log(item);
    this.form.patchValue({
      phoneType: this.phoneTypes().find(c => c.telephoneType == item.phoneType)?.telephoneTypeId,
      phoneCountry: this.countries().find(c => c.country === item.phoneCountry)?.countryId,
      phoneCodeArea: item.phoneCodeArea,
      phone: item.phone,
      phoneExtension: item.phoneExtension,
      phoneNotification: item.phoneNotification,
      isSaved: item.isSaved === undefined ? false : item.isSaved
    });
    this.editingId = item.id
    this.cantSave = false;
    this.selectedPhoneType.set(this.form.value.phoneType);
  }

  private resetForm(): void {
    this.editingId = null;
    this.form.reset();
    this.selectedCountry.set(null);
  }

  onlyNumbers(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab'
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  private validPhoneNumber(country: string, phone: string): boolean {
    const isMexico = country === STRINGS.MEXICO;
    const invalidPatterns = REGEX.PHONE_INVALIDS;

    if (isMexico ? phone.length !== 10 : phone.length < 7 || phone.length > 15) {
      return false;
    }

    if (invalidPatterns.some(p => typeof p === 'string' ? phone === p : p.test(phone))) {
      return false;
    }

    return true;
  }

  resetModified() {
    this.unsavedState.set(false);
  }

  clear() {
    const storageValue = this.listStorage();
    if (storageValue && storageValue.length > 0) {
      this.phoneList.set(storageValue);
    } else {
      this.phoneList.set([]);
    }
  }
}
