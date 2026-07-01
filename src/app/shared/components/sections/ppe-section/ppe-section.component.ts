import { Component, inject, Input, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { UnsavedChangesService } from '../../../../core/services/unsaved-changes.service';
import { Relationships } from '../../../../onboarding/models/relationships';
import { CatalogsService } from '../../../services/catalogs.service';
import { NotificationsService } from '../../../services/notifications.service';
import { NotificationModalService } from '../../../services/notification-modal.service';
import { MatRadioChange } from '@angular/material/radio';
import { Mantent, ModalPpeFamilyService } from '../../../services/modal-ppe-family.service';
import { DataRealOwnerClientFamilyPPE, RealOwnerPPE } from '../../../../onboarding/models/real-owner';
import { RealOwnerPpeFamilyService } from '../../../services/storage-services/real-owner-ppe-family.service';
import { convertDate } from '../../../utils/datetime';
import { OnboardingService } from '../../../../onboarding/services/onboarding.service';
import { butonFunctionDis } from '../../../utils/disableOrEnabled';
import { ResourceProviderPPE } from '../../../../onboarding/models/resource-provider';
import { ERROR_MESSAGES } from '../../../../onboarding/constants/form-messages';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import moment from 'moment';

@Component({
  selector: 'app-ppe-section',
  standalone: false,
  templateUrl: './ppe-section.component.html',
  styleUrl: './ppe-section.component.scss'
})
export class PpeSectionComponent {
  @Input() showCountry: boolean = true;
  @Input() dataPPE!: RealOwnerPPE;
  @Input() mant: Mantent = {
    isMainten: false,
    allDisabled: false,
    config: {
      showPag: false,
      showEditAction: true,
      showDeleteAction: true,
      showViewAction: false,
      isSelected: false,
      multipleSelection: false,
      idName: 'tr_tempid',
      singleSelection: { show: false, title: '', propertyName: 'customProperty' }
    },
    fieldsDisabled: [],
    fieldsEnabled: [],
    butonsDisabled: []
  };
  @ViewChild('pickerBirthdate') pickerBirthdate!: MatDatepicker<Date>;
  private readonly fb = inject(FormBuilder);
  private readonly modalService = inject(ModalPpeFamilyService);
  private readonly familyPPEService = inject(RealOwnerPpeFamilyService);
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly catalogService = inject(CatalogsService);
  private readonly notificationService = inject(NotificationsService);
  private readonly notificationModalService = inject(NotificationModalService);
  profileForm: FormGroup = this.fb.nonNullable.group({
    ppe: ['', Validators.required],
    tppe: ['', Validators.required],
    positionHeld: ['', Validators.required],
    expirationDate: [''],
    fppe: ['', Validators.required],
  });
  relationships = signal<Array<Relationships>>([]);
  ppe = signal<boolean>(false);
  countPpe = signal<boolean>(false);
  addFppe = signal<boolean>(false);
  butonEnable: boolean = false;
  typeobj: number = 0;

  columnsFamily: Array<any> = [];
  dataFamily: Array<DataRealOwnerClientFamilyPPE> = [];

  birthDates = {
    startAt: new Date(),
    min: new Date(),
  };

  ngOnInit() {
    this.profileForm.valueChanges.subscribe(() => {
      this.unsavedChangesService.setUnsavedChanges(this.profileForm.dirty);
    });
    this.familyPPEService.clear();
    const bbRel = {
      bool: '',
      clientId: '',
      language: '',
    };
    this.catalogService.getRelationships(bbRel).subscribe(c => {
      this.relationships.set(c);
    });
    this.columnsFamily = [
      { name: 'rfc', title: 'RFC / NIF / TIN / NSS', show: true, type: 'string' },
      { name: 'curp', title: 'CURP', show: true, type: 'string' },
      { name: 'firstName', title: 'Primer Nombre', show: true, type: 'string' },
      { name: 'firstLastName', title: 'Primer Apellido', show: true, type: 'string' },
      { name: 'relationship', title: 'Parentesco', show: true, type: 'string' },
      { name: 'positionHeld', title: 'Cargo Desempeñado', show: true, type: 'string' },
      { name: 'chargeDueDate', title: 'Fecha de Vencimiento del Cargo', show: true, type: 'string' },
    ];
    if (this.dataPPE) {
      if (this.dataPPE.ppe === true) {
        this.ppe.set(true);
      }
      if (this.dataPPE.fppe === true) {
        this.addFppe.set(true);
      }
      this.profileForm.patchValue({
        ppe: this.dataPPE.ppe,
        tppe: this.dataPPE.tppe,
        positionHeld: this.dataPPE.positionHeld,
        expirationDate: this.dataPPE.expirationDate,
        fppe: this.dataPPE.fppe,
      });
      this.familyPPEService.clear();
      this.dataPPE.dataFamily.forEach(elemet => this.familyPPEService.add(elemet));
      const dataFamily = this.familyPPEService.getAll();
      this.dataFamily = dataFamily.map(item => ({
        ...item,
        relationship: this.searchRelationshipNameById(item.relationship ?? ''),
        chargeDueDate: "" + convertDate(item.chargeDueDate),
      }));
    }
  }
  ngAfterViewInit() {
    this.profileForm.valueChanges.subscribe(() => {
      this.unsavedChangesService.setUnsavedChanges(this.profileForm.dirty);
    });
    console.log(this.mant.isMainten);
    console.log(this.mant.butonsDisabled);
    if (this.mant.isMainten === true) {
      if (this.mant.allDisabled === true) {
        this.butonEnable = true;
        butonFunctionDis(this.mant.butonsDisabled);
      }
    }
  }

  onSelectionChangeFppe(event: MatRadioChange<any>) {
    if (event.value === true) {
      this.addFppe.set(true);
    }
    if (event.value === false) {
      this.addFppe.set(false);
    }
  }

  onSelectionChangePpe(event: MatRadioChange<any>) {
    if (event.value === true) {
      this.ppe.set(true);
    }
    if (event.value === false) {
      this.ppe.set(false);
    }
  }

  fppe() {
    this.modalService.formModalDataPPE(this.mant, this.showCountry).subscribe((result) => {
      if (result != null) {
        if (this.familyPPEService.add(result)) {
          const dataFamily = this.familyPPEService.getAll();
          this.dataFamily = dataFamily.map(item => ({
            ...item,
            relationship: this.searchRelationshipNameById(item.relationship ?? ''),
            chargeDueDate: "" + convertDate(item.chargeDueDate)
          }));
          this.unsavedChangesService.setUnsavedChanges(true);
        } else {
          this.notificationService.error('Ya se encuentra una persona registrada con esa información');
        }
      }
    });
  }

  rowSelectedFppe(event: any): void {
  }

  async eventRowFppe(event: any): Promise<void> {
    if (event.type === 'edit') {
      this.modalService.formModalDataPPE(this.mant, this.showCountry, { ...event.row, relationship: this.searchRelationshipIdByName(event.row.relationship), chargeDueDate: convertDate(event.row.chargeDueDate) }).subscribe((result) => {
        if (this.mant.isMainten) {
          if (this.typeobj === 1) {
            if (result != null) {
              if (this.familyPPEService.update(event.row.id, { ...result, active: event.row.active,
                  personId: event.row.personId,
                  accountRoleId: event.row.accountRoleId,
                  idM:event.row.idM,
                  idS:event.row.idS})) {
                const dataFamily = this.familyPPEService.getAll();
                this.dataFamily = dataFamily.map(item => ({
                  ...item,
                  relationship: this.searchRelationshipNameById(item.relationship ?? ''),
                  chargeDueDate: "" + convertDate(item.chargeDueDate),
                }));
                this.unsavedChangesService.setUnsavedChanges(true);
              } else {
                this.notificationService.error('Error')
              }
            }
          } else if (this.typeobj === 2) {
            console.log(event.row);
            if (result != null) {
              if (this.familyPPEService.update(event.row.id, { ...result,
                idS: event.row.idS,
                accountRoleId: event.row.accountRoleId,
                active:event.row.active})) {
                const dataFamily = this.familyPPEService.getAll();
                this.dataFamily = dataFamily.map(item => ({
                  ...item,
                  relationship: this.searchRelationshipNameById(item.relationship ?? ''),
                  chargeDueDate: "" + convertDate(item.chargeDueDate),
                }));
                this.unsavedChangesService.setUnsavedChanges(true);
              } else {
                this.notificationService.error('Error')
              }
            }
          }
        } else {
          if (result != null) {
            if (this.familyPPEService.update(event.row.id, {...result, isView: event.row.isView, isSaved: event.row.isSaved})) {
              const dataFamily = this.familyPPEService.getAll();
              this.dataFamily = dataFamily.map(item => ({
                ...item,
                relationship: this.searchRelationshipNameById(item.relationship ?? ''),
                chargeDueDate: "" + convertDate(item.chargeDueDate),
              }));
              this.unsavedChangesService.setUnsavedChanges(true);
            } else {
              this.notificationService.error('Error')
            }
          }
        }
      });
    }
    if (event.type === 'delete') {
      if (this.dataFamily.length > 1) {
        const result = await this.notificationModalService.confirm({
          title: 'Confirmar eliminar el registro',
          btnAccept: 'Sí, eliminar',
          btnDeny: 'No',
        });
        if (result?.value === true) {
          if (this.familyPPEService.delete(event.row.id)) {
            this.notificationService.success('Borrado con éxito');
            const dataFamily = this.familyPPEService.getAll();
            this.dataFamily = dataFamily.map(item => ({
              ...item,
              relationship: this.searchRelationshipNameById(item.relationship ?? '')
            }));
            this.unsavedChangesService.setUnsavedChanges(true);
          }
        }
      } else {
        this.notificationService.error('Error no se pueden borrar todos los familiares PPE');
      }
    }
  }

  eventPageFppe(event: PageEvent): void {
  }


  onSubmit(): RealOwnerPPE | null {

    document.body.classList.add('show-validation');
    Object.keys(this.profileForm.controls).forEach(controlName => {
      const control = this.profileForm.get(controlName);
      control?.updateValueAndValidity();
    });
    this.unsavedChangesService.setUnsavedChanges(false);
    const dataFamily = this.familyPPEService.getAll();

    const tppe = this.profileForm.get('tppe');
    const positionHeld = this.profileForm.get('positionHeld');
    const expirationDate = this.profileForm.get('expirationDate');
    console.log(this.profileForm.get('ppe')?.value)
    console.log(this.profileForm.get('fppe')?.value)
    if (this.profileForm.get('ppe')?.value) {
      tppe?.setValidators([Validators.required]);
      positionHeld?.setValidators([Validators.required]);
      Object.keys(this.profileForm.controls).forEach(controlName => {
        const control = this.profileForm.get(controlName);
        control?.updateValueAndValidity();
      });
      console.log("IF 1",this.profileForm.valid)
      if (this.profileForm.valid || this.profileForm.disabled) {
        if (this.profileForm.get('fppe')?.value) {
          if (dataFamily.length > 0) {
            return {
              id: this.dataPPE?.id,
              ppe: true,
              tppe: tppe?.value,
              positionHeld: positionHeld?.value,
              expirationDate: expirationDate?.value,
              fppe: true,
              dataFamily: dataFamily,
            };
          } else {
            this.notificationService.error('Tiene Algún Familiar que sea Persona Políticamente Expuesta Está Marcado en Si Pero no Tiene Registro.')
            this.error();
            return null;
          }
        } else if (!this.profileForm.get('fppe')?.value) {
          return {
            ppe: true,
            tppe: tppe?.value,
            positionHeld: positionHeld?.value,
            expirationDate: expirationDate?.value,
            fppe: false,
            dataFamily: []
          };
        } else {
          this.notificationService.error('Faltan Campos Obligatorios por Capturar.')
          this.error();
          return null;
        }
      } else {
        if(this.profileForm.getRawValue().tppe?.trim() === '' 
          || this.profileForm.getRawValue().positionHeld?.trim() === ''){
            this.notificationService.error('Faltan campos obligatorios por capturar')
            this.unsavedChangesService.setUnsavedChanges(true);
            this.error();
            return null;
          }
          if (this.profileForm.getRawValue().expirationDate) {
            const dobValue = this.profileForm.getRawValue().expirationDate
            const dob = moment(dobValue);
            const today = moment().startOf('day');
            if (dob.isBefore(today, 'day')) {
              this.error();
              this.notificationService.error('Fecha de Vencimiento de Cargo no Válida');
              return null;
            }
          }
        return null;
      }
    } else if (!this.profileForm.get('ppe')?.value) {
      tppe?.clearValidators();
      positionHeld?.clearValidators();
      expirationDate?.clearValidators();
      Object.keys(this.profileForm.controls).forEach(controlName => {
        const control = this.profileForm.get(controlName);
        control?.updateValueAndValidity();
      });
      console.log("IF 2",this.profileForm.valid)
      if (this.profileForm.valid || this.profileForm.disabled) {
        if (this.profileForm.get('fppe')?.value) {
          if (dataFamily.length > 0) {
            return {
              ppe: false,
              tppe: tppe?.value,
              positionHeld: positionHeld?.value,
              expirationDate: expirationDate?.value,
              fppe: true,
              dataFamily: dataFamily
            };
          } else {
            this.notificationService.error('Tiene Algún Familiar que sea Persona Políticamente Expuesta Está Marcado en Si Pero no Tiene Registro.')
            this.error();
            return null;
          }
        } else if (!this.profileForm.get('fppe')?.value) {
          return {
            ppe: false,
            tppe: tppe?.value,
            positionHeld: positionHeld?.value,
            expirationDate: expirationDate?.value,
            fppe: false,
            dataFamily: []
          };
        } else {
          this.notificationService.error(ERROR_MESSAGES.MISSING_FIELDS)
          this.error();
          return null;
        }
      } else {
        this.notificationService.error(ERROR_MESSAGES.MISSING_FIELDS)
        this.error();
        return null;
      }
    } else {
      this.notificationService.error(ERROR_MESSAGES.MISSING_FIELDS)
      this.error();
      return null;
    }
  }

  setData(data: Array<DataRealOwnerClientFamilyPPE>) {
    this.dataFamily = data.map(item => ({
      ...item,
      relationship: this.searchRelationshipNameById(item.relationship ?? '')
    }));
  }

  searchRelationshipNameById(id: string): string {
    const relationships = this.relationships();
    const relationship = relationships.find(rela => rela.idParent === id);
    return relationship ? relationship.kinShip : '';
  }

  searchRelationshipIdByName(name: string): string {
    const relationships = this.relationships();
    const relationship = relationships.find(rela => rela.kinShip === name);
    return relationship ? relationship.idParent : '';
  }

  error(): void {
    Object.values(this.profileForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsTouched();
      }
    });
  }

  setDataRealOwnerPPE(data: RealOwnerPPE) {
    this.typeobj = 1;
    if (data.ppe === true) {
      this.ppe.set(true);
    }
    if (data.fppe === true) {
      this.addFppe.set(true);
    }
    this.profileForm.patchValue({
      ppe: data.ppe,
      tppe: data.tppe,
      positionHeld: data.positionHeld,
      expirationDate: data.expirationDate,
      fppe: data.fppe,
    });
    this.familyPPEService.clear();
    data.dataFamily.forEach(elemet => this.familyPPEService.add(elemet));
    const dataFamily = this.familyPPEService.getAll();
    console.log("DATOS SEÑAL",dataFamily);
    this.dataFamily = dataFamily.map(item => ({
      ...item,
      active: item.active,
      personId: item.personId,
      idM:item.idM,
      idS:item.idS,
      accountRoleId: item.accountRoleId,
      relationship: this.searchRelationshipNameById(item.relationship ?? ''),
      chargeDueDate: "" + convertDate(item.chargeDueDate),
    }));
  }

  setDataResourceProviderPPE(data: ResourceProviderPPE) {
    this.typeobj = 2;
    if (data.ppe === true) {
      this.ppe.set(true);
    }
    if (data.fppe === true) {
      this.addFppe.set(true);
    }
    this.profileForm.patchValue({
      ppe: data.ppe,
      tppe: data.tppe,
      positionHeld: data.positionHeld,
      expirationDate: data.expirationDate,
      fppe: data.fppe,
    });
    this.familyPPEService.clear();
    data.dataFamily.forEach(elemet => this.familyPPEService.add(elemet));
    const dataFamily = this.familyPPEService.getAll();
    console.log("DATOS SEÑAL",dataFamily);
    this.dataFamily = dataFamily.map(item => ({
      ...item,
      idS: item.idS,
      active: item.active,
      accountRoleId: item.accountRoleId,
      relationship: this.searchRelationshipNameById(item.relationship ?? ''),
      chargeDueDate: "" + convertDate(item.chargeDueDate),
    }));
  }
  onDateInput(event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
    const date = event.value;
    console.log(date);
    const control = this.profileForm.get('expirationDate');

    if (date instanceof Date && control && this.pickerBirthdate) {
      this.pickerBirthdate.select(date); 
    }
  }
}
