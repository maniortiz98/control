import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function oneOfRequiredFlagged(
  flag: () => boolean,
  leftCtrlName: string,
  rightCtrlName: string,
  errorKey: string = 'oneOfRequired',
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    if (!flag()) return null;
    const left = group.get(leftCtrlName)?.value?.toString().trim();
    const right = group.get(rightCtrlName)?.value?.toString().trim();
    return left || right ? null : { [errorKey]: true };
  };
}


export function isFormValidIncludingDisabled(form: AbstractControl): boolean {
  let isValid = true;

  const validate = (control: AbstractControl) => {
    const errors = control.validator ? control.validator(control) : null;
    if (errors) {
      isValid = false;
    }

    if (control instanceof FormGroup) {
      Object.values(control.controls).forEach(validate);
    }

    if (control instanceof FormArray) {
      control.controls.forEach(validate);
    }
  };

  validate(form);
  return isValid;
}

export function minDateValidator(min: Date) {
  return (control: AbstractControl) => {
    if (!(control.value instanceof Date)) return null;
    return control.value < min ? { minDate: true } : null;
  };
}

export function maxDateValidator(max: Date) {
  return (control: AbstractControl) => {
    if (!(control.value instanceof Date)) return null;
    return control.value > max ? { maxDate: true } : null;
  };
}
