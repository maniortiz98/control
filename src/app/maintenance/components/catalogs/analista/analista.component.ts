import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnsDataTable, ConfigDataTable } from '../../../../shared/components/table-results/interfaces';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { NotificationModalService } from '../../../../shared/services/notification-modal.service';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { environment } from '../../../../../environments/environment';
import { forkJoin } from 'rxjs';
import { NOTIFICATION_MESSAGES } from '../../../../onboarding/constants/form-messages';
import { ALPHANUMERIC_PATTERN } from '../catalog-validators';
import { Analista } from '../../../../customer/models/catalogs/customer-analista';
import { RetrieveCatalogRequest, RetrieveCatalogResponse, UpsertCatalogRequest, UpsertCatalogResponse } from '../catalog-http';

@Component({
  selector: 'app-analista-catalog',
  standalone: false,
  templateUrl: './analista.component.html',
  styleUrl: './analista.component.scss'
})
export class AnalistaComponent {

  private readonly fb = inject(FormBuilder);
  private readonly httpService = inject(HttpClientService);
  private readonly notificationService = inject(NotificationsService);
  private readonly notificationModal = inject(NotificationModalService);
  private readonly retrieveUrl = environment.api.maintenance.spineCatalogRetrieve;
  private readonly upsertUrl = environment.api.maintenance.spineCatalogUpsert;

  analistas = signal<Analista[]>([]);
  showForm = signal(false);

  analystColumns: Array<ColumnsDataTable> = [];
  analystConfig: ConfigDataTable = {
    showPag: true,
    showViewAction: false,
    showEditAction: true,
    showDeleteAction: false,
    multipleSelection: false,
    itemPerPageOpt: [5, 10, 20],
    idName: 'id_analista'
  };

