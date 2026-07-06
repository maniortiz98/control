import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnsDataTable, ConfigDataTable } from '../../../../shared/components/table-results/interfaces';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { environment } from '../../../../../environments/environment';
import { NOTIFICATION_MESSAGES } from '../../../../onboarding/constants/form-messages';
import { ALPHANUMERIC_PATTERN } from '../catalog-validators';
import { RetrieveCatalogRequest, RetrieveCatalogResponse, UpsertCatalogRequest, UpsertCatalogResponse } from '../catalog-http';

export interface Asesor {
  id_asesor: string;
  id_asesor_cve: string;
  id_centro_financiero: string;
  id_asesor_casa_bolsa?: string;
  id_promotor_banco?: string;
  nombre: string;
  correo?: string;
  usuario_sap?: string;
  rfc_asesor?: string;
  area_banco?: string;
  area_casa?: string;
  es_asistente: boolean;
  es_virtual: boolean;
  nomina_asesor_virtual?: string;
  segmento?: string;
  canales?: string;
  es_consultor: boolean;
  grupo?: string;
  subgrupo?: string;
  fecha_alta?: string;
  usuario_alta?: string;
  fecha_baja?: string;
  usuario_baja?: string;
  activo: boolean;
  creado?: string;
  modificado?: string;
}


@Component({
  selector: 'app-accesor-catalog',
  standalone: false,
  templateUrl: './accesor.component.html',
  styleUrl: './accesor.component.scss'
})
export class AccesorComponent {

  private readonly fb = inject(FormBuilder);
  private readonly httpService = inject(HttpClientService);
  private readonly notificationService = inject(NotificationsService);
  private readonly notificationModal = inject(NotificationModalService);
  private readonly retrieveUrl = environment.api.maintenance.spineCatalogRetrieve;
  private readonly upsertUrl = environment.api.maintenance.spineCatalogUpsert;

  asesores = signal<Asesor[]>([]);
  showForm = signal(false);

  advisorColumns: Array<ColumnsDataTable> = [];
  advisorConfig: ConfigDataTable = {
    showPag: true,
    showViewAction: false,
    showEditAction: true,
    showDeleteAction: false,
    multipleSelection: false,
    itemPerPageOpt: [5, 10, 20],
    idName: 'id_asesor',
    hideDeleteWhenActive: true
  };

