import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from '../../../../shared/services/notifications.service';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { environment } from '../../../../../environments/environment';

interface CatCpRecord {
  id_cp?: number;
  cp?: string;
  id_estado?: string;
  id_municipio?: string;
  id_colonia?: string;
  id_ciudad?: string;
  colonia?: string;
  centro_reparto?: string;
  activo?: boolean;
  creado?: string;
  modificado?: string | null;
}


interface UpsertCatalogResponse {
  status: number;
  messages: string[];
}

interface EstadoCatalogItem {
  id: string;
  nombre: string;
}

interface MunicipioCatalogItem {
  id: string;
  idEstado?: string;
  nombre: string;
}

interface CiudadCatalogItem {
  id: string;
  nombre: string;
}

export interface ColoniaItem {
  suburb:    string;
  idSuburb:  string;
  centerRep: string;
  idCp?:     number;
}

const ESTADOS_CATALOGO: EstadoCatalogItem[] = [
  { id: 'AGS', nombre: 'AGUASCALIENTES' },
  { id: 'BC',  nombre: 'BAJA CALIFORNIA' },
  { id: 'BCS', nombre: 'BAJA CALIFORNIA SUR' },
  { id: 'CHI', nombre: 'CHIHUAHUA' },
  { id: 'CHS', nombre: 'CHIAPAS' },
  { id: 'CMP', nombre: 'CAMPECHE' },
  { id: 'COA', nombre: 'COAHUILA' },
  { id: 'COL', nombre: 'COLIMA' },
  { id: 'DF',  nombre: 'CIUDAD DE MEXICO' },
  { id: 'DGO', nombre: 'DURANGO' },
  { id: 'GRO', nombre: 'GUERRERO' },
  { id: 'GTO', nombre: 'GUANAJUATO' },
  { id: 'HGO', nombre: 'HIDALGO' },
  { id: 'JAL', nombre: 'JALISCO' },
  { id: 'MCH', nombre: 'MICHOACAN' },
  { id: 'MEX', nombre: 'ESTADO DE MEXICO' },
  { id: 'MOR', nombre: 'MORELOS' },
  { id: 'NAY', nombre: 'NAYARIT' },
  { id: 'NL',  nombre: 'NUEVO LEON' },
  { id: 'OAX', nombre: 'OAXACA' },
  { id: 'PUE', nombre: 'PUEBLA' },
  { id: 'QR',  nombre: 'QUINTANA ROO' },
  { id: 'QRO', nombre: 'QUERETARO' },
  { id: 'SIN', nombre: 'SINALOA' },
  { id: 'SLP', nombre: 'SAN LUIS POTOSI' },
  { id: 'SON', nombre: 'SONORA' },
  { id: 'TAB', nombre: 'TABASCO' },
  { id: 'TLX', nombre: 'TLAXCALA' },
  { id: 'TMS', nombre: 'TAMAULIPAS' },
  { id: 'VER', nombre: 'VERACRUZ' },
  { id: 'YUC', nombre: 'YUCATAN' },
  { id: 'ZAC', nombre: 'ZACATECAS' },
  { id: 'NE',  nombre: 'NO ESPECIFICADO' },
  { id: 'NA',  nombre: 'NO APLICA' },
  { id: 'SI',  nombre: 'SE IGNORA' },
];

@Component({
  selector: 'app-domicilios-catalog',
  standalone: false,
  templateUrl: './domicilios.component.html',
  styleUrl: './domicilios.component.scss'
})
export class DomiciliosComponent implements OnInit {

  private readonly fb                  = inject(FormBuilder);
  private readonly notificationService = inject(NotificationsService);
  private readonly httpService         = inject(HttpClientService);
  private readonly retrieveUrl         = environment.api.maintenance.spineCatalogRetrieve;
  private readonly upsertUrl           = environment.api.maintenance.spineCatalogUpsert;
  private readonly municipioRetrieveUrl = environment.api.maintenance.spineCatalogRetrieve;
  private readonly ciudadRetrieveUrl   = environment.api.maintenance.spineCatalogRetrieve;

  openPais   = true;
  openEstado = false;
  openMun    = false;
  openCiudad = false;
  openCp     = true;

  loadingZip = signal(false);
  manualCpMode = signal(false);
  colonies   = signal<ColoniaItem[]>([]);
  estadosCatalogo = signal<EstadoCatalogItem[]>([]);
  municipiosCatalogo = signal<MunicipioCatalogItem[]>([]);
  ciudadesCatalogo = signal<CiudadCatalogItem[]>([]);

