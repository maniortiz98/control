import { FormControl, FormGroup } from '@angular/forms';
import { emptyField, validCombobox, markInvalidControls } from './customer-form';

describe('Form Utils', () => {

  describe('emptyField', () => {

    it('retorna false si no hay required errors', () => {
      const form = new FormGroup({
        a: new FormControl('ok'),
        b: new FormControl('ok')
      });

      const result = emptyField(form);

      expect(result).toBeFalse();
    });

    it('retorna true si hay required errors y marca touched', () => {
      const form = new FormGroup({
        a: new FormControl('', () => ({ required: true })),
        b: new FormControl('ok')
      });

      spyOn(console, 'log');

      const result = emptyField(form);

      expect(result).toBeTrue();
      expect(form.get('a')?.touched).toBeTrue();
      expect(form.get('b')?.touched).toBeFalse();
      expect(console.log).toHaveBeenCalledWith('empty - ', 'a');
    });

  });

  describe('validCombobox', () => {

    it('marca touched cuando valor es vacío', () => {
      const form = new FormGroup({
        a: new FormControl(''),
        b: new FormControl('value')
      });

      validCombobox(['a', 'b'], form);

      expect(form.get('a')?.touched).toBeTrue();
      expect(form.get('b')?.touched).toBeFalse();
    });

    it('ignora campos inexistentes', () => {
      const form = new FormGroup({
        a: new FormControl('')
      });

      validCombobox(['x'], form);

      expect(form.get('a')?.touched).toBeFalse();
    });

  });

  describe('markInvalidControls', () => {

    it('retorna objeto vacío si no hay errores', () => {
      const form = new FormGroup({
        a: new FormControl('ok')
      });

      const result = markInvalidControls(form);

      expect(result).toEqual({});
    });

    it('marca como touched y retorna valores inválidos', () => {
      const form = new FormGroup({
        a: new FormControl('', () => ({ required: true })),
        b: new FormControl('ok'),
        c: new FormControl('', () => ({ error: true }))
      });

      const result = markInvalidControls(form);

      expect(form.get('a')?.touched).toBeTrue();
      expect(form.get('c')?.touched).toBeTrue();
      expect(result).toEqual({
        a: '',
        c: ''
      });
    });

  });

});