import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColumnsDataTable, ConfigDataTable } from '../../table-results/interfaces';
import { NotificationsService } from '../../../services/notifications.service';
import { SearchClientFlowService } from '../../../services/search-client-flow.service';
import { SearchCustomerV2Component } from '../../search-customer-v2/search-customer-v2.component';
import { SearchedClient } from '../../../../onboarding/models/searched-client';

@Component({
  selector: 'app-modal-search-client',
  standalone: false,
  templateUrl: './modal-search-client.component.html',
  styleUrl: './modal-search-client.component.scss'
})
export class ModalSearchClientComponent {

  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<ModalSearchClientComponent>);
  readonly notificationService = inject(NotificationsService);

  @ViewChild(SearchCustomerV2Component)
  searchComponent!: SearchCustomerV2Component;

  page = signal<number>(1);
  tableData = signal<any[]>([]);
  tableColumns: Array<ColumnsDataTable> = [];
  tableConfigs: ConfigDataTable =  {showPag: false, showEditAction: false, showDeleteAction: false, showViewAction: false, multipleSelection: false, idName: 'id' };
  response: any = null;

  ngOnInit() {

    console.log(this.tableData().length)
    this.tableColumns = [
      { name: 'clientNumber', title: 'Número de cliente', show: true, type: 'string' },
      { name: 'curp', title: 'CURP', show: true, type: 'string' },
      { name: 'rfc', title: 'RFC/NIF/NSS', show: true, type: 'string' },
      { name: 'firstName', title: 'Nombre', show: true, type: 'string' },
      { name: 'middleName', title: 'Segundo Nombre', show: true, type: 'string' },
      { name: 'lastName', title: 'Primer Apellido', show: true, type: 'string' },
      { name: 'secondLastName', title: 'Segundo Apellido', show: true, type: 'string' },
      { name: 'birthDate', title: 'Fecha de Nacimiento', show: true, type: 'string' },
    ];
  }



  constructor() {
    effect(() => {
      const currentPage = this.page();
      if (currentPage === 1) {
        this.dialogRef.updateSize('38vw');
      } else {
        this.dialogRef.updateSize('80vw');
      }
    });
  }

  async search() {
    const responseList = await this.searchComponent.submit(true);
    console.log('response')
    console.log(responseList);
    this.nextPage(responseList);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  nextPage(items: any) {
    console.log('mostrando en tabla')
    console.log(items.results)

    if (items.results && items.results.length > 0) {


      this.tableData.set(items.results.map((i: any) => ({
        ...i,
        id: crypto.randomUUID()
      }))
      );
      this.page.set(2);
    } else {
      this.notificationService.error('No se encontraron datos en la búsqueda')
    }

  }


  async add() {
    if (this.response == null) {
      this.notificationService.error('Debes Seleccionar un Cliente para Poder Agregarlo')
      return
    }
    console.log('buscando al cliente')
    console.log(this.response)
    this.dialogRef.close(this.mapToResponse(this.response.row));
  }

  selectItem(event: any) {
    this.response = event;
  }

  mapToResponse(client: any): SearchedClient{
    return {
      clientNumber: client.clientNumber,
      curp: client.curp,
      rfc: client.rfc,
      birthDate: client.birthDate,
      firstName: client.firstName,
      middleName: client.middleName,
      firstLastName: client.lastName,
      secondLastName: client.secondLastName
    }
  }
}
