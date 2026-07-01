import { Component, inject, signal, ViewChild } from '@angular/core';
import { Address } from '../../models/address';
import { AddressSectionComponent } from '../../../shared/components/sections/address-section/address-section.component';
import { CatalogsService } from '../../../shared/services/catalogs.service';
import { Countries } from '../../models/country';
import { STRINGS } from '../../constants/constants';
import { CatalogsAllowed } from '../../../shared/types/catalogs.type';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { identity } from 'rxjs';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../constants/form-messages';
import { Nationalities } from '../../models/nationality';
import { MatSelectChange } from '@angular/material/select';
import { ResourceProviderPm } from '../../models/checkpoints/resources-provider-pm';
import { UnsavedChangesService } from '../../../core/services/unsaved-changes.service';
import { CheckpointService } from '../../../shared/services/checkpoint.service';
import { ResourceProviderPmService } from '../../../shared/services/storage-services/pm/resource-provider-pm.service';
import { OnboardingService } from '../../services/onboarding.service';
import { butonFunctionDis, buttonFunctionEn } from '../../../shared/utils/disableOrEnabled';
import { PermissionRolService } from '../../../core/services/rol.service';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-resource-provider-pm',
  standalone: false,
  templateUrl: './resource-provider-pm.component.html',
  styleUrl: './resource-provider-pm.component.scss'
})
export class ResourceProviderPmComponent {

  private readonly fb = inject(FormBuilder);
  private readonly catalogsService = inject(CatalogsService);
  private readonly notificationService = inject(NotificationsService)
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly checkpoint = inject(CheckpointService);
  private readonly sectionStorage = inject(ResourceProviderPmService);
  private readonly onboardingService = inject(OnboardingService);
  private readonly roleService = inject(PermissionRolService);

  dataAddress?: Address;
  isMaintenance: boolean = false;

  @ViewChild(AddressSectionComponent)
  addressSection!: AddressSectionComponent;

  countries = signal<Array<Countries>>([]);
  nationalities = signal<Nationalities[]>([]);
  idLong: number = 12;

