import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { isObservable, firstValueFrom } from 'rxjs';

type PersonType = 'PERSONA FÍSICA' | 'PERSONA MORAL';
export interface Shareholder {
  id: string;
  tipoPersona: PersonType;
  nombre: string;
  porcentaje: number;
  fideicomiso: boolean;
  cotizaBmv: boolean;
  estructura: number;
}

export interface ColumnDef {
  field: keyof Shareholder | 'actions';
  header?: string;
  width?: string;
}

export interface TableConfig {
  loading?: boolean;
  actionsWidth?: string;
  childColumns?: Array<{ field: string; header?: string; width?: string }>;
  grandChildColumns?: Array<{ field: string; header?: string; width?: string }>;
}

@Component({
  selector: 'app-table-results-tree',
  standalone: false,
  templateUrl: './table-results-tree.component.html',
  styleUrls: ['./table-results-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('180ms ease-out', style({ opacity: 1 })),
      ]),
      transition('* => *', [
        style({ opacity: 0 }),
        animate('180ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('120ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class TableResultsTreeComponent implements OnInit, OnChanges {
  @Input() columns: Array<{ field: string; header?: string; width?: string }> =
    [];
  @Input() data: any[] = [];
  @Input() config?: TableConfig;

  @Input() loadChildren?: (
    parent: any
  ) => any[] | Promise<any[]> | import('rxjs').Observable<any[]>;

  @Input() loadGrandchildren?: (
    child: any
  ) => any[] | Promise<any[]> | import('rxjs').Observable<any[]>;

  @Output() eventRow = new EventEmitter<any>();
  @Output() add = new EventEmitter<void>();

  dataSignal = signal<any[]>([]);
  displayedColumns: string[] = [];
  displayedChildColumns: string[] = [];
  displayedGrandChildColumns: string[] = [];

  selectedParent = signal<any | null>(null);
  selectedChild = signal<any | null>(null);

  /** Cache y loading por nivel */
  childrenByParent = signal<Record<string, any[]>>({});
  grandchildrenByChild = signal<Record<string, any[]>>({});
  childrenLoading = signal<Record<string, boolean>>({});
  grandchildrenLoading = signal<Record<string, boolean>>({});

  ngOnInit() {
    this.displayedColumns = this.columns.map((c) => c.field).concat('actions');

    // columnas hijos
    const childCols =
      this.config?.childColumns?.map((c) => c.field) ??
      this.columns.map((c) => c.field);
    this.displayedChildColumns = childCols.concat('actions');

    // columnas nietos
    const gcCols =
      this.config?.grandChildColumns?.map((c) => c.field) ??
      this.config?.childColumns?.map((c) => c.field) ??
      this.columns.map((c) => c.field);
    this.displayedGrandChildColumns = gcCols.concat('actions');

    this.dataSignal.set(this.data ?? []);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns'] && this.columns?.length) {
      this.displayedColumns = this.columns
        .map((c) => c.field)
        .concat('actions');
      if (!this.config?.childColumns) {
        this.displayedChildColumns = this.displayedColumns.slice();
      }
      if (!this.config?.grandChildColumns && !this.config?.childColumns) {
        this.displayedGrandChildColumns = this.displayedColumns.slice();
      }
    }
    if (changes['config']) {
      if (this.config?.childColumns) {
        this.displayedChildColumns = this.config.childColumns
          .map((c) => c.field)
          .concat('actions');
      }
      if (this.config?.grandChildColumns) {
        this.displayedGrandChildColumns = this.config.grandChildColumns
          .map((c) => c.field)
          .concat('actions');
      }
    }

    if (changes['data']) {
      this.dataSignal.set(this.data ?? []);
      const sel = this.selectedParent();
      const stillThere =
        sel && this.dataSignal().some((r) => r?.id === sel?.id);
      if (sel && !stillThere) {
        // además de deseleccionar, borra caches del padre que salió
        this.clearForParent(sel.id);
      }
    }
  }

  /** === Interacciones === */
  async onParentRowClick(row: any) {
    const was = this.selectedParent()?.id === row?.id;
    // Toggle
    if (was) {
      this.selectedParent.set(null);
      this.selectedChild.set(null);
      return;
    }
    this.selectedParent.set(row);
    this.selectedChild.set(null);
    await this.ensureChildrenLoaded(row);
  }

  async onChildRowClick(child: any) {
    const was = this.selectedChild()?.id === child?.id;
    if (was) {
      this.selectedChild.set(null);
      return;
    }
    this.selectedChild.set(child);
    await this.ensureGrandchildrenLoaded(child);
  }

  /** === Carga y cache === */
  private async ensureChildrenLoaded(parent: any) {
    if (!this.loadChildren) return;
    const key = parent?.id ?? JSON.stringify(parent);
    if (key in this.childrenByParent()) return;
    this.childrenLoading.set({ ...this.childrenLoading(), [key]: true });
    try {
      const res = this.loadChildren(parent);
      const children = await this.resolve(res);
      this.childrenByParent.set({
        ...this.childrenByParent(),
        [key]: children ?? [],
      });
    } finally {
      this.childrenLoading.set({ ...this.childrenLoading(), [key]: false });
    }
  }

  private async ensureGrandchildrenLoaded(child: any) {
    if (!this.loadGrandchildren) return;
    const key = child?.id ?? JSON.stringify(child);
    if (key in this.grandchildrenByChild()) return;
    this.grandchildrenLoading.set({
      ...this.grandchildrenLoading(),
      [key]: true,
    });
    try {
      const res = this.loadGrandchildren(child);
      const gc = await this.resolve(res);
      this.grandchildrenByChild.set({
        ...this.grandchildrenByChild(),
        [key]: gc ?? [],
      });
    } finally {
      this.grandchildrenLoading.set({
        ...this.grandchildrenLoading(),
        [key]: false,
      });
    }
  }

  private async resolve<T>(
    src: T | Promise<T> | import('rxjs').Observable<T>
  ): Promise<T> {
    if (isObservable(src)) return await firstValueFrom(src);
    if (src instanceof Promise) return await src;
    return src;
  }

  /** === Helpers para template === */
  childrenOf(row: any): any[] {
    const key = row?.id ?? JSON.stringify(row);
    return this.childrenByParent()[key] ?? [];
  }
  grandchildrenOf(child: any): any[] {
    const key = child?.id ?? JSON.stringify(child);
    return this.grandchildrenByChild()[key] ?? [];
  }
  isChildrenLoading(row: any): boolean {
    const key = row?.id ?? JSON.stringify(row);
    return !!this.childrenLoading()[key];
  }
  isGrandchildrenLoading(child: any): boolean {
    const key = child?.id ?? JSON.stringify(child);
    return !!this.grandchildrenLoading()[key];
  }
  isSelectedParent(row: any) {
    return this.selectedParent()?.id === row?.id;
  }
  isSelectedChild(row: any) {
    return this.selectedChild()?.id === row?.id;
  }

  /** Acciones y cambios de checkboxes (habilitados) */

  onCheckboxChange(
    level: 'parent' | 'child' | 'grandchild',
    row: any,
    field: 'fideicomiso' | 'cotizaBmv',
    checked: boolean
  ) {
    row[field] = checked;

    if (level === 'child' && this.selectedParent()) {
      const pKey =
        this.selectedParent().id ?? JSON.stringify(this.selectedParent());
      const arr = this.childrenByParent()[pKey] ?? [];
      const newArr = arr.map((c) =>
        c.id === row.id ? { ...c, [field]: checked } : c
      );
      this.childrenByParent.set({ ...this.childrenByParent(), [pKey]: newArr });
    }

    if (level === 'grandchild' && this.selectedChild()) {
      const cKey =
        this.selectedChild().id ?? JSON.stringify(this.selectedChild());
      const arr = this.grandchildrenByChild()[cKey] ?? [];
      const newArr = arr.map((gc) =>
        gc.id === row.id ? { ...gc, [field]: checked } : gc
      );
      this.grandchildrenByChild.set({
        ...this.grandchildrenByChild(),
        [cKey]: newArr,
      });
    }

    this.eventRow.emit({ action: 'toggle', level, field, checked, row });
  }

  getSelectedParentId(): string | null {
    return this.selectedParent()?.id ?? null;
  }

  getSelectedChildId(): string | null {
    return this.selectedChild()?.id ?? null;
  }

  getChildren(parentId: string): any[] {
    return this.childrenByParent()[parentId] ?? [];
  }

  getGrandchildren(childId: string): any[] {
    return this.grandchildrenByChild()[childId] ?? [];
  }

  /** Reemplaza un hijo por id, en el grupo del parentId */
  updateChildInCache(parentId: string, updated: any) {
    const list = this.getChildren(parentId);
    const newList = list.map((c) =>
      c?.id === updated?.id ? { ...c, ...updated } : c
    );
    this.childrenByParent.set({
      ...this.childrenByParent(),
      [parentId]: newList,
    });
  }

  deleteChildInCache(parentId: string, childId: string) {
    const list = this.getChildren(parentId).filter((c) => c?.id !== childId);
    const grandchildrenByChild = { ...this.grandchildrenByChild() };
    const grandchildrenLoading = { ...this.grandchildrenLoading() };
    delete grandchildrenByChild[childId];
    delete grandchildrenLoading[childId];

    this.childrenByParent.set({ ...this.childrenByParent(), [parentId]: list });
    this.grandchildrenByChild.set(grandchildrenByChild);
    this.grandchildrenLoading.set(grandchildrenLoading);

    if (this.selectedChild()?.id === childId) this.selectedChild.set(null);
  }

  updateGrandchildInCache(childId: string, updated: any) {
    const list = this.getGrandchildren(childId);
    const newList = list.map((gc) =>
      gc?.id === updated?.id ? { ...gc, ...updated } : gc
    );
    this.grandchildrenByChild.set({
      ...this.grandchildrenByChild(),
      [childId]: newList,
    });
  }

  deleteGrandchildInCache(childId: string, grandchildId: string) {
    const list = this.getGrandchildren(childId).filter(
      (gc) => gc?.id !== grandchildId
    );
    this.grandchildrenByChild.set({
      ...this.grandchildrenByChild(),
      [childId]: list,
    });
  }

  clearForParent(parentId: string) {
    if (this.selectedParent()?.id === parentId) {
      this.selectedParent.set(null);
      this.selectedChild.set(null);
    }

    const childrenByParent = { ...this.childrenByParent() };
    const childrenLoading = { ...this.childrenLoading() };
    const grandchildrenByChild = { ...this.grandchildrenByChild() };
    const grandchildrenLoading = { ...this.grandchildrenLoading() };

    const childList = childrenByParent[parentId] ?? [];
    delete childrenByParent[parentId];
    delete childrenLoading[parentId];

    for (const ch of childList) {
      const chKey = ch?.id;
      if (chKey) {
        delete grandchildrenByChild[chKey];
        delete grandchildrenLoading[chKey];
      }
    }

    this.childrenByParent.set(childrenByParent);
    this.childrenLoading.set(childrenLoading);
    this.grandchildrenByChild.set(grandchildrenByChild);
    this.grandchildrenLoading.set(grandchildrenLoading);
  }

  editRow(row: any, level: 'parent' | 'child' | 'grandchild' = 'parent') {
    const context = {
      parentId: this.selectedParent()?.id ?? null,
      childId: this.selectedChild()?.id ?? null,
    };
    this.eventRow.emit({ action: 'edit', level, row, context });
  }

  deleteRow(row: any, level: 'parent' | 'child' | 'grandchild' = 'parent') {
    const context = {
      parentId: this.selectedParent()?.id ?? null,
      childId: this.selectedChild()?.id ?? null,
    };
    this.eventRow.emit({ action: 'delete', level, row, context });
  }

  addRow(row: any, level: 'parent' | 'child' | 'grandchild' = 'parent') {
    const context = {
      parentId: this.selectedParent()?.id ?? null,
      childId: this.selectedChild()?.id ?? null,
    };
    this.eventRow.emit({ action: 'view', level, row, context });
  }

  /** trackBy */
  trackById = (_: number, item: any) => item?.id ?? item;
}
