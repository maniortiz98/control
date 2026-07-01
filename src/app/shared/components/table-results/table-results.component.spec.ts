import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleChange } from '@angular/core';
import { TableResultsComponent } from './table-results.component';
import { DateAdapter } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter'; // If using Moment.js
import { SharedModule } from '../../shared.module';
import { CoreModule } from '../../../core/core.module';
import { ConfigDataTable, ColumnsDataTable } from './interfaces';
import { PageEvent } from '@angular/material/paginator';

describe('TableResultsComponent', () => {
  let component: TableResultsComponent;
  let fixture: ComponentFixture<TableResultsComponent>;
  let baseConfig: ConfigDataTable;
  let baseColumns: ColumnsDataTable[];

  const createChanges = (changes: Record<string, { previousValue: unknown; currentValue: unknown; firstChange?: boolean }>) => {
    return Object.entries(changes).reduce((acc, [key, value]) => {
      acc[key] = new SimpleChange(
        value.previousValue,
        value.currentValue,
        value.firstChange ?? false,
      );
      return acc;
    }, {} as any);
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableResultsComponent],
      imports: [
        CoreModule,
        SharedModule,
      ],
      providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TableResultsComponent);
    component = fixture.componentInstance;

    baseColumns = [
      { name: 'customerNumber', title: 'Cliente', type: 'string', show: true },
      { name: 'name', title: 'Nombre', type: 'string', show: true },
      { name: 'hidden', title: 'Oculta', type: 'string', show: false },
    ];

    baseConfig = {
      showPag: true,
      showViewAction: true,
      showEditAction: false,
      showDeleteAction: false,
      multipleSelection: false,
      idName: 'customerNumber',
      singleSelection: { show: false, title: '', propertyName: 'selected' },
      isSelected: true,
      sort: false,
      pagConfig: {
        totalRows: 20,
        currentPage: 1,
        pageSize: 10,
        disabled: false,
        showFirstLastButtons: true,
        pageSizeOptions: [5, 10, 20],
        hidePageSize: false,
      },
    };
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize default idName and isSelected on init', () => {
    component.config = {
      ...baseConfig,
      idName: undefined,
      isSelected: undefined,
    };

    component.ngOnInit();

    expect(component.config.idName).toBe('tr_tempid');
    expect(component.config.isSelected).toBeTrue();
  });

  it('should build displayed columns and paginator config on config changes', () => {
    component.columns = baseColumns;
    component.config = {
      ...baseConfig,
      multipleSelection: true,
      showEditAction: true,
      singleSelection: { show: true, title: 'Seleccionar', propertyName: 'selected' },
    };

    component.ngOnChanges(createChanges({
      config: { previousValue: null, currentValue: component.config, firstChange: true },
      columns: { previousValue: [], currentValue: component.columns, firstChange: true },
    }));

    expect((component as any).displayedColumns).toEqual([
      'select',
      'customerNumber',
      'name',
      'radio',
      'acciones',
    ]);
    expect((component as any).configPag).toEqual(component.config.pagConfig);
  });

  it('should create temporary ids and remove inactive rows when data changes', () => {
    component.config = {
      ...baseConfig,
      idName: 'tr_tempid',
    };
    component.data = [
      { customerNumber: '001', name: 'Activo' },
      { customerNumber: '002', name: 'Inactivo', active: false },
    ];

    component.ngOnChanges(createChanges({
      config: { previousValue: null, currentValue: component.config, firstChange: true },
      data: { previousValue: [], currentValue: (component as any).dataSource.data, firstChange: true },
    }));

    expect((component as any).dataSource.data.length).toBe(1);
    expect((component as any).dataSource.data[0].tr_tempid).toEqual(jasmine.any(String));
    expect((component as any).dataSource.data[0].active).toBeTrue();
  });

  it('should apply the filter input on changes', () => {
    component.filter = 'juan';

    component.ngOnChanges(createChanges({
      filter: { previousValue: '', currentValue: 'juan', firstChange: false },
    }));

    expect((component as any).dataSource.filter).toBe('juan');
  });

  it('should emit rowSelect and highlight the row when selecting a row', () => {
    spyOn(component.rowSelect, 'emit');
    const row = { customerNumber: '1234', name: 'Cliente' };
    component.config = { ...baseConfig, idName: 'customerNumber' };
    const columns = baseColumns;

    (component as any).selectRow(row, columns);

    expect(component.rowSelect.emit).toHaveBeenCalledWith({ row, columns });
    expect((component as any).highlighted).toBe('1234');
  });

  it('should not emit rowSelect when component is readOnly', () => {
    spyOn(component.rowSelect, 'emit');
    component.readOnly = true;

    (component as any).selectRow({ customerNumber: '1234' }, baseColumns);

    expect(component.rowSelect.emit).not.toHaveBeenCalled();
  });

  it('should select all rows and clear selection with public methods', () => {
    (component as any).dataSource.data = [{ id: 1 }, { id: 2 }];

    component.selectAll();
    expect((component as any).selection.selected.length).toBe(2);

    component.deselectAll();
    expect((component as any).selection.selected.length).toBe(0);
  });

  it('should toggle all rows and emit selected rows', () => {
    spyOn(component.multipleRows, 'emit');
    (component as any).dataSource.data = [{ id: 1 }, { id: 2 }];

    (component as any).changeSelectAll(true);

    expect((component as any).selection.selected.length).toBe(2);
    expect(component.multipleRows.emit).toHaveBeenCalledWith((component as any).selection.selected);
  });

  it('should emit page changes', () => {
    spyOn(component.eventPage, 'emit');
    const pageEvent: PageEvent = {
      pageIndex: 1,
      previousPageIndex: 0,
      pageSize: 10,
      length: 100,
    };

    (component as any).handlePageEvent(pageEvent);

    expect(component.eventPage.emit).toHaveBeenCalledWith(pageEvent);
  });

  it('should emit row action events', () => {
    spyOn(component.eventRow, 'emit');
    const row = { id: 1 };

    (component as any).viewEvent(row);
    expect(component.eventRow.emit).toHaveBeenCalledWith({ type: 'view', row });

    (component as any).editEvent(row);
    expect(component.eventRow.emit).toHaveBeenCalledWith({ type: 'edit', row });

    (component as any).deleteEvent(row);
    expect(component.eventRow.emit).toHaveBeenCalledWith({ type: 'delete', row });
  });

});
