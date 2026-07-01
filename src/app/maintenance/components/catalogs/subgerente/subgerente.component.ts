import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnsDataTable, ConfigDataTable } from '../../../../shared/components/table-results/interfaces';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { environment } from '../../../../../environments/environment';

export interface Subgerente {
  id_gerente: string;
  id_subgerente_cve: string;
  id_centro_financiero: string;
  nombre_completo?: string;
  descripcion_perfil?: string;
  usuario_sap?: string;
  correo?: string;
  activo: boolean;
  creado?: string;
  modificado?: string;
}

interface RetrieveCatalogRequest {
  catalogName: string;
  fields: string[];
}

interface RetrieveCatalogResponse<T> {
  status: number;
  messages: string[];
  payload: T[];
}

interface UpsertCatalogRequest<T> {
  catalogName: string;
  records: T[];
}

interface UpsertCatalogResponse {
  status: number;
  messages: string[];
}

@Component({
  selector: 'app-subgerente-catalog',
  standalone: false,
  templateUrl: './subgerente.component.html',
  styleUrl: './subgerente.component.scss'
})
export class SubgerenteComponent {

  private readonly fb = inject(FormBuilder);
  private readonly httpService = inject(HttpClientService);
  private readonly notificationService = inject(NotificationsService);
  private readonly retrieveUrl = environment.api.maintenance.spineCatalogRetrieve;
  private readonly upsertUrl = environment.api.maintenance.spineCatalogUpsert;

  subgerentes = signal<Subgerente[]>([]);
  showForm = signal(false);

  submanagerColumns: Array<ColumnsDataTable> = [];
  submanagerConfig: ConfigDataTable = {
    showPag: true,
    showViewAction: false,
    showEditAction: true,
    showDeleteAction: false,
    multipleSelection: false,
    itemPerPageOpt: [5, 10, 20],
    idName: 'id_gerente',
    hideDeleteWhenActive: true
  };

  form: FormGroup = this.fb.group({
    id_subgerente_cve: ['', [Validators.maxLength(10)]],
    id_centro_financiero: ['', [Validators.required, Validators.maxLength(5)]],
    nombre_completo: ['', [Validators.required, Validators.maxLength(255)]],
    descripcion_perfil: ['', [Validators.maxLength(50)]],
    usuario_sap: ['', [Validators.maxLength(50)]],
    correo: ['', [Validators.maxLength(255), Validators.email]],
    activo: [true]
  });

  editingId: string | null = null;

  ngOnInit(): void {
    this.submanagerColumns = [
      { name: 'id_subgerente_cve', title: 'Clave Subgerente', show: true, type: 'string' },
      { name: 'id_centro_financiero', title: 'Centro Financiero', show: true, type: 'string' },
      { name: 'nombre_completo', title: 'Nombre completo', show: true, type: 'string' },
      { name: 'descripcion_perfil', title: 'Perfil', show: true, type: 'string' },
      { name: 'usuario_sap', title: 'Usuario SAP', show: true, type: 'string' },
      { name: 'correo', title: 'Correo', show: true, type: 'string' },
      { name: 'activo', title: 'Activo', show: true, type: 'string' }
    ];

    this.loadSubgerentes();
  }

  onNew(): void {
    if (this.showForm() && !this.editingId) {
      this.showForm.set(false);
      return;
    }
    this.editingId = null;
    this.showForm.set(true);
    this.form.reset({ activo: true });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value as Partial<Subgerente>;

    const isEditing = !!this.editingId;
    const generatedId = isEditing ? null : this.generateUniqueNumericId('id_gerente', 5);
    const generatedCve = isEditing ? null : this.generateUniqueNumericId('id_subgerente_cve', 8);

    if (!isEditing && (generatedId === null || generatedCve === null)) {
      this.notificationService.error('No fue posible generar claves unicas para el subgerente');
      return;
    }

    const request = this.buildUpsertRequest(value, generatedId, generatedCve);

    this.httpService.post<UpsertCatalogResponse>(this.upsertUrl, request)
      .subscribe({
        next: (response) => {
          if (response.status !== 200) {
            this.notificationService.error(
              isEditing
                ? 'No fue posible actualizar el subgerente'
                : 'No fue posible crear el subgerente'
            );
            return;
          }

          this.notificationService.success(
            isEditing
              ? 'Subgerente actualizado correctamente'
              : 'Subgerente creado correctamente'
          );

          this.showForm.set(false);
          this.editingId = null;
          this.form.reset({ activo: true });
          this.loadSubgerentes();
        },
        error: () => {
          this.notificationService.error(
            isEditing
              ? 'No fue posible actualizar el subgerente'
              : 'No fue posible crear el subgerente'
          );
        }
      });
  }

