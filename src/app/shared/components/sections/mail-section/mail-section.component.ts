
import { ChangeDetectorRef, Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { MailItem } from '../../../../onboarding/models/mail-item';

import { NotificationsService } from '../../../services/notifications.service';
import { NotificationModalService } from '../../../services/notification-modal.service';
import { TokenVerificationServiceService } from '../../../services/token-verification-service.service';
import { OtcService } from '../../../services/otc.service';
import { OtcMailRequest } from '../../../../onboarding/models/otc-mail-request';
import { ERROR_MESSAGES, NOTIFICATION_MESSAGES, SUCCESS_MESSAGES } from '../../../../onboarding/constants/form-messages';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { ColumnsDataTable, ConfigDataTable } from '../../table-results/interfaces';
import { firstValueFrom, of } from 'rxjs';
import { invalid } from 'moment';
import { RolePermises } from '../../../../core/services/matrix_role';
import { NotificationFormRegistry } from '../../../services/notifications/notification-form-registry.service';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-mail-section',
  standalone: false,
  templateUrl: './mail-section.component.html',
  styleUrl: './mail-section.component.css'
})
export class MailSectionComponent implements OnInit {

  env = environment;

  mailSaved = input<MailItem[]>([]);
  rolePermises = input<RolePermises>();

  disableOTC = input<boolean>(this.env.otcConfig.disableOtcMail);

  private readonly roleDefault: RolePermises ={
    hide: false,
    "allDisabled": false,
    "fieldsDisabled": [],
    "buttonsDisabled": []
  };

  rolePermisesUse = computed(()=> this.rolePermises() ?? this.roleDefault);

  unsavedState = signal<boolean>(false);
  mailList = signal<MailItem[]>([]);
  mailColumns: Array<ColumnsDataTable> = [];
  mailConfigs: ConfigDataTable = { showPag: false, showEditAction: true, showDeleteAction: true, showViewAction: false, multipleSelection: false, idName: 'id'};

  disabled = input.required<boolean>();
  editingId: string | null = null;
  cantSave: boolean = false;

  private readonly fb = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notificationService = inject(NotificationsService)
  private readonly notificationModalService = inject(NotificationModalService)
  private readonly tokenVerificationService = inject(TokenVerificationServiceService)
  private readonly otcService = inject(OtcService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly notificationRegistry = inject(NotificationFormRegistry);

  form: FormGroup = this.fb.group({
    mail: ['', Validators.required],
    mailNotification: [false],
    isSaved: [{value: false, disabled: true}],
  });

  constructor() {
    console.log(this.env.name);
    console.log(this.env.otcConfig.disableOtcMail);
    effect(() => {
      if (this.disabled()) {
        this.form.get('mail')?.clearValidators();
      } else {
        this.form.get('mail')?.setValidators(Validators.required);
      }
      this.form.get('mail')?.updateValueAndValidity();
      this.cdr.detectChanges();
    });
    document.body.classList.remove('show-validation');
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
    this.mailColumns = [
      { name: 'mail', title: 'Correo Electrónico', show: true, type: 'string' },
      { name: 'mailNotification', title: 'Correo Electrónico de notificación', show: true, type: 'checkbox' },
    ]

    const storedItems = this.mailSaved();
    if (storedItems) {
      this.mailList.set(storedItems);
    }

    if (this.rolePermisesUse().allDisabled || this.rolePermisesUse().buttonsDisabled.some(p => ['edit', 'save'].includes(p))) {
      this.cantSave = true;
    }
    this.notificationRegistry.registerForm(this.form);
  }

  setData(storedItems: MailItem[]){
    if (storedItems) {
      this.mailList.set(storedItems);
    }
  }

  ngOnChanges(){
    const allDisabled = this.rolePermisesUse().allDisabled;
    const disabledButtons = this.rolePermisesUse()?.buttonsDisabled ?? [];

    const edit = !allDisabled && !disabledButtons.includes('edit');
    const del = !allDisabled && !disabledButtons.includes('delete');
    console.log({ edit });
    console.log({ del });

    this.mailConfigs = {
      ...this.mailConfigs,
      showEditAction: edit,
      showDeleteAction: del
    };
    this.cantSave = allDisabled || disabledButtons.includes('save')
  }

  async onSubmit(): Promise<void> {
    const mailControl = this.form.get('mail');
    const mail = mailControl?.value;
    const mailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    document.body.classList.add('show-validation');
    if (mail !== null && mail !== undefined && mail.trim() !== '') {
      if (!mailRegex.test(mail)) {
        mailControl?.setErrors({ invalidFormat: true });
        mailControl?.markAsTouched();
        this.notificationService.error(ERROR_MESSAGES.MAIL_INVALID);
        return;
      } else {
        if (mailControl?.hasError('invalidFormat')) {
          mailControl.setErrors(null);
        }
      }
    }
    if (this.form.valid) {
      const { mail, mailNotification } = this.form.value;
      const existingMails = this.mailList();
      const mailExists = existingMails.some(item => item.mail.toLowerCase() === mail.toLowerCase() && item.active);
      const hasNotification = existingMails.some(item => item.mailNotification && item.active);

      if (this.editingId) {
        const anotherWithNotification = existingMails.some(
          item => item.mailNotification && item.id !== this.editingId && item.active
        );
        const mailAnotherExists = existingMails.some(item => item.mail.toLowerCase() === mail.toLowerCase() && item.id !== this.editingId && item.active);
        if (mailAnotherExists) {
          this.notificationService.error(ERROR_MESSAGES.MAIL_ALREADY_EXIST)
          return;
        }
        if (mailNotification && anotherWithNotification) {
          this.notificationService.error(ERROR_MESSAGES.MAIL_NOTIFICATION_ALREADY_EXIST)
          return;
        }
        if (!hasNotification && !mailNotification) {
          const result = await this.notificationModalService.warning({
            title: 'No cuenta con ningún correo de notificación registrado. ¿Desea continuar?',
            btnAccept: 'Sí',
            btnDeny: 'No',
          });
          if (result?.value != true) {
            return;
          }
        }
        await this.checkAndSaveMail(mail, true);
        return;
      }

      if (mailExists) {
        this.notificationService.error(ERROR_MESSAGES.MAIL_ALREADY_EXIST)
        return;
      }
      if (mailNotification && hasNotification) {
        this.notificationService.error(ERROR_MESSAGES.MAIL_NOTIFICATION_ALREADY_EXIST)
        return;
      }
      if (!hasNotification && !mailNotification) {
        const result = await this.notificationModalService.warning({
          title: 'No cuenta con ningún correo de notificación registrado. ¿Desea continuar?',
          btnAccept: 'Sí',
          btnDeny: 'No',
        });
        if (result?.value != true) {
          return;
        }
      }
      await this.checkAndSaveMail(mail, false);

    } else {
      document.body.classList.add('show-validation');
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
      this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS)
    }
  }

