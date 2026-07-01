import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import {
  isFormValidIncludingDisabled,
  maxDateValidator,
  minDateValidator,
  oneOfRequiredFlagged,
} from './validators';

describe('validators utils', () => {
  describe('oneOfRequiredFlagged', () => {
    it('retorna null cuando la bandera esta apagada', () => {
      const validator = oneOfRequiredFlagged(() => false, 'left', 'right');
      const group = new FormGroup({
        left: new FormControl(''),
        right: new FormControl(''),
      });

      expect(validator(group as AbstractControl)).toBeNull();
    });

    it('retorna error por defecto cuando ambos campos estan vacios', () => {
      const validator = oneOfRequiredFlagged(() => true, 'left', 'right');
      const group = new FormGroup({
        left: new FormControl('   '),
        right: new FormControl(''),
      });

      expect(validator(group as AbstractControl)).toEqual({ oneOfRequired: true });
    });

    it('retorna error personalizado cuando ambos campos estan vacios', () => {
      const validator = oneOfRequiredFlagged(() => true, 'left', 'right', 'customKey');
      const group = new FormGroup({
        left: new FormControl(''),
        right: new FormControl(''),
      });

      expect(validator(group as AbstractControl)).toEqual({ customKey: true });
    });

    it('retorna null si al menos un campo tiene valor no vacio', () => {
      const validator = oneOfRequiredFlagged(() => true, 'left', 'right');
      const leftGroup = new FormGroup({
        left: new FormControl('abc'),
        right: new FormControl(''),
      });
      const rightGroup = new FormGroup({
        left: new FormControl(''),
        right: new FormControl('xyz'),
      });

      expect(validator(leftGroup as AbstractControl)).toBeNull();
      expect(validator(rightGroup as AbstractControl)).toBeNull();
    });
  });

  describe('isFormValidIncludingDisabled', () => {
    it('retorna true cuando todos los controles son validos', () => {
      const form = new FormGroup({
        name: new FormControl('valid', Validators.required),
        details: new FormGroup({
          age: new FormControl(30, Validators.min(18)),
        }),
        items: new FormArray([new FormControl('x', Validators.required)]),
      });

      expect(isFormValidIncludingDisabled(form)).toBeTrue();
    });

    it('retorna false cuando existe control invalido en grupo anidado', () => {
      const form = new FormGroup({
        root: new FormControl('ok'),
        nested: new FormGroup({
          requiredField: new FormControl('', Validators.required),
        }),
      });

      expect(isFormValidIncludingDisabled(form)).toBeFalse();
    });

    it('retorna false cuando existe control invalido en form array', () => {
      const form = new FormGroup({
        rows: new FormArray([
          new FormControl('ok', Validators.required),
          new FormControl('', Validators.required),
        ]),
      });

      expect(isFormValidIncludingDisabled(form)).toBeFalse();
    });

    it('incluye controles deshabilitados en la validacion', () => {
      const disabledInvalid = new FormControl('', Validators.required);
      disabledInvalid.disable();

      const form = new FormGroup({
        disabledInvalid,
        activeValid: new FormControl('ok', Validators.required),
      });

      expect(isFormValidIncludingDisabled(form)).toBeFalse();
    });
  });

  describe('minDateValidator', () => {
    it('retorna null cuando el valor no es Date', () => {
      const min = new Date(2026, 0, 15);
      const validator = minDateValidator(min);
      const control = new FormControl('2026-01-10');

      expect(validator(control as AbstractControl)).toBeNull();
    });

    it('retorna error cuando la fecha es menor al minimo', () => {
      const min = new Date(2026, 0, 15);
      const validator = minDateValidator(min);
      const control = new FormControl(new Date(2026, 0, 10));

      expect(validator(control as AbstractControl)).toEqual({ minDate: true });
    });

    it('retorna null cuando la fecha es igual o mayor al minimo', () => {
      const min = new Date(2026, 0, 15);
      const validator = minDateValidator(min);

      expect(validator(new FormControl(new Date(2026, 0, 15)) as AbstractControl)).toBeNull();
      expect(validator(new FormControl(new Date(2026, 0, 20)) as AbstractControl)).toBeNull();
    });
  });

  describe('maxDateValidator', () => {
    it('retorna null cuando el valor no es Date', () => {
      const max = new Date(2026, 11, 31);
      const validator = maxDateValidator(max);
      const control = new FormControl('2027-01-01');

      expect(validator(control as AbstractControl)).toBeNull();
    });

    it('retorna error cuando la fecha es mayor al maximo', () => {
      const max = new Date(2026, 11, 31);
      const validator = maxDateValidator(max);
      const control = new FormControl(new Date(2027, 0, 1));

      expect(validator(control as AbstractControl)).toEqual({ maxDate: true });
    });

    it('retorna null cuando la fecha es igual o menor al maximo', () => {
      const max = new Date(2026, 11, 31);
      const validator = maxDateValidator(max);

      expect(validator(new FormControl(new Date(2026, 11, 31)) as AbstractControl)).toBeNull();
      expect(validator(new FormControl(new Date(2026, 10, 30)) as AbstractControl)).toBeNull();
    });
  });
});