  form: FormGroup = this.fb.group({
    id_analista_cve: ['', [Validators.maxLength(6), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    id_centro_financiero: ['', [Validators.maxLength(5), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    id_tipo_area_bancaria: ['', [Validators.maxLength(5)]],
    primer_nombre: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    segundo_nombre: ['', [Validators.maxLength(255), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    apellido_paterno: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    apellido_materno: ['', [Validators.maxLength(255), Validators.pattern(ALPHANUMERIC_PATTERN)]],
    correo: ['', [Validators.maxLength(255), Validators.email]],
    proc_pm_banco: ['', [Validators.maxLength(2), Validators.pattern(ALPHANUMERIC_PATTERN)]]
  });

  editingId: string | null = null;

  ngOnInit(): void {
    this.loadAnalistas();
    this.analystColumns = [
      { name: 'id_analista_cve', title: 'Clave Analista', show: true, type: 'string' },
      { name: 'id_centro_financiero', title: 'Centro Financiero', show: true, type: 'string' },
      { name: 'id_tipo_area_bancaria', title: 'Tipo área bancaria', show: true, type: 'string' },
      { name: 'primer_nombre', title: 'Primer nombre', show: true, type: 'string' },
      { name: 'apellido_paterno', title: 'Apellido paterno', show: true, type: 'string' },
      { name: 'correo', title: 'Correo', show: true, type: 'string' },
      { name: 'proc_pm_banco', title: 'Proc PM Banco', show: true, type: 'string' }
    ];
  }

  onNew(): void {
    if (this.showForm() && !this.editingId) {
      this.showForm.set(false);
      return;
    }
    this.editingId = null;
    this.showForm.set(true);
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

    const value = this.form.value as Partial<Analista>;

    const generatedId = isEditing ? null : this.generateUniqueNumericId('id_analista', 5);
    const generatedCve = isEditing ? null : this.generateUniqueNumericId('id_analista_cve', 6);

    if (!isEditing && (generatedId === null || generatedCve === null)) {
      this.notificationService.error('No fue posible generar claves unicas para el analista');
      return;
    }

    const request = this.buildUpsertRequest(value, generatedId, generatedCve);

    this.httpService.post<UpsertCatalogResponse>(this.upsertUrl, request)
      .subscribe({
        next: (response) => {
          if (response.status !== 200) {
            this.notificationService.error(
              isEditing
                ? 'No fue posible actualizar el analista'
                : 'No fue posible crear el analista'
            );
            return;
          }

          this.notificationService.success(
            isEditing
              ? 'Analista actualizado correctamente'
              : 'Analista creado correctamente'
          );

          this.showForm.set(false);
          this.editingId = null;
          this.form.reset();
          this.loadAnalistas();
        },
        error: () => {
          this.notificationService.error(
            isEditing
              ? 'No fue posible actualizar el analista'
              : 'No fue posible crear el analista'
          );
        }
      });
  }

  private buildUpsertRequest(
    value: Partial<Analista>,
    generatedId: number | null,
    generatedCve: number | null
  ): UpsertCatalogRequest<Record<string, string | number>> {
    const isEditing = !!this.editingId;
    const idAnalistaCve = isEditing
      ? String(value.id_analista_cve ?? '').trim()
      : String(generatedCve);

    const detailRecord: Record<string, string | number> = {
      id_analista_cve: idAnalistaCve,
      id_centro_financiero: value.id_centro_financiero ?? '',
      id_tipo_area_bancaria: value.id_tipo_area_bancaria ?? '',
      primer_nombre: value.primer_nombre ?? '',
      segundo_nombre: value.segundo_nombre ?? '',
      apellido_paterno: value.apellido_paterno ?? '',
      apellido_materno: value.apellido_materno ?? '',
      correo: value.correo ?? '',
      proc_pm_banco: value.proc_pm_banco ?? ''
    };

    const records = isEditing
      ? [
          {
            ...detailRecord,
            id_analista: Number(this.editingId)
          }
        ]
      : [
          {
            id_analista: generatedId as number,
            id_analista_cve: generatedCve as number
          },
          detailRecord
        ];

    return {
      catalogName: 'catanalista',
      records
    };
  }

  onEventRow(event: { type: string; row: Analista }): void {
    if (event.type === 'edit') {
      this.editAnalyst(event.row);
    }
    if (event.type === 'delete') {
      this.deleteAnalyst(event.row);
    }
  }

  private editAnalyst(row: Analista): void {
    this.editingId = row.id_analista;
    this.showForm.set(true);
    this.form.patchValue({
      id_analista_cve: row.id_analista_cve,
      id_centro_financiero: row.id_centro_financiero,
      id_tipo_area_bancaria: row.id_tipo_area_bancaria,
      primer_nombre: row.primer_nombre,
      segundo_nombre: row.segundo_nombre,
      apellido_paterno: row.apellido_paterno,
      apellido_materno: row.apellido_materno,
      correo: row.correo,
      proc_pm_banco: row.proc_pm_banco
    });
  }

  private deleteAnalyst(row: Analista): void {
    this.analistas.update(list =>
      list.filter(item => item.id_analista !== row.id_analista)
    );
    this.notificationService.success('Analista eliminado del catálogo');

    if (this.editingId === row.id_analista) {
      this.onNew();
    }
  }

  private loadAnalistas(): void {
    const request999 = this.buildRetrieveRequest('999');
    const request998 = this.buildRetrieveRequest('998');

    forkJoin([
      this.httpService.post<RetrieveCatalogResponse<Partial<Analista>>>(this.retrieveUrl, request999),
      this.httpService.post<RetrieveCatalogResponse<Partial<Analista>>>(this.retrieveUrl, request998)
    ]).subscribe({
      next: ([response999, response998]) => {
        const items999 = response999.status === 200 && Array.isArray(response999.payload)
          ? response999.payload.map(item => this.mapAnalista(item))
          : [];

        const items998 = response998.status === 200 && Array.isArray(response998.payload)
          ? response998.payload.map(item => this.mapAnalista(item))
          : [];

        this.analistas.set([...items999, ...items998]);
      },
      error: () => {
        this.analistas.set([]);
        this.notificationService.error('No fue posible consultar el catálogo de analistas');
      }
    });
  }

  private buildRetrieveRequest(filterValue: string): RetrieveCatalogRequest {
    return {
      catalogName: 'catanalista',
      fields: [
        'id_analista',
        'id_analista_cve',
        'id_centro_financiero',
        'id_tipo_area_bancaria',
        'primer_nombre',
        'segundo_nombre',
        'apellido_paterno',
        'apellido_materno',
        'correo',
        'proc_pm_banco'
      ],
      filterField: 'id_tipo_area_bancaria',
      filterValue
    };
  }

  private mapAnalista(item: Partial<Analista>): Analista {
    return {
      id_analista: String(item.id_analista ?? ''),
      id_analista_cve: String(item.id_analista_cve ?? ''),
      id_centro_financiero: item.id_centro_financiero ?? '',
      id_tipo_area_bancaria: item.id_tipo_area_bancaria ?? '',
      primer_nombre: item.primer_nombre ?? '',
      segundo_nombre: item.segundo_nombre ?? '',
      apellido_paterno: item.apellido_paterno ?? '',
      apellido_materno: item.apellido_materno ?? '',
      correo: item.correo ?? '',
      proc_pm_banco: item.proc_pm_banco ?? ''
    };
  }

  private generateUniqueNumericId(field: 'id_analista' | 'id_analista_cve', digits: 5 | 6): number | null {
    const minValue = digits === 5 ? 10000 : 100000;
    const maxValue = digits === 5 ? 99999 : 999999;
    const usedValues = new Set(
      this.analistas()
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
