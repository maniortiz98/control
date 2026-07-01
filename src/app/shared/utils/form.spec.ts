
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { emptyField, validCombobox, markInvalidControls } from './form';

describe('Form utilities', () => {

  describe('emptyField', () => {

    it('should return true when at least one control has required error and mark only invalid controls as touched', () => {
      const form = new FormGroup({
        name: new FormControl('', Validators.required),
        age: new FormControl(20), // válido
        email: new FormControl('', Validators.required),
      });

      const logSpy = spyOn(console, 'log'); // evitar ruido en consola

      const result = emptyField(form);

      expect(result).toBeTrue();

      // Solo los inválidos deben estar tocados
      expect(form.get('name')!.touched).toBeTrue();
      expect(form.get('email')!.touched).toBeTrue();
      expect(form.get('age')!.touched).toBeFalse();

      // Se llamó console.log por cada control inválido
      expect(logSpy).toHaveBeenCalledWith('empty - ', 'name');
      expect(logSpy).toHaveBeenCalledWith('empty - ', 'email');
    });

    it('should return false when all controls are valid and do not mark them as touched', () => {
      const form = new FormGroup({
        name: new FormControl('John', Validators.required),
        age: new FormControl(20),
        email: new FormControl('test@test.com', Validators.required),
      });

      const logSpy = spyOn(console, 'log');

      const result = emptyField(form);

      expect(result).toBeFalse();

      // Nadie debe ser marcado como touched por la función
      expect(form.get('name')!.touched).toBeFalse();
      expect(form.get('age')!.touched).toBeFalse();
      expect(form.get('email')!.touched).toBeFalse();

      expect(logSpy).not.toHaveBeenCalled();
    });

    it('should ignore non-required invalidities (e.g., pattern) and still mark touched if invalid', () => {
      const form = new FormGroup({
        rfc: new FormControl('INVALID', [Validators.required, Validators.pattern(/^\d+$/)]), // inválido por pattern
        name: new FormControl('', Validators.required), // inválido por required
      });

      const logSpy = spyOn(console, 'log');

      // La función solo verifica hasError('required') para decidir si entra al marcado.
      // Como 'name' tiene required, se activa la lógica y marca cualquier control inválido (rfc también).
      const result = emptyField(form);

      expect(result).toBeTrue();
      expect(form.get('name')!.touched).toBeTrue();
      expect(form.get('rfc')!.touched).toBeTrue();

      expect(logSpy).toHaveBeenCalledWith('empty - ', 'name');
      expect(logSpy).toHaveBeenCalledWith('empty - ', 'rfc');
    });

    it('should handle empty form group (no controls)', () => {
      const form = new FormGroup({});
      const result = emptyField(form);
      expect(result).toBeFalse();
    });

  });

  describe('validCombobox', () => {

    it('should mark listed fields as touched when falsy/empty', () => {
      const form = new FormGroup({
        country: new FormControl(null),
        city: new FormControl(''),
        zip: new FormControl('01000'),
        notListed: new FormControl(null),
      });

      validCombobox(['country', 'city', 'zip'], form);

      expect(form.get('country')!.touched).toBeTrue(); // null -> touched
      expect(form.get('city')!.touched).toBeTrue();    // '' -> touched
      expect(form.get('zip')!.touched).toBeFalse();    // tiene valor -> no touched
      expect(form.get('notListed')!.touched).toBeFalse(); // no estaba en fields
    });

    it('should do nothing if fields array is empty', () => {
      const form = new FormGroup({
        a: new FormControl(null),
        b: new FormControl('value'),
      });

      validCombobox([], form);

      expect(form.get('a')!.touched).toBeFalse();
      expect(form.get('b')!.touched).toBeFalse();
    });

    it('should ignore non-existent field names gracefully', () => {
      const form = new FormGroup({
        a: new FormControl(null),
      });

      // 'b' no existe
      validCombobox(['a', 'b'], form);

      expect(form.get('a')!.touched).toBeTrue();
      // No debe lanzar error por 'b'
      expect(form.get('b')).toBeNull();
    });

  });

  describe('markInvalidControls', () => {

    it('should mark invalid controls as touched and return object with invalid fields and their values', () => {
      const form = new FormGroup({
        name: new FormControl('', Validators.required),     // inválido
        email: new FormControl('x@x.com', Validators.email),// válido
        age: new FormControl(-1, (ctrl) => ctrl.value >= 0 ? null : { min: true }), // inválido
      });

      const result = markInvalidControls(form);

      // name y age deben estar touched
      expect(form.get('name')!.touched).toBeTrue();
      expect(form.get('age')!.touched).toBeTrue();
      // email no está invalid -> no touched por la función
      expect(form.get('email')!.touched).toBeFalse();

      // Debe regresar mapa con los inválidos y sus valores
      expect(result).toEqual({
        name: '',
        age: -1,
      });
    });

    it('should return empty object when all controls are valid and not mark them as touched', () => {
      const form = new FormGroup({
        name: new FormControl('John', Validators.required),
        age: new FormControl(30),
      });

      const result = markInvalidControls(form);

      expect(result).toEqual({});
      expect(form.get('name')!.touched).toBeFalse();
      expect(form.get('age')!.touched).toBeFalse();
    });

    it('should skip null/undefined controls safely', () => {
      const form = new FormGroup({
        a: new FormControl('', Validators.required), // inválido
      });

      // Simular acceso a una key inexistente durante el loop
      const originalControls = (form as any).controls;
      (form as any).controls = {
        ...originalControls,
        ghost: undefined, // clave inexistente/control inesperado
      };

      const result = markInvalidControls(form);

      expect(result).toEqual({ a: '' });
      expect(form.get('a')!.touched).toBeTrue();
    });

  });

});
