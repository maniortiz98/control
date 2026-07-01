import { Component, inject, signal } from '@angular/core';
import { EquityStrategyItem } from '../../../models/equity-stategy';
import { ColumnsDataTable, ConfigDataTable } from '../../../../shared/components/table-results/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { EquityModalComponent } from './equity-modal/equity-modal.component';
import { firstValueFrom, Observable } from 'rxjs';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { SUCCESS_MESSAGES } from '../../../../onboarding/constants/form-messages';
import { CatalogsService } from '../../../../shared/services/catalogs.service';

@Component({
  selector: 'app-equity-strategy',
  standalone: false,
  templateUrl: './equity-strategy.component.html',
  styleUrl: './equity-strategy.component.scss'
})
export class EquityStrategyComponent {

  equityStrategyList = signal<any[]>([]);
  equityStrategyColumns: Array<ColumnsDataTable> = [];
  equityStrategyConfigs: ConfigDataTable = { showPag: false, showEditAction: true, showDeleteAction: true, showViewAction: false, multipleSelection: false };
  private readonly dialog = inject(MatDialog);
  private readonly catalogsService = inject(CatalogsService);
  private readonly notificationService = inject(NotificationsService);

  ngOnInit() {
    this.refreshList();
    this.equityStrategyColumns = [
      { name: 'idStrategy', title: 'Registro No.', show: true, type: 'string' },
      { name: 'description', title: 'Descripción', show: true, type: 'string' },
      { name: 'active', title: 'Estatus', show: true, type: 'string' },
      { name: 'minimumAmount', title: 'Monto mínimo', show: true, type: 'string' }
    ]
  }

  async eventRowEquityStrategy(event: any) {
    if (event.type === 'edit') {
      await this.editEquityStrategy(event);
    } else if (event.type === 'delete') {
      await this.deleteEquityStrategy(event);
    }
  }

  async showEquityStrategyModal() {
    const responseModal = await firstValueFrom(this.callEquityModal());
    if (responseModal != undefined) {
      const payload = { ...responseModal, active: !!responseModal.active };
      this.catalogsService.createStrategyEquity(payload).subscribe(() => {
        this.refreshList(true);
        this.notificationService.success(SUCCESS_MESSAGES.ADDED_ELEMENT, SUCCESS_MESSAGES.ADDED_ELEMENT_CATALOG);
      });
    }
  }

  async editEquityStrategy(event: any) {
    const itemToEdit = { ...event.row, active: event.row.active === 'ACTIVO' };
    const responseModal = await firstValueFrom(this.callEquityModal(itemToEdit.idStrategy, itemToEdit as any));
    if (responseModal != undefined) {
      const payload = { ...responseModal, active: !!responseModal.active };
      this.catalogsService.updateStrategyEquity(payload).subscribe(() => {
        this.refreshList(true);
        this.notificationService.success(SUCCESS_MESSAGES.UPDATE_ELEMENT, SUCCESS_MESSAGES.UPDATE_ELEMENT_CATALOG);
      });
    }
  }

  async deleteEquityStrategy(event: any) {
    const itemToDelete = event.row;
    this.catalogsService.deleteStrategyEquity(itemToDelete.idStrategy).subscribe(() => {
      this.refreshList(true);
      this.notificationService.success('Elemento eliminado', 'El elemento se ha eliminado correctamente del catálogo');
    });
  }

  private refreshList(forceRefresh: boolean = false) {
    this.catalogsService.getStrategiesEquity(forceRefresh).subscribe((data: EquityStrategyItem[]) => {
      const tableData = data.map(item => {
        const row: any = { ...item };
        row.active = item.active ? 'ACTIVO' : 'INACTIVO';
        return row;
      });
      this.equityStrategyList.set(tableData);
    });
  }

  private callEquityModal(id?: number, content?: EquityStrategyItem):
    Observable<EquityStrategyItem | undefined> {
    const dialogRef = this.dialog.open(EquityModalComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '58vw',
      height: '56vh',
      data: {
        content,
        id
      }
    });
    return dialogRef.afterClosed();
  }
}
