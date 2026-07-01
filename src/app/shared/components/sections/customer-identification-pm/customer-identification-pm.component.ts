import { HomonymsPmService } from './../../../services/homonyms-pm.service';
import { Component, inject, Input, signal } from '@angular/core';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Nationalities } from '../../../../onboarding/models/nationality';
import { REGEX, STRINGS } from '../../../../onboarding/constants/constants';
import { CatalogsService } from '../../../services/catalogs.service';
import { NotificationsService } from '../../../services/notifications.service';
import { CustomerIdentificationPm } from '../../../../onboarding/models/pm/customer-identification-pm';
import { CustomerWatchListBody, WatchList } from '../../../../onboarding/models/customer-watch-list';
import { compareAndReturnRfcNifTinNss, AllowedValuesRfcNifTinNss } from '../../../utils/map-rfc-nif-tin-nss';
import { convertDate } from '../../../utils/datetime';
import { HomonymsRequest, HomonymsResponse } from '../../../../onboarding/models/homonyms';
import { lastValueFrom } from 'rxjs';
import { HomonymsService } from '../../../services/homonyms.service';
import { WatchlistService } from '../../../services/watchlist.service';
import { NotificationModalService } from '../../../services/notification-modal.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalHomonymsPmServiceService } from '../../../services/modal-homonyms-pm-service.service';
import { searchPercentSimilarity } from '../../../utils/homonyms-search';

