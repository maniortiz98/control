
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableResultsTreeComponent } from './table-results-tree.component';
import { of } from 'rxjs';

describe('TableResultsTreeComponent', () => {
  let component: TableResultsTreeComponent;
  let fixture: ComponentFixture<TableResultsTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableResultsTreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableResultsTreeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize displayed columns on ngOnInit', () => {
    component.columns = [
      { field: 'id' },
      { field: 'nombre' }
    ];
    component.data = [{ id: 1, nombre: 'Test' }];

    component.ngOnInit();

    expect(component.displayedColumns).toEqual(['id', 'nombre', 'actions']);
    expect(component.dataSignal()).toEqual(component.data);
  });

  it('should update displayedColumns when columns change', () => {
    component.columns = [{ field: 'id' }];
    component.ngOnInit();

    component.columns = [{ field: 'id' }, { field: 'nombre' }];
    component.ngOnChanges({
      columns: {
        currentValue: component.columns,
        previousValue: null,
        firstChange: false,
        isFirstChange: () => false
      }
    });

    expect(component.displayedColumns).toEqual(['id', 'nombre', 'actions']);
  });

  it('should toggle parent selection', async () => {
    const row = { id: '1' };

    await component.onParentRowClick(row);
    expect(component.getSelectedParentId()).toBe('1');

    await component.onParentRowClick(row);
    expect(component.getSelectedParentId()).toBeNull();
  });

  it('should toggle child selection', async () => {
    const child = { id: 'C1' };

    await component.onChildRowClick(child);
    expect(component.getSelectedChildId()).toBe('C1');

    await component.onChildRowClick(child);
    expect(component.getSelectedChildId()).toBeNull();
  });

  it('should load children (sync array)', async () => {
    const parent = { id: 'P1' };
    component.loadChildren = () => [{ id: 'C1' }];

    await component.onParentRowClick(parent);

    expect(component.childrenOf(parent)).toEqual([{ id: 'C1' }]);
  });

  it('should load children (promise)', async () => {
    const parent = { id: 'P1' };
    component.loadChildren = () =>
      Promise.resolve([{ id: 'C1' }]);

    await component.onParentRowClick(parent);

    expect(component.childrenOf(parent)).toEqual([{ id: 'C1' }]);
  });

  it('should load children (observable)', async () => {
    const parent = { id: 'P1' };
    component.loadChildren = () => of([{ id: 'C1' }]);

    await component.onParentRowClick(parent);

    expect(component.childrenOf(parent)).toEqual([{ id: 'C1' }]);
  });

  it('should not reload children if already cached', async () => {
    const parent = { id: 'P1' };
    const spy = jasmine.createSpy().and.returnValue([{ id: 'C1' }]);

    component.loadChildren = spy;

    await component.onParentRowClick(parent);
    await component.onParentRowClick({ id: 'P1' });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should emit eventRow on checkbox change', () => {
    spyOn(component.eventRow, 'emit');

    const row = { id: '1', fideicomiso: false };

    component.onCheckboxChange('parent', row, 'fideicomiso', true);

    expect(component.eventRow.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        action: 'toggle',
        level: 'parent',
        field: 'fideicomiso',
        checked: true,
        row
      })
    );
    expect(row.fideicomiso).toBeTrue();
  });

  it('should emit eventRow on editRow()', () => {
    spyOn(component.eventRow, 'emit');
    const row = { id: 1 };

    component.editRow(row, 'parent');

    expect(component.eventRow.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        action: 'edit',
        level: 'parent',
        row
      })
    );
  });

  it('should emit eventRow on deleteRow()', () => {
    spyOn(component.eventRow, 'emit');
    const row = { id: 1 };

    component.deleteRow(row);

    expect(component.eventRow.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        action: 'delete',
        row
      })
    );
  });

  it('should emit eventRow on addRow()', () => {
    spyOn(component.eventRow, 'emit');

    const row = { id: 1 };
    component.addRow(row);

    expect(component.eventRow.emit).toHaveBeenCalledWith(
      jasmine.objectContaining({
        action: 'view',
        row
      })
    );
  });

  it('should update child in cache', () => {
    const parentId = 'P1';
    component.childrenByParent.set({
      P1: [{ id: 'C1', name: 'old' }]
    });

    component.updateChildInCache(parentId, { id: 'C1', name: 'new' });

    expect(component.getChildren('P1')[0].name).toBe('new');
  });

  it('should delete child in cache', () => {
    const parentId = 'P1';

    component.childrenByParent.set({
      P1: [{ id: 'C1' }]
    });

    component.deleteChildInCache(parentId, 'C1');

    expect(component.getChildren('P1').length).toBe(0);
  });

  it('should delete grandchild in cache', () => {
    const childId = 'C1';
    component.grandchildrenByChild.set({
      C1: [{ id: 'GC1' }]
    });

    component.deleteGrandchildInCache(childId, 'GC1');

    expect(component.getGrandchildren('C1').length).toBe(0);
  });
});