  form: FormGroup = this.fb.group({
    socialReason: ['', Validators.required],
    nacionatity: ['', Validators.required],
    identityType: ['', Validators.required],
    identityNumber: ['', Validators.required],
    fiscalKeyCountry: ['', Validators.required],
    fiscalKeyNumber: ['', Validators.required],
    businessType: ['', Validators.required],
    mail: ['', Validators.required],
    phone: ['', Validators.required]
  });

  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      console.log('dirty form ' + this.form.dirty);
      this.unsavedChangesService.setUnsavedChanges(this.form.dirty);
    });
    this.isMaintenance = this.onboardingService.getCurrentInfo().isMaintenance;



    this.catalogsService.getCountry({
      land: []
    }).subscribe(c => {
      this.countries.set(c);
    });

    this.catalogsService.getNationalities({ land: [] }).subscribe(c => {
      this.nationalities.set(c);
    });

    const initialData = this.sectionStorage.resourceProviderPm();

    if(initialData){
      this.chargeInitialValues(initialData);
    }

    console.log(this.form.get('identityType'));
    this.form.get('identityType')?.valueChanges.subscribe(value => {
      const expirationControl = this.form.get('fiscalKeyCountry');
      console.log('entrando')
      if ((value.trim() === '1') || !value || value.trim() == '') {
        expirationControl?.clearValidators();
        expirationControl?.setValue('');
      } else {
        expirationControl?.setValidators([Validators.required]);
      }
      expirationControl?.updateValueAndValidity();
    });

    //this.form.get('identityType')?.disable();
    //this.form.get('fiscalKeyCountry')?.disable();
  }

  onNationalityChange(event: MatSelectChange) {
   this.applyNationalChange(event.value);
  }

  applyNationalChange(value: string){
    console.log(value)
    // if (value == 'MX') {
    //   this.form.patchValue({
    //     identityType: "1",
    //     fiscalKeyCountry: "MX",
    //   });
    //   this.idLong = 12;
    // } else {
    //   this.form.patchValue({
    //     identityType: "2",
    //     fiscalKeyCountry: value,
    //   });
    //   this.idLong = 300;
    // }
  }

  onIdentityTypeChange(event: MatRadioChange){

    this.applyIdentityType(event.value);
  }

  applyIdentityType(value: string){
    console.log(value)
    if (value == '1') {
      this.idLong = 12;
    } else {
      this.idLong = 9;
      const newIdentityNumber = this.form.value.identityNumber ?? ''
      const substring = newIdentityNumber.length > 9 ? newIdentityNumber.substring(0, 9) : newIdentityNumber;
      this.form.patchValue({
        identityNumber: substring
      })
    }
  }

  ngAfterViewInit() {
    if (this.isMaintenance) {
      this.form.disable();
      this.addressSection.profileForm.disable();
      butonFunctionDis(['btnCancelRPPM', 'btnSaveRPPM']);
      const allPermises = this.roleService.getPermissions();
      console.log({ allPermises })

      const cantEdit = allPermises['resource-provider-pm']['allDisabled']

      if (cantEdit) {
        butonFunctionDis(['btnEditRPPM']);
      } else {
        buttonFunctionEn(['btnEditRPPM']);
      }
    }
  }

  async save() {
    const address = await this.addressSection.onSubmit();
    console.log(address);
    const mailControl = this.form.get('mail');
    const mail = mailControl?.value;
    const mailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
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
      console.log(this.form.value)

      const idNumber: string = this.form.value.identityNumber;
      const identityType: string = this.form.value.identityType;

      const rfcPersonaMoralRegex = /^[A-Za-z]{3}[0-9]{6}[A-Za-z0-9]{3}$/;

      if (identityType === '1' && !rfcPersonaMoralRegex.test(idNumber)) {
        this.form.get('identityNumber')?.setErrors({ invalidRfcPersonaMoral: true });
        this.form.get('identityNumber')?.markAsTouched();
        this.notificationService.error('El RFC no cumple con el formato requerido');
        return;
      }

      if (identityType === '1' && !rfcPersonaMoralRegex.test(idNumber)) {
        this.form.get('identityNumber')?.setErrors({ invalidRfcPersonaMoral: true });
        this.form.get('identityNumber')?.markAsTouched();
        this.notificationService.error('El RFC no cumple con el formato requerido');
        return;
      }


      if (address) {
        const result: ResourceProviderPm = {
          socialReason: this.form.value.socialReason,
          nacionatity: this.form.value.nacionatity,
          identityType: this.form.value.identityType,
          identityNumber: this.form.value.identityNumber,
          fiscalKeyCountry: this.form.value.fiscalKeyCountry,
          fiscalKeyNumber: this.form.value.fiscalKeyNumber,
          businessType: this.form.value.businessType,
          mail: this.form.value.mail,
          phone: this.form.value.phone,
          address: address
        }

        console.log(result)

        // this.checkpoint.saveCheckpoint('saveCheckpoint', result).subscribe({
        //   next: (i) => {
        //     console.log(i);
        //     this.unsavedChangesService.setUnsavedChanges(false)
        //     this.sectionStorage.setResourceProviderPm(result);
        //     this.notificationService.success(SUCCESS_MESSAGES.SAVE_CHECKPOINT_SUCCESS);
        //   },
        //   error: (err) => {
        //     console.error(err);
        //     this.notificationService.error(ERROR_MESSAGES.SAVE_CHECKPOINT_ERROR);
        //   }
        // });
      }

    } else {
      Object.entries(this.form.controls).forEach(([name, control]) => {
        if (control.invalid) {
          console.log(name)
          control.markAsTouched();
        }
      });
      this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS+'abc');
    }
  }


    editt() {
      butonFunctionDis(['btnEditRPPM']);
      buttonFunctionEn(['btnSaveRPPM', 'btnCancelRPPM']);

      const allPermises = this.roleService.getPermissions();
      if (!allPermises['resource-provider-pm']['allDisabled']) {
        this.form.enable();
        this.addressSection.profileForm.enable();
      }
      console.log('permises')
    }

    cancel() {
      buttonFunctionEn(['btnEditRPPM']);
      butonFunctionDis(['btnSaveRPPM', 'btnCancelRPPM']);
      this.form.disable();

      const initialData = this.sectionStorage.resourceProviderPm();
      if (initialData) {
        this.chargeInitialValues(initialData);
      } else {
        this.form.reset();
        this.addressSection.profileForm.reset()
      }
    }


  onlyNumbers(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/\D/g, '');
    if (cleaned !== input.value) {
      input.value = cleaned;
    }
  }

  chargeInitialValues(initialData: ResourceProviderPm){
    this.form.patchValue({
      socialReason: initialData.socialReason,
      nacionatity: initialData.nacionatity,
      identityType: initialData.identityType,
      identityNumber: initialData.identityNumber,
      fiscalKeyCountry: initialData.fiscalKeyCountry,
      fiscalKeyNumber: initialData.fiscalKeyNumber,
      businessType: initialData.businessType,
      mail: initialData.mail,
      phone: initialData.phone,
    });
    if(initialData.address){
      this.dataAddress = initialData.address;
    }
    this.applyNationalChange(initialData.nacionatity);
  }
}