@Component({
  selector: 'app-customer-identification-pm',
  standalone: false,
  templateUrl: './customer-identification-pm.component.html',
  styleUrl: './customer-identification-pm.component.scss'
})
export class CustomerIdentificationPmComponent {
  @Input() data?: CustomerIdentificationPm | null = null;
  private readonly fb = inject(FormBuilder);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly catalogService = inject(CatalogsService);
  private readonly notificationService = inject(NotificationsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dataWatchlistService = inject(WatchlistService);
  private readonly dataHomonymService = inject(HomonymsService);
  private readonly notificationModalService = inject(NotificationModalService);
  private readonly homonymsPmService = inject(HomonymsPmService);
  private readonly modalHomonymsServiceService = inject(ModalHomonymsPmServiceService);


  profileForm: FormGroup = this.fb.group({
    nationality: ['', [Validators.required]],
    typeIden: ['', [Validators.required]],
    rfc: ['', [Validators.required]],
    date: ['',],
    businessName: ['', [Validators.required]],
  });

  nationalities = signal<Nationalities[]>([]);
  date = signal<boolean>(false);
  listData: WatchList | undefined;
  listHomonyms: HomonymsResponse[] | undefined;

  ngOnInit() {
    document.body.classList.remove('show-validation');
    this.catalogService.getNationalities({ land: [] }).subscribe(c => {
      this.nationalities.set(c);
    });

    if (this.data) {
      this.onItemSelectNationType(this.data.nationality);
      this.profileForm.patchValue({
        nationality: this.data.nationality,
        typeIden: this.data.typeIden,
        rfc: this.data.rfc,
        date: this.data.date,
        businessName: this.data.businessName,
      });
    }
  }

  ngAfterViewInit() {
    this.profileForm.valueChanges.subscribe(() => {
      this.unsavedChangesService.setUnsavedChanges(this.profileForm.dirty);
    });
  }

  allowAlphanumericOnly(event: KeyboardEvent): void {
    const regex = /^[a-zñA-ZÑ0-9]$/;
    const key = event.key;
    if (!regex.test(key)) {
      event.preventDefault();
    }
  }

  onItemSelectNationType(item: string) {
    const controlDate = this.profileForm.get('date');
    if (item === STRINGS.MEXICAN) {
      controlDate?.clearValidators();
      this.profileForm.patchValue({ typeIden: '1' });
      this.date.set(false);
    } else if (item === STRINGS.USA) {
      controlDate?.setValidators(Validators.required);
      this.profileForm.patchValue({ typeIden: '5' });
      this.date.set(true);
    } else if (item != STRINGS.MEXICAN && item != STRINGS.USA) {
      controlDate?.setValidators(Validators.required);
      this.profileForm.patchValue({ typeIden: '2' });
      this.date.set(true);
    }
  }

  onSubmit(): Promise<CustomerIdentificationPm | null> | null {
    Object.keys(this.profileForm.controls).forEach(controlName => {
      const control = this.profileForm.get(controlName);
      control?.updateValueAndValidity();
    });
    document.body.classList.add('show-validation');
    if (this.profileForm.valid) {
      if (this.validFiscalId(this.profileForm.get("typeIden")?.value, this.profileForm.get("rfc")?.value)) {
        const data = this.validWlAndHomo(this.client());
        return data;
      } else {
        this.notificationService.error('Tienes Campos Capturados con Formato Incorrecto');
        return null;
      }
    } else {
      this.error();
      this.notificationService.error('Se Detectó Información sin Capturar');
      return null;
    }
  }

  validFiscalId(id: string, data: string): boolean {
    if (id === "1" && REGEX.RFC_PM_VALIDATION.test(data)) {
      return true
    } else if ((id === "2" || id === "5") && REGEX.NIF_TIN_NSS_PM_VALIDATION.test(data)) {
      return true
    } else {
      const controlRfc = this.profileForm.get('rfc');
      controlRfc?.setErrors({ invalidFormat: true });
      controlRfc?.markAsTouched();
      this.error();
      return false
    }
  }

  async validWlAndHomo(data: CustomerIdentificationPm): Promise<CustomerIdentificationPm | null> {
    console.log(convertDate(data.date));
    const dataWatchList: CustomerWatchListBody = {
      personalInfo: {
        fullName: data.businessName,
        birthDate: '',
        rfc: compareAndReturnRfcNifTinNss(data?.rfc || "", AllowedValuesRfcNifTinNss.RFC, data?.typeIden || ""),
        curp: '',
        nif: compareAndReturnRfcNifTinNss(data?.rfc || "", AllowedValuesRfcNifTinNss.NIF, data?.typeIden || ""),
        clientNumber: '',
        ssn: '',
        personType: '1',
        name: data.businessName,
        middleName: '',
        lastName: '',
        secondLastName: '',
        gender: '',
        countryOfBirth: '',
        federalEntity: '',
      }
    }
    const dataHomonyms: HomonymsRequest = {
      channelId: "SPINE",
      applicationId: "0001",
      personType: 2,
      name: data.businessName,
      middleName: '',
      lastName: '',
      secondLastName: '',
      birthDate: '',
      rfc: compareAndReturnRfcNifTinNss(data?.rfc || "", AllowedValuesRfcNifTinNss.RFC, data?.typeIden || ""),
      curp: '',
      nif: compareAndReturnRfcNifTinNss(data?.rfc || "", AllowedValuesRfcNifTinNss.NIF, data?.typeIden || ""),
      tin: compareAndReturnRfcNifTinNss(data?.rfc || "", AllowedValuesRfcNifTinNss.TIN, data?.typeIden || ""),
      nss: compareAndReturnRfcNifTinNss(data?.rfc || "", AllowedValuesRfcNifTinNss.SSN, data?.typeIden || ""),
      birthPlace: '',
    }
    this.listData = await lastValueFrom(this.dataWatchlistService.postData(dataWatchList));
    const watchListData = this.getListValues(this.listData);
    document.body.classList.remove('show-validation');
    if (this.listData?.step === 1) {
      if (watchListData.length > 1) {
        await this.notificationModalService.error({
          title: 'El solicitante se encuentra en la lista ',
          beforeMessages: watchListData,
          afterMessages: ['Consultar con el área de PLD'],
          btnAccept: 'Terminar',
        });
        this.router.navigate(['/'], { relativeTo: this.route.parent });
        return null;
      } else {
        await this.notificationModalService.error({
          title: 'El solicitante se encuentra en la lista ' + watchListData[0],
          afterMessages: ['Consultar con el área de PLD'],
          btnAccept: 'Terminar',
        });
        this.router.navigate(['/'], { relativeTo: this.route.parent });
      }
      return null;
    }
    if (this.listData?.step === 2) {
      await this.notificationModalService.warning({
        title: '¡Atención!',
        afterCopyMessages: ['Número de Prospecto'],
        infoToCopy: '011230',
        afterMessages: ['El Cliente en cuestión ha sido remitido al Área de PLD para su revisión.'],
      });
      this.router.navigate(['/'], { relativeTo: this.route.parent });
      return null;
    }

    this.listHomonyms = await lastValueFrom(this.dataHomonymService.postHomonyms(dataHomonyms));
    let homo = searchPercentSimilarity(this.listHomonyms);
    if (this.listHomonyms) {
      if (homo.code === 2 || homo.code === 3) {
        this.dataHomonymService.setData(this.listHomonyms);
        await this.notificationModalService.success({
          title: '¡Se ha encontrado coincidencias!',
          afterMessages: ['Se ha encontrado homonimias del Cliente. '],
          btnAccept: 'Revisión',
        });
        const result = await this.modalHomonymsServiceService.formModalHomonyms()

        if (result === "continue") {
          return this.client();
        } else {
          return null;
        }
      }
      if (homo.code === 1) {
        this.dataHomonymService.setData(this.listHomonyms);
        await this.notificationModalService.success({
          title: '¡Se ha encontrado una coincidencia!',
          afterMessages: ['Se ha encontrado una coincidencia exacta con', 'Número de Cliente', this.listHomonyms[0].clientNumber],
          btnAccept: 'Revisión',
        });
        this.homonymsPmService.homonimiaModal(this.listHomonyms).subscribe((result) => {
        });
        this.unsavedChangesService.setUnsavedChanges(false);
        return null;
      }
    }
    return this.client();
  }

  client = (): CustomerIdentificationPm => this.profileForm.getRawValue() as CustomerIdentificationPm;

  getListValues = (list?: WatchList) => list?.matchLists?.map(item => item.type) || [];


  error(): void {
    Object.values(this.profileForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsTouched();
      }
    });
  }
}