  form: FormGroup = this.fb.group({
    id_asesor_cve: ['', [Validators.maxLength(6), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    id_centro_financiero: ['', [Validators.required, Validators.maxLength(5), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    id_asesor_casa_bolsa: ['', [Validators.maxLength(8), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    id_promotor_banco: ['', [Validators.maxLength(8), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    nombre: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    correo: ['', [Validators.maxLength(255), Validators.email]],
    usuario_sap: ['', [Validators.maxLength(50), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    rfc_asesor: ['', [Validators.maxLength(20), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    area_banco: ['', [Validators.maxLength(45), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    area_casa: ['', [Validators.maxLength(45), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    es_asistente: [false],
    es_virtual: [false],
    nomina_asesor_virtual: ['', [Validators.maxLength(15), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    segmento: ['', [Validators.maxLength(2), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    canales: ['', [Validators.maxLength(2), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    es_consultor: [false],
    grupo: ['', [Validators.maxLength(2), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    subgrupo: ['', [Validators.maxLength(2), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    usuario_alta: ['', [Validators.maxLength(36), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    usuario_baja: ['', [Validators.maxLength(36), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    activo: [true]
  });

  editingId: string | null = null;

  ngOnInit(): void {
    this.loadAsesores();
    this.advisorColumns = [
      { name: 'id_asesor_cve', title: 'Clave Asesor', show: true, type: 'string' },
      { name: 'id_centro_financiero', title: 'Centro Financiero', show: true, type: 'string' },
      { name: 'id_asesor_casa_bolsa', title: 'Asesor Casa de Bolsa', show: true, type: 'string' },
      { name: 'id_promotor_banco', title: 'Promotor Banco', show: true, type: 'string' },
      { name: 'nombre', title: 'Nombre', show: true, type: 'string' },
      { name: 'correo', title: 'Correo', show: true, type: 'string' },
      { name: 'usuario_sap', title: 'Usuario SAP', show: true, type: 'string' },
      { name: 'area_banco', title: 'Área Banco', show: true, type: 'string' },
      { name: 'area_casa', title: 'Área Casa', show: true, type: 'string' },
      { name: 'es_asistente', title: 'Es Asistente', show: true, type: 'string' },
      { name: 'es_virtual', title: 'Es Virtual', show: true, type: 'string' },
      { name: 'es_consultor', title: 'Es Consultor', show: true, type: 'string' },
      { name: 'grupo', title: 'Grupo', show: true, type: 'string' },
      { name: 'subgrupo', title: 'Subgrupo', show: true, type: 'string' },
      { name: 'activo', title: 'Activo', show: true, type: 'string' }
    ];
  }

  onNew(): void {
    if (this.showForm() && !this.editingId) {
      this.showForm.set(false);
      return;
    }
    this.editingId = null;
    this.showForm.set(true);
    this.form.reset({
      es_asistente: false,
      es_virtual: false,
      es_consultor: false,
      nomina_asesor_virtual: '',
      segmento: '',
      canales: '',
      usuario_alta: '',
      usuario_baja: '',
      activo: true
    });
  }

  onCancelForm(): void {
    this.showForm.set(false);
    this.editingId = null;
    this.form.reset();
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const isEditing = !!this.editingId;

    if (isEditing) {
      const confirmation = await this.notificationModal.confirm({
        title: NOTIFICATION_MESSAGES.UPDATE_CONFIRMATION_MESSAGE,
        btnAccept: 'Sí, actualizar',
        btnDeny: 'Cancelar',
      });
      if (confirmation?.value !== true) {
        return;
      }
    }

    const value = this.form.value as Partial<Asesor>;

    const generatedId = isEditing ? null : this.generateUniqueNumericId('id_asesor', 5);
    const generatedCve = isEditing ? null : this.generateUniqueNumericId('id_asesor_cve', 6);

    if (!isEditing && (generatedId === null || generatedCve === null)) {
      this.notificationService.error('No fue posible generar claves unicas para el asesor');
      return;
    }

    const request = this.buildUpsertRequest(value, generatedId, generatedCve);

    this.httpService.post<UpsertCatalogResponse>(this.upsertUrl, request)
      .subscribe({
        next: (response) => {
          if (response.status !== 200) {
            this.notificationService.error(
              isEditing
                ? 'No fue posible actualizar el asesor'
                : 'No fue posible crear el asesor'
            );
            return;
          }

          this.notificationService.success(
            isEditing
              ? 'Asesor actualizado correctamente'
              : 'Asesor creado correctamente'
          );

          this.showForm.set(false);
          this.editingId = null;
          this.form.reset({ es_asistente: false, es_virtual: false, es_consultor: false, nomina_asesor_virtual: '', segmento: '', canales: '', usuario_alta: '', usuario_baja: '', activo: true });
          this.loadAsesores();
        },
        error: () => {
          this.notificationService.error(
            isEditing
              ? 'No fue posible actualizar el asesor'
              : 'No fue posible crear el asesor'
          );
        }
      });
  }

  private buildUpsertRequest(
    value: Partial<Asesor>,
    generatedId: number | null,
    generatedCve: number | null
  ): UpsertCatalogRequest<Record<string, string | number | boolean>> {
    const isEditing = !!this.editingId;
    const idAsesorCve = isEditing
      ? String(value.id_asesor_cve ?? '').trim().padStart(6, '0').slice(-6)
      : String(generatedCve).padStart(6, '0').slice(-6);

    const detailRecord: Record<string, string | number | boolean> = {
      id_asesor_cve: idAsesorCve,
      id_centro_financiero: value.id_centro_financiero ?? '',
      id_asesor_casa_bolsa: value.id_asesor_casa_bolsa ?? '',
      id_promotor_banco: value.id_promotor_banco ?? '',
      nombre: value.nombre ?? '',
      correo: value.correo ?? '',
      usuario_sap: value.usuario_sap ?? '',
      rfc_asesor: value.rfc_asesor ?? '',
      area_banco: value.area_banco ?? '',
      area_casa: value.area_casa ?? '',
      es_asistente: value.es_asistente ?? false,
      es_virtual: value.es_virtual ?? false,
      nomina_asesor_virtual: value.nomina_asesor_virtual ?? '',
      segmento: value.segmento ?? '',
      canales: value.canales ?? '',
      es_consultor: value.es_consultor ?? false,
      grupo: value.grupo ?? '',
      subgrupo: value.subgrupo ?? '',
      usuario_alta: value.usuario_alta ?? '',
      usuario_baja: value.usuario_baja ?? '',
      activo: value.activo ?? true
    };

    const records = isEditing
      ? [
          {
            ...detailRecord,
            id_asesor: Number(this.editingId)
          }
        ]
      : [
          {
            id_asesor: generatedId as number,
            id_asesor_cve: generatedCve as number
          },
          detailRecord
        ];

    return {
      catalogName: 'catasesor',
      records
    };
  }

  onEventRow(event: { type: string; row: Asesor }): void {
    if (event.type === 'edit') {
      this.editAdvisor(event.row);
    }
    if (event.type === 'delete') {
      this.deleteAdvisor(event.row);
    }
  }

  private editAdvisor(row: Asesor): void {
    this.editingId = row.id_asesor;
    this.showForm.set(true);
    this.form.patchValue({
      id_asesor_cve: row.id_asesor_cve,
      id_centro_financiero: row.id_centro_financiero,
      id_asesor_casa_bolsa: row.id_asesor_casa_bolsa,
      id_promotor_banco: row.id_promotor_banco,
      nombre: row.nombre,
      correo: row.correo,
      usuario_sap: row.usuario_sap,
      rfc_asesor: row.rfc_asesor,
      area_banco: row.area_banco,
      area_casa: row.area_casa,
      es_asistente: row.es_asistente,
      es_virtual: row.es_virtual,
      nomina_asesor_virtual: row.nomina_asesor_virtual,
      segmento: row.segmento,
      canales: row.canales,
      es_consultor: row.es_consultor,
      grupo: row.grupo,
      subgrupo: row.subgrupo,
      usuario_alta: row.usuario_alta,
      usuario_baja: row.usuario_baja,
      activo: row.activo
    });
  }

  private deleteAdvisor(row: Asesor): void {
    this.asesores.update(list =>
      list.filter(item => item.id_asesor !== row.id_asesor)
    );
    this.notificationService.success('Asesor eliminado del catálogo');

    if (this.editingId === row.id_asesor) {
      this.onNew();
    }
  }

  private loadAsesores(): void {
    const requestBase: Omit<RetrieveCatalogRequest, 'filterField' | 'filterValue'> = {
      catalogName: 'catasesor',
      fields: [
        'id_asesor',
        'id_asesor_cve',
        'id_centro_financiero',
        'id_asesor_casa_bolsa',
        'id_promotor_banco',
        'nombre',
        'correo',
        'usuario_sap',
        'rfc_asesor',
        'area_banco',
        'area_casa',
        'es_asistente',
        'es_virtual',
        'nomina_asesor_virtual',
        'segmento',
        'canales',
        'es_consultor',
        'grupo',
        'subgrupo',
        'fecha_alta',
        'usuario_alta',
        'fecha_baja',
        'usuario_baja',
        'activo',
        'creado',
        'modificado'
      ]
    };

    const requestActive: RetrieveCatalogRequest = {
      ...requestBase,
      filterField: 'activo',
      filterValue: true
    };

    const requestInactive: RetrieveCatalogRequest = {
      ...requestBase,
      filterField: 'activo',
      filterValue: false
    };

    this.httpService.post<RetrieveCatalogResponse<Partial<Asesor>>>(this.retrieveUrl, requestActive)
      .subscribe({
        next: (activeResponse) => {
          const activeItems = activeResponse.status === 200 && Array.isArray(activeResponse.payload)
            ? activeResponse.payload.map(item => this.mapAsesor(item))
            : [];

          this.httpService.post<RetrieveCatalogResponse<Partial<Asesor>>>(this.retrieveUrl, requestInactive)
            .subscribe({
              next: (inactiveResponse) => {
                const inactiveItems = inactiveResponse.status === 200 && Array.isArray(inactiveResponse.payload)
                  ? inactiveResponse.payload.map(item => this.mapAsesor(item))
                  : [];

                const merged = [...activeItems, ...inactiveItems];
                const deduped = merged.filter((item, index, self) =>
                  index === self.findIndex(other => other.id_asesor === item.id_asesor)
                );

                this.asesores.set(deduped);
              },
              error: () => {
                this.asesores.set(activeItems);
                this.notificationService.error('No fue posible consultar asesores inactivos');
              }
            });
        },
        error: () => {
          this.asesores.set([]);
          this.notificationService.error('No fue posible consultar el catálogo de asesores');
        }
      });
  }

  private mapAsesor(item: Partial<Asesor>): Asesor {
    return {
      id_asesor: String(item.id_asesor ?? ''),
      id_asesor_cve: String(item.id_asesor_cve ?? ''),
      id_centro_financiero: String(item.id_centro_financiero ?? ''),
      id_asesor_casa_bolsa: item.id_asesor_casa_bolsa ?? '',
      id_promotor_banco: item.id_promotor_banco ?? '',
      nombre: item.nombre ?? '',
      correo: item.correo ?? '',
      usuario_sap: item.usuario_sap ?? '',
      rfc_asesor: item.rfc_asesor ?? '',
      area_banco: item.area_banco ?? '',
      area_casa: item.area_casa ?? '',
      es_asistente: this.parseBoolean(item.es_asistente),
      es_virtual: this.parseBoolean(item.es_virtual),
      nomina_asesor_virtual: item.nomina_asesor_virtual ?? '',
      segmento: item.segmento ?? '',
      canales: item.canales ?? '',
      es_consultor: this.parseBoolean(item.es_consultor),
      grupo: item.grupo ?? '',
      subgrupo: item.subgrupo ?? '',
      fecha_alta: item.fecha_alta ?? '',
      usuario_alta: item.usuario_alta ?? '',
      fecha_baja: item.fecha_baja ?? '',
      usuario_baja: item.usuario_baja ?? '',
      activo: this.parseBoolean(item.activo, true),
      creado: item.creado ?? '',
      modificado: item.modificado ?? ''
    };
  }

  private parseBoolean(value: unknown, defaultValue = false): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      if (normalized === 'true') {
        return true;
      }
      if (normalized === 'false') {
        return false;
      }
    }

    if (typeof value === 'number') {
      return value === 1;
    }

    return defaultValue;
  }

  private generateUniqueNumericId(field: 'id_asesor' | 'id_asesor_cve', digits: 5 | 6): number | null {
    const minValue = digits === 5 ? 10000 : 100000;
    const maxValue = digits === 5 ? 99999 : 999999;

    const usedValuesAsText = new Set(
      this.asesores()
        .map(item => {
          const rawValue = String(item[field] ?? '').trim();
          return field === 'id_asesor_cve'
            ? rawValue.padStart(6, '0').slice(-6)
            : rawValue;
        })
        .filter(value => value.length > 0)
    );

    const usedValues = new Set(
      this.asesores()
        .map(item => Number(String(item[field] ?? '').trim()))
        .filter(value => Number.isInteger(value) && value >= minValue && value <= maxValue)
    );

    if (usedValues.size >= (maxValue - minValue + 1)) {
      return null;
    }

    const nextSequential = Math.max(minValue - 1, ...usedValues) + 1;
    if (nextSequential <= maxValue && !usedValues.has(nextSequential) && !usedValuesAsText.has(String(nextSequential))) {
      return nextSequential;
    }

    for (let attempt = 0; attempt < 50; attempt++) {
      const candidate = this.getSecureRandomInteger(minValue, maxValue);
      if (candidate === null) {
        break;
      }
      if (!usedValues.has(candidate) && !usedValuesAsText.has(String(candidate))) {
        return candidate;
      }
    }

    for (let candidate = minValue; candidate <= maxValue; candidate++) {
      if (!usedValues.has(candidate) && !usedValuesAsText.has(String(candidate))) {
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