  paisForm   = this.fb.group({ rows: this.fb.array([]) });
  estadoForm = this.fb.group({ rows: this.fb.array([]) });
  munForm    = this.fb.group({ rows: this.fb.array([]) });
  ciudadForm = this.fb.group({ rows: this.fb.array([]) });

  cpForm: FormGroup = this.fb.group({
    cp:               ['', [Validators.required, Validators.pattern(/^\d{5,6}$/)]],
    colonia:          [''],
    id_estado:        ['', Validators.required],
    id_municipio:     ['', Validators.required],
    nombre_municipio: [''],
    id_ciudad:        ['', Validators.required],
    nombre_ciudad:    [''],
    activo:           ['TRUE']
  });

  get paisRows():   FormArray { return this.paisForm.get('rows')   as FormArray; }
  get estadoRows(): FormArray { return this.estadoForm.get('rows') as FormArray; }
  get munRows():    FormArray { return this.munForm.get('rows')    as FormArray; }
  get ciudadRows(): FormArray { return this.ciudadForm.get('rows') as FormArray; }

  get paisDone():   boolean { return this.paisRows.length   > 0 && this.paisRows.valid;   }
  get estadoDone(): boolean { return this.estadoRows.length > 0 && this.estadoRows.valid; }
  get munDone():    boolean { return this.munRows.length    > 0 && this.munRows.valid;    }
  get ciudadDone(): boolean { return this.ciudadRows.length > 0 && this.ciudadRows.valid; }
  get cpDone():     boolean { return this.cpForm.valid; }
  get hasCpValue():  boolean { return /^\d{5,6}$/.test(String(this.cpForm.get('cp')?.value ?? '').trim()); }

  get completedSections(): number {
    return [this.paisDone, this.estadoDone, this.munDone, this.ciudadDone, this.cpDone]
      .filter(Boolean).length;
  }

  get progressPercent(): number { return (this.completedSections / 5) * 100; }
  // Se considera "listo" cuando al menos País o Estado tienen un registro válido
  get allDone():         boolean { return this.paisDone || this.estadoDone; }

  asGroup(ctrl: any): FormGroup { return ctrl as FormGroup; }

  ngOnInit(): void {
    this.loadEstadosCatalogo();
  }

  // ── Lookup CP ─────────────────────────────────────────────────────────────

  onCpBlur(): void {
    const cp: string = this.cpForm.get('cp')?.value ?? '';
    if (!/^\d{5,6}$/.test(cp)) {
      this.colonies.set([]);
      this.manualCpMode.set(false);
      return;
    }

    this.loadingZip.set(true);
    this.manualCpMode.set(false);
    this.colonies.set([]);
    this.cpForm.patchValue({ colonia: '', id_estado: '', id_municipio: '', nombre_municipio: '', id_ciudad: '', nombre_ciudad: '' });
    this.ciudadesCatalogo.set([]);

    const request = {
      catalogName: 'catcp',
      fields: ['id_cp', 'cp', 'id_estado', 'id_municipio', 'id_colonia', 'id_ciudad', 'colonia', 'centro_reparto', 'activo'],
      filterField: 'cp',
      filterValue: cp
    };

    this.httpService.post<{ status: number; payload: CatCpRecord[]; messages: string[] }>(this.retrieveUrl, request)
      .subscribe({
        next: response => {
          const records = response.status === 200 && Array.isArray(response.payload)
            ? response.payload : [];

          if (records.length === 0) {
            this.notificationService.warning('No se encontró información para el CP ingresado. Captura manualmente el nuevo código postal y su colonia.');
            this.manualCpMode.set(true);
            this.colonies.set([{ suburb: '', idSuburb: '', centerRep: '' }]);
            this.loadEstadosCatalogo();
            this.loadingZip.set(false);
            return;
          }

          const first = records[0];
          this.cpForm.patchValue({
            id_estado:     first.id_estado      ?? '',
            id_municipio:  first.id_municipio   ?? '',
            id_ciudad:     first.id_ciudad      ?? '',
            centro_reparto: first.centro_reparto ?? ''
          });

          if (records.length === 1) {
            this.cpForm.patchValue({ colonia: first.colonia ?? '' });
          }

          this.colonies.set(records.map(r => ({
            suburb:    r.colonia        ?? '',
            idSuburb:  r.id_colonia     ?? '',
            centerRep: r.centro_reparto ?? '',
            idCp:      r.id_cp
          })));

          this.manualCpMode.set(false);
          this.municipiosCatalogo.set([]);
          this.loadCiudadesCatalogo(first.id_estado ?? '');
          this.loadingZip.set(false);
        },
        error: () => {
          this.notificationService.warning('No se encontró información para el CP ingresado. Captura manualmente el nuevo código postal y su colonia.');
          this.manualCpMode.set(true);
          this.colonies.set([{ suburb: '', idSuburb: '', centerRep: '' }]);
          this.loadEstadosCatalogo();
          this.loadingZip.set(false);
        }
      });
  }

