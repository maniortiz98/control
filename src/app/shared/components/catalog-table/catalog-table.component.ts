import {
  Component, EventEmitter, Input, OnChanges, Output, SimpleChanges
} from '@angular/core';
import { ColumnsDataTable, ConfigDataTable } from '../table-results/interfaces';

@Component({
  selector: 'app-catalog-table',
  standalone: false,
  templateUrl: './catalog-table.component.html',
  styleUrl: './catalog-table.component.scss'
})
export class CatalogTableComponent implements OnChanges {

  @Input() data: any[] = [];
  @Input() columns: ColumnsDataTable[] = [];
  @Input() config: ConfigDataTable = {
    showPag: true,
    showEditAction: true,
    showDeleteAction: true,
    showViewAction: false,
    multipleSelection: false
  };

  @Output() eventRow = new EventEmitter<{ type: string; row: any }>();

  filteredData: any[] = [];
  pagedData:    any[] = [];
  searchTerm  = '';
  currentPage = 0;
  pageSize    = 5;
  totalPages  = 1;
  selectedRow: any = null;

  get visibleColumns(): ColumnsDataTable[] {
    return this.columns.filter(c => c.show !== false);
  }

  get hasActions(): boolean {
    return !!(this.config.showEditAction || this.config.showDeleteAction || this.config.showViewAction);
  }

  get pageSizes(): number[] {
    return this.config.itemPerPageOpt ?? [5, 10];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['config'] || changes['columns']) {
      this.pageSize = this.pageSizes[0] ?? 5;
      this.currentPage = 0;
      this.searchTerm = '';
      this.applyFilter();
    }
  }

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.currentPage = 0;
    this.applyFilter();
  }

  onPageSizeChange(event: Event): void {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.currentPage = 0;
    this.updatePage();
  }

  prevPage(): void {
    if (this.currentPage > 0) { this.currentPage--; this.updatePage(); }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) { this.currentPage++; this.updatePage(); }
  }

  onRowClick(row: any): void {
    this.selectedRow = row;
    this.eventRow.emit({ type: 'edit', row });
  }

  onEdit(event: Event, row: any): void {
    event.stopPropagation();
    this.selectedRow = row;
    this.eventRow.emit({ type: 'edit', row });
  }

  onDelete(event: Event, row: any): void {
    event.stopPropagation();
    this.eventRow.emit({ type: 'delete', row });
  }

  onView(event: Event, row: any): void {
    event.stopPropagation();
    this.eventRow.emit({ type: 'view', row });
  }

  private applyFilter(): void {
    const src = this.data ?? [];
    if (!this.searchTerm) {
      this.filteredData = [...src];
    } else {
      this.filteredData = src.filter(row =>
        this.visibleColumns.some(col =>
          String(row[col.name] ?? '').toLowerCase().includes(this.searchTerm)
        )
      );
    }
    this.updatePage();
  }

  min(a: number, b: number): number { return Math.min(a, b); }

  private updatePage(): void {
    this.totalPages = Math.max(1, Math.ceil(this.filteredData.length / this.pageSize));
    if (this.currentPage >= this.totalPages) this.currentPage = 0;
    const start = this.currentPage * this.pageSize;
    this.pagedData = this.filteredData.slice(start, start + this.pageSize);
  }
}
