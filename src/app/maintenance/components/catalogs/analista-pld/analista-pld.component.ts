import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnsDataTable, ConfigDataTable } from '../../../../shared/components/table-results/interfaces';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { environment } from '../../../../../environments/environment';

export interface AnalistaPld {
  id_analista_pld: string;
  id_analista_pld_cve: string;
  primer_nombre?: string;
  segundo_nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  correo?: string;
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
  selector: 'app-analista-pld-catalog',
  standalone: false,
  templateUrl: './analista-pld.component.html',
  styleUrl: './analista-pld.component.scss'
})
export class AnalistaPldComponent {

  private readonly fb = inject(FormBuilder);
  private readonly httpService = inject(HttpClientService);
  private readonly notificationService = inject(NotificationsService);
  private readonly retrieveUrl = environment.api.maintenance.spineCatalogRetrieve;
  private readonly upsertUrl = environment.api.maintenance.spineCatalogUpsert;

  analistasPld = signal<AnalistaPld[]>([]);
  showForm = signal(false);

  analystPldColumns: Array<ColumnsDataTable> = [];
  analystPldConfig: ConfigDataTable = {
    showPag: true,
    showViewAction: false,
    showEditAction: true,
    showDeleteAction: false,
    multipleSelection: false,
    itemPerPageOpt: [5, 10, 20],
    idName: 'id_analista_pld'
  };

  form: FormGroup = this.fb.group({
    id_analista_pld_cve: ['', [Validators.maxLength(20)]],
    primer_nombre: ['', [Validators.required, Validators.maxLength(255)]],
    segundo_nombre: ['', [Validators.maxLength(255)]],
    apellido_paterno: ['', [Validators.required, Validators.maxLength(255)]],
    apellido_materno: ['', [Validators.maxLength(255)]],
    correo: ['', [Validators.maxLength(255), Validators.email]]
  });

  editingId: string | null = null;

  ngOnInit(): void {
    this.analystPldColumns = [
      { name: 'id_analista_pld_cve', title: 'Clave Analista PLD', show: true, type: 'string' },
      { name: 'primer_nombre', title: 'Primer nombre', show: true, type: 'string' },
      { name: 'apellido_paterno', title: 'Apellido paterno', show: true, type: 'string' },
      { name: 'correo', title: 'Correo', show: true, type: 'string' }
    ];

    this.loadAnalistasPld();
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

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value as Partial<AnalistaPld>;
    const isEditing = !!this.editingId;
    const generatedId = isEditing ? null : this.generateUniqueNumericId('id_analista_pld', 5);
    const generatedCve = isEditing ? null : this.generateUniqueNumericId('id_analista_pld_cve', 8);

    if (!isEditing && (generatedId === null || generatedCve === null)) {
      this.notificationService.error('No fue posible generar claves unicas para el analista PLD');
      return;
    }

    const idAnalistaPldCve = isEditing
      ? String(formValue.id_analista_pld_cve ?? '').trim()
      : String(generatedCve);

    if (!idAnalistaPldCve) {
      this.notificationService.error('No fue posible obtener la clave del analista PLD');
      return;
    }

    const record: Record<string, string | number> = {
      id_analista_pld_cve: idAnalistaPldCve,
      primer_nombre: formValue.primer_nombre ?? '',
      segundo_nombre: formValue.segundo_nombre ?? '',
      apellido_paterno: formValue.apellido_paterno ?? '',
      apellido_materno: formValue.apellido_materno ?? '',
      correo: formValue.correo ?? ''
    };

    if (isEditing) {
      record['id_analista_pld'] = Number(this.editingId);
    }

    const records = isEditing
      ? [record]
      : [
          {
            id_analista_pld: generatedId as number,
            id_analista_pld_cve: generatedCve as number
          },
          record
        ];

    const request: UpsertCatalogRequest<Record<string, string | number>> = {
      catalogName: 'catanalistapld',
      records
    };

    this.httpService.post<UpsertCatalogResponse>(this.upsertUrl, request)
      .subscribe({
        next: (response) => {
          if (response.status !== 200) {
            this.notificationService.error('No fue posible guardar el analista PLD');
            return;
          }

          this.notificationService.success(
            this.editingId
              ? 'Analista PLD actualizado correctamente'
              : 'Analista PLD creado correctamente'
          );

          this.showForm.set(false);
          this.editingId = null;
          this.form.reset();
          this.loadAnalistasPld();
        },
        error: () => {
          this.notificationService.error('No fue posible guardar el analista PLD');
        }
      });
  }

  onEventRow(event: { type: string; row: AnalistaPld }): void {
    if (event.type === 'edit') {
      this.editAnalystPld(event.row);
    }
    if (event.type === 'delete') {
      this.deleteAnalystPld(event.row);
    }
  }

  private editAnalystPld(row: AnalistaPld): void {
    this.editingId = row.id_analista_pld;
    this.showForm.set(true);
    this.form.patchValue({
      id_analista_pld_cve: row.id_analista_pld_cve,
      primer_nombre: row.primer_nombre,
      segundo_nombre: row.segundo_nombre,
      apellido_paterno: row.apellido_paterno,
      apellido_materno: row.apellido_materno,
      correo: row.correo
    });
  }

  private deleteAnalystPld(row: AnalistaPld): void {
    this.analistasPld.update(list =>
      list.filter(item => item.id_analista_pld !== row.id_analista_pld)
    );
    this.notificationService.success('Analista PLD eliminado del catálogo');

    if (this.editingId === row.id_analista_pld) {
      this.onNew();
    }
  }

  private loadAnalistasPld(): void {
    const request = this.buildRetrieveRequest();

    this.httpService.post<RetrieveCatalogResponse<Partial<AnalistaPld>>>(this.retrieveUrl, request)
      .subscribe({
        next: (response) => {
          const items = response.status === 200 && Array.isArray(response.payload)
            ? response.payload.map(item => this.mapAnalistaPld(item))
            : [];

          this.analistasPld.set(items);
        },
        error: () => {
          this.analistasPld.set([]);
          this.notificationService.error('No fue posible consultar el catálogo de analistas PLD');
        }
      });
  }

  private buildRetrieveRequest(): RetrieveCatalogRequest {
    return {
      catalogName: 'catanalistapld',
      fields: [
        'id_analista_pld',
        'id_analista_pld_cve',
        'primer_nombre',
        'segundo_nombre',
        'apellido_paterno',
        'apellido_materno',
        'correo'
      ]
    };
  }

  private mapAnalistaPld(item: Partial<AnalistaPld>): AnalistaPld {
    return {
      id_analista_pld: String(item.id_analista_pld ?? ''),
      id_analista_pld_cve: String(item.id_analista_pld_cve ?? ''),
      primer_nombre: item.primer_nombre ?? '',
      segundo_nombre: item.segundo_nombre ?? '',
      apellido_paterno: item.apellido_paterno ?? '',
      apellido_materno: item.apellido_materno ?? '',
      correo: item.correo ?? ''
    };
  }

  private generateUniqueNumericId(field: 'id_analista_pld' | 'id_analista_pld_cve', digits: 5 | 8): number | null {
    const minValue = digits === 5 ? 10000 : 10000000;
    const maxValue = digits === 5 ? 99999 : 99999999;
    const usedValues = new Set(
      this.analistasPld()
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
