import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Countries } from '../../../models/country';
import { CatalogsService } from '../../../../shared/services/catalogs.service';
import { ColumnsDataTable, ConfigDataTable } from '../../../../shared/components/table-results/interfaces';
import { FullPersonControl, SelectedPerson } from '../../../models/person-control';
import { ERROR_MESSAGES } from '../../../constants/form-messages';
import { Entity } from '../../../models/entity';


@Component({
  selector: 'app-control-person-modal',
  standalone: false,
  templateUrl: './control-person-modal.component.html',
  styleUrl: './control-person-modal.component.scss'
})
export class ControlPersonModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly notificationService = inject(NotificationsService);
  private readonly catalogsService = inject(CatalogsService);

  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ControlPersonModalComponent>);
  readonly id = crypto.randomUUID()

  personData = signal<FullPersonControl[]>([]);
  personColumns: Array<ColumnsDataTable> = [];
  personConfigs: ConfigDataTable = { showPag: false, showEditAction: false, showDeleteAction: false, showViewAction: false, multipleSelection: false };
  selectedPerson: FullPersonControl | null = null;
  countryOfBirth: String = '';

  form: FormGroup = this.fb.group({
    personType: ['', Validators.required],
    curp: [{ value: '', disabled: true}],
    firstName: [{ value: '', disabled: true}],
    secondName: [{ value: '', disabled: true}],
    firstLastName: [{ value: '', disabled: true}],
    secondLastName: [{ value: '', disabled: true}],
    birthday: [{ value: '', disabled: true}],
    birthCountry: [{ value: '', disabled: true}],
    birthFederativeEntity: [{ value: '', disabled: true}],
  });

  countries = signal<Array<Countries>>([]);
  states = signal<Entity[]>([]);
  personType: string[] = ['Accionista o socio', 'Administrador que ejerce el control', 'Otro']
  ngOnInit() {
    this.catalogsService.getCountry({ land: [] }).subscribe(c => {
      this.countries.set(c);
    });
    this.catalogsService.getFederalEntity({ land1s: ["MX"] }).subscribe(c => {
      this.states.set(c);
    });
    this.personColumns = [
      { name: 'firstName', title: 'Primer Nombre', show: true, type: 'string' },
      { name: 'secondName', title: 'Segundo Nombre', show: true, type: 'string' },
      { name: 'firstLastName', title: 'Primer Apellido', show: true, type: 'string' },
      { name: 'secondLastName', title: 'Segundo Apellido', show: true, type: 'string' },
      { name: 'nationality', title: 'Nacionalidad', show: true, type: 'string' },
    ]

    if (this.data.content) {
      console.log(this.data.content);
      this.personData.set(this.data.content);
    }
    if(this.data.isNotEditable){
      this.form.disable()
    }
  }

  onSubmit() {
    if (this.form.valid){
      if(this.selectedPerson){
        const response: SelectedPerson = {
          id: crypto.randomUUID(),
          personType: this.form.value.personType,
          ...this.selectedPerson,
        };
        this.dialogRef.close(response)
      }else {
        this.notificationService.error(ERROR_MESSAGES.AT_LEAST_ONE_OPTION_IS_REQUIRED);
      }
    }else {
      document.body.classList.add('show-validation');
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
      this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS)
    }
  }

  eventSelectPerson(event: any) {
    const personDetail = event.row
    console.log(personDetail)
    this.form.patchValue({
      curp: personDetail.curp,
      firstName: personDetail.firstName,
      secondName: personDetail.secondName,
      firstLastName: personDetail.firstLastName,
      secondLastName: personDetail.secondLastName,
      birthday: personDetail.dateOfBirth ? this.parseDate(personDetail.dateOfBirth) : '',
      birthCountry: personDetail.countryOfBirth,
      birthFederativeEntity: personDetail.stateOfBirth,
    })
    this.selectedPerson = personDetail;
    if(this.selectedPerson){

       this.selectedPerson.nationalityId = personDetail.nationality ?? '';
       this.selectedPerson.nationalityName = this.countries().find(item => item.countryId === this.selectedPerson?.nationalityId)?.country ?? '';
    }

    this.countryOfBirth = personDetail.countryOfBirth;
  }

  close(): void {
    this.dialogRef.close();
  }

  parseDate(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-');
    return new Date(+year, +month - 1, +day);;
  }
}
