import { FormControl, FormGroup, FormArray } from '@angular/forms';
import {
  oneOfRequiredFlagged,
  isFormValidIncludingDisabled,
  minDateValidator,
  maxDateValidator
} from './customer-validators';

describe('Custom Validators', () => {

  describe('oneOfRequiredFlagged', () => {

    it('flag false', () => {
      const validator = oneOfRequiredFlagged(() => false, 'a', 'b');

      const form = new FormGroup({
        a: new FormControl(''),
        b: new FormControl('')
      });

      expect(validator(form)).toBeNull();
    });

    it('ambos vacíos', () => {
      const validator = oneOfRequiredFlagged(() => true, 'a', 'b');

      const form = new FormGroup({
        a: new FormControl(''),
        b: new FormControl('')
      });

      expect(validator(form)).toEqual({ oneOfRequired: true });
    });

    it('uno con valor', () => {
      const validator = oneOfRequiredFlagged(() => true, 'a', 'b');

      const form = new FormGroup({
        a: new FormControl('value'),
        b: new FormControl('')
      });

      expect(validator(form)).toBeNull();
    });

    it('trim()', () => {
      const validator = oneOfRequiredFlagged(() => true, 'a', 'b');

      const form = new FormGroup({
        a: new FormControl('   '),
        b: new FormControl('')
      });

      expect(validator(form)).toEqual({ oneOfRequired: true });
    });

  });

  describe('isFormValidIncludingDisabled', () => {

    it('válido', () => {
      const form = new FormGroup({
        a: new FormControl('ok')
      });

      expect(isFormValidIncludingDisabled(form)).toBeTrue();
    });

    it('error en control', () => {
      const form = new FormGroup({
        a: new FormControl('', () => ({ error: true }))
      });

      expect(isFormValidIncludingDisabled(form)).toBeFalse();
    });

    it('FormGroup anidado', () => {
      const form = new FormGroup({
        group: new FormGroup({
          a: new FormControl('', () => ({ error: true }))
        })
      });

      expect(isFormValidIncludingDisabled(form)).toBeFalse();
    });

    it('FormArray', () => {
      const form = new FormGroup({
        arr: new FormArray([
          new FormControl('ok'),
          new FormControl('', () => ({ error: true }))
        ])
      });

      expect(isFormValidIncludingDisabled(form)).toBeFalse();
    });

    it('disabled también valida', () => {
      const control = new FormControl('', () => ({ error: true }));
      control.disable();

      const form = new FormGroup({
        a: control
      });

      expect(isFormValidIncludingDisabled(form)).toBeFalse();
    });

  });

  describe('minDateValidator', () => {

    it('no Date', () => {
      const validator = minDateValidator(new Date());
      const control = new FormControl('x');

      expect(validator(control)).toBeNull();
    });

    it('menor', () => {
      const min = new Date('2024-01-01');
      const validator = minDateValidator(min);

      const control = new FormControl(new Date('2023-01-01'));

      expect(validator(control)).toEqual({ minDate: true });
    });

    it('válida', () => {
      const min = new Date('2024-01-01');
      const validator = minDateValidator(min);

      const control = new FormControl(new Date('2024-02-01'));

      expect(validator(control)).toBeNull();
    });

  });

  describe('maxDateValidator', () => {

    it('no Date', () => {
      const validator = maxDateValidator(new Date());
      const control = new FormControl('x');

      expect(validator(control)).toBeNull();
    });

    it('mayor', () => {
      const max = new Date('2024-01-01');
      const validator = maxDateValidator(max);

      const control = new FormControl(new Date('2025-01-01'));

      expect(validator(control)).toEqual({ maxDate: true });
    });

    it('válida', () => {
      const max = new Date('2024-01-01');
      const validator = maxDateValidator(max);

      const control = new FormControl(new Date('2024-01-01'));

      expect(validator(control)).toBeNull();
    });

  });

});