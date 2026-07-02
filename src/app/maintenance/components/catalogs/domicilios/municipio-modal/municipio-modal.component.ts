import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificationsService } from '../../../../../shared/services/notifications.service';
import { ERROR_MESSAGES } from '../../../../../onboarding/constants/form-messages';

export interface MunicipioModalData {
  idEstado: string;
  estadoNombre: string;
  municipiosExistentes: string[];
}

export interface NuevoMunicipioResult {
  id_municipio_cve: string;
  id_estado: string;
  municipio: string;
  id_zona_geografica: string;
  activo: boolean;
}

@Component({
  selector: 'app-municipio-modal',
  standalone: false,
  templateUrl: './municipio-modal.component.html',
  styleUrl: './municipio-modal.component.scss'
})
export class MunicipioModalComponent implements OnInit {

  private readonly fb                  = inject(FormBuilder);
  private readonly notificationService = inject(NotificationsService);

  readonly data      = inject<MunicipioModalData>(MAT_DIALOG_DATA);
  readonly dialogRef = inject(MatDialogRef<MunicipioModalComponent>);

  private readonly clavesExistentes = new Set(
    (this.data?.municipiosExistentes ?? []).map(clave => clave.trim().toUpperCase())
  );

  form: FormGroup = this.fb.group({
    idMunicipioCve:   ['', Validators.required],
    municipio:        ['', Validators.required],
    idZonaGeografica: [''],
    activo:           [true]
  });

  get estadoNombre(): string {
    return this.data?.estadoNombre ?? '';
  }

  ngOnInit(): void {
    this.form.patchValue({ idMunicipioCve: this.generarClaveSugerida() });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => control.markAsTouched());
      this.notificationService.error(ERROR_MESSAGES.REQUIRED_FIELDS);
      return;
    }

    const claveIngresada = String(this.form.getRawValue().idMunicipioCve).trim().toUpperCase();
    if (this.clavesExistentes.has(claveIngresada)) {
      this.notificationService.error('Esa clave ya existe en el catálogo, captura una diferente');
      return;
    }

    const raw = this.form.getRawValue();
    const result: NuevoMunicipioResult = {
      id_municipio_cve:   claveIngresada,
      id_estado:          this.data.idEstado,
      municipio:          String(raw.municipio).trim().toUpperCase(),
      id_zona_geografica: String(raw.idZonaGeografica ?? '').trim(),
      activo:             !!raw.activo
    };
    this.dialogRef.close(result);
  }

  close(): void {
    this.dialogRef.close();
  }

  private generarClaveSugerida(): string {
    let intentos = 0;
    let clave: string;
    do {
      clave = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
      intentos++;
    } while (this.clavesExistentes.has(clave) && intentos < 50);

    return clave;
  }
}
