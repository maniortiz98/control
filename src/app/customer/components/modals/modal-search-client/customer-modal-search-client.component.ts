import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerSearchCustomerComponent } from '../../search-customer/customer-search-customer.component';
import { ColumnsDataTable, ConfigDataTable } from '../../../models/customer-table-interfaces';
import { CustomerNotificationsService } from '../../../services/customer-notifications.service';
import { CustomerSearchClientFlowService } from '../../../services/customer-search-client-flow.service';
import { CustomerSearchClientFlow } from '../../../models/customer-search-customer';
import { CustomerSearchCustomerV2Component } from '../../search-customer-v2/customer-search-customer-v2.component';
import { CustomerSearchedClient } from '../../../models/customer-searched-client';

@Component({
  selector: 'app-customer-modal-search-client',
  standalone: false,
  templateUrl: './customer-modal-search-client.component.html',
  styleUrl: './customer-modal-search-client.component.scss'
})
export class CustomerModalSearchClientComponent {

  readonly data = inject(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<CustomerModalSearchClientComponent>);
  readonly notificationService = inject(CustomerNotificationsService);
  private readonly searchClientFlowService = inject(CustomerSearchClientFlowService);

  @ViewChild(CustomerSearchCustomerV2Component)
  searchComponent!: CustomerSearchCustomerV2Component;

  page = signal<number>(1);
  tableData = signal<any[]>([]);
  tableColumns: Array<ColumnsDataTable> = [];
  tableConfigs: ConfigDataTable =  {showPag: false, showEditAction: false, showDeleteAction: false, showViewAction: false, multipleSelection: false, idName: 'id' };
  response: any = null;

  ngOnInit() {

    console.log(this.tableData().length)
    this.tableColumns = [
      { name: 'clientNumber', title: 'Número de cliente', show: true, type: '' },
      { name: 'curp', title: 'CURP', show: true, type: '' },
      { name: 'rfc', title: 'RFC/NIF/NSS', show: true, type: '' },
      { name: 'firstName', title: 'Nombre', show: true, type: '' },
      { name: 'middleName', title: 'Segundo Nombre', show: true, type: '' },
      { name: 'lastName', title: 'Primer Apellido', show: true, type: '' },
      { name: 'secondLastName', title: 'Segundo Apellido', show: true, type: '' },
      { name: 'birthDate', title: 'Fecha de Nacimiento', show: true, type: '' },
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

  mapToResponse(client: any): CustomerSearchedClient{
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