  onEstadoChangeManual(idEstado: string): void {
    this.cpForm.patchValue({
      id_estado: idEstado ?? '',
      id_municipio: '',
      nombre_municipio: '',
      id_ciudad: '',
      nombre_ciudad: ''
    });
    this.municipiosCatalogo.set([]);
    this.ciudadesCatalogo.set([]);

    const estadoSeleccionado = String(idEstado ?? '').trim();
    if (!estadoSeleccionado) {
      return;
    }

    this.loadMunicipiosCatalogo(estadoSeleccionado);
    this.loadCiudadesCatalogo(estadoSeleccionado);
  }

  onMunicipioChangeManual(idMunicipio: string): void {
    const municipioSeleccionado = this.municipiosCatalogo()
      .find(m => m.id === String(idMunicipio ?? '').trim());

    this.cpForm.patchValue({
      id_municipio: String(idMunicipio ?? '').trim(),
      nombre_municipio: municipioSeleccionado?.nombre ?? ''
    });
  }

  onMunicipioInputManual(nombreMunicipio: string): void {
    const municipioSeleccionado = this.municipiosCatalogo()
      .find(m => m.nombre.toLowerCase() === String(nombreMunicipio ?? '').trim().toLowerCase());

    this.cpForm.patchValue({
      nombre_municipio: nombreMunicipio,
      id_municipio: municipioSeleccionado?.id ?? ''
    });
  }

  onCiudadChangeManual(idCiudad: string): void {
    const ciudadSeleccionada = this.ciudadesCatalogo()
      .find(c => c.id === String(idCiudad ?? '').trim());

    this.cpForm.patchValue({
      id_ciudad: String(idCiudad ?? '').trim(),
      nombre_ciudad: ciudadSeleccionada?.nombre ?? ''
    });
  }

  onCiudadInputManual(nombreCiudad: string): void {
    const ciudadSeleccionada = this.ciudadesCatalogo()
      .find(c => c.nombre.toLowerCase() === String(nombreCiudad ?? '').trim().toLowerCase());

    this.cpForm.patchValue({
      nombre_ciudad: nombreCiudad,
      id_ciudad: ciudadSeleccionada?.id ?? ''
    });
  }

  private loadEstadosCatalogo(): void {
    this.estadosCatalogo.set(ESTADOS_CATALOGO);
  }

  private loadMunicipiosCatalogo(idEstado: string): void {
    const request = {
      catalogName: 'catmunicipio',
      fields: ['id_municipio', 'id_municipio_cve', 'id_estado', 'id_zona_geografica', 'municipio', 'activo'],
      filterField: 'id_estado',
      filterValue: idEstado
    };

    this.httpService.post<{ status: number; payload: any[]; messages: string[] }>(
      this.municipioRetrieveUrl,
      request
    )
      .subscribe({
        next: response => {
          const municipios = this.normalizeMunicipiosResponse(response?.payload);
          this.municipiosCatalogo.set(municipios);
        },
        error: () => {
          this.notificationService.warning('No fue posible cargar el catálogo de municipios para el estado seleccionado');
          this.municipiosCatalogo.set([]);
        }
      });
  }

