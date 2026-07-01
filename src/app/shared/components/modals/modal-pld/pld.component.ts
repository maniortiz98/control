import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-pld',
  imports: [ReactiveFormsModule, MatSlideToggleModule, MatLabel,
    MatRadioButton, MatOption, MatSelectModule, MatButtonModule, MatRadioGroup,
    MatRadioButton, FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule],
  templateUrl: './pld.component.html',
  styleUrl: './pld.component.css'
})
export class PldComponent {

private readonly fb = inject(FormBuilder);
  profileForm: FormGroup = this.fb.group({
    curp: [],
    rfc: [],
    nombre: [],
    segundoNombre: [],
    fechaNacimiento: [],
    primerApellido: [],
    segundoApellido: [],
    genero:[],
    nacionalidad: [],
    paisNacimiento: [],
    estadoNacimiento: [],
    ciudadNacimiento: [],
    rol:[],
    area:[],
    centro:[],
    numCon:[],
    asesor:[],
    numClient:[],
    tipo:[],
  });
onSubmit() {

}
toUppercase(arg0: string) {
throw new Error('Method not implemented.');
}

}
