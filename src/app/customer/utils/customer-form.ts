import { FormGroup } from '@angular/forms';

export function emptyField(form: FormGroup): boolean {
  const oneInvalid = Object.values(form.controls).some((control: any) =>
    control.hasError('required')
  );
  if (oneInvalid) {
    Object.keys(form.controls).forEach((controlName) => {
      if (form.get(controlName)?.invalid) {
        console.log('empty - ', controlName);
        form.get(controlName)?.markAsTouched();
      }
    });
  }
  return oneInvalid;
}

export function validCombobox(fields: string[], form: FormGroup) {
  fields.forEach((field) => {
    const control = form.get(field);
    if (control && !control.value) {
      control.markAsTouched();
    }
  });
}


export function markInvalidControls(form: FormGroup): { [key: string]: any } {
  const invalidFields: { [key: string]: any } = {};
  Object.keys(form.controls).forEach((key) => {
    const control = form.get(key);
    if (control && control.invalid) {
      control.markAsTouched();
      invalidFields[key] = control.value;
    }
  });
  return invalidFields;
}

export {};