  private buildUpsertRequest(
    value: Partial<Subgerente>,
    generatedId: number | null,
    generatedCve: number | null
  ): UpsertCatalogRequest<Record<string, string | number | boolean>> {
    const isEditing = !!this.editingId;
    const idSubgerenteCve = isEditing
      ? String(value.id_subgerente_cve ?? '').trim()
      : String(generatedCve);

    const detailRecord: Record<string, string | number | boolean> = {
      id_subgerente_cve: idSubgerenteCve,
      id_centro_financiero: value.id_centro_financiero ?? '',
      nombre_completo: value.nombre_completo ?? '',
      descripcion_perfil: value.descripcion_perfil ?? '',
      usuario_sap: value.usuario_sap ?? '',
      correo: value.correo ?? '',
      activo: value.activo ?? true
    };

    const records = isEditing
      ? [
          {
            ...detailRecord,
            id_gerente: Number(this.editingId)
          }
        ]
      : [
          {
            id_gerente: generatedId as number,
            id_subgerente_cve: generatedCve as number
          },
          detailRecord
        ];

    return {
      catalogName: 'catsubgerente',
      records
    };
  }

  onEventRow(event: { type: string; row: Subgerente }): void {
    if (event.type === 'edit') {
      this.editSubmanager(event.row);
    }
    if (event.type === 'delete') {
      this.deleteSubmanager(event.row);
    }
  }

  private editSubmanager(row: Subgerente): void {
    this.editingId = row.id_gerente;
    this.showForm.set(true);
    this.form.patchValue({
      id_subgerente_cve: row.id_subgerente_cve,
      id_centro_financiero: row.id_centro_financiero,
      nombre_completo: row.nombre_completo,
      descripcion_perfil: row.descripcion_perfil,
      usuario_sap: row.usuario_sap,
      correo: row.correo,
      activo: row.activo
    });
  }

  private deleteSubmanager(row: Subgerente): void {
    this.subgerentes.update(list =>
      list.filter(item => item.id_gerente !== row.id_gerente)
    );
    this.notificationService.success('Subgerente eliminado del catálogo');

    if (this.editingId === row.id_gerente) {
      this.onNew();
    }
  }

  private loadSubgerentes(): void {
    const request: RetrieveCatalogRequest = {
      catalogName: 'catsubgerente',
      fields: [
        'id_gerente',
        'nombre_completo',
        'descripcion_perfil',
        'creado',
        'id_subgerente_cve',
        'correo',
        'usuario_sap',
        'id_centro_financiero',
        'modificado',
        'activo'
      ]
    };

    this.httpService.post<RetrieveCatalogResponse<Partial<Subgerente>>>(this.retrieveUrl, request)
      .subscribe({
        next: (response) => {
          const items = response.status === 200 && Array.isArray(response.payload)
            ? response.payload.map(item => this.mapSubgerente(item))
            : [];

          this.subgerentes.set(items);
        },
        error: () => {
          this.subgerentes.set([]);
          this.notificationService.error('No fue posible cargar el catálogo de subgerentes');
        }
      });
  }

  private mapSubgerente(item: Partial<Subgerente>): Subgerente {
    return {
      id_gerente: String(item.id_gerente ?? ''),
      id_subgerente_cve: item.id_subgerente_cve ?? '',
      id_centro_financiero: item.id_centro_financiero ?? '',
      nombre_completo: item.nombre_completo ?? '',
      descripcion_perfil: item.descripcion_perfil ?? '',
      usuario_sap: item.usuario_sap ?? '',
      correo: item.correo ?? '',
      activo: item.activo ?? false,
      creado: item.creado ?? '',
      modificado: item.modificado ?? ''
    };
  }

  private generateUniqueNumericId(field: 'id_gerente' | 'id_subgerente_cve', digits: 5 | 8): number | null {
    const minValue = digits === 5 ? 10000 : 10000000;
    const maxValue = digits === 5 ? 99999 : 99999999;
    const usedValues = new Set(
      this.subgerentes()
        .map(item => Number(item[field]))
        .filter(value => Number.isInteger(value) && value >= minValue && value <= maxValue)
    );

    if (usedValues.size >= (maxValue - minValue + 1)) {
      return null;
    }

    const nextSequential = Math.max(minValue - 1, ...usedValues) + 1;
    if (nextSequential <= maxValue && !usedValues.has(nextSequential)) {
      return nextSequential;
    }

    for (let attempt = 0; attempt < 50; attempt++) {
      const candidate = this.getSecureRandomInteger(minValue, maxValue);
      if (candidate === null) {
        break;
      }
      if (!usedValues.has(candidate)) {
        return candidate;
      }
    }

    for (let candidate = minValue; candidate <= maxValue; candidate++) {
      if (!usedValues.has(candidate)) {
        return candidate;
      }
    }

    return null;
  }
  
  private getSecureRandomInteger(minValue: number, maxValue: number): number | null {
    const range = maxValue - minValue + 1;

    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      const maxUnbiasedValue = Math.floor(0x100000000 / range) * range;
      const randomValues = new Uint32Array(1);

      do {
        crypto.getRandomValues(randomValues);
      } while (randomValues[0] >= maxUnbiasedValue);

      return minValue + (randomValues[0] % range);
    }

    return null;
  }
}
