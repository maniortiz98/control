
import { FormControl, FormGroup } from '@angular/forms';
import {
  formFunctionDis,
  butonFunctionDis,
  formFunctionEn,
  formFunctionEnAll,
  buttonFunctionEn,
  formFunctionDisMatch
} from './disableOrEnabled';

describe('Form & Button utilities', () => {

  // ------------------------------------------------------
  // formFunctionDis
  // ------------------------------------------------------
  describe('formFunctionDis', () => {
    it('should disable all controls except those in exceptions', () => {
      const form = new FormGroup({
        a: new FormControl({ value: 'A', disabled: false }),
        b: new FormControl({ value: 'B', disabled: false }),
        c: new FormControl({ value: 'C', disabled: false }),
      });

      formFunctionDis(form, ['b']); // b es excepción (no se deshabilita)

      expect(form.get('a')!.disabled).toBeTrue();
      expect(form.get('b')!.disabled).toBeFalse();
      expect(form.get('c')!.disabled).toBeTrue();
    });

    it('should disable every control when exceptions is empty', () => {
      const form = new FormGroup({
        x: new FormControl({ value: 1, disabled: false }),
        y: new FormControl({ value: 2, disabled: false }),
      });

      formFunctionDis(form);

      expect(form.get('x')!.disabled).toBeTrue();
      expect(form.get('y')!.disabled).toBeTrue();
    });
  });

  // ------------------------------------------------------
  // formFunctionDisMatch
  // ------------------------------------------------------
  describe('formFunctionDis', () => {
    it('should disable all controls except those in exceptions', () => {
      const form = new FormGroup({
        a: new FormControl({ value: 'A', disabled: false }),
        b: new FormControl({ value: 'B', disabled: false }),
        c: new FormControl({ value: 'C', disabled: false }),
      });

      formFunctionDisMatch(form, ['b']);

      expect(form.get('a')!.disabled).toBeFalse();
      expect(form.get('b')!.disabled).toBeTrue();
      expect(form.get('c')!.disabled).toBeFalse();
    });
  });

  // ------------------------------------------------------
  // butonFunctionDis
  // ------------------------------------------------------
  describe('butonFunctionDis', () => {
    let btn1: HTMLButtonElement;
    let btn2: HTMLButtonElement;

    beforeEach(() => {
      // Crear botones en el DOM
      btn1 = document.createElement('button');
      btn1.id = 'btn1';
      document.body.appendChild(btn1);

      btn2 = document.createElement('button');
      btn2.id = 'btn2';
      btn2.setAttribute('disabled', 'true'); // ya deshabilitado
      document.body.appendChild(btn2);
    });

    afterEach(() => {
      // Limpiar DOM
      btn1.remove();
      btn2.remove();
    });

    it('should set disabled="true" on existing buttons by id', () => {
      expect(document.getElementById('btn1')!.hasAttribute('disabled')).toBeFalse();
      expect(document.getElementById('btn2')!.getAttribute('disabled')).toBe('true');

      butonFunctionDis(['btn1', 'btn2']);

      expect(document.getElementById('btn1')!.getAttribute('disabled')).toBe('true');
      expect(document.getElementById('btn2')!.getAttribute('disabled')).toBe('true');
    });

    it('should ignore non-existing button ids gracefully', () => {
      expect(() => butonFunctionDis(['not-exists'])).not.toThrow();
    });
  });

  // ------------------------------------------------------
  // formFunctionEn
  // ------------------------------------------------------
  describe('formFunctionEn', () => {
    it('should enable only the controls listed in enables, excluding exceptions', () => {
      const form = new FormGroup({
        a: new FormControl({ value: 'A', disabled: true }),
        b: new FormControl({ value: 'B', disabled: true }),
        c: new FormControl({ value: 'C', disabled: true }),
        d: new FormControl({ value: 'D', disabled: true }),
      });

      // habilitar a, b, c pero c es excepción -> no se habilita
      formFunctionEn(form, ['a', 'b', 'c'], ['c']);

      expect(form.get('a')!.enabled).toBeTrue();
      expect(form.get('b')!.enabled).toBeTrue();
      expect(form.get('c')!.enabled).toBeFalse(); // excepción
      expect(form.get('d')!.enabled).toBeFalse(); // no está en enables
    });

    it('should do nothing if enables is empty', () => {
      const form = new FormGroup({
        x: new FormControl({ value: 1, disabled: true }),
        y: new FormControl({ value: 2, disabled: true }),
      });

      formFunctionEn(form, []);

      expect(form.get('x')!.disabled).toBeTrue();
      expect(form.get('y')!.disabled).toBeTrue();
    });

    it('should ignore unknown control names in enables without throwing', () => {
      const form = new FormGroup({
        x: new FormControl({ value: 1, disabled: true }),
      });

      expect(() => formFunctionEn(form, ['x', 'ghost'], [])).not.toThrow();
      expect(form.get('x')!.enabled).toBeTrue();
    });
  });

  // ------------------------------------------------------
  // formFunctionEnAll
  // ------------------------------------------------------
  describe('formFunctionEnAll', () => {
    it('should enable all controls except those in exceptions', () => {
      const form = new FormGroup({
        a: new FormControl({ value: 'A', disabled: true }),
        b: new FormControl({ value: 'B', disabled: true }),
        c: new FormControl({ value: 'C', disabled: true }),
      });

      formFunctionEnAll(form, ['b']);

      expect(form.get('a')!.enabled).toBeTrue();
      expect(form.get('b')!.enabled).toBeFalse(); // excepción
      expect(form.get('c')!.enabled).toBeTrue();
    });

    it('should enable everything when exceptions is empty', () => {
      const form = new FormGroup({
        x: new FormControl({ value: 1, disabled: true }),
        y: new FormControl({ value: 2, disabled: true }),
      });

      formFunctionEnAll(form);

      expect(form.get('x')!.enabled).toBeTrue();
      expect(form.get('y')!.enabled).toBeTrue();
    });
  });

  // ------------------------------------------------------
  // buttonFunctionEn
  // ------------------------------------------------------
  describe('buttonFunctionEn', () => {
    let btn1: HTMLButtonElement;
    let btn2: HTMLButtonElement;
    let btn3: HTMLButtonElement;

    beforeEach(() => {
      btn1 = document.createElement('button');
      btn1.id = 'b1';
      btn1.setAttribute('disabled', 'true'); // deshabilitado
      document.body.appendChild(btn1);

      btn2 = document.createElement('button');
      btn2.id = 'b2';
      btn2.setAttribute('disabled', 'true');
      document.body.appendChild(btn2);

      btn3 = document.createElement('button');
      btn3.id = 'b3';
      btn3.setAttribute('disabled', 'true');
      document.body.appendChild(btn3);
    });

    afterEach(() => {
      btn1.remove();
      btn2.remove();
      btn3.remove();
    });

    it('should remove disabled attribute from listed buttons except those in exceptions', () => {
      // b2 es excepción, debe permanecer deshabilitado
      buttonFunctionEn(['b1', 'b2', 'b3'], ['b2']);

      expect(document.getElementById('b1')!.hasAttribute('disabled')).toBeFalse();
      expect(document.getElementById('b2')!.getAttribute('disabled')).toBe('true');
      expect(document.getElementById('b3')!.hasAttribute('disabled')).toBeFalse();
    });

    it('should ignore non-existent ids gracefully', () => {
      expect(() => buttonFunctionEn(['ghost'], [])).not.toThrow();
    });

    it('should do nothing when button already enabled (no disabled attribute)', () => {
      const b4 = document.createElement('button');
      b4.id = 'b4';
      // no disabled
      document.body.appendChild(b4);

      expect(document.getElementById('b4')!.hasAttribute('disabled')).toBeFalse();

      buttonFunctionEn(['b4']);
      expect(document.getElementById('b4')!.hasAttribute('disabled')).toBeFalse();

      b4.remove();
    });
  });

});