  private loadCiudadesCatalogo(idEstado: string): void {
    const request = {
      catalogName: 'catciudad',
      fields: ['id_ciudad', 'id_ciudad_cve', 'ciudad', 'id_estado', 'activo'],
      filterField: 'id_estado',
      filterValue: idEstado
    };

    this.httpService.post<{ status: number; payload: any[]; messages: string[] }>(
      this.ciudadRetrieveUrl,
      request
    )
      .subscribe({
        next: response => {
          const ciudades = this.normalizeCiudadesResponse(response?.payload);
          this.ciudadesCatalogo.set(ciudades);

          const selectedIdCiudad = String(this.cpForm.get('id_ciudad')?.value ?? '').trim();
          if (!selectedIdCiudad) {
            return;
          }

          const ciudadSeleccionada = ciudades.find(ciudad => ciudad.id === selectedIdCiudad);
          this.cpForm.patchValue({ nombre_ciudad: ciudadSeleccionada?.nombre ?? '' });
        },
        error: () => {
          this.notificationService.warning('No fue posible cargar el catálogo de ciudades');
          this.ciudadesCatalogo.set([]);
        }
      });
  }

  private normalizeMunicipiosResponse(response: any): MunicipioCatalogItem[] {
    const rows = Array.isArray(response) ? response : [];

    if (!Array.isArray(rows)) {
      return [];
    }

    return rows
      .map((item: any) => ({
        id: String(item?.id_municipio_cve ?? '').trim(),
        idEstado: String(item?.id_estado ?? '').trim(),
        nombre: String(item?.municipio ?? '').trim()
      }))
      .filter((item: MunicipioCatalogItem) => !!item.id);
  }

  private normalizeCiudadesResponse(response: any): CiudadCatalogItem[] {
    const rows = Array.isArray(response)
      ? response
      : (response?.payload ?? []);

    if (!Array.isArray(rows)) {
      return [];
    }

    return rows
      .map((item: any) => ({
        id: String(item?.id_ciudad_cve ?? item?.id_ciudad ?? '').trim(),
        nombre: String(item?.ciudad ?? '').trim()
      }))
      .filter((item: CiudadCatalogItem) => !!item.id);
  }

  removeColony(index: number): void {
    this.colonies.update(list => list.filter((_, i) => i !== index));
  }

  hasCompleteColonyRow(): boolean {
    return this.colonies().some(item =>
      !!String(item.suburb ?? '').trim()
      && String(item.idSuburb ?? '').trim().length === 4
      && String(item.centerRep ?? '').trim().length === 5
    );
  }

  allColoniesIdSuburbValid(): boolean {
    const withSuburb = this.colonies().filter(item => !!String(item.suburb ?? '').trim());
    if (withSuburb.length === 0) return true;
    return withSuburb.every(item =>
      String(item.idSuburb  ?? '').trim().length === 4 &&
      String(item.centerRep ?? '').trim().length === 5
    );
  }

  addColony(): void {
    const raw = this.cpForm.getRawValue();
    const cp = String(raw.cp ?? '').trim();
    if (!/^\d{5,6}$/.test(cp)) {
      this.notificationService.error('Ingresa un Código Postal válido antes de agregar colonias');
      return;
    }

    if (!this.hasCompleteColonyRow()) {
      this.notificationService.warning('Completa al menos una colonia con nombre, clave interna y centro de reparto antes de agregar otra.');
      return;
    }

    this.colonies.update(list => [...list, { suburb: '', idSuburb: '', centerRep: '' }]);
  }

  trackByColonyIndex(index: number): number {
    return index;
  }

  updateColony(index: number, field: 'suburb' | 'idSuburb' | 'centerRep', value: string): void {
    const normalizedValue = field === 'suburb' ? value.toUpperCase() : value;
    this.colonies.update(list =>
      list.map((item, i) => i === index ? { ...item, [field]: normalizedValue } : item)
    );
  }

  onColoniaChange(): void {
    const suburb = this.cpForm.get('colonia')?.value as string;
    const item = this.colonies().find(c => c.suburb === suburb);
    if (item) {
      this.colonies.update(list =>
        list.map(c => c.suburb === suburb ? { ...c } : c)
      );
    }
  }

  // ── Pais ──────────────────────────────────────────────────────────────────

  addPais(): void {
    this.paisRows.push(this.fb.group({
      id_pais_cve: ['', Validators.required],
      nombre_pais: ['', Validators.required],
      codigo_area: [''],
      activo:      ['TRUE']
    }));
    this.openPais = true;
  }
  removePais(i: number): void { this.paisRows.removeAt(i); }

  // ── Estado ────────────────────────────────────────────────────────────────

  addEstado(): void {
    this.estadoRows.push(this.fb.group({
      id_estado_cve:    ['', Validators.required],
      estado:           ['', Validators.required],
      id_estado_renapo: [''],
      activo:           ['TRUE']
    }));
    this.openEstado = true;
  }
  removeEstado(i: number): void { this.estadoRows.removeAt(i); }

