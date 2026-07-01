import { FormGroup } from '@angular/forms';

export abstract class FormBase {
  form!: FormGroup; // La clase hija debe definirlo

  /**
   * Marca los campos requeridos vacíos y devuelve true si alguno es inválido
   */
  protected validateRequiredFields(): boolean {
    const oneInvalid = Object.values(this.form.controls)
      .some(control => control.hasError('required'));

    if (oneInvalid) {
      Object.keys(this.form.controls).forEach(controlName => {
        const control = this.form.get(controlName);
        if (control?.invalid) {
          control.markAsTouched();
          console.warn('Campo vacío:', controlName);
        }
      });
    }

    return oneInvalid;
  }

  /**
   * Checks if some control has error.
   */
  protected invalidFormatFields(): any {
    let invalid = false;
    Object.values(this.form.controls).map((control) => {
      if ( control.invalid ) {
        invalid = true;
        control.markAsTouched();
      }
    });
    return invalid;
  }

  /**
   * Método genérico para marcar todo el formulario como "tocado"
   */
  protected markAllAsTouched(): void {
    Object.values(this.form.controls).forEach(control => control.markAsTouched());
  }

  /**
   * Método abstracto: cada hijo define su comportamiento al enviar
   */
  abstract onSubmit(): void;
}
