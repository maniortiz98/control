import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent, } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ColumnsDataTable, ConfigDataTable, PagConfig } from './interfaces';
import { StrTempId } from '../../utils/string';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-table-results',
  standalone: false,
  templateUrl: './table-results.component.html',
  styleUrl: './table-results.component.scss',
})
export class TableResultsComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild(MatSort) sort!: MatSort;

  private _data: any[] = []
  @Input('data') set data(value: any[]) {
    this.dataSource.data = value ?? [];
  }

  @Input('columns') columns: Array<ColumnsDataTable> = [];
  @Input() readOnly: boolean = false;
  @Input('config') config: ConfigDataTable = {
    showPag          : false,
    showEditAction   : true,
    showDeleteAction : true,
    showViewAction   : true,
    multipleSelection: false,
    idName           : 'tr_tempid',
    singleSelection  : { show: false, title: '', propertyName: 'customProperty' },
    isSelected       : true,
    sort             : false,
    pagConfig        : {
      totalRows           : 0,
      currentPage         : 0,
      pageSize            : 5,
      disabled            : false,
      showFirstLastButtons: true,
      pageSizeOptions     : [5, 10],
      hidePageSize        : false,
    },
  };
  @Input('filter') filter: string = '';

  @Output() rowSelect = new EventEmitter<any>();
  @Output() eventRow = new EventEmitter<{ type: string; row: any }>();
  @Output() eventPage = new EventEmitter<PageEvent>();
  @Output() multipleRows = new EventEmitter<Array<any>>();

  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(
    new MatPaginatorIntl(),
    ChangeDetectorRef.prototype
  );

  protected displayedColumns: Array<any> = [];
  protected dataSource = new MatTableDataSource<any>();

  /** used for multiple selection. Stores selected rows. */
  protected selection = new SelectionModel<any>(true, []);

  /**
   * Values for Paginator
   */
  protected configPag: PagConfig = {
    totalRows           : 0,
    currentPage         : 0,
    pageSize            : 5,
    disabled            : false,
    showFirstLastButtons: true,
    pageSizeOptions     : [5, 10],
    hidePageSize        : false,
  };

  private selectedRow: any;
  protected highlighted: string = '';

  constructor(private cdr: ChangeDetectorRef) {
    this.config.pagConfig = this.configPag;
  }

  /**
   * On Init
   */
  ngOnInit(): void {
    // setting default datatable configuration
    this.config.idName = this.config.idName ?? 'tr_tempid';
    this.config.isSelected = this.config.isSelected ?? true;

    // console.log(this.config);
  }

  /**
   * After View Init
   *
   * used to initialize paginator.
   * if doubt, see angular material documentation xD
   */
  ngAfterViewInit() {
    if (this.config.showPag) {
      this.dataSource.paginator = this.paginator;
    }

    if ( this.config.sort ) {
      this.dataSource.sort = this.sort;
    }
  }

  /**
   *
   */
  ngOnChanges(changes: SimpleChanges): void {

    console.log(changes);
    // console.log(changes['data']);
    // console.log(changes['config']);
    // console.log(changes['columns']);

    if ( changes['config'] || changes['columns'] ) {
      this.displayedColumns.length = 0;
      if (this.config.multipleSelection) {
        this.displayedColumns.push('select');
      }
      this.columns.forEach((c: ColumnsDataTable) => {
        if ( c.show ) {
          this.displayedColumns.push(c.name);
        }
      });
      if ( this.config.singleSelection?.show ) {
        this.displayedColumns.push('radio');
      }
      if ( this.config.showEditAction || this.config.showDeleteAction || this.config.showViewAction ) {
        this.displayedColumns.push('acciones');
      }

      if ( changes['config']['currentValue']['showPag'] && changes['config']['currentValue']['pagConfig']) {
        this.configPag = changes['config']['currentValue']['pagConfig'];
        console.log(this.configPag);
      } else {
        this.configPag = {
          totalRows           : 0,
          currentPage         : 0,
          pageSize            : 5,
          disabled            : false,
          showFirstLastButtons: true,
          pageSizeOptions     : [5, 10],
          hidePageSize        : false,
        };
      }

      if ( changes['config']['currentValue']['sort'] ) {
        this.dataSource.sort = this.sort;
      } else {
        this.dataSource.sort = null;
      }
    }

    if ( changes['data'] ) {
      if ( 'tr_tempid' === this.config.idName || '' === this.config.idName?.trim() ) {
        this.createTempId(this.dataSource.data);
      }
    }
    if (changes['data'] || changes['config']) {
      this.buildTable();
    }
    // console.log(this.config);

    if ( changes['filter'] ) {
      this.dataSource.filter = this.filter;
    }
  }

  /**
   *
   */
  private buildTable(): void {
    const saveWord = this.config?.saveWord ?? 'active';
    const rows = (this.dataSource.data ?? [])
      .map(row => {
        const hasActive = Object.prototype.hasOwnProperty.call(row, saveWord);
        return hasActive ? row : { ...row, active: true };
      })
      .filter(row => row.active !== false);

    this.dataSource.data = rows;
  }

  /**
   * DeSelect all rows.
   *
   * Public method to extrernally DESELECT all rows from table
   */
  public deselectAll(): void {
    this.selection.clear();
  }

  /**
   * Select all rows.
   *
   * Public method to extrernally SELECT all rows from table
   */
  public selectAll(): void {
    console.log(this.dataSource.data);
    console.log(this.selection);
    this.selection.select(...this.dataSource.data);

  }

  /**
   *
   */
  protected isRowChecked(row: any): boolean {
    const propertyName = this.config?.singleSelection?.propertyName;
    return propertyName ? !!row[propertyName] : false;
  }

  /** Whether the number of selected elements matches the total number of rows.
   * Multiple Selection
   */
  protected isAllSelected(): boolean {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection.
   * Multiple Selection
   */
  private toggleAllRows(): any {
    console.log(this.isAllSelected());
    if (this.isAllSelected()) {
      this.selection.clear();
      this.multipleRows.emit(this.selection.selected);
      return;
    }
    this.selection.select(...this.dataSource.data);
    this.multipleRows.emit(this.selection.selected);
  }

  /** The label for the checkbox on the passed row.
   * Multiple Selection
   */
  protected checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }

  /** Multiple Selection */
  protected selectCheck(event: any): void {
    event.stopPropagation();
    this.multipleRows.emit(this.selection.selected);
  }

  /**
   *
   * @param event
   */
  protected changeSelectAll(event: any): void {
    console.log(event);
    if (event) {
      this.toggleAllRows();
    }
  }

  /**
   *
   */
  protected selectRow(row: any, columns: any): void {
    if (this.readOnly) return
    const id = this.config.idName ?? 'tr_tempid';
    this.highlighted = row[id];
    this.selectedRow = row;
    // console.log(id);
    // console.log(this.highlighted);
    // console.log(this.selectedRow);
    this.rowSelect.emit({ row, columns });
    this.cdr.detectChanges();
  }

  /**
   *
   * @param e
   */
  protected handlePageEvent(e: PageEvent) {
    console.log(e);
    // console.log(this.configPag.pageSizeOptions);
    /* this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex; */
    this.eventPage.emit(e);
  }

  /**
   * Ths method it's used to emit the data and EDIT event.
   */
  protected viewEvent(row: any): void {
    // console.log(this.config);
    this.eventRow.emit({ type: 'view', row });
  }

  /**
   * Ths method it's used to emit the data and EDIT event.
   */
  protected editEvent(row: any): void {
    // console.log(this.config);
    this.eventRow.emit({ type: 'edit', row });
  }

  /**
   * Ths method it's used to emit the data and DELETE event.
   */
  protected deleteEvent(row: any): void {
    this.eventRow.emit({ type: 'delete', row });
  }

  /**
   * Agrega un atributo a cada objeto del array de datos, cuando no se especifique
   * una columna ID
   */
  protected createTempId(data: any[]): void {
    this.dataSource.data = data.map((item: any) => {
      return { ...item, tr_tempid: StrTempId() };
    });
  }
}