  // ── Municipio ─────────────────────────────────────────────────────────────

  addMun(): void {
    this.munRows.push(this.fb.group({
      id_municipio_cve:   ['', Validators.required],
      id_estado:          ['', Validators.required],
      municipio:          ['', Validators.required],
      id_zona_geografica: ['']
    }));
    this.openMun = true;
  }
  removeMun(i: number): void { this.munRows.removeAt(i); }

  // ── Ciudad ────────────────────────────────────────────────────────────────

  addCiudad(): void {
    this.ciudadRows.push(this.fb.group({
      id_ciudad_cve: ['', Validators.required],
      ciudad:        ['', Validators.required],
      id_estado:     ['', Validators.required],
      activo:        ['TRUE']
    }));
    this.openCiudad = true;
  }
  removeCiudad(i: number): void { this.ciudadRows.removeAt(i); }

  // ── Save ──────────────────────────────────────────────────────────────────

  guardar(): void {
    if (!this.cpDone) {
      this.cpForm.markAllAsTouched();
      this.notificationService.error('Completa el formulario de Código Postal');
      return;
    }

    if (this.manualCpMode() && !this.hasCompleteColonyRow()) {
      this.notificationService.error('Completa al menos una colonia con nombre, clave interna y centro de reparto.');
      return;
    }

    this.saveCpRecords();
  }

  private saveCpRecords(): void {

    const colonias = this.buildColoniaRecords();

    if (colonias.length === 0) {
      this.notificationService.error('No hay colonias válidas para guardar');
      return;
    }

    const requests = colonias.map(({ isNew, record }) => {
      const records: Record<string, string | number | boolean>[] = isNew
        ? [record]                          // alta: un registro sin id_cp
        : [record];                         // edición: un registro con id_cp incluido

      return this.httpService.post<UpsertCatalogResponse>(this.upsertUrl, {
        catalogName: 'catcp',
        records
      });
    });

    let completed = 0;
    let errors = 0;
    const total = requests.length;

    requests.forEach((req$) => {
      req$.subscribe({
        next: (response) => {
          completed++;
          if (response.status !== 200) {
            errors++;
          }

          if (completed === total) {
            if (errors === 0) {
              this.notificationService.success(
                total === 1
                  ? 'Colonia guardada correctamente'
                  : `${total} colonias guardadas correctamente`
              );
            } else {
              this.notificationService.error(
                `${errors} de ${total} colonias no pudieron guardarse`
              );
            }
            this.onCpBlur();
          }
        },
        error: () => {
          completed++;
          errors++;
          if (completed === total) {
            this.notificationService.error(
              `${errors} de ${total} colonias no pudieron guardarse`
            );
            this.onCpBlur();
          }
        }
      });
    });
  }

  private buildColoniaRecords(): { isNew: boolean; record: Record<string, string | number | boolean> }[] {
    const raw = this.cpForm.getRawValue();
    const cp          = String(raw.cp          ?? '').trim();
    const idEstado    = String(raw.id_estado    ?? '').trim();
    const idMunicipio = String(raw.id_municipio ?? '').trim();
    const idCiudad    = String(raw.id_ciudad    ?? '').trim();
    const activo      = this.parseBoolean(raw.activo);
    const coloniaForm = String(raw.colonia      ?? '').trim();

    const colonySource = this.colonies().length
      ? this.colonies()
      : [{ suburb: coloniaForm, idSuburb: '', centerRep: '', idCp: undefined }];

    return colonySource
      .filter(item => !!String(item.suburb ?? '').trim())
      .map(item => {
        const isNew = item.idCp == null;
        const record: Record<string, string | number | boolean> = {
          cp,
          id_estado:     idEstado,
          id_municipio:  idMunicipio,
          id_colonia:    String(item.idSuburb  ?? '').trim(),
          id_ciudad:     idCiudad,
          colonia:       String(item.suburb    ?? '').trim(),
          centro_reparto: String(item.centerRep ?? '').trim(),
          activo
        };
        if (!isNew) {
          record['id_cp'] = item.idCp as number;
        }
        return { isNew, record };
      });
  }

  private parseBoolean(value: unknown): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    const normalized = String(value ?? '').trim().toLowerCase();
    return normalized === 'true' || normalized === '1' || normalized === 'si' || normalized === 'sí';
  }
}
