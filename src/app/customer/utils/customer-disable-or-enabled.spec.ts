import { FormControl, FormGroup } from '@angular/forms';
import {
  formFunctionDis,
  formFunctionDisMatch,
  butonFunctionDis,
  formFunctionEn,
  formFunctionEnAll,
  buttonFunctionEn
} from './customer-disable-or-enabled';

describe('Form Enable/Disable Utils', () => {

  describe('formFunctionDis', () => {

    it('deshabilita todos excepto excepciones', () => {
      const form = new FormGroup({
        a: new FormControl(''),
        b: new FormControl('')
      });

      formFunctionDis(form, ['a']);

      expect(form.get('a')?.disabled).toBeFalse();
      expect(form.get('b')?.disabled).toBeTrue();
    });

  });

  describe('formFunctionDisMatch', () => {

    it('deshabilita solo los que coinciden', () => {
      const form = new FormGroup({
        a: new FormControl(''),
        b: new FormControl('')
      });

      formFunctionDisMatch(form, ['a']);

      expect(form.get('a')?.disabled).toBeTrue();
      expect(form.get('b')?.disabled).toBeFalse();
    });

  });

  describe('butonFunctionDis', () => {

    it('agrega atributo disabled a botones existentes', () => {
      const button = document.createElement('button');
      button.id = 'btn1';
      document.body.appendChild(button);

      butonFunctionDis(['btn1']);

      expect(button.getAttribute('disabled')).toBe('true');

      document.body.removeChild(button);
    });

    it('ignora botones inexistentes', () => {
      expect(() => butonFunctionDis(['no-existe'])).not.toThrow();
    });

  });

  describe('formFunctionEn', () => {

    it('habilita solo los incluidos y no excepciones', () => {
      const form = new FormGroup({
        a: new FormControl(''),
        b: new FormControl('')
      });

      form.disable();

      formFunctionEn(form, ['a'], []);

      expect(form.get('a')?.enabled).toBeTrue();
      expect(form.get('b')?.disabled).toBeTrue();
    });

    it('no habilita excepciones', () => {
      const form = new FormGroup({
        a: new FormControl(''),
        b: new FormControl('')
      });

      form.disable();

      formFunctionEn(form, ['a', 'b'], ['a']);

      expect(form.get('a')?.disabled).toBeTrue();
      expect(form.get('b')?.enabled).toBeTrue();
    });

  });

  describe('formFunctionEnAll', () => {

    it('habilita todos excepto excepciones', () => {
      const form = new FormGroup({
        a: new FormControl(''),
        b: new FormControl('')
      });

      form.disable();

      formFunctionEnAll(form, ['a']);

      expect(form.get('a')?.disabled).toBeTrue();
      expect(form.get('b')?.enabled).toBeTrue();
    });

  });

  describe('buttonFunctionEn', () => {

    it('remueve disabled excepto excepciones', () => {
      const btn1 = document.createElement('button');
      const btn2 = document.createElement('button');

      btn1.id = 'btn1';
      btn2.id = 'btn2';

      btn1.setAttribute('disabled', 'true');
      btn2.setAttribute('disabled', 'true');

      document.body.appendChild(btn1);
      document.body.appendChild(btn2);

      buttonFunctionEn(['btn1', 'btn2'], ['btn2']);

      expect(btn1.hasAttribute('disabled')).toBeFalse();
      expect(btn2.getAttribute('disabled')).toBe('true');

      document.body.removeChild(btn1);
      document.body.removeChild(btn2);
    });

    it('ignora botones inexistentes', () => {
      expect(() => buttonFunctionEn(['no-existe'])).not.toThrow();
    });

  });

});