  async checkAndSaveMail(mail: string, edit: boolean) {
    const mailBody: OtcMailRequest = {
      //code: '',
      email: mail,
      //onboarding: ''
    };

    try {


      let result = null;
      console.log()
      if(this.disableOTC()){
        console.log('Saltando validacion')
        result = { message: 'OK' }
      }else {
       const i = await firstValueFrom(this.otcService.sendEmail(mailBody));
       console.log(i);
       result = await this.tokenVerificationService.showModal('mail', mail, 6);
      }

      if (result != null) {
        if (edit) {
          this.mailList.update(list =>
            list.map(item =>
              item.id === this.editingId ? { ...item, ...this.form.value } : item
            )
          );
          if(this.rolePermises()?.buttonsDisabled.includes('save')){
            this.cantSave = true;
          }
        } else {
          const newItem: MailItem = {
            ...this.form.value,
            id: crypto.randomUUID(),
            active: true,
          };
          this.mailList.update(list => [...list, newItem]);
        }

        this.notificationService.success(
          SUCCESS_MESSAGES.SAVE_MAIL_MAIN_MESSAGE,
          SUCCESS_MESSAGES.SAVE_MAIL_SECONDARY_MESSAGE
        );
        this.resetForm();
        console.log('seteando a true');
        this.unsavedState.set(true);
      }
    } catch (err) {
      console.error(err);
      this.notificationService.error('Fallo al enviar el código');
    }
  }

  async eventRowMail(event: any): Promise<void> {
    if (event.type === 'edit') {
      if (!(this.rolePermisesUse().allDisabled || this.rolePermisesUse().buttonsDisabled.includes('edit'))) {
        this.editMail(event);
      }
    }
    if (event.type === 'delete') {
      if (!(this.rolePermisesUse().allDisabled || this.rolePermisesUse().buttonsDisabled.includes('delete'))) {
        await this.deleteMail(event);
      }
    }
  }

  async deleteMail(event: any) {

    const result = await this.notificationModalService.confirm({
      title: NOTIFICATION_MESSAGES.DELETE_CONFIRMATION_MESSAGE,
      btnAccept: 'Sí, Eliminar',
      btnDeny: 'No',
    });

    if (result?.value === true) {
      const mail = event.row;

      this.mailList.update(list =>
        list.map(item =>
          item.id === mail.id
            ? { ...item, active: false }
            : item
        )
      );

      //this.mailList.update(list => list.filter(item => item.id != mail.id))

      this.notificationService.success(
        SUCCESS_MESSAGES.DELETE_MAIL_MAIN_MESSAGE,
        SUCCESS_MESSAGES.DELETE_MAIL_SECONDARY_MESSAGE);
      console.log('seteando a true')
      this.unsavedState.set(true);
    }
  }

  editMail(event: any) {
    const item = event.row;
    this.form.patchValue({
      mail: item.mail,
      mailNotification: item.mailNotification,
      isSaved: item.isSaved === undefined ? false : item.isSaved
    });
    this.editingId = item.id;
    this.cantSave = false;
  }

  private resetForm(): void {
    this.editingId = null;
    this.form.reset({ mail: '', mailNotification: false });
  }

  resetModified() {
    this.unsavedState.set(false);
  }

  clear() {
    const storageValue = this.mailSaved();
    if (storageValue && storageValue.length > 0) {
      this.mailList.set(storageValue);
    } else {
      this.mailList.set([]);
    }
  }
}
