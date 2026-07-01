import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Bank } from '../../../models/bank';
import { EconomicActivity } from '../../../models/economic-activity';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { ERROR_MESSAGES } from '../../../constants/form-messages';
import { FormBase } from '../../../../shared/utils/form-base-class';
import { SpidCounterpart } from '../../../models/pm/spid-profile';
import { StrTempId } from '../../../../shared/utils/string';

@Component({
  selector: 'app-counterpart-modal',
  standalone: false,
  templateUrl: './counterpart-modal.component.html',
  styleUrl: './counterpart-modal.component.scss'
})
export class CounterpartModalComponent extends FormBase implements OnInit {

  readonly dialogRef                  = inject(MatDialogRef<CounterpartModalComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  private readonly NonNullformBuilder = inject(NonNullableFormBuilder);
  private readonly notificationService = inject(NotificationsService);

  override form: FormGroup = this.NonNullformBuilder.group({
    typeId          : new FormControl('1', {validators: [Validators.required]} ),
    id              : new FormControl('', [
      Validators.required,
      Validators.maxLength(15)
    ]),
    companyName     : new FormControl('', [
      Validators.required,
      Validators.maxLength(60)
    ]),
    economicActivity: new FormControl('', [Validators.required]),
    relationType    : new FormControl('', [Validators.required]),
    bank            : new FormControl('', [Validators.required]),
    clabe           : new FormControl('', [
      Validators.required,
      Validators.maxLength(30)
    ]),
    frecuency       : new FormControl('', [Validators.required]),
  });

  /**
   * Catalogs
   */
  bankList                : Bank[] = [];
  economicActivityList    : EconomicActivity[] = [];
  relationTypeList        : any[] = []; // TODO agregar relationType model cuando se tenga el catalogo
  frecuencyOperationsList : any[] = []; // TODO agregar model cuando se tenga el catalogo

  isEditting = false;
  counterPart: any;

  filteredEconomicActivities = signal<EconomicActivity[]>([]);
  economicActivityFilter = new FormControl('');

  constructor() {
    super();
    console.log(this.data);
    this.bankList                = this.data.bankList();
    this.economicActivityList    = this.data.economicActivityList();
    this.filteredEconomicActivities.set(this.data.economicActivityList());
    this.relationTypeList        = this.data.relationTypeList();
    this.frecuencyOperationsList = this.data.frecuencyOperationsList();

    this.isEditting = this.data.edit;
    this.counterPart = this.data.dataToEdit;

    if ( 'read' === this.data.permissions ) {
      this.form.disable();
    } else if ( 'write' === this.data.permissions ) {
      this.form.enable();
    }
    this.economicActivityFilter.valueChanges.subscribe(value => {
      const filterValue = value?.toLowerCase() || '';

      this.filteredEconomicActivities.set(
        this.economicActivityList.filter(item =>
          item.lineBusiness.toLowerCase().includes(filterValue)
        )
      );
    });
  }

  ngOnInit(): void {
    if ( this.isEditting ) {
      this.form.patchValue(this.counterPart);
    }
  }

  override  onSubmit(): void {
    document.body.classList.add('show-validation');
    const formvalue = this.form.value;
    console.log(formvalue);

    if ( this.validateRequiredFields() ) {
      this.notificationService.error(ERROR_MESSAGES.MISSING_INFO);
      return;
    }

    // TODO validar en listas de restriccion y homonimias

    const theTempId =  this.isEditting ? this.counterPart.tempId : StrTempId();

    const data: SpidCounterpart = {
      tempId: theTempId,
      ...formvalue
    };

    this.dialogRef.close({
      ok: true,
      data,
      edit: this.isEditting
    });
  }

  /**
   * Cancel/close the modal without data.
   */
  cancel(): void {
    const dd = {
      ok: false,
      data: null
    }
    this.dialogRef.close(dd);
  }
}
