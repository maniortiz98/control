import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnsDataTable, ConfigDataTable } from '../../../../shared/components/table-results/interfaces';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { environment } from '../../../../../environments/environment';

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

interface RetrieveCatalogRequest {
  catalogName: string;
  fields: string[];
  filterField?: string;
  filterValue?: string | number | boolean;
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

const MOCK_ASESORES: Asesor[] = [
  {
    id_asesor: '1',
    id_asesor_cve: '00001',
    id_centro_financiero: '0179',
    id_asesor_casa_bolsa: '00000049',
    id_promotor_banco: '00000007',
    nombre: 'JUAN MANUEL PENA CRUZ',
    correo: 'SINCORREO@CTINVER.COM.MX',
    usuario_sap: 'TEST01',
    rfc_asesor: '',
    area_banco: 'BANCO',
    area_casa: 'BANCO',
    es_asistente: false,
    es_virtual: false,
    nomina_asesor_virtual: '00000',
    segmento: '',
    canales: '',
    es_consultor: false,
    grupo: '',
    subgrupo: 'A',
    fecha_alta: '',
    usuario_alta: '',
    fecha_baja: '',
    usuario_baja: '',
    activo: false,
    creado: '2025-12-10T08:20:12.334159Z',
    modificado: ''
  },
  {
    id_asesor: '2',
    id_asesor_cve: '00002',
    id_centro_financiero: '0100',
    id_asesor_casa_bolsa: '00007085',
    id_promotor_banco: '00001085',
    nombre: 'JOEL BANUELOS MEZA',
    correo: 'JBANUELOSM@EXTERNOS.ACTINVER.COM.MX',
    usuario_sap: 'JBANUELOSM',
    rfc_asesor: 'M',
    area_banco: 'BANCO',
    area_casa: 'BANCO',
    es_asistente: false,
    es_virtual: false,
    nomina_asesor_virtual: '00000',
    segmento: '',
    canales: '',
    es_consultor: false,
    grupo: '01',
    subgrupo: '',
    fecha_alta: '2024-10-08T00:00:00Z',
    usuario_alta: 'TEST01',
    fecha_baja: '',
    usuario_baja: '',
    activo: false,
    creado: '2025-12-10T08:20:12.334159Z',
    modificado: ''
  },
  {
    id_asesor: '3',
    id_asesor_cve: '00003',
    id_centro_financiero: '0100',
    id_asesor_casa_bolsa: '00007085',
    id_promotor_banco: '00001085',
    nombre: 'MAYTE MENDOZA ROMERO',
    correo: 'CMMENDOZA@YAHOO.COM.MX',
    usuario_sap: 'TEST011',
    rfc_asesor: 'M',
    area_banco: 'BANCO',
    area_casa: 'BANCO',
    es_asistente: false,
    es_virtual: false,
    nomina_asesor_virtual: '00000',
    segmento: '',
    canales: '',
    es_consultor: false,
    grupo: '01',
    subgrupo: '',
    fecha_alta: '2022-08-15T00:00:00Z',
    usuario_alta: 'TEST01',
    fecha_baja: '',
    usuario_baja: '',
    activo: false,
    creado: '2025-12-10T08:20:12.334159Z',
    modificado: ''
  },
  {
    id_asesor: '4',
    id_asesor_cve: '00005',
    id_centro_financiero: '0000',
    id_asesor_casa_bolsa: '01254654',
    id_promotor_banco: '01243235',
    nombre: 'LOLA PEREZ REMA',
    correo: 'CM@ACT.COM',
    usuario_sap: '1123',
    rfc_asesor: 'MSD123/',
    area_banco: '',
    area_casa: '',
    es_asistente: false,
    es_virtual: false,
    nomina_asesor_virtual: '00000',
    segmento: '',
    canales: '',
    es_consultor: false,
    grupo: '',
    subgrupo: '',
    fecha_alta: '2022-08-16T00:00:00Z',
    usuario_alta: 'TEST01',
    fecha_baja: '',
    usuario_baja: '',
    activo: false,
    creado: '2025-12-10T08:20:12.334159Z',
    modificado: ''
  },
  {
    id_asesor: '5',
    id_asesor_cve: '00006',
    id_centro_financiero: '0001',
    id_asesor_casa_bolsa: '00000006',
    id_promotor_banco: '00000007',
    nombre: 'BACA FERNANDEZ JULIO MARIO',
    correo: 'JBACA@ACTINVER.COM.MXX',
    usuario_sap: 'JBACA',
    rfc_asesor: 'SAOA990123',
    area_banco: 'BANCO',
    area_casa: 'BANCO',
    es_asistente: false,
    es_virtual: false,
    nomina_asesor_virtual: '00000',
    segmento: '',
    canales: '',
    es_consultor: true,
    grupo: '01',
    subgrupo: 'A',
    fecha_alta: '',
    usuario_alta: 'RMALDONADO',
    fecha_baja: '',
    usuario_baja: '',
    activo: false,
    creado: '2025-12-10T08:20:12.334159Z',
    modificado: ''
  },
  {
    id_asesor: '6',
    id_asesor_cve: '00007',
    id_centro_financiero: '0010',
    id_asesor_casa_bolsa: '00000022',
    id_promotor_banco: '00000025',
    nombre: 'RAMIRO HERNANDEZ ALDAMA',
    correo: 'CMMENDOZA@VISIONCONSULTING.COM.MX',
    usuario_sap: '00122',
    rfc_asesor: 'ME',
    area_banco: 'BANCO',
    area_casa: 'BANCO',
    es_asistente: false,
    es_virtual: false,
    nomina_asesor_virtual: '00000',
    segmento: '',
    canales: '',
    es_consultor: false,
    grupo: '01',
    subgrupo: 'A',
    fecha_alta: '2022-08-16T00:00:00Z',
    usuario_alta: 'TEST01',
    fecha_baja: '',
    usuario_baja: '',
    activo: false,
    creado: '2025-12-10T08:20:12.334159Z',
    modificado: ''
  },
  {
    id_asesor: '7',
    id_asesor_cve: '00008',
    id_centro_financiero: '0501',
    id_asesor_casa_bolsa: '00000834',
    id_promotor_banco: '00006918',
    nombre: 'CAMARGO FELIX ENRIQUE ANTONIO',
    correo: 'JORTIZ@ACTINVER.COM.MX',
    usuario_sap: '',
    rfc_asesor: '',
    area_banco: 'BANCO',
    area_casa: 'BANCO',
    es_asistente: false,
    es_virtual: false,
    nomina_asesor_virtual: '00000',
    segmento: '',
    canales: '',
    es_consultor: false,
    grupo: '',
    subgrupo: '',
    fecha_alta: '',
    usuario_alta: '',
    fecha_baja: '',
    usuario_baja: '',
    activo: false,
    creado: '2025-12-10T08:20:12.334159Z',
    modificado: ''
  },
  {
    id_asesor: '8',
    id_asesor_cve: '00009',
    id_centro_financiero: '0104',
    id_asesor_casa_bolsa: '00553001',
    id_promotor_banco: '00000553',
    nombre: '00222 //225 ..+-*225',
    correo: '111@AA.COM',
    usuario_sap: 'AAAA**-/',
    rfc_asesor: 'DGFD4564',
    area_banco: 'BANCO',
    area_casa: 'BANCO',
    es_asistente: false,
    es_virtual: false,
    nomina_asesor_virtual: '00000',
    segmento: '',
    canales: '',
    es_consultor: false,
    grupo: '',
    subgrupo: '',
    fecha_alta: '2022-08-16T00:00:00Z',
    usuario_alta: 'TEST01',
    fecha_baja: '',
    usuario_baja: '',
    activo: false,
    creado: '2025-12-10T08:20:12.334159Z',
    modificado: ''
  },
  {
    id_asesor: '9',
    id_asesor_cve: '00012',
    id_centro_financiero: '0001',
    id_asesor_casa_bolsa: '00000829',
    id_promotor_banco: '00006881',
    nombre: 'DE SILVA ELIZONDO SYLVIA MARIA',
    correo: 'CURQUIDES@EXTERNOS.ACTINVER.COM.MX',
    usuario_sap: '',
    rfc_asesor: '',
    area_banco: 'BANCO',
    area_casa: 'BANCO',
    es_asistente: false,
    es_virtual: false,
    nomina_asesor_virtual: '00000',
    segmento: '',
    canales: '',
    es_consultor: false,
    grupo: '',
    subgrupo: '',
    fecha_alta: '',
    usuario_alta: '',
    fecha_baja: '',
    usuario_baja: '',
    activo: false,
    creado: '2025-12-10T08:20:12.334159Z',
    modificado: ''
  },
  {
    id_asesor: '10',
    id_asesor_cve: '00014',
    id_centro_financiero: '0119',
    id_asesor_casa_bolsa: '00000854',
    id_promotor_banco: '00007816',
    nombre: 'COPPEL AZCONA FRANCISCO',
    correo: 'CURQUIDES@EXTERNOS.ACTINVER.COM.MX',
    usuario_sap: '',
    rfc_asesor: '',
    area_banco: 'BANCO',
    area_casa: 'BANCO',
    es_asistente: false,
    es_virtual: false,
    nomina_asesor_virtual: '00000',
    segmento: '',
    canales: '',
    es_consultor: false,
    grupo: '',
    subgrupo: '',
    fecha_alta: '',
    usuario_alta: '',
    fecha_baja: '',
    usuario_baja: '',
    activo: false,
    creado: '2025-12-10T08:20:12.334159Z',
    modificado: ''
  }
];

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
    id_asesor_cve: ['', [Validators.maxLength(6)]],
    id_centro_financiero: ['', [Validators.required, Validators.maxLength(5)]],
    id_asesor_casa_bolsa: ['', [Validators.maxLength(8)]],
    id_promotor_banco: ['', [Validators.maxLength(8)]],
    nombre: ['', [Validators.required, Validators.maxLength(255)]],
    correo: ['', [Validators.maxLength(255), Validators.email]],
    usuario_sap: ['', [Validators.maxLength(50)]],
    rfc_asesor: ['', [Validators.maxLength(20)]],
    area_banco: ['', [Validators.maxLength(45)]],
    area_casa: ['', [Validators.maxLength(45)]],
    es_asistente: [false],
    es_virtual: [false],
    nomina_asesor_virtual: ['', [Validators.maxLength(15)]],
    segmento: ['', [Validators.maxLength(2)]],
    canales: ['', [Validators.maxLength(2)]],
    es_consultor: [false],
    grupo: ['', [Validators.maxLength(2)]],
    subgrupo: ['', [Validators.maxLength(2)]],
    usuario_alta: ['', [Validators.maxLength(36)]],
    usuario_baja: ['', [Validators.maxLength(36)]],
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

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value as Partial<Asesor>;

    const isEditing = !!this.editingId;
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

