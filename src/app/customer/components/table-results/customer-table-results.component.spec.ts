import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableResultsComponent } from './customer-table-results.component';
import { DateAdapter } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter'; // If using Moment.js
import { SharedModule } from '../../../shared/shared.module';
import { CoreModule } from '../../../core/core.module';

describe('CustomerTableResultsComponent', () => {
  let component: TableResultsComponent;
  let fixture: ComponentFixture<TableResultsComponent>;

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
  });

  afterEach(() => {
    // component.selection.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

//   it('should initialize displayed columns correctly', () => {
//     component.columns = [
//         {
//             name: 'Column1',
//             title: 'Column 1',
//             show: true,
//             type: ''
//         }, {
//             name: 'Column1',
//             title: 'Column 2',
//             show: true,
//             type: ''
//         }, {
//             name: 'Column1',
//             title: 'Column 3',
//             show: true,
//             type: ''
//         }
//     ];
//     component.config = { showPag: false, showViewAction: false, showEditAction: true, showDeleteAction: true, multipleSelection: true };

//     // component.ngOnInit();

//     expect(component.displayedColumns).toEqual(['select', 'Column 1', 'Column 2', 'Column 3', 'acciones']);
//   });

//   it('should select all rows when toggleAllRows is called', () => {
//     component.dataSource.data = [{ id: 1 }, { id: 2 }];
//     component.toggleAllRows();

//     expect(component.selection.selected.length).toBe(2);
//   });

//   it('should clear selection when toggleAllRows is called and all rows are selected', () => {
//     component.dataSource.data = [{ id: 1 }, { id: 2 }];
//     component.selection.select(...component.dataSource.data);

//     component.toggleAllRows();

//     expect(component.selection.selected.length).toBe(0);
//   });

//   it('should emit multipleRows when toggling all rows', () => {
//     spyOn(component.multipleRows, 'emit');
//     component.dataSource.data = [{ id: 1 }, { id: 2 }];

//     component.toggleAllRows();

//     expect(component.multipleRows.emit).toHaveBeenCalledWith(component.selection.selected);
//   });

//   it('should emit rowSelect event when a row is selected', () => {
//     spyOn(component.rowSelect, 'emit');
//     const row = { id: 1, customerNumber: '1234' };
//     const columns = ['Column 1', 'Column 2'];

//     component.selectRow(row, columns);

//     expect(component.rowSelect.emit).toHaveBeenCalledWith({ row, columns });
//     expect(component.highlighted).toBe('1234');
//   });

//   it('should emit eventRow with edit type when editEvent is called', () => {
//     spyOn(component.eventRow, 'emit');
//     const row = { id: 1 };

//     component.editEvent(row);

//     expect(component.eventRow.emit).toHaveBeenCalledWith({ type: 'edit', row });
//   });

//   it('should emit eventRow with delete type when deleteEvent is called', () => {
//     spyOn(component.eventRow, 'emit');
//     const row = { id: 1 };

//     component.deleteEvent(row);

//     expect(component.eventRow.emit).toHaveBeenCalledWith({ type: 'delete', row });
//   });

//   it('should handle page event', () => {
//     spyOn(component.eventPage, 'emit');
//     const pageEvent = { pageIndex: 1, pageSize: 5, length: 10 };

//     component.handlePageEvent(pageEvent);

//     expect(component.eventPage.emit).toHaveBeenCalledWith(pageEvent);
//   });

//   it('should check if all rows are selected', () => {
//     component.dataSource.data = [{ id: 1 }, { id: 2 }];
//     component.selection.select(...component.dataSource.data);

//     expect(component.isAllSelected()).toBeTrue();
//   });

//   it('should return false for isAllSelected when not all rows are selected', () => {
//     component.dataSource.data = [{ id: 1 }, { id: 2 }];
//     component.selection.select(component.dataSource.data[0]);

//     expect(component.isAllSelected()).toBeFalse();
//   });

});




