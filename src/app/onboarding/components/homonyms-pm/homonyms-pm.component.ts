import { Component, inject, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { HomonymsService } from '../../../shared/services/homonyms.service';
import { HomonymsResponse } from '../../models/homonyms';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfigDataTable } from '../../../shared/components/table-results/interfaces';

@Component({
  selector: 'app-homonyms-pm',
  standalone: false,
  templateUrl: './homonyms-pm.component.html',
  styleUrl: './homonyms-pm.component.scss'
})
export class HomonymsPmComponent {
  private readonly dataHomonymService = inject(HomonymsService);
  private readonly dataSignal = signal<HomonymsResponse[] | null>(null);
  columnsData: Array<any> = [];
  dataClient: Array<HomonymsResponse> = [];
  dataClientSelected: Array<HomonymsResponse> = [];
  config: ConfigDataTable = {
    showPag: false,
    showViewAction: false,
    showEditAction: false,
    showDeleteAction: false,
    multipleSelection: true,
  };
  butonContinue: boolean = false;
  butonUnifi: boolean = false;

  constructor(private readonly modalRef: MatDialogRef<HomonymsPmComponent>) {

  }


  ngOnInit(): void {

    this.dataSignal.set(this.dataHomonymService.getData());
    this.dataClient = this.dataSignal() || [];
    console.log(this.dataClient);
    this.columnsData = [
      { name: 'typePerson', title: 'Tipo de Persona', show: true, type: 'string' },
      { name: 'nacio', title: 'Nacionalidad', show: true, type: 'string' },
      { name: 'name', title: 'Razón Social', show: true, type: 'string' },
      { name: 'date', title: 'Fecha de Constitución', show: true, type: 'string' },
      { name: 'rfc', title: 'RFC', show: true, type: 'string' },
      { name: 'nif', title: 'NIF', show: true, type: 'string' },
      { name: 'ein', title: 'EIN', show: true, type: 'string' },
    ];
  }

  rowSelected(event: any): void {
  }

  eventRow(event: any): void {
  }

  eventPage(event: PageEvent): void {
  }

  multipleRows(event: any): void {
    console.log("evento ", event)
    this.dataClientSelected = event;
    if (this.dataClientSelected.length === 1) {
      this.butonContinue = true;
      this.butonUnifi = false;
    } else if (this.dataClientSelected.length > 1) {
      this.butonContinue = false;
      this.butonUnifi = true;
    } else {
      this.butonContinue = false;
      this.butonUnifi = false;
    }
  }

  onButtonClickContinueDontSelect() {
    this.modalRef.close("continue");
  }

  onButtonClickUnifi() {
    console.log('Unificar');
    //TODO Aquí puedes agregar la lógica que desees ejecutar si se selecciona dos o mas
  }

  onButtonContinueClient() {
    console.log('Continuar con Cliente');
    //TODO Aquí puedes agregar la lógica que desees ejecutar si solo se selecciona uno
  }
}